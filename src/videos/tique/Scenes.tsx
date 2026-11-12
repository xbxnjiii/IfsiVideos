// Scènes de « Une tique : comment bien la retirer ? » : chaque mouvement part d'un mot, at(scène, mot) — `npm run cues -- tique`.
// La peau est un `SkinG` (repère 1000 × 1000, la tique au centre (500, 500)) posé en grand ; le zoom de l'accroche agrandit
// le tout (dessin vectoriel : reste net).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Presser} from '../../brand/bandage';
import {Big, fadeIn, Flash, Fly, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {Faucet, Microbe} from '../../brand/hands';
import {FeverIcon} from '../../brand/icons';
import {DayChip, Walker, walkerArm} from '../../brand/injury';
import {ForestBg} from '../../brand/forest';
import {Burst, Camera} from '../../brand/motion3';
import {AntisepticBottle} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {LabelBottle, SkinG, SkinMedallion, TickG, TickHookG, WalkIcon} from '../../brand/tick';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

/** La peau en grand, centrée sur (cx, cy) à l'écran (W px pour 1000 unités). */
const Skin: React.FC<{cx: number; cy: number; W?: number; children?: React.ReactNode; red?: number; ring?: number; tint?: number}> = ({cx, cy, W = 1600, children, ...p}) => (
	<svg width={W} height={W} viewBox="0 0 1000 1000" style={{position: 'absolute', left: cx - W / 2, top: cy - W / 2, overflow: 'visible'}}>
		<SkinG {...p}>{children}</SkinG>
	</svg>
);

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Grande croix rose qui barre une tuile. */
const Cross: React.FC<{at: number; size?: number}> = ({at: t0, size = 240}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = lin(frame, t0, t0 + 6);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, overflow: 'visible'}}>
			{[
				[18, 18, 82, 82],
				[82, 18, 18, 82],
			].map(([a, b, c, d], i) => (
				<g key={i}>
					<path d={`M${a} ${b} L${c} ${d}`} stroke={N} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
					<path d={`M${a} ${b} L${c} ${d}`} stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
				</g>
			))}
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE : LA BALADE, PUIS LE PETIT POINT NOIR ═══════════════════════════════ */
/** Le promeneur (Walker de 420 px) : il s'arrête pile sous la branche, bras le long du corps. */
const MAN = {W: 420, ground: 1500, x0: -460, x1: 300};
const MAN_K = MAN.W / 300;
const MAN_TOP = MAN.ground - 590 * MAN_K;
const PHASE_END = 5 * Math.PI;
const arm = walkerArm(PHASE_END);
/** Le point du bras où tombe la tique (milieu de l'avant-bras), à l'écran une fois l'homme arrêté. */
const LAND = {x: MAN.x1 + ((arm[1][0] + arm[2][0]) / 2) * MAN_K, y: MAN_TOP + ((arm[1][1] + arm[2][1]) / 2) * MAN_K};
const BRANCH = {x: LAND.x, y: 700};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const QUELQUE = at('intro', 'quelque');
	const BRAS = at('intro', 'bras.');
	const QUOI = at('intro', 'quoi ?');
	const POINT = at('intro', 'point');
	const FROTTES = at('intro', 'frottes…');
	const TIQUE = at('intro', 'tique !');
	// 1. il marche sur le sentier et s'arrête sous la branche
	const walk = interpolate(frame, [0, QUELQUE + 6], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const manX = interpolate(walk, [0, 1], [MAN.x0, MAN.x1]);
	const phase = walk * PHASE_END;
	// 2. la tique tombe de la feuille sur son bras
	const fall = interpolate(frame, [QUELQUE, BRAS], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const tx = BRANCH.x + 14 * Math.sin(fall * 9) * (1 - fall);
	const ty = interpolate(fall, [0, 1], [BRANCH.y, LAND.y - 6]);
	// 3. « C'est quoi ? » : la caméra plonge sur le bras… et on arrive sur la peau
	const dive = lin(frame, QUOI - 4, QUOI + 20);
	const zf = 1 + 7 * dive * dive;
	const skinIn = lin(frame, QUOI + 12, QUOI + 22);
	// 4. sur la peau : le point noir, le doigt qui frotte, puis le zoom sur la tique
	const z = 1 + 6 * lin(frame, TIQUE - 8, TIQUE + 16);
	const rubOn = frame >= FROTTES - 22 && frame < TIQUE - 4;
	const rubX = 500 + 70 * Math.sin((frame - FROTTES) / 3);
	return (
		<AbsoluteFill>
			{skinIn < 1 ? (
				<AbsoluteFill style={{transform: `translate(${(540 - LAND.x) * dive}px, ${(960 - LAND.y) * dive}px) scale(${zf})`, transformOrigin: `${LAND.x}px ${LAND.y}px`}}>
					<ForestBg ground={MAN.ground} branch={BRANCH} drift={walk} />
					<div style={{position: 'absolute', left: manX, top: MAN_TOP}}>
						<Walker width={MAN.W} pose="walk" phase={phase} hair="man" shirt={LPI.pink} tee jeans />
					</div>
					{fall > 0 ? (
						<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{fall < 1 ? <line x1={tx} y1={ty - 70 * fall} x2={tx} y2={ty - 8} stroke={alpha(N, 0.25)} strokeWidth={5} strokeLinecap="round" strokeDasharray="8 8" /> : null}
							<g transform={`translate(${tx} ${ty}) scale(2.2)`}>
								{[-1, 1].map((sd) => [0, 1, 2, 3].map((i) => <path key={`${sd}${i}`} d={`M0 0 l${sd * 7} ${-4 + i * 3}`} stroke={N} strokeWidth={1.5} />))}
								<ellipse rx={4.5} ry={5.5} fill={N} />
							</g>
						</svg>
					) : null}
					<Question at={QUOI - 2} x={LAND.x + 90} y={LAND.y - 120} />
				</AbsoluteFill>
			) : null}
			{skinIn > 0 ? (
				<AbsoluteFill style={{opacity: skinIn}}>
					<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 960px'}}>
						<Skin cx={540} cy={960} red={fadeIn(frame, TIQUE, 10)}>
							<TickG x={500} y={500} walk={frame > TIQUE ? 0.7 : 0} buried={1} fed={0.15} />
							{rubOn ? (
								<g opacity={fadeIn(frame, FROTTES - 22, 5) * (1 - fadeIn(frame, TIQUE - 10, 5))}>
									<Presser x={rubX} y={530} press={0.5 + 0.5 * Math.sin((frame - FROTTES) / 1.5)} rot={-14} />
								</g>
							) : null}
						</Skin>
					</AbsoluteFill>
					{frame >= POINT - 2 && frame < FROTTES - 22 ? (
						<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
							<circle cx={540} cy={960} r={60 + 8 * Math.sin(frame / 3)} fill="none" stroke={LPI.pink} strokeWidth={7} strokeDasharray="16 12" opacity={fadeIn(frame, POINT - 2, 6)} />
						</svg>
					) : null}
				</AbsoluteFill>
			) : null}
			<Flash at={TIQUE} max={0.25} />
			<Sfx name="stairs" at={2} volume={0.12} dur={QUELQUE} />
			<Sfx name="whoosh" at={QUELQUE} volume={0.05} />
			<Sfx name="tap" at={BRAS} volume={0.08} dur={4} />
			<Sfx name="pop" at={QUOI - 2} volume={0.08} />
			<Sfx name="whoosh" at={QUOI - 4} volume={0.08} />
			<Sfx name="pop" at={POINT - 2} volume={0.07} />
			<Sfx name="whoosh" at={TIQUE - 8} volume={0.08} />
			<Sfx name="impact" at={TIQUE + 2} volume={0.1} />
		</AbsoluteFill>
	);
};

const Question: React.FC<{at: number; x: number; y: number}> = ({at: t0, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * (1 + 0.06 * Math.sin(frame / 4))})`}}>
			<div style={{width: 120, height: 120, borderRadius: 60, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: N}}>?</div>
		</div>
	);
};

/* ═══════════════════════════════ L'IDÉE REÇUE : ÉTHER, ALCOOL, HUILE ═══════════════════════════════ */
const Tile: React.FC<{at: number; x: number; cross: number; label: string; children: React.ReactNode}> = ({at: t0, x, cross, label, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x - 150, top: 320, width: 300, height: 330, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 44, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
				<div style={{height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: label.length > 12 ? 30 : 38, color: N, textAlign: 'center', lineHeight: 1.05}}>{label}</div>
			</div>
			<Cross at={cross} size={260} />
		</div>
	);
};

// peau = blanc cassé teinté de rose (mélange des couleurs de la marque)
const SKIN_C = '#F4E0EA';
/** Pictogramme « gratter » : un doigt, l'ongle qui gratte la tique (traits de grattage). */
const ScratchIcon: React.FC = () => {
	const frame = useCurrentFrame();
	const w = Math.sin(frame / 2.2) * 10;
	return (
		<svg width={210} height={210} viewBox="0 0 210 210" style={{overflow: 'visible'}}>
			<rect x={10} y={150} width={190} height={50} rx={18} fill={SKIN_C} stroke={N} strokeWidth={4} />
			<g transform="translate(105 150) scale(2.6)"><TickG x={0} y={-2} s={1} buried={1} fed={0.3} /></g>
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M${60 + i * 26} 166 l22 -18`} stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" />
			))}
			<g transform={`translate(${w} 0) rotate(-35 120 120)`}>
				<rect x={92} y={10} width={64} height={150} rx={32} fill={SKIN_C} stroke={N} strokeWidth={4} />
				<rect x={102} y={112} width={44} height={40} rx={16} fill={LPI.paper} stroke={alpha(N, 0.7)} strokeWidth={3} />
			</g>
		</svg>
	);
};
/** Pictogramme « avec les doigts » : le pouce et l'index qui pincent et écrasent la tique. */
const PinchIcon: React.FC = () => {
	const frame = useCurrentFrame();
	const p = 0.5 + 0.5 * Math.sin(frame / 4);
	return (
		<svg width={210} height={210} viewBox="0 0 210 210" style={{overflow: 'visible'}}>
			<rect x={10} y={160} width={190} height={40} rx={16} fill={SKIN_C} stroke={N} strokeWidth={4} />
			<g transform="translate(105 158) scale(2.6)"><TickG x={0} y={-2} s={1} buried={1} fed={0.3} /></g>
			<g transform={`translate(${-8 * p} 0) rotate(28 60 150)`}>
				<rect x={36} y={30} width={56} height={130} rx={28} fill={SKIN_C} stroke={N} strokeWidth={4} />
				<rect x={44} y={128} width={38} height={26} rx={12} fill={LPI.paper} stroke={alpha(N, 0.7)} strokeWidth={3} />
			</g>
			<g transform={`translate(${8 * p} 0) rotate(-28 150 150)`}>
				<rect x={118} y={30} width={56} height={130} rx={28} fill={SKIN_C} stroke={N} strokeWidth={4} />
				<rect x={126} y={128} width={38} height={26} rx={12} fill={LPI.paper} stroke={alpha(N, 0.7)} strokeWidth={3} />
			</g>
		</svg>
	);
};

