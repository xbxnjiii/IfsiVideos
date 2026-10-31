// Jeu de la mascotte (série plaies, partie 3) : alerte sur « le problème », elle dort sur l'escarre, mal au dos sur
// « écrasée », triste sur « la peau meurt », crampes sur la circulation, « chut » sur « en silence », loupe pour
// regarder ses pieds, bravo sur la série terminée ; elle porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'plaie'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('intro', 'mal'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'problème'), key: 'expressions/alerte', fx: 'shake', ...R},
	// saut par-dessus la vague
	{at: start('serie') + 8, dur: 18, key: 'expressions/alerte', ...L},

	/* ── la série ── */
	{at: abs('serie', 'partie'), key: 'gestes/bonjour', ...L},
	{at: abs('serie', 'chroniques'), key: 'gestes/presente', ...L},
	{at: abs('serie', 'semaines'), key: 'expressions/fatiguee', ...L},
	// elle plonge (zoomInto)
	{at: start('escarre') - 4, dur: 16, key: 'expressions/fatiguee', x: 540, y: 700, size: 0},

	/* ── l'escarre (pastilles à gauche) ── */
	{at: abs('escarre', "l'escarre"), via: 'pop', key: 'symptomes/dort', ...R},
	{at: abs('escarre', 'écrasée'), key: 'symptomes/mal-dos', ...R},
	{at: abs('escarre', 'meurt'), key: 'expressions/triste', ...R},
	{at: abs('escarre', 'sacrum'), key: 'gestes/regardez', ...R},
	{at: abs('escarre', 'talons'), key: 'gestes/attention', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('stades') + 2, dur: 14, key: 'gestes/attention', x: 540, y: -520, size: 230},

	/* ── 4 stades (rangée de 4 cartes jusqu'à y 1260) ── */
	{at: abs('stades', 'stades'), via: 'pop', key: 'gestes/presente', ...L},
	{at: abs('stades', 'appuie'), key: 'gestes/regardez', ...L},
	{at: abs('stades', 'Stade 2'), key: 'expressions/inquiete', ...L},
	{at: abs('stades', 'Stade 3'), key: 'expressions/stressee', ...L},
	{at: abs('stades', 'Stade 4'), key: 'expressions/alerte', fx: 'shake', ...L},
	...runAcross('ulcere'),

	/* ── ulcère de jambe ── */
	{at: abs('ulcere', "l'ulcère"), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('ulcere', 'circule'), key: 'symptomes/crampes', ...R},
	{at: abs('ulcere', "s'ouvre"), key: 'expressions/surprise', ...R},
	{at: abs('ulcere', 'cheville'), key: 'gestes/regardez', ...R},
	// sortie à gauche avec le panoramique
	{at: start('pied') - 1, dur: 12, key: 'gestes/regardez', x: -420, y: 1500, size: 230},

	/* ── pied diabétique ── */
	{at: abs('pied', 'diabétique'), via: 'pop', key: 'expressions/reflechit', ...L},
	{at: abs('pied', 'sent'), key: 'expressions/surprise', ...L},
	{at: abs('pied', 'silence'), key: 'gestes/chut', ...L},
	{at: abs('pied', 'regarde'), key: 'expressions/loupe', ...L},
	{at: abs('pied', 'jours'), key: 'gestes/ok', ...L},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'gestes/ok', ...R},

	/* ── récap + série terminée ── */
	{at: abs('outro', "l'escarre"), key: 'situations/recapitule', ...R},
	{at: abs('outro', 'pied'), key: 'expressions/ok', ...R},
	{at: abs('outro', 'terminée'), via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
