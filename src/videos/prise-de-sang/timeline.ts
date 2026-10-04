// Découpage de la vidéo « Tips prises de sang ».
// Quand la voix off arrivera, il suffira d'ajuster `dur` de chaque scène
// sur la durée réelle de la phrase correspondante.

export const FPS = 30;
export const TRANSITION = 12;

export const SCENES = [
	{id: 'hook', dur: 150},
	{id: 'tip1', dur: 180},
	{id: 'tip2', dur: 240},
	{id: 'tip3', dur: 210},
	{id: 'tip4', dur: 250},
	{id: 'tip5', dur: 370},
	{id: 'tip6', dur: 190},
	{id: 'tip7', dur: 210},
	{id: 'tip8', dur: 200},
	{id: 'outro', dur: 200},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

/** Frame de départ (globale) de chaque scène, en tenant compte du chevauchement des transitions. */
export const STARTS: number[] = SCENES.reduce<number[]>((acc, s, i) => {
	acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - TRANSITION);
	return acc;
}, []);

export const TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

export const TIP_COUNT = 8;
