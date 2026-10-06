"""Détoure des éléments d'une planche (fond uni clair) : remplissage depuis les bords + matte doux.

Usage : ISNET_MODEL=isnet-anime.onnx python3 cutout.py planche_x4.png crops.json dossier_sortie 4
  crops.json : {"nom": [x0, y0, x1, y1(, seuil_bas, seuil_haut)(, "tile" | "holes")]} en pixels de la
  planche d'ORIGINE. "tile" = vignette gardée avec son fond ; "holes" = vide les trous fermés.
Les zones claires enfermées (entre deux mèches) sont tranchées par le modèle de segmentation
isnet-anime (https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-anime.onnx).
Dépendances : numpy, scipy, pillow, onnxruntime.
"""
import json, sys, numpy as np
from PIL import Image
from scipy import ndimage

import onnxruntime as ort
import os
_SESS = ort.InferenceSession(os.environ.get("ISNET_MODEL", "isnet-anime.onnx"))

def seg_mask(rgb):
    """Masque de segmentation (isnet-anime), à la taille de rgb, valeurs 0..1."""
    h, w, _ = rgb.shape
    side = max(h, w)
    canvas = np.full((side, side, 3), 255, np.float32)
    oy, ox = (side - h) // 2, (side - w) // 2
    canvas[oy:oy + h, ox:ox + w] = rgb
    small = np.asarray(Image.fromarray(canvas.astype(np.uint8)).resize((1024, 1024), Image.LANCZOS)).astype(np.float32) / 255
    x = (small - np.array([0.485, 0.456, 0.406])).transpose(2, 0, 1)[None].astype(np.float32)
    pred = _SESS.run(None, {"img": x})[0][0, 0]
    pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-9)
    big = np.asarray(Image.fromarray((pred * 255).astype(np.uint8)).resize((side, side), Image.BILINEAR)).astype(np.float32) / 255
    return big[oy:oy + h, ox:ox + w]

def cutout(rgb, t_lo=14, t_hi=46, holes=False):
    h, w, _ = rgb.shape
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    # plusieurs fonds possibles (panneau + vignette teintée) : couleurs claires du bord, regroupées
    light = border[(border.mean(1) > 200) & (border.max(1) - border.min(1) < 40)]
    centers = [bg]
    if len(light) > 20:
        c = light[np.linspace(0, len(light) - 1, 4).astype(int)].copy()
        for _ in range(8):
            lab_ = np.argmin(((light[:, None, :] - c[None]) ** 2).sum(-1), axis=1)
            c = np.array([light[lab_ == k].mean(0) if (lab_ == k).any() else c[k] for k in range(len(c))])
        centers = list(c)
    d = np.min([np.sqrt(((rgb - cc) ** 2).sum(-1)) for cc in centers], axis=0)
    def flood(d):
        lab, _ = ndimage.label(d < t_hi)
        edge_labels = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
        return lab, np.isin(lab, edge_labels[edge_labels > 0])

    lab, region = flood(d)                      # fond + halo, reliés aux bords
    # 2e passe : on réapprend les teintes de fond sur toute la zone de fond (vignettes teintées)
    pts = rgb[region & (d < t_hi)]
    if len(pts) > 200:
        pts = pts[np.linspace(0, len(pts) - 1, min(len(pts), 20000)).astype(int)]
        c = pts[np.linspace(0, len(pts) - 1, 5).astype(int)].copy()
        for _ in range(10):
            lab_ = np.argmin(((pts[:, None, :] - c[None]) ** 2).sum(-1), axis=1)
            c = np.array([pts[lab_ == k].mean(0) if (lab_ == k).any() else c[k] for k in range(len(c))])
        d = np.min([np.sqrt(((rgb - cc) ** 2).sum(-1)) for cc in list(c) + centers], axis=0)
        lab, region = flood(d)
    near = d < t_hi
    # zones claires enfermées (entre deux mèches…) : le modèle de segmentation tranche
    seg = seg_mask(rgb)
    for k in np.unique(lab[near & ~region]):
        comp = lab == k
        if comp.sum() > 60 and (holes or seg[comp].mean() < 0.5):
            region |= comp
    alpha = np.ones((h, w), np.float32)
    soft = np.clip((d - t_lo) / (t_hi - t_lo), 0, 1)
    alpha[region] = soft[region]
    # décontamination : retire la teinte du fond dans les pixels semi-transparents
    a = alpha[..., None]
    col = np.where(a > 0.02, (rgb - (1 - a) * bg) / np.maximum(a, 0.02), rgb)
    col = np.clip(col, 0, 255)
    return np.dstack([col, alpha * 255]).astype(np.uint8), bg

def drop_strays(rgba):
    """Retire les morceaux de personnages voisins coupés au bord gauche/droit du cadre."""
    a = rgba[..., 3].astype(np.float32) / 255
    lab, n = ndimage.label(a > 0.5, structure=np.ones((3, 3)))
    if n <= 1:
        return rgba
    sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
    main = int(np.argmax(sizes)) + 1
    w = a.shape[1]
    kill = np.zeros_like(a, bool)
    for k in range(1, n + 1):
        if k == main:
            continue
        ys, xs = np.where(lab == k)
        if xs.min() <= 2 or xs.max() >= w - 3 or sizes[k - 1] < 40:
            kill |= lab == k
    if kill.any():
        kill = ndimage.binary_dilation(kill, iterations=3)
        rgba = rgba.copy()
        rgba[..., 3][kill & ~(lab == main)] = 0
    return rgba


def tile(rgb):
    """Vignette rectangulaire à coins arrondis (on garde son fond)."""
    h, w, _ = rgb.shape
    r = int(min(h, w) * 0.12)
    yy, xx = np.mgrid[0:h, 0:w]
    cx = np.clip(xx, r, w - 1 - r)
    cy = np.clip(yy, r, h - 1 - r)
    inside = ((xx - cx) ** 2 + (yy - cy) ** 2) <= r * r
    return np.dstack([rgb, inside * 255]).astype(np.uint8)


def main():
    src, spec, outdir, scale = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    for name, box in json.load(open(spec)).items():
        x0, y0, x1, y1 = box[:4]
        crop = im[y0 * scale:y1 * scale, x0 * scale:x1 * scale]
        os.makedirs(os.path.dirname(f"{outdir}/{name}.png") or ".", exist_ok=True)
        if "tile" in box[4:]:
            Image.fromarray(tile(crop)).save(f"{outdir}/{name}.png", optimize=True)
            print(name, "(vignette)")
            continue
        t_lo, t_hi = (box[4], box[5]) if len(box) > 5 else (14, 46)
        rgba, bg = cutout(crop, t_lo, t_hi, holes="holes" in box[4:])
        rgba = drop_strays(rgba)
        a = rgba[..., 3]
        ys, xs = np.where(a > 8)
        pad = 12
        yy0, yy1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + pad)
        xx0, xx1 = max(0, xs.min() - pad), min(a.shape[1], xs.max() + pad)
        out = Image.fromarray(rgba[yy0:yy1, xx0:xx1])
        out.save(f"{outdir}/{name}.png", optimize=True)
        print(name, out.size)


main()
