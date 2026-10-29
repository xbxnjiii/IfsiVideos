// Jeu de la mascotte : une étape par mot clé, places en bas de l'écran (SPOT), gags au mot près (tensiomètre,
// cœur avec les mains sur « cœur », « chut » sur « inaperçue », assise par terre sur « malaise »…) ; elle reste
// d'un côté quand les signes apparaissent et porte les transitions (plongée dans le manomètre, panoramiques, rideau).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'quoi'), via: 'pop', key: 'expressions/questionnement', ...R},
	// elle plonge dans le manomètre (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/questionnement', x: 540, y: 800, size: 0},

	/* ── définition ── */
	{at: abs('def', 'artérielle'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'pression', 2), key: 'accessoires/tensiometre', ...R},
	{at: abs('def', 'paroi'), key: 'gestes/regardez', ...L},
	{at: abs('def', 'millimètres'), key: 'expressions/surprise', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('mesure') - 1, dur: 12, key: 'expressions/surprise', x: -420, y: 1500, size: 230},

	/* ── mesure ── */
	{at: abs('mesure', 'tensiomètre'), via: 'pop', key: 'accessoires/tensiometre', ...R},
	{at: abs('mesure', 'brassard'), key: 'gestes/presente', ...R},
	{at: abs('mesure', 'cœur'), key: 'expressions/coeur-mains', ...R},
	{at: abs('mesure', 'repos'), key: 'poses/assise', x: 840, y: 1880, size: 560},
	...runAcross('chiffres'),

	/* ── deux chiffres ── */
	{at: abs('chiffres', 'deux'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('chiffres', 'systolique'), key: 'expressions/surprise', ...R},
	// « se contracte » : elle se ramasse ; « se relâche » : elle s'ouvre
	{at: abs('chiffres', 'contracte'), key: 'poses/accroupie', ...L},
	{at: abs('chiffres', 'diastolique'), key: 'expressions/ok', ...R},
	{at: abs('chiffres', 'relâche'), key: 'gestes/bras-ouverts', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('norme') + 2, dur: 14, key: 'gestes/bras-ouverts', x: 540, y: -520, size: 230},

	/* ── norme ── */
	{at: abs('norme', 'normale'), via: 'pop', key: 'situations/valide', ...R},
	{at: abs('norme', '80'), key: 'expressions/ok', ...R},
	{at: abs('norme', 'systolique'), key: 'gestes/hausse', ...L},
	{at: abs('norme', 'diastolique'), key: 'gestes/baisse', ...L},
	// saut par-dessus la vague
	{at: start('hyper') + 8, dur: 18, key: 'gestes/hausse', ...R},

	/* ── hypertension ── */
	{at: abs('hyper', 'hypertension'), key: 'expressions/en-colere', fx: 'shake', ...R},
	{at: abs('hyper', 'hta'), key: 'gestes/important', ...L},
	{at: abs('hyper', 'inaperçue'), key: 'gestes/chut', ...L},
	{at: abs('hyper', 'tête'), key: 'symptomes/mal-de-tete-2', fx: 'shake', ...L},
	{at: abs('hyper', 'bourdonnements'), key: 'symptomes/mal-oreille', ...L},
	{at: abs('hyper', 'vertiges'), key: 'symptomes/vertige', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('hypo') - 1, dur: 12, key: 'symptomes/vertige', x: -420, y: 1500, size: 230},

	/* ── hypotension ── */
	{at: abs('hypo', 'hypotension'), via: 'pop', key: 'symptomes/etourdie', ...R},
	{at: abs('hypo', 'basse'), dur: 22, arc: 12, key: 'gestes/baisse', ...R},
	{at: abs('hypo', 'tourne'), key: 'symptomes/nausee-vertige', ...R},
	{at: abs('hypo', 'pâle'), key: 'symptomes/malaise', fx: 'slow', ...R},
	// « malaise » : elle s'affaisse et s'assoit par terre (pas de saut par-dessus les signes)
	{at: abs('hypo', 'malaise'), dur: 14, arc: 0, key: 'poses/assise-sol', x: 830, y: 1900, size: 360},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'tension'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'chiffres'), key: 'gestes/presente', ...L},
	{at: abs('outro', 'normale'), key: 'situations/valide', ...R},
	{at: abs('outro', 'hypertension'), key: 'expressions/en-colere', ...L},
	{at: abs('outro', 'hypotension'), key: 'symptomes/etourdie', ...R},
	{at: abs('outro', 'hypotension') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
