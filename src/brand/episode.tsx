// Kit « une vidéo par constante » : mise en page, titres, pastilles, chronomètre, fiche récap,
// carte logo, progression, composition complète (transitions, voix, mascotte, bruitages)
// et places de la mascotte. Une nouvelle vidéo n'écrit que ses scènes + son jeu de mascotte.
import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {Stamp} from './kit';
import {Sign, SignKind} from './learn';
import {Beat, beatMoves, MascotActor} from './MascotActor';
import {Burst, Camera, Confetti, LiveBackground, Odometer} from './motion3';
import {RUN_WIPE} from './motion4';
import {Sfx, SfxEnabled, SfxName} from './Sfx';
import {alpha, FONT, GRID, LPI, SHADOW} from './theme';
import type {Timeline} from './timeline';
import {clamp, Kicker, Title} from './ui';

const N = LPI.navy;
const ease = {...clamp, easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)};

/* ───────────── mise en page (1080 × 1920, interface TikTok : rien d'important au-dessus de 150 ni sous 1480) ───────────── */

export const LAY = {kickerY: 236, titleY: 282, stageY: 440, stageH: 540, slotY: 1010};
/** centre vertical du socle : là où les termes « claquent » */
export const SLAM_Y = LAY.stageY + LAY.stageH / 2;
/** i-ème place (pleine largeur) d'un terme rangé sous le socle */
export const termSlot = (i = 0) => ({x: 72, y: LAY.slotY + i * 175, w: 936});

/** Sur-titre + titre (mot à mot, `*mot*` = mot clé). */
export const Head: React.FC<{kicker: string; kAt: number; title: string; tAt: number; size?: number}> = ({kicker, kAt, title, tAt, size = 92}) => (
	<>
		<div style={{position: 'absolute', left: 72, top: LAY.kickerY}}>
			<Kicker at={kAt}>{kicker}</Kicker>
		</div>
		<div style={{position: 'absolute', left: 72, top: LAY.titleY, width: 936}}>
			<Title at={tAt} text={title} size={size} stagger={3} />
		</div>
	</>
);

export const Unit: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 56, color = LPI.blue}) => (
	<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: size, color, marginLeft: 12}}>{children}</span>
);

/** Étiquette courte (« poignet », « index »…). */
export const Tag: React.FC<{label: string; tone?: string}> = ({label, tone = N}) => (
	<div
		style={{
			padding: '8px 20px',
			borderRadius: 999,
			background: LPI.paper,
			border: `4px solid ${tone}`,
			fontFamily: FONT.title,
			fontWeight: 900,
			fontSize: 32,
			color: N,
			whiteSpace: 'nowrap',
			boxShadow: SHADOW,
		}}
	>
		{label}
	</div>
);

/** Gros chiffre qui s'écrase (normes : « 60 », « 100 »…). */
export const BigNum: React.FC<{at: number; children: React.ReactNode; color?: string; size?: number}> = ({at: t0, children, color = N, size = 230}) => {
	const frame = useCurrentFrame();
	const t = frame - t0;
	if (t < 0) return null;
	const s = t < 5 ? interpolate(t, [0, 5], [2.2, 0.94], {easing: (v) => v * v}) : 1 - 0.06 * Math.exp(-(t - 5) / 3) * Math.cos((t - 5) * 0.9);
	return (
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color, lineHeight: 1, transform: `scale(${s})`, opacity: interpolate(t, [0, 2], [0, 1], clamp)}}>
			{children}
		</div>
	);
};

/** Pastille d'une cause (icône + libellé) qui « claque » sur son mot. */
export const CauseChip: React.FC<{at: number; icon: React.ReactNode; label: string; tone?: string}> = ({at: t0, icon, label, tone = LPI.pink}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const t = frame - t0;
	const s = t < 6 ? interpolate(t, [0, 6], [0.4, 1.12]) : 1 + 0.12 * Math.exp(-(t - 6) / 3) * Math.cos((t - 6) * 0.9);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				height: 96,
				padding: '0 30px 0 12px',
				borderRadius: 999,
				background: LPI.paper,
				border: `5px solid ${tone}`,
				boxShadow: `0 14px 34px ${alpha(N, 0.12)}`,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: 42,
				color: N,
				whiteSpace: 'nowrap',
				opacity: interpolate(t, [0, 3], [0, 1], clamp),
				transform: `scale(${s}) rotate(${interpolate(t, [0, 8], [-8, 0], clamp)}deg)`,
			}}
		>
			<div style={{width: 72, height: 72, borderRadius: 36, background: alpha(tone, 0.45), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
			{label}
		</div>
	);
};

