"""Nettoie le schéma « La vessie et le cancer de la vessie » fourni par le propriétaire (demandé : pas d'annotations
dans la vidéo).

Retire le titre, les 4 étiquettes (rein, uretère, vessie, urètre) avec leurs traits et leurs points, le cône rose vers
l'encadré, le cadre « Focus », les légendes, les traits roses autour de la tumeur et l'encadré d'info.
- étiquettes posées sur la silhouette du corps : comblées de haut en bas avec les seuls pixels de fond (`directional_bg`) ;
- là où un point ou un trait touche un organe : rein et paroi de la vessie repris en miroir de l'autre côté (axes mesurés
  x = 461 pour les reins, 451 pour la vessie), uretère et urètre comblés en suivant leur direction ;
- cône rose : repris en miroir sur la vessie, de haut en bas sur le fond ;
- traits roses autour de la tumeur : la paroi est reprise de la vessie saine (même dessin, décalé de 360 px).
Écrit deux calques dans le même repère (1536 × 1024) : -anatomie.png (reins → urètre dans le corps) et -focus.png
(vessie saine / avec cancer).
Usage : python3 scripts/brand/clean_vessie_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/vessie/vessie-cancer.webp'
DST = 'public/images/vessie/vessie-propre'

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
    """Recompose les pixels de `mask` en suivant la direction `d` : on part dans les deux sens jusqu'à sortir du masque et
    on mélange les deux pixels propres trouvés (pondérés par la distance)."""
    n = (d[0] ** 2 + d[1] ** 2) ** 0.5
    dx, dy = d[0] / n, d[1] / n
    out = img.copy()
    for y, x in zip(*np.nonzero(mask)):
        x0, y0, t0 = walk(mask, y, x, dx, dy, 1)
        x1, y1, t1 = walk(mask, y, x, dx, dy, -1)
        out[y, x] = (img[y0, x0] * t1 + img[y1, x1] * t0) / (t0 + t1)
    img[mask] = out[mask]


def is_bg(c):
    """Fond chair pâle ou blanc (pas un organe)."""
    return c[1] > 200 and c[2] > 225 and c[0] > 190


def directional_bg(mask, d):
    """Comme `directional`, mais ne garde que les pixels de fond ; renvoie les pixels sans fond d'un côté ni de l'autre
    (ils tombent sur un organe : comblés ensuite autrement)."""
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


def mirror(mask, axis):
    ys, xs = np.nonzero(mask)
    mx = np.clip(np.round(2 * axis - xs).astype(int), 0, W - 1)
    img[ys, xs] = img[ys, mx]


def axis_rows(a0, y0, a1, y1):
    """Axe de symétrie qui glisse d'une ligne à l'autre (le dessin n'est pas tout à fait symétrique)."""
    return np.interp(np.arange(H), [y0, y1], [a0, a1])[:, None]


def feather_mirror(mask, axis, grow=3):
    """Miroir avec un fondu de quelques pixels sur le bord du masque (`axis` : un nombre ou un axe par ligne)."""
    m = cv2.dilate(mask.astype(np.uint8), np.ones((2 * grow + 1, 2 * grow + 1), np.uint8)).astype(float)
    k = np.minimum(cv2.GaussianBlur(m, (0, 0), grow / 2) * 1.6, 1) * (m > 0)
    k = np.maximum(k, mask)[:, :, None]
    mx = np.clip(np.round(2 * axis - XX).astype(int), 0, W - 1)
    mir = img[YY, mx]
    img[:] = mir * k + img * (1 - k)


# 1. les 4 étiquettes (pastille bleu clair + texte + trait + point, tout est bleuté) et leur liseré blanc
bluish = ((b > r + 5) & (XX < 770) & (YY > 110)).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(bluish)
LABELS = {}
for i in range(1, n):
    x, y, w, h, a = st[i]
    if a > 5000 and x < 100:  # les 4 pastilles sont collées au bord gauche (la veine cave est au milieu)
        m = cv2.dilate((lab == i).astype(np.uint8), np.ones((13, 13), np.uint8)) > 0
        LABELS[y] = m
assert len(LABELS) == 4, LABELS.keys()
rein, uretere, vessie, uretre = [LABELS[k] for k in sorted(LABELS)]

# rein : tout ce qui, en miroir, tombe sur le rein droit est repris en miroir (le bord du rein est ainsi gardé)
mx = np.clip(np.round(2 * 461 - XX).astype(int), 0, W - 1)
mirsrc = src[YY, mx]
on_kid = ~((mirsrc[:, :, 1] > 200) & (mirsrc[:, :, 2] > 225) & (mirsrc[:, :, 0] > 190))
kid = rein & rect(150, 150, 420, 300) & (cv2.dilate(on_kid.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0)
feather_mirror(kid, 461)
rein &= ~kid
# fond d'abord (de haut en bas : la silhouette du corps varie doucement et ses bords sont presque verticaux)
left = np.zeros((H, W), bool)
for m in (rein, uretere, vessie, uretre):
    left |= directional_bg(m, (0, 1))
# raccords adoucis sur le fond (sinon un léger trait vertical reste au bord des pastilles)
labels = rein | uretere | vessie | uretre
blur = cv2.GaussianBlur(img, (0, 0), 4)
edge = (cv2.dilate(labels.astype(np.uint8), np.ones((17, 17), np.uint8)) > 0) & ~(cv2.erode(labels.astype(np.uint8), np.ones((17, 17), np.uint8)) > 0)
edge &= (img[:, :, 1] > 200) & (img[:, :, 2] > 225) & (blur[:, :, 1] > 200) & (YY < 1000)
img[edge] = blur[edge]

# là où le point / le trait touche un organe
BAND = rect(276, 690, 352, 716) | rect(548, 690, 632, 716)  # ligne où le trait (à gauche) et le cône (à droite) se croisent

ure = left & rect(250, 430, 380, 560)
directional(cv2.dilate(ure.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0, (-0.32, 1))  # l'uretère descend en biais
bla = left & rect(270, 640, 360, 780) & ~BAND
band = (left & BAND).copy()
feather_mirror(bla, axis_rows(454, 640, 451.5, 730))
urt = left & rect(380, 860, 520, 990)
directional(cv2.dilate(urt.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0, (0, 1))  # l'urètre est vertical
rest = left & ~(rect(150, 150, 420, 300) | rect(250, 430, 380, 560) | rect(270, 640, 360, 780) | rect(380, 860, 520, 990))
if rest.any():
    u8 = img.clip(0, 255).astype(np.uint8)
    img[:] = cv2.inpaint(u8, rest.astype(np.uint8) * 255, 6, cv2.INPAINT_TELEA).astype(float)

# 2. cône rose vers l'encadré (rose clair + liseré blanc) : miroir sur la vessie, de haut en bas sur le fond
cone = np.zeros((H, W), np.uint8)
cv2.fillPoly(cone, [np.array([(552, 712), (552, 694), (790, 470), (790, 716)], np.int32)], 255)
cone = cv2.dilate(cone, np.ones((5, 5), np.uint8)) > 0
pinkish = (src[:, :, 0] > src[:, :, 1] + 12) | (src.min(axis=2) > 235)  # rose (bleu > vert) ou blanc du liseré
cone &= cv2.dilate(pinkish.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
feather_mirror(cone & (XX < 640) & ~BAND, axis_rows(454, 640, 451.5, 730))
band |= cone & BAND
band = cv2.dilate(band.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
band &= BAND | rect(270, 686, 640, 720)
directional(band, (0, 1))  # les parois de la vessie sont presque verticales à cette hauteur
left = directional_bg(cone & (XX >= 640), (0, 1))
if left.any():
    u8 = img.clip(0, 255).astype(np.uint8)
    img[:] = cv2.inpaint(u8, left.astype(np.uint8) * 255, 6, cv2.INPAINT_TELEA).astype(float)

# 3. titre : fond blanc
img[0:110, 180:1380] = 255

# 4. partie droite : seules les deux vessies restent
keep = rect(790, 245, 1135, 590) | rect(1148, 245, 1482, 582)
img[(XX >= 768) & ~keep] = 255
# traits roses (et leur liseré blanc) autour de la tumeur : repris en miroir de la paroi gauche (axe x ≈ 1311)
spark = ((r > 200) & (g < 110) & (b > 140) & (XX >= 1420)).astype(np.uint8)
spark = cv2.dilate(spark, np.ones((15, 15), np.uint8)) > 0
feather_mirror(spark, axis_rows(1313, 354, 1309.5, 515), grow=4)

out = img.clip(0, 255).astype(np.uint8)
out[out.min(axis=2) > 246] = 255
anat = out.copy()
anat[:, 768:] = 255
cv2.imwrite(DST + '-anatomie.png', anat)
focus = out.copy()
focus[:, :768] = 255
cv2.imwrite(DST + '-focus.png', focus)
print('écrit', DST + '-anatomie.png', 'et', DST + '-focus.png')
