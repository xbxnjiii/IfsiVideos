"""Écrit le mascot.ts d'une vidéo de la série courte du tube jaune : une étape par scène, L / R en alternance."""
import json, sys
ep = sys.argv[1]
d = json.load(open(f'src/videos/{ep}/voice.json'))
ids = [s['id'] for s in d['sections']]
poses = ['gestes/presente', 'gestes/astuce', 'gestes/important', 'gestes/attention', 'gestes/presente']
lines = ["// Jeu de la mascotte : discrète en bas de l'écran (écrit par scripts/brand/lab_mascot.py).",
         "import type {Beat} from '../../brand/MascotActor';", "import {SPOT} from '../../brand/episode';",
         "import {start} from './timeline';", '', 'const {L, R} = SPOT;', 'const LOW = {y: 1790, size: 300};', '',
         'export const MASCOT: Beat[] = [',
         "\t{at: start('intro') + 40, via: 'pop', key: 'expressions/surprise', ...R, ...LOW},",
         "\t{at: start('intro') + 150, via: 'cut', key: 'expressions/reflechit', ...R, ...LOW},"]
side = ['L', 'R']
for i, sid in enumerate(ids[1:-1]):
    lines.append(f"\t{{at: start('{sid}') + 8, via: 'hop', dur: 18, key: '{poses[i % len(poses)]}', ...{side[i % 2]}, ...LOW}},")
lines.append(f"\t{{at: start('{ids[-1]}') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...{side[(len(ids) - 2) % 2]}, ...LOW}},")
lines += ["\t{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},",
          "\t{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},", '];', '']
open(f'src/videos/{ep}/mascot.ts', 'w').write('\n'.join(lines))
