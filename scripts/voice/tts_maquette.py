"""Voix MAQUETTE (temporaire) : synthèse vocale française + horodatage exact de chaque mot.

Usage :
  python3 scripts/voice/tts_maquette.py voix/02-constantes.tts.json <episode> \
      [--voice fr-FR-VivienneMultilingualNeural] [--rate -2%] [--gap 0.8]

Le fichier de script (JSON) liste les parties : [{"id": "intro", "text": "...", "rate": "-10%"}, ...]
(« rate » est optionnel : débit propre à une partie).
Dans le texte, {affiché|prononcé} permet d'afficher « SpO2 » tout en faisant dire « S P O 2 ».

Sorties (même format que scripts/voice/prepare_voice.py, pour la vraie voix plus tard) :
  public/voix/<episode>/voix.wav      voix assemblée, normalisée (-15 LUFS)
  src/videos/<episode>/voice.json     mots horodatés + début/fin de chaque partie

Dépendances : ffmpeg, `pip install edge-tts soundfile numpy`.
Voix : synthèse neuronale Microsoft Edge (gratuite, sans clé). À remplacer par la vraie voix.
"""
import argparse
import asyncio
import json
import os
import re
import ssl
import subprocess
import tempfile

import numpy as np
import soundfile as sf

import edge_tts
import edge_tts.communicate as _ec

# Derrière un proxy d'entreprise, utiliser le bundle de certificats système s'il est fourni.
_CA = os.environ.get("SSL_CERT_FILE")
if _CA:
    _ec._SSL_CTX = ssl.create_default_context(cafile=_CA)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SR = 48000


def parse(text):
    """-> (texte prononcé, [{display, a, b}]) où [a, b[ est la plage dans le texte prononcé."""
    spoken, tokens = "", []
    for m in re.finditer(r"\{([^|}]*)\|([^}]*)\}|(\S+)|(\s+)", text):
        if m.group(4):
            spoken += m.group(4)
            continue
        display, say = (m.group(1), m.group(2)) if m.group(1) is not None else (m.group(3), m.group(3))
        a = len(spoken)
        spoken += say
        tokens.append({"display": display, "a": a, "b": len(spoken)})
    return spoken, tokens


async def synth(text, voice, rate, out_mp3):
    com = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    words = []
    with open(out_mp3, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"text": chunk["text"], "start": chunk["offset"] / 1e7, "end": (chunk["offset"] + chunk["duration"]) / 1e7})
    return words


def align(spoken, tokens, bwords):
    """Rattache chaque mot horodaté au mot affiché correspondant (ponctuation incluse)."""
    low = spoken.lower()
    cursor = 0
    for w in bwords:
        i = low.find(w["text"].lower(), cursor)
        if i < 0:
            continue
        cursor = i + len(w["text"])
        for t in tokens:
            if t["a"] <= i < t["b"]:
                t.setdefault("start", w["start"])
                t["end"] = w["end"]
                break
    out = []
    for t in tokens:
        if "start" in t:
            out.append({"text": t["display"], "start": t["start"], "end": t["end"]})
        elif out:  # ponctuation isolée (« ? », « : ») : collée au mot précédent
            out[-1]["text"] += " " + t["display"]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("episode")
    ap.add_argument("--voice", default="fr-FR-DeniseNeural")
    ap.add_argument("--rate", default="+0%")
    ap.add_argument("--gap", type=float, default=0.85, help="respiration entre deux parties (s)")
    args = ap.parse_args()

    parts = json.load(open(args.script))
    tmp = tempfile.mkdtemp()
    audio, words, sections, t = [], [], [], 0.0
    for k, part in enumerate(parts):
        spoken, tokens = parse(part["text"])
        mp3 = os.path.join(tmp, f"{k}.mp3")
        bwords = asyncio.run(synth(spoken, args.voice, part.get("rate", args.rate), mp3))
        wav = os.path.join(tmp, f"{k}.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-ac", "1", "-ar", str(SR), wav], check=True)
        x, _ = sf.read(wav, dtype="float32")
        # on coupe le silence avant le 1er mot et après le dernier
        first, last = bwords[0]["start"], bwords[-1]["end"]
        a = max(0, int((first - 0.12) * SR))
        b = min(len(x), int((last + 0.12) * SR))
        x = x[a:b]
        shift = t - a / SR
        for w in align(spoken, tokens, bwords):
            words.append({"text": w["text"], "start": round(w["start"] + shift, 3), "end": round(w["end"] + shift, 3)})
        sections.append({"id": part["id"], "start": round(t + (first - a / SR), 3), "end": round(t + len(x) / SR, 3)})
        audio.append(x)
        t += len(x) / SR
        if k < len(parts) - 1:
            audio.append(np.zeros(int(args.gap * SR), np.float32))
            t += args.gap
        print(f"{part['id']:8s} {sections[-1]['start']:6.2f} -> {sections[-1]['end']:6.2f}")

    out_dir = os.path.join(ROOT, "public", "voix", args.episode)
    os.makedirs(out_dir, exist_ok=True)
    raw = os.path.join(tmp, "voix.wav")
    sf.write(raw, np.concatenate(audio), SR)
    final = os.path.join(out_dir, "voix.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=7", "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", final],
        check=True,
    )
    duration = sf.info(final).duration
    data = {"voice": f"MAQUETTE {args.voice} ({args.rate})", "duration": round(duration, 3), "sections": sections, "words": words}
    dst = os.path.join(ROOT, "src", "videos", args.episode, "voice.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    json.dump(data, open(dst, "w"), ensure_ascii=False, indent=1)
    print(f"voix maquette : {duration:.2f}s, {len(words)} mots -> {final}")


if __name__ == "__main__":
    main()
