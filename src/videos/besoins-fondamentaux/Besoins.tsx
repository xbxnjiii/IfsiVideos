// « Les 14 besoins fondamentaux » (Virginia Henderson) : accroche, 3 étapes en escalier, 14 besoins
// joués par la mascotte avec un gag par blague du script, récap en grille. Voix ElevenLabs fournie.
import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {linearTiming, TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {beatMoves, MascotActor} from '../../brand/MascotActor';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {Sfx, SfxEnabled, SfxName} from '../../brand/Sfx';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {B1, B10, B11, B12, B13, B14, B2, B3, B4, B5, B6, B7, B8, B9} from './Needs';
import {EndCard, gridSlot, Hook, NotJust, Outro, Progress14, stepTop, StepScene} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type BesoinsProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {
	intro: Hook,
	e1: () => <StepScene k={0} id="e1" numWord="un" titleWord="mode" />,
	b1: B1,
	b2: B2,
	b3: B3,
	b4: B4,
	b5: B5,
	e2: () => <StepScene k={1} id="e2" numWord="deux" titleWord="on" />,
	b6: B6,
	b7: B7,
	b8: B8,
	b9: B9,
	e3: () => <StepScene k={2} id="e3" numWord="trois" titleWord="dimension" extra={<NotJust />} />,
	b10: B10,
	b11: B11,
	b12: B12,
	b13: B13,
	b14: B14,
	outro: Outro,
	end: EndCard,
};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (voir mascot.ts). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, {p: TransitionPresentation<any>; sfx: SfxName}> = {
	e1: {p: zoomInto(gridSlot(0)), sfx: 'whoosh'},
	b1: {p: wave(stepTop(0)), sfx: 'whoosh'},
	b2: {p: whip('left'), sfx: 'whoosh'},
	b3: {p: runWipe(), sfx: 'run'},
	b4: {p: whip('up'), sfx: 'whoosh'},
	b5: {p: wave({x: 540, y: 750}), sfx: 'whoosh'},
	e2: {p: zoomInto({x: 322, y: 750}), sfx: 'whoosh'},
	b6: {p: wave(stepTop(1)), sfx: 'whoosh'},
	b7: {p: whip('left'), sfx: 'whoosh'},
	b8: {p: runWipe(), sfx: 'run'},
	b9: {p: whip('up'), sfx: 'whoosh'},
	e3: {p: zoomInto({x: 540, y: 750}), sfx: 'whoosh'},
	b10: {p: wave(stepTop(2)), sfx: 'whoosh'},
	b11: {p: whip('left'), sfx: 'whoosh'},
	b12: {p: runWipe(), sfx: 'run'},
	b13: {p: whip('up'), sfx: 'whoosh'},
	b14: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 330}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 840, color: LPI.sky}), sfx: 'whoosh'},
};

const MascotSfx: React.FC = () => (
	<>
		{beatMoves(MASCOT).map((m, i) =>
			m.x < -100 || m.x > 1180 ? null : m.via === 'hop' ? (
				<Sfx key={i} name="hop" at={m.at} volume={0.06} />
			) : m.via === 'pop' ? (
				<Sfx key={i} name="pop" at={m.at} volume={0.045} />
			) : null,
		)}
	</>
);

export const Besoins: React.FC<BesoinsProps> = ({voice, sfx}) => (
	<SfxEnabled.Provider value={sfx}>
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<TransitionSeries>
				{SCENE_IDS.map((id, i) => {
					const Scene = SCENES[id];
					return (
						<React.Fragment key={id}>
							{id !== 'intro' ? (
								<TransitionSeries.Transition presentation={TRANSITIONS[id].p} timing={linearTiming({durationInFrames: TL.transition})} />
							) : null}
							<TransitionSeries.Sequence durationInFrames={TL.durations[i]}>
								<Scene />
							</TransitionSeries.Sequence>
						</React.Fragment>
					);
				})}
			</TransitionSeries>
			<Progress14 />
			<MascotActor beats={MASCOT} busts="free" />
			{voice ? (
				<Sequence from={TL.offset} layout="none">
					<Html5Audio src={staticFile('voix/besoins-fondamentaux/voix.wav')} />
				</Sequence>
			) : null}
			{SCENE_IDS.slice(1).map((id, i) => (
				<Sfx key={id} name={TRANSITIONS[id as Exclude<SceneId, 'intro'>].sfx} at={TL.starts[i + 1]} volume={0.11} />
			))}
			<MascotSfx />
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
