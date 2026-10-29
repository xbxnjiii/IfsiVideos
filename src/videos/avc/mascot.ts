// Jeu de la mascotte : une étape par mot clé, gags au mot près (« chut » impossible : elle se tient la tête sur
// « hémorragique », court sur « VITE », téléphone sur « le 15 », toux sur « tabac », tensiomètre sur
// « hypertension »…) ; elle reste d'un côté quand le contenu bas apparaît et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', '4'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('intro', 'avc'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('intro', 'neurones'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('intro', 'quoi'), key: 'gestes/question', ...L},
	// elle plonge dans le cerveau (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'gestes/question', x: 549, y: 1082, size: 0},

	/* ── définition ── */
	{at: abs('def', 'accident'), via: 'pop', key: 'gestes/attention', ...R},
	{at: abs('def', 'vaisseaux'), key: 'situations/explique', ...R},
	{at: abs('def', 'zone'), key: 'situations/montre-schema', ...L},
	{at: abs('def', "d'oxygène"), key: 'symptomes/essoufflee', fx: 'pant', ...L},
	{at: abs('def', 'meurent'), key: 'expressions/triste', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('isch') - 1, dur: 12, key: 'expressions/triste', x: -420, y: 1500, size: 230},

	/* ── ischémique ── */
	{at: abs('isch', 'ischémique'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('isch', 'caillot'), key: 'expressions/surprise', ...R},
	{at: abs('isch', 'bouche'), key: 'gestes/erreur', fx: 'shake', ...R},
	// saut par-dessus la vague
	{at: start('hemo') + 8, dur: 18, key: 'gestes/erreur', ...L},

	/* ── hémorragique ── */
	{at: abs('hemo', 'hémorragique'), key: 'expressions/alerte', ...L},
	{at: abs('hemo', 'rompt'), key: 'symptomes/mal-de-tete-2', fx: 'shake', ...L},
	{at: abs('hemo', 'cerveau'), key: 'expressions/inquiete', ...L},
	...runAcross('vite'),

	/* ── VITE ── */
	{at: abs('vite', 'vite'), via: 'pop', key: 'gestes/motivee', fx: 'bounce', ...R},
	{at: abs('vite', 'visage'), key: 'gestes/regardez', ...R},
	{at: abs('vite', 'inertie'), key: 'gestes/montre-haut', ...R},
	{at: abs('vite', 'répond'), key: 'expressions/inquiete', ...R},
	{at: abs('vite', 'parole'), key: 'expressions/questionnement', ...R},
	{at: abs('vite', 'mots'), key: 'expressions/reflechit', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('urgence') + 2, dur: 14, key: 'expressions/reflechit', x: 540, y: -520, size: 230},

	/* ── en urgence : le 15 ── */
	{at: abs('urgence', 'urgence'), via: 'pop', key: 'expressions/alerte', ...R},
	{at: abs('urgence', '15'), key: 'accessoires/telephone', fx: 'bounce', ...R},
	{at: abs('urgence', "l'heure"), key: 'situations/prend-notes', ...R},
	{at: abs('urgence', 'compte'), key: 'gestes/important', ...R},
	// saut par-dessus la vague
	{at: start('traitement') + 8, dur: 18, key: 'gestes/important', ...L},

	/* ── à l'hôpital ── */
	{at: abs('traitement', 'irm'), key: 'situations/cherche-info', ...L},
	{at: abs('traitement', 'caillot'), key: 'expressions/eureka', ...L},
	{at: abs('traitement', 'médicament'), key: 'situations/medicament', ...L},
	{at: abs('traitement', 'retirer'), key: 'gestes/bonne-reponse', ...L},
	// sortie à gauche avec le panoramique horizontal
	{at: start('risques') - 1, dur: 12, key: 'gestes/bonne-reponse', x: -420, y: 1500, size: 230},

	/* ── facteurs de risque ── */
	{at: abs('risques', "l'hypertension"), via: 'pop', key: 'accessoires/tensiometre', ...R},
	{at: abs('risques', 'tabac'), key: 'symptomes/toux', ...R},
	{at: abs('risques', 'diabète'), key: 'accessoires/seringue', ...R},
	{at: abs('risques', 'cholestérol'), key: 'expressions/genee', ...R},
	{at: abs('risques', 'rythme'), key: 'situations/montre-ecg', ...R},
	...runAcross('outro'),

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'privée'), via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'ischémique'), key: 'expressions/surprise', ...L},
	{at: abs('outro', 'hémorragique'), key: 'symptomes/mal-de-tete-2', ...R},
	{at: abs('outro', 'vite'), key: 'gestes/motivee', ...L},
	{at: abs('outro', '15'), key: 'accessoires/telephone', ...R},
	{at: abs('outro', '15') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
