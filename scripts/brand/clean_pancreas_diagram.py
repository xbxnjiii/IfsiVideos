"""Nettoie le schéma « Le pancréas et le cancer du pancréas » fourni par le propriétaire (demandé : pas d'annotations
dans la vidéo).

Retire le titre, les 6 étiquettes (foie, vésicule biliaire, estomac, pancréas, duodénum) avec leurs traits et leurs points,
le cône rose vers l'encadré, le cadre « Focus », les légendes, les traits roses près de la tumeur et l'encadré d'info.
- étiquettes posées sur le fond blanc : comblées de haut en bas avec les seuls pixels de fond ;
- l'étiquette « Vésicule biliaire » posée sur le foie : comblée le long du bord du foie (direction (-0,4 ; 1)), ce qui
  garde le contour et le reflet ;
- points et traits sur les organes : diffusion (`cv2.inpaint`), le foie, l'estomac et la vésicule sont des dégradés lisses ;
- cône rose : passé en blanc là où il est posé sur le fond.
Écrit deux calques dans le même repère (1536 × 1024) : -anatomie.png (foie, vésicule, estomac, duodénum, pancréas) et
-focus.png (pancréas sain / avec cancer).
Usage : python3 scripts/brand/clean_pancreas_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/pancreas/pancreas-cancer.webp'
DST = 'public/images/pancreas/pancreas-propre'

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
bluish = ((b > r + 5) & (XX < 768) & (YY > 120)).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(bluish)
labels = np.zeros((H, W), bool)
for i in range(1, n):
    x, y, w, h, a = st[i]
    if a > 5000:
        labels |= lab == i
full = grow(labels, 13)  # pastille, trait, point et tout leur liseré
# ailleurs : la pastille + son liseré blanc seulement (un organe voisin, rose ou rouge, n'est pas touché)
near_white = src.min(axis=2) > 225
labels = full & (grow(bluish.astype(bool), 3) | near_white)
navy = (b > 120) & (r < 90) & (g < 130) & (b - r > 70)  # traits et points (bleu franc)
BOX = [rect(49, 183, 200, 242), rect(580, 227, 764, 285), rect(11, 339, 178, 434), rect(548, 693, 765, 757), rect(11, 822, 237, 954)]
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


# la pastille « Vésicule biliaire », posée sur le foie : le long du bord du foie (direction (-0,4 ; 1))
ves = full & rect(0, 330, 190, 445) & ~lines
fill_along(ves, (-0.4, 1), full)
boxes &= ~rect(0, 330, 190, 445)
# la pastille « Duodénum » cache un bout du bord du duodénum : repris le long de sa courbe
duo = full & rect(150, 812, 248, 890) & ~lines
fill_along(duo, (1, 0.75), full)
boxes &= ~duo
# les autres pastilles, sur le fond blanc
left = directional_bg(boxes, (0, 1))
inpaint(left, 7)

# traits et points : comblés en travers du trait (le bord d'organe qu'ils croisent est gardé)
LINE_DIRS = [  # (zone, direction perpendiculaire au trait)
    (rect(140, 225, 235, 320), (56, -47)),  # foie
    (rect(130, 415, 215, 500), (45, -40)),  # vésicule
    (rect(570, 270, 670, 395), (87, 56)),  # estomac
    (rect(570, 590, 650, 715), (85, -35)),  # pancréas
    (rect(100, 720, 195, 840), (83, 50)),  # duodénum
]
done = np.zeros((H, W), bool)
for zone, d in LINE_DIRS:
    m = lines & zone
    fill_along(m, d, lines)
    done |= m
inpaint(lines & ~done, 6)

# 2. cône rose vers l'encadré : passé en blanc là où il est sur le fond
cone = np.zeros((H, W), np.uint8)
cv2.fillPoly(cone, [np.array([(620, 700), (690, 390), (790, 370), (790, 720)], np.int32)], 255)
cone = cone > 0
pinkbg = (r > 228) & (g > 175) & (b > 200) & (r - g > 6)
img[cone & pinkbg] = 255

# 3. titre : fond blanc
img[0:118, 140:1400] = 255

# 4. partie droite : seuls les deux pancréas restent (traits roses près de la tumeur retirés)
keep = rect(800, 240, 1272, 478) | rect(805, 462, 1272, 692)
img[(XX >= 768) & ~keep] = 255
spark = (r > 200) & (g < 120) & (b > 140) & (XX >= 1240) & (YY < 500)
img[grow(spark, 11) & ~((r < 250) & (g > 140) & (b < 120))] = 255  # le jaune du pancréas n'est pas touché

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
anat = out.copy()
anat[:, 768:] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
focus = out.copy()
focus[:, :768] = 255
cv2.imwrite(DST + '-focus.png', focus)
# chaque pancréas seul (ils se touchent presque : une découpe rectangulaire attrapait un bout de l'autre)
nonwhite = (focus.min(axis=2) < 240).astype(np.uint8)
n, lab, st, cen = cv2.connectedComponentsWithStats(nonwhite)
big = sorted(range(1, n), key=lambda i: -st[i][4])[:2]
big.sort(key=lambda i: cen[i][1])  # du haut (sain) vers le bas (cancer)
for name, i in zip(('sain', 'cancer'), big):
    m = cv2.dilate((lab == i).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    one = np.full_like(focus, 255)
    one[m] = focus[m]
    cv2.imwrite(DST + '-' + name + '.png', one)
print('écrit', DST + '-anatomie.png', 'et', DST + '-focus.png')
