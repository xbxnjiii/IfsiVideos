// v5 : même jeu que le pilote v4 (tempo, places, métaphores physiques) avec les NOUVELLES planches :
// symptômes (fièvre, froid, essoufflement, vertige…), situations (schéma du cœur, des poumons, ECG…),
// gestes ↑ / ↓ pour les chiffres. Bustes LIBRES (sans cadre), bas adouci par un fondu.
import type {Beat} from '../../brand/MascotActor';
import {L3} from '../../brand/Lesson3';
import {RUN_WIPE} from '../../brand/motion4';
import {HOOK_ROW} from './Bookends';
import {abs, SCENE_IDS, SceneId, TL} from './timeline';

type Spot = Pick<Beat, 'x' | 'y' | 'size'>;

/** Places d'une leçon selon le côté de la fiche (la mascotte prend l'autre côté).
 *  Vérifié image par image : aucune place ne masque le titre, la définition, la fiche ni la lecture du socle. */
const spots = (side: 'left' | 'right', stageH = L3.stageH, homeY = 1215) => {
	const slamY = L3.stageY + stageH / 2;
	const R = side === 'left';
	return {
		/** à côté de la fiche */
		home: {x: R ? 830 : 245, y: homeY, size: 290} as Spot,
		/** grande, qui monte du bas de l'écran (sous la fiche) */
		low: {x: R ? 640 : 440, y: 1690, size: 420} as Spot,
		/** posée sur le coin haut-droit du terme qui claque (seulement si la définition est courte) */
		top: {x: 900, y: slamY - 145, size: 205} as Spot,
		/** accrochée sous le coin du terme, côté libre */
		bottom: {x: R ? 905 : 175, y: slamY + 238, size: 215} as Spot,
	};
};

const start = (id: SceneId) => TL.starts[SCENE_IDS.indexOf(id)];

/** Sortie à gauche puis traversée en courant pendant la transition `runWipe` vers `id`. */
const runAcross = (id: SceneId): Beat[] => {
	const s = start(id);
	const run = {key: 'poses/course', y: 1830, size: 620} as const;
	return [
		{...run, at: s - 6, via: 'pop', x: RUN_WIPE.x0 + 60},
		{...run, at: s + Math.round(TL.transition / 2), via: 'run', dur: TL.transition, x: RUN_WIPE.x1 + 60},
	];
};

const temp = spots('left');
const fc = spots('right');
const fr = spots('left');
// 4 termes : la fiche descend plus bas, la place « basse » se décale à gauche
const pa = {...spots('right', 520, 1230), low: {x: 280, y: 1660, size: 380} as Spot};
const spo2 = spots('left');

