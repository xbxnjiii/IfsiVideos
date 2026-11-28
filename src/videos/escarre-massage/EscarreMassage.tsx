// « Escarre : tu masses ? » (n° 105, série « Les plaies » en fenêtre pixel 8-bit, pilote). v2 plein cadre (retour du
// propriétaire) : plan large puis très gros plan sur la coupe au sacrum, la lésion qui commence près de l'os ; règle avant 10 s ; 3 notions ; fin = test du doigt,
// puis la dernière image rejoint la première (boucle). Storyboard : docs/lpi/storyboard-escarre-massage.md.
import React from 'react';
import {Episode, EpisodeTransition} from '../../brand/episode';
import {LPI} from '../../brand/theme';
import {fade} from '@remotion/transitions/fade';
import {MASCOT} from './mascot';
import {Fin, Hook, Loop, Massage, Pression, Regle, Soulager} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EscarreMassageProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, regle: Regle, pression: Pression, massage: Massage, soulager: Soulager, fin: Fin, end: Loop};

/** Transitions : un simple fondu (on reste dans le même monde pixel, le plan continue d'une scène à l'autre). */
const T: EpisodeTransition = {p: fade(), sfx: 'blip'};
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {regle: T, pression: T, massage: T, soulager: T, fin: T, end: T};

export const EscarreMassage: React.FC<EscarreMassageProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} bg={LPI.paper} voice={voice ? 'voix/escarre-massage/voix.wav' : null} sfx={sfx} />
);
