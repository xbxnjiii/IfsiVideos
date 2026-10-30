// Jeu de la mascotte : une étape par mot clé (essoufflée sur « effort », surprise au compte à rebours, elle montre les
// poumons sur « bronches », tousse sur « toux », stéthoscope sur la spirométrie, médicament sur « inhalateurs »,
// alerte sur l'exacerbation) ; elle reste d'un côté quand les pastilles apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'effort'), via: 'pop', key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('intro', 'trois'), key: 'expressions/surprise', ...R},
	{at: abs('intro', 'passe-t-il'), key: 'expressions/loupe', ...R},
	{at: abs('intro', 'bpco'), key: 'gestes/important', fx: 'shake', ...R},
	{at: abs('intro', 'quoi'), key: 'gestes/question', ...R},
	// elle plonge dans les poumons (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'gestes/question', x: 540, y: 1000, size: 0},

	/* ── définition : les 4 lignes du sigle sont à gauche ── */
	{at: abs('def', 'broncho'), via: 'pop', key: 'situations/montre-poumons', x: 860, y: 1730, size: 330},
	{at: abs('def', 'chronique', 2), key: 'expressions/reflechit', x: 860, y: 1730, size: 330},
	{at: abs('def', 'mal'), key: 'symptomes/essoufflee', fx: 'pant', x: 860, y: 1730, size: 330},
	// saut par-dessus la vague
	{at: start('dedans') + 8, dur: 18, key: 'symptomes/essoufflee', ...L},

	/* ── dans les bronches ── */
	{at: abs('dedans', "s'enflamment"), key: 'expressions/loupe', ...L},
	{at: abs('dedans', 'rétrécissent'), key: 'expressions/inquiete', ...L},
	{at: abs('dedans', 'détruisent'), key: 'expressions/stressee', ...L},
	{at: abs('dedans', 'piégé'), key: 'symptomes/oppression', fx: 'shake', ...L},
	// sortie à gauche avec le panoramique
	{at: start('cause') - 1, dur: 12, key: 'symptomes/oppression', x: -420, y: 1500, size: 230},

	/* ── cause (pastilles à gauche) ── */
	{at: abs('cause', 'tabac'), via: 'pop', key: 'gestes/erreur', ...R},
	{at: abs('cause', 'huit'), key: 'expressions/surprise', ...R},
	{at: abs('cause', 'poussières'), key: 'symptomes/masque', ...R},
	...runAcross('signes'),

	/* ── signes ── */
	{at: abs('signes', 'essoufflement'), via: 'pop', key: 'symptomes/essoufflee', fx: 'pant', ...R},
	{at: abs('signes', 'toux'), key: 'symptomes/toux', ...R},
	{at: abs('signes', 'crachats'), key: 'symptomes/toux-main', ...R},
	{at: abs('signes', 'hiver'), key: 'symptomes/grelotte', fx: 'shiver', ...R},
	{at: abs('signes', 'fumeur'), key: 'gestes/erreur', ...R},
	// elle plonge dans le spiromètre
	{at: start('diag') - 4, dur: 16, key: 'gestes/erreur', x: 540, y: 700, size: 0},

	/* ── diagnostic ── */
	{at: abs('diag', 'souffle'), via: 'pop', key: 'symptomes/souffle', ...R},
	{at: abs('diag', 'seconde'), key: 'expressions/loupe', ...R},
	{at: abs('diag', 'obstruées'), key: 'gestes/important', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('traitement') + 2, dur: 14, key: 'gestes/important', x: 540, y: -520, size: 230},

	/* ── traitement (puces à gauche) ── */
	{at: abs('traitement', 'arrêter'), via: 'pop', key: 'gestes/erreur', ...R},
	{at: abs('traitement', 'inhalateurs'), key: 'situations/medicament', ...R},
	{at: abs('traitement', 'réhabilitation'), key: 'poses/marche', x: 830, y: 1880, size: 420},
	{at: abs('traitement', 'vaccins'), key: 'accessoires/seringue', ...R},
	// saut par-dessus la vague
	{at: start('oxygene') + 8, dur: 18, key: 'accessoires/seringue', ...R},

	/* ── oxygène, exacerbation ── */
	{at: abs('oxygene', 'saturation'), key: 'accessoires/stethoscope', ...R},
	{at: abs('oxygene', 'cent'), key: 'gestes/attention', ...R},
	{at: abs('oxygene', "s'aggrave"), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('oxygene', 'consulte'), key: 'accessoires/telephone', fx: 'bounce', ...R},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'accessoires/telephone', x: -420, y: 1500, size: 230},

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'bpco'), via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'cause'), key: 'gestes/erreur', ...R},
	{at: abs('outro', 'confirme'), key: 'symptomes/souffle', ...L},
	{at: abs('outro', 'freine'), key: 'situations/medicament', ...R},
	{at: abs('outro', 'inhalateurs') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
