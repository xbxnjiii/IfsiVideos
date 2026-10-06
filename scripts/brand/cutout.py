"""Détoure des éléments d'une planche (fond uni clair) : remplissage depuis les bords + matte doux.

Usage : ISNET_MODEL=isnet-anime.onnx python3 cutout.py planche_x4.png crops.json dossier_sortie 4
  crops.json : {"nom": [x0, y0, x1, y1(, seuil_bas, seuil_haut)]} en pixels de la planche d'ORIGINE.
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

def cutout(rgb, t_lo=14, t_hi=46):
    h, w, _ = rgb.shape
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    d = np.sqrt(((rgb - bg) ** 2).sum(-1))
    near = d < t_hi
    lab, _ = ndimage.label(near)
    edge_labels = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge_labels = edge_labels[edge_labels > 0]
    region = np.isin(lab, edge_labels)          # fond + halo, reliés aux bords
    # zones claires enfermées (entre deux mèches…) : le modèle de segmentation tranche
    seg = seg_mask(rgb)
    for k in np.unique(lab[near & ~region]):
        comp = lab == k
        if comp.sum() > 60 and seg[comp].mean() < 0.5:
            region |= comp
    alpha = np.ones((h, w), np.float32)
    soft = np.clip((d - t_lo) / (t_hi - t_lo), 0, 1)
    alpha[region] = soft[region]
    # décontamination : retire la teinte du fond dans les pixels semi-transparents
    a = alpha[..., None]
    col = np.where(a > 0.02, (rgb - (1 - a) * bg) / np.maximum(a, 0.02), rgb)
    col = np.clip(col, 0, 255)
    return np.dstack([col, alpha * 255]).astype(np.uint8), bg

def main():
    src, spec, outdir, scale = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    for name, box in json.load(open(spec)).items():
        x0, y0, x1, y1 = box[:4]
        t_lo, t_hi = (box[4], box[5]) if len(box) > 4 else (14, 46)
        crop = im[y0 * scale:y1 * scale, x0 * scale:x1 * scale]
        rgba, bg = cutout(crop, t_lo, t_hi)
        a = rgba[..., 3]
        ys, xs = np.where(a > 8)
        pad = 12
        yy0, yy1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + pad)
        xx0, xx1 = max(0, xs.min() - pad), min(a.shape[1], xs.max() + pad)
        out = Image.fromarray(rgba[yy0:yy1, xx0:xx1])
        out.save(f"{outdir}/{name}.png", optimize=True)
        print(name, out.size, "fond", bg.round())

main()
