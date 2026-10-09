"""Planches contact des images rendues par stills.mjs (12 images par planche, nom de frame en haut).
Usage : python3 scripts/qa/contact_sheet.py out/stills [12]"""
import glob, os, sys
from PIL import Image, ImageDraw

d = sys.argv[1]
per = int(sys.argv[2]) if len(sys.argv) > 2 else 12
files = sorted(glob.glob(d + '/f*.png'))
for g in range(0, len(files), per):
    chunk = files[g:g + per]
    ims = [Image.open(f).convert('RGB') for f in chunk]
    w, h = ims[0].size
    w2, h2 = int(w * 0.75), int(h * 0.75)
    cols = 4
    rows = (len(ims) + cols - 1) // cols
    c = Image.new('RGB', (cols * w2 + (cols - 1) * 8, rows * (h2 + 30)), (60, 60, 60))
    dr = ImageDraw.Draw(c)
    for i, (im, f) in enumerate(zip(ims, chunk)):
        x, y = (i % cols) * (w2 + 8), (i // cols) * (h2 + 30)
        c.paste(im.resize((w2, h2)), (x, y + 30))
        dr.text((x + 6, y + 8), os.path.basename(f), fill=(255, 255, 0))
    c.save(f'{d}/planche{g // per:02d}.jpg', quality=82)
    print(f'{d}/planche{g // per:02d}.jpg')
