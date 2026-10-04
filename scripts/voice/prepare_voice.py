"""Prépare une voix off pour une vidéo : enlève les blancs, nettoie le son, transcrit mot à mot.

Usage :
  python3 scripts/voice/prepare_voice.py ENREGISTREMENT.m4a EPISODE \
      --sections "Première,deuxième,troisième,quatrième,enfin,Alors" \
      [--cut 59.17:61.60] [--model medium] [--prompt "vocabulaire du sujet"]

Sorties :
  public/voix/EPISODE/voix.wav       voix montée, nettoyée, normalisée (-15 LUFS)
  src/videos/EPISODE/voice.json      mots horodatés + début de chaque partie

Dépendances : ffmpeg, et `pip install faster-whisper soundfile numpy`.
"""
import argparse
import json
import os
import subprocess
import tempfile

import numpy as np
import soundfile as sf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Durée gardée (s) selon la longueur du blanc d'origine.
GAP_START = 0.05  # avant le premier mot
GAP_SECTION = 0.60  # entre deux parties (laisse le temps à la transition)
GAP_SENTENCE = 0.24  # respiration entre deux phrases
GAP_MICRO = 0.16  # micro-pause dans une phrase
GAP_END = 0.25
THRESHOLD_DB = -42
MIN_SPEECH = 0.12  # un « son » plus court, isolé dans un blanc, est un bruit (clic, souffle)

FILTERS = (
    "highpass=f=80,lowpass=f=14000,afftdn=nf=-32:nr=8,"
    "acompressor=threshold=-22dB:ratio=3:attack=4:release=90:makeup=2,"
    "loudnorm=I=-15:TP=-1.5:LRA=7"
)


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def speech_mask(x, sr, cuts):
    hop = int(0.01 * sr)
    frames = len(x) // hop
    rms = np.sqrt(np.mean(x[: frames * hop].reshape(frames, hop) ** 2, axis=1))
    db = 20 * np.log10(np.maximum(rms, 1e-9))
    mask = db > THRESHOLD_DB
    # supprime les sons trop courts isolés au milieu d'un long blanc (clic, souffle)
    on = np.where(mask)[0]
    i = 0
    while i < frames:
        if mask[i]:
            j = i
            while j < frames and mask[j]:
                j += 1
            prev = on[on < i]
            nxt = on[on >= j]
            quiet_before = (i - prev[-1]) / 100 if len(prev) else 99
            quiet_after = (nxt[0] - j) / 100 if len(nxt) else 99
            if (j - i) / 100 < MIN_SPEECH and quiet_before > 0.5 and quiet_after > 0.5:
                mask[i:j] = False
            i = j
        else:
            i += 1
    # 60 ms de marge autour de la parole
    grown = mask.copy()
    for k in np.where(mask)[0]:
        grown[max(0, k - 6) : k + 7] = True
    for a, b in cuts:
        grown[int(a * 100) : int(b * 100)] = False
    return grown, frames


def silence_runs(mask, frames):
    runs, i = [], 0
    while i < frames:
        if not mask[i]:
            j = i
            while j < frames and not mask[j]:
                j += 1
            runs.append((i / 100, j / 100))
            i = j
        else:
            i += 1
    return runs


def edit(x, sr, cuts):
    mask, frames = speech_mask(x, sr, cuts)
    total = len(x) / sr
    segs, cursor = [], 0.0
    for a, b in silence_runs(mask, frames):
        d = b - a
        hard = any(a <= c0 + 0.01 <= b for c0, _ in cuts)
        if a == 0.0:
            cursor = max(0.0, b - GAP_START)
            continue
        if b >= frames / 100 - 0.01:
            segs.append((cursor, min(total, a + GAP_END)))
            cursor = None
            break
        t = GAP_SECTION if (hard or d >= 1.0) else GAP_SENTENCE if d >= 0.45 else min(d, GAP_MICRO) if d >= 0.15 else d
        if hard:
            segs.append((cursor, a))
            cursor = b - t
        else:
            segs.append((cursor, a + t / 2))
            cursor = b - t / 2
    if cursor is not None:
        segs.append((cursor, total))
    fade = int(0.008 * sr)
    out = []
    for a, b in segs:
        piece = x[int(a * sr) : int(b * sr)].copy()
        if len(piece) > 2 * fade:
            piece[:fade] *= np.linspace(0, 1, fade)
            piece[-fade:] *= np.linspace(1, 0, fade)
        out.append(piece)
    return np.concatenate(out)


