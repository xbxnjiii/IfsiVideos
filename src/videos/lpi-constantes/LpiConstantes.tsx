import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {EndCard} from '../../brand/EndCard';
import {circleReveal} from '../../brand/motion';
import {GRID, LPI} from '../../brand/theme';
import {clamp, Decor, DecorContext} from '../../brand/ui';
import {Sfx, SfxEnabled} from '../../components/Sfx';
import {HOOK_BADGES, Hook, Recap} from './Bookends';
import {Cardiaque, Pression, Respiratoire, Saturation, Temperature} from './Lessons';
import {SCENE_IDS, SceneId, TL} from './timeline';
import '../../brand/theme';

// Version de test : pas de musique (ajoutée sur TikTok / Instagram), pas de sous-titres, pas de filigrane.
export type LpiConstantesProps = {voice: boolean; sfx: boolean; decor?: Decor};

const SCENES: Record<SceneId, React.FC> = {
	intro: Hook,
	temp: Temperature,
	fc: Cardiaque,
	fr: Respiratoire,
	pa: Pression,
	spo2: Saturation,
	outro: Recap,
	end: EndCard,
};

/** Départ du cercle de transition vers chaque scène. */
const ORIGINS: Record<SceneId, {x: number; y: number}> = {
	intro: {x: 540, y: 960},
	temp: {x: HOOK_BADGES.xs[0], y: HOOK_BADGES.y},
	fc: {x: 120, y: 280},
	fr: {x: 120, y: 280},
	pa: {x: 120, y: 280},
	spo2: {x: 120, y: 280},
	outro: {x: 540, y: 330},
	end: {x: 540, y: 900},
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
		<div
			style={{
				position: 'absolute',
				top: GRID.header + 20,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				gap: 10,
				opacity,
			}}
		>
			{Array.from({length: 5}, (_, i) => (
				<div
					key={i}
					style={{
						width: i === current ? 96 : 40,
						height: 12,
						borderRadius: 6,
						background: i < current ? LPI.blue : LPI.sky,
						overflow: 'hidden',
					}}
				>
					{i === current ? (
						<div style={{width: `${p * 100}%`, height: '100%', background: LPI.blue, borderRadius: 6}} />
					) : null}
				</div>
			))}
		</div>
	);
};

export const LpiConstantes: React.FC<LpiConstantesProps> = ({voice, sfx, decor = 'none'}) => (
	<DecorContext.Provider value={decor}>
		<SfxEnabled.Provider value={sfx}>
			<AbsoluteFill style={{backgroundColor: LPI.paper}}>
				<TransitionSeries>
					{SCENE_IDS.map((id, i) => {
						const Scene = SCENES[id];
						return (
							<React.Fragment key={id}>
								{i > 0 ? (
									<TransitionSeries.Transition
										presentation={circleReveal(ORIGINS[id])}
										timing={linearTiming({durationInFrames: TL.transition})}
									/>
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
						<Html5Audio src={staticFile('voix/lpi-constantes/voix.wav')} />
					</Sequence>
				) : null}
				{TL.starts.slice(1).map((s) => (
					<Sfx key={s} name="whoosh" at={s} volume={0.1} />
				))}
			</AbsoluteFill>
		</SfxEnabled.Provider>
	</DecorContext.Provider>
);
