"""Nettoie le schéma « Le sein et le cancer du sein » fourni par le propriétaire (demandé : pas d'annotations dans la vidéo).

Retire le titre, les étiquettes, leurs traits et leurs points, le cône rose vers l'encadré, le cadre « Focus », les
légendes, les traits roses autour de la tumeur et l'encadré d'info. Les dessins ne sont pas redessinés : chaque pixel
caché par un trait ou une étiquette est recomposé en suivant la direction des structures (fibres du muscle, bord de la
peau, canaux) : on part dans les deux sens jusqu'à sortir de la zone cachée et on mélange les deux pixels propres.
Écrit deux calques dans le même repère (1536 × 1024) : -anatomie.png (le sein en coupe) et -focus.png (sein sain /
cancer). Usage : python3 scripts/brand/clean_sein_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/sein/sein-cancer.webp'
DST = 'public/images/sein/sein-propre'

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


# 1. étiquettes : pastilles bleu clair (+ leur ombre), traits et points. Les traits d'abord (en évitant les pastilles,
#    pour ne pas recopier leur bleu), puis les pastilles (qui reprennent les traits déjà nettoyés).
BOXES = [  # (rectangle, direction des structures cachées)
    ((12, 186, 206, 289), None),  # Muscle pectoral : recopié de plus bas, le long des fibres (voir plus loin)
    ((438, 198, 658, 293), (1, 1)),  # Tissu graisseux
    ((521, 340, 754, 465), (1, 1.2)),  # Lobules
    ((574, 696, 771, 792), (-1, 1.3)),  # Mamelon
    ((344, 799, 615, 959), (-1, 0.68)),  # Canaux galactophores : le long du bas du sein
]
LINES = [
    ((197, 241, 272, 296), (-0.25, 1)),  # muscle pectoral
    ((358, 264, 449, 352), (1, 1)),  # tissu graisseux
    ((418, 408, 527, 483), (1, 1.2)),  # lobules
    ((403, 613, 482, 803), (1, 0)),  # canaux (presque horizontaux)
    ((577, 609, 637, 700), (-1, 1.3)),  # mamelon
]
boxes = np.zeros((H, W), bool)
for bx, _ in BOXES:
    boxes |= rect(*bx, pad=7)
lines = [line(*ln) & ~boxes for ln, _ in LINES]
allLines = np.zeros((H, W), bool)
for m in lines:
    allLines |= m
for m, (_, d) in zip(lines, LINES):
    directional(boxes | allLines, d, m)
for bx, d in BOXES:
    if d is not None:
        directional(rect(*bx, pad=7), d)
directional(rect(12, 186, 206, 289, pad=7), (-0.16, 1))
# muscle pectoral : la zone cachée est recopiée de la bande juste en dessous, décalée pour suivre les fibres (elles
# descendent vers la gauche : -0,16 px par ligne), avec un fondu sur le bord du haut et de droite
x0, y0, x1, y1 = 24, 179, 214, 297
hgt = y1 - y0
shift = int(round(0.16 * hgt))
patch = src[y1:y1 + hgt, x0 - shift:x1 - shift].copy()
wy = np.minimum(np.clip(np.arange(hgt) / 30, 0, 1), np.clip((hgt - 1 - np.arange(hgt)) / 30, 0, 1))[:, None]
wx = np.minimum(np.clip((x1 - np.arange(x0, x1)) / 12, 0, 1), np.clip((np.arange(x0, x1) - x0) / 30, 0, 1))[None, :]
w = (wy * wx)[:, :, None]
img[y0:y1, x0:x1] = patch * w + img[y0:y1, x0:x1] * (1 - w)

# 2. titre (au-dessus du dessin) et cône rose vers l'encadré : fond blanc
img[0:125, 225:1310] = 255
cone = np.zeros((H, W), np.uint8)
cv2.fillPoly(cone, [np.array([(603, 588), (603, 652), (800, 720), (800, 400)], np.int32)], 255)
img[cone > 0] = 255
img[350:720, 603:700] = 255  # bords du cône (anticrénelés)
img[350:588, 596:603] = 255

# 3. partie droite : seuls les deux dessins restent (plus de cadre, de titre, de légendes, d'encadré ni d'étincelles)
keep = np.zeros((H, W), bool)
keep[284:584, 784:1500] = True
keep[584:598, 784:860] = True  # pointes des deux dessins (en bas à gauche)
keep[584:598, 1134:1200] = True
right = np.zeros((H, W), bool)
right[:, 700:] = True
img[right & ~keep] = 255
# traits roses autour de la tumeur (et leur liseré blanc) : le bord du dessin, presque vertical, est recomposé de haut en bas
spark = ((src[:, :, 2] > 225) & (src[:, :, 1] < 125) & (src[:, :, 0] > 150)).astype(np.uint8)  # magenta vif (pas le bord des lobules)
spark[:, :1440] = 0
spark[:395] = 0
spark[505:] = 0
spark = cv2.dilate(spark, np.ones((13, 13), np.uint8)) > 0
spark[:, :1437] = False
directional(spark, (0, 1))
img[spark & (np.arange(W)[None, :] > 1484)] = 255
# le bord du dessin caché par les traits est redessiné : courbe de (1476, 395) à (1450, 505) (pentes mesurées au-dessus
# et au-dessous), fond pêche à l'intérieur, blanc à l'extérieur
PEACH = src[392:398, 1446:1462].reshape(-1, 3).mean(axis=0)
EDGE = np.array([147, 178, 251], float)
for y in range(395, 506):
    t = (y - 395) / 110
    h00, h10, h01, h11 = 2 * t**3 - 3 * t**2 + 1, t**3 - 2 * t**2 + t, -2 * t**3 + 3 * t**2, t**3 - t**2
    xo = h00 * 1476 + h10 * 110 * 0.2 + h01 * 1450 + h11 * 110 * -0.9
    for x in range(1437, 1495):
        if not spark[y, x] and abs(x - xo) > 3:
            continue
        dd = x - xo
        if dd < -2.5:
            img[y, x] = PEACH if spark[y, x] else img[y, x]
        elif dd <= 2.5:
            k = min(1, 2.5 - abs(dd) + 0.5)
            base = PEACH if dd < 0 else np.array([255, 255, 255], float)
            img[y, x] = EDGE * k + base * (1 - k)
        else:
            img[y, x] = 255
# reste du cadre lavande à gauche de l'encadré
img[:, 700:784][(img[:, 700:784].min(axis=2) > 200)] = 255

out = img.clip(0, 255).astype(np.uint8)
light = out.min(axis=2) > 236
out[light] = 255

anat = out.copy()
anat[:, 700:] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
focus = out.copy()
focus[:, :700] = 255
cv2.imwrite(DST + '-focus.png', focus)
print('écrit', DST + '-anatomie.png', 'et', DST + '-focus.png')