def transcribe(path, model_size, prompt=None):
    from faster_whisper import WhisperModel

    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segs, _ = model.transcribe(path, language="fr", word_timestamps=True, beam_size=5, initial_prompt=prompt)
    words = []
    for s in segs:
        for w in s.words:
            text = w.word.strip()
            # recolle « c » + « 'est », « étudiant » + « -infirmier »…
            if words and (text.startswith("'") or text.startswith("-")):
                words[-1]["text"] += text
                words[-1]["end"] = round(w.end, 3)
            else:
                words.append({"text": text, "start": round(w.start, 3), "end": round(w.end, 3)})
    return words


def pauses(path):
    res = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-af", "silencedetect=noise=-40dB:d=0.18", "-f", "null", "-"],
        capture_output=True,
        text=True,
    ).stderr
    starts = [float(l.split("silence_start: ")[1].split()[0]) for l in res.splitlines() if "silence_start" in l]
    ends = [float(l.split("silence_end: ")[1].split()[0]) for l in res.splitlines() if "silence_end" in l]
    return [{"start": round(a, 3), "end": round(b, 3)} for a, b in zip(starts, ends)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("episode")
    ap.add_argument("--sections", required=True, help="premier mot de chaque partie (après l'intro)")
    ap.add_argument("--cut", action="append", default=[], help="passage à retirer, en secondes : 59.17:61.60")
    ap.add_argument("--model", default="medium")
    ap.add_argument("--prompt", default=None, help="vocabulaire du sujet, aide la reconnaissance")
    args = ap.parse_args()

    cuts = [tuple(float(v) for v in c.split(":")) for c in args.cut]
    tmp = tempfile.mkdtemp()
    raw = os.path.join(tmp, "raw.wav")
    run(["ffmpeg", "-y", "-i", args.audio, "-ac", "1", "-ar", "48000", "-c:a", "pcm_f32le", raw])
    x, sr = sf.read(raw, dtype="float32")
    edited = os.path.join(tmp, "edit.wav")
    sf.write(edited, edit(x, sr, cuts), sr, subtype="FLOAT")

    out_dir = os.path.join(ROOT, "public", "voix", args.episode)
    os.makedirs(out_dir, exist_ok=True)
    final = os.path.join(out_dir, "voix.wav")
    run(["ffmpeg", "-y", "-i", edited, "-af", FILTERS, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", final])

    words = transcribe(final, args.model, args.prompt)
    gaps = pauses(final)
    duration = sf.info(final).duration
    sections = []
    remaining = [s.strip() for s in args.sections.split(",")]
    for i, w in enumerate(words):
        if remaining and w["text"].strip(",.?!") == remaining[0]:
            # la transition démarre au début du blanc qui précède la partie
            before = [g for g in gaps if g["end"] <= w["start"] + 0.35 and g["end"] >= w["start"] - 1.2]
            cut = before[-1]["start"] + 0.12 if before else w["start"] - 0.3
            sections.append({"word": remaining.pop(0), "at": round(cut, 3), "speech": w["start"]})
    if remaining:
        raise SystemExit(f"Mots de section introuvables : {remaining}")

    data = {"duration": round(duration, 3), "sections": sections, "words": words, "pauses": gaps}
    dst = os.path.join(ROOT, "src", "videos", args.episode, "voice.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    json.dump(data, open(dst, "w"), ensure_ascii=False, indent=1)
    print(f"voix : {len(x) / sr:.2f}s -> {duration:.2f}s  |  {len(words)} mots  |  sections : " + ", ".join(f"{s['word']}@{s['at']}" for s in sections))


if __name__ == "__main__":
    main()
