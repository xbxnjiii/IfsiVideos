// Jeu de la mascotte (partie 2) : inquiète devant le patient qui ne parle plus, surprise quand il souffre, se demande
// comment savoir, présente la grille, « non » sur « ça se devine », valide sur « ça se mesure » ; puis un geste au mot
// près (loupe sur « en l'observant », checklist, médicament sur « on le soulage », elle dort sur « endormi »…).
// Elle reste en bas (le contenu s'arrête vers y 1450) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'parler'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'souffre'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'comment'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'échelle'), key: 'situations/checklist', ...R},
	{at: abs('intro', 'devine'), key: 'gestes/erreur', ...R},
	{at: abs('intro', 'mesure'), key: 'situations/valide', fx: 'bounce', ...R},
	// elle plonge (zoomInto)
	{at: start('serie') - 4, dur: 16, key: 'situations/valide', x: 540, y: 700, size: 0},

	/* ── la série ── */
	{at: abs('serie', 'deux'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('serie', 'répondre'), key: 'situations/a-retenir', ...R},
	// sortie à gauche avec le panoramique
	{at: start('hetero') - 1, dur: 12, key: 'situations/a-retenir', x: -420, y: 1500, size: 230},

	/* ── principe ── */
	{at: abs('hetero', 'toi'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('hetero', "l'observant"), key: 'expressions/loupe', ...R},
	{at: abs('hetero', "l'hétéro-évaluation"), key: 'situations/a-retenir', ...R},
	{at: abs('hetero', 'plaintes'), key: 'symptomes/douleur', ...R},
	// saut par-dessus la vague
	{at: start('algoplus') + 8, dur: 18, key: 'symptomes/douleur', ...L},

	/* ── Algoplus ── */
	{at: abs('algoplus', 'algoplus'), key: 'gestes/presente', ...L},
	{at: abs('algoplus', 'visage'), key: 'gestes/regardez', ...L},
	{at: abs('algoplus', 'un'), key: 'situations/checklist', ...L},
	{at: abs('algoplus', 'dès'), key: 'gestes/important', ...L},
	{at: abs('algoplus', 'soulage'), key: 'situations/medicament', ...L},
	...runAcross('doloplus'),

	/* ── Doloplus ── */
	{at: abs('doloplus', 'temps'), via: 'pop', key: 'expressions/fatiguee', ...R},
	{at: abs('doloplus', 'doloplus'), key: 'gestes/presente', ...R},
	{at: abs('doloplus', 'dix'), key: 'situations/checklist', ...R},
	{at: abs('doloplus', 'trente'), key: 'gestes/hausse', ...R},
	{at: abs('doloplus', 'présente'), key: 'gestes/important', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('bps') + 2, dur: 14, key: 'gestes/important', x: 540, y: -520, size: 230},

	/* ── BPS ── */
	{at: abs('bps', 'intubé'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('bps', 'endormi'), key: 'symptomes/dort', ...R},
	{at: abs('bps', 'visage'), key: 'gestes/regardez', ...R},
	{at: abs('bps', 'respirateur'), key: 'situations/montre-ecg', ...R},
	// elle plonge (zoomInto)
	{at: start('evendol') - 4, dur: 16, key: 'situations/montre-ecg', x: 540, y: 700, size: 0},

	/* ── EVENDOL ── */
	{at: abs('evendol', "l'enfant"), via: 'pop', key: 'expressions/coeur-mains', ...R},
	{at: abs('evendol', 'voix'), key: 'expressions/triste', ...R},
	{at: abs('evendol', 'mouvements'), key: 'expressions/surprise', ...R},
	{at: abs('evendol', 'dès'), key: 'gestes/important', ...R},
	{at: abs('evendol', 'soulage'), key: 'situations/medicament', ...R},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'situations/medicament', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'algoplus'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'bps'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'toujours'), key: 'gestes/important', ...R},
	{at: abs('outro', 'réévalue') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
