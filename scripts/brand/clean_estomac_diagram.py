"""Nettoie le schéma « L'estomac et le cancer de l'estomac » fourni par le propriétaire (demandé : pas d'annotations
dans la vidéo).

Retire le titre, les 4 étiquettes (œsophage, estomac, paroi gastrique, duodénum) avec leurs traits et leurs points, le cône
rose vers l'encadré, le cadre « Focus », les légendes, les traits roses près de la tumeur et l'encadré d'info.
- pastilles sur le fond blanc : comblées de haut en bas avec les seuls pixels blancs ;
- traits et points : le long des tubes (œsophage, duodénum) ou en travers du trait (le bord croisé est gardé) ;
- cône rose posé sur la paroi droite de l'estomac : comblé le long de la paroi ; sur le fond : blanc.
Écrit -anatomie.png (œsophage, estomac, duodénum) et chaque paroi seule : -sain.png, -cancer.png (même repère 1536 × 1024).
Usage : python3 scripts/brand/clean_estomac_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/estomac/estomac-cancer.webp'
DST = 'public/images/estomac/estomac-propre'

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


def grow(m, k):
    return cv2.dilate(m.astype(np.uint8), np.ones((k, k), np.uint8)) > 0


# 1. étiquettes : pastille (bleu clair + texte), trait, point — tout est bleuté ; + leur liseré blanc
bluish = ((b > r + 5) & (XX < 780) & (YY > 120)).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(bluish)
labels = np.zeros((H, W), bool)
for i in range(1, n):
    x, y, w, h, a = st[i]
    if a > 5000:
        labels |= lab == i
full = grow(labels, 13)
near_white = src.min(axis=2) > 225
labels = full & (grow(bluish.astype(bool), 3) | near_white)
navy = (b > 120) & (r < 90) & (g < 130) & (b - r > 70)
BOX = [rect(33, 137, 336, 267), rect(499, 196, 773, 316), rect(82, 373, 342, 540), rect(33, 862, 277, 997)]
inbox = np.zeros((H, W), bool)
for m in BOX:
    inbox |= m
lines = grow(navy & ~inbox, 13) & full
boxes = labels & ~lines


def fill_along(mask, d, walk_mask):
    n_ = (d[0] ** 2 + d[1] ** 2) ** 0.5
    dx, dy = d[0] / n_, d[1] / n_
    out = img.copy()
    for y, x in zip(*np.nonzero(mask)):
        x0, y0, t0 = walk(walk_mask, y, x, dx, dy, 1)
        x1, y1, t1 = walk(walk_mask, y, x, dx, dy, -1)
        out[y, x] = (img[y0, x0] * t1 + img[y1, x1] * t0) / (t0 + t1)
    img[mask] = out[mask]


# pastilles (toutes sur le fond blanc)
left = directional_bg(boxes, (0, 1))
inpaint(left, 7)
# traits et points : l'œsophage et le duodénum sont des tubes verticaux (comblés de haut en bas) ; ailleurs, en travers
LINE_DIRS = [
    (rect(330, 200, 430, 275), (0, 1)),  # œsophage
    (rect(590, 300, 680, 425), (87, 45)),  # estomac
    (rect(330, 470, 475, 555), (47, -112)),  # paroi gastrique (le long de la bande jaune)
    (rect(60, 760, 130, 875), (0.15, 1)),  # duodénum
]
done = np.zeros((H, W), bool)
for zone, d in LINE_DIRS:
    m = lines & zone
    fill_along(m, d, lines)
    done |= m
inpaint(lines & ~done, 6)

# 2. cône rose vers l'encadré : sur l'estomac, comblé le long de la paroi (presque verticale ici) ; sur le fond, blanc
cone = np.zeros((H, W), np.uint8)
cv2.fillPoly(cone, [np.array([(594, 634), (795, 445), (795, 695)], np.int32)], 255)
cone = grow(cone > 0, 13)
on_body = cone & (XX < 745)
# bord extérieur de l'estomac mesuré au-dessus et au-dessous du cône, ajusté par un polynôme : chaque pixel caché est
# repris en remontant / descendant À LA MÊME DISTANCE DU BORD (la paroi, la bande jaune et les plis suivent la courbe)
ys_e = np.array([390, 400, 410, 420, 430, 440, 680, 690, 700, 710, 720, 730, 740])
xs_e = np.array([679, 687, 694, 700, 705, 709, 703, 699, 695, 690, 685, 679, 673])
E = np.poly1d(np.polyfit(ys_e, xs_e, 3))
out = img.copy()
for y, x in zip(*np.nonzero(on_body)):
    d = x - E(y)
    got = []
    for sg in (-1, 1):
        yy = y
        while True:
            yy += sg
            xx = int(round(E(yy) + d))
            if yy < 0 or yy >= H or xx < 0 or xx >= W:
                break
            if not cone[yy, xx]:
                got.append((img[yy, xx], abs(yy - y)))
                break
    if len(got) == 2:
        (c0, t0), (c1, t1) = got
        out[y, x] = (c0 * t1 + c1 * t0) / (t0 + t1)
    elif got:
        out[y, x] = got[0][0]
img[on_body] = out[on_body]
img[cone & ~on_body] = 255
inpaint(cone & ~on_body & ~((img.min(axis=2) > 240)), 4)

# 3. titre : fond blanc
img[0:112, 160:1400] = 255

# 4. partie droite : seules les deux parois restent (les traits roses près de la tumeur sont retirés)
keep = rect(805, 255, 1140, 570) | rect(1150, 255, 1500, 562)
img[(XX >= 780) & ~keep] = 255
spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1405) & (YY < 345)
img[grow(spark, 13) & (src.min(axis=2) > 235) | grow(spark, 5)] = 255
# les liserés des traits mordaient le coin de la paroi : les trous blancs DANS la paroi (entre deux pixels de tissu sur
# la même ligne, ou sous le haut de la paroi) sont comblés par diffusion
holes = np.zeros((H, W), bool)
for y in range(280, 345):
    row = img[y, 1380:1500].min(axis=1)
    t = np.nonzero(row < 236)[0]
    if len(t):
        span = np.zeros(120, bool)
        span[t.min():t.max() + 1] = True
        holes[y, 1380:1500] = span & (row >= 236)
for x in range(1380, 1500):
    col = img[250:345, x].min(axis=1)
    t = np.nonzero(col < 236)[0]
    if len(t):
        holes[250 + t.min():345, x] |= img[250 + t.min():345, x].min(axis=1) >= 236
inpaint(grow(holes, 3) & grow(spark, 17), 5)

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
anat = out.copy()
anat[:, 780:] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
for name, x0, x1 in (('sain', 800, 1145), ('cancer', 1145, 1510)):
    one = np.full_like(out, 255)
    one[:, x0:x1] = out[:, x0:x1]
    one[:, :780] = 255
    cv2.imwrite(DST + '-' + name + '.png', one)
print('écrit', DST + '-anatomie.png, -sain.png, -cancer.png')
