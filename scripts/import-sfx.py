"""Bruitages réels (bruits du corps, objets) tirés de La Sonothèque (https://lasonotheque.org) : sons gratuits, libres de
droits, utilisables en projet commercial, attribution non obligatoire (mais appréciée). Les .wav sont versionnés dans
public/sfx/ : ce script ne sert qu'à les refaire (il retélécharge les MP3, coupe, met au même niveau).

Usage : python3 scripts/import-sfx.py  ->  public/sfx/<nom>.wav (44,1 kHz, mono, crête à -1 dBFS) + public/sfx/SOURCES.md
"""
import os
import subprocess
import tempfile
import urllib.request

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")

# nom, id La Sonothèque, titre, début (s), durée (s)
SOUNDS = [
    ("cough", "2185", "Toux homme #7 (quinte de 3 coups)", 0.0, 1.54),
    ("cough-1", "2181", "Toux homme #3 (un coup)", 0.0, 0.86),
    ("cough-2", "2186", "Toux homme #8 (deux coups)", 0.0, 0.80),
    ("gasp", "1103", "Homme essoufflé (4 respirations)", 0.70, 2.75),
    ("puff", "0044", "Vaporisateur #2 (une pression)", 0.0, 0.47),
    ("lighter", "2131", "Cigarette, allumage (briquet)", 0.0, 1.45),
    ("smoke", "2132", "Cigarette #1 (une bouffée)", 0.0, 1.82),
    ("blow", "1603", "Souffler fort #2", 0.30, 1.15),
    ("sigh", "1405", "Soupirer par la bouche", 0.40, 3.95),
    ("stairs", "3212", "Pas, escalier en bois #1 (montée)", 0.0, 4.0),
]


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


def peak_db(path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    for line in out.splitlines():
        if "max_volume" in line:
            return float(line.split("max_volume:")[1].split("dB")[0])
    return 0.0


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp()
    rows = []
    for name, sid, title, start, dur in SOUNDS:
        src = os.path.join(tmp, f"{sid}.mp3")
        urllib.request.urlretrieve(f"https://lasonotheque.org/UPLOAD/mp3/{sid}.mp3", src)
        cut = os.path.join(tmp, f"{name}.wav")
        fade = min(0.03, dur / 6)
        run("ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(dur), "-i", src, "-ac", "1", "-ar", "44100",
            "-af", f"afade=t=in:d=0.004,afade=t=out:st={dur - fade:.3f}:d={fade:.3f}", cut)
        gain = -1.0 - peak_db(cut)
        run("ffmpeg", "-v", "error", "-y", "-i", cut, "-af", f"volume={gain:.2f}dB", "-c:a", "pcm_s16le", os.path.join(OUT, f"{name}.wav"))
        rows.append(f"| `{name}.wav` | {title} | [{sid}](https://lasonotheque.org/search?q={sid}) | {start:.2f} s → {start + dur:.2f} s |")
        print("ok", name)
    with open(os.path.join(OUT, "SOURCES.md"), "w", encoding="utf-8") as f:
        f.write("# Bruitages réels\n\n")
        f.write("Tirés de [La Sonothèque](https://lasonotheque.org) (Joseph Sardin) : gratuits, libres de droits, usage commercial\n")
        f.write("autorisé, attribution non obligatoire. Refaits par `python3 scripts/import-sfx.py`. Les autres bruitages\n")
        f.write("(whoosh, pop, tick…) sont synthétisés par `scripts/make-sfx.py`.\n\n")
        f.write("| Fichier | Son | N° La Sonothèque | Extrait |\n| --- | --- | --- | --- |\n")
        f.write("\n".join(rows) + "\n")
