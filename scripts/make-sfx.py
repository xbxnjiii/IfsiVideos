"""Génère les effets sonores de la série (100 % synthèse, aucun fichier externe).

Usage : python3 scripts/make-sfx.py  ->  écrit les .wav dans public/sfx/
"""
import math
import os
import random
import struct
import wave

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
random.seed(7)


def write(name, samples, gain=0.9):
    peak = max(1e-9, max(abs(s) for s in samples))
    k = gain / peak
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(
            b"".join(struct.pack("<h", int(max(-1.0, min(1.0, s * k)) * 32767)) for s in samples)
        )


def n(dur):
    return int(SR * dur)


def whoosh(dur=0.42):
    out, low, band = [], 0.0, 0.0
    for i in range(n(dur)):
        t = i / n(dur)
        fc = 300 + 3200 * math.sin(math.pi * t) ** 1.5
        f = 2 * math.sin(math.pi * fc / SR)
        x = random.uniform(-1, 1)
        high = x - low - 0.6 * band
        band += f * high
        low += f * band
        env = math.sin(math.pi * min(1.0, t * 1.15)) ** 2
        out.append(band * env)
    return out


def pop(dur=0.12):
    out, ph = [], 0.0
    for i in range(n(dur)):
        t = i / SR
        freq = 180 + 1100 * math.exp(-t * 45)
        ph += 2 * math.pi * freq / SR
        out.append(math.sin(ph) * math.exp(-t * 32))
    return out


def tick(dur=0.05):
    return [
        (math.sin(2 * math.pi * 2600 * i / SR) + 0.5 * math.sin(2 * math.pi * 1700 * i / SR))
        * math.exp(-(i / SR) * 160)
        for i in range(n(dur))
    ]


def impact(dur=0.7):
    out, ph, lp = [], 0.0, 0.0
    for i in range(n(dur)):
        t = i / SR
        freq = 42 + 110 * math.exp(-t * 9)
        ph += 2 * math.pi * freq / SR
        body = math.sin(ph) * math.exp(-t * 5.5)
        lp += 0.18 * (random.uniform(-1, 1) - lp)
        out.append(body + 0.6 * lp * math.exp(-t * 28))
    return out


def ding(dur=0.7):
    out = []
    for i in range(n(dur)):
        t = i / SR
        a = math.sin(2 * math.pi * 1318.5 * t) * math.exp(-t * 7)
        b = math.sin(2 * math.pi * 1975.5 * t) * math.exp(-t * 9) if t > 0.07 else 0.0
        out.append(a * 0.6 + b * 0.7)
    return out


def buzz(dur=0.38):
    out = []
    for i in range(n(dur)):
        t = i / SR
        gate = 1.0 if (t % 0.19) < 0.15 else 0.0
        sq = 1.0 if math.sin(2 * math.pi * 130 * t) > 0 else -1.0
        sq2 = 1.0 if math.sin(2 * math.pi * 137 * t) > 0 else -1.0
        out.append((sq + sq2) * 0.5 * gate * (1 - t / dur) ** 0.3)
    # adoucit le carré
    sm, lp = [], 0.0
    for s in out:
        lp += 0.25 * (s - lp)
        sm.append(lp)
    return sm


def heartbeat(dur=0.45):
    out = []
    for i in range(n(dur)):
        t = i / SR
        s = 0.0
        for start, amp in ((0.0, 1.0), (0.17, 0.75)):
            if t >= start:
                tt = t - start
                s += amp * math.sin(2 * math.pi * (48 + 40 * math.exp(-tt * 30)) * tt) * math.exp(-tt * 22)
        out.append(s)
    return out


def stamp(dur=0.25):
    out, lp = [], 0.0
    for i in range(n(dur)):
        t = i / SR
        lp += 0.3 * (random.uniform(-1, 1) - lp)
        out.append(lp * math.exp(-t * 40) + math.sin(2 * math.pi * 90 * t) * math.exp(-t * 18) * 0.8)
    return out


if __name__ == "__main__":
    write("whoosh.wav", whoosh())
    write("pop.wav", pop())
    write("tick.wav", tick())
    write("impact.wav", impact())
    write("ding.wav", ding(), gain=0.7)
    write("buzz.wav", buzz(), gain=0.6)
    write("heartbeat.wav", heartbeat())
    write("stamp.wav", stamp())
    print("SFX générés dans", os.path.abspath(OUT))
