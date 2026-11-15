"""Nettoie le schéma « L'anus et le cancer de l'anus » fourni par le propriétaire (demandé : pas d'annotations dans la
vidéo).

Retire le titre, les 5 étiquettes (rectum, canal anal, sphincter interne, sphincter externe, anus) avec leurs traits et
leurs points, le cadre « Focus », les légendes, les traits roses près de la tumeur et les encadrés (type, facteurs de
risque, à retenir, info).
- les étiquettes sont posées sur la graisse et les muscles des côtés : on garde la **bande centrale** (rectum, canal
  anal, sphincters, anus), qui s'efface en fondu sur les côtés (x 262 → 598) ;
- traits et points (bleu franc + anneau blanc) : comblés le long des plis du canal (vertical) ou par diffusion (le
  rectum et les muscles sont des dégradés) ;
- vue « cancer » : le coin haut droit, sous les traits roses, est repris en miroir du coin gauche.
Écrit -anatomie.png, -sain.png, -cancer.png (même repère 1536 × 1024).
Usage : python3 scripts/brand/clean_anus_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/anus/anus-cancer.webp'
DST = 'public/images/anus/anus-propre'

img = cv2.imread(SRC, cv2.IMREAD_COLOR).astype(float)  # BGR
H, W = img.shape[:2]
src = img.copy()
b, g, r = [src[:, :, i] for i in range(3)]
XX = np.arange(W)[None, :].repeat(H, 0)
YY = np.arange(H)[:, None].repeat(W, 1)


def rect(x0, y0, x1, y1):
    m = np.zeros((H, W), bool)
    m[max(0, y0):y1, max(0, x0):x1] = True
    return m


def grow(m, k):
    return cv2.dilate(m.astype(np.uint8), np.ones((k, k), np.uint8)) > 0


def walk(mask, y, x, dx, dy, sg):
    t = 1
    while True:
        xx = int(round(x + sg * dx * t))
        yy = int(round(y + sg * dy * t))
        if xx < 0 or yy < 0 or xx >= W or yy >= H:
            return min(W - 1, max(0, xx)), min(H - 1, max(0, yy)), t
        if not mask[yy, xx]:
            return xx, yy, t
        t += 1


def fill_along(mask, d, walk_mask):
    n_ = (d[0] ** 2 + d[1] ** 2) ** 0.5
    dx, dy = d[0] / n_, d[1] / n_
    out = img.copy()
    for y, x in zip(*np.nonzero(mask)):
        x0, y0, t0 = walk(walk_mask, y, x, dx, dy, 1)
        x1, y1, t1 = walk(walk_mask, y, x, dx, dy, -1)
        out[y, x] = (img[y0, x0] * t1 + img[y1, x1] * t0) / (t0 + t1)
    img[mask] = out[mask]


def inpaint(mask, rad=6):
    if mask.any():
        u8 = img.clip(0, 255).astype(np.uint8)
        img[:] = cv2.inpaint(u8, mask.astype(np.uint8) * 255, rad, cv2.INPAINT_TELEA).astype(float)


# 1. traits et points (bleu franc) + leur anneau blanc, hors des pastilles
BOXES = [rect(20, 125, 266, 250), rect(20, 375, 266, 530), rect(20, 555, 226, 700), rect(595, 475, 780, 630), rect(355, 735, 605, 855)]
inbox = np.zeros((H, W), bool)
for m in BOXES:
    inbox |= m
line_px = (b > 150) & (r < 90) & (b - r > 90) & (XX < 790) & (YY > 100)
lines = grow(line_px, 13) | (grow(line_px, 27) & (src.min(axis=2) > 170))
lines &= ~(inbox & (XX < 262))
canal = lines & rect(360, 470, 440, 560)
fill_along(canal, (0, 1), lines)  # les plis du canal anal sont verticaux
inpaint(lines & ~canal, 7)

# 2. la bande centrale, en fondu sur les côtés ; au-dessous de l'anus (y > 735), blanc en fondu
fade = (np.clip((XX - 262) / 30.0, 0, 1) * np.clip((598 - XX) / 30.0, 0, 1) * np.clip((750 - YY) / 25.0, 0, 1)).astype(np.float32)
fade[:, 790:] = 0
anat = img * fade[:, :, None] + 255 * (1 - fade[:, :, None])
anat[:100, :] = 255
out = anat.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
cv2.imwrite(DST + '-anatomie.png', out)

# 3. les deux vues du canal (sain / avec cancer)
spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1400) & (YY < 260)
focus = src.copy()
corner = grow(spark, 17) & rect(1400, 170, 1470, 260)
ys_, xs_ = np.nonzero(corner)
focus[ys_, xs_] = src[ys_, 2625 - xs_]  # miroir du coin gauche (axe x = 1312,5)
for name, (x0, y0, x1, y1) in (('sain', (830, 175, 1130, 365)), ('cancer', (1168, 175, 1462, 365))):
    one = np.full_like(focus, 255)
    m = rect(x0, y0, x1, y1) & (focus.min(axis=2) < 246) & ~(focus[:, :, 0] > focus[:, :, 2] + 8)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
    one[m] = focus[m]
    cv2.imwrite(DST + '-' + name + '.png', one.clip(0, 255).astype(np.uint8))
print('écrit', DST + '-anatomie.png, -sain.png, -cancer.png')
