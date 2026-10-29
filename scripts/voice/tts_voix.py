"""Voix de la marque en UNE commande : synthèse edge-tts « Vivienne » + timing mot à mot exact.

Usage :
  python3 scripts/voice/tts_voix.py voix/<n>-<sujet>.script.json <episode>

Sorties : public/voix/<episode>/voix.wav (48 kHz, -15 LUFS) et src/videos/<episode>/voice.json
(même format qu'align_voice.py : sections + mots). Le timing vient directement de la synthèse
(événements WordBoundary) : pas de Whisper, pas d'erreur sur les nombres.

Le script JSON liste les parties [{"id": "intro", "text": "...", "pause": 0.55?}, ...] ; syntaxe
{affiché|prononcé} acceptée (ex. {bpm|B P M}) ; `pause` = silence après la partie (défaut 0,55 s).
Dépendances : ffmpeg, `pip install --break-system-packages edge-tts` (quelques secondes).
Pour une voix enregistrée (ElevenLabs, studio) : scripts/voice/align_voice.py.
"""
import asyncio
import difflib
import json
import os
import re
import ssl
import subprocess
import sys
import tempfile
import unicodedata
import wave

import edge_tts
import edge_tts.communicate as _ec

CA = "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):
    _ec._SSL_CTX = ssl.create_default_context(cafile=CA)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
VOICE = "fr-FR-VivienneMultilingualNeural"
RATE = "+8%"
SR = 24000
# chiffres que la synthèse lit mal : dits en toutes lettres
SPOKEN = {"24 heures": "vingt-quatre heures", "7 constantes": "sept constantes"}
NUM = {"1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq", "6": "six", "7": "sept", "8": "huit", "9": "neuf"}


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = re.sub(r"[^a-z0-9']", "", w)
    return NUM.get(w, w)


def script_tokens(text):
    """Mots affichés du script (ponctuation isolée recollée au mot précédent)."""
    toks = []
    for m in re.finditer(r"(\S*?)\{([^|}]*)\|([^}]*)\}(\S*)|(\S+)", text):
        # {affiché|prononcé}, éventuellement collé à une élision ou une ponctuation (« d'{AVC|A V C}. »)
        disp = m.group(1) + m.group(2) + m.group(4) if m.group(2) is not None else m.group(5)
        if toks and not norm(disp):
            toks[-1] += " " + disp
        else:
            toks.append(disp)
    return toks


async def synth(text, mp3):
    """Synthèse + frontières de mots [(début s, fin s, texte)] ; nouvel essai si le service ne répond pas."""
    for k in range(4):
        try:
            words = []
            with open(mp3, "wb") as f:
                async for c in edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary").stream():
                    if c["type"] == "audio":
                        f.write(c["data"])
                    elif c["type"] == "WordBoundary":
                        words.append((c["offset"] / 1e7, (c["offset"] + c["duration"]) / 1e7, c["text"]))
            return words
        except edge_tts.exceptions.NoAudioReceived:
            await asyncio.sleep(2 + 2 * k)
    raise SystemExit("échec de la synthèse : " + text[:60])


def split_groups(heard):
    """Le service regroupe parfois plusieurs mots (« entre 12 et 20 cycles ») : on répartit leur durée
    au prorata de la longueur prononcée (un nombre compte pour ses syllabes approximatives)."""
    out = []
    for s, e, text in heard:
        parts = text.split()
        if len(parts) == 1:
            out.append((s, e, text))
            continue
        w = [len(x) * 2.5 + 2 if x.isdigit() else len(x) for x in parts]
        t = s
        for x, k in zip(parts, w):
            d = (e - s) * k / sum(w)
            out.append((t, t + d, x))
            t += d
    return out


def align(tokens, heard):
    """Associe chaque mot affiché à un ou plusieurs mots prononcés (ex. « bpm » ↔ « B P M »)."""
    a = [norm(t) for t in tokens]
    b = [norm(h[2]) for h in heard]
    times = [None] * len(tokens)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag in ("equal", "replace") and j2 > j1:
            n = i2 - i1
            for k in range(n):
                ja = j1 + (k * (j2 - j1)) // n
                jb = j1 + ((k + 1) * (j2 - j1)) // n - 1
                times[i1 + k] = (heard[ja][0], heard[max(ja, jb)][1])
    for i in range(len(times)):
        if times[i] is None:  # mot non prononcé tel quel : entre ses voisins
            prev = next((times[k][1] for k in range(i - 1, -1, -1) if times[k]), 0.0)
            nxt = next((times[k][0] for k in range(i + 1, len(times)) if times[k]), prev + 0.3)
            times[i] = (prev, max(prev + 0.05, nxt))
    return times


def main():
    script, episode = sys.argv[1], sys.argv[2]
    parts = json.load(open(script))
    tmp = tempfile.mkdtemp()
    pcm = bytearray()
    words, sections = [], []
    for k, p in enumerate(parts):
        spoken = re.sub(r"\{([^|}]*)\|([^}]*)\}", r"\2", p["text"])
        for a, b in SPOKEN.items():
            spoken = spoken.replace(a, b)
        mp3, wav = f"{tmp}/p{k}.mp3", f"{tmp}/p{k}.wav"
        heard = split_groups(asyncio.run(synth(spoken, mp3)))
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", wav], check=True)
        with wave.open(wav) as w:
            data = w.readframes(w.getnframes())
        t0 = len(pcm) / 2 / SR
        toks = script_tokens(p["text"])
        for t, (s, e) in zip(toks, align(toks, heard)):
            words.append({"text": t, "start": round(t0 + s, 3), "end": round(t0 + e, 3)})
        sections.append({"id": p["id"], "start": words[-len(toks)]["start"], "end": words[-1]["end"]})
        pcm += data
        if k < len(parts) - 1:
            pcm += b"\0\0" * int(SR * p.get("pause", 0.55))
        print(f"{p['id']:8s} {sections[-1]['start']:6.2f} -> {sections[-1]['end']:6.2f}")
    raw = f"{tmp}/voix.wav"
    with wave.open(raw, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(pcm))
    out_dir = os.path.join(ROOT, "public", "voix", episode)
    os.makedirs(out_dir, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=9", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", f"{out_dir}/voix.wav"],
        check=True,
    )
    dst = os.path.join(ROOT, "src", "videos", episode, "voice.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    data = {"voice": "voix.wav (tts_voix.py)", "duration": round(len(pcm) / 2 / SR, 3), "sections": sections, "words": words}
    json.dump(data, open(dst, "w"), ensure_ascii=False, indent=1)
    print(f"{len(words)} mots -> {dst}")


if __name__ == "__main__":
    main()
