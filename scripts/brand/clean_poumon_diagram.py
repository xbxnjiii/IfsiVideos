"""Nettoie le schéma « Les poumons et le cancer du poumon » fourni par le propriétaire (demandé : pas d'annotations).

Retire le titre, les étiquettes, leurs traits et leurs points, le cône rose vers l'encadré (« dé-mélangé » là où il
passe sur le poumon), le cadre « Focus », les légendes, les traits roses autour des tumeurs et l'encadré d'info. Les
dessins ne sont pas redessinés : chaque pixel caché est recomposé en suivant la direction des structures (bord du
poumon, anneaux de la trachée, diaphragme). Écrit deux calques dans le même repère (1536 × 1024) : -anatomie.png (les
poumons, la trachée, le diaphragme) et -focus.png (poumon sain / avec cancer, alvéoles saines / touchées).
Usage : python3 scripts/brand/clean_poumon_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/poumon/poumon-cancer.webp'
DST = 'public/images/poumon/poumon-propre'

img = cv2.imread(SRC, cv2.IMREAD_COLOR).astype(float)  # BGR
H, W = img.shape[:2]
src = img.copy()
b, g, r = [src[:, :, i] for i in range(3)]


def directional(mask, d, target=None):
    """Recompose les pixels de `target` (par défaut `mask`) en suivant la direction `d` (dx, dy) : on part dans les deux
    sens jusqu'à sortir de `mask` (zone cachée) et on mélange les deux pixels propres trouvés."""
    dx, dy = d
    n = (dx * dx + dy * dy) ** 0.5
    dx, dy = dx / n, dy / n
    if target is None:
        target = mask
    ys, xs = np.nonzero(target)
    out = img.copy()
    for y, x in zip(ys, xs):
        cs, ts = [], []
        for sg in (1, -1):
            t = 1
            while True:
                xx = int(round(x + sg * dx * t))
                yy = int(round(y + sg * dy * t))
                if xx < 0 or yy < 0 or xx >= W or yy >= H:
                    xx, yy = min(W - 1, max(0, xx)), min(H - 1, max(0, yy))
                    break
                if not mask[yy, xx]:
                    break
                t += 1
            cs.append(img[yy, xx])
            ts.append(t)
        out[y, x] = (cs[0] * ts[1] + cs[1] * ts[0]) / (ts[0] + ts[1])
    img[target] = out[target]


def rect(x0, y0, x1, y1, pad=0):
    m = np.zeros((H, W), bool)
    m[max(0, y0 - pad):y1 + pad, max(0, x0 - pad):x1 + pad] = True
    return m


navy = ((b > 120) & (r < 80) & (g < 110) & (b - r > 80)).astype(np.uint8)


def line(x0, y0, x1, y1, grow=8):
    """Trait bleu nuit d'une étiquette (et son point) dans le rectangle donné, avec le liseré blanc autour."""
    m = np.zeros((H, W), np.uint8)
    m[y0 - 2:y1 + 2, x0 - 2:x1 + 2] = navy[y0 - 2:y1 + 2, x0 - 2:x1 + 2]
    return cv2.dilate(m, np.ones((2 * grow + 1, 2 * grow + 1), np.uint8)) > 0


# 1. étiquettes et traits
def bluish_to_white(m):
    """Pastille posée sur le fond blanc : ses pixels bleutés (fond bleu clair, texte bleu nuit) deviennent blancs ; le
    dessin (rose, rouge) n'est pas touché."""
    sel = m & (src[:, :, 0] > src[:, :, 2] + 8)
    img[sel] = 255


def edge_x(y, xa, xb):
    """Abscisse du contour rouge foncé du poumon sur la ligne y, cherché entre xa et xb."""
    return xa + int(np.argmin(img[y, xa:xb, 1]))


def rowshift(x0, y0, x1, y1, xa, xb):
    """Pastille posée sur le bord du poumon : chaque ligne cachée est recopiée de la ligne propre au-dessus et de celle
    au-dessous, décalées pour suivre le contour (repéré sur ces deux lignes entre xa et xb), puis mélangées."""
    yt, yb = y0 - 1, y1 + 1
    et, eb = edge_x(yt, xa, xb), edge_x(yb, xa, xb)
    top, bot = img[yt].copy(), img[yb].copy()
    for y in range(y0, y1 + 1):
        t = (y - yt) / (yb - yt)
        xo = et + (eb - et) * t
        for x in range(x0, x1 + 1):
            xt = int(round(min(W - 1, max(0, x + (et - xo)))))
            xb2 = int(round(min(W - 1, max(0, x + (eb - xo)))))
            img[y, x] = top[xt] * (1 - t) + bot[xb2] * t


# pastilles posées sur le fond blanc (le dessin autour reste intact)
for bx in [(128, 153, 335, 218), (30, 263, 241, 356), (606, 238, 806, 336), (309, 909, 663, 1007)]:
    bluish_to_white(rect(*bx, pad=7))
