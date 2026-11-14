"""Nettoie le schéma « Le côlon, le rectum et le cancer colorectal » fourni par le propriétaire (demandé : pas
d'annotations dans la vidéo).

Retire le titre, les étiquettes, leurs traits et leurs points, le cône rose vers l'encadré, le cadre « Focus », les
légendes, les traits roses autour de la tumeur et l'encadré d'info. Ici les étiquettes sont posées sur la silhouette du
corps (fond chair qui varie doucement) : elles sont comblées en suivant la direction du fond (de haut en bas, ou le long
du bord du corps) ; celle de l'intestin grêle est recouverte par un morceau d'intestin pris juste au-dessus, en fondu ;
les traits sur le côlon sont comblés par diffusion. Écrit deux calques dans le même repère (1536 × 1024) :
-anatomie.png (le côlon dans le ventre) et -focus.png (côlon sain / avec cancer).
Usage : python3 scripts/brand/clean_colon_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/colon/colon-cancer.webp'
DST = 'public/images/colon/colon-propre'

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


# 1. étiquettes d'abord, puis les traits
LINES = [(419, 215, 450, 343), (647, 261, 731, 468), (137, 262, 232, 467), (200, 631, 258, 671), (582, 693, 664, 766),
         (247, 745, 299, 797), (432, 805, 505, 846), (418, 933, 503, 948)]
BOXES = [  # (rectangle, direction du fond caché)
    ((344, 135, 564, 220), (0, 1)),  # Côlon transverse : de haut en bas
    ((25, 173, 224, 264), (-0.3, 1)),  # Côlon ascendant : le long du bord du corps
    ((617, 172, 821, 263), (0.2, 1)),  # Côlon descendant
    ((13, 646, 210, 730), (0.3, 1)),  # Cæcum
    ((85, 783, 272, 842), (0, 1)),  # Appendice
    ((653, 732, 821, 820), (-0.2, 1)),  # Côlon sigmoïde
    ((498, 818, 664, 882), (0, 1)),  # Rectum
    ((498, 908, 634, 968), (0, 1)),  # Anus
]


FALLBACK = np.zeros((H, W), bool)


def is_bg(c):
    """Fond chair ou blanc (pas l'intestin, rouge ou rose)."""
    return c[1] > 205 and c[2] > 225


def directional_bg(mask, d):
    """Comme `directional`, mais ne garde que les pixels de fond (chair / blanc) trouvés de chaque côté : si un côté tombe
    sur l'intestin, seul l'autre côté est recopié."""
    dx, dy = d
    n = (dx * dx + dy * dy) ** 0.5
    dx, dy = dx / n, dy / n
    ys, xs = np.nonzero(mask)
    out = img.copy()
    for y, x in zip(ys, xs):
        got = []
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
            if is_bg(img[yy, xx]):
                got.append((img[yy, xx], t))
        if len(got) == 2:
            (c0, t0), (c1, t1) = got
            out[y, x] = (c0 * t1 + c1 * t0) / (t0 + t1)
        elif len(got) == 1:
            out[y, x] = got[0][0]
        else:
            FALLBACK[y, x] = True  # ni d'un côté ni de l'autre : comblé ensuite par diffusion
    img[mask] = out[mask]


lm = np.zeros((H, W), bool)
for ln in LINES:
    lm |= line(*ln, grow=11)
boxes = np.zeros((H, W), bool)
for bx, _ in BOXES:
    boxes |= rect(*bx, pad=7)
bluish = (src[:, :, 0] > src[:, :, 2] + 5).astype(np.uint8)


def box_mask(bx):
    """La pastille seule (fond bleu clair, texte, liseré blanc) dans son rectangle : le côlon autour n'est pas touché."""
    r = rect(*bx, pad=7)
    return r & (cv2.dilate(bluish * r.astype(np.uint8), np.ones((11, 11), np.uint8)) > 0)


for bx, d in BOXES:
    directional_bg(box_mask(bx) | (lm & ~boxes), d)
lm &= ~boxes
lm |= FALLBACK
u8 = img.clip(0, 255).astype(np.uint8)
img[:] = cv2.inpaint(u8, lm.astype(np.uint8) * 255, 8, cv2.INPAINT_TELEA).astype(float)
# intestin grêle : recouvert par le morceau d'intestin juste en dessous (décalé de 80 lignes), fondu court sur le bord
x0, y0, x1, y1 = 360, 471, 522, 553
m = np.zeros((H, W), float)
m[y0:y1, x0:x1] = 1
k = cv2.GaussianBlur(m, (0, 0), 4)
k = np.minimum(k * 1.8, 1) * rect(x0, y0, x1, y1, pad=6)
k = k[:, :, None]
shifted = np.roll(img, -80, axis=0)
img[:] = shifted * k + img * (1 - k)

# deux coins de pastille où il ne restait que du blanc (le fond chair est caché) : comblés par diffusion
spots = np.zeros((H, W), bool)
for x0, y0, x1, y1 in [(158, 622, 224, 702), (602, 242, 702, 284)]:
    spots[y0:y1, x0:x1] = img[y0:y1, x0:x1].min(axis=2) > 246
u8 = img.clip(0, 255).astype(np.uint8)
img[:] = cv2.inpaint(u8, cv2.dilate(spots.astype(np.uint8) * 255, np.ones((5, 5), np.uint8)), 10, cv2.INPAINT_TELEA).astype(float)

# 2. cône rose vers l'encadré : comblé de haut en bas (le fond chair et le côlon descendant sont presque verticaux)
cone = np.zeros((H, W), np.uint8)
cv2.fillPoly(cone, [np.array([(650, 520), (650, 548), (842, 596), (842, 388)], np.int32)], 255)
cone = cv2.dilate(cone, np.ones((7, 7), np.uint8)) > 0
directional_bg(cone & (np.arange(W)[None, :] >= 700), (0, 1))
directional(cone & (np.arange(W)[None, :] < 700), (0, 1))

# 3. titre : fond blanc
img[0:104, 120:1420] = 255

# 4. partie droite : seuls les deux tubes restent (plus de cadre, de titre, de légendes, d'encadré ni de traits roses)
keep = np.zeros((H, W), bool)
keep[248:592, 842:1156] = True  # côlon sain
keep[248:592, 1160:1492] = True  # côlon avec cancer (le bout du tube dépasse à droite)
right = np.zeros((H, W), bool)
right[:, 824:] = True
img[right & ~keep] = 255
spark = ((src[:, :, 2] > 215) & (src[:, :, 1] < 150) & (src[:, :, 0] > 130)).astype(np.uint8)
spark[:, :1442] = 0
spark = cv2.dilate(spark, np.ones((11, 11), np.uint8)) > 0
spark[:380] = False
spark[490:] = False
img[spark & (np.arange(W)[None, :] >= 1440)] = 255

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
anat = out.copy()
anat[:, 824:] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
focus = out.copy()
focus[:, :824] = 255
cv2.imwrite(DST + '-focus.png', focus)
print('écrit', DST + '-anatomie.png', 'et', DST + '-focus.png')
