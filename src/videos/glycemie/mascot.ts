// Jeu de la mascotte : une étape par mot clé, places en bas de l'écran (SPOT), gags au mot près (« aïe » sur
// « on pique », ventre vide sur « à jeun », toilettes sur « uriner », poings serrés sur « carburant »…) ;
// elle reste d'un côté quand les signes apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'quoi'), via: 'pop', key: 'expressions/questionnement', ...R},
	// elle plonge dans l'écran du lecteur (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/questionnement', x: 476, y: 791, size: 0},

	/* ── définition ── */
	{at: abs('def', 'glycémie') + 4, via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'sucre'), key: 'expressions/joyeuse', ...R},
	{at: abs('def', 'glucose'), key: 'situations/montre-schema', ...L},
	{at: abs('def', 'carburant'), key: 'gestes/motivee', fx: 'bounce', ...L},
	{at: abs('def', 'grammes'), key: 'expressions/reflechit', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('mesure') - 1, dur: 12, key: 'expressions/reflechit', x: -420, y: 1500, size: 230},

	/* ── mesure ── */
	{at: abs('mesure', 'capillaire'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('mesure', 'pique'), key: 'symptomes/douleur', fx: 'shake', ...R},
	{at: abs('mesure', 'goutte'), key: 'expressions/surprise', ...R},
	{at: abs('mesure', 'lecteur'), key: 'accessoires/telephone', ...R},
	{at: abs('mesure', 'résultat'), key: 'situations/valide', ...R},
	...runAcross('norme'),

	/* ── norme ── */
	{at: abs('norme', 'jeun'), via: 'pop', key: 'symptomes/mal-ventre', ...R},
	{at: abs('norme', 'normale'), key: 'situations/valide', ...R},
	{at: abs('norme', '1,10'), key: 'expressions/ok', ...R},
	{at: abs('norme', 'normoglycémie'), key: 'expressions/joyeuse', ...L},
	// elle s'envole avec le panoramique vers le haut
	{at: start('hyper') + 2, dur: 14, key: 'expressions/joyeuse', x: 540, y: -520, size: 230},

	/* ── hyperglycémie ── */
	{at: abs('hyper', '1,10'), via: 'pop', key: 'gestes/hausse', ...R},
	{at: abs('hyper', 'hyperglycémie'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('hyper', 'patient'), key: 'gestes/presente', ...L},
	{at: abs('hyper', 'soif'), key: 'symptomes/coup-de-chaud', fx: 'pant', ...L},
	{at: abs('hyper', 'uriner'), key: 'symptomes/toilettes', ...L},
	{at: abs('hyper', 'fatigué'), key: 'expressions/fatiguee', fx: 'slow', ...L},
	{at: abs('hyper', 'diabétiques'), key: 'accessoires/seringue', ...L},
	// saut par-dessus la vague
	{at: start('hypo') + 8, dur: 18, key: 'accessoires/seringue', ...R},

	/* ── hypoglycémie ── */
	{at: abs('hypo', 'hypoglycémie'), key: 'symptomes/etourdie', ...R},
	{at: abs('hypo', 'pas'), dur: 22, arc: 12, key: 'gestes/baisse', ...R},
	// « elle peut arriver vite » : elle déboule en courant
	{at: abs('hypo', 'vite') - 4, via: 'pop', key: 'poses/course', x: -260, y: 1840, size: 560},
	{at: abs('hypo', 'vite') + 8, via: 'run', dur: 12, key: 'poses/course', ...R},
	{at: abs('hypo', 'sueurs'), key: 'symptomes/coup-de-chaud', ...R},
	{at: abs('hypo', 'tremblements'), key: 'symptomes/grelotte', fx: 'shiver', ...R},
	{at: abs('hypo', 'faim'), key: 'symptomes/mal-ventre', ...R},
	{at: abs('hypo', 'malaise'), key: 'symptomes/malaise', fx: 'slow', ...R},
	{at: abs('hypo', 'urgence'), key: 'gestes/attention', fx: 'shake', ...R},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'glycémie'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'doigt'), key: 'gestes/regardez', ...L},
	{at: abs('outro', 'normale'), key: 'situations/valide', ...R},
	{at: abs('outro', 'hyperglycémie'), key: 'expressions/alerte', ...L},
	{at: abs('outro', 'hypoglycémie'), key: 'symptomes/etourdie', ...R},
	{at: abs('outro', 'urgence') + 24, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
