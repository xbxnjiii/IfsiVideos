import React, {createContext, useContext} from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';

export type SfxName = 'whoosh' | 'pop' | 'tick' | 'impact' | 'ding' | 'buzz' | 'heartbeat' | 'stamp' | 'hop' | 'run' | 'drumroll'
	// vrais enregistrements (La Sonothèque, scripts/import-sfx.py, public/sfx/SOURCES.md)
	| 'cough' | 'cough-1' | 'cough-2' | 'gasp' | 'puff' | 'lighter' | 'smoke' | 'blow' | 'sigh' | 'stairs'
	| 'dishes' | 'tap' | 'glass' | 'heart' | 'dtmf-1' | 'dtmf-5' | 'ring'
	| 'bike' | 'skid' | 'fall' | 'car-door' | 'chop' | 'meow' | 'hiss';

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
	cough: 0.45,
	'cough-1': 0.45,
	'cough-2': 0.45,
	gasp: 0.35,
	puff: 0.4,
	lighter: 0.4,
	smoke: 0.35,
	blow: 0.35,
	sigh: 0.3,
	stairs: 0.3,
	dishes: 0.3,
	tap: 0.25,
	glass: 0.55,
	heart: 0.5,
	'dtmf-1': 0.25,
	'dtmf-5': 0.25,
	ring: 0.3,
	bike: 0.25,
	skid: 0.3,
	fall: 0.45,
	'car-door': 0.5,
	chop: 0.4,
	meow: 0.4,
	hiss: 0.4,
};

/** Durée (frames à 30 i/s) des bruitages plus longs qu'une seconde : ils ne sont pas coupés par défaut. */
const LENGTH: Partial<Record<SfxName, number>> = {cough: 47, gasp: 83, lighter: 44, smoke: 54, blow: 35, sigh: 119, stairs: 120, dishes: 120, tap: 90, glass: 57, heart: 120, ring: 42, bike: 48, skid: 42, fall: 39, meow: 58};

/** Permet de couper tous les bruitages d'une vidéo (ex. version « voix seule »). */
export const SfxEnabled = createContext(true);

/** Joue un bruitage à une frame donnée (relative à la scène). */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number; dur?: number}> = ({name, at, volume, dur = LENGTH[name] ?? 30}) => {
	const enabled = useContext(SfxEnabled);
	if (!enabled) return null;
	return (
		<Sequence from={at} durationInFrames={name === 'drumroll' ? Math.max(dur, 60) : dur} layout="none">
			<Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? VOLUME[name]} />
		</Sequence>
	);
};
