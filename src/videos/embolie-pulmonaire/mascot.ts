// Jeu de la mascotte : une étape par mot clé, gags au mot près (elle montre le podium, a mal à la poitrine sur
// « poumons », souffle sur « essoufflement », téléphone sur « alerte », seringue sur « anticoagulants », se couche
// sur « alité », marche sur « marcher ») ; elle reste d'un côté quand les pastilles apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'troisième'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('intro', 'caillot'), key: 'expressions/loupe', ...R},
	{at: abs('intro', 'poumons'), key: 'symptomes/oppression', fx: 'shake', ...R},
	{at: abs('intro', 'reconnaître'), key: 'gestes/question', ...R},
	// elle plonge dans le poumon (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'gestes/question', x: 540, y: 1000, size: 0},

	/* ── définition ── */
	{at: abs('def', 'caillot'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'phlébite'), key: 'gestes/attention', ...R},
	{at: abs('def', 'détache'), key: 'expressions/surprise', ...R},
	{at: abs('def', 'coince'), key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('def', 'manque'), key: 'expressions/inquiete', ...R},
	// sortie à gauche avec le panoramique horizontal
	{at: start('signes') - 1, dur: 12, key: 'expressions/inquiete', x: -420, y: 1500, size: 230},

	/* ── signes ── */
	{at: abs('signes', 'essoufflement'), via: 'pop', key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('signes', 'douleur'), key: 'symptomes/douleur-poitrine', ...R},
	{at: abs('signes', 'cœur'), key: 'symptomes/oppression', ...R},
	{at: abs('signes', 'crache'), key: 'symptomes/toux', ...R},
	{at: abs('signes', 'chute'), key: 'gestes/baisse', ...R},
	{at: abs('signes', 'mollet'), key: 'gestes/regardez', ...R},
	// saut par-dessus la vague
	{at: start('urgence') + 8, dur: 18, key: 'gestes/regardez', ...L},

	/* ── conduite à tenir ── */
	{at: abs('urgence', 'alerte'), key: 'expressions/alerte', fx: 'shake', ...L},
	{at: abs('urgence', '15'), key: 'accessoires/telephone', fx: 'bounce', ...L},
	{at: abs('urgence', 'demi-assise'), key: 'gestes/presente', ...L},
	{at: abs('urgence', 'surveille'), key: 'accessoires/stethoscope', ...L},
	...runAcross('traitement'),

	/* ── traitement ── */
	{at: abs('traitement', 'scanner'), via: 'pop', key: 'situations/montre-poumons', ...R},
	{at: abs('traitement', 'anticoagulants'), key: 'accessoires/seringue', ...R},
	{at: abs('traitement', 'graves'), key: 'gestes/important', ...R},
	{at: abs('traitement', 'thrombolyse'), key: 'expressions/ok', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('risques') + 2, dur: 14, key: 'expressions/ok', x: 540, y: -520, size: 230},

	/* ── facteurs de risque ── */
	{at: abs('risques', 'immobile'), via: 'pop', key: 'symptomes/dort-oreiller', ...R},
	{at: abs('risques', 'avion'), key: 'expressions/reflechit', ...R},
	{at: abs('risques', 'cancer'), key: 'expressions/inquiete', ...R},
	{at: abs('risques', 'marcher'), key: 'poses/marche', x: 830, y: 1880, size: 420},
	{at: abs('risques', 'contention'), key: 'expressions/ok', ...R},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'expressions/ok', ...L},

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'caillot'), key: 'situations/recapitule', ...L},
	{at: abs('outro', 'phlébite'), key: 'gestes/attention', ...R},
	{at: abs('outro', 'alerte'), key: 'accessoires/telephone', ...L},
	{at: abs('outro', 'anticoagulants'), key: 'accessoires/seringue', ...R},
	{at: abs('outro', 'bouge'), key: 'poses/marche', x: 640, y: 1880, size: 420},
	{at: abs('outro', 'bouge') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
