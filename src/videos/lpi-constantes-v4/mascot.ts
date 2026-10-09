// Jeu de la mascotte pour toute la vidéo (frames absolues) : une expression par mot clé,
// des places qui changent sans cesse, des métaphores physiques (elle COURT sur « trop rapide »,
// saute au ralenti sur « trop lente », sautille de façon irrégulière sur « rythme irrégulier »…).
import type {Beat} from '../../brand/MascotActor';
import {L3} from '../../brand/Lesson3';
import {RUN_WIPE} from '../../brand/motion4';
import {HOOK_ROW} from './Bookends4';
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
		/** grande, en bas de l'écran (sous la fiche) */
		low: {x: R ? 640 : 440, y: 1630, size: 410} as Spot,
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
const pa = {...spots('right', 520, 1230), low: {x: 300, y: 1690, size: 400} as Spot};
const spo2 = spots('left');

export const MASCOT: Beat[] = [
	/* ── accroche ── elle arrive en courant, bras ouverts sur « Les 5 constantes » */
	{at: 4, key: 'poses/course', x: -260, y: 1850, size: 700},
	{at: 17, via: 'run', dur: 22, key: 'poses/bras-ouverts', x: 540, y: 1850, size: 720},
	{at: abs('intro', 'surtout'), key: 'gestes/important', x: 770, y: 1470, size: 430},
	{at: abs('intro', 'étudiant'), key: 'poses/main-levee', x: 290, y: 1850, size: 700},
	{at: abs('intro', 'mots'), key: 'accessoires/livres', x: 790, y: 1580, size: 410},
	{at: abs('intro', 'absolument'), via: 'pop', key: 'situations/a-retenir', x: 560, y: 1620, size: 470},
	// elle plonge dans le picto « T° » (la caméra plonge avec elle : transition zoomInto)
	{at: start('temp') - 4, dur: 16, key: 'situations/a-retenir', x: HOOK_ROW.xs[0], y: HOOK_ROW.y + 62, size: 0},

	/* ── 1. température ── */
	{at: abs('temp', 'évalue'), via: 'pop', key: 'situations/explique', ...temp.low},
	{at: abs('temp', 'fièvre'), key: 'expressions/surprise', ...temp.home},
	{at: abs('temp', 'fébrile'), via: 'pop', key: 'expressions/stressee', fx: 'pant', ...temp.top},
	{at: abs('temp', "n'en"), key: 'expressions/sourire-leger', ...temp.home},
	{at: abs('temp', 'apyrétique'), via: 'pop', key: 'gestes/bonne-reponse', fx: 'bounce', ...temp.bottom},
	{at: abs('temp', 'basse'), key: 'expressions/triste', fx: 'shiver', ...temp.low},
	{at: abs('temp', 'hypothermie'), key: 'gestes/attention', fx: 'shiver', ...temp.low},
	...runAcross('fc'),

	/* ── 2. fréquence cardiaque ── */
	{at: abs('fc', 'nombre'), via: 'pop', key: 'accessoires/stethoscope', ...fc.home},
	// « trop rapide » : elle traverse l'écran en courant
	{at: abs('fc', 'trop') - 4, via: 'pop', key: 'poses/course', x: -260, y: 1840, size: 560},
	{at: abs('fc', 'trop') + 12, via: 'run', dur: 16, key: 'poses/course', x: 1400, y: 1840, size: 560},
	{at: abs('fc', 'tachycardie'), via: 'pop', key: 'expressions/surprise', fx: 'pant', ...fc.bottom},
	// « trop lente » : saut au ralenti, presque à ras du sol
	{at: abs('fc', 'trop', 2) + 17, dur: 34, arc: 50, key: 'expressions/fatiguee', fx: 'slow', ...fc.low},
	// « rythme irrégulier » : petits sauts irréguliers
	{at: abs('fc', 'rythme') - 4, dur: 8, key: 'expressions/questionnement', x: 300, y: 1500, size: 280},
	{at: abs('fc', 'rythme') + 6, dur: 10, key: 'expressions/questionnement', x: 200, y: 1330, size: 280},
	{at: abs('fc', 'rythme') + 19, dur: 7, key: 'expressions/questionnement', ...fc.home},
	{at: abs('fc', 'arythmie'), key: 'accessoires/schema-ecg', ...fc.home},
	// elle s'envole avec le panoramique vers le haut
	{at: start('fr') + 2, dur: 14, key: 'accessoires/schema-ecg', x: 540, y: -520, size: 230},

	/* ── 3. fréquence respiratoire ── */
	{at: abs('fr', 'nombre'), via: 'pop', key: 'situations/prend-notes', ...fr.home},
	{at: abs('fr', 'trop'), key: 'expressions/surprise', fx: 'pant', ...fr.home},
	{at: abs('fr', 'tachypnée'), key: 'expressions/surprise', fx: 'pant', ...fr.bottom},
	{at: abs('fr', 'trop', 2) + 17, dur: 34, arc: 50, key: 'expressions/fatiguee', fx: 'slow', ...fr.low},
	{at: abs('fr', 'mal'), key: 'expressions/stressee', fx: 'pant', ...fr.home},
	{at: abs('fr', 'dyspnée'), key: 'gestes/attention', fx: 'pant', ...fr.home},
	...runAcross('pa'),

	/* ── 4. pression artérielle ── */
	{at: abs('pa', 'pression'), via: 'pop', key: 'accessoires/tensiometre', ...pa.low},
	{at: abs('pa', 'paroi'), key: 'gestes/regardez', ...pa.home},
	{at: abs('pa', 'premier'), key: 'situations/donne-conseil', ...pa.home},
	{at: abs('pa', 'systolique'), via: 'pop', key: 'situations/donne-conseil', ...pa.top},
	{at: abs('pa', 'cœur'), key: 'situations/montre-schema', ...pa.home},
	{at: abs('pa', 'deuxième'), key: 'gestes/important', ...pa.home},
	{at: abs('pa', 'diastolique'), via: 'pop', key: 'gestes/important', ...pa.bottom},
	{at: abs('pa', 'relâche'), key: 'expressions/grand-sourire', fx: 'slow', ...pa.home},
	{at: abs('pa', 'trop'), key: 'expressions/en-colere', fx: 'shake', ...pa.home},
	{at: abs('pa', "l'hypertension"), via: 'pop', key: 'expressions/en-colere', fx: 'shake', ...pa.top},
	{at: abs('pa', 'trop', 2), key: 'expressions/triste', ...pa.home},
	// « hypotension » : elle s'affaisse lentement vers le bas
	{at: abs('pa', "l'hypotension"), dur: 22, arc: 12, key: 'expressions/decue', fx: 'slow', ...pa.low},
	// sortie à gauche avec le panoramique horizontal
	{at: start('spo2') - 1, dur: 12, key: 'expressions/decue', x: -420, y: 900, size: 230},

	/* ── 5. saturation ── (pas de place « haut » : la lecture de l'oxymètre est en haut à droite) */
	{at: abs('spo2', 'saturation'), via: 'pop', key: 'gestes/astuce', ...spo2.low},
	{at: abs('spo2', 'spo2'), key: 'gestes/regardez', ...spo2.home},
	{at: abs('spo2', 'oxymètre'), key: 'gestes/regardez', ...spo2.bottom},
	{at: abs('spo2', 'pourcentage'), key: 'accessoires/tablette', ...spo2.low},
	{at: abs('spo2', 'transporte'), key: 'situations/explique', ...spo2.home},
	{at: abs('spo2', 'chute'), key: 'expressions/surprise', ...spo2.home},
	{at: abs('spo2', 'désaturation'), key: 'expressions/stressee', fx: 'pant', ...spo2.bottom},
	{at: abs('spo2', 'manque'), key: 'gestes/probleme', ...spo2.home},
	{at: abs('spo2', 'hypoxémie'), key: 'gestes/attention', fx: 'pant', ...spo2.low},

	/* ── récap ── elle saute vers le récap pendant la vague, puis rappelle sa pose de chaque constante */
	{at: abs('outro', 'récapitulons') + 4, dur: 18, key: 'situations/recapitule', x: 540, y: 1600, size: 440},
	{at: abs('outro', 'température'), key: 'situations/explique', x: 300, y: 1620, size: 360},
	{at: abs('outro', 'fréquence'), key: 'accessoires/stethoscope', x: 540, y: 1560, size: 360},
	{at: abs('outro', 'fréquence', 2), key: 'situations/prend-notes', x: 780, y: 1620, size: 360},
	{at: abs('outro', 'pression'), key: 'accessoires/tensiometre', x: 540, y: 1560, size: 360},
	{at: abs('outro', 'spo2'), key: 'gestes/regardez', x: 540, y: 1560, size: 360},
	{at: abs('outro', 'spo2') + 16, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1580, size: 480},
	{at: abs('outro', 'enregistre'), key: 'accessoires/telephone', x: 860, y: 1330, size: 280},
	{at: abs('outro', 'commentaire'), key: 'situations/pose-question', x: 850, y: 1470, size: 300},
	{at: abs('outro', 'pas'), key: 'gestes/au-revoir', x: 850, y: 1470, size: 300},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1850, size: 600},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1850, size: 600},
];
