"""Nettoie le schéma « Appareil génital masculin » fourni par le propriétaire (demandé : sans annotations, propre).

Retire le titre, les étiquettes, leurs traits et leurs points, le cône rose vers l'encadré, le cadre « Focus », les
légendes et l'encadré d'info. Les dessins ne sont pas redessinés : là où un trait traversait un organe, on recopie le
côté opposé du schéma en miroir (il est symétrique autour de l'urètre, x = 570), ou on comble le long des structures
verticales (verge, cordons). Usage : python3 scripts/brand/clean_prostate_diagram.py
"""
import cv2
import numpy as np

SRC = 'public/images/prostate/appareil-masculin.webp'
DST = 'public/images/prostate/appareil-propre.png'  # préfixe : -anatomie.png et -focus.png sont écrits
AXIS = 569  # axe de symétrie (urètre), mesuré sur les bords de la prostate

img = cv2.imread(SRC, cv2.IMREAD_COLOR)  # BGR
ORIG = img.copy()
H, W = img.shape[:2]
WHITE = (255, 255, 255)

# 1. zones à vider entièrement (fond blanc) : titre, pastilles d'étiquettes, cadre Focus, légendes, encadré d'info
for x0, y0, x1, y1 in [
    (250, 10, 1290, 125),
    (45, 215, 305, 300),
    (45, 365, 305, 485),
    (95, 525, 340, 610),
    (125, 655, 340, 740),
    (60, 815, 318, 900),
    (920, 212, 1475, 305),
    (925, 560, 1165, 665),
    (1215, 560, 1490, 665),
    (840, 720, 1530, 955),
]:
    cv2.rectangle(img, (x0, y0), (x1, y1), WHITE, -1)


def stroke(pts, width, dot):
    m = np.zeros((H, W), np.uint8)
    cv2.line(m, pts[0], pts[1], 255, width)
    cv2.circle(m, pts[1], dot, 255, -1)
    return m > 0


def mirror(sel):
    """Remplace les pixels de `sel` par ceux du côté opposé du schéma (symétrie autour de AXIS)."""
    ys, xs = np.nonzero(sel)
    src = np.clip(2 * AXIS - xs, 0, W - 1)
    img[ys, xs] = img[ys, src]


def vertical(sel):
    """Comble les pixels de `sel` en interpolant entre le pixel au-dessus et le pixel au-dessous."""
    a = img.astype(float)
    for x in np.nonzero(sel.any(axis=0))[0]:
        col = sel[:, x]
        y = 0
        while y < H:
            if col[y]:
                y0 = y
                while y < H and col[y]:
                    y += 1
                lo, hi = max(0, y0 - 1), min(H - 1, y)
                for k in range(y0, y):
                    t = (k - lo) / max(1, hi - lo)
                    a[k, x] = a[lo, x] * (1 - t) + a[hi, x] * t
            else:
                y += 1
    img[:] = a.clip(0, 255).astype(np.uint8)


left = np.zeros((H, W), bool)
left[:, :AXIS - 12] = True

# 2. cône rose (calque translucide) vers l'encadré : on retire la teinte par calcul (« dé-mélange ») ; le cordon et le
#    bord de la prostate qu'il recouvre retrouvent leurs vraies couleurs. Rose du cône ≈ (250, 100, 175) en RVB.
P = np.array([175, 100, 250], float)  # BGR
tri = np.zeros((H, W), np.uint8)
cv2.fillPoly(tri, [np.array([(690, 540), (690, 618), (910, 655), (910, 380)], np.int32)], 255)
t = tri > 0
f = img.astype(float)
bb, gg, rr = f[:, :, 0], f[:, :, 1], f[:, :, 2]
bg = t & (rr > 235) & (bb > 195) & (gg > 140)  # fond blanc teinté
alpha = np.zeros((H, W), float)
alpha[bg] = np.clip((255 - gg[bg]) / 155, 0, 0.85)
hole = (t & ~bg).astype(np.uint8) * 255
alpha = cv2.inpaint((alpha * 255).astype(np.uint8), hole, 9, cv2.INPAINT_TELEA).astype(float) / 255
alpha[~t] = 0
a3 = alpha[:, :, None]
f = np.where(t[:, :, None], (f - a3 * P) / np.maximum(1 - a3, 0.15), f)
img[:] = f.clip(0, 255).astype(np.uint8)
img[bg] = WHITE


