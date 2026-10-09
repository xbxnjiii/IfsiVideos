import React, {createContext, useContext} from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';

export type SfxName = 'whoosh' | 'pop' | 'tick' | 'impact' | 'ding' | 'buzz' | 'heartbeat' | 'stamp' | 'hop' | 'run' | 'drumroll';

const VOLUME: Record<SfxName, number> = {
	whoosh: 0.35,
	pop: 0.4,
	tick: 0.35,
	impact: 0.7,
	ding: 0.35,
	buzz: 0.3,
	heartbeat: 0.55,
	stamp: 0.55,
	hop: 0.3,
	run: 0.35,
	drumroll: 0.4,
};

/** Permet de couper tous les bruitages d'une vidéo (ex. version « voix seule »). */
export const SfxEnabled = createContext(true);

/** Joue un bruitage à une frame donnée (relative à la scène). */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number; dur?: number}> = ({name, at, volume, dur = 30}) => {
	const enabled = useContext(SfxEnabled);
	if (!enabled) return null;
	return (
		<Sequence from={at} durationInFrames={name === 'drumroll' ? Math.max(dur, 60) : dur} layout="none">
			<Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? VOLUME[name]} />
		</Sequence>
	);
};
