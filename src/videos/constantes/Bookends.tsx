import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sign, SignKind} from '../../brand/learn';
import {Burst, Camera, Confetti, LiveBackground, Odometer} from '../../brand/motion3';
import {GaugePicto, GlucosePicto, HeartPicto, JarPicto, LungsPicto, O2Picto, PictoBadge, ThermoPicto} from '../../brand/pictos';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Kicker, Title} from '../../brand/ui';
import {Sfx} from '../../brand/Sfx';
import {at} from './timeline';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const Sub2: React.FC = () => <sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>;

export const CONSTANTES = [
	{abbr: 'T°', Picto: ThermoPicto, terms: ['Fébrile', 'Fébricule', 'Apyrétique', 'Hypothermie']},
	{abbr: 'FC', Picto: HeartPicto, terms: ['Tachycardie', 'Bradycardie', 'Arythmie']},
	{abbr: 'FR', Picto: LungsPicto, terms: ['Tachypnée', 'Bradypnée', 'Dyspnée']},
	{abbr: 'PA', Picto: GaugePicto, terms: ['Systolique', 'Diastolique', 'HTA', 'Hypotension']},
	{abbr: 'SpO2', Picto: O2Picto, terms: ['Oxymètre', 'Désaturation', 'Hypoxémie', 'BPCO 88–92 %']},
	{abbr: 'Glycémie', Picto: GlucosePicto, terms: ['Hyperglycémie', 'Hypoglycémie', 'Lecteur']},
	{abbr: 'Diurèse', Picto: JarPicto, terms: ['Oligurie', 'Anurie', 'Polyurie']},
] as const;

const Abbr: React.FC<{i: number}> = ({i}) =>
	i === 4 ? (
		<span>
			SpO
			<Sub2 />
		</span>
	) : (
		<>{CONSTANTES[i].abbr}</>
	);

/** Rangée des 7 pictos de l'accroche (la plongée vers la 1re constante part du picto T°). */
export const HOOK_ROW = {y: 640, size: 112, xs: CONSTANTES.map((_, k) => 72 + (936 * (k + 0.5)) / CONSTANTES.length)};

const MARQUEE: [string, SignKind][][] = [
	[
		['Fébrile', 'up'],
		['Tachycardie', 'up'],
		['Dyspnée', 'alert'],
		['Systolique', 'squeeze'],
		['Hypoxémie', 'empty'],
		['Apyrétique', 'check'],
		['Bradypnée', 'down'],
		['Hypotension', 'down'],
		['Fébricule', 'up'],
		['Oligurie', 'down'],
		['Hyperglycémie', 'up'],
	],
	[
		['Arythmie', 'wave'],
		['Désaturation', 'down'],
		['Hypothermie', 'down'],
		['Tachypnée', 'up'],
		['Diastolique', 'relax'],
		['Bradycardie', 'down'],
		['Hypertension', 'up'],
		['Oxymètre de pouls', 'device'],
		['Hypoglycémie', 'down'],
		['Anurie', 'empty'],
		['Polyurie', 'up'],
	],
];

