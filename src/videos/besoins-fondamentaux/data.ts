import {alpha, LPI} from '../../brand/theme';

/** Les 3 étapes du script (regroupement pédagogique des 14 besoins de Virginia Henderson). */
export const STAGES = [
	{n: 1, name: 'Survie', title: 'Le mode *survie*', color: LPI.pink, ink: LPI.navy, needs: [1, 2, 3, 4, 5]},
	{n: 2, name: 'Protection', title: 'On se *protège*', color: alpha(LPI.blue, 0.55), ink: LPI.navy, needs: [6, 7, 8, 9]},
	{n: 3, name: 'Psycho & social', title: 'Psycho & *social*', color: LPI.blue, ink: LPI.paper, needs: [10, 11, 12, 13, 14]},
] as const;

export const stageOf = (n: number) => STAGES.find((s) => (s.needs as readonly number[]).includes(n))!;

export type NeedTitle = {pre?: string; key: string; sub?: string};

/** Titre affiché (grand) et libellé court (grilles, récap). */
export const NEEDS: {n: number; title: NeedTitle; short: string}[] = [
	{n: 1, title: {key: 'Respirer'}, short: 'Respirer'},
	{n: 2, title: {pre: 'Boire et', key: 'manger'}, short: 'Boire et manger'},
	{n: 3, title: {key: 'Éliminer'}, short: 'Éliminer'},
	{n: 4, title: {pre: 'Se mouvoir et maintenir', key: 'bonne posture'}, short: 'Se mouvoir, posture'},
	{n: 5, title: {pre: 'Dormir et', key: 'se reposer'}, short: 'Dormir, se reposer'},
	{n: 6, title: {pre: 'Se vêtir et', key: 'se dévêtir'}, short: 'Se vêtir, se dévêtir'},
	{n: 7, title: {pre: 'Maintenir sa', key: 'température', sub: 'corporelle'}, short: 'Température'},
	{n: 8, title: {pre: 'Être propre,', key: 'soigné', sub: 'et protéger sa peau'}, short: 'Être propre, la peau'},
	{n: 9, title: {pre: 'Éviter les', key: 'dangers'}, short: 'Éviter les dangers'},
	{n: 10, title: {key: 'Communiquer'}, short: 'Communiquer'},
	{n: 11, title: {pre: 'Agir selon ses', key: 'croyances', sub: 'et ses valeurs'}, short: 'Croyances, valeurs'},
	{n: 12, title: {pre: "S'occuper en vue de", key: 'se réaliser'}, short: "S'occuper, se réaliser"},
	{n: 13, title: {key: 'Se récréer', sub: 'autrement dit, avoir des loisirs'}, short: 'Se récréer'},
	{n: 14, title: {key: 'Apprendre'}, short: 'Apprendre'},
];
