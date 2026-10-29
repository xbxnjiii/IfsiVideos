// Jeu de la mascotte : une étape par mot clé, places en bas de l'écran (SPOT), coin du terme qui claque,
// gags au mot près (elle se cache sur « rectale », thermomètre en bouche sur « buccale », main à l'oreille…),
// et elle porte les transitions (plongée dans le thermomètre, sorties avec les panoramiques, course devant le rideau).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'quoi'), via: 'pop', key: 'expressions/questionnement', ...R},
	// elle plonge dans le réservoir du thermomètre (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/questionnement', x: 333, y: 988, size: 0},

	/* ── définition ── */
	{at: abs('def', 'corporelle'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'chaleur'), key: 'symptomes/coup-de-chaud', ...R},
	{at: abs('def', 'thermique'), key: 'expressions/reflechit', ...R},
	{at: abs('def', 'mesure'), key: 'gestes/presente', ...L},
	{at: abs('def', 'celsius'), key: 'expressions/ok', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('voies') - 1, dur: 12, key: 'expressions/ok', x: -420, y: 1500, size: 230},

	/* ── voies ── */
	{at: abs('voies', 'plusieurs'), via: 'pop', key: 'situations/checklist', ...R},
	{at: abs('voies', 'rectale'), key: 'expressions/cache-visage', fx: 'shake', ...R},
	{at: abs('voies', 'buccale'), key: 'symptomes/fievre', ...R},
	{at: abs('voies', 'tympanique'), key: 'symptomes/mal-oreille', ...R},
	{at: abs('voies', 'axillaire'), key: 'poses/main-levee', ...R},
	{at: abs('voies', 'frontale'), key: 'symptomes/mal-de-tete', ...R},
	...runAcross('norme'),

	/* ── norme ── */
	{at: abs('norme', 'normale'), via: 'pop', key: 'situations/valide', ...R},
	{at: abs('norme', '37,5'), key: 'expressions/ok', ...R},
	{at: abs('norme', 'apyrétique'), key: 'expressions/joyeuse', ...L},
	{at: abs('norme', 'fièvre'), key: 'gestes/ok', fx: 'bounce', ...L},
	// elle s'envole avec le panoramique vers le haut
	{at: start('febricule') + 2, dur: 14, key: 'gestes/ok', x: 540, y: -520, size: 230},

	/* ── fébricule ── */
	{at: abs('febricule', '37,5'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('febricule', 'fébricule'), key: 'expressions/inquiete', ...R},
	{at: abs('febricule', 'petite'), key: 'symptomes/lasse', fx: 'slow', ...R},
	// saut par-dessus la vague
	{at: start('hyper') + 8, dur: 18, key: 'symptomes/lasse', ...L},

	/* ── hyperthermie ── */
	{at: abs('hyper', 'hyperthermie'), key: 'symptomes/fievre-glace', ...R},
	{at: abs('hyper', 'fébrile'), key: 'symptomes/coup-de-chaud', fx: 'pant', ...L},
	{at: abs('hyper', 'frissons'), key: 'symptomes/fievre-couverture', fx: 'shiver', ...L},
	{at: abs('hyper', 'sueurs'), key: 'symptomes/coup-de-chaud', fx: 'pant', ...L},
	{at: abs('hyper', 'visage'), key: 'expressions/genee', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('hypo') - 1, dur: 12, key: 'expressions/genee', x: -420, y: 1500, size: 230},

	/* ── hypothermie ── */
	{at: abs('hypo', 'hypothermie'), via: 'pop', key: 'symptomes/froid', fx: 'shiver', ...R},
	{at: abs('hypo', 'froid'), key: 'symptomes/froid', fx: 'shiver', ...L},
	{at: abs('hypo', 'grelotte'), key: 'symptomes/grelotte', fx: 'shiver', ...L},
	{at: abs('hypo', 'pâle'), key: 'symptomes/malaise', fx: 'slow', ...L},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'température'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'voies'), key: 'situations/checklist', ...L},
	{at: abs('outro', 'apyrétique'), key: 'situations/valide', ...R},
	{at: abs('outro', 'fébricule'), key: 'expressions/inquiete', ...L},
	{at: abs('outro', 'hyperthermie'), key: 'symptomes/fievre-glace', ...R},
	{at: abs('outro', 'hypothermie'), key: 'symptomes/grelotte', fx: 'shiver', ...L},
	{at: abs('outro', 'hypothermie') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