export const Idees: React.FC = () => {
	const frame = useCurrentFrame();
	const ETHER = at('idees', "l'alcool,");
	const ALCOOL = at('idees', 'gratter,');
	const HUILE = at('idees', 'doigts');
	const SURTOUT = at('idees', 'surtout');
	const PAS = at('idees', 'pas !');
	const RECR = at('idees', 'recracher');
	const MICROBES = at('idees', 'microbes');
	const spread = lin(frame, RECR, MICROBES + 10);
	const TX = 540;
	const TY = 1240;
	return (
		<AbsoluteFill>
			<Skin cx={TX} cy={TY} red={0.6 + 0.4 * spread}>
				<TickG x={500} y={500} s={6} buried={1} fed={0.3} walk={0.25} />
			</Skin>
			<Camera punches={[ETHER + 1, ALCOOL + 1, HUILE + 1, PAS + 1]} shakes={[PAS + 1]} strength={0.04}>
				<Big from={SURTOUT - 2} text={'Surtout *pas* !'} size={116} y={130} center />
				<Tile at={ETHER - 2} x={195} cross={PAS - 2} label="l'alcool">
					<LabelBottle label="ALCOOL" tone={LPI.blue} size={120} />
				</Tile>
				<Tile at={ALCOOL - 2} x={540} cross={PAS} label="la gratter">
					<ScratchIcon />
				</Tile>
				<Tile at={HUILE - 2} x={885} cross={PAS + 2} label="avec les doigts">
					<PinchIcon />
				</Tile>
				{/* elle recrache… des microbes qui partent dans la peau */}
				{spread > 0
					? Array.from({length: 9}, (_, i) => {
							const a = (i / 9) * Math.PI * 2 + 0.3;
							const d = 60 + 250 * spread * (0.7 + 0.3 * ((i * 7) % 3) / 2);
							return (
								<div key={i} style={{position: 'absolute', left: TX + Math.cos(a) * d - 26, top: TY + Math.sin(a) * d * 0.8 - 26, opacity: cl01(spread * 3 - i * 0.08), transform: `scale(${0.6 + 0.5 * spread})`}}>
									<Microbe size={52} tone={LPI.pink} seed={i} />
								</div>
							);
						})
					: null}
				<PointTag at={MICROBES - 2} x={540} y={1640} px={TX + 200} py={TY + 60} size={44} tone={LPI.pink}>
					des microbes dans la peau
				</PointTag>
			</Camera>
			<Flash at={PAS} max={0.3} />
			{[ETHER - 2, ALCOOL - 2, HUILE - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="stamp" at={PAS} volume={0.12} />
			<Sfx name="buzz" at={RECR + 4} volume={0.05} dur={14} />
		</AbsoluteFill>
	);
};
const cl01 = (v: number) => Math.min(1, Math.max(0, v));

/** Hauteur de la tête de la tique (rostre) dans le repère de la peau, pour une tique `s={6}` centrée en (500, 500). */
const HEAD_Y = 500 - 17 * 6;

/* ═══════════════════════════════ LE BON GESTE : LE TIRE-TIQUE ═══════════════════════════════ */
/**
 * Vue de profil, au ras de la peau (carte 960 × 400) : le crochet glisse à plat sur la peau, PASSE SOUS la tique, et le
 * rostre (planté dans la peau) entre dans le cran. `slide` 0 → 1 ; `jam` : petit sursaut quand elle se coince ; `ok` 0 → 1 :
 * cercle « coincée » autour du rostre.
 */
const ProfileCut: React.FC<{slide: number; jam: number; ok: number}> = ({slide, jam, ok}) => {
	const frame = useCurrentFrame();
	const SK = 250;
	const tip = interpolate(slide, [0, 1], [-60, 660]);
	const rx = 604;
	return (
		<svg width={960} height={400} viewBox="0 0 960 400" style={{display: 'block'}}>
			<defs>
				<linearGradient id="pcSkin" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={SKIN_C} />
					<stop offset="1" stopColor={alpha(LPI.pink, 0.55)} />
				</linearGradient>
				<radialGradient id="pcBody" cx="0.4" cy="0.3" r="0.8">
					<stop offset="0" stopColor={alpha(LPI.blue, 0.9)} />
					<stop offset="1" stopColor={N} />
				</radialGradient>
				<linearGradient id="pcTool" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="1" stopColor={LPI.sky} />
				</linearGradient>
			</defs>
			<rect width={960} height={400} fill={LPI.paper} />
			<rect y={SK} width={960} height={400 - SK} fill="url(#pcSkin)" />
			<line x1={0} y1={SK} x2={960} y2={SK} stroke={alpha(N, 0.6)} strokeWidth={4} />
			<line x1={0} y1={SK + 36} x2={960} y2={SK + 36} stroke={alpha(N, 0.15)} strokeWidth={3} strokeDasharray="14 10" />
			{[90, 170, 790, 870].map((x, i) => (
				<path key={i} d={`M${x} ${SK} q${10 + i * 2} -40 ${30} -70`} fill="none" stroke={alpha(N, 0.45)} strokeWidth={3} strokeLinecap="round" />
			))}
			{/* le crochet, à plat sur la peau : il passe SOUS le corps de la tique */}
			<g>
				<path d={`M${tip - 1300} ${SK - 42} L${tip - 40} ${SK - 40} Q${tip} ${SK - 36} ${tip + 6} ${SK - 4} L${tip - 1300} ${SK - 2} Z`} fill="url(#pcTool)" stroke={N} strokeWidth={5} strokeLinejoin="round" />
				<line x1={tip - 1300} y1={SK - 30} x2={tip - 70} y2={SK - 28} stroke={alpha(LPI.paper, 0.95)} strokeWidth={6} strokeLinecap="round" />
			</g>
			<g transform={`translate(${jam} 0)`}>
				{/* rostre planté dans la peau : il traverse le cran du crochet */}
				<path d={`M${rx - 12} ${SK - 44} L${rx + 12} ${SK - 44} L${rx + 10} ${SK + 30} L${rx} ${SK + 52} L${rx - 8} ${SK + 30} Z`} fill={mix(N, LPI.blue, 0.25)} stroke={N} strokeWidth={4} strokeLinejoin="round" />
				{[0, 1, 2].map((i) => (
					<path key={i} d={`M${rx - 8} ${SK + 4 + i * 14} l-8 -6 M${rx + 8} ${SK + 4 + i * 14} l8 -6`} stroke={N} strokeWidth={3} strokeLinecap="round" />
				))}
				{/* pattes (devant le crochet, posées sur la peau) */}
				{[330, 400, 470, 530].map((x, i) => (
					<path key={i} d={`M${x} ${SK - 70} L${x - 34 + i * 8} ${SK - 44} L${x - 50 + i * 12} ${SK - 2}`} fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
				))}
				{/* corps, au-dessus du crochet */}
				<ellipse cx={420} cy={SK - 118} rx={170} ry={70} transform={`rotate(8 420 ${SK - 118})`} fill="url(#pcBody)" stroke={N} strokeWidth={5} />
				<ellipse cx={505} cy={SK - 142} rx={78} ry={32} transform={`rotate(12 505 ${SK - 142})`} fill={alpha(N, 0.55)} />
				<ellipse cx={360} cy={SK - 156} rx={60} ry={16} fill={alpha(LPI.paper, 0.3)} />
				<path d={`M${562} ${SK - 104} Q${604} ${SK - 94} ${rx + 10} ${SK - 44} L${rx - 14} ${SK - 44} Q${574} ${SK - 70} ${548} ${SK - 80} Z`} fill={mix(N, LPI.blue, 0.2)} stroke={N} strokeWidth={4} strokeLinejoin="round" />
			</g>
			{ok > 0 ? (
				<g opacity={ok}>
					<circle cx={rx + jam} cy={SK - 22} r={60 + 5 * Math.sin(frame / 5)} fill="none" stroke={LPI.pink} strokeWidth={8} strokeDasharray="16 10" />
				</g>
			) : null}
			{/* flèche du geste */}
			{slide > 0 && slide < 1 ? <path d={`M${Math.max(40, tip - 260)} ${SK + 90} l140 0 m-26 -18 l26 18 l-26 18`} fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} /> : null}
		</svg>
	);
};

const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

export const Methode: React.FC = () => {
	const frame = useCurrentFrame();
	const TIRE = at('methode', 'tire-tique.');
	const GLISSE = at('methode', 'glisse');
	const CRAN = at('methode', 'cran');
	const PEAU = at('methode', 'peau,');
	const COINCE = at('methode', 'coince');
	const TOURNE = at('methode', 'tourne');
	const COUP = at('methode', 'coup…');
	const DECROCHE = at('methode', 'décroche.');
	const VERIFIE = at('methode', 'vérifie');
	const ENTIERE = at('methode', 'entière,');
	const TETE = at('methode', 'tête.');
	const slide = lin(frame, GLISSE, PEAU);
	const spin = 360 * lin(frame, TOURNE, COUP + 14);
	const off = lin(frame, DECROCHE - 2, DECROCHE + 14);
	const hookIn = lin(frame, TIRE - 4, TIRE + 10);
	// le crochet arrive par le bas (côté du corps) et passe SOUS la tique ; le fond du V finit contre la tête
	const tipY = interpolate(slide, [0, 1], [1000, 422]);
	const jam = frame >= COINCE && frame < COINCE + 12 ? Math.sin((frame - COINCE) * 1.6) * 5 * (1 - (frame - COINCE) / 12) : 0;
	const cranO = fadeIn(frame, CRAN - 2, 6) * (1 - lin(frame, TOURNE - 6, TOURNE + 4));
	// carte « vu de profil »
	const card = fadeIn(frame, GLISSE + 2, 8) * (1 - lin(frame, TOURNE - 2, TOURNE + 8));
	const ok = fadeIn(frame, COINCE + 2, 6);
	const lens = popAt(frame, VERIFIE - 2);
	const CY = 1120;
	const sx = (x: number) => 540 - 800 + 1.6 * x;
	const sy = (y: number) => CY - 800 + 1.6 * y;
	const titles: [number, number, string][] = [
		[TIRE - 4, GLISSE - 4, 'Un *tire-tique*'],
		[GLISSE - 4, COINCE - 4, 'Le *cran* dessous'],
		[COINCE - 4, TOURNE - 4, 'Coincée *dedans*'],
		[TOURNE - 4, VERIFIE - 4, 'Tourne *doucement*'],
		[VERIFIE - 4, TETE - 4, 'Elle est *entière*\u00a0?'],
		[TETE - 4, 1e9, 'Avec sa *tête*\u00a0!'],
	];
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={CY} red={0.7} tint={0}>
				<g transform={`translate(${140 * off + jam} ${-240 * off}) rotate(${spin} 500 410)`}>
					<TickHookG x={500} y={tipY} ang={90} scale={1.5} opacity={hookIn} />
					<TickG x={500} y={500} s={6} buried={1 - off} fed={0.3} walk={off > 0 ? 0.5 : 0.15} ang={0} />
				</g>
				{cranO > 0 ? (
					<g opacity={cranO}>
						<circle cx={500 + jam} cy={tipY - 56} r={70 + 6 * Math.sin(frame / 5)} fill="none" stroke={LPI.pink} strokeWidth={9} strokeDasharray="18 12" />
						<circle cx={500 + jam} cy={tipY - 56} r={82 + 6 * Math.sin(frame / 5)} fill="none" stroke={alpha(N, 0.5)} strokeWidth={3} />
					</g>
				) : null}
				{off > 0.3 ? <circle cx={500} cy={410} r={14} fill={alpha(LPI.pink, 0.9)} stroke={alpha(N, 0.4)} strokeWidth={2} /> : null}
				{lens > 0.01 ? (
					<g transform={`translate(640 250) scale(${lens})`}>
						<circle r={175} fill="none" stroke={N} strokeWidth={14} />
						<circle r={163} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={6} />
						<path d="M124 124 L230 230" stroke={N} strokeWidth={30} strokeLinecap="round" />
					</g>
				) : null}
			</Skin>
			{card > 0.01 ? (
				<div style={{position: 'absolute', left: 60, top: 290, width: 960, height: 400, borderRadius: 40, overflow: 'hidden', border: `6px solid ${N}`, boxShadow: SHADOW, opacity: card, transform: `scale(${0.92 + 0.08 * card})`}}>
					<ProfileCut slide={slide} jam={jam} ok={ok} />
					<div style={{position: 'absolute', left: 22, top: 18, padding: '6px 20px', borderRadius: 999, background: LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>vu au ras de la peau</div>
					{ok > 0 ? (
						<div style={{position: 'absolute', right: 22, top: 18, padding: '6px 20px', borderRadius: 999, background: LPI.pink, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, transform: `scale(${popAt(frame, COINCE + 2)})`}}>dans le cran ✓</div>
					) : null}
				</div>
			) : null}
			{titles.map(([a, b, t], i) => (
				<Big key={t} from={i === 0 ? a : a + 6} to={b} text={t} size={100} y={150} center />
			))}
			<PointTag at={CRAN} to={COINCE - 6} x={250} y={1560} px={sx(468)} py={sy(tipY - 56)} size={46} tone={LPI.sky}>
				le cran
			</PointTag>
			{frame >= COUP - 26 && frame < DECROCHE ? (
				<Note at={COUP - 26} to={DECROCHE - 6} y={1560} size={44} tone={LPI.sky}>
					sans tirer d'un coup
				</Note>
			) : null}
			<PointTag at={ENTIERE - 2} x={250} y={1240} px={sx(640)} py={sy(300)} size={44} tone={LPI.sky}>
				entière ✓
			</PointTag>
			<PointTag at={TETE - 4} x={290} y={470} px={sx(640)} py={sy(160)} size={44} tone={LPI.sky}>
				la tête est là ✓
			</PointTag>
			<Burst at={TETE} x={sx(640)} y={sy(250)} r={260} n={12} />
			<Sfx name="whoosh" at={TIRE - 4} volume={0.07} />
			<Sfx name="tick" at={CRAN} volume={0.08} />
			<Sfx name="tick" at={COINCE} volume={0.1} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="tick" at={TOURNE + i * 12} volume={0.06} />
			))}
			<Sfx name="pop" at={DECROCHE} volume={0.1} />
			<Sfx name="whoosh" at={VERIFIE - 2} volume={0.05} />
			<Sfx name="ding" at={ENTIERE} volume={0.06} />
			<Sfx name="ding" at={TETE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ APRÈS : DÉSINFECTER, SE LAVER LES MAINS, NOTER LA DATE ═══════════════════════════════ */
export const Apres: React.FC = () => {
	const frame = useCurrentFrame();
	const DESINF = at('apres', 'désinfecte');
	const LAVE = at('apres', 'lave-toi');
	const NOTE = at('apres', 'note');
	const DATE = at('apres', 'date');
	return (
		<AbsoluteFill>
			<Bg />
			<div style={{position: 'absolute', left: 540 - 210, top: 190}}>
				<SkinMedallion size={420}>
					<SkinG red={0.7 * (1 - 0.5 * fadeIn(frame, DESINF + 6, 20))} tint={fadeIn(frame, DESINF + 4, 10)}>
						<circle cx={500} cy={492} r={12} fill={alpha(LPI.pink, 0.95)} stroke={alpha(N, 0.4)} strokeWidth={2} />
					</SkinG>
				</SkinMedallion>
			</div>
			<RowCard at={DESINF - 4} y={720} h={190} art={170} badge={1} title="Désinfecte la piqûre" check={LAVE - 2} size={50}>
				<AntisepticBottle size={110} />
			</RowCard>
			<RowCard at={LAVE - 3} y={930} h={190} art={170} badge={2} title="Lave-toi les mains" check={NOTE - 2} from="left" size={50}>
				<Faucet width={160} flow={1} soap={1} />
			</RowCard>
			<RowCard at={NOTE - 3} y={1140} h={190} art={170} badge={3} title="Note la date" sub="dans ton téléphone" subAt={DATE + 4} check={DATE + 20} size={50}>
				<DayChip text="J0" size={130} />
			</RowCard>
			{[DESINF - 4, LAVE - 3, NOTE - 3].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={DATE + 20} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SURVEILLER UN MOIS : LA PLAQUE ROUGE ═══════════════════════════════ */
export const Surveiller: React.FC = () => {
	const frame = useCurrentFrame();
	const MOIS = at('surveiller', 'mois,');
	const PLAQUE = at('surveiller', 'plaque');
	const AGRANDIT = at('surveiller', "s'agrandit");
	const FIEVRE = at('surveiller', 'fièvre,');
	const CONSULTE = at('surveiller', 'consulte');
	const LYME = at('surveiller', 'lyme.');
	const day = Math.round(interpolate(frame, [MOIS, AGRANDIT + 20], [1, 12], clamp));
	const ring = lin(frame, PLAQUE, AGRANDIT + 24);
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={1080} W={1500} ring={ring}>
				<circle cx={500} cy={492} r={10} fill={alpha(LPI.pink, 0.9)} />
			</Skin>
			<Big from={-2} text="Pendant *1* mois" size={110} y={140} center />
			<Fly at={MOIS - 2} x={190} y={480}>
				<div style={{transform: `scale(${frame % 30 < 2 ? 1.06 : 1})`}}>
					<DayChip text={`J+${day}`} size={170} />
				</div>
			</Fly>
			<PointTag at={AGRANDIT - 2} to={FIEVRE - 4} x={720} y={460} px={540 + 0.75 * 300} py={1080 - 0.75 * 300} size={42} tone={LPI.pink}>
				plaque rouge qui grandit
			</PointTag>
			{frame >= FIEVRE - 4 ? (
				<Fly at={FIEVRE - 4} x={800} y={470}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 28px 14px 14px', borderRadius: 999, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<FeverIcon size={84} />
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>fièvre</span>
					</div>
				</Fly>
			) : null}
			<Note at={CONSULTE - 2} to={LYME - 14} y={1520} size={48} tone={LPI.pink}>
				→ consulte un médecin
			</Note>
			<Note at={LYME - 4} y={1520} size={48} tone={LPI.sky}>
				maladie de Lyme ?
			</Note>
			<Sfx name="pop" at={MOIS - 2} volume={0.08} />
			<Sfx name="whoosh" at={PLAQUE} volume={0.07} />
			<Sfx name="pop" at={FIEVRE - 4} volume={0.08} />
			<Sfx name="ding" at={CONSULTE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : LA PROCHAINE BALADE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const MANCHES = at('fin', 'manches');
	const PANTALON = at('fin', 'pantalon…');
	const INSPECTE = at('fin', "s'inspecte");
	const RENTRANT = at('fin', 'rentrant !');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={-2} text="À la prochaine *balade*" size={100} y={160} center />
			<RowCard at={MANCHES - 3} y={520} h={220} art={190} badge="✓" badgeTone={LPI.sky} title="Manches longues" size={54}>
				<WalkIcon kind="sleeve" size={170} />
			</RowCard>
			<RowCard at={PANTALON - 3} y={770} h={220} art={190} badge="✓" badgeTone={LPI.sky} title="Pantalon" from="left" size={54}>
				<WalkIcon kind="pants" size={170} />
			</RowCard>
			<RowCard at={INSPECTE - 3} y={1020} h={220} art={190} badge="✓" badgeTone={LPI.pink} title="On s'inspecte" sub="en rentrant" subAt={RENTRANT - 4} size={54}>
				<WalkIcon kind="check" size={170} />
			</RowCard>
			<Burst at={RENTRANT + 4} x={540} y={1130} r={300} n={14} />
			{[MANCHES - 3, PANTALON - 3, INSPECTE - 3].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={RENTRANT + 4} volume={0.1} />
		</AbsoluteFill>
	);
};
