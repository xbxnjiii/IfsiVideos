"""Nettoie le schéma « Le foie et le cancer du foie » fourni par le propriétaire (demandé : pas d'annotations dans la
vidéo).

Retire le titre, les 5 étiquettes (foie, lobe gauche, lobe droit, voie biliaire, vésicule biliaire) avec leurs traits
et leurs points, le cadre « Focus », les légendes, les traits roses près de la tumeur et l'encadré d'info.
- pastilles sur le fond blanc : passées en blanc (seule la pastille et son liseré) ;
- la pastille « Lobe droit » est posée sur le bord gauche du foie : bord mesuré au-dessus et au-dessous, ajusté par un
  polynôme, chaque pixel caché dans le foie repris en montant / descendant à la même distance du bord ;
- traits et points (bleu franc) : comblés en travers du trait (le bord du foie qu'ils croisent est gardé), le long du
  canal pour la voie biliaire, diffusion ailleurs (le foie est un dégradé lisse).
Écrit -anatomie.png (foie, vésicule, voie biliaire) et chaque foie seul : -sain.png, -cancer.png (même repère 1536 × 1024).
Usage : python3 scripts/brand/clean_foie_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/foie/foie-cancer.webp'
DST = 'public/images/foie/foie-propre'

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


# 1. étiquettes
BOXES = [rect(18, 128, 318, 318), rect(512, 172, 765, 268), rect(6, 430, 254, 562), rect(528, 680, 790, 803), rect(40, 838, 360, 978)]
inbox = np.zeros((H, W), bool)
for m in BOXES:
    inbox |= m
bluish = (b > r + 5) & (XX < 800) & (YY > 110)
boxes = np.zeros((H, W), bool)
for m in BOXES:
    boxes |= grow(m & bluish, 11)
line_px = (b > 150) & (r < 90) & (b - r > 90) & (XX < 800) & (YY > 110)
# trait + point + leur liseré blanc (le point a un anneau blanc)
lines = (grow(line_px & ~inbox, 13) | (grow(line_px & ~inbox, 27) & (src.min(axis=2) > 170))) & ~boxes

# bord gauche du foie, sous la pastille « Lobe droit » (lignes 430 → 562) : mesuré au-dessus et au-dessous
liver = (r > 150) & (g < 130) & (b < 130)
ys_e, xs_e = [], []
for y in list(range(360, 425, 6)) + list(range(570, 660, 6)):
    xs = np.nonzero(liver[y, :400])[0]
    if len(xs):
        ys_e.append(y)
        xs_e.append(xs[0])
E = np.poly1d(np.polyfit(ys_e, xs_e, 3))
hidden = boxes | lines
inside = XX >= np.round(E(YY)) - 4  # le liseré sombre du bord est repris aussi
lob = boxes & inside & rect(0, 420, 300, 575)
out = img.copy()
for y, x in zip(*np.nonzero(lob)):
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
img[lob] = out[lob]
# pastilles hors du foie : fond blanc ; le liseré du bord du foie sous la pastille est redessiné par l'antialias du bord

# la pastille « Foie » mord sur le bord haut du foie (x 225 → 318) : bord mesuré à gauche et à droite, ajusté, chaque
# pixel caché sous le bord repris en glissant à gauche / à droite à la même distance du bord
xs_t, ys_t = [], []
for x in list(range(190, 226, 4)) + list(range(322, 380, 4)):
    ys = np.nonzero(liver[250:420, x])[0]
    if len(ys):
        xs_t.append(x)
        ys_t.append(250 + ys[0])
T = np.poly1d(np.polyfit(xs_t, ys_t, 2))
top = boxes & rect(180, 270, 330, 330) & (YY >= np.round(T(XX)) - 4)
out = img.copy()
for y, x in zip(*np.nonzero(top)):
    d = y - T(x)
    got = []
    for sg in (-1, 1):
        xx = x
        while True:
            xx += sg
            yy = int(round(T(xx) + d))
            if xx < 0 or xx >= W or yy < 0 or yy >= H:
                break
            if not hidden[yy, xx]:
                got.append((img[yy, xx], abs(xx - x)))
                break
    if len(got) == 2:
        (c0, t0), (c1, t1) = got
        out[y, x] = (c0 * t1 + c1 * t0) / (t0 + t1)
    elif got:
        out[y, x] = got[0][0]
img[top] = out[top]
img[boxes & ~lob & ~top] = 255

# traits et points
duct = lines & rect(420, 600, 540, 800)
fill_along(duct, (0, 1), lines)  # le long du canal (vertical)
LINE_DIRS = [  # (zone, direction perpendiculaire au trait)
    (rect(225, 300, 340, 410), (1, -1.0)),  # « Foie »
    (rect(600, 250, 700, 410), (1, 0.26)),  # « Lobe gauche »
    (rect(230, 520, 330, 600), (1, -0.9)),  # « Lobe droit »
    (rect(190, 720, 290, 860), (1, 0.55)),  # « Vésicule »
]
done = duct.copy()
for zone, d in LINE_DIRS:
    m = lines & zone & ~done
    fill_along(m, d, lines)
    done |= m
inpaint(lines & ~done, 6)

# 2. titre
img[0:112, 200:1340] = 255

# 3. partie droite : seuls les deux foies
keep = rect(805, 290, 1160, 560) | rect(1145, 290, 1515, 560)
img[(XX >= 800) & ~keep] = 255
spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1400) & (YY < 340)
img[grow(spark, 11) & (src.min(axis=2) > 200) | grow(spark, 5) & ~((r > 150) & (g < 110) & (b < 110))] = 255

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
anat = out.copy()
anat[:, 800:] = 255
anat[(XX >= 790) & (XX < 800) & (src[:, :, 0] > src[:, :, 2] + 5)] = 255  # bord du cadre « Focus »
cv2.imwrite(DST + '-anatomie.png', anat)
focus = out.copy()
focus[:, :800] = 255
nonwhite = (focus.min(axis=2) < 240).astype(np.uint8)
n, lab, st, cen = cv2.connectedComponentsWithStats(nonwhite)
big = sorted(range(1, n), key=lambda i: -st[i][4])[:2]
big.sort(key=lambda i: cen[i][0])  # de gauche (sain) à droite (cancer)
for name, i in zip(('sain', 'cancer'), big):
    m = cv2.dilate((lab == i).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    one = np.full_like(focus, 255)
    one[m] = focus[m]
    cv2.imwrite(DST + '-' + name + '.png', one)
    print(name, st[i])
print('écrit', DST + '-anatomie.png, -sain.png, -cancer.png')
