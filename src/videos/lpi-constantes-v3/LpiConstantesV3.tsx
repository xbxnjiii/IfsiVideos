import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {L3} from '../../brand/Lesson3';
import {Burst, LiveBackground, wave} from '../../brand/motion3';
import {GRID, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Sfx, SfxEnabled} from '../../components/Sfx';
import {HOOK_ROW, Hook3, Recap3} from './Bookends3';
import {Cardiaque, Pression, Respiratoire, Saturation, Temperature} from './Lessons3';
import {SCENE_IDS, SceneId, TL} from './timeline';
import '../../brand/theme';

// Version de test v3 : voix IA (ElevenLabs), pas de musique, pas de sous-titres, pas de filigrane.
export type LpiConstantesV3Props = {voice: boolean; sfx: boolean};

/** Carte de fin : logo principal qui rebondit + éclats. */
const EndCard3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 6, fps, config: {damping: 11, stiffness: 160, mass: 0.8}});
	return (
		<AbsoluteFill>
			<LiveBackground deco={false} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
				<Img
					src={staticFile('brand/logo/logo-principal.webp')}
					style={{width: 800, height: 'auto', opacity: Math.min(1, s * 1.5), transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`}}
				/>
			</AbsoluteFill>
			<Burst at={8} x={540} y={840} r={360} n={14} />
		</AbsoluteFill>
	);
};

const SCENES: Record<SceneId, React.FC> = {
	intro: Hook3,
	temp: Temperature,
	fc: Cardiaque,
	fr: Respiratoire,
	pa: Pression,
	spo2: Saturation,
	outro: Recap3,
	end: EndCard3,
};

const lessonCenter = (h = L3.stageH) => ({x: 540, y: L3.stageY + h / 2});

/** Départ de la vague de transition vers chaque scène (là où l'action va commencer). */
const ORIGINS: Record<SceneId, {x: number; y: number}> = {
	intro: {x: 540, y: 960},
	temp: {x: HOOK_ROW.xs[0], y: HOOK_ROW.y + HOOK_ROW.size / 2},
	fc: lessonCenter(),
	fr: lessonCenter(),
	pa: lessonCenter(520),
	spo2: lessonCenter(),
	outro: {x: 540, y: 330},
	end: {x: 540, y: 840},
};

/** Progression 1 → 5, centrée en haut, visible pendant les 5 constantes. */
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const {starts, durations, transition} = TL;
	let s = 0;
	while (s < starts.length - 1 && frame >= starts[s + 1] + transition / 2) s++;
	const opacity =
		interpolate(frame, [starts[1], starts[1] + transition], [0, 1], clamp) *
		interpolate(frame, [starts[6], starts[6] + transition], [1, 0], clamp);
	if (opacity <= 0) return null;
	const current = Math.min(4, Math.max(0, s - 1));
	const p = interpolate(frame, [starts[s], starts[s] + durations[s] - transition], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', top: GRID.header + 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, opacity}}>
			{Array.from({length: 5}, (_, i) => (
				<div
					key={i}
					style={{
						width: i === current ? 110 : 40,
						height: 12,
						borderRadius: 6,
						background: i < current ? LPI.blue : LPI.sky,
						overflow: 'hidden',
					}}
				>
					{i === current ? <div style={{width: `${p * 100}%`, height: '100%', background: LPI.blue, borderRadius: 6}} /> : null}
				</div>
			))}
		</div>
	);
};

export const LpiConstantesV3: React.FC<LpiConstantesV3Props> = ({voice, sfx}) => (
	<SfxEnabled.Provider value={sfx}>
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<TransitionSeries>
				{SCENE_IDS.map((id, i) => {
					const Scene = SCENES[id];
					return (
						<React.Fragment key={id}>
							{i > 0 ? (
								<TransitionSeries.Transition presentation={wave(ORIGINS[id])} timing={linearTiming({durationInFrames: TL.transition})} />
							) : null}
							<TransitionSeries.Sequence durationInFrames={TL.durations[i]}>
								<Scene />
							</TransitionSeries.Sequence>
						</React.Fragment>
					);
				})}
			</TransitionSeries>
			<Progress />
			{voice ? (
				<Sequence from={TL.offset} layout="none">
					<Html5Audio src={staticFile('voix/lpi-constantes-v3/voix.wav')} />
				</Sequence>
			) : null}
			{TL.starts.slice(1).map((s) => (
				<Sfx key={s} name="whoosh" at={s} volume={0.1} />
			))}
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
