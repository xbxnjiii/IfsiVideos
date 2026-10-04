import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Background} from '../../components/Background';
import {ArrowUp, Bubble, Check, Cross, Ion} from '../../components/icons';
import {At, Camera, Card, Chip, clamp, Pop, Stamp, usePop, useShake, Words} from '../../components/motion';
import {Sfx} from '../../components/Sfx';
import {TipHeader} from '../../components/TipHeader';
import {BODY, C, TITLE} from '../../theme';

const Body: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({
	children,
	size = 44,
	color = C.white,
	style,
}) => (
	<div
		style={{fontFamily: BODY, fontWeight: 700, fontSize: size, color, lineHeight: 1.3, textAlign: 'center', ...style}}
	>
		{children}
	</div>
);

/* ------------------------------------------------------------------ */
/* TIP 1 — Identitovigilance                                           */
/* ------------------------------------------------------------------ */
export const Tip1: React.FC<{duration: number}> = ({duration}) => (
	<AbsoluteFill>
		<Background accent={C.cyan} accent2={C.blue} />
		<Camera duration={duration}>
			<TipHeader n={1} label="IDENTITÉ" accent={C.cyan} />
			<At top={450}>
				<Words text={'Fais-lui *DIRE*\nson identité'} delay={6} size={104} accent={C.cyan} />
			</At>
			<At top={720}>
				<Pop delay={34} from="right" distance={300}>
					<div style={{position: 'relative'}}>
						<Bubble color={C.red} side="right" width={760}>
							<Body size={48} style={{textAlign: 'left'}}>
								« Vous êtes bien M. Martin ? »
							</Body>
							<Body size={32} color={C.muted} style={{textAlign: 'left', marginTop: 10}}>
								Il peut répondre oui… sans avoir écouté
							</Body>
						</Bubble>
						<div style={{position: 'absolute', right: -30, top: -50}}>
							<Stamp at={58}>
								<Cross size={120} />
							</Stamp>
						</div>
					</div>
				</Pop>
			</At>
			<At top={1000}>
				<Pop delay={72} from="left" distance={300}>
					<div style={{position: 'relative'}}>
						<Bubble color={C.green} side="left" width={760}>
							<Body size={46} style={{textAlign: 'left'}}>
								« Pouvez-vous me donner vos nom, prénom et date de naissance ? »
							</Body>
						</Bubble>
						<div style={{position: 'absolute', right: -30, top: -50}}>
							<Stamp at={96}>
								<Check size={120} />
							</Stamp>
						</div>
					</div>
				</Pop>
			</At>
			<At top={1330}>
				<Pop delay={122} from="scale">
					<Chip color={C.cyan} size={38}>
						+ bracelet, prescription &amp; étiquettes
					</Chip>
				</Pop>
			</At>
		</Camera>
		<Sfx name="whoosh" at={34} />
		<Sfx name="stamp" at={58} />
		<Sfx name="buzz" at={60} />
		<Sfx name="whoosh" at={72} />
		<Sfx name="ding" at={96} />
		<Sfx name="pop" at={122} />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* TIP 2 — Garrot                                                       */
/* ------------------------------------------------------------------ */
const COUNT_START = 22;
const COUNT_END = 96;

const Timer: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [COUNT_START, COUNT_END], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const secs = Math.round(p * 60);
	const r = 190;
	const circ = 2 * Math.PI * r;
	const color = p < 0.6 ? C.cyan : p < 0.9 ? C.yellow : C.red;
	const done = frame >= COUNT_END;
	const pulse = done ? 1 + 0.08 * Math.exp(-(frame - COUNT_END) * 0.15) * Math.sin((frame - COUNT_END) * 0.9) : 1;
	return (
		<div style={{position: 'relative', width: 440, height: 440, transform: `scale(${pulse})`}}>
			<svg width={440} height={440} viewBox="0 0 440 440">
				<circle cx={220} cy={220} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={30} />
				<circle
					cx={220}
					cy={220}
					r={r}
					fill="none"
					stroke={color}
					strokeWidth={30}
					strokeLinecap="round"
					strokeDasharray={circ}
					strokeDashoffset={circ * (1 - p)}
					transform="rotate(-90 220 220)"
					style={{filter: `drop-shadow(0 0 24px ${color})`}}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: done ? 120 : 150, color: done ? C.red : C.white}}>
					{done ? 'STOP' : `${secs}s`}
				</div>
				<div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, letterSpacing: '0.2em'}}>
					GARROT POSÉ
				</div>
			</div>
		</div>
	);
};

