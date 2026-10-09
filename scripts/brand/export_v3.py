"""Intègre les personnages découpés des planches v3 dans la bibliothèque de la mascotte.

Usage : python3 export_v3.py dossier_png public/brand/mascotte docs/lpi/mascotte-index.webp
  - chaque PNG devient <catégorie>/<nom>.webp (900 px max), en REMPLAÇANT l'ancienne image du même nom ;
  - les anciennes images remplacées par une nouvelle d'un autre nom sont supprimées (SUPPRIMEES) ;
  - le manifeste (tailles) et l'index visuel sont régénérés à partir des fichiers présents.
"""
import json, os, shutil, sys
from PIL import Image, ImageDraw, ImageFont

src, dst, index_path = sys.argv[1:4]
CATS = ["maitre", "poses", "expressions", "symptomes", "gestes", "situations", "accessoires", "elements"]
# ancienne clé -> nouvelle clé qui la remplace
SUPPRIMEES = {
    "expressions/sourire-leger": "expressions/neutre",
    "expressions/grand-sourire": "expressions/joyeuse",
    "expressions/decue": "expressions/triste",
    "situations/felicite": "expressions/coeur-mains",
    "accessoires/schema-ecg": "situations/montre-ecg",
    "accessoires/ordinateur": "situations/travaille",
    "maitre/trois-quarts-gauche": "maitre/trois-quarts-1",
    "maitre/profil-gauche": "maitre/profil",
    "maitre/profil-droit": "maitre/profil",
    "maitre/trois-quarts-droit": "maitre/trois-quarts-3",
}
ALIAS = {"poses/debout": "maitre/face"}

n = 0
for cat in os.listdir(src):
    for f in sorted(os.listdir(os.path.join(src, cat))):
        im = Image.open(os.path.join(src, cat, f)).convert("RGBA")
        if max(im.size) > 900:
            k = 900 / max(im.size)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        os.makedirs(os.path.join(dst, cat), exist_ok=True)
        im.save(os.path.join(dst, cat, f[:-4] + ".webp"), "WEBP", quality=92, method=6)
        n += 1
for a, b in ALIAS.items():
    shutil.copy(os.path.join(dst, b + ".webp"), os.path.join(dst, a + ".webp"))
for old in SUPPRIMEES:
    p = os.path.join(dst, old + ".webp")
    if os.path.exists(p):
        os.remove(p)
        print("supprimée :", old)

manifest = {}
for cat in CATS:
    d = os.path.join(dst, cat)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if f.endswith(".webp"):
            w, h = Image.open(os.path.join(d, f)).size
            manifest[f"{cat}/{f[:-5]}"] = {"w": w, "h": h}
json.dump(manifest, open(os.path.join(dst, "manifest.json"), "w"), indent=1, ensure_ascii=False)

# index visuel (fond blanc cassé de la charte)
cell, lab, cols = 200, 28, 10
rows = []
for cat in CATS:
    ks = [k for k in manifest if k.startswith(cat + "/")]
    for i in range(0, len(ks), cols):
        rows.append((cat if i == 0 else "", ks[i:i + cols]))
W, H = cols * cell + 190, len(rows) * (cell + lab)
sheet = Image.new("RGB", (W, H), "#F8F9FC")
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
except Exception:
    font = bold = None
for r, (cat, ks) in enumerate(rows):
    y = r * (cell + lab)
    if cat:
        d.text((12, y + 12), cat.upper(), fill="#4E7AC7", font=bold)
    for c, k in enumerate(ks):
        im = Image.open(os.path.join(dst, k + ".webp")).convert("RGBA")
        im.thumbnail((cell - 16, cell - 16))
        x = 190 + c * cell
        sheet.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        d.text((x + 6, y + cell + 2), k.split("/")[1], fill="#2D3A5A", font=font)
sheet.save(index_path, "WEBP", quality=88)
print(n, "images intégrées,", len(manifest), "dans la bibliothèque")
