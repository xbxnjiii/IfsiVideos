"""Allonge les blancs entre les parties d'une voix déjà générée (ElevenLabs lit tout le texte d'un coup et ne laisse
parfois que 0,3 s entre deux parties : la transition, 14 images, mordrait sur la voix). Insère du silence au milieu de
chaque blanc pour qu'il atteigne `cible_s` (0,8 s par défaut), puis relancer align_voice.py sur le fichier obtenu.
Usage : python3 scripts/voice/pad_parts.py voix.wav src/videos/<épisode>/voice.json voix-allongee.wav [cible_s]
(voice.json : un premier alignement, pour savoir où commence chaque partie)."""
import json, subprocess, sys
import numpy as np, soundfile as sf
src, vj, dst = sys.argv[1:4]
target = float(sys.argv[4]) if len(sys.argv) > 4 else 0.8
y, sr = sf.read(src)
res = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", "silencedetect=noise=-40dB:d=0.04", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(l.split("silence_start: ")[1].split()[0]) for l in res.splitlines() if "silence_start" in l]
en = [float(l.split("silence_end: ")[1].split()[0]) for l in res.splitlines() if "silence_end" in l]
sil = list(zip(st, en))
secs = json.load(open(vj))["sections"]
cuts = []
for s in secs[1:]:
    c = [(b - a, a, b) for a, b in sil if s["start"] - 0.8 <= b <= s["start"] + 0.45]
    if not c:
        print("pas de blanc avant", s["id"]); continue
    d, a, b = max(c)
    pad = max(0.0, target - d)
    cuts.append(((a + b) / 2, pad))
    print(f"{s['id']:12s} blanc {a:6.2f}-{b:6.2f} ({d:.2f} s) + {pad:.2f} s")
out, last = [], 0
for t, pad in cuts:
    i = int(t * sr)
    out += [y[last:i], np.zeros(int(pad * sr))]
    last = i
out.append(y[last:])
sf.write(dst, np.concatenate(out), sr)
print("durée", len(np.concatenate(out)) / sr)