const Tip2Potassium: React.FC = () => {
	const frame = useCurrentFrame();
	const shake = useShake(32, 14, 10);
	const bounce = Math.sin(frame / 5) * 12;
	return (
		<AbsoluteFill>
			<At top={470}>
				<Words text={'Et on ne fait *PAS*\npomper le poing'} delay={4} size={88} accent={C.orange} />
			</At>
			<At top={760} style={{transform: shake}}>
				<Pop delay={30} from="scale">
					<div style={{display: 'flex', alignItems: 'center', gap: 34}}>
						<div
							style={{
								width: 260,
								height: 260,
								borderRadius: 999,
								background: `radial-gradient(circle at 35% 30%, ${C.orange}, #C2410C)`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: TITLE,
								fontWeight: 900,
								fontSize: 150,
								color: C.white,
								boxShadow: `0 0 80px ${C.orange}88`,
							}}
						>
							<Ion base="K" sup="+" />
						</div>
						<div style={{transform: `translateY(${-Math.abs(bounce)}px)`}}>
							<ArrowUp size={170} color={C.red} />
						</div>
					</div>
				</Pop>
			</At>
			<At top={1080}>
				<Pop delay={44}>
					<Words text="_faussement_ élevé" delay={44} size={78} weight={900} accent={C.yellow} />
				</Pop>
			</At>
			<At top={1230}>
				<Pop delay={64}>
					<Body size={40} color={C.muted} style={{maxWidth: 820}}>
						Les muscles qui travaillent libèrent du potassium : le résultat ne reflète plus le patient.
					</Body>
				</Pop>
			</At>
		</AbsoluteFill>
	);
};

