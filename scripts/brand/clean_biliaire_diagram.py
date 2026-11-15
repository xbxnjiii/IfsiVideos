"""Nettoie le schéma « Les voies biliaires et les cancers des voies biliaires » fourni par le propriétaire (demandé : pas
d'annotations dans la vidéo).

Retire le titre, les 6 étiquettes (foie, voies intra-hépatiques, vésicule, voies extra-hépatiques, cholédoque,
duodénum) avec leurs traits et leurs points, le cadre « Focus », les légendes, les traits roses et les encadrés.
- pastilles sur le fond blanc : passées en blanc ;
- pastilles qui cachent un bord d'organe (bord gauche du foie, haut et bas du lobe droit, coin du lobe gauche, bord du
  duodénum) : bord mesuré là où il est visible, ajusté par un polynôme, chaque pixel caché repris en glissant **à la même
  distance du bord** (liseré compris) ;
- traits et points (bleu franc + anneau blanc) : comblés le long des canaux biliaires, par diffusion ailleurs.
Écrit -anatomie.png, -sain.png, -cancer.png (même repère 1536 × 1024).
Usage : python3 scripts/brand/clean_biliaire_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/biliaire/biliaire-cancer.webp'
DST = 'public/images/biliaire/biliaire-propre'

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


organ = (src.min(axis=2) < 225) & ~((b > r + 8))  # tout ce qui n'est pas fond blanc ni pastille bleutée

# 1. pastilles (bleu clair + texte) et traits (bleu franc + anneau blanc)
BOXES = {
    'foie': rect(30, 110, 250, 205),
    'intra': rect(530, 100, 772, 225),
    'vesicule': rect(10, 425, 218, 562),
    'extra': rect(515, 355, 775, 478),
    'chol': rect(510, 500, 752, 650),
    'duo': rect(15, 660, 272, 785),
}
bluish = (b > r + 8) & (XX < 790)
boxes = {k: grow(m & bluish, 11) & m for k, m in BOXES.items()}
allbox = np.zeros((H, W), bool)
for m in boxes.values():
    allbox |= m
line_px = (b > 150) & (r < 90) & (b - r > 90) & (XX < 790) & (YY > 100)
lines = (grow(line_px, 13) | (grow(line_px, 27) & (src.min(axis=2) > 170))) & ~allbox
hidden = allbox | lines


def edge_fill(region, edge, vertical, keep_side):
    """Comble `region` (pixels cachés du côté organe du bord) en glissant à la même distance du bord.
    vertical=True : bord x = edge(y), on glisse en y ; sinon bord y = edge(x), on glisse en x."""
    out = img.copy()
    for y, x in zip(*np.nonzero(region)):
        d = (x - edge(y)) if vertical else (y - edge(x))
        got = []
        for sg in (-1, 1):
            u = y if vertical else x
            while True:
                u += sg
                if vertical:
                    yy, xx = u, int(round(edge(u) + d))
                else:
                    xx, yy = u, int(round(edge(u) + d))
                if yy < 0 or yy >= H or xx < 0 or xx >= W or abs(u - (y if vertical else x)) > 260:
                    break
                if not hidden[yy, xx]:
                    if keep_side(yy, xx):
                        got.append((img[yy, xx], abs(u - (y if vertical else x))))
                    break
        if len(got) == 2:
            (c0, t0), (c1, t1) = got
            out[y, x] = (c0 * t1 + c1 * t0) / (t0 + t1)
        elif got:
            out[y, x] = got[0][0]
        else:
            out[y, x] = 255
    img[region] = out[region]


def first_true(arr):
    idx = np.nonzero(arr)[0]
    return idx[0] if len(idx) else None


# bord gauche du foie (sous « Vésicule ») : x = E(y), mesuré au-dessus et au-dessous de la pastille
pts = []
for y in list(range(380, 424, 4)) + list(range(566, 640, 4)):
    x = first_true(organ[y, :300] & ~hidden[y, :300])
    if x is not None:
        pts.append((y, x))
E = np.poly1d(np.polyfit([p[0] for p in pts], [p[1] for p in pts], 2))
reg = boxes['vesicule'] & (XX >= np.round(E(YY)) - 4)
edge_fill(reg, E, True, lambda yy, xx: True)
img[boxes['vesicule'] & ~reg] = 255

# bord gauche du duodénum (sous « Duodénum ») : x = D(y)
pts = []
for y in list(range(600, 658, 4)) + list(range(788, 812, 3)):
    x = first_true(organ[y, 150:400] & ~hidden[y, 150:400])
    if x is not None:
        pts.append((y, 150 + x))
D = np.poly1d(np.polyfit([p[0] for p in pts], [p[1] for p in pts], 2))
reg = boxes['duo'] & (XX >= np.round(D(YY)) - 4)
edge_fill(reg, D, True, lambda yy, xx: True)
img[boxes['duo'] & ~reg] = 255

# haut du lobe droit (sous « intra-hépatiques ») : y = T(x), mesuré à gauche de la pastille et sous elle, côté pointe
pts = []
for x in list(range(470, 528, 4)) + list(range(725, 772, 4)):
    col = organ[:, x] & ~hidden[:, x]
    y = first_true(col[60:400])
    if y is not None:
        pts.append((x, 60 + y))
T = np.poly1d(np.polyfit([p[0] for p in pts], [p[1] for p in pts], 2))
reg = boxes['intra'] & (YY >= np.round(T(XX)) - 4)
edge_fill(reg, T, False, lambda yy, xx: True)
img[boxes['intra'] & ~reg] = 255

# coin du lobe gauche (sous « Foie ») : y = F(x)
pts = []
for x in list(range(255, 330, 5)) + list(range(80, 140, 5)):
    col = organ[:, x] & ~hidden[:, x]
    y = first_true(col[60:460])
    if y is not None and (x > 250 or 60 + y > 205):
        pts.append((x, 60 + y))
F = np.poly1d(np.polyfit([p[0] for p in pts], [p[1] for p in pts], 2))
reg = boxes['foie'] & (YY >= np.round(F(XX)) - 4)
edge_fill(reg, F, False, lambda yy, xx: True)
img[boxes['foie'] & ~reg] = 255

# bas du lobe droit (sous « extra-hépatiques ») : y = B(x), droite entre les deux coins visibles du bord, (515, 478) à
# gauche de la pastille et (665, 355) au-dessus d'elle ; on ne reprend que du côté de la pointe (à gauche, le canal
# jaune aurait été recopié en traînée)
B = np.poly1d(np.polyfit([515, 665], [478, 355], 1))
reg = boxes['extra'] & (YY <= np.round(B(XX)) + 4)
edge_fill(reg, B, False, lambda yy, xx: xx > 485)
img[boxes['extra'] & ~reg] = 255

img[boxes['chol']] = 255

# 2. traits et points : le long des canaux, diffusion ailleurs
duct = (g > r) & (g > b + 30)  # les canaux sont verts
LINE_DIRS = [
    (rect(400, 430, 500, 600), (0, 1)),  # canal extra-hépatique / cholédoque (vertical)
]
done = np.zeros((H, W), bool)
for zone, d in LINE_DIRS:
    m = lines & zone & grow(duct, 25)
    fill_along(m, d, lines)
    done |= m
inpaint(lines & ~done, 7)

# 3. titre, bas de page, partie droite
img[0:82, 90:1460] = 255
fade = np.clip((815 - YY) / 25.0, 0, 1).astype(np.float32)
anat = img * fade[:, :, None] + 255 * (1 - fade[:, :, None])
anat[:, 790:] = 255
anat[(XX >= 770) & (XX < 790) & (src[:, :, 0] > src[:, :, 2] + 8)] = 255  # bord du cadre « Focus »
out = anat.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
cv2.imwrite(DST + '-anatomie.png', out)

spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1400) & (YY < 260)
focus = src.copy()
focus[grow(spark, 9) & (focus.min(axis=2) > 160)] = 255
for name, (x0, y0, x1, y1) in (('sain', (845, 150, 1125, 330)), ('cancer', (1170, 150, 1455, 330))):
    one = np.full_like(focus, 255)
    m = rect(x0, y0, x1, y1) & (focus.min(axis=2) < 246) & ~(focus[:, :, 0] > focus[:, :, 2] + 8)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
    one[m] = focus[m]
    cv2.imwrite(DST + '-' + name + '.png', one.clip(0, 255).astype(np.uint8))
print('écrit', DST + '-anatomie.png, -sain.png, -cancer.png')
