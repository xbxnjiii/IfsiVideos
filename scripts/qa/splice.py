#!/usr/bin/env python3
"""Recolle des portions recalculées dans une vidéo déjà rendue (retouches rapides, sans tout refaire).

Usage :
  npm run splice -- out/08-glycemie.mp4 seg1.mp4@563 seg2.mp4@1640

Chaque segment est un rendu Remotion de la même composition (`--frames=<début>-<fin>`), image ET son : il remplace
les images [début, début + durée du segment) de la vidéo d'origine. La vidéo est réécrite en place (h264 CRF 18,
yuv420p, AAC 320 k), la durée totale ne change pas. Les retouches de voix doivent garder le même minutage
(remplacer un mot dans son créneau) pour que le reste reste synchrone.
"""
import json
import os
import subprocess
import sys
import tempfile

FPS = 30


def probe_frames(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v", "-show_entries", "stream=nb_read_frames", "-of", "json", path],
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    return int(json.loads(out)["streams"][0]["nb_read_frames"])


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    base = sys.argv[1]
    segs = []
    for arg in sys.argv[2:]:
        path, start = arg.rsplit("@", 1)
        segs.append((int(start), path, probe_frames(path)))
    segs.sort()
    total = probe_frames(base)
    inputs = ["-i", base] + [x for _, p, _ in segs for x in ("-i", p)]
    parts, cursor, chains = [], 0, []
    for k, (start, _, n) in enumerate(segs, start=1):
        if start < cursor or start + n > total:
            raise SystemExit(f"segment {k} hors limites ou chevauchant : {start}+{n} (vidéo {total} images)")
        if start > cursor:
            parts.append((0, cursor, start))
        parts.append((k, 0, n))
        cursor = start + n
    if cursor < total:
        parts.append((0, cursor, total))
    # chaque morceau est coupé à l'image près, image ET son (le son AAC d'un segment dépasse un peu)
    for i, (src, a, b) in enumerate(parts):
        chains.append(
            f"[{src}:v]trim=start_frame={a}:end_frame={b},setpts=PTS-STARTPTS[v{i}];"
            f"[{src}:a]atrim=start={a / FPS}:end={b / FPS},asetpts=PTS-STARTPTS[a{i}]"
        )
    concat = "".join(f"[v{i}][a{i}]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=1:a=1[v][a]"
    tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False, dir=os.path.dirname(os.path.abspath(base))).name
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(chains) + ";" + concat, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", tmp],
        check=True,
    )
    after = probe_frames(tmp)
    if after != total:
        os.remove(tmp)
        raise SystemExit(f"nombre d'images différent ({after} au lieu de {total}) : vidéo d'origine conservée")
    os.replace(tmp, base)
    print(f"{base} : {len(segs)} portion(s) recollée(s), {total} images")


if __name__ == "__main__":
    main()
