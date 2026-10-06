"""Exporte un PNG détouré en WebP qualité 92 (hauteur max en px). Usage : export_webp.py in.png out.webp 900"""
import sys
from PIL import Image
src, dst, max_h = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert("RGBA")
if im.height > max_h:
    im = im.resize((round(im.width * max_h / im.height), max_h), Image.LANCZOS)
im.save(dst, "WEBP", quality=92, method=6)
print(dst, im.size)
