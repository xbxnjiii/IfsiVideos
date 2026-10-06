"""Agrandit une image ×4 avec Real-ESRGAN (modèle anime, adapté aux illustrations), par tuiles.

Usage : python3 upscale.py RealESRGAN_x4plus_anime_6B.pth entree.png sortie.png
Modèle : https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth
Dépendances : torch (CPU suffit), spandrel, pillow, numpy.
"""
import sys, numpy as np, torch
from PIL import Image
from spandrel import ModelLoader
model = ModelLoader().load_from_file(sys.argv[1]).eval()
torch.set_num_threads(4)
img = np.asarray(Image.open(sys.argv[2]).convert("RGB")).astype(np.float32) / 255
H, W, _ = img.shape
S, T, O = model.scale, 192, 16
out = np.zeros((H * S, W * S, 3), np.float32)
for y in range(0, H, T):
    for x in range(0, W, T):
        y0, x0 = max(0, y - O), max(0, x - O)
        y1, x1 = min(H, y + T + O), min(W, x + T + O)
        tile = torch.from_numpy(img[y0:y1, x0:x1].transpose(2, 0, 1))[None]
        with torch.no_grad():
            r = model(tile)[0].clamp(0, 1).numpy().transpose(1, 2, 0)
        oy, ox = (y - y0) * S, (x - x0) * S
        h, w = min(T, H - y) * S, min(T, W - x) * S
        out[y * S:y * S + h, x * S:x * S + w] = r[oy:oy + h, ox:ox + w]
    print("ligne", y, "/", H, flush=True)
Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(sys.argv[3])
