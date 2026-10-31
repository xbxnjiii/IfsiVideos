#!/usr/bin/env python3
"""Contrôle de la voix : langue détectée et transcription de chaque partie (faster-whisper, langue NON forcée), puis
de CHAQUE PHRASE : la voix multilingue prend parfois un accent étranger sur une phrase courte au milieu d'une partie
(« Verdict : hypoglycémie ! » en anglais, « Il se soulève, il redescend : un cycle. » avec un accent italien) alors que
la partie entière passe en « fr ». Corriger avec `npm run voice -- … --swap <partie> "phrase" "nouvelle phrase"`.

Usage : npm run check:voice -- <épisode> [--model medium] [--parts intro,serie]
Chaque ligne doit dire « fr » ; relire les mots clés (sigles, chiffres, « à jeun »…). Le modèle `small` se trompe
souvent sur l'orthographe ; en cas de doute sur un passage, relancer avec --model medium --parts <partie>.
Dépendance : pip install --break-system-packages faster-whisper
"""
import argparse
import json
import os
import subprocess
import tempfile

from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("episode")
ap.add_argument("--model", default="small")
ap.add_argument("--parts", default="")
a = ap.parse_args()
v = json.load(open(f"src/videos/{a.episode}/voice.json"))
wav = f"public/voix/{a.episode}/voix.wav"
want = set(filter(None, a.parts.split(",")))
model = WhisperModel(a.model, device="cpu", compute_type="int8")
for s in v["sections"]:
    if want and s["id"] not in want:
        continue
    tmp = tempfile.mktemp(suffix=".wav")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-ss", str(s["start"]), "-to", str(s["end"]), tmp], check=True)
    segs, info = model.transcribe(tmp, beam_size=5 if a.model != "small" else 1)
    text = " ".join(x.text.strip() for x in segs)
    flag = "" if info.language == "fr" else "   <<< PAS EN FRANÇAIS"
    print(f"{s['id']:12} {info.language} {info.language_probability:.2f} | {text}{flag}", flush=True)
    os.remove(tmp)
    # phrase par phrase (fin de phrase = . ! ? … ou fin de partie)
    words = [w for w in v["words"] if s["start"] - 1e-6 <= w["start"] <= s["end"] + 1e-6]
    sent = []
    for i, w in enumerate(words):
        sent.append(w)
        if w["text"].rstrip().endswith((".", "!", "?", "…")) or i == len(words) - 1:
            a0, a1 = sent[0]["start"] - 0.05, sent[-1]["end"] + 0.1
            if a1 - a0 >= 0.8:
                tmp = tempfile.mktemp(suffix=".wav")
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-ss", f"{max(0, a0):.3f}", "-to", f"{a1:.3f}", tmp], check=True)
                _, inf = model.transcribe(tmp, beam_size=1)
                os.remove(tmp)
                if inf.language != "fr" or inf.language_probability < 0.8:
                    t0 = a0 + 8 / 30
                    print(f"{'':12}   <<< phrase à {t0:.1f} s (vidéo) : {inf.language} {inf.language_probability:.2f} | {' '.join(x['text'] for x in sent)}", flush=True)
            sent = []
