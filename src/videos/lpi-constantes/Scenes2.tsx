import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Mascot} from '../../brand/Mascot';
import {
	Artery,
	ArteryPicto,
	BodyPicto,
	DropPicto,
	HeartPicto,
	LungsPicto,
	Oximeter,
	PictoBadge,
	Rbc,
} from '../../brand/pictos';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {Background, Box, Card, Chip, clamp, Dashes, Enter, Kicker, Readout, Title, useSoft} from '../../brand/ui';
import {Sfx} from '../../components/Sfx';
import {Abbr, CONSTANTES} from './Scenes1';
import {at, BEAT} from './timeline';

const Arrow: React.FC = () => (
	<svg
		width={40}
		height={40}
		viewBox="0 0 100 100"
		fill="none"
		stroke={LPI.navy}
		strokeWidth="10"
		strokeLinecap="round"
		strokeLinejoin="round"
		opacity={0.5}
	>
		<path d="M16 50 H80 M58 28 L82 50 L58 72" />
	</svg>
);

const Sub2: React.FC = () => <sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>;

/* ═══════════════════════ 4 — PRESSION ARTÉRIELLE ═══════════════════════ */
export const Pression: React.FC = () => {
	const frame = useCurrentFrame();
	const L = at('pa', 'quatrième');
	const T = at('pa', 'pression');
	const E = at('pa', 'elle');
	const P2 = at('pa', 'pression', 2);
	const X = at('pa', 'exercée');
	const S = at('pa', 'sang');
	const W = at('pa', 'paroi');
	const reading = useSoft(P2, true);
	const arrows = interpolate(frame, [W, W + 10], [0, 1], clamp);
	const sys = interpolate(frame, [X, X + 6], [0, 1], clamp);
	const dia = interpolate(frame, [S, S + 6], [0, 1], clamp);
	const chain = [
		{at: 12, label: 'Cœur', icon: <HeartPicto size={50} color={LPI.navy} />},
		{at: 20, label: 'Sang', icon: <DropPicto size={50} color={LPI.navy} />},
		{at: 28, label: 'Artères', icon: <ArteryPicto size={54} color={LPI.navy} />},
	];
	return (
		<AbsoluteFill>
			<Background variant={1} />
			<Box x={72} y={300}>
				<Kicker at={L}>Constante 4/5</Kicker>
			</Box>
			<Box x={72} y={346} w={700}>
				<Title at={T} text={'Pression\n*artérielle*'} size={92} />
			</Box>
			<Box x={72} y={590} style={{display: 'flex', alignItems: 'center', gap: 12}}>
				{chain.map((c, i) => (
					<React.Fragment key={c.label}>
						{i > 0 ? (
							<Enter at={c.at - 3} from="left" distance={16}>
								<Arrow />
							</Enter>
						) : null}
						<Enter at={c.at} from="up" distance={20}>
							<Chip kind="outline" size={30} icon={c.icon}>
								{c.label}
							</Chip>
						</Enter>
					</React.Fragment>
				))}
			</Box>

			<Box x={72} y={700} w={936}>
				<Enter at={E - 4}>
					<Card style={{height: 330, overflow: 'hidden'}}>
						<div style={{position: 'absolute', left: 0, top: 15}}>
							<Artery width={930} arrows={arrows} beatFrames={BEAT} />
						</div>
					</Card>
				</Enter>
				<div style={{position: 'absolute', right: 40, top: -26}}>
					<Enter at={W} from="down" distance={14} bounce>
						<Chip kind="solid" size={30}>
							paroi
						</Chip>
					</Enter>
				</div>
			</Box>
			<Mascot poses={[[E, 'determinee']]} x={880} y={1392} height={330} from="right" />
			<Box x={72} y={1072}>
				<div style={{opacity: reading, transform: `translateY(${(1 - reading) * 20}px)`}}>
					<Readout
						value={
							<>
								<span style={{color: sys > 0.5 ? LPI.blue : LPI.navy}}>120</span>
								<span style={{color: alpha(LPI.navy, 0.35)}}> / </span>
								<span style={{color: dia > 0.5 ? LPI.blue : LPI.navy}}>80</span>
							</>
						}
						unit="mmHg"
						size={128}
					/>
				</div>
			</Box>
			<Box x={72} y={1228} style={{display: 'flex', gap: 16}}>
				<Enter at={X}>
					<Chip on={sys} size={32}>
						120 = systolique
					</Chip>
				</Enter>
				<Enter at={S}>
					<Chip on={dia} size={32}>
						80 = diastolique
					</Chip>
				</Enter>
			</Box>
			{chain.map((c) => (
				<Sfx key={c.label} name="pop" at={c.at} volume={0.07} />
			))}
			<Sfx name="pop" at={P2} volume={0.08} />
			<Sfx name="tick" at={W} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════ 5 — SATURATION (SpO2) ═══════════════════════ */
const NODES = [100, 344, 592, 836];
const NODE_Y = 112;

const Journey: React.FC<{start: number; hb: number; move: number}> = ({start, hb, move}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const line = interpolate(frame, [start, start + 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const o2 = interpolate(frame, [hb, hb + 10], [0, 1], clamp);
	const moving = frame >= move;
	const bodyOn = moving && frame > move + 40 ? 0.6 + 0.4 * Math.exp(-((frame - move) % 20) / 6) : 0;
	const nodes = [
		{label: 'Poumons', icon: <LungsPicto size={68} color={LPI.navy} />},
		{label: 'Globules\nrouges', icon: <Rbc size={68} o2={o2} />},
		{label: 'Cœur', icon: <HeartPicto size={64} color={LPI.navy} />},
		{label: 'Corps', icon: <BodyPicto size={68} color={LPI.navy} />},
	];
	return (
		<div style={{position: 'relative', width: 936, height: 300}}>
			<svg width={936} height={300} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<clipPath id="lpi-journey">
						<rect x={NODES[0]} y={NODE_Y - 10} width={line * (NODES[3] - NODES[0])} height={20} />
					</clipPath>
				</defs>
				<path
					d={`M${NODES[0]} ${NODE_Y} H${NODES[3]}`}
					stroke={alpha(LPI.navy, 0.3)}
					strokeWidth="6"
					strokeDasharray="12 14"
					strokeLinecap="round"
					clipPath="url(#lpi-journey)"
				/>
				{frame >= start + 12
					? Array.from({length: 5}, (_, i) => {
							const u = ((frame - start - 12) / 32 + i / 5) % 1;
							return (
								<circle
									key={i}
									cx={NODES[0] + u * (NODES[1] - NODES[0])}
									cy={NODE_Y + Math.sin(u * Math.PI * 2) * 12}
									r={9}
									fill={LPI.blue}
									opacity={Math.sin(u * Math.PI)}
								/>
							);
						})
					: null}
				{moving
					? Array.from({length: 4}, (_, i) => {
							const u = ((frame - move) / 80 + i / 4) % 1;
							return (
								<g
									key={i}
									transform={`translate(${NODES[1] + u * (NODES[3] - NODES[1])} ${NODE_Y})`}
									opacity={Math.sin(u * Math.PI)}
								>
									<ellipse rx="22" ry="14" fill={LPI.pink} stroke={LPI.navy} strokeWidth="3.5" />
									<circle cx="-13" cy="-15" r="7" fill={LPI.blue} />
									<circle cx="13" cy="-15" r="7" fill={LPI.blue} />
								</g>
							);
						})
					: null}
			</svg>
			{nodes.map((n, i) => {
				const s = spring({frame: frame - start - i * 6, fps, config: {damping: 16, stiffness: 140}});
				const on = i === 1 ? o2 : i === 3 ? bodyOn : 0;
				return (
					<div
						key={n.label}
						style={{
							position: 'absolute',
							left: NODES[i] - 62,
							top: NODE_Y - 62,
							width: 124,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							opacity: Math.min(1, s * 1.5),
							transform: `translateY(${(1 - s) * 20}px)`,
						}}
					>
						<div
							style={{
								width: 124,
								height: 124,
								borderRadius: 999,
								background: on > 0.5 ? alpha(LPI.blue, 0.18) : LPI.sky,
								border: `4px solid ${on > 0.5 ? LPI.blue : LPI.paper}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: `0 10px 26px ${alpha(LPI.navy, 0.12)}`,
							}}
						>
							{n.icon}
						</div>
						<div
							style={{
								marginTop: 12,
								fontFamily: FONT.body,
								fontWeight: 700,
								fontSize: 26,
								color: LPI.navy,
								textAlign: 'center',
								lineHeight: 1.15,
								whiteSpace: 'pre-line',
							}}
						>
							{n.label}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const Saturation: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const L = at('spo2', 'et');
	const T = at('spo2', 'saturation');
	const SP = at('spo2', 'spo2');
	const E = at('spo2', 'elle');
	const P = at('spo2', 'pourcentage');
	const HB = at('spo2', "d'hémoglobine");
	const TR = at('spo2', 'transporte');
	const swap = interpolate(frame, [SP - 4, SP + 6], [0, 1], clamp);
	const big = spring({frame: frame - SP, fps, config: {damping: 16, stiffness: 140}});
	const enter = spring({frame: frame - 10, fps, config: {damping: 20, stiffness: 90}});
	const clip = spring({frame: frame - 26, fps, config: {damping: 14, stiffness: 140}});
	const on = interpolate(frame, [T - 4, T + 4], [0, 1], clamp);
	const value = interpolate(frame, [T, T + 30], [70, 98], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill>
			<Background variant={2} />
			<Box x={72} y={300}>
				<Kicker at={L}>Constante 5/5</Kicker>
			</Box>
			<Box x={72} y={346} w={900} style={{opacity: 1 - swap}}>
				<Title at={T} text={'Saturation\nen *oxygène*'} size={92} />
			</Box>
			<Box x={72} y={340} style={{opacity: Math.min(1, big * 1.5), transform: `translateY(${(1 - big) * 24}px)`}}>
				<div
					style={{
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 150,
						lineHeight: 1,
						color: LPI.blue,
						position: 'relative',
					}}
				>
					SpO
					<Sub2 />
				</div>
				<div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: alpha(LPI.navy, 0.72), marginTop: 8}}>
					Saturation en oxygène
				</div>
			</Box>
			<div style={{position: 'absolute', left: 560, top: 380, opacity: big}}>
				<Dashes at={SP + 6} size={54} />
			</div>
			<Box x={72} y={590} w={936}>
				<Enter at={8}>
					<Card style={{height: 330, overflow: 'hidden'}}>
						<div style={{position: 'absolute', left: 28, top: 14}}>
							<Oximeter on={on} value={value} enter={enter} clip={clip} beatFrames={BEAT} />
						</div>
					</Card>
				</Enter>
			</Box>
			<Box x={72} y={950} w={936}>
				<Enter at={E - 6}>
					<Card style={{height: 300}}>
						<Journey start={E} hb={HB} move={TR} />
					</Card>
				</Enter>
			</Box>
			<Box x={72} y={1280}>
				<Enter at={P}>
					<Chip on={interpolate(frame, [HB, HB + 6], [0, 1], clamp)} size={32}>
						98 % de l'hémoglobine transporte de l'O
						<Sub2 />
					</Chip>
				</Enter>
			</Box>
			<Sfx name="pop" at={26} volume={0.07} />
			<Sfx name="tick" at={T} volume={0.12} />
			<Sfx name="pop" at={SP} volume={0.08} />
			<Sfx name="pop" at={P} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════ CONCLUSION ═══════════════════════════ */
const ROW_Y = 590;
const ROW_H = 120;
const ROW_GAP = 18;

export const Conclusion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const A = at('outro', 'alors');
	const named = [
		at('outro', 'température'),
		at('outro', 'fréquence'),
		at('outro', 'fréquence', 2),
		at('outro', 'pression'),
		at('outro', 'spo2'),
	];
	const done = named[4] + 22;
	return (
		<AbsoluteFill>
			<Background variant={0} />
			<Box x={72} y={300}>
				<Kicker at={A}>À retenir</Kicker>
			</Box>
			<Box x={72} y={346} w={900}>
				<Title at={A + 2} text={'Les *5* constantes'} size={92} />
			</Box>
			{CONSTANTES.map((c, k) => {
				const s = spring({frame: frame - A - 8 - k * 4, fps, config: {damping: 18, stiffness: 130}});
				const on = interpolate(frame, [named[k], named[k] + 6], [0, 1], clamp);
				const current = frame >= named[k] && (k === 4 ? frame < done : frame < named[k + 1]);
				return (
					<div
						key={c.abbr}
						style={{
							position: 'absolute',
							left: 72,
							top: ROW_Y + k * (ROW_H + ROW_GAP),
							width: 580,
							height: ROW_H,
							borderRadius: 32,
							background: current ? LPI.blue : LPI.paper,
							border: `3px solid ${on > 0.5 ? LPI.blue : LPI.sky}`,
							boxShadow: SHADOW,
							display: 'flex',
							alignItems: 'center',
							gap: 22,
							padding: '0 26px',
							opacity: Math.min(1, s * 1.5),
							transform: `translateX(${(1 - s) * -40}px) scale(${current ? 1.03 : 1})`,
							transformOrigin: 'left center',
						}}
					>
						<PictoBadge size={80} on={0}>
							<c.Picto size={50} color={LPI.navy} />
						</PictoBadge>
						<div
							style={{
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 46,
								color: current ? LPI.paper : LPI.navy,
								minWidth: 104,
							}}
						>
							<Abbr i={k} />
						</div>
						<div
							style={{
								fontFamily: FONT.body,
								fontWeight: 600,
								fontSize: 28,
								color: current ? LPI.paper : alpha(LPI.navy, 0.75),
							}}
						>
							{c.name}
						</div>
					</div>
				);
			})}
			<Mascot
				poses={[
					[A + 4, 'face'],
					[done, 'celebre'],
				]}
				x={866}
				y={1340}
				height={600}
				from="right"
			/>
			<Box x={72} y={1298}>
				<Enter at={done + 4} bounce>
					<Chip kind="pink" size={38}>
						À retenir pour l'IFSI
					</Chip>
				</Enter>
			</Box>
			{named.map((t, k) => (
				<Sfx key={k} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="ding" at={done + 4} volume={0.14} />
		</AbsoluteFill>
	);
};