# pastilles posées sur le bord gauche du poumon droit : recopiées en suivant le contour
rowshift(4, 422, 228, 526, 120, 262)  # Bronche
rowshift(5, 590, 229, 718, 110, 240)  # Bronchioles
rowshift(4, 821, 211, 932, 120, 186)  # Alvéoles
boxes = rect(4, 422, 228, 526) | rect(5, 590, 229, 718) | rect(4, 821, 211, 932)
# traits : trachée (sur les anneaux : de gauche à droite), poumon droit et poumon gauche (le long du bord), diaphragme
lt = line(328, 194, 468, 236)
cols = np.arange(W)[None, :]
img[lt & (cols < 445)] = 255
directional(lt & (cols >= 445), (1, 0))
directional(line(208, 345, 273, 409), (-0.6, 1))
ld = line(486, 830, 534, 914)
bluish_to_white(ld & (np.arange(H)[:, None] > 905))
directional(ld & (np.arange(H)[:, None] <= 905), (1, 0))
lg = line(663, 330, 720, 415)
directional(lg, (0.75, 1))
# traits dans le poumon (bronche, bronchioles, alvéoles) : comblés par diffusion, plus doux sur les ramifications
soft = (line(216, 479, 373, 521) | line(216, 659, 306, 688) | line(190, 809, 243, 853)) & ~boxes
u8 = img.clip(0, 255).astype(np.uint8)
img[:] = cv2.inpaint(u8, soft.astype(np.uint8) * 255, 6, cv2.INPAINT_TELEA).astype(float)

# 2. cône rose (calque clair) vers l'encadré : là où il passe sur le poumon gauche, la zone est reprise du poumon droit
#    en miroir (axe de la trachée, x = 462,5 : les deux bords extérieurs sont symétriques ici), avec un fondu sur le bord ;
#    hors du poumon, fond blanc
AX = 462.5
cone = np.zeros((H, W), np.uint8)
cv2.fillPoly(cone, [np.array([(656, 598), (656, 628), (840, 626), (840, 444)], np.int32)], 255)
cone = cv2.dilate(cone, np.ones((9, 9), np.uint8))
wgt = cv2.GaussianBlur(cone.astype(float) / 255, (0, 0), 4)[:, :, None]
ys, xs = np.mgrid[0:H, 0:W]
mx = np.clip(np.round(2 * AX - xs).astype(int), 0, W - 1)
mirror = img[ys, mx]
img[:] = mirror * wgt + img * (1 - wgt)
# 2 bis. bord gauche du poumon droit sous les étiquettes : la texture (ramifications) est reprise du poumon gauche en
#    miroir là où celui-ci est propre (hors du cône), en fondu sur le pourtour de chaque zone
src_m = img[ys, mx].copy()
src_m[mx > 780] = 255
for x0, y0, x1, y1 in [(4, 418, 230, 466), (5, 632, 231, 720)]:
    m = np.zeros((H, W), float)
    m[y0:y1, x0:x1] = 1
    k = cv2.GaussianBlur(m, (0, 0), 5)
    k = np.minimum(k * 1.6, 1) * m
    img[:] = src_m * k[:, :, None] + img * (1 - k[:, :, None])

# 3. titre : fond blanc
img[0:120, 130:1360] = 255

# 4. partie droite : seuls les quatre dessins restent (plus de cadre, de titre, de légendes, d'encadré)
keep = np.zeros((H, W), bool)
keep[218:508, 852:1134] = True  # poumon sain
keep[218:512, 1152:1440] = True  # poumon avec cancer
keep[588:778, 826:1019] = True  # alvéoles saines
keep[588:778, 1146:1344] = True  # alvéoles touchées
right = np.zeros((H, W), bool)
right[:, 786:] = True
img[right & ~keep] = 255
img[760:, 760:840] = np.maximum(img[760:, 760:840], 255 * (img[760:, 760:840].min(axis=2, keepdims=True) > 200))
# haut des légendes collé sous les poumons : pixels bleutés → blanc
band = np.zeros((H, W), bool)
band[488:514, 840:1450] = True
bluish_to_white(band)
# traits roses autour des tumeurs (et leur liseré blanc) : recomposés de haut en bas
spark = ((src[:, :, 2] > 225) & (src[:, :, 1] < 125) & (src[:, :, 0] > 150)).astype(np.uint8)
spark[:, :1300] = 0
spark[np.ix_(np.arange(H) > 440, np.arange(W) >= 1400)] = 0
spark = cv2.dilate(spark, np.ones((13, 13), np.uint8)) > 0
spark &= (np.arange(W)[None, :] >= 1302)
directional(spark, (0, 1))

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 238] = 255
anat = out.copy()
anat[:, 786:] = 255
anat[740:800, 780:850] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
focus = out.copy()
focus[:, :786] = 255
focus[740:800, 780:840] = 255
cv2.imwrite(DST + '-focus.png', focus)
print('écrit', DST + '-anatomie.png', 'et', DST + '-focus.png')
