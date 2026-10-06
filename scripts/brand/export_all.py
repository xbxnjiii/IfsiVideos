import json, os, sys
from PIL import Image, ImageDraw, ImageFont
src, dst, manifest_path, index_path = sys.argv[1:5]
manifest = {}
cats = ["maitre", "expressions", "gestes", "situations", "poses", "accessoires", "elements", "details", "logo"]
for cat in cats:
    d = os.path.join(src, cat)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not f.endswith(".png"):
            continue
        im = Image.open(os.path.join(d, f)).convert("RGBA")
        lim = 1600 if cat == "logo" else 900
        if max(im.size) > lim:
            k = lim / max(im.size)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        os.makedirs(os.path.join(dst, cat), exist_ok=True)
        name = f[:-4]
        im.save(os.path.join(dst, cat, name + ".webp"), "WEBP", quality=92, method=6)
        manifest[f"{cat}/{name}"] = {"w": im.width, "h": im.height}
json.dump(manifest, open(manifest_path, "w"), indent=1, ensure_ascii=False)
# planche index (fond blanc cassé de la charte)
cell, lab = 220, 30
cols = 8
keys = list(manifest)
rows = []
for cat in cats:
    ks = [k for k in keys if k.startswith(cat + "/")]
    for i in range(0, len(ks), cols):
        rows.append((cat if i == 0 else "", ks[i:i + cols]))
W = cols * cell + 180
H = len(rows) * (cell + lab)
sheet = Image.new("RGB", (W, H), "#F8F9FC")
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except Exception:
    font = bold = None
for r, (cat, ks) in enumerate(rows):
    y = r * (cell + lab)
    if cat:
        d.text((12, y + 12), cat.upper(), fill="#4E7AC7", font=bold)
    for c, k in enumerate(ks):
        im = Image.open(os.path.join(dst, k + ".webp")).convert("RGBA")
        im.thumbnail((cell - 20, cell - 20))
        x = 180 + c * cell
        sheet.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        d.text((x + 8, y + cell + 2), k.split("/")[1], fill="#2D3A5A", font=font)
sheet.save(index_path, optimize=True)
print(len(manifest), "éléments")