/** Chronomètre d'une minute : l'anneau se remplit, le compteur roule au centre. */
export const Stopwatch: React.FC<{progress: number; count: number; size?: number; label?: string}> = ({progress, count, size = 300, label = 'battements'}) => {
	const r = 118;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<svg width={size} height={size} viewBox="-150 -160 300 310" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect x={-26} y={-160} width={52} height={30} rx={10} fill={LPI.blue} stroke={N} strokeWidth={7} />
				<circle r={r + 16} fill={LPI.paper} stroke={N} strokeWidth={9} />
				<circle r={r} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={18} />
				<circle r={r} fill="none" stroke={LPI.blue} strokeWidth={18} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} transform="rotate(-90)" />
				<g transform={`rotate(${progress * 360})`}>
					<path d={`M0 0 V${-r + 22}`} stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
				</g>
				<circle r={9} fill={LPI.pink} stroke={N} strokeWidth={4} />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 34}}>
				<div style={{background: alpha(LPI.paper, 0.92), borderRadius: 24, padding: '0 12px', lineHeight: 1}}>
					<Odometer value={count} places={2} size={size * 0.3} />
				</div>
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: size * 0.075, color: alpha(N, 0.7), marginTop: 4}}>{label}</div>
			</div>
		</div>
	);
};

/* ───────────── récap rapide (fin de vidéo) ───────────── */

/** Une ligne de la fiche récap : elle s'allume sur son mot, se coche quand la suivante arrive. */
export const RecapRow: React.FC<{at: number; next: number; sign: SignKind; label: React.ReactNode; sub?: React.ReactNode; y: number}> = ({at: t0, next, sign, label, sub, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - t0, fps, config: {damping: 13, stiffness: 200, mass: 0.8}});
	if (frame < t0) return null;
	const current = frame < next;
	const sweep = interpolate(frame, [t0, t0 + 12], [0, 1], ease);
	const check = spring({frame: frame - next, fps, config: {damping: 9, stiffness: 240}});
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				height: 112,
				borderRadius: 32,
				overflow: 'hidden',
				background: LPI.paper,
				border: `5px solid ${current ? LPI.blue : LPI.sky}`,
				boxShadow: current ? `0 18px 44px ${alpha(LPI.blue, 0.25)}` : SHADOW,
				opacity: Math.min(1, s * 1.6),
				transform: `translateX(${(1 - s) * 140}px) rotate(${(1 - s) * 3}deg) scale(${current ? 1.02 : 1})`,
			}}
		>
			<div style={{position: 'absolute', inset: 0, width: `${sweep * 100}%`, background: alpha(LPI.sky, current ? 0.6 : 0.3)}} />
			<div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px'}}>
				<div style={{position: 'relative'}}>
					<Sign kind={sign} size={74} />
					{frame >= next ? (
						<div style={{position: 'absolute', right: -14, top: -12, transform: `scale(${check})`}}>
							<Sign kind="check" size={38} />
						</div>
					) : null}
				</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: current ? LPI.blue : N, whiteSpace: 'nowrap'}}>{label}</div>
				{sub ? <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: alpha(N, 0.65), whiteSpace: 'nowrap'}}>{sub}</div> : null}
			</div>
		</div>
	);
};

export type RecapLine = [at: number, sign: SignKind, label: React.ReactNode, sub: React.ReactNode];

/** Scène récap complète : titre, lignes (≤ 6) au mot près, tampon final + confettis sur `done`. */
export const RecapScene: React.FC<{title: string; kAt: number; rows: RecapLine[]; done: number; stamp: string}> = ({title, kAt, rows, done, stamp}) => (
	<AbsoluteFill>
		<LiveBackground />
		<Camera punches={[kAt + 5, ...rows.map(([t]) => t + 1), done]} shakes={[done + 1]} strength={0.03}>
			<Head kicker="Petit récap" kAt={kAt} title={title} tAt={kAt + 4} size={88} />
			{rows.map(([t, sign, label, sub], i) => (
				<RecapRow key={i} at={t} next={i < rows.length - 1 ? rows[i + 1][0] : done} sign={sign} label={label} sub={sub} y={430 + i * 128} />
			))}
			<Stamp at={done} x={540} y={1262} text={stamp} size={76} rot={-5} />
			<Confetti at={done} x={540} y={900} n={60} />
		</Camera>
		{rows.map(([t]) => (
			<Sfx key={t} name="pop" at={t} volume={0.11} />
		))}
		<Sfx name="stamp" at={done} volume={0.12} />
	</AbsoluteFill>
);

