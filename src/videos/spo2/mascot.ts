// Jeu de la mascotte : une étape par mot clé, gags au mot près (loupe sur « saturomètres », elle souffle sur
// « respire », montre les poumons, croix sur « vernis », a froid sur « main », tousse sur « BPCO », téléphone sur
// « on prévient ») ; elle reste d'un côté quand les signes apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'tous'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('intro', 'quoi'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', "s'inquiéter"), key: 'expressions/stressee', fx: 'shake', ...R},
	// elle plonge dans l'écran du saturomètre (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/stressee', x: 540, y: 860, size: 0},

	/* ── définition ── */
	{at: abs('def', 'saturation'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'respire'), key: 'symptomes/souffle', ...R},
	{at: abs('def', 'poumons'), key: 'situations/montre-poumons', ...L},
	{at: abs('def', "l'hémoglobine"), key: 'expressions/reflechit', ...L},
	{at: abs('def', 'transportent'), key: 'expressions/eureka', ...L},
	{at: abs('def', 'pourcentage'), key: 'situations/montre-schema', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('mesure') - 1, dur: 12, key: 'situations/montre-schema', x: -420, y: 1500, size: 230},

	/* ── mesure ── */
	{at: abs('mesure', 'saturomètre'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('mesure', 'pince'), key: 'gestes/regardez', ...R},
	{at: abs('mesure', 'battement'), key: 'expressions/coeur-mains', ...R},
	{at: abs('mesure', 'fiable'), key: 'gestes/astuce', ...R},
	{at: abs('mesure', 'vernis'), key: 'gestes/erreur', ...R},
	{at: abs('mesure', 'main'), key: 'symptomes/froid', fx: 'shiver', ...R},
	{at: abs('mesure', 'régulière'), key: 'expressions/ok', ...R},
	// saut par-dessus la vague
	{at: start('norme') + 8, dur: 18, key: 'expressions/ok', ...L},

	/* ── norme ── */
	{at: abs('norme', 'normale'), key: 'situations/valide', ...L},
	{at: abs('norme', '100'), key: 'expressions/joyeuse', ...L},
	{at: abs('norme', 'bpco'), key: 'symptomes/toux', ...R},
	{at: abs('norme', 'médecin'), key: 'accessoires/stethoscope', ...R},
	{at: abs('norme', 'cible'), key: 'gestes/important', ...R},
	...runAcross('bas'),

	/* ── trop bas ── */
	{at: abs('bas', '95') + 10, via: 'pop', key: 'gestes/baisse', ...R},
	{at: abs('bas', 'désaturation'), key: 'expressions/inquiete', ...R},
	{at: abs('bas', 'hypoxémie'), key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('bas', 'urgence'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('bas', 'prévient'), key: 'accessoires/telephone', fx: 'bounce', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('signes') + 2, dur: 14, key: 'accessoires/telephone', x: 540, y: -520, size: 230},

	/* ── signes ── */
	{at: abs('signes', 'essoufflé'), via: 'pop', key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('signes', 'bleutés'), key: 'expressions/surprise', ...R},
	{at: abs('signes', 'cyanose'), key: 'gestes/attention', ...R},
	{at: abs('signes', 'agité'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('signes', 'confus'), key: 'symptomes/etourdie', ...R},
	{at: abs('signes', 'chiffre'), key: 'gestes/important', ...R},
	{at: abs('signes', 'toujours'), key: 'expressions/loupe', ...R},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', "l'hémoglobine"), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'doigt'), key: 'gestes/regardez', ...L},
	{at: abs('outro', 'normale'), key: 'situations/valide', ...R},
	{at: abs('outro', 'désaturation'), key: 'gestes/baisse', ...L},
	{at: abs('outro', 'hypoxémie'), key: 'expressions/alerte', ...R},
	{at: abs('outro', 'urgence') + 24, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
