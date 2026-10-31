#!/usr/bin/env python3
"""Squelette d'une nouvelle vidéo (après la voix) : dossier, timeline, composition, scènes et mascotte à remplir,
déclarations (Root.tsx, check-mascot, script de rendu).

Usage : npm run new -- <épisode> <Composition> <Composant> <numéro>
  ex.   npm run new -- prise-de-sang Prise-De-Sang PriseDeSang 20
Les scènes = les parties de src/videos/<épisode>/voice.json (+ « end », la carte logo) : lancer `npm run voice` avant.
Transitions posées en alternance (jamais deux fois la même d'affilée), à ajuster ; rendu : `npm run render:<épisode>`.
"""
import json
import os
import re
import sys

ep, comp, name, num = sys.argv[1:5]
d = f"src/videos/{ep}"
ids = [s["id"] for s in json.load(open(f"{d}/voice.json"))["sections"]]
pascal = lambda s: "".join(p.capitalize() for p in re.split(r"[-_]", s))
scenes = {i: ("Hook" if i == "intro" else pascal(i)) for i in ids}
cycle = ["zoomInto({x: 540, y: 700})", "whip('left')", "wave({x: 540, y: 760})", "runWipe()", "whip('up')"]


def write(path, text):
    if os.path.exists(path):
        print("déjà là, gardé :", path)
        return
    open(path, "w").write(text)
    print("créé :", path)


write(f"{d}/timeline.ts", f"""import {{episodeTimeline}} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = [{", ".join(repr(i) for i in ids + ["end"])}] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {{TL, at, start, abs}} = episodeTimeline(voice, SCENE_IDS);
""")

trans = "\n".join(f"\t{i}: {{p: {cycle[k % len(cycle)]}, sfx: '{'run' if cycle[k % len(cycle)] == 'runWipe()' else 'whoosh'}'}}," for k, i in enumerate(ids[1:]))
write(f"{d}/{name}.tsx", f"""// {comp} : (décrire l'accroche et le déroulé).
import React from 'react';
import {{EndCard, Episode, EpisodeTransition}} from '../../brand/episode';
import {{wave}} from '../../brand/motion3';
import {{runWipe, whip, zoomInto}} from '../../brand/motion4';
import {{LPI}} from '../../brand/theme';
import {{MASCOT}} from './mascot';
import {{{", ".join(sorted(set(scenes.values())))}}} from './Scenes';
import {{SCENE_IDS, SceneId, TL}} from './timeline';

export type {name}Props = {{voice: boolean; sfx: boolean}};

const SCENES: Record<SceneId, React.FC> = {{{", ".join(f"{i}: {scenes[i]}" for i in ids)}, end: EndCard}};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {{
{trans}
	end: {{p: zoomInto({{x: 540, y: 1260, color: LPI.sky}}), sfx: 'whoosh'}},
}};

export const {name}: React.FC<{name}Props> = ({{voice, sfx}}) => (
	<Episode tl={{TL}} ids={{SCENE_IDS}} scenes={{SCENES}} transitions={{TRANSITIONS}} mascot={{MASCOT}} voice={{voice ? 'voix/{ep}/voix.wav' : null}} sfx={{sfx}} />
);
""")

stubs = "\n".join(f"""export const {scenes[i]}: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="{i}" kAt={{0}} title="À *faire*" tAt={{4}} />
	</AbsoluteFill>
);
""" for i in ids)
write(f"{d}/Scenes.tsx", f"""// Scènes de {comp} (à écrire) : chaque animation part d'un mot, at(scène, mot) — voir `npm run cues -- {ep}`.
import React from 'react';
import {{AbsoluteFill}} from 'remotion';
import {{Head}} from '../../brand/episode';
import {{LiveBackground}} from '../../brand/motion3';

{stubs}""")

# premier mot sans apostrophe (il va dans une chaîne entre apostrophes)
first_word = next(w["text"].strip(" ,.?!:…") for w in json.load(open(f"{d}/voice.json"))["words"] if "'" not in w["text"] and len(w["text"].strip(" ,.?!:…")) > 2)
write(f"{d}/mascot.ts", f"""// Jeu de la mascotte : une étape par mot clé ; elle porte les transitions (voir src/videos/bpco/mascot.ts).
import type {{Beat}} from '../../brand/MascotActor';
import {{SPOT}} from '../../brand/episode';
import {{abs, start}} from './timeline';

const {{L, R}} = SPOT;

export const MASCOT: Beat[] = [
	{{at: abs('intro', '{first_word}'), via: 'pop', key: 'expressions/surprise', ...R}},
	{{at: start('{ids[1] if len(ids) > 1 else ids[0]}') + 8, dur: 18, key: 'expressions/surprise', ...L}},
	// elle repart en courant avant le logo
	{{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480}},
	{{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480}},
];
""")

# déclarations
var = re.sub(r"[^A-Z0-9]", "_", ep.upper())
root = open("src/Root.tsx").read()
if f"'./videos/{ep}/{name}'" not in root:
    last = list(re.finditer(r"^import .* from '\./videos/.*';\n", root, re.M))[-1]
    root = root[: last.end()] + f"import {{{name}, {name}Props}} from './videos/{ep}/{name}';\nimport {{TL as {var}_TL}} from './videos/{ep}/timeline';\n" + root[last.end():]
    i = root.index("{/* contrôle : toutes les images")
    root = root[:i] + f"""{{/* {num} · {comp} */}}
		<Composition
			id="{comp}"
			component={{{name}}}
			durationInFrames={{{var}_TL.total}}
			fps={{{var}_TL.fps}}
			width={{W}}
			height={{H}}
			defaultProps={{{{voice: true, sfx: true}} satisfies {name}Props}}
		/>
		""" + root[i:]
    open("src/Root.tsx", "w").write(root)
    print("déclarée : src/Root.tsx")
cm = open("scripts/qa/check-mascot.ts").read()
if f"/videos/{ep}/mascot'" not in cm:
    last = list(re.finditer(r"^import \* as .* from '\.\./\.\./src/videos/.*';\n", cm, re.M))[-1]
    alias = re.sub(r"[^a-zA-Z0-9]", "", ep)
    cm = cm[: last.end()] + f"import * as {alias} from '../../src/videos/{ep}/mascot';\nimport * as {alias}TL from '../../src/videos/{ep}/timeline';\n" + cm[last.end():]
    cm = re.sub(r"(const VIDEOS[^{]*\{\n(?:.*\n)*?)(\};)", lambda m: m.group(1) + f"\t'{ep}': [{alias}.MASCOT, {alias}TL.TL],\n" + m.group(2), cm, count=1)
    open("scripts/qa/check-mascot.ts", "w").write(cm)
    print("déclarée : scripts/qa/check-mascot.ts")
pkg = json.load(open("package.json"))
key = f"render:{ep}"
if key not in pkg["scripts"]:
    pkg["scripts"][key] = f"remotion render {comp} out/{num}-{ep}.mp4"
    open("package.json", "w").write(json.dumps(pkg, indent=2, ensure_ascii=False) + "\n")
    print("script :", key)
