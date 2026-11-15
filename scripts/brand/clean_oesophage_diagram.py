"""Nettoie le schéma « L'œsophage et le cancer de l'œsophage » fourni par le propriétaire (demandé : pas d'annotations
dans la vidéo).

Retire le titre, les 4 étiquettes posées sur le corps (pharynx, œsophage, sphincter inférieur, estomac) avec leurs traits
et leurs points, l'encadré « Coupe de l'œsophage » (gardé à part : la coupe du tube seule, sans ses 3 étiquettes), le
cadre « Focus », les légendes, les traits roses près de la tumeur, les encadrés « types », « facteurs de risque » et
« info ».
- pastilles posées sur la silhouette couleur peau : comblées en travers (de la peau d'un côté à l'autre) ou par
  diffusion quand elles chevauchent le bord du corps ;
- l'encadré « Coupe » cachait l'épaule droite : la peau de la colonne voisine se prolonge et s'efface en fondu vers le
  blanc (le corps s'estompe sur la droite) ;
- traits et points (bleu franc, avec leur anneau blanc) : comblés en travers du trait sur l'œsophage et le tube, par
  diffusion ailleurs.
Écrit -anatomie.png (tête, pharynx, œsophage, sphincter, estomac), -coupe.png (le tube en coupe : muqueuse, musculaire,
adventice), -sain.png et -cancer.png (vue de l'intérieur), même repère 1536 × 1024.
Usage : python3 scripts/brand/clean_oesophage_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/oesophage/oesophage-cancer.webp'
DST = 'public/images/oesophage/oesophage-propre'

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


# ── partie gauche (x < 790) ──
bluish = (b > r + 8) & (XX < 790)
line_px = (b > 150) & (r < 90) & (b - r > 90) & (XX < 790) & (YY > 110)
BOXES = {
    'pharynx': rect(14, 170, 234, 346),
    'oeso': rect(40, 440, 306, 622),
    'sphincter': rect(14, 700, 286, 914),
    'estomac': rect(572, 830, 744, 896),
}
boxes = {k: grow(m & bluish, 13) & m | (grow(grow(m & bluish, 13) & m, 5) & (src.min(axis=2) > 225)) for k, m in BOXES.items()}
allbox = np.zeros((H, W), bool)
for m in boxes.values():
    allbox |= m
inbox = np.zeros((H, W), bool)
for m in BOXES.values():
    inbox |= m
# encadré « Coupe de l'œsophage » (cadre, en-tête rose, étiquettes) : tout ce qui est à droite de x = 478, sauf le tube
panel = rect(478, 200, 790, 745)
lines = (grow(line_px & ~panel, 13) | (grow(line_px & ~panel, 27) & (src.min(axis=2) > 170))) & ~allbox

# 1. la coupe du tube, gardée à part : ses 3 points + traits comblés le long du tube (couches verticales)
TUBE = rect(486, 312, 636, 722)
# le tube : sa silhouette pleine (plus grande composante non blanche, trous bouchés)
tsil = (TUBE & (src.min(axis=2) < 238) & ~(b > r + 8)).astype(np.uint8)
tsil = cv2.morphologyEx(tsil, cv2.MORPH_CLOSE, np.ones((35, 35), np.uint8))
cnts, _ = cv2.findContours(tsil, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
tube_px = np.zeros((H, W), np.uint8)
cv2.drawContours(tube_px, [max(cnts, key=cv2.contourArea)], -1, 1, -1)
tube_px = tube_px > 0
coupe_lines = (grow(line_px & TUBE, 13) | (grow(line_px & TUBE, 33) & (src.min(axis=2) > 170))) & tube_px & rect(540, 380, 640, 700)
fill_along(coupe_lines, (0, 1), coupe_lines)
coupe = np.full_like(img, 255)
coupe[tube_px] = img[tube_px]

# 2. pastilles : passées en blanc (la peau du corps sera effacée plus bas, hors de la tête)
for k, m in boxes.items():
    img[m] = 255

# 3. traits et points : en travers du trait sur l'œsophage, diffusion ailleurs
LINE_DIRS = [
    (rect(300, 280, 380, 360), (0.3, 1)),  # pharynx (trait presque horizontal)
    (rect(330, 500, 400, 600), (0.25, 1)),  # œsophage
    (rect(330, 740, 400, 820), (0.06, 1)),  # sphincter
]
done = np.zeros((H, W), bool)
for zone, d in LINE_DIRS:
    m = lines & zone
    fill_along(m, d, lines)
    done |= m
inpaint(lines & ~done, 7)

# 4. on garde la tête (coupe du nez, de la bouche, du pharynx) et le tube digestif (œsophage, estomac) ; la peau du
# cou, des épaules et du ventre s'efface en fondu (les étiquettes et l'encadré « Coupe » étaient posés dessus)
hsv = cv2.cvtColor(src.clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV)
hh, ss, vv = hsv[:, :, 0].astype(int), hsv[:, :, 1].astype(int), hsv[:, :, 2].astype(int)
organ = (((hh >= 165) | (hh <= 6)) & (ss > 80) & (vv > 110)) | ((hh >= 15) & (hh <= 30) & (ss > 120))
organ &= (XX < 600) & (YY > 250) & ~panel & ~allbox
n, lab, st, _ = cv2.connectedComponentsWithStats(organ.astype(np.uint8))
main = np.zeros((H, W), bool)
for i in range(1, n):
    if st[i][4] > 3000:
        main |= lab == i
main = cv2.morphologyEx(main.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8)) > 0
keep = grow(main, 9).astype(np.float32)
# la tête : tout ce qui est au-dessus de y = 250, en fondu jusqu'à y = 330
# (le nez, les lèvres et le menton, cachés en partie par l'étiquette « Pharynx », s'effacent aussi : on garde la coupe)
head = (np.clip((360 - YY) / 90.0, 0, 1) * np.clip((XX - 232) / 30.0, 0, 1) * np.clip((500 - XX) / 50.0, 0, 1)).astype(np.float32)
alpha = np.maximum(cv2.GaussianBlur(keep, (0, 0), 3), head)
img[:] = img * alpha[:, :, None] + 255 * (1 - alpha[:, :, None])

# le dôme de l'estomac (derrière l'œsophage) : son côté gauche était caché par l'étiquette « Sphincter » (x < 287) ;
# repris en miroir de sa partie visible (axe x = 287), avec un bord clair comme en haut du dôme
rim = src[688, 262].copy()
for y in range(700, 913):
    yy = min(y, 872)  # sous y = 872, la paroi de l'estomac passe dans la zone : on prolonge la ligne 872
    xb = 222 + (y - 700) * 14 / 212.0 + 26 * max(0.0, 1 - (y - 700) / 34.0) ** 2  # coin du haut arrondi
    for x in range(int(xb), 288):
        t = (287 - x) % 76
        xs = 288 + (t if t < 38 else 75 - t)  # aller-retour dans l'intérieur visible du dôme (x 288 → 326)
        c = img[yy, xs]
        d = x - xb
        if d < 5:
            c = rim * (1 - d / 5) + c * (d / 5)
        img[y, x] = c
    for x in range(int(xb) - 3, int(xb)):
        k = (int(xb) - x) / 3.0
        img[y, x] = rim * (1 - k) + 255 * k

# restes blancs du point et du trait « Sphincter » dans le dôme : diffusion
spots = grow((img.min(axis=2) > 225) & rect(240, 720, 372, 870), 5) & rect(236, 715, 376, 875)
inpaint(spots, 5)

# reste du cadre « Coupe » (trait mauve) près du cou
img[(XX >= 466) & (XX < 520) & (YY < 760) & (src[:, :, 0] > src[:, :, 2] + 8)] = 255

# 5. titre
img[0:96, 150:1390] = 255

out = img.clip(0, 255).astype(np.uint8)
anat = out.copy()
anat[:, 790:] = 255
anat[anat.min(axis=2) > 246] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
cv2.imwrite(DST + '-coupe.png', coupe.clip(0, 255).astype(np.uint8))

# ── partie droite : les deux vues de l'intérieur ──
spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1400) & (YY < 260)
focus = src.copy()
focus[grow(spark, 9) & ~((r > 150) & (g < 140) & (b < 140))] = 255
# le coin haut droit de la vue « cancer » était sous les traits roses : repris en miroir du coin gauche (axe x = 1319,5)
corner = grow(spark, 17) & rect(1395, 175, 1480, 270)
ys_, xs_ = np.nonzero(corner)
focus[ys_, xs_] = src[ys_, 2639 - xs_]
for name, (x0, y0, x1, y1) in (('sain', (830, 180, 1140, 360)), ('cancer', (1165, 180, 1480, 360))):
    one = np.full_like(focus, 255)
    m = rect(x0, y0, x1, y1) & (focus.min(axis=2) < 246) & ~(focus[:, :, 0] > focus[:, :, 2] + 8)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
    one[m] = focus[m]
    cv2.imwrite(DST + '-' + name + '.png', one.clip(0, 255).astype(np.uint8))
print('écrit', DST + '-anatomie.png, -coupe.png, -sain.png, -cancer.png')
