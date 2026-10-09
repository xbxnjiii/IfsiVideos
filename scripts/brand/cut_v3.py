"""Découpe une planche v3 DÉJÀ détourée en personnages séparés (même quand ils se touchent).

Usage : python3 cut_v3.py planches-v3.json <planche> planche_origine.webp planche_x4.png dossier_png [debug.png]
  - les points d'ancrage du catalogue (pixels de l'origine) « inondent » la silhouette : chaque pixel
    revient au point le plus proche en restant dans la silhouette (ligne de partage = zone de contact) ;
    plusieurs points par personnage (visage, chignon, objet) pour que les contacts soient bien partagés ;
  - les éléments détachés (?, zzz, flocons, éclairs…) rejoignent le personnage le plus proche (< 50 px) ;
  - la carte des personnages est agrandie ×4 et appliquée à la version agrandie (bords nets).
Dépendances : numpy, scipy, scikit-image, pillow.
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.segmentation import expand_labels, watershed

cat_path, sheet, src, src4, out = sys.argv[1:6]
debug = sys.argv[6] if len(sys.argv) > 6 else None
cat = json.load(open(cat_path))
items = cat[sheet]
dy_top, dy_bot = cat.get('_extra', {}).get(sheet, [0, 0])
rgba = np.asarray(Image.open(src).convert('RGBA'))
alpha = rgba[..., 3]
mask = alpha > 10
H, W = mask.shape

markers = np.zeros((H, W), np.int32)
# point d'ancrage hors silhouette → pixel de silhouette le plus proche
_, (iy, ix) = ndimage.distance_transform_edt(~mask, return_indices=True)
for n, (_, seeds, *_opt) in enumerate(items, start=1):
    x0, y0 = seeds[0]
    extra = [[x0, y0 + dy] for dy in (dy_top, dy_bot) if dy]
    for x, y in seeds + extra:
        x, y = min(W - 1, max(0, x)), min(H - 1, max(0, y))
        if not mask[y, x] and extra and [x, y] in extra:
            continue
        y, x = iy[y, x], ix[y, x]
        markers[max(0, y - 2):y + 3, max(0, x - 2):x + 3] = n
markers[~mask] = 0
labels = watershed(np.zeros((H, W), np.float32), markers, mask=mask)

# bandes de contact entre rangées : les blocs de cheveux (chignons) vont au personnage du dessous
bands = cat.get('_bands', {}).get(sheet, [])
if bands:
    rgb = rgba[..., :3].astype(np.int32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    hair = (r >= 60) & (r <= 190) & (r - g > 22) & (g - b > 10) & (b <= 110)
    first = [it[1][0] for it in items]
    row_of = lambda y: sum(1 for b0, b1 in bands if y > (b0 + b1) / 2)
    rows = [row_of(y) for _, y in first]
    for k_band, (b0, b1) in enumerate(bands):
        down = [n for n in range(len(items)) if rows[n] == k_band + 1]
        if not down:
            continue
        zone = np.zeros_like(mask)
        zone[b0:b1] = mask[b0:b1] & hair[b0:b1]
        zone = ndimage.binary_closing(zone, iterations=1) & mask
        blobs, nb = ndimage.label(zone, structure=np.ones((3, 3)))
        for c in range(1, nb + 1):
            pix = blobs == c
            if pix.sum() < 30:
                continue
            # le chignon revient au personnage du dessous dont un point d'ancrage est le plus proche
            ys_, xs_ = np.nonzero(pix)
            cy, cx = ys_.mean(), xs_.mean()
            labels[pix] = 1 + min(down, key=lambda n: min((sx - cx) ** 2 + (sy - cy) ** 2 for sx, sy in items[n][1]))

    # bas de tunique du dessus resté collé au personnage du dessous : il revient à celui du dessus
    for k_band, (b0, b1) in enumerate(bands):
        up = set(n + 1 for n in range(len(items)) if rows[n] == k_band)
        down = set(n + 1 for n in range(len(items)) if rows[n] == k_band + 1)
        for _ in range(12):
            changed = 0
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nb = np.roll(np.roll(labels, dy, 0), dx, 1)
                sel = np.zeros_like(mask)
                sel[b0:b1] = True
                sel &= mask & ~hair & np.isin(labels, list(down)) & np.isin(nb, list(up))
                labels[sel] = nb[sel]
                changed += int(sel.sum())
            if not changed:
                break

# éléments détachés : rattachés au personnage le plus proche
orphan = mask & (labels == 0)
comp, k = ndimage.label(orphan, structure=np.ones((3, 3)))
dist, (ny, nx) = ndimage.distance_transform_edt(labels == 0, return_indices=True)
for c in range(1, k + 1):
    pix = comp == c
    if dist[pix].min() > 50:
        continue
    near = labels[ny[pix], nx[pix]]
    near = near[near > 0]
    if near.size:
        labels[pix] = np.bincount(near).argmax()
# rectangles limites (contacts très serrés)
for n, it in enumerate(items, start=1):
    if len(it) > 2 and 'clip' in it[2]:
        cx0, cy0, cx1, cy1 = it[2]['clip']
        out_ = np.ones((H, W), bool)
        out_[cy0:cy1, cx0:cx1] = False
        labels[(labels == n) & out_] = 0
labels = expand_labels(labels, 2)
labels[alpha == 0] = 0

if debug:
    rng = np.random.default_rng(1)
    pal = rng.integers(60, 255, (len(items) + 1, 3)); pal[0] = (30, 30, 45)
    im = pal[labels].astype(np.uint8)
    Image.fromarray(im).save(debug)

big = Image.open(src4).convert('RGBA')
S = big.width // W
big = np.asarray(big)
lab4 = np.repeat(np.repeat(labels, S, axis=0), S, axis=1)
os.makedirs(out, exist_ok=True)
for n, (key, *_rest) in enumerate(items, start=1):
    a = big[..., 3] * (lab4 == n)
    ys, xs = np.nonzero(a > 8)
    if not len(ys):
        print('VIDE', key); continue
    m = 6
    y0, y1 = max(0, ys.min() - m), min(big.shape[0], ys.max() + m + 1)
    x0, x1 = max(0, xs.min() - m), min(big.shape[1], xs.max() + m + 1)
    crop = big[y0:y1, x0:x1].copy()
    crop[..., 3] = a[y0:y1, x0:x1]
    # poussières (quelques pixels) retirées ; les éléments voulus (?, zzz, confettis) sont bien plus gros
    comp, nc = ndimage.label(crop[..., 3] > 20, structure=np.ones((3, 3)))
    if nc > 1:
        sizes = ndimage.sum(np.ones(comp.shape), comp, range(1, nc + 1))
        for c, sz in enumerate(sizes, start=1):
            if sz < max(60, sizes.max() * 0.003):
                crop[comp == c, 3] = 0
    path = os.path.join(out, key + '.png')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(crop, 'RGBA').save(path)
print(sheet, len(items), 'personnages')
