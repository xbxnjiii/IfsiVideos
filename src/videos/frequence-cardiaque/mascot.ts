// Jeu de la mascotte (même règles que Constantes) : une étape par mot clé, places en bas de l'écran
// (le contenu s'arrête vers y = 1460), coin de la carte du terme pendant qu'il claque, et elle porte
// les transitions (plongée dans le cœur, sortie avec les panoramiques, course devant le rideau).
import type {Beat} from '../../brand/MascotActor';
import {RUN_WIPE} from '../../brand/motion4';
import {LAY} from './Scenes';
import {abs, SceneId, start, TL} from './timeline';

type Spot = Pick<Beat, 'x' | 'y' | 'size'>;
const L: Spot = {x: 250, y: 1700, size: 380};
const R: Spot = {x: 830, y: 1700, size: 380};
/** sur le coin haut-droit du terme qui claque (centre du socle) */
const CORNER: Spot = {x: 905, y: LAY.stageY + LAY.stageH / 2 - 115, size: 200};

const runAcross = (id: SceneId): Beat[] => {
	const s = start(id);
	const run = {key: 'poses/course', y: 1830, size: 620} as const;
	return [
		{...run, at: s - 6, via: 'pop', x: RUN_WIPE.x0 + 60},
		{...run, at: s + Math.round(TL.transition / 2), via: 'run', dur: TL.transition, x: RUN_WIPE.x1 + 60},
	];
};

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'quoi'), via: 'pop', key: 'expressions/questionnement', ...R},
	// « comment la prendre » : deux doigts levés (index + majeur)
	{at: abs('intro', 'prendre'), key: 'gestes/important', ...L},
	// « sans te tromper » : pouce levé
	{at: abs('intro', 'tromper'), key: 'gestes/bonne-reponse', ...L},
	// elle plonge dans le cœur (la caméra plonge avec elle : zoomInto)
	{at: start('def') - 4, dur: 16, key: 'gestes/bonne-reponse', x: 540, y: 850, size: 0},

	/* ── définition ── */
	{at: abs('def', 'nombre'), via: 'pop', key: 'situations/explique', ...L},
	{at: abs('def', 'minute'), key: 'expressions/surprise', ...R},
	{at: abs('def', "l'écrit"), key: 'expressions/ecrit', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('mesure') - 1, dur: 12, key: 'expressions/ecrit', x: -420, y: 1100, size: 230},

	/* ── mesure ── */
	{at: abs('mesure', 'mesurer'), via: 'pop', key: 'gestes/montre-haut', ...R},
	{at: abs('mesure', 'poignet'), key: 'gestes/regardez', ...R},
	{at: abs('mesure', "l'index"), key: 'gestes/important', ...R},
	{at: abs('mesure', 'pouce'), key: 'gestes/erreur', ...R},
	{at: abs('mesure', 'compte'), key: 'situations/prend-notes', ...R},
	{at: abs('mesure', 'entière'), key: 'expressions/ok', ...R},
	...runAcross('norme'),

	/* ── norme ── */
	// « au repos » : elle s'assoit
	{at: abs('norme', 'repos'), via: 'pop', key: 'poses/assise', x: 840, y: 1880, size: 560},
	{at: abs('norme', 'normale'), via: 'pop', key: 'situations/valide', x: 830, y: 1460, size: 360},
	{at: abs('norme', '100'), key: 'expressions/ok', x: 830, y: 1460, size: 360},
	// elle s'envole avec le panoramique vers le haut
	{at: start('tachy') + 2, dur: 14, key: 'expressions/ok', x: 540, y: -520, size: 230},

	/* ── tachycardie ── */
	{at: abs('tachy', 'tachycardie'), via: 'pop', key: 'symptomes/douleur-poitrine', fx: 'pant', ...CORNER},
	// « le cœur s'emballe » : elle traverse l'écran en courant
	{at: abs('tachy', "s'emballe") - 4, via: 'pop', key: 'poses/course', x: -260, y: 1840, size: 560},
	{at: abs('tachy', "s'emballe") + 10, via: 'run', dur: 14, key: 'poses/course', x: 1400, y: 1840, size: 560},
	// une cause = une tête, au mot près (même place : changement sec)
	{at: abs('tachy', "l'effort"), via: 'pop', key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('tachy', 'fièvre'), key: 'symptomes/fievre', ...R},
	{at: abs('tachy', 'stress'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('tachy', 'douleur'), key: 'symptomes/douleur', ...R},
	// saut par-dessus la vague vers la place de la scène suivante
	{at: start('brady') + 8, dur: 18, key: 'expressions/fatiguee', ...L},

	/* ── bradycardie ── */
	{at: abs('brady', 'bradycardie'), dur: 34, arc: 50, key: 'expressions/fatiguee', fx: 'slow', ...R},
	{at: abs('brady', 'sportif'), via: 'pop', key: 'poses/course-joie', x: 260, y: 1880, size: 580},
	{at: abs('brady', 'sommeil'), via: 'pop', key: 'symptomes/dort', ...R},
	{at: abs('brady', 'normal'), key: 'expressions/ok', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('rythme') - 1, dur: 12, key: 'expressions/ok', x: -420, y: 1000, size: 230},

	/* ── rythme et force ── */
	{at: abs('rythme', 'chiffre'), via: 'pop', key: 'gestes/attention', ...R},
	// « irréguliers » : petits sauts irréguliers
	{at: abs('rythme', 'irréguliers') - 2, dur: 8, key: 'expressions/questionnement', x: 600, y: 1720, size: 300},
	{at: abs('rythme', 'irréguliers') + 8, dur: 12, key: 'expressions/questionnement', x: 420, y: 1640, size: 300},
	{at: abs('rythme', 'irréguliers') + 18, dur: 7, key: 'expressions/questionnement', ...L},
	{at: abs('rythme', 'arythmie'), key: 'situations/montre-ecg', ...L},
	{at: abs('rythme', 'faible'), key: 'expressions/inquiete', ...R},
	{at: abs('rythme', 'filant'), key: 'symptomes/malaise', ...R},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne de la fiche */
	{at: abs('outro', 'fréquence'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'battements'), key: 'situations/montre-schema', ...R},
	{at: abs('outro', 'radial'), key: 'gestes/important', ...L},
	{at: abs('outro', 'normale'), key: 'situations/valide', ...R},
	{at: abs('outro', 'tachycardie'), key: 'symptomes/douleur-poitrine', fx: 'pant', ...L},
	{at: abs('outro', 'bradycardie'), dur: 26, arc: 60, key: 'expressions/fatiguee', fx: 'slow', ...R},
	{at: abs('outro', 'rythme'), key: 'situations/montre-ecg', ...L},
	{at: abs('outro', 'pouls', 2) + 10, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
