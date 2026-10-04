import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, usePop, Words} from '../../components/motion';
import {GaugeIcon, HeartIcon, LungsIcon, O2Icon, SpO2, ThermoIcon} from '../../components/med/MedIcons';
import {BODY, C, TITLE} from '../../theme';

/** Une couleur par constante — identique dans toutes les vidéos de la série. */
export const CONST = [
	{abbr: 'T°', name: 'Température', color: C.orange, Icon: ThermoIcon},
	{abbr: 'FC', name: 'Fréquence cardiaque', color: C.red, Icon: HeartIcon},
	{abbr: 'FR', name: 'Fréquence respiratoire', color: C.cyan, Icon: LungsIcon},
	{abbr: 'PA', name: 'Pression artérielle', color: C.violet, Icon: GaugeIcon},
	{abbr: 'SpO₂', name: 'Saturation en oxygène', color: C.blue, Icon: O2Icon},
] as const;

export const Abbr: React.FC<{i: number}> = ({i}) => (i === 4 ? <SpO2 /> : <>{CONST[i].abbr}</>);

/** « CONSTANTE 2/5 » puis le grand titre, chacun calé sur son mot. */
export const ConstantTitle: React.FC<{
	n: number;
	title: string;
	color: string;
	labelAt: number;
	titleAt: number;
	size?: number;
	out?: number;
}> = ({n, title, color, labelAt, titleAt, size = 92, out}) => {
	const frame = useCurrentFrame();
	const l = usePop(labelAt, 16, 160);
	const o = out === undefined ? 0 : interpolate(frame, [out, out + 8], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				top: 236,
				left: 0,
				right: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				opacity: 1 - o,
			}}
		>
			<div
				style={{
					opacity: l,
					transform: `translateY(${(1 - l) * 20}px)`,
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					fontFamily: BODY,
					fontWeight: 800,
					fontSize: 30,
					letterSpacing: '0.3em',
					color,
				}}
			>
				<div style={{width: 40, height: 4, borderRadius: 2, background: color}} />
				CONSTANTE {n}/5
				<div style={{width: 40, height: 4, borderRadius: 2, background: color}} />
			</div>
			<div style={{marginTop: 18}}>
				<Words text={title} delay={titleAt} stagger={4} size={size} accent={color} lineHeight={1.02} />
			</div>
		</div>
	);
};

/** Valeur chiffrée géante avec unité. */
export const Readout: React.FC<{value: React.ReactNode; unit?: React.ReactNode; color: string; size?: number}> = ({
	value,
	unit,
	color,
	size = 150,
}) => (
	<div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
		<div
			style={{
				fontFamily: TITLE,
				fontWeight: 900,
				fontSize: size,
				lineHeight: 1,
				color: C.white,
				letterSpacing: '-0.03em',
				textShadow: `0 0 40px ${color}66`,
			}}
		>
			{value}
		</div>
		{unit ? <div style={{fontFamily: BODY, fontWeight: 800, fontSize: size * 0.32, color}}>{unit}</div> : null}
	</div>
);

/** Petite étiquette (pilule) qui s'allume. */
export const Tag: React.FC<{children: React.ReactNode; color: string; on?: number; size?: number}> = ({
	children,
	color,
	on = 1,
	size = 38,
}) => (
	<div
		style={{
			padding: `${size * 0.36}px ${size * 0.7}px`,
			borderRadius: 999,
			fontFamily: BODY,
			fontWeight: 800,
			fontSize: size,
			color: on > 0.5 ? C.dark : C.white,
			background: on > 0.5 ? color : 'rgba(255,255,255,0.07)',
			border: `3px solid ${color}${on > 0.5 ? 'FF' : '66'}`,
			boxShadow: on > 0.5 ? `0 0 40px ${color}66` : 'none',
			transform: `scale(${1 + 0.06 * on})`,
			whiteSpace: 'nowrap',
		}}
	>
		{children}
	</div>
);

/** Interrupteur 0→1 au moment `at` (spring doux). */
export const useOn = (at: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - at, fps, config: {damping: 16, stiffness: 140}});
};