def disk(cx, cy, rad):
    m = np.zeros((H, W), np.uint8)
    cv2.circle(m, (cx, cy), rad, 255, -1)
    return m > 0


# 3. étiquette « Prostate » : le trait (fin) croise le bord du lobe gauche, presque vertical : comblé de haut en bas.
#    Les deux points (bleu à gauche, rose à droite) sont presque en face l'un de l'autre : chacun est recopié du lobe
#    opposé là où celui-ci est propre, la petite bande commune est comblée de haut en bas.
rows = np.arange(H)[:, None]
vertical(stroke(((300, 568), (484, 568)), 19, 0) & left)
# là où le trait croise le bord du lobe gauche (qui se courbe) : chaque ligne est recopiée d'une ligne propre voisine,
# décalée pour suivre le bord (repéré à x 462 en y 558 et à x 471 en y 576)
for y in range(556, 580):
    ref = 556 if y < 567 else 579
    e = lambda yy: 462 + (471 - 462) * (yy - 558) / (576 - 558)
    dx = int(round(e(y) - e(ref)))
    for x in range(436, 486):
        img[y, x] = ORIG[ref, min(W - 1, max(0, x - dx))]
dl = disk(498, 568, 16)
mirror(dl & (rows <= 568))
vertical(dl & (rows > 568))
# côté droit : point rose + pointe du cône sur le bord du lobe → recopiés du lobe gauche, désormais propre
zone = np.zeros((H, W), bool)
zone[548:608, 626:690] = True
mirror(zone)

# 4. étiquette « Urètre » : le trait sur le cordon gauche est recopié du côté droit ; sur la verge (verticale), comblé de
#    haut en bas ; étiquettes « Vessie », « Vésicule séminale », « Testicule » : recopiées du côté droit
ure = stroke(((318, 697), (557, 697)), 34, 27)
cols = np.arange(W)[None, :]
mirror(ure & (cols < 528))
vertical(ure & (cols >= 528))
for pts in [((280, 262), (482, 314)), ((280, 422), (377, 452)), ((300, 864), (416, 881))]:
    mirror(stroke(pts, 32, 28) & left)

# 5. reste de trait bleu nuit éventuel (bords anticrénelés) : diffusion
b, g, r = [img[:, :, i].astype(int) for i in range(3)]
navy = ((b > 80) & (r < 110) & (g < 130) & (b - r > 40)).astype(np.uint8) * 255
navy[:, 870:] = 0
img[:] = cv2.inpaint(img, cv2.dilate(navy, np.ones((5, 5), np.uint8)), 6, cv2.INPAINT_TELEA)

# 6. partie droite : seuls les deux dessins de prostate restent (plus de cadre ni de fond lavande)
right = np.ones((H, W), bool)
right[:, :870] = False
right[325:560, 905:1185] = False
right[325:560, 1205:1490] = False
img[right] = WHITE
img[:, :312] = WHITE  # à gauche du schéma : plus rien
img[:, 830:870] = WHITE
light = img.min(axis=2) > 228
img[light] = WHITE

# deux calques dans le même repère : l'anatomie seule, et la comparaison prostate saine / cancer seule
anat = img.copy()
anat[:, 860:] = WHITE
cv2.imwrite(DST.replace('.png', '-anatomie.png'), anat)
focus = img.copy()
focus[:, :860] = WHITE
cv2.imwrite(DST.replace('.png', '-focus.png'), focus)
print('écrit', DST.replace('.png', '-anatomie.png'), 'et', DST.replace('.png', '-focus.png'))
