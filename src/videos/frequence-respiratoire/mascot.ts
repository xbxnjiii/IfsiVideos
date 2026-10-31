// Jeu de la mascotte : une étape par mot clé, places en bas de l'écran (SPOT), coin du terme qui claque,
// et elle porte les transitions (plongée dans les poumons, sorties avec les panoramiques, course devant le rideau).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R, CORNER} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche : 20 000 par jour… et pourtant oubliée ── surprise, souffle, elle dort (« sans y penser »), fiche, facepalm */
	{at: abs('intro', 'mille'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('intro', 'respires'), key: 'symptomes/souffle', ...R},
	{at: abs('intro', 'penser'), via: 'pop', key: 'symptomes/dort', ...L},
	{at: abs('intro', "l'hôpital"), key: 'accessoires/clipboard', ...R},
	{at: abs('intro', 'oublie'), key: 'gestes/facepalm', fx: 'shake', ...R},
	{at: abs('intro', 'quoi'), key: 'expressions/questionnement', ...R},
	// elle plonge dans les poumons (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/questionnement', x: 540, y: 820, size: 0},

	/* ── définition ── */
	{at: abs('def', 'nombre'), via: 'pop', key: 'situations/explique', ...L},
	{at: abs('def', 'minute'), key: 'expressions/surprise', ...R},
	{at: abs('def', 'inspiration'), key: 'symptomes/souffle', ...L},
	{at: abs('def', 'cycle'), key: 'expressions/ok', ...R},
	{at: abs('def', 'cycles'), key: 'situations/montre-poumons', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('mesure') - 1, dur: 12, key: 'situations/montre-poumons', x: -420, y: 1100, size: 230},

	/* ── mesure ── */
	{at: abs('mesure', 'thorax'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('mesure', 'cycle'), key: 'expressions/ok', ...R},
	{at: abs('mesure', 'compte'), key: 'situations/prend-notes', ...R},
	{at: abs('mesure', 'entière'), key: 'situations/valide', ...R},
	...runAcross('norme'),

	/* ── norme ── */
	{at: abs('norme', 'repos'), via: 'pop', key: 'poses/assise', x: 840, y: 1880, size: 560},
	{at: abs('norme', 'normale'), via: 'pop', key: 'situations/valide', x: 830, y: 1460, size: 360},
	{at: abs('norme', '20'), key: 'expressions/ok', x: 830, y: 1460, size: 360},
	// elle s'envole avec le panoramique vers le haut
	{at: start('tachy') + 2, dur: 14, key: 'expressions/ok', x: 540, y: -520, size: 230},

	/* ── tachypnée ── */
	{at: abs('tachy', 'tachypnée'), via: 'pop', key: 'symptomes/essoufflee', fx: 'pant', ...CORNER},
	// « la respiration s'accélère » : elle traverse en courant
	{at: abs('tachy', "s'accélère") - 4, via: 'pop', key: 'poses/course', x: -260, y: 1840, size: 560},
	{at: abs('tachy', "s'accélère") + 10, via: 'run', dur: 14, key: 'poses/course', x: 1400, y: 1840, size: 560},
	{at: abs('tachy', "l'effort"), via: 'pop', key: 'symptomes/souffle', fx: 'pant', ...R},
	{at: abs('tachy', 'fièvre'), key: 'symptomes/fievre', ...R},
	{at: abs('tachy', "l'anxiété"), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('tachy', 'douleur'), key: 'symptomes/douleur', ...R},
	// saut par-dessus la vague
	{at: start('brady') + 8, dur: 18, key: 'expressions/fatiguee', ...L},

	/* ── bradypnée ── */
	{at: abs('brady', 'bradypnée'), dur: 34, arc: 50, key: 'symptomes/dort', fx: 'slow', ...R},
	{at: abs('brady', 'attention'), via: 'pop', key: 'gestes/attention', ...R},
	{at: abs('brady', 'médicaments'), key: 'situations/medicament', ...R},
	{at: abs('brady', 'morphine'), key: 'symptomes/lasse', fx: 'slow', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('obs') - 1, dur: 12, key: 'symptomes/lasse', x: -420, y: 1000, size: 230},

	/* ── amplitude, rythme, dyspnée ── */
	{at: abs('obs', 'chiffre'), via: 'pop', key: 'gestes/attention', ...R},
	{at: abs('obs', 'ample'), key: 'symptomes/souffle', ...R},
	{at: abs('obs', 'superficielle'), key: 'symptomes/essoufflee', fx: 'pant', ...R},
	// « le rythme » : petits sauts irréguliers
	{at: abs('obs', 'rythme') - 2, dur: 8, key: 'expressions/questionnement', x: 600, y: 1720, size: 300},
	{at: abs('obs', 'rythme') + 8, dur: 12, key: 'expressions/questionnement', x: 420, y: 1640, size: 300},
	{at: abs('obs', 'rythme') + 18, dur: 7, key: 'expressions/questionnement', ...L},
	{at: abs('obs', 'dyspnée'), key: 'symptomes/oppression', fx: 'pant', ...L},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'fréquence'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'cycles'), key: 'situations/montre-poumons', ...R},
	{at: abs('outro', 'thorax'), key: 'gestes/regardez', ...L},
	{at: abs('outro', 'normale'), key: 'situations/valide', ...R},
	{at: abs('outro', 'tachypnée'), key: 'symptomes/essoufflee', fx: 'pant', ...L},
	{at: abs('outro', 'bradypnée'), dur: 26, arc: 60, key: 'symptomes/dort', fx: 'slow', ...R},
	{at: abs('outro', 'dyspnée'), key: 'symptomes/oppression', ...L},
	{at: abs('outro', 'dyspnée') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
