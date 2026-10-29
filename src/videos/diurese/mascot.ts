// Jeu de la mascotte : une étape par mot clé, places en bas de l'écran (SPOT), gags au mot près (toilettes sur
// « vessie » et « polyurie », seringue sur « diabète », coup de chaud sur « déshydratation »…) ; elle reste
// d'un côté quand les signes apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'quoi'), via: 'pop', key: 'expressions/questionnement', ...R},
	// elle plonge dans le bocal (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/questionnement', x: 540, y: 900, size: 0},

	/* ── définition ── */
	{at: abs('def', 'diurèse') + 4, via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'reins'), key: 'situations/montre-schema', ...L},
	{at: abs('def', 'filtrent'), key: 'expressions/reflechit', ...L},
	{at: abs('def', 'vessie'), key: 'symptomes/toilettes', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('mesure') - 1, dur: 12, key: 'symptomes/toilettes', x: -420, y: 1500, size: 230},

	/* ── mesure ── */
	{at: abs('mesure', '24'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('mesure', 'recueille'), key: 'gestes/presente', ...R},
	{at: abs('mesure', 'gradué'), key: 'gestes/regardez', ...R},
	{at: abs('mesure', 'millilitres'), key: 'situations/prend-notes', ...R},
	...runAcross('norme'),

	/* ── norme ── */
	{at: abs('norme', 'normale'), via: 'pop', key: 'situations/valide', ...R},
	{at: abs('norme', '2000'), key: 'expressions/ok', ...R},
	{at: abs('norme', 'normodiurèse'), key: 'expressions/joyeuse', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('poly') + 2, dur: 14, key: 'expressions/joyeuse', x: 540, y: -520, size: 230},

	/* ── polyurie ── */
	{at: abs('poly', '2500'), via: 'pop', key: 'gestes/hausse', ...R},
	{at: abs('poly', 'polyurie'), key: 'symptomes/toilettes', fx: 'shake', ...R},
	{at: abs('poly', 'beaucoup'), key: 'expressions/surprise', ...L},
	{at: abs('poly', 'diabète'), key: 'accessoires/seringue', ...L},
	{at: abs('poly', 'diurétiques'), key: 'situations/medicament', ...L},
	// saut par-dessus la vague
	{at: start('oligo') + 8, dur: 18, key: 'situations/medicament', ...R},

	/* ── oligurie ── */
	{at: abs('oligo', 'oligurie'), key: 'expressions/inquiete', ...R},
	{at: abs('oligo', 'peu'), dur: 22, arc: 12, key: 'gestes/baisse', ...R},
	{at: abs('oligo', 'déshydratation'), key: 'symptomes/coup-de-chaud', fx: 'pant', ...R},
	{at: abs('oligo', "d'eau"), key: 'symptomes/epuisee', fx: 'slow', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('anurie') - 1, dur: 12, key: 'symptomes/epuisee', x: -420, y: 1500, size: 230},

	/* ── anurie ── */
	{at: abs('anurie', 'anurie'), via: 'pop', key: 'expressions/alerte', ...R},
	{at: abs('anurie', 'presque'), key: 'expressions/triste', ...L},
	{at: abs('anurie', 'urgence'), key: 'gestes/attention', fx: 'shake', ...L},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'quantité'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'normale'), key: 'situations/valide', ...L},
	{at: abs('outro', 'polyurie'), key: 'symptomes/toilettes', ...R},
	{at: abs('outro', 'oligurie'), key: 'expressions/inquiete', ...L},
	{at: abs('outro', 'anurie'), key: 'expressions/alerte', ...R},
	{at: abs('outro', 'urgence') + 24, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
