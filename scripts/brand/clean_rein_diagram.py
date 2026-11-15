"""Nettoie le schéma « Le rein et le cancer du rein » fourni par le propriétaire (demandé : pas d'annotations dans la
vidéo).

Retire le titre, les 6 étiquettes (glande surrénale, rein, bassinet, artère rénale, veine rénale, uretère) avec leurs
traits et leurs points, le cadre « Focus », les légendes, les traits roses près de la tumeur et l'encadré d'info.
- pastilles sur le fond blanc : comblées de haut en bas avec les seuls pixels blancs ;
- traits et points : reconnus à leur bleu saturé (la veine rénale, bleue elle aussi, est plus claire), comblés en travers
  du trait, ou le long du vaisseau qu'ils croisent (veine) ;
Écrit -anatomie.png (surrénale, rein en coupe, vaisseaux, uretère) et chaque rein seul : -sain.png, -cancer.png.
Usage : python3 scripts/brand/clean_rein_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/rein/rein-cancer.webp'
DST = 'public/images/rein/rein-propre'

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


def directional(mask, d):
    n = (d[0] ** 2 + d[1] ** 2) ** 0.5
    dx, dy = d[0] / n, d[1] / n
    out = img.copy()
    for y, x in zip(*np.nonzero(mask)):
        x0, y0, t0 = walk(mask, y, x, dx, dy, 1)
        x1, y1, t1 = walk(mask, y, x, dx, dy, -1)
        out[y, x] = (img[y0, x0] * t1 + img[y1, x1] * t0) / (t0 + t1)
    img[mask] = out[mask]


def is_bg(c):
    return c.min() > 232


def directional_bg(mask, d):
    """Comble avec les seuls pixels de fond (blanc) trouvés de chaque côté ; renvoie les pixels restés sans fond."""
    n = (d[0] ** 2 + d[1] ** 2) ** 0.5
    dx, dy = d[0] / n, d[1] / n
    out = img.copy()
    left = np.zeros((H, W), bool)
    for y, x in zip(*np.nonzero(mask)):
        got = []
        for sg in (1, -1):
            xx, yy, t = walk(mask, y, x, dx, dy, sg)
            if is_bg(img[yy, xx]):
                got.append((img[yy, xx], t))
        if len(got) == 2:
            (c0, t0), (c1, t1) = got
            out[y, x] = (c0 * t1 + c1 * t0) / (t0 + t1)
        elif len(got) == 1:
            out[y, x] = got[0][0]
        else:
            left[y, x] = True
    keep = mask & ~left
    img[keep] = out[keep]
    return left


def inpaint(mask, rad=6):
    if mask.any():
        u8 = img.clip(0, 255).astype(np.uint8)
        img[:] = cv2.inpaint(u8, mask.astype(np.uint8) * 255, rad, cv2.INPAINT_TELEA).astype(float)


def fill_along(mask, d, walk_mask):
    n_ = (d[0] ** 2 + d[1] ** 2) ** 0.5
    dx, dy = d[0] / n_, d[1] / n_
    out = img.copy()
    for y, x in zip(*np.nonzero(mask)):
        x0, y0, t0 = walk(walk_mask, y, x, dx, dy, 1)
        x1, y1, t1 = walk(walk_mask, y, x, dx, dy, -1)
        out[y, x] = (img[y0, x0] * t1 + img[y1, x1] * t0) / (t0 + t1)
    img[mask] = out[mask]


def grow(m, k):
    return cv2.dilate(m.astype(np.uint8), np.ones((k, k), np.uint8)) > 0


# 1. étiquettes : pastilles (bleu clair), traits et points (bleu franc) ; la veine rénale est bleue aussi, mais plus
# claire : les traits se reconnaissent à leur bleu saturé (rouge < 70)
line_px = (r < 40) & (b > 170) & (XX < 850)  # le contour de la veine (rouge ≈ 50) n'est pas pris
BOXES = [rect(13, 117, 222, 271), rect(650, 230, 843, 350), rect(10, 311, 216, 411), rect(25, 511, 222, 652), rect(650, 605, 845, 724), rect(22, 796, 255, 924)]
inbox = np.zeros((H, W), bool)
for m in BOXES:
    inbox |= m
bluish = (b > r + 5) & (XX < 850) & (YY > 110)
boxes = np.zeros((H, W), bool)
for m in BOXES:
    boxes |= grow(m & bluish, 13)
lines = grow(line_px & ~inbox, 15)
hidden = boxes | lines

# bord gauche du rein, mesuré là où il est visible, ajusté par un polynôme : les pastilles « Rein » et « Bassinet »
# mordaient sur ce bord, chaque pixel caché DANS le rein est repris en montant / descendant à la même distance du bord
ys_e = np.array([270, 280, 290, 300, 310, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 660, 670, 680, 690, 700, 710, 720, 730, 740])
xs_e = np.array([242, 234, 227, 220, 214, 164, 161, 159, 156, 154, 152, 151, 149, 148, 147, 146, 161, 164, 168, 173, 177, 183, 189, 196, 203])
E = np.poly1d(np.polyfit(ys_e, xs_e, 4))
inside = XX >= np.round(E(YY)) - 2
kid = hidden & inside & (XX < 330) & (YY > 300) & (YY < 670)
out = img.copy()
for y, x in zip(*np.nonzero(kid)):
    d = x - E(y)
    got = []
    for sg in (-1, 1):
        yy = y
        while True:
            yy += sg
            xx = int(round(E(yy) + d))
            if yy < 0 or yy >= H or xx < 0 or xx >= W:
                break
            if not hidden[yy, xx]:
                got.append((img[yy, xx], abs(yy - y)))
                break
    if len(got) == 2:
        (c0, t0), (c1, t1) = got
        out[y, x] = (c0 * t1 + c1 * t0) / (t0 + t1)
    elif got:
        out[y, x] = got[0][0]
img[kid] = out[kid]
# pastilles hors du rein : fond blanc
img[boxes & ~kid] = 255
# traits qui croisent la veine rénale et sa petite branche : repris le long des vaisseaux (les reflets sont gardés)
vein = lines & rect(600, 480, 790, 625) & ~boxes
fill_along(vein, (1, 0.36), lines | boxes)
# autres traits et points sur les organes (artère, uretère, surrénale, intérieur du rein) : diffusion
inpaint(lines & ~kid & ~boxes & ~vein, 7)
img[lines & ~kid & (src.min(axis=2) > 235) & grow(boxes, 3)] = 255

# 2. titre : fond blanc
img[0:108, 260:1290] = 255

# 3. partie droite : seuls les deux reins restent (les traits roses près de la tumeur sont retirés)
keep = rect(865, 225, 1170, 605) | rect(1190, 225, 1480, 600)
img[(XX >= 850) & ~keep] = 255
spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1420) & (YY < 310)
img[grow(spark, 13) & (src.min(axis=2) > 235) | grow(spark, 5)] = 255

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
anat = out.copy()
anat[:, 838:] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
for name, x0, x1 in (('sain', 850, 1180), ('cancer', 1180, 1520)):
    one = np.full_like(out, 255)
    one[:, x0:x1] = out[:, x0:x1]
    cv2.imwrite(DST + '-' + name + '.png', one)
print('écrit', DST + '-anatomie.png, -sain.png, -cancer.png')
