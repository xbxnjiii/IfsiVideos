// Jeu de la mascotte : surprise quand le couteau glisse, alerte sur « saigne », triste devant la trousse vide, question
// sur « qu'est-ce qu'il faut mettre dedans ? » ; elle présente, coche, OK au fil des objets ; les bons réflexes :
// attention, téléphone sur les numéros ; chute : clin d'œil sur « tout est là ». En bas à droite (la trousse s'arrête
// vers y 1490 : la mascotte reste plus petite).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const R = {x: 900, y: 1760, size: 320};
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'doigt'), via: 'pop', key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'saigne'), key: 'expressions/alerte', ...R},
	{at: abs('intro', 'vide.'), key: 'expressions/triste', ...R},
	{at: abs('intro', 'alors,'), key: 'gestes/question', ...R},
	{at: start('soigner') - 4, dur: 16, key: 'gestes/question', x: 540, y: 1050, size: 0},

	/* ── soigner ── */
	{at: abs('soigner', 'sérum'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('soigner', 'pansements'), key: 'situations/valide', ...R},
	{at: start('tenir') - 1, dur: 12, key: 'situations/valide', x: -420, y: 1500, size: 230},

	/* ── tenir ── */
	{at: abs('tenir', 'gants'), via: 'pop', key: 'gestes/ok', ...R},
	{at: abs('tenir', 'pince'), key: 'gestes/astuce', fx: 'bounce', ...R},

	/* ── et aussi ── */
	{at: abs('plus', 'thermomètre,'), key: 'situations/checklist', ...R},
	{at: abs('plus', 'couverture'), key: 'gestes/bravo', fx: 'bounce', ...R},
	...runAcross('regles'),

	/* ── les bons réflexes ── */
	{at: abs('regles', 'portée'), via: 'pop', key: 'gestes/attention', ...R},
	{at: abs('regles', 'numéros'), key: 'accessoires/telephone', ...R},
	{at: start('fin') + 6, via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('fin', 'tout'), key: 'expressions/clin-doeil', fx: 'bounce', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
