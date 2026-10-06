"""Voix déjà propre (IA type ElevenLabs, ou studio) : normalise le son et aligne le script mot à mot.

Usage :
  python3 scripts/voice/align_voice.py VOIX.mp3 voix/<script>.json <episode> [--model medium]

Le script JSON liste les parties [{"id": "intro", "text": "..."}, ...] avec le texte EXACT dit
(syntaxe {affiché|prononcé} acceptée, ex. {SpO2|S P O 2}). Whisper donne le timing, le script
donne l'orthographe : les animations se calent donc sur les bons mots même si Whisper se trompe.

Sorties (même format que tts_maquette.py) :
  public/voix/<episode>/voix.wav, src/videos/<episode>/voice.json
Dépendances : ffmpeg, `pip install faster-whisper soundfile`.
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import tempfile
import unicodedata

import soundfile as sf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
NUM = {"1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq", "6": "six", "7": "sept", "8": "huit", "9": "neuf"}


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = re.sub(r"[^a-z0-9']", "", w)
    return NUM.get(w, w)


def script_tokens(text):
    """Mots affichés du script (ponctuation isolée recollée au mot précédent)."""
    toks = []
    for m in re.finditer(r"\{([^|}]*)\|([^}]*)\}|(\S+)", text):
        disp = m.group(1) if m.group(1) is not None else m.group(3)
        if toks and not norm(disp):
            toks[-1] += " " + disp
        else:
            toks.append(disp)
    return toks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("script")
    ap.add_argument("episode")
    ap.add_argument("--model", default="medium")
    args = ap.parse_args()

    parts = json.load(open(args.script))
    out_dir = os.path.join(ROOT, "public", "voix", args.episode)
    os.makedirs(out_dir, exist_ok=True)
    final = os.path.join(out_dir, "voix.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", args.audio, "-af", "highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=9", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", final],
        check=True,
    )

    from faster_whisper import WhisperModel

    vocab = " ".join(p["text"] for p in parts)
    vocab = re.sub(r"\{([^|}]*)\|[^}]*\}", r"\1", vocab)
    tmp = os.path.join(tempfile.mkdtemp(), "v16.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", final, "-ac", "1", "-ar", "16000", tmp], check=True)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segs, _ = model.transcribe(tmp, language="fr", beam_size=5, word_timestamps=True, initial_prompt=vocab[:900])
    heard = []
    for s in segs:
        for w in s.words:
            t = w.word.strip()
            if heard and (t.startswith("'") or t.startswith("-")):
                heard[-1]["text"] += t
                heard[-1]["end"] = w.end
            else:
                heard.append({"text": t, "start": w.start, "end": w.end})

    # alignement script ↔ transcription
    script, owner = [], []
    for k, p in enumerate(parts):
        for t in script_tokens(p["text"]):
            script.append(t)
            owner.append(k)
    a = [norm(t) for t in script]
    b = [norm(h["text"]) for h in heard]
    times = [None] * len(script)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag in ("equal", "replace") and j2 > j1:
            n = i2 - i1
            for k in range(n):
                j = j1 + round(k * (j2 - j1) / max(1, n))
                j = min(j, j2 - 1)
                times[i1 + k] = (heard[j]["start"], heard[min(j2 - 1, j1 + round((k + 1) * (j2 - j1) / max(1, n)) - 1)]["end"])
    # mots non entendus : interpolés entre voisins
    for i in range(len(times)):
        if times[i] is None:
            prev = next((times[k][1] for k in range(i - 1, -1, -1) if times[k]), 0.0)
            nxt = next((times[k][0] for k in range(i + 1, len(times)) if times[k]), prev + 0.3)
            times[i] = (prev, max(prev + 0.05, nxt))
    words = [{"text": t, "start": s, "end": e} for t, (s, e) in zip(script, times)]
    # recalage sur l'énergie des débuts de partie : Whisper date mal le 1er mot après une pause.
    # On prend la pause la plus longue juste avant (ou autour) du mot, et le mot démarre à sa fin.
    res = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", final, "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"],
        capture_output=True,
        text=True,
    ).stderr
    st = [float(l.split("silence_start: ")[1].split()[0]) for l in res.splitlines() if "silence_start" in l]
    en = [float(l.split("silence_end: ")[1].split()[0]) for l in res.splitlines() if "silence_end" in l]
    pauses = list(zip(st, en))
    for k in range(1, len(parts)):
        i0 = owner.index(k)
        w0 = words[i0]["start"]
        cands = [(b - a, a, b) for a, b in pauses if w0 - 1.2 <= b <= w0 + 0.3]
        if not cands:
            continue
        _, a, b = max(cands)
        words[i0]["start"] = b
        words[i0]["end"] = max(words[i0]["end"], b + 0.1)
        words[i0 - 1]["end"] = min(words[i0 - 1]["end"], a)
    for w in words:
        w["start"], w["end"] = round(w["start"], 3), round(w["end"], 3)
    sections = []
    for k, p in enumerate(parts):
        idx = [i for i, o in enumerate(owner) if o == k]
        sections.append({"id": p["id"], "start": words[idx[0]]["start"], "end": words[idx[-1]]["end"]})
    dst = os.path.join(ROOT, "src", "videos", args.episode, "voice.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    data = {"voice": os.path.basename(args.audio), "duration": round(sf.info(final).duration, 3), "sections": sections, "words": words}
    json.dump(data, open(dst, "w"), ensure_ascii=False, indent=1)
    for s in sections:
        print(f"{s['id']:8s} {s['start']:6.2f} -> {s['end']:6.2f}")
    print(f"{len(words)} mots alignés -> {dst}")


if __name__ == "__main__":
    main()
