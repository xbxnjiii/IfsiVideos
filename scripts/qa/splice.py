#!/usr/bin/env python3
"""Recolle des portions recalculées dans une vidéo déjà rendue (retouches rapides, sans tout refaire).

Usage :
  npm run splice -- out/08-glycemie.mp4 seg1.mp4@563 seg2.mp4@1640
  npm run splice -- out/07-tension-arterielle.mp4 tete.mp4@0:100

Chaque segment est un rendu Remotion de la même composition (`--frames=<début>-<fin>`), image ET son : `seg@début`
remplace les images [début, début + durée du segment) de la vidéo d'origine (durée inchangée) ; `seg@début:fin`
remplace les images [début, fin) par tout le segment, quelle que soit sa durée (ex. nouvelle accroche plus longue :
la suite de l'ancienne vidéo est gardée telle quelle, voir `npm run voice -- … --only intro`). La vidéo est réécrite
en place (h264 CRF 18, yuv420p, AAC 320 k) et le nombre d'images final est vérifié.
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
        path, rng = arg.rsplit("@", 1)
        n = probe_frames(path)
        start, _, end = rng.partition(":")
        segs.append((int(start), int(end) if end else int(start) + n, path, n))
    segs.sort()
    total = probe_frames(base)
    expected = total + sum(n - (end - start) for start, end, _, n in segs)
    inputs = ["-i", base] + [x for _, _, p, _ in segs for x in ("-i", p)]
    parts, cursor, chains = [], 0, []
    for k, (start, end, _, n) in enumerate(segs, start=1):
        if start < cursor or end > total or end < start:
            raise SystemExit(f"segment {k} hors limites ou chevauchant : [{start}, {end}) (vidéo {total} images)")
        if start > cursor:
            parts.append((0, cursor, start))
        parts.append((k, 0, n))
        cursor = end
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
    if after != expected:
        os.remove(tmp)
        raise SystemExit(f"nombre d'images différent ({after} au lieu de {expected}) : vidéo d'origine conservée")
    os.replace(tmp, base)
    print(f"{base} : {len(segs)} portion(s) recollée(s), {after} images")


if __name__ == "__main__":
    main()
