// Jeu de la mascotte (partie 2, v2) : perplexe devant Madame Martin qui ne se plaint jamais, erreur sur « Faux ! »,
// loupe sur « regarde mieux », inquiète quand le visage se crispe ; puis un geste au mot près par échelle. Elle reste en
// bas à droite quand un patient ou l'enfant est rangé en bas à gauche, et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));
const C = {x: 540, y: 1735, size: 390};

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'martin,'), via: 'pop', key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'jamais'), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'donc,'), key: 'gestes/question', ...R},
	{at: abs('intro', 'faux'), key: 'gestes/erreur', fx: 'shake', ...R},
	{at: abs('intro', 'regarde'), key: 'expressions/loupe', ...R},
	{at: abs('intro', 'crispe,'), key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'voit.'), key: 'gestes/important', ...R},
	{at: start('serie') - 4, dur: 16, key: 'gestes/important', x: 540, y: 700, size: 0},

	/* ── la série ── */
	{at: abs('serie', 'deux'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('serie', 'répondre.'), key: 'situations/a-retenir', ...R},
	{at: start('hetero') - 1, dur: 12, key: 'situations/a-retenir', x: -420, y: 1500, size: 230},

	/* ── principe ── */
	{at: abs('hetero', 'toi'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('hetero', 'visage,'), key: 'expressions/loupe', ...R},
	{at: abs('hetero', 'plaintes'), key: 'expressions/inquiete', ...R},
	{at: start('algoplus') + 8, dur: 18, key: 'expressions/inquiete', ...R},

	/* ── Algoplus ── */
	{at: abs('algoplus', 'algoplus.'), key: 'gestes/presente', ...R},
	{at: abs('algoplus', 'un'), key: 'situations/checklist', ...R},
	{at: abs('algoplus', 'dès'), key: 'gestes/important', ...R},
	{at: abs('algoplus', 'soulage.'), key: 'situations/medicament', ...R},
	...runAcross('doloplus'),

	/* ── Doloplus ── */
	{at: abs('doloplus', 'dure'), via: 'pop', key: 'expressions/fatiguee', ...R},
	{at: abs('doloplus', 'doloplus.'), key: 'gestes/presente', ...R},
	{at: abs('doloplus', 'trente,'), key: 'gestes/important', ...R},
	{at: abs('doloplus', 'présente.'), key: 'situations/valide', ...R},
	{at: start('bps') + 2, dur: 14, key: 'situations/valide', x: 540, y: -520, size: 230},

	/* ── BPS ── */
	{at: abs('bps', 'intubé'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('bps', 'endormi,'), key: 'symptomes/dort', ...R},
	{at: abs('bps', 'visage,'), key: 'expressions/loupe', ...R},
	{at: abs('bps', 'supporte'), key: 'gestes/attention', ...R},
	{at: start('evendol') - 4, dur: 16, key: 'gestes/attention', x: 540, y: 700, size: 0},

	/* ── EVENDOL ── */
	{at: abs('evendol', "l'enfant"), via: 'pop', key: 'expressions/coeur-mains', ...R},
	{at: abs('evendol', 'voix,'), key: 'expressions/triste', ...R},
	{at: abs('evendol', 'dès'), key: 'gestes/important', ...R},
	{at: abs('evendol', 'soulage.'), key: 'situations/valide', ...R},
	{at: start('outro') - 1, dur: 12, key: 'situations/valide', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'doloplus'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'toujours'), key: 'gestes/important', ...L},
	{at: abs('outro', 'soulagée.') + 6, via: 'pop', key: 'gestes/bravo', fx: 'bounce', ...C},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
