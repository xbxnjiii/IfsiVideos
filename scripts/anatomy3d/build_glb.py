"""Prépare les modèles 3D anatomiques (BodyParts3D 4.0) pour Remotion / Three.js.

Données : https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/
  - partof_BP3D_4.0_obj_99.zip (maillages OBJ, déjà allégés à 99 %)
  - partof_element_parts.txt (concept FMA → fichiers FJxxxx.obj)
Licence : « BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0
International » (crédit obligatoire dans la description des vidéos).

Usage :
  python3 scripts/anatomy3d/build_glb.py <dossier_bp3d> public/anatomy3d

Sortie : un .glb par système (peau, squelette, artères, veines, cœur, poumons, bronches, diaphragme),
repère Three.js (Y vers le haut, mètres), centré sur l'axe du corps, sol à y = 0.
"""
import json
import os
import sys
from collections import defaultdict

import fast_simplification
import numpy as np
import trimesh

SRC, DST = sys.argv[1], sys.argv[2]
OBJ = os.path.join(SRC, "obj4", "partof_BP3D_4.0_obj_99")


def load_tables():
    rows = [l.rstrip("\n").split("\t") for l in open(os.path.join(SRC, "partof_element_parts.txt"), encoding="utf-8", errors="replace")][1:]
    concept_elems, name = defaultdict(set), {}
    for c, n, fj in rows:
        concept_elems[c].add(fj)
        name[c] = n
    leaf = {}
    for c, els in concept_elems.items():
        for fj in els:
            if fj not in leaf or len(els) < len(concept_elems[leaf[fj]]):
                leaf[fj] = c
    return concept_elems, name, {fj: name[c] for fj, c in leaf.items()}


CONCEPTS, NAMES, LEAF = load_tables()
BY_NAME = {n: c for c, n in NAMES.items()}


def elems(*concepts):
    out = set()
    for n in concepts:
        out |= CONCEPTS[BY_NAME[n]]
    return out


def load(fjs):
    """Fusionne des fichiers OBJ (mm, Z vers le haut) en un maillage."""
    vs, fs, off = [], [], 0
    for fj in sorted(fjs):
        p = os.path.join(OBJ, fj + ".obj")
        if not os.path.exists(p):
            continue
        m = trimesh.load(p, force="mesh", process=False)
        vs.append(np.asarray(m.vertices))
        fs.append(np.asarray(m.faces) + off)
        off += len(m.vertices)
    return np.vstack(vs), np.vstack(fs)


def simplify(v, f, target):
    if len(f) <= target:
        return v, f
    v2, f2 = fast_simplification.simplify(v.astype(np.float32), f.astype(np.int32), target_reduction=1 - target / len(f))
    return v2, f2


# repère : BodyParts3D (mm, X = gauche du patient ?, Y = arrière, Z = haut) → Three.js (m, Y haut, Z vers la caméra)
SKIN_V, _ = load(elems("skin"))
CENTER = np.array([SKIN_V[:, 0].mean(), SKIN_V[:, 1].mean(), SKIN_V[:, 2].min()])


def to_three(v):
    c = v - CENTER
    return np.stack([c[:, 0], c[:, 2], -c[:, 1]], axis=1) / 1000.0


def export(name, fjs, target, extra=None):
    v, f = load(fjs)
    v, f = simplify(v, f, target)
    mesh = trimesh.Trimesh(vertices=to_three(v), faces=f, process=True)
    trimesh.repair.fix_normals(mesh, multibody=True)
    path = os.path.join(DST, name + ".glb")
    mesh.export(path)
    info = {"faces": int(len(mesh.faces)), "kb": os.path.getsize(path) // 1024, "parts": len(fjs)}
    if extra:
        info.update(extra)
    print(f"{name:12s} {info}")
    return info


def by_leaf(fjs, pred):
    return {fj for fj in fjs if pred(LEAF.get(fj, ""))}


os.makedirs(DST, exist_ok=True)
manifest = {}
heart = elems("heart")
lungs = elems("right lung", "left lung")
arteries = elems("systemic arterial tree") | elems("pulmonary arterial tree")
veins = elems("systemic venous system") | elems("pulmonary vascular system") - elems("pulmonary arterial tree")
bronchi = elems("tracheobronchial tree")

manifest["skin"] = export("skin", elems("skin"), 160000)
manifest["skeleton"] = export("skeleton", elems("skeletal system"), 160000)
# cœur : paroi (myocarde), artères coronaires, veines cardiaques — séparés pour les couleurs et l'animation
h_art = by_leaf(heart, lambda n: "artery" in n or "arterial" in n or "branch" in n)
h_vein = by_leaf(heart, lambda n: "vein" in n or "sinus" in n)
h_wall = heart - h_art - h_vein
manifest["heart"] = export("heart", h_wall, 60000)
manifest["heart_arteries"] = export("heart_arteries", h_art, 16000)
manifest["heart_veins"] = export("heart_veins", h_vein, 10000)
# vaisseaux du corps (hors cœur et hors intérieur des poumons pour garder les poumons lisibles)
manifest["arteries"] = export("arteries", arteries - heart - lungs, 140000)
manifest["veins"] = export("veins", veins - heart - lungs, 90000)
manifest["pulmonary"] = export("pulmonary", (elems("pulmonary vascular system") & lungs), 40000)
# poumons : la 4.0 ne contient pas la surface des lobes → lobes de la version 3.0 (même modèle, même repère,
# licence CC BY-SA 2.1 JP), clone https://github.com/Kevin-Mattheus-Moerman/BodyParts3D dans <dossier_bp3d>/repo
STL = os.path.join(SRC, "repo", "assets", "BodyParts3D_data", "stl")
LOBES = {"FMA7333": "upper lobe of right lung", "FMA7383": "middle lobe of lung", "FMA7337": "lower lobe of right lung", "FMA7370": "upper lobe of left lung", "FMA7371": "lower lobe of left lung"}
vs, fs, off = [], [], 0
for fma in LOBES:
    m = trimesh.load(os.path.join(STL, fma + ".stl"), force="mesh")
    vs.append(np.asarray(m.vertices))
    fs.append(np.asarray(m.faces) + off)
    off += len(m.vertices)
v, f = simplify(np.vstack(vs), np.vstack(fs), 70000)
lung_mesh = trimesh.Trimesh(vertices=to_three(v), faces=f, process=True)
lung_mesh.export(os.path.join(DST, "lungs.glb"))
manifest["lungs"] = {"faces": int(len(lung_mesh.faces)), "kb": os.path.getsize(os.path.join(DST, "lungs.glb")) // 1024, "parts": 5, "source": "BodyParts3D 3.0 (CC BY-SA 2.1 JP)"}
print("lungs", manifest["lungs"])
manifest["bronchi"] = export("bronchi", bronchi, 40000)
manifest["diaphragm"] = export("diaphragm", elems("diaphragm"), 8000)
manifest["_credit"] = (
    "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International ; "
    "poumons : BodyParts3D 3.0, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan"
)
json.dump(manifest, open(os.path.join(DST, "manifest.json"), "w"), ensure_ascii=False, indent=1)
