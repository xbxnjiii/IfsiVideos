"""Agrandit ×4 une planche DÉJÀ détourée (RGBA) avec Real-ESRGAN (modèle anime) :
couleurs sur fond blanc + masque alpha agrandis séparément, puis le blanc est retiré des bords
semi-transparents (décontamination).

Usage : python3 upscale_rgba.py RealESRGAN_x4plus_anime_6B.pth planche.webp sortie_x4.png
Dépendances : torch (CPU suffit), spandrel, pillow, numpy.
"""
import sys
import numpy as np
import torch
from PIL import Image
from spandrel import ModelLoader

model = ModelLoader().load_from_file(sys.argv[1]).eval()
torch.set_num_threads(4)


def up(img):
    """img float32 HxWx3 (0..1) → ×4"""
    H, W, _ = img.shape
    S, T, O = model.scale, 192, 16
    out = np.zeros((H * S, W * S, 3), np.float32)
    for y in range(0, H, T):
        for x in range(0, W, T):
            y0, x0 = max(0, y - O), max(0, x - O)
            y1, x1 = min(H, y + T + O), min(W, x + T + O)
            tile = torch.from_numpy(img[y0:y1, x0:x1].transpose(2, 0, 1).copy())[None]
            with torch.no_grad():
                r = model(tile)[0].clamp(0, 1).numpy().transpose(1, 2, 0)
            oy, ox = (y - y0) * S, (x - x0) * S
            h, w = min(T, H - y) * S, min(T, W - x) * S
            out[y * S:y * S + h, x * S:x * S + w] = r[oy:oy + h, ox:ox + w]
        print('ligne', y, '/', H, flush=True)
    return out


rgba = np.asarray(Image.open(sys.argv[2]).convert('RGBA')).astype(np.float32) / 255
a = rgba[..., 3:4]
rgb_white = rgba[..., :3] * a + (1 - a)          # couleurs posées sur blanc
rgb4 = up(rgb_white)
a4 = up(np.repeat(a, 3, axis=2)).mean(axis=2, keepdims=True)
a4 = np.clip((a4 - 0.04) / 0.92, 0, 1)            # bords nets, fond vraiment transparent
# décontamination du blanc dans les pixels semi-transparents
col = np.where(a4 > 0.02, (rgb4 - (1 - a4)) / np.maximum(a4, 0.02), rgb4)
col = np.clip(col, 0, 1)
out = np.dstack([col, a4])
Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA').save(sys.argv[3])
print('ok', sys.argv[3])
