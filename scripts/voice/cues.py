#!/usr/bin/env python3
"""Frames des mots, scène par scène (mêmes calculs que src/brand/timeline.ts → episodeTimeline).

Usage : npm run cues -- <épisode>            (lit src/videos/<épisode>/voice.json)
Affiche le début de chaque scène, sa durée, la durée totale, puis « mot:frame locale » = la valeur de at(scène, mot).
"""
import json
import sys

FPS, OFFSET, LEAD, PREROLL, TAIL, ENDCARD, MIN_TOTAL = 30, 8, 3, 0.25, 1.2, 2.6, 61 * 30

v = json.load(open(f"src/videos/{sys.argv[1]}/voice.json"))
off = OFFSET / FPS
secs = v["sections"]
starts = [0] + [round((s["start"] + off - PREROLL) * FPS) for s in secs[1:]]
end = round((secs[-1]["end"] + off + TAIL) * FPS)
total = max(MIN_TOTAL, end + round(ENDCARD * FPS))
print(f"scènes {starts} · logo {end} · total {total} images ({total / FPS:.1f} s)")
for i, s in enumerate(secs):
    nxt = starts[i + 1] if i + 1 < len(starts) else end
    words = [w for w in v["words"] if s["start"] - 0.01 <= w["start"] < s["end"]]
    print(f"\n{s['id']} (début {starts[i]}, {nxt - starts[i]} images) :")
    print(" ".join(f"{w['text']}:{round((w['start'] + off) * FPS) - starts[i] - LEAD}" for w in words))