export const MASCOT: Beat[] = [
	/* ── accroche ── elle arrive en courant et présente « Les 5 constantes » */
	{at: 4, key: 'poses/course', x: -260, y: 1850, size: 700},
	{at: 17, via: 'run', dur: 22, key: 'poses/presente', x: 520, y: 1850, size: 720},
	{at: abs('intro', 'surtout'), key: 'expressions/alerte', x: 770, y: 1480, size: 420},
	// « étudiant » : l'étudiante au sac à dos monte du bas de l'écran
	{at: abs('intro', 'étudiant'), key: 'poses/sac-a-dos', x: 300, y: 1990, size: 780},
	{at: abs('intro', 'mots'), key: 'situations/revise', x: 760, y: 1600, size: 440},
	{at: abs('intro', 'absolument'), via: 'pop', key: 'situations/a-retenir', x: 560, y: 1640, size: 470},
	// elle plonge dans le picto « T° » (la caméra plonge avec elle : transition zoomInto)
	{at: start('temp') - 4, dur: 16, key: 'situations/a-retenir', x: HOOK_ROW.xs[0], y: HOOK_ROW.y + 62, size: 0},

	/* ── 1. température ── */
	{at: abs('temp', 'évalue'), via: 'pop', key: 'situations/explique', ...temp.low},
	{at: abs('temp', 'fièvre'), key: 'symptomes/fievre', ...temp.home},
	{at: abs('temp', 'fébrile'), via: 'pop', key: 'symptomes/fievre-couverture', fx: 'pant', ...temp.top},
	{at: abs('temp', "n'en"), key: 'expressions/neutre', ...temp.home},
	{at: abs('temp', 'apyrétique'), via: 'pop', key: 'situations/valide', fx: 'bounce', ...temp.bottom},
	{at: abs('temp', 'basse'), key: 'symptomes/froid', fx: 'shiver', ...temp.low},
	{at: abs('temp', 'hypothermie'), key: 'symptomes/grelotte', fx: 'shiver', ...temp.low},
	...runAcross('fc'),

	/* ── 2. fréquence cardiaque ── */
	{at: abs('fc', 'nombre'), via: 'pop', key: 'situations/montre-schema', ...fc.home},
	// « trop rapide » : elle traverse l'écran en courant
	{at: abs('fc', 'trop') - 4, via: 'pop', key: 'poses/course', x: -260, y: 1840, size: 560},
	{at: abs('fc', 'trop') + 12, via: 'run', dur: 16, key: 'poses/course', x: 1400, y: 1840, size: 560},
	{at: abs('fc', 'tachycardie'), via: 'pop', key: 'symptomes/douleur-poitrine', fx: 'pant', ...fc.bottom},
	// « trop lente » : saut au ralenti, presque à ras du sol
	{at: abs('fc', 'trop', 2) + 17, dur: 34, arc: 50, key: 'expressions/fatiguee', fx: 'slow', ...fc.low},
	// « rythme irrégulier » : petits sauts irréguliers
	{at: abs('fc', 'rythme') - 4, dur: 8, key: 'expressions/questionnement', x: 300, y: 1500, size: 280},
	{at: abs('fc', 'rythme') + 6, dur: 10, key: 'expressions/questionnement', x: 200, y: 1330, size: 280},
	{at: abs('fc', 'rythme') + 19, dur: 7, key: 'expressions/questionnement', ...fc.home},
	{at: abs('fc', 'arythmie'), key: 'situations/montre-ecg', ...fc.home},
	// elle s'envole avec le panoramique vers le haut
	{at: start('fr') + 2, dur: 14, key: 'situations/montre-ecg', x: 540, y: -520, size: 230},

	/* ── 3. fréquence respiratoire ── */
	{at: abs('fr', 'nombre'), via: 'pop', key: 'situations/montre-poumons', ...fr.home},
	{at: abs('fr', 'trop'), key: 'symptomes/essoufflee', fx: 'pant', ...fr.home},
	{at: abs('fr', 'tachypnée'), key: 'symptomes/souffle', fx: 'pant', ...fr.bottom},
	// « trop lente » : elle s'endort (saut au ralenti)
	{at: abs('fr', 'trop', 2) + 17, dur: 34, arc: 50, key: 'symptomes/dort', fx: 'slow', ...fr.low},
	{at: abs('fr', 'mal'), key: 'symptomes/oppression', fx: 'pant', ...fr.home},
	{at: abs('fr', 'dyspnée'), key: 'gestes/attention', fx: 'pant', ...fr.home},
	...runAcross('pa'),

	/* ── 4. pression artérielle ── */
	{at: abs('pa', 'pression'), via: 'pop', key: 'accessoires/tensiometre', ...pa.low},
	{at: abs('pa', 'paroi'), key: 'gestes/regardez', ...pa.home},
	// 1er chiffre = celui du haut ↑, 2e chiffre = celui du bas ↓
	{at: abs('pa', 'premier'), key: 'gestes/hausse', ...pa.home},
	{at: abs('pa', 'systolique'), via: 'pop', key: 'gestes/hausse', ...pa.top},
	{at: abs('pa', 'cœur'), key: 'situations/montre-schema', ...pa.home},
	{at: abs('pa', 'deuxième'), key: 'gestes/baisse', ...pa.home},
	{at: abs('pa', 'diastolique'), via: 'pop', key: 'gestes/baisse', ...pa.bottom},
	{at: abs('pa', 'relâche'), key: 'expressions/ok', fx: 'slow', ...pa.home},
	{at: abs('pa', 'trop'), key: 'expressions/en-colere', fx: 'shake', ...pa.home},
	{at: abs('pa', "l'hypertension"), via: 'pop', key: 'symptomes/mal-de-tete-2', fx: 'shake', ...pa.top},
	{at: abs('pa', 'trop', 2), key: 'symptomes/etourdie', ...pa.home},
	// « hypotension » : la tête tourne, elle s'affaisse lentement vers le bas
	{at: abs('pa', "l'hypotension"), dur: 22, arc: 12, key: 'symptomes/vertige', fx: 'slow', ...pa.low},
	// sortie à gauche avec le panoramique horizontal
	{at: start('spo2') - 1, dur: 12, key: 'symptomes/vertige', x: -420, y: 900, size: 230},

	/* ── 5. saturation ── (pas de place « haut » : la lecture de l'oxymètre est en haut à droite) */
	{at: abs('spo2', 'saturation'), via: 'pop', key: 'gestes/astuce', ...spo2.low},
	{at: abs('spo2', 'spo2'), key: 'gestes/regardez', ...spo2.home},
	{at: abs('spo2', 'oxymètre'), key: 'expressions/loupe', ...spo2.bottom},
	{at: abs('spo2', 'pourcentage'), key: 'accessoires/tablette', ...spo2.low},
	{at: abs('spo2', 'transporte'), key: 'situations/explique', ...spo2.home},
	{at: abs('spo2', 'chute'), key: 'gestes/baisse', ...spo2.home},
	{at: abs('spo2', 'désaturation'), key: 'expressions/inquiete', fx: 'pant', ...spo2.bottom},
	{at: abs('spo2', 'manque'), key: 'symptomes/malaise', ...spo2.home},
	{at: abs('spo2', 'hypoxémie'), key: 'gestes/attention', fx: 'pant', ...spo2.low},

	/* ── récap ── elle saute vers le récap pendant la vague, puis rappelle sa pose de chaque constante */
	{at: abs('outro', 'récapitulons') + 4, dur: 18, key: 'situations/recapitule', x: 540, y: 1640, size: 440},
	{at: abs('outro', 'température'), key: 'symptomes/fievre', x: 300, y: 1660, size: 360},
	{at: abs('outro', 'fréquence'), key: 'situations/montre-schema', x: 540, y: 1600, size: 360},
	{at: abs('outro', 'fréquence', 2), key: 'situations/montre-poumons', x: 780, y: 1660, size: 360},
	{at: abs('outro', 'pression'), key: 'accessoires/tensiometre', x: 540, y: 1600, size: 360},
	{at: abs('outro', 'spo2'), key: 'expressions/loupe', x: 540, y: 1600, size: 360},
	{at: abs('outro', 'spo2') + 16, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1620, size: 480},
	{at: abs('outro', 'enregistre'), key: 'situations/lit-cours', x: 860, y: 1340, size: 280},
	{at: abs('outro', 'commentaire'), key: 'situations/pose-question', x: 850, y: 1480, size: 300},
	// au revoir en pied, puis elle repart en courant avant le logo
	{at: abs('outro', 'pas'), key: 'poses/main-levee', x: 850, y: 1880, size: 640},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1850, size: 600},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1850, size: 600},
];
