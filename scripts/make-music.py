"""Compose une musique de fond douce (nappe + arpège + basse), 100 % synthèse.

Usage :
  python3 scripts/make-music.py SORTIE.wav DUREE_S [--duck VOIX.wav --duck-delay 0.27]

--duck baisse automatiquement la musique quand la voix parle (sidechain via ffmpeg).
Dépendances : numpy, soundfile, ffmpeg.
"""
import argparse
import os
import subprocess
import tempfile

import numpy as np
import soundfile as sf

SR = 44100
BPM = 92
BEAT = 60 / BPM
rng = np.random.default_rng(3)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# Am9 – Fmaj7 – C(add9) – G6, 2 mesures chacun
CHORDS = [
    [57, 60, 64, 67, 71],
    [53, 57, 60, 64, 69],
    [48, 55, 60, 62, 64],
    [55, 59, 62, 64, 67],
]
BASS = [45, 41, 48, 43]
BAR = 4 * BEAT
CHORD_LEN = 2 * BAR


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def pad_note(f, dur):
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for det in (-0.12, 0.0, 0.12):
        ff = f * 2 ** (det / 12)
        for h in range(1, 7):
            s += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) * (0.55 ** (h - 1)) / h
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.18 * t + rng.uniform(0, 6.28))
    return s * lfo * env_adsr(len(t), 1.6, 1.8)


def pluck(f, dur=1.4):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 9)
    return s * np.exp(-t * 3.2) * np.minimum(1, t / 0.004)


def bass(f, dur):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return s * env_adsr(len(t), 0.08, 0.6) * (0.75 + 0.25 * np.exp(-((t % BEAT) * 5)))


def reverb(x, seconds=2.6, mix=0.32):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir[: int(0.012 * SR)] = 0
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet * 0.6


def compose(duration):
    n = int((duration + 3) * SR)
    pad = np.zeros(n)
    arp = np.zeros(n)
    low = np.zeros(n)
    t0, i = 0.0, 0
    while t0 < duration + 1:
        chord = CHORDS[i % 4]
        start = int(t0 * SR)
        for note in chord:
            p = pad_note(midi(note), CHORD_LEN + 1.8) * 0.16
            end = min(n, start + len(p))
            pad[start:end] += p[: end - start]
        b = bass(midi(BASS[i % 4] - 12), CHORD_LEN) * 0.32
        end = min(n, start + len(b))
        low[start:end] += b[: end - start]
        # arpège en croches, motif montant/descendant
        pattern = [0, 2, 3, 4, 3, 2, 1, 2]
        for k in range(16):
            note = chord[pattern[k % 8]] + 12
            s = int((t0 + k * BEAT / 2) * SR)
            pl = pluck(midi(note)) * (0.10 if k % 2 == 0 else 0.07)
            e = min(n, s + len(pl))
            if s < n:
                arp[s:e] += pl[: e - s]
        t0 += CHORD_LEN
        i += 1
    mix = pad + low + reverb(arp, mix=0.4)
    mix = reverb(mix, seconds=1.8, mix=0.18)
    # fondu d'entrée et de sortie
    total = int(duration * SR)
    mix = mix[:total]
    mix[: int(1.2 * SR)] *= np.linspace(0, 1, int(1.2 * SR))
    mix[-int(2.5 * SR) :] *= np.linspace(1, 0, int(2.5 * SR))
    left = mix
    right = np.roll(mix, int(0.011 * SR))
    st = np.stack([left, right], axis=1)
    return st / np.max(np.abs(st)) * 0.8


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("duration", type=float)
    ap.add_argument("--duck")
    ap.add_argument("--duck-delay", type=float, default=0.0)
    args = ap.parse_args()
    tmp = tempfile.mkdtemp()
    raw = os.path.join(tmp, "music.wav")
    sf.write(raw, compose(args.duration), SR)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    if args.duck:
        ms = int(args.duck_delay * 1000)
        filt = (
            f"[1:a]aformat=channel_layouts=stereo,aresample={SR},adelay={ms}|{ms},apad=whole_dur={args.duration}[v];"
            "[0:a]loudnorm=I=-20:TP=-3,aresample=44100[m];"
            "[m][v]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=500:makeup=1[out]"
        )
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-i", args.duck, "-filter_complex", filt, "-map", "[out]", "-t", str(args.duration), args.out],
            check=True,
        )
    else:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-24:TP=-3", args.out], check=True)
    print("musique ->", args.out)


if __name__ == "__main__":
    main()
