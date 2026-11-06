// Jeu de la mascotte (BPCO v2) : elle tousse avec lui, s'essouffle à l'étage, « non » sur « Faux ! », alerte sur
// « BPCO » ; elle explique le sigle ; pendant la radio elle regarde à la loupe chaque couche, montre les poumons,
// s'inquiète « chez lui », étouffe sur « piégé » ; puis un geste au mot près (masque sur les poussières, toux,
// grelotte l'hiver, souffle dans le tube, médicament sur l'inhalateur, seringue sur les vaccins, téléphone sur
// « on consulte »…). Elle reste en bas (le contenu s'arrête vers y 1440) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche : juste une toux de fumeur ? ── */
	{at: abs('intro', 'tous'), via: 'pop', key: 'symptomes/toux', ...R},
	{at: abs('intro', 'crache'), key: 'symptomes/toux-main', ...R},
	{at: abs('intro', "l'escalier"), key: 'gestes/regardez', ...R},
	{at: abs('intro', 'étage'), key: 'symptomes/essoufflee', ...R},
	{at: abs('intro', 'dit'), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'faux'), key: 'gestes/erreur', fx: 'shake', ...R},
	{at: abs('intro', 'bpco'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('intro', 'deux'), key: 'expressions/surprise', ...R},
	{at: abs('intro', 'savent'), key: 'expressions/inquiete', ...R},
	// elle plonge (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/inquiete', x: 540, y: 1000, size: 0},

	/* ── définition ── */
	{at: abs('def', 'bronchopneumopathie'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'chronique'), key: 'situations/reflexion', ...R},
	{at: abs('def', 'bronches'), key: 'situations/montre-poumons', ...R},
	{at: abs('def', 'vie'), key: 'expressions/fatiguee', ...R},
	{at: abs('def', 'mal'), key: 'symptomes/essoufflee', ...R},
	// saut par-dessus la vague
	{at: start('radio') + 8, dur: 18, key: 'symptomes/essoufflee', ...L},

	/* ── la radio, couche par couche ── */
	{at: abs('radio', 'radio'), key: 'expressions/loupe', ...L},
	{at: abs('radio', 'poumons'), key: 'situations/montre-poumons', ...L},
	{at: abs('radio', "l'intérieur"), key: 'expressions/surprise', ...L},
	{at: abs('radio', 'trachée'), key: 'situations/explique', ...L},
	{at: abs('radio', 'alvéoles'), key: 'expressions/loupe', ...L},
	{at: abs('radio', "l'oxygène"), key: 'expressions/joyeuse', ...L},
	{at: abs('radio', 'mais'), key: 'expressions/inquiete', ...L},
	{at: abs('radio', 'mucus'), key: 'symptomes/toux-main', ...L},
	{at: abs('radio', 'rétrécissent'), key: 'symptomes/essoufflee', ...L},
	{at: abs('radio', 'cassent'), key: 'expressions/stressee', ...L},
	{at: abs('radio', 'piégé'), key: 'symptomes/oppression', fx: 'shake', ...L},
	// sortie à gauche avec le panoramique
	{at: start('cause') - 1, dur: 12, key: 'symptomes/oppression', x: -420, y: 1500, size: 230},

	/* ── la cause ── */
	{at: abs('cause', 'coupable'), via: 'pop', key: 'expressions/en-colere', ...R},
	{at: abs('cause', 'tabac'), key: 'gestes/attention', ...R},
	{at: abs('cause', 'huit'), key: 'expressions/surprise', ...R},
	{at: abs('cause', 'poussières'), key: 'symptomes/masque', ...R},
	{at: abs('cause', 'pollution'), key: 'symptomes/toux', ...R},
	...runAcross('signes'),

	/* ── les signes ── */
	{at: abs('signes', 'essoufflement'), via: 'pop', key: 'symptomes/essoufflee', ...R},
	{at: abs('signes', 'rien'), key: 'symptomes/epuisee', ...R},
	{at: abs('signes', 'toux'), key: 'symptomes/toux', ...R},
	{at: abs('signes', 'crachats'), key: 'symptomes/toux-main', ...R},
	{at: abs('signes', 'matin'), key: 'symptomes/baille', ...R},
	{at: abs('signes', 'hiver'), key: 'symptomes/grelotte', ...R},
	// elle plonge (zoomInto)
	{at: start('diag') - 4, dur: 16, key: 'symptomes/grelotte', x: 540, y: 700, size: 0},

	/* ── la spirométrie ── */
	{at: abs('diag', 'spirométrie'), via: 'pop', key: 'symptomes/souffle', ...R},
	{at: abs('diag', 'tube'), key: 'situations/explique', ...R},
	{at: abs('diag', 'seconde'), key: 'expressions/loupe', ...R},
	{at: abs('diag', 'obstruées'), key: 'gestes/important', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('traitement') + 2, dur: 14, key: 'gestes/important', x: 540, y: -520, size: 230},

	/* ── le traitement ── */
	{at: abs('traitement', 'guérit') + 3, via: 'pop', key: 'expressions/triste', ...R},
	{at: abs('traitement', 'freiner'), key: 'gestes/astuce', ...R},
	{at: abs('traitement', 'arrêter'), key: 'gestes/erreur', ...R},
	{at: abs('traitement', 'inhalateurs'), key: 'situations/medicament', ...R},
	{at: abs('traitement', 'réhabilitation'), key: 'gestes/motivee', ...R},
	{at: abs('traitement', 'vaccins'), key: 'accessoires/seringue', ...R},
	// saut par-dessus la vague
	{at: start('oxygene') + 8, dur: 18, key: 'accessoires/seringue', ...L},

	/* ── oxygène et exacerbation ── */
	{at: abs('oxygene', "l'oxygène"), key: 'situations/explique', ...L},
	{at: abs('oxygene', 'petit'), key: 'gestes/attention', ...L},
	{at: abs('oxygene', 'quatre-vingt-huit'), key: 'situations/a-retenir', ...L},
	{at: abs('oxygene', "s'aggrave"), key: 'expressions/alerte', fx: 'shake', ...L},
	{at: abs('oxygene', 'exacerbation'), key: 'symptomes/oppression', ...L},
	{at: abs('oxygene', 'consulte'), key: 'accessoires/telephone', ...L},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'accessoires/telephone', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'cause'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'confirme'), key: 'situations/valide', ...L},
	{at: abs('outro', 'freine'), key: 'expressions/pouce', ...R},
	{at: abs('outro', 'inhalateurs') + 20, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
