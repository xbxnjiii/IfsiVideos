// « Comment retirer une écharde ? » — format court (≈ 46 s, voix gratuite d'abord, Laura une fois validée, sans barre de
// progression). Accroche sans texte au début : la main glisse sur une vieille planche… aïe, une écharde. Puis l'idée
// reçue (presser avec les ongles : elle s'enfonce, se casse), la bonne méthode (laver, désinfecter la pince, au ras de la
// peau, tirer dans le sens où elle est entrée), après (laver, désinfecter, pansement), quand consulter (+ tétanos), chute.
// Storyboard : docs/lpi/storyboard-echarde.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Apres, Consulter, Fin, Hook, Methode, Ongles} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EchardeProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, ongles: Ongles, methode: Methode, apres: Apres, consulter: Consulter, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	ongles: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	methode: {p: whip('left'), sfx: 'whoosh'},
	apres: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	consulter: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Echarde: React.FC<EchardeProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/echarde/voix.wav' : null} sfx={sfx} />
);
