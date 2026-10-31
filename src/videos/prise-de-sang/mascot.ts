// Jeu de la mascotte : surprise devant le plateau, « 13 objets ! » (stressée), clin d'œil sur « pas de panique »,
// seringue sur l'aiguille, loupe sur les tubes, elle se frotte les mains (SHA), stéthoscope sur le garrot, « aïe »
// quand on retire l'aiguille, attention sur « jamais recapuchonner », bravo sur « ton plateau est prêt » ; elle reste
// d'un côté quand la liste se coche et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));
/** sous le plateau de l'accroche (il descend jusqu'à y 1500) */
const LOW_R = {x: 880, y: 1780, size: 300};

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'matériel'), via: 'pop', key: 'expressions/surprise', ...LOW_R},
	{at: abs('intro', 'beaucoup'), key: 'expressions/stressee', fx: 'shake', ...LOW_R},
	{at: abs('intro', 'panique'), key: 'expressions/clin-doeil', ...LOW_R},
	{at: abs('intro', 'reprend'), key: 'situations/checklist', ...LOW_R},
	// elle plonge dans la famille 1 (zoomInto)
	{at: start('prelevement') - 4, dur: 16, key: 'situations/checklist', x: 540, y: 600, size: 0},

	/* ── prélèvement : la liste occupe toute la largeur jusqu'à y 1330 ── */
	{at: abs('prelevement', "l'aiguille"), via: 'pop', key: 'accessoires/seringue', ...R},
	{at: abs('prelevement', 'deux'), key: 'gestes/regardez', ...R},
	{at: abs('prelevement', 'visse'), key: 'gestes/presente', ...R},
	{at: abs('prelevement', 'fragile'), key: 'expressions/inquiete', ...R},
	{at: abs('prelevement', 'épicrânienne'), key: 'expressions/ok', ...R},
	// sortie à gauche avec le panoramique
	{at: start('tubes') - 1, dur: 12, key: 'expressions/ok', x: -420, y: 1600, size: 230},

	/* ── tubes ── */
	{at: abs('tubes', 'prescription'), via: 'pop', key: 'situations/montre-document', ...L},
	{at: abs('tubes', 'couleur'), key: 'expressions/loupe', ...L},
	{at: abs('tubes', 'vide'), key: 'expressions/surprise', ...L},
	{at: abs('tubes', 'quantité'), key: 'gestes/ok', ...L},
	// saut par-dessus la vague
	{at: start('mains') + 8, dur: 18, key: 'gestes/ok', ...R},

	/* ── SHA, gants ── */
	{at: abs('mains', 'solution'), key: 'gestes/presente', ...R},
	{at: abs('mains', 'mains'), key: 'expressions/joyeuse', fx: 'bounce', ...R},
	{at: abs('mains', 'gants'), key: 'gestes/important', ...R},
	{at: abs('mains', 'protègent'), key: 'expressions/ok', ...R},
	...runAcross('bras'),

	/* ── garrot, antiseptique ── */
	{at: abs('bras', 'serre'), via: 'pop', key: 'accessoires/stethoscope', ...L},
	{at: abs('bras', 'gonfle'), key: 'expressions/surprise', ...L},
	{at: abs('bras', "l'antiseptique"), key: 'gestes/presente', ...L},
	{at: abs('bras', 'désinfecte'), key: 'situations/valide', ...L},
	// elle s'envole avec le panoramique vers le haut
	{at: start('fin') + 2, dur: 14, key: 'situations/valide', x: 540, y: -520, size: 230},

	/* ── compresse, pansement ── */
	{at: abs('fin', 'compresse'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('fin', 'retire'), key: 'symptomes/douleur', ...R},
	{at: abs('fin', 'pansement'), key: 'expressions/coeur-mains', ...R},
	// elle plonge (zoomInto)
	{at: start('dechets') - 4, dur: 16, key: 'expressions/coeur-mains', x: 540, y: 700, size: 0},

	/* ── déchets ── */
	{at: abs('dechets', 'important'), via: 'pop', key: 'gestes/important', ...R},
	{at: abs('dechets', "l'aiguille"), key: 'gestes/regardez', ...R},
	{at: abs('dechets', 'jamais'), key: 'gestes/erreur', fx: 'shake', ...R},
	{at: abs('dechets', 'sac'), key: 'gestes/presente', ...R},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'gestes/presente', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'prélèvement'), via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'hygiène'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'familles'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'prêt') + 10, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