const MarqueeRow: React.FC<{items: [string, SignKind][]; y: number; dir: 1 | -1; at: number}> = ({items, y, dir, at: t0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - t0, fps, config: {damping: 16, stiffness: 160}});
	if (frame < t0) return null;
	const shift = dir < 0 ? 40 - (frame - t0) * 6 : -1700 + (frame - t0) * 6;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: y,
				width: 1080,
				height: 84,
				overflow: 'hidden',
				opacity: s,
				WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 88%, transparent)',
				maskImage: 'linear-gradient(90deg, transparent, black 8%, black 88%, transparent)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: shift + (1 - s) * 300 * -dir,
					display: 'flex',
					gap: 18,
					whiteSpace: 'nowrap',
				}}
			>
				{items.map(([t, k]) => (
					<div
						key={t}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							height: 76,
							padding: '0 26px 0 10px',
							borderRadius: 999,
							background: LPI.paper,
							border: `4px solid ${LPI.sky}`,
							boxShadow: SHADOW,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 38,
							color: LPI.navy,
						}}
					>
						<Sign kind={k} size={54} />
						{t}
					</div>
				))}
			</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const SEVEN = at('intro', '7');
	const C = at('intro', 'constantes');
	const AV = at('intro', 'avec');
	const TECH = at('intro', 'techniques');

	// 1) gros « 7 » au centre, 2) il file dans le coin quand « constantes » arrive
	const pop = spring({frame: frame + 4, fps, config: {damping: 10, stiffness: 200, mass: 0.7}});
	const fly = interpolate(frame, [C - 2, C + 12], [0, 1], {...clamp, easing: ease});
	const d = interpolate(fly, [0, 1], [460, 180]);
	const cx = interpolate(fly, [0, 1], [540, 72 + 90]);
	const cy = interpolate(fly, [0, 1], [800, 320]);
	const ring = 1 - fly;
	const les = interpolate(frame, [0, 4, C - 2, C + 6], [0, 1, 1, 0], clamp);
	// termes techniques à l'écran : 23 cartes de termes + hyperthermie, normoglycémie, normodiurèse (échelles)
	const count = interpolate(frame, [TECH, TECH + 24], [0, 26], {...clamp, easing: ease});
	const chip = spring({frame: frame - TECH + 2, fps, config: {damping: 12, stiffness: 190}});
	const LAND = TECH + 24;
	const landPunch = frame >= LAND ? Math.exp(-(frame - LAND) / 6) * Math.sin((frame - LAND) * 0.8) : 0;

	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[2, AV + 1, TECH + 1, LAND + 1]} strength={0.04}>
				{/* « Les » au-dessus du gros 7 (disparaît quand le 7 rejoint le titre) */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 470,
						textAlign: 'center',
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 88,
						color: LPI.navy,
						opacity: les,
						transform: `translateY(${(1 - les) * -20}px)`,
					}}
				>
					Les
				</div>
				<Burst at={SEVEN} x={540} y={800} r={280} n={14} />
				{/* anneau pointillé qui tourne autour du 7 */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: ring}}>
					<circle
						cx={540}
						cy={800}
						r={268}
						fill="none"
						stroke={LPI.sky}
						strokeWidth={10}
						strokeDasharray="4 30"
						strokeLinecap="round"
						transform={`rotate(${frame * 2} 540 800)`}
					/>
				</svg>
				<div
					style={{
						position: 'absolute',
						left: cx - d / 2,
						top: cy - d / 2,
						width: d,
						height: d,
						borderRadius: 999,
						background: LPI.blue,
						boxShadow: `0 24px 60px ${alpha(LPI.blue, 0.35)}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: d * 0.66,
						color: LPI.paper,
						transform: `scale(${0.3 + 0.7 * pop}) rotate(${(1 - pop) * -30}deg)`,
					}}
				>
					7
				</div>
				<div style={{position: 'absolute', left: 276, top: 252}}>
					<Title at={C + 4} text="constantes" size={112} stagger={1} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 452, width: 960}}>
					<Title at={AV} text="avec les *mots* *techniques*" size={72} stagger={3} />
				</div>
				{CONSTANTES.map((c, k) => (
					<div
						key={c.abbr}
						style={{
							position: 'absolute',
							left: HOOK_ROW.xs[k] - HOOK_ROW.size / 2,
							top: HOOK_ROW.y,
							width: HOOK_ROW.size,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<Enter at={C + 6 + k * 2} distance={50} bounce>
							<div style={{transform: `rotate(${Math.sin(frame / 18 + k) * 4}deg)`}}>
								<PictoBadge size={HOOK_ROW.size}>
									<c.Picto size={64} color={LPI.navy} />
								</PictoBadge>
							</div>
						</Enter>
						<Enter at={C + 9 + k * 2} distance={10}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: c.abbr.length > 4 ? 25 : 34, color: LPI.navy, whiteSpace: 'nowrap'}}>
								<Abbr i={k} />
							</div>
						</Enter>
					</div>
				))}
				<MarqueeRow items={MARQUEE[0]} y={872} dir={-1} at={AV} />
				<MarqueeRow items={MARQUEE[1]} y={970} dir={1} at={AV + 4} />
				<div
					style={{
						position: 'absolute',
						left: 72,
						top: 1090,
						opacity: Math.min(1, chip * 1.5),
						transform: `translateY(${(1 - chip) * 40}px) scale(${(0.8 + 0.2 * chip) * (1 + 0.08 * landPunch)})`,
						transformOrigin: 'left center',
					}}
				>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 14,
							padding: '14px 34px',
							borderRadius: 999,
							background: LPI.blue,
							color: LPI.paper,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 50,
							whiteSpace: 'nowrap',
							boxShadow: `0 18px 44px ${alpha(LPI.blue, 0.35)}`,
						}}
					>
						+
						<Odometer value={count} places={2} size={56} color={LPI.paper} />
						termes techniques
					</div>
				</div>
				<Burst at={LAND} x={400} y={1130} r={260} n={12} />
			</Camera>
			<Sfx name="impact" at={SEVEN} volume={0.1} />
			<Sfx name="whoosh" at={C} volume={0.06} />
			{CONSTANTES.map((_, k) => (
				<Sfx key={k} name="pop" at={C + 6 + k * 2} volume={0.08} />
			))}
			<Sfx name="whoosh" at={AV} volume={0.06} />
			{[0, 6, 12, 18].map((k) => (
				<Sfx key={k} name="tick" at={TECH + k} volume={0.09} />
			))}
			<Sfx name="ding" at={LAND} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
const ROW_Y = 410;
const ROW_H = 108;
const ROW_GAP = 14;

export const Recap3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const R = at('outro', 'récapitulons');
	const named = [
		at('outro', 'température'),
		at('outro', 'fréquence'),
		at('outro', 'fréquence', 2),
		at('outro', 'pression'),
		at('outro', 'spo2'),
		at('outro', 'glycémie'),
		at('outro', 'diurèse'),
	];
	const last = named.length - 1;
	const DONE = named[last] + 16;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[R + 2, ...named.map((t) => t + 1), DONE]} strength={0.03}>
				<div style={{position: 'absolute', left: 72, top: 236}}>
					<Kicker at={R}>Récap</Kicker>
				</div>
				<div style={{position: 'absolute', left: 72, top: 286, width: 936}}>
					<Title at={R + 2} text={'Les *7* constantes'} size={92} stagger={2} />
				</div>
				{CONSTANTES.map((c, k) => {
					const s = spring({frame: frame - named[k], fps, config: {damping: 13, stiffness: 200, mass: 0.8}});
					const current = frame >= named[k] && (k === last ? frame < DONE + 12 : frame < named[k + 1]);
					const sweep = interpolate(frame, [named[k], named[k] + 12], [0, 1], {...clamp, easing: ease});
					const doneAt = k < last ? named[k + 1] : DONE;
					const check = spring({frame: frame - doneAt, fps, config: {damping: 9, stiffness: 240}});
					if (frame < named[k]) return null;
					return (
						<div
							key={c.abbr}
							style={{
								position: 'absolute',
								left: 72,
								top: ROW_Y + k * (ROW_H + ROW_GAP),
								width: 936,
								height: ROW_H,
								borderRadius: 30,
								overflow: 'hidden',
								background: LPI.paper,
								border: `4px solid ${current ? LPI.blue : LPI.sky}`,
								boxShadow: current ? `0 18px 44px ${alpha(LPI.blue, 0.25)}` : SHADOW,
								opacity: Math.min(1, s * 1.6),
								transform: `translateX(${(1 - s) * 140}px) rotate(${(1 - s) * 3}deg) scale(${current ? 1.02 : 1})`,
							}}
						>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									width: `${sweep * 100}%`,
									background: alpha(LPI.sky, current ? 0.6 : 0.3),
								}}
							/>
							<div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px'}}>
								<div style={{position: 'relative'}}>
									<PictoBadge size={74} on={current ? 1 : 0}>
										<c.Picto size={46} color={current ? LPI.paper : LPI.navy} />
									</PictoBadge>
									{frame >= doneAt ? (
										<div style={{position: 'absolute', right: -12, top: -10, transform: `scale(${check})`}}>
											<Sign kind="check" size={38} />
										</div>
									) : null}
								</div>
								<div
									style={{
										fontFamily: FONT.title,
										fontWeight: 900,
										fontSize: c.abbr.length > 4 ? 32 : 42,
										color: current ? LPI.blue : LPI.navy,
										minWidth: 100,
										whiteSpace: 'nowrap',
									}}
								>
									<Abbr i={k} />
								</div>
								<div style={{display: 'flex', gap: 6}}>
									{c.terms.map((t, j) => {
										const ts = spring({frame: frame - named[k] - 5 - j * 3, fps, config: {damping: 11, stiffness: 220}});
										return (
											<div
												key={t}
												style={{
													opacity: Math.min(1, ts * 1.5),
													transform: `translateY(${(1 - ts) * 20}px) scale(${0.7 + 0.3 * ts})`,
													fontFamily: FONT.body,
													fontWeight: 700,
													fontSize: 22,
													color: LPI.navy,
													background: current ? LPI.paper : alpha(LPI.sky, 0.6),
													padding: '7px 11px',
													borderRadius: 999,
													whiteSpace: 'nowrap',
												}}
											>
												{t}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
				<Confetti at={DONE} x={540} y={820} n={60} />
			</Camera>
			{named.map((t, k) => (
				<Sfx key={k} name="pop" at={t} volume={0.11} />
			))}
			<Sfx name="ding" at={DONE} volume={0.1} />
		</AbsoluteFill>
	);
};
