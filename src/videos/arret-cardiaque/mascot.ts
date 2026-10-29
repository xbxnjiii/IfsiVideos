// Jeu de la mascotte : une étape par mot clé, gags au mot près (elle grelotte sur « trembler », se tient la
// poitrine sur « fibrillation », souffle sur « insufflations », danse sur « Staying Alive », croix « non » sur
// « personne ne touche ») ; elle reste d'un côté quand le contenu bas apparaît et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', "s'arrêter") + 6, via: 'pop', key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('intro', 'danger'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('intro', 'moins'), key: 'gestes/attention', ...R},
	{at: abs('intro', 'quoi'), key: 'gestes/question', ...L},
	// elle plonge dans le cœur (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'gestes/question', x: 540, y: 960, size: 0},

	/* ── définition ── */
	{at: abs('def', 'pompe'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'trembler'), key: 'symptomes/grelotte', fx: 'shiver', ...R},
	{at: abs('def', 'fibrillation'), key: 'symptomes/douleur-poitrine', ...R},
	{at: abs('def', 'cerveau'), key: 'expressions/inquiete', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('reconnaitre') - 1, dur: 12, key: 'expressions/inquiete', x: -420, y: 1500, size: 230},

	/* ── reconnaître ── */
	{at: abs('reconnaitre', 'répond'), via: 'pop', key: 'gestes/question', ...R},
	{at: abs('reconnaitre', 'parle'), key: 'gestes/bonjour', ...R},
	{at: abs('reconnaitre', 'stimule'), key: 'expressions/surprise', ...R},
	{at: abs('reconnaitre', 'bascule'), key: 'gestes/presente', ...R},
	{at: abs('reconnaitre', 'secondes'), key: 'expressions/reflechit', ...R},
	{at: abs('reconnaitre', 'gasps'), key: 'symptomes/essoufflee', fx: 'pant', ...R},
	// saut par-dessus la vague
	{at: start('alerter') + 8, dur: 18, key: 'symptomes/essoufflee', ...L},

	/* ── alerter ── */
	{at: abs('alerter', '15'), key: 'accessoires/telephone', fx: 'bounce', ...L},
	{at: abs('alerter', 'défibrillateur'), key: 'gestes/important', ...L},
	...runAcross('masser'),

	/* ── masser ── */
	{at: abs('masser', 'centre'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('masser', 'tendus'), key: 'gestes/motivee', fx: 'bounce', ...R},
	{at: abs('masser', 'centimètres'), key: 'expressions/ok', ...R},
	{at: abs('masser', 'staying'), key: 'expressions/youpi', fx: 'bounce', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('rcp') + 2, dur: 14, key: 'expressions/youpi', x: 540, y: -520, size: 230},

	/* ── RCP ── */
	{at: abs('rcp', 'réanimation'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('rcp', '30'), key: 'gestes/motivee', ...R},
	{at: abs('rcp', 'insufflations'), key: 'symptomes/souffle', ...R},
	{at: abs('rcp', "s'arrête"), key: 'gestes/important', ...R},
	{at: abs('rcp', 'secours'), key: 'situations/valide', ...R},
	// saut par-dessus la vague
	{at: start('dae') + 8, dur: 18, key: 'situations/valide', ...L},

	/* ── défibrillateur ── */
	{at: abs('dae', 'voix'), key: 'gestes/regardez', ...L},
	{at: abs('dae', 'analyse'), key: 'situations/cherche-info', ...L},
	{at: abs('dae', 'choc'), key: 'expressions/alerte', fx: 'shake', ...L},
	{at: abs('dae', 'personne'), key: 'gestes/erreur', ...L},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'répond'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'cardiaque'), key: 'symptomes/douleur-poitrine', ...L},
	{at: abs('outro', '15'), key: 'accessoires/telephone', ...R},
	{at: abs('outro', 'masse'), key: 'gestes/motivee', ...R},
	{at: abs('outro', 'défibrille'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'compte') + 22, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
