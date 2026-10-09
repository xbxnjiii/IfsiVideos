// Gabarit « fiche » v3 : numéro qui s'écrase puis file dans le coin, titre en 2 lignes,
// illustration vivante sur un socle, termes techniques qui « claquent » au centre puis
// se rangent dans la fiche, mascotte qui surgit de sa pastille. Caméra qui accuse chaque terme.
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sign, SignKind} from './learn';
import {Mascot2, Mascot2Key} from './Mascot2';
import {Camera, ChapterSlam, LiveBackground, SLOT, Stage, TermSlam} from './motion3';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {Enter, Title} from './ui';
import {Sfx} from '../components/Sfx';

export const L3 = {
	badge: {x: 136, y: 313, d: 128},
	titleX: 240,
	titleY: 230,
	defY: 414,
	stageY: 478,
	stageH: 540,
	mascot: {x: 862, y: 1340, r: 150, h: 420},
};

export type Term3 = {at: number; term: string; meaning: React.ReactNode; sign: SignKind};

export const Lesson3: React.FC<{
	n: number;
	nAt: number;
	/** [ligne d'appel, mot clé] ex. ['Fréquence', 'cardiaque'] */
	title: [string, string];
	titleAt: number;
	definition: React.ReactNode;
	defAt: number;
	stage: React.ReactNode;
	/** remplissages du socle (voir Stage) */
	layers?: {color: string; level: number}[];
	stageH?: number;
	slotTop?: number;
	terms: Term3[];
	/** mascotte intégrée (v3) ; en v4 la mascotte est globale et ce champ reste vide */
	mascot?: [number, Mascot2Key][];
	punches?: number[];
	/** côté de la fiche des termes (la mascotte prend l'autre côté) */
	slotSide?: 'left' | 'right';
	/** secousses d'impact (numéro, termes) */
	shake?: boolean;
	/** repère adulte discret sous l'illustration (ex. « normale 36,5 – 37,5 °C ») */
	norm?: React.ReactNode;
	normAt?: number;
}> = ({n, nAt, title, titleAt, definition, defAt, stage, layers, stageH = L3.stageH, slotTop = SLOT.y, terms, mascot, punches = [], slotSide = 'left', shake = false, norm, normAt}) => {
	const frame = useCurrentFrame();
	const tA = Math.max(titleAt, nAt + 22);
	const slamY = L3.stageY + stageH / 2;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[nAt + 2, ...terms.map((t) => t.at + 1), ...punches]} shakes={shake ? [nAt + 3, ...terms.map((t) => t.at + 4)] : []}>
				<Stage y={L3.stageY} h={stageH} at={nAt + 18} layers={layers} bumps={terms.map((t) => t.at + 26)}>
					{stage}
				</Stage>
				{norm ? <NormRibbon at={normAt ?? defAt + 12} y={L3.stageY + stageH - 6}>{norm}</NormRibbon> : null}
				<div style={{position: 'absolute', left: L3.titleX, top: L3.titleY, width: 1008 - L3.titleX}}>
					<Title at={tA} text={title[0]} size={60} stagger={2} brush={false} />
					<Title at={tA + 4} text={`*${title[1]}*`} size={96} stagger={2} />
				</div>
				<div style={{position: 'absolute', left: 72, top: L3.defY, width: 936}}>
					<Enter at={defAt} distance={18}>
						<div
							style={{
								fontFamily: FONT.body,
								fontWeight: 600,
								fontSize: 36,
								color: alpha(LPI.navy, 0.72),
								whiteSpace: 'nowrap',
							}}
						>
							{definition}
						</div>
					</Enter>
				</div>
				{mascot && mascot.length ? <Mascot2 poses={mascot} x={L3.mascot.x} y={L3.mascot.y} height={L3.mascot.h} bubble={L3.mascot.r} /> : null}
				{terms.map((t, i) => (
					<TermSlam
						key={t.term}
						index={i}
						at={t.at}
						term={t.term}
						meaning={t.meaning}
						sign={t.sign}
						slamY={slamY}
						top={slotTop}
						slot={slotSide === 'right' ? {x: 1008 - SLOT.w, y: slotTop + i * (SLOT.h + SLOT.gap), w: SLOT.w} : undefined}
						active={frame >= t.at && (i === terms.length - 1 || frame < terms[i + 1].at)}
					/>
				))}
				<ChapterSlam
					n={n}
					at={nAt}
					from={{x: 540, y: slamY}}
					to={{x: L3.badge.x, y: L3.badge.y}}
					size={L3.badge.d}
				/>
			</Camera>
			<Sfx name="impact" at={nAt} volume={0.09} />
			<Sfx name="whoosh" at={nAt + 15} volume={0.05} />
			{terms.map((t) => (
				<React.Fragment key={t.term}>
					<Sfx name="pop" at={t.at} volume={0.14} />
					<Sfx name="whoosh" at={t.at + 23} volume={0.045} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

/** Pastille d'état (icône + quelques mots du script) qui change avec un petit « pop ». */
export const StatePill: React.FC<{
	states: {at: number; kind: SignKind; label: React.ReactNode}[];
	x: number;
	y: number;
	size?: number;
}> = ({states, x, y, size = 40}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	let cur = -1;
	states.forEach((s, i) => {
		if (frame >= s.at) cur = i;
	});
	if (cur < 0) return null;
	const s = states[cur];
	const p = spring({frame: frame - s.at, fps, config: {damping: 10, stiffness: 240, mass: 0.6}});
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				padding: '12px 28px 12px 12px',
				borderRadius: 999,
				background: LPI.paper,
				boxShadow: SHADOW,
				whiteSpace: 'nowrap',
				opacity: Math.min(1, p * 2),
				transform: `scale(${0.5 + 0.5 * p}) rotate(${(1 - p) * -8}deg)`,
				transformOrigin: 'left center',
			}}
		>
			<Sign kind={s.kind} size={size * 1.7} />
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: LPI.navy}}>{s.label}</span>
		</div>
	);
};

/** Repère « adulte » : petit bandeau centré à cheval sur le bas du socle, discret mais lisible. */
export const NormRibbon: React.FC<{at: number; y: number; children: React.ReactNode}> = ({at, y, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
	if (frame < at) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y - 27, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					padding: '9px 24px 9px 10px',
					borderRadius: 999,
					background: LPI.paper,
					border: `3px solid ${LPI.sky}`,
					boxShadow: `0 10px 24px ${alpha(LPI.navy, 0.1)}`,
					whiteSpace: 'nowrap',
					opacity: Math.min(1, p * 1.6),
					transform: `translateY(${(1 - p) * 16}px) scale(${0.85 + 0.15 * p})`,
				}}
			>
				<span
					style={{
						fontFamily: FONT.body,
						fontWeight: 800,
						fontSize: 19,
						letterSpacing: 2,
						color: LPI.paper,
						background: LPI.blue,
						borderRadius: 999,
						padding: '5px 12px',
					}}
				>
					ADULTE
				</span>
				<span style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 27, color: alpha(LPI.navy, 0.8)}}>{children}</span>
			</div>
		</div>
	);
};

/** Seuil chiffré dans la définition d'un terme (ex. « > 38 °C »). */
export const Seuil: React.FC<{children: React.ReactNode}> = ({children}) => (
	<span style={{fontWeight: 800, color: LPI.blue, whiteSpace: 'nowrap'}}>{children}</span>
);
