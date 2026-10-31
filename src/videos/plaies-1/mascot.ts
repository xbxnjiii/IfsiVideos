// Jeu de la mascotte (série plaies, partie 1) : « aïe » sur la coupure, fatiguée sur « des mois », elle présente la
// série, masque sur les microbes, loupe sur les couches, se cache le visage sur « visage », seringue sur le tétanos,
// coup de chaud sur la brûlure à venir ; elle reste d'un côté quand les pastilles apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'coupure'), via: 'pop', key: 'symptomes/douleur', ...L},
	{at: abs('intro', 'jours'), key: 'expressions/ok', ...L},
	{at: abs('intro', 'escarre'), key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'mois'), key: 'expressions/fatiguee', ...R},
	{at: abs('intro', 'plaies'), key: 'gestes/attention', ...R},
	// saut par-dessus la vague
	{at: start('serie') + 8, dur: 18, key: 'gestes/attention', ...L},

	/* ── la série (tuiles jusqu'à y 1040, pastille à y 1110) ── */
	{at: abs('serie', 'partie'), key: 'gestes/bonjour', ...L},
	{at: abs('serie', 'série'), key: 'gestes/presente', ...L},
	{at: abs('serie', 'bases'), key: 'situations/lit-cours', ...L},
	// elle plonge (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'situations/lit-cours', x: 540, y: 700, size: 0},

	/* ── définition ── */
	{at: abs('def', 'plaie'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'barrière'), key: 'gestes/important', ...R},
	{at: abs('def', 'microbes'), key: 'symptomes/masque', ...R},
	{at: abs('def', "s'ouvre"), key: 'expressions/surprise', ...R},
	{at: abs('def', "s'infecter"), key: 'expressions/inquiete', ...R},
	// sortie à gauche avec le panoramique
	{at: start('couches') - 1, dur: 12, key: 'expressions/inquiete', x: -420, y: 1500, size: 230},

	/* ── les couches ── */
	{at: abs('couches', "l'épiderme"), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('couches', 'derme'), key: 'situations/montre-schema', ...R},
	{at: abs('couches', 'graisse'), key: 'gestes/presente', ...R},
	{at: abs('couches', 'profonde'), key: 'expressions/stressee', ...R},
	{at: abs('couches', "l'os"), key: 'expressions/surprise', fx: 'shake', ...R},
	...runAcross('familles'),

	/* ── deux familles ── */
	{at: abs('familles', 'aiguës'), via: 'pop', key: 'gestes/ok', ...L},
	{at: abs('familles', 'chroniques'), key: 'expressions/fatiguee', ...L},
	{at: abs('familles', 'quatre'), key: 'gestes/important', ...L},
	// elle plonge (zoomInto)
	{at: start('gravite') - 4, dur: 16, key: 'gestes/important', x: 540, y: 700, size: 0},

	/* ── simple ou grave ── */
	{at: abs('gravite', 'simple'), via: 'pop', key: 'gestes/facile', ...R},
	{at: abs('gravite', 'profonde'), key: 'expressions/loupe', ...R},
	{at: abs('gravite', 'souillée'), key: 'expressions/genee', ...R},
	{at: abs('gravite', 'visage'), key: 'expressions/cache-visage', ...R},
	{at: abs('gravite', 'avis'), key: 'accessoires/stethoscope', ...R},
	{at: abs('gravite', 'tétanos'), key: 'accessoires/seringue', fx: 'bounce', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('outro') + 2, dur: 14, key: 'accessoires/seringue', x: 540, y: -520, size: 230},

	/* ── récap + à suivre (carte « à suivre » jusqu'à y 1300) ── */
	{at: abs('outro', 'plaie'), via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'aiguë'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'dans'), key: 'gestes/regardez', ...R},
	{at: abs('outro', 'brûlure'), key: 'symptomes/coup-de-chaud', ...R},
	{at: abs('outro', 'plus'), key: 'expressions/surprise', fx: 'shake', ...R},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
