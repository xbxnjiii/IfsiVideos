// Jeu de la mascotte : inquiète devant les microbes invisibles, loupe sur « on regarde de plus près », choc sur « les
// voilà », attention quand ils passent au patient ; pour chaque indication un geste au mot près (elle marche sur
// « couloir », téléphone sur « téléphone », seringue sur « injection », erreur sur « aucun microbe », gênée devant le
// sang, cœur sur « te protéger », youpi quand les mains sont sèches…) ; elle reste en bas (le suivi des 5 indications
// occupe y 1140 – 1290) et porte les transitions (plongées, panoramiques, vague, rideau).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'microbes'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'rien'), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'regarde'), key: 'expressions/loupe', ...R},
	{at: abs('intro', 'voilà'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'passer'), key: 'gestes/attention', ...R},
	{at: abs('intro', 'arrêter'), key: 'gestes/important', ...R},
	{at: abs('intro', 'indications'), key: 'situations/a-retenir', ...R},
	// elle plonge vers la règle (zoomInto)
	{at: start('regle') - 4, dur: 16, key: 'situations/a-retenir', x: 540, y: 700, size: 0},

	/* ── 2 avant · 3 après ── */
	{at: abs('regle', 'deux'), via: 'pop', key: 'gestes/presente', ...L},
	{at: abs('regle', 'patient'), key: 'expressions/coeur-mains', ...L},
	{at: abs('regle', 'trois'), key: 'gestes/presente', ...R},
	{at: abs('regle', 'toi'), key: 'situations/pouce', ...R},
	{at: abs('regle', "l'environnement"), key: 'expressions/ok', ...R},
	// sortie à gauche avec le panoramique
	{at: start('un') - 1, dur: 12, key: 'expressions/ok', x: -420, y: 1500, size: 230},

	/* ── 1 · avant le patient ── */
	{at: abs('un', 'avant'), via: 'pop', key: 'gestes/attention', ...R},
	{at: abs('un', 'couloir'), key: 'poses/marche', x: 850, y: 1900, size: 360},
	{at: abs('un', 'téléphone'), key: 'accessoires/telephone', ...R},
	{at: abs('un', 'rien'), key: 'situations/valide', ...R},
	// saut par-dessus la vague
	{at: start('deux') + 8, dur: 18, key: 'situations/valide', ...L},

	/* ── 2 · avant un geste aseptique ── */
	{at: abs('deux', 'aseptique'), key: 'gestes/important', ...L},
	{at: abs('deux', 'injection'), key: 'accessoires/seringue', ...L},
	{at: abs('deux', 'aucun'), key: 'gestes/erreur', fx: 'shake', ...L},
	{at: abs('deux', 'siens'), key: 'expressions/surprise', ...L},
	...runAcross('trois'),

	/* ── 3 · après un liquide biologique ── */
	{at: abs('trois', 'sang'), via: 'pop', key: 'expressions/genee', ...R},
	{at: abs('trois', 'gants'), key: 'gestes/regardez', ...R},
	{at: abs('trois', 'retires'), key: 'gestes/presente', ...R},
	{at: abs('trois', 'désinfectes'), key: 'situations/valide', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('quatre') + 2, dur: 14, key: 'situations/valide', x: 540, y: -520, size: 230},

	/* ── 4 · après le patient ── */
	{at: abs('quatre', 'touché'), via: 'pop', key: 'gestes/regardez', ...L},
	{at: abs('quatre', 'toi'), key: 'expressions/coeur-mains', ...L},
	{at: abs('quatre', 'suivants'), key: 'gestes/bravo', ...L},
	// elle plonge (zoomInto)
	{at: start('cinq') - 4, dur: 16, key: 'gestes/bravo', x: 540, y: 700, size: 0},

	/* ── 5 · après son environnement ── */
	{at: abs('cinq', 'lit'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('cinq', 'pompe'), key: 'gestes/regardez', ...R},
	{at: abs('cinq', 'lui'), key: 'gestes/attention', ...R},
	// sortie à gauche avec le panoramique
	{at: start('geste') - 1, dur: 12, key: 'gestes/attention', x: -420, y: 1500, size: 230},

	/* ── le bon geste ── */
	{at: abs('geste', 'friction'), via: 'pop', key: 'expressions/joyeuse', fx: 'bounce', ...R},
	{at: abs('geste', 'trente'), key: 'expressions/surprise', ...R},
	{at: abs('geste', 'sèches'), key: 'expressions/youpi', ...R},
	{at: abs('geste', 'sales'), key: 'gestes/probleme', ...R},
	{at: abs('geste', 'savon'), key: 'expressions/ok', ...R},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'expressions/ok', ...L},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, key: 'situations/recapitule', ...L},
	{at: abs('outro', 'trois'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'environnement'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'moments') + 10, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
