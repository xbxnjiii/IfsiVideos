import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TransitionPresentation, TransitionSeries, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {Grain} from '../../components/Background';
import {clamp} from '../../components/motion';
import {Sfx, SfxEnabled} from '../../components/Sfx';
import {C} from '../../theme';
import {Hook} from './Hook';
import {Outro} from './Outro';
import {Tip1, Tip2, Tip3, Tip4} from './Tips1to4';
import {Tip5, Tip6, Tip7, Tip8} from './Tips5to8';
import {SCENES, STARTS, TIP_COUNT, TRANSITION, SceneId} from './timeline';

export type PriseDeSangProps = {
	sfx: boolean;
	handle?: string;
};

const COMPONENTS: Record<SceneId, React.FC<{duration: number; handle?: string}>> = {
	hook: Hook,
	tip1: Tip1,
	tip2: Tip2,
	tip3: Tip3,
	tip4: Tip4,
	tip5: Tip5,
	tip6: Tip6,
	tip7: Tip7,
	tip8: Tip8,
	outro: Outro,
};

const PRESENTATIONS: TransitionPresentation<Record<string, unknown>>[] = [
	slide({direction: 'from-right'}),
	slide({direction: 'from-bottom'}),
	wipe({direction: 'from-left'}),
	slide({direction: 'from-left'}),
	slide({direction: 'from-bottom'}),
	wipe({direction: 'from-right'}),
	slide({direction: 'from-right'}),
	slide({direction: 'from-bottom'}),
	fade(),
] as TransitionPresentation<Record<string, unknown>>[];

const ACCENTS = [C.cyan, C.orange, C.blue, C.coral, C.red, C.violet, C.green, C.yellow];

/** Barre de progression segmentée (1 segment par tip) : donne envie d'aller au bout. */
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const firstTip = STARTS[1];
	const outro = STARTS[SCENES.length - 1];
	const opacity =
		interpolate(frame, [firstTip, firstTip + 10], [0, 1], clamp) *
		interpolate(frame, [outro, outro + 10], [1, 0], clamp);
	if (opacity <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top: 205,
				left: 110,
				right: 110,
				display: 'flex',
				gap: 10,
				opacity,
			}}
		>
			{Array.from({length: TIP_COUNT}, (_, i) => {
				const scene = i + 1;
				const p = interpolate(frame, [STARTS[scene], STARTS[scene] + SCENES[scene].dur - TRANSITION], [0, 1], clamp);
				const current = p > 0 && p < 1;
				return (
					<div
						key={i}
						style={{flex: 1, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.18)', overflow: 'hidden'}}
					>
						<div
							style={{
								width: `${p * 100}%`,
								height: '100%',
								background: current ? ACCENTS[i] : C.white,
								boxShadow: current ? `0 0 16px ${ACCENTS[i]}` : 'none',
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export const PriseDeSang: React.FC<PriseDeSangProps> = ({sfx, handle}) => (
	<SfxEnabled.Provider value={sfx}>
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			<TransitionSeries>
				{SCENES.map((scene, i) => {
					const Scene = COMPONENTS[scene.id];
					return (
						<React.Fragment key={scene.id}>
							{i > 0 ? (
								<TransitionSeries.Transition
									presentation={PRESENTATIONS[i - 1]}
									timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION})}
								/>
							) : null}
							<TransitionSeries.Sequence durationInFrames={scene.dur}>
								<Scene duration={scene.dur} handle={handle} />
							</TransitionSeries.Sequence>
						</React.Fragment>
					);
				})}
			</TransitionSeries>
			<Progress />
			<Grain />
			{STARTS.slice(1).map((s) => (
				<Sfx key={s} name="whoosh" at={s} volume={0.22} />
			))}
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