/** Carte de fin : logo principal qui rebondit + éclats. */
export const EndCard: React.FC = () => {
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

/* ───────────── composition complète ───────────── */

/** Progression des notions (scènes 1 → count), centrée en haut. */
const Progress: React.FC<{tl: Timeline; count: number}> = ({tl, count}) => {
	const frame = useCurrentFrame();
	const {starts, durations, transition} = tl;
	let s = 0;
	while (s < starts.length - 1 && frame >= starts[s + 1] + transition / 2) s++;
	const opacity = interpolate(frame, [starts[1], starts[1] + transition], [0, 1], clamp) * interpolate(frame, [starts[count + 1], starts[count + 1] + transition], [1, 0], clamp);
	if (opacity <= 0) return null;
	const current = Math.min(count - 1, Math.max(0, s - 1));
	const p = interpolate(frame, [starts[s], starts[s] + durations[s] - transition], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', top: GRID.header + 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, opacity}}>
			{Array.from({length: count}, (_, i) => (
				<div key={i} style={{width: i === current ? 100 : 36, height: 12, borderRadius: 6, background: i < current ? LPI.blue : LPI.sky, overflow: 'hidden'}}>
					{i === current ? <div style={{width: `${p * 100}%`, height: '100%', background: LPI.blue, borderRadius: 6}} /> : null}
				</div>
			))}
		</div>
	);
};

const MascotSfx: React.FC<{beats: Beat[]}> = ({beats}) => (
	<>
		{beatMoves(beats).map((m, i) =>
			m.x < -100 || m.x > 1180 ? null : m.via === 'hop' ? (
				<Sfx key={i} name="hop" at={m.at} volume={0.06} />
			) : m.via === 'pop' ? (
				<Sfx key={i} name="pop" at={m.at} volume={0.045} />
			) : null,
		)}
	</>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EpisodeTransition = {p: TransitionPresentation<any>; sfx: SfxName};

/**
 * Vidéo complète : scènes enchaînées par leurs transitions (jamais deux fois la même d'affilée),
 * progression des notions (toutes les scènes entre l'accroche et le récap), mascotte, voix, bruitages.
 */
export const Episode = <Id extends string>({
	tl,
	ids,
	scenes,
	transitions,
	mascot,
	voice,
	sfx,
}: {
	tl: Timeline;
	ids: readonly Id[];
	scenes: Record<Id, React.FC>;
	transitions: Record<Exclude<Id, 'intro'>, EpisodeTransition>;
	mascot: Beat[];
	/** fichier voix dans public/ (ex. 'voix/frequence-cardiaque/voix.wav'), null = muet */
	voice: string | null;
	sfx: boolean;
}) => {
	const tr = transitions as Record<string, EpisodeTransition>;
	return (
		<SfxEnabled.Provider value={sfx}>
			<AbsoluteFill style={{backgroundColor: LPI.paper}}>
				<TransitionSeries>
					{ids.map((id, i) => {
						const Scene = scenes[id] as React.FC;
						return (
							<React.Fragment key={id}>
								{i > 0 ? <TransitionSeries.Transition presentation={tr[id].p} timing={linearTiming({durationInFrames: tl.transition})} /> : null}
								<TransitionSeries.Sequence durationInFrames={tl.durations[i]}>
									<Scene />
								</TransitionSeries.Sequence>
							</React.Fragment>
						);
					})}
				</TransitionSeries>
				<Progress tl={tl} count={ids.length - 3} />
				<MascotActor beats={mascot} busts="free" />
				{voice ? (
					<Sequence from={tl.offset} layout="none">
						<Html5Audio src={staticFile(voice)} />
					</Sequence>
				) : null}
				{ids.slice(1).map((id, i) => (
					<Sfx key={id} name={tr[id].sfx} at={tl.starts[i + 1]} volume={0.11} />
				))}
				<MascotSfx beats={mascot} />
			</AbsoluteFill>
		</SfxEnabled.Provider>
	);
};

/* ───────────── places de la mascotte ───────────── */

type Spot = Pick<Beat, 'x' | 'y' | 'size'>;
export const SPOT = {
	/** bas gauche / bas droite (le contenu s'arrête vers y = 1460) */
	L: {x: 250, y: 1700, size: 380} as Spot,
	R: {x: 830, y: 1700, size: 380} as Spot,
	/** sur le coin haut-droit du terme qui claque */
	CORNER: {x: 905, y: SLAM_Y - 115, size: 200} as Spot,
};

/** Sortie à gauche puis traversée en courant pendant le rideau `runWipe` qui ouvre la scène `start`. */
export const runAcross = (tl: Timeline, start: number): Beat[] => {
	const run = {key: 'poses/course', y: 1830, size: 620} as const;
	return [
		{...run, at: start - 6, via: 'pop', x: RUN_WIPE.x0 + 60},
		{...run, at: start + Math.round(tl.transition / 2), via: 'run', dur: tl.transition, x: RUN_WIPE.x1 + 60},
	];
};
