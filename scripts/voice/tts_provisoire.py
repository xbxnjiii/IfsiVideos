"""Voix PROVISOIRE d'un script (synthèse edge-tts, gratuite) pour caler l'animation en attendant la vraie voix.

Usage :
  python3 scripts/voice/tts_provisoire.py voix/<script>.json <dossier_sortie>
  python3 scripts/voice/align_voice.py <dossier_sortie>/voix-provisoire.wav voix/<script>.json <episode>

Une partie du script = une synthèse, puis montage avec 0,55 s de pause entre les parties. Syntaxe
{affiché|prononcé} respectée (on prononce la 2e forme). Quand la vraie voix (ElevenLabs) arrive :
relancer align_voice.py sur le MP3 fourni, toute la vidéo se recale (animations calées sur les mots).
Dépendances : ffmpeg, `pip install edge-tts`. Derrière le proxy du conteneur : CA /root/.ccr/ca-bundle.crt.
"""
import asyncio
import json
import os
import re
import ssl
import subprocess
import sys

import edge_tts
import edge_tts.communicate as _ec

CA = "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):
    _ec._SSL_CTX = ssl.create_default_context(cafile=CA)

VOICE = "fr-FR-VivienneMultilingualNeural"
# chiffres dits en toutes lettres (la synthèse lit mal « 24 heures », « 7 constantes »)
SPOKEN = {"24 heures": "vingt-quatre heures", "7 constantes": "sept constantes"}


async def say(text, path):
    for k in range(4):
        try:
            await edge_tts.Communicate(text, VOICE, rate="+8%").save(path)
            return
        except edge_tts.exceptions.NoAudioReceived:
            await asyncio.sleep(2 + 2 * k)
    raise SystemExit("échec de la synthèse : " + text[:60])


def main():
    script, out = sys.argv[1], os.path.abspath(sys.argv[2])
    os.makedirs(out, exist_ok=True)
    parts = json.load(open(script))
    gap = f"{out}/gap.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.55", gap], check=True)
    lst = f"{out}/list.txt"
    with open(lst, "w") as f:
        for k, p in enumerate(parts):
            text = re.sub(r"\{([^|}]*)\|([^}]*)\}", r"\2", p["text"])
            for a, b in SPOKEN.items():
                text = text.replace(a, b)
            mp3, wav = f"{out}/p{k}.mp3", f"{out}/p{k}.wav"
            asyncio.run(say(text, mp3))
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-ar", "24000", "-ac", "1", wav], check=True)
            f.write(f"file '{wav}'\n")
            if k < len(parts) - 1:
                f.write(f"file '{gap}'\n")
            print(p["id"], "ok")
    final = f"{out}/voix-provisoire.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c:a", "pcm_s16le", final], check=True)
    print("->", final)


if __name__ == "__main__":
    main()
