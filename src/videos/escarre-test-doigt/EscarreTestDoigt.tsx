// « Le test du doigt » (n° 106, série « Les plaies » en pixel 8-bit, 2/10) : même format que la n° 105 (dehors clair,
// dedans sombre, scanner, jauges et étiquettes au mot, boucle). Storyboard : docs/lpi/storyboard-escarre-test-doigt.md.
import {fade} from '@remotion/transitions/fade';
import React from 'react';
import {Episode, EpisodeTransition} from '../../brand/episode';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Blanchit, Fin, Foncee, Geste, Hook, Loop, Rouge} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EscarreTestDoigtProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, geste: Geste, blanchit: Blanchit, rouge: Rouge, foncee: Foncee, fin: Fin, end: Loop};

/** Transitions : un simple fondu (on reste dans le même monde pixel). */
const T: EpisodeTransition = {p: fade()}; // fondu silencieux (pas de bips d'arcade : refusés par le propriétaire)
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {geste: T, blanchit: T, rouge: T, foncee: T, fin: T, end: T};

export const EscarreTestDoigt: React.FC<EscarreTestDoigtProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} bg={LPI.paper} voice={voice ? 'voix/escarre-test-doigt/voix.wav' : null} sfx={sfx} />
);
