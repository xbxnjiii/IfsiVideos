"""Nettoie les restes de découpe des bustes de la mascotte (planche v2).

Supprime les petits fragments qui touchent le bord de l'image (morceaux de la tuile ou du
dessin voisin) et les poussières de quelques pixels. Les éléments voulus (cœurs, ampoule, zzz,
confettis) sont plus gros et ne touchent pas le bord : ils sont conservés.

Usage : python3 scripts/brand/clean_strays.py public/brand/mascotte-v2
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

root = sys.argv[1]
manifest = json.load(open(os.path.join(root, "manifest.json")))
for key in manifest:
    if key.split("/")[0] not in ("expressions", "gestes", "situations", "accessoires"):
        continue
    path = os.path.join(root, key + ".webp")
    im = Image.open(path).convert("RGBA")
    a = np.array(im)
    alpha = a[:, :, 3] > 20
    lab, n = ndimage.label(alpha, structure=np.ones((3, 3)))
    if n <= 1:
        continue
    sizes = ndimage.sum(alpha, lab, range(1, n + 1))
    main = sizes.max()
    H, W = alpha.shape
    removed = 0
    for i, s in enumerate(sizes, 1):
        if s == main:
            continue
        ys, xs = np.where(lab == i)
        touches = ys.min() <= 3 or xs.min() <= 3 or xs.max() >= W - 4
        if s < 8 or (touches and s < main * 0.02):
            a[lab == i, 3] = 0
            removed += 1
    if removed:
        Image.fromarray(a).save(path, "WEBP", quality=92, method=6)
        print(f"{key}: {removed} fragment(s) retiré(s)")
