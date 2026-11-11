// Jeu de la mascotte : surprise quand le vélo tombe, douleur sur « râpé », elle grimace sur « pique » ; « pourtant » :
// réfléchit, « la moins grave » : astuce ; loupe sous la peau, OK sur « cicatrise vite » ; inquiète sur la plaie
// profonde, stressée sur les vaisseaux, valide les points de suture ; « c'est la profondeur » : important.
// En bas à droite (le contenu s'arrête vers y 1480), elle porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'vélo,') + 6, via: 'pop', key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'râpé…'), key: 'symptomes/douleur', ...R},
	{at: abs('intro', 'pique'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('intro', 'pourtant,'), key: 'situations/reflexion', ...R},
	{at: abs('intro', 'moins'), key: 'gestes/astuce', fx: 'bounce', ...R},
	{at: start('superficielle') - 4, dur: 16, key: 'gestes/astuce', x: 545, y: 780, size: 0},

	/* ── superficielle ── */
	{at: abs('superficielle', 'écorchure,'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('superficielle', "l'épiderme"), key: 'situations/explique', ...R},
	{at: abs('superficielle', 'cicatrise'), key: 'gestes/ok', fx: 'bounce', ...R},
	{at: start('profonde') - 1, dur: 12, key: 'gestes/ok', x: -420, y: 1500, size: 230},

	/* ── profonde ── */
	{at: abs('profonde', 'derme.'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('profonde', 'vaisseaux.'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('profonde', 'points'), key: 'situations/valide', ...R},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'douleur'), via: 'pop', key: 'gestes/erreur', ...R},
	{at: abs('fin', 'profondeur'), key: 'gestes/important', fx: 'bounce', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