export const Tip2: React.FC<{duration: number}> = ({duration}) => {
	const ticks = Array.from({length: 9}, (_, i) => COUNT_START + Math.round((i * (COUNT_END - COUNT_START)) / 9));
	return (
		<AbsoluteFill>
			<Background accent={C.orange} accent2={C.red} />
			<Camera duration={duration}>
				<TipHeader n={2} label="LE GARROT" accent={C.orange} />
				<Sequence durationInFrames={122} layout="none">
					<At top={450}>
						<Pop out={112}>
							<Words text="*1* *MINUTE* MAX" delay={6} size={100} accent={C.orange} />
						</Pop>
					</At>
					<At top={630}>
						<Pop delay={12} from="scale" out={112}>
							<Timer />
						</Pop>
					</At>
					<At top={1130}>
						<Pop delay={30} out={112}>
							<Words
								text={'Posé *7* *à* *10* *cm* au-dessus\ndu point de ponction'}
								delay={30}
								stagger={2}
								size={48}
								weight={700}
								font={BODY}
								accent={C.orange}
								lineHeight={1.3}
							/>
						</Pop>
					</At>
				</Sequence>
				<Sequence from={118} layout="none">
					<Tip2Potassium />
				</Sequence>
			</Camera>
			{ticks.map((t) => (
				<Sfx key={t} name="tick" at={t} />
			))}
			<Sfx name="buzz" at={COUNT_END} />
			<Sfx name="whoosh" at={116} />
			<Sfx name="impact" at={148} volume={0.5} />
			<Sfx name="pop" at={162} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* TIP 3 — Palper la veine                                              */
/* ------------------------------------------------------------------ */
const PULSE_START = 50;
const PULSE_PERIOD = 24;

const VeinPress: React.FC = () => {
	const frame = useCurrentFrame();
	const local = Math.max(0, frame - 40) % 40;
	const press = interpolate(local, [0, 8, 16, 22], [0, 1, 1, 0], clamp);
	const after = local - 22;
	const rebound = after > 0 ? 0.16 * Math.sin(after * 0.7) * Math.exp(-after * 0.18) : 0;
	const scaleY = 1 - 0.42 * press + rebound;
	return (
		<svg width={360} height={300} viewBox="0 0 360 300">
			<rect x="0" y="110" width="360" height="190" rx="30" fill={C.skin} />
			<rect x="0" y="110" width="360" height="12" rx="6" fill={C.skinDark} opacity="0.5" />
			<g transform={`translate(0 ${200}) scale(1 ${scaleY}) translate(0 ${-200})`}>
				<rect x="20" y="168" width="320" height="64" rx="32" fill={C.vein} />
				<rect x="40" y="178" width="280" height="12" rx="6" fill="rgba(255,255,255,0.3)" />
			</g>
			<g transform={`translate(0 ${press * 55})`}>
				<path d="M130 -20 H230 V60 A50 50 0 0 1 130 60 Z" fill="#F7C9B3" />
				<path d="M150 30 H210 V62 A30 30 0 0 1 150 62 Z" fill="#FBE3D6" />
			</g>
		</svg>
	);
};

const ArteryPulse: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame - PULSE_START;
	const phase = t < 0 ? PULSE_PERIOD : t % PULSE_PERIOD;
	const pulse = t < 0 ? 0 : Math.exp(-phase / 4);
	const keys: [number, number][] = [
		[0, 0],
		[38, 0],
		[42, -8],
		[46, 0],
		[52, 0],
		[56, -55],
		[61, 28],
		[65, 0],
		[80, 0],
		[88, -14],
		[96, 0],
		[120, 0],
	];
	const ecg = (p: number) => {
		for (let i = 1; i < keys.length; i++) {
			if (p <= keys[i][0]) {
				const [x0, y0] = keys[i - 1];
				const [x1, y1] = keys[i];
				return y0 + ((p - x0) / (x1 - x0)) * (y1 - y0);
			}
		}
		return 0;
	};
	const offset = (t * 5) % 120;
	const points = Array.from({length: 121}, (_, i) => {
		const x = i * 3;
		const p = (((x + offset) % 120) + 120) % 120;
		return `${x},${60 + ecg(p)}`;
	}).join(' ');
	return (
		<svg width={360} height={300} viewBox="0 0 360 300">
			<rect x="0" y="110" width="360" height="190" rx="30" fill={C.skin} />
			<rect x="0" y="110" width="360" height="12" rx="6" fill={C.skinDark} opacity="0.5" />
			<g transform={`translate(0 200) scale(1 ${1 + 0.3 * pulse}) translate(0 -200)`}>
				<rect x="20" y="172" width="320" height="56" rx="28" fill={C.red} />
				<rect x="40" y="180" width="280" height="10" rx="5" fill="rgba(255,255,255,0.3)" />
			</g>
			<circle cx="180" cy="200" r={40 + pulse * 90} fill="none" stroke={C.red} strokeWidth={6} opacity={pulse * 0.8} />
			<polyline points={points} fill="none" stroke={C.red} strokeWidth="6" strokeLinejoin="round" />
		</svg>
	);
};

const Panel: React.FC<{title: string; color: string; children: React.ReactNode; caption: React.ReactNode}> = ({
	title,
	color,
	children,
	caption,
}) => (
	<Card
		color={color}
		style={{width: 420, padding: '28px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}
	>
		<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 54, color, letterSpacing: '0.04em'}}>{title}</div>
		{children}
		<Body size={36}>{caption}</Body>
	</Card>
);

export const Tip3: React.FC<{duration: number}> = ({duration}) => {
	const beats = Array.from({length: 6}, (_, i) => PULSE_START + i * PULSE_PERIOD);
	return (
		<AbsoluteFill>
			<Background accent={C.blue} accent2={C.red} />
			<Camera duration={duration}>
				<TipHeader n={3} label="LA VEINE" accent={C.blue} />
				<At top={450}>
					<Words text={'*PALPE*,\nne regarde pas'} delay={6} size={104} accent={C.blue} />
				</At>
				<At top={740}>
					<div style={{display: 'flex', gap: 24}}>
						<Pop delay={28} from="left" distance={260}>
							<div style={{position: 'relative'}}>
								<Panel
									title="VEINE"
									color={C.blue}
									caption={
										<>
											souple, elle <span style={{color: C.blue}}>rebondit</span>
										</>
									}
								>
									<VeinPress />
								</Panel>
								<div style={{position: 'absolute', right: -16, top: -36}}>
									<Stamp at={84}>
										<Check size={100} />
									</Stamp>
								</div>
							</div>
						</Pop>
						<Pop delay={44} from="right" distance={260}>
							<div style={{position: 'relative'}}>
								<Panel
									title="ARTÈRE"
									color={C.red}
									caption={
										<>
											ça <span style={{color: C.red}}>bat</span> : on évite
										</>
									}
								>
									<ArteryPulse />
								</Panel>
								<div style={{position: 'absolute', right: -16, top: -36}}>
									<Stamp at={108}>
										<Cross size={100} />
									</Stamp>
								</div>
							</div>
						</Pop>
					</div>
				</At>
				<At top={1290}>
					<Pop delay={134} from="scale">
						<Chip color={C.yellow} size={36}>
							Astuce : bras en déclive + chaleur
						</Chip>
					</Pop>
				</At>
			</Camera>
			<Sfx name="whoosh" at={28} />
			{beats.map((b) => (
				<Sfx key={b} name="heartbeat" at={b} volume={0.4} />
			))}
			<Sfx name="ding" at={84} />
			<Sfx name="stamp" at={108} />
			<Sfx name="pop" at={134} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* TIP 4 — Fixer la veine + angle                                       */
/* ------------------------------------------------------------------ */
const ANGLE = 25;
const RAD = (ANGLE * Math.PI) / 180;
const SKIN_Y = 200;
const VEIN_Y = 375;
const ENTRY = {x: 420, y: SKIN_Y};
const TIP = {x: ENTRY.x + (VEIN_Y - SKIN_Y) / Math.tan(RAD), y: VEIN_Y};
const NEEDLE_LEN = 660;

const PunctureDiagram: React.FC = () => {
	const frame = useCurrentFrame();
	const appear = usePop(24);
	// la veine « roule » tant que le pouce ne tend pas la peau
	const thumbDown = interpolate(frame, [52, 66], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
	const stretch = interpolate(frame, [68, 84], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const roll = Math.sin(frame / 3.2) * 16 * (1 - stretch);
	// aiguille
	const needleIn = interpolate(frame, [92, 100], [0, 1], clamp);
	const d = interpolate(frame, [100, 140], [520, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const tip = {x: TIP.x - d * Math.cos(RAD), y: TIP.y - d * Math.sin(RAD)};
	const flash = interpolate(frame, [140, 150], [0, 1], clamp);
	const arc = interpolate(frame, [140, 158], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const r = 130;
	const p2 = {x: ENTRY.x - r * Math.cos(RAD * arc), y: ENTRY.y - r * Math.sin(RAD * arc)};
	const ticks = Array.from({length: 22}, (_, i) => {
		const x0 = 20 + i * 40;
		const pull = x0 < 380 ? -stretch * (1 - x0 / 380) * 40 : 0;
		return x0 + pull;
	});
	return (
		<svg
			width={860}
			height={535}
			viewBox="0 0 900 560"
			style={{opacity: appear, transform: `translateY(${(1 - appear) * 60}px)`, overflow: 'visible'}}
		>
			<defs>
				<linearGradient id="tissue4" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#F6C3AC" />
					<stop offset="100%" stopColor="#D9846C" />
				</linearGradient>
				<linearGradient id="vein4" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#6B8CFF" />
					<stop offset="100%" stopColor="#2346C9" />
				</linearGradient>
			</defs>
			<rect x="0" y={SKIN_Y} width="900" height="360" rx="34" fill="url(#tissue4)" />
			{ticks.map((x, i) => (
				<rect key={i} x={x} y={SKIN_Y + 6} width="4" height="16" rx="2" fill={C.skinDark} />
			))}
			<g transform={`translate(${roll} 0)`}>
				<rect x="-20" y={VEIN_Y - 38} width="940" height="76" rx="38" fill="url(#vein4)" />
				<rect x="0" y={VEIN_Y - 26} width="900" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
			</g>
			{/* aiguille */}
			<g opacity={needleIn} transform={`translate(${tip.x} ${tip.y}) rotate(${ANGLE})`}>
				<rect x={-NEEDLE_LEN} y={-22} width={150} height={44} rx={10} fill={C.green} />
				<rect x={-NEEDLE_LEN + 12} y={-16} width={126} height={8} rx={4} fill="rgba(255,255,255,0.35)" />
				<rect x={-NEEDLE_LEN + 150} y={-14} width={46} height={28} rx={5} fill="rgba(220,230,250,0.6)" />
				<rect x={-NEEDLE_LEN + 152} y={-10} width={42 * flash} height={20} rx={4} fill={C.blood} />
				<path d={`M${-NEEDLE_LEN + 196} -5 H-34 L0 0 L-34 5 H${-NEEDLE_LEN + 196} Z`} fill="#E3E8F5" />
			</g>
			{/* voile de peau : la partie de l'aiguille sous la peau paraît « dedans » */}
			<rect x="0" y={SKIN_Y + 24} width="900" height="336" rx="20" fill="#E9A58E" opacity="0.38" />
			{/* pouce */}
			<g transform={`translate(${-stretch * 40} ${(1 - thumbDown) * -240})`} opacity={Math.min(1, thumbDown * 3)}>
				<path
					d={`M60 ${SKIN_Y - 70} H200 A40 40 0 0 1 200 ${SKIN_Y + 4} H60 A40 40 0 0 1 60 ${SKIN_Y - 70} Z`}
					fill="#F7C9B3"
				/>
				<path d={`M150 ${SKIN_Y - 58} H200 A24 24 0 0 1 200 ${SKIN_Y - 10} H150 Z`} fill="#FBE3D6" />
			</g>
			<g opacity={stretch * (1 - needleIn)}>
				<path d={`M250 ${SKIN_Y - 110} H60`} stroke={C.white} strokeWidth="8" strokeLinecap="round" />
				<path
					d={`M90 ${SKIN_Y - 135} L55 ${SKIN_Y - 110} L90 ${SKIN_Y - 85}`}
					stroke={C.white}
					strokeWidth="8"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			{/* arc d'angle */}
			<path
				d={`M${ENTRY.x - r} ${ENTRY.y} A${r} ${r} 0 0 1 ${p2.x} ${p2.y}`}
				fill="none"
				stroke={C.yellow}
				strokeWidth="8"
				strokeLinecap="round"
				opacity={arc > 0 ? 1 : 0}
			/>
			<line
				x1={ENTRY.x - r - 30}
				y1={ENTRY.y}
				x2={ENTRY.x + 20}
				y2={ENTRY.y}
				stroke={C.yellow}
				strokeWidth="4"
				strokeDasharray="10 10"
				opacity={arc}
			/>
			{flash > 0 ? (
				<circle
					cx={TIP.x}
					cy={TIP.y}
					r={20 + flash * 50}
					fill="none"
					stroke={C.red}
					strokeWidth={6}
					opacity={1 - flash}
				/>
			) : null}
		</svg>
	);
};

export const Tip4: React.FC<{duration: number}> = ({duration}) => (
	<AbsoluteFill>
		<Background accent={C.coral} accent2={C.yellow} />
		<Camera duration={duration}>
			<TipHeader n={4} label="LA PONCTION" accent={C.coral} />
			<At top={445}>
				<Words text="*TENDS* la peau" delay={6} size={110} accent={C.coral} />
			</At>
			<At top={590}>
				<Pop delay={16}>
					<Body size={42} color={C.muted}>
						Pouce sous le point de ponction :<br />
						la veine ne <span style={{color: C.white}}>roule</span> plus
					</Body>
				</Pop>
			</At>
			<At top={730}>
				<PunctureDiagram />
			</At>
			<At top={1310}>
				<div style={{display: 'flex', gap: 22}}>
					<Pop delay={150} from="scale">
						<Chip color={C.yellow} size={38} solid>
							Angle 15–30°
						</Chip>
					</Pop>
					<Pop delay={168} from="scale">
						<Chip color={C.coral} size={38} icon={<ArrowUp size={40} color={C.coral} />}>
							Biseau vers le haut
						</Chip>
					</Pop>
				</div>
			</At>
		</Camera>
		<Sfx name="whoosh" at={24} />
		<Sfx name="pop" at={56} />
		<Sfx name="whoosh" at={100} volume={0.25} />
		<Sfx name="pop" at={140} />
		<Sfx name="ding" at={146} />
		<Sfx name="pop" at={150} />
		<Sfx name="pop" at={168} />
	</AbsoluteFill>
);
