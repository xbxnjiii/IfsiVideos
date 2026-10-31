#!/usr/bin/env python3
"""Contrôle de la voix : langue détectée et transcription de chaque partie (faster-whisper, langue NON forcée).

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
