// Jeu de la mascotte : surprise sur les « 3 kilos », questionnement (il mange moins !), elle dort sur son oreiller,
// inquiète devant les chevilles, « non » sur « c'est l'âge », épuisée avec le cœur, alerte sur « insuffisance
// cardiaque », stressée quand les poumons se noient ; puis un geste au mot près par notion (douleur à la poitrine sur
// l'infarctus, tensiomètre, essoufflée, oppressée couchée, toilettes sur « uriner », téléphone sur « on appelle »…).
// Elle reste en bas (les pastilles occupent y 1010 – 1450) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'kilos'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('intro', 'mange'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'dort'), key: 'symptomes/dort-oreiller', ...R},
	{at: abs('intro', 'chevilles'), key: 'expressions/inquiete', ...R},
	{at: abs('intro', "l'âge"), key: 'gestes/erreur', ...R},
	{at: abs('intro', "s'épuise"), key: 'symptomes/epuisee', ...R},
	{at: abs('intro', "l'insuffisance"), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('intro', 'noyer'), key: 'expressions/stressee', fx: 'shake', ...R},
	// elle plonge (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/stressee', x: 540, y: 700, size: 0},

	/* ── définition ── */
	{at: abs('def', 'cœur'), via: 'pop', key: 'situations/explique', ...L},
	{at: abs('def', 'pomper'), key: 'symptomes/lasse', ...L},
	{at: abs('def', 'infarctus'), key: 'symptomes/douleur-poitrine', fx: 'shake', ...L},
	{at: abs('def', "d'hypertension"), key: 'accessoires/tensiometre', ...L},
	// sortie à gauche avec le panoramique
	{at: start('gauche') - 1, dur: 12, key: 'accessoires/tensiometre', x: -420, y: 1500, size: 230},

	/* ── cœur gauche ── */
	{at: abs('gauche', 'poumons'), via: 'pop', key: 'situations/montre-poumons', ...R},
	{at: abs('gauche', "s'essouffle"), key: 'symptomes/essoufflee', ...R},
	{at: abs('gauche', 'allongé'), key: 'symptomes/oppression', fx: 'shake', ...R},
	{at: abs('gauche', "l'orthopnée"), key: 'gestes/important', ...R},
	{at: abs('gauche', "qu'assis"), key: 'expressions/ok', ...R},
	// saut par-dessus la vague
	{at: start('droite') + 8, dur: 18, key: 'expressions/ok', ...L},

	/* ── cœur droit ── */
	{at: abs('droite', 'chevilles'), key: 'expressions/surprise', ...L},
	{at: abs('droite', 'œdèmes'), key: 'gestes/regardez', ...L},
	{at: abs('droite', 'poids'), key: 'gestes/hausse', ...L},
	...runAcross('role'),

	/* ── la pesée ── */
	{at: abs('role', 'peser'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('role', 'heure'), key: 'situations/prend-notes', ...R},
	{at: abs('role', 'deux'), key: 'gestes/hausse', ...R},
	{at: abs('role', 'alerte'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('role', 'surveilles'), key: 'expressions/loupe', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('traitement') + 2, dur: 14, key: 'expressions/loupe', x: 540, y: -520, size: 230},

	/* ── traitement ── */
	{at: abs('traitement', 'diurétiques'), via: 'pop', key: 'situations/medicament', ...L},
	{at: abs('traitement', 'uriner'), key: 'symptomes/toilettes', ...L},
	{at: abs('traitement', 'soulagent'), key: 'expressions/coeur-mains', ...L},
	{at: abs('traitement', 'sel'), key: 'gestes/attention', ...L},
	{at: abs('traitement', 'retient'), key: 'situations/explique', ...L},
	// elle plonge (zoomInto)
	{at: start('urgence') - 4, dur: 16, key: 'situations/explique', x: 540, y: 700, size: 0},

	/* ── urgence : OAP ── */
	{at: abs('urgence', 'inonde'), via: 'pop', key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('urgence', 'étouffe'), key: 'symptomes/oppression', ...R},
	{at: abs('urgence', 'mousse'), key: 'expressions/stressee', ...R},
	{at: abs('urgence', "l'assoit"), key: 'gestes/important', ...R},
	{at: abs('urgence', "l'oxygène"), key: 'symptomes/souffle', ...R},
	{at: abs('urgence', 'appelle'), key: 'accessoires/telephone', ...R},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'accessoires/telephone', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'droite'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'pesée'), key: 'situations/valide', ...L},
	{at: abs('outro', 'étouffe'), key: 'expressions/alerte', ...R},
	{at: abs('outro', "l'urgence") + 20, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
