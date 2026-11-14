// Scènes de « Le cancer du poumon » (n° 51, voix gratuite d'abord). Accroche sans texte, réaliste : le soir sur le
// balcon, ton père allume sa cigarette, tousse dans son mouchoir… et voit un peu de sang ; « ce n'est rien… » ; la
// caméra plonge vers ses poumons (loupe sur le schéma). Puis le trajet de l'air (schéma fourni par le propriétaire,
// nettoyé de ses annotations : trachée, bronches, bronchioles, alvéoles, diaphragme), le cancer (sain / cancer, la
// tumeur prend la place de l'air, 1re cause de mort par cancer), le tabac (8 cas sur 10, tabagisme passif), les signes,
// les examens (radio, scanner, fibroscopie + biopsie), les risques, les traitements, chute « arrêter de fumer, à tout
// âge ». Storyboard : docs/lpi/storyboard-cancer-poumon.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {BreathAlertIcon} from '../../brand/bee';
import {ChemoIcon} from '../../brand/breast';
import {ScanMonitor} from '../../brand/devices';
import {CigaretteIcon, CoughIcon, PainIcon, RibbonIcon, ScalpelIcon, SmogIcon, SputumIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Balcony, DAD, DadBalcony, HelmetIcon, ImmunoIcon, NoSmokeIcon, PassiveSmokeIcon, RadonIcon, TargetIcon, WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {RayIcon} from '../../brand/prostate';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Petite pastille de texte (sans coche), centrée sur (x, y). */
const Pill: React.FC<{at: number; x: number; y: number; tone?: string; size?: number; children: React.ReactNode}> = ({at: t0, x, y, tone = LPI.sky, size = 44, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, padding: '12px 28px', borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12}}>
			{children}
		</div>
	);
};

/* ═══════════════════════════════ SCHÉMA FOURNI (NETTOYÉ) ═══════════════════════════════ */
// Schéma « Les poumons et le cancer du poumon » fourni par le propriétaire (1536 × 1024), sans ses annotations
// (demandé) : deux calques dans le même repère (les poumons / poumon et alvéoles saines ou touchées), jamais déformés.
const IMG = {anat: 'images/poumon/poumon-propre-anatomie.png', focus: 'images/poumon/poumon-propre-focus.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 462, y: 555, s: 1.25},
	focus: {x: 1135, y: 495, s: 1.45},
	trachea: [462, 220],
	bronchL: [398, 482],
	bronchR: [528, 482],
	bronchioles: [[300, 610], [625, 630]],
	alveoli: [278, 808],
	diaphragm: [462, 868],
	lungH: [992, 365],
	lungC: [1296, 365],
	tumor: [1370, 420],
	cBronchus: [1392, 322],
	alvH: [922, 683],
	alvC: [1245, 683],
	alvTumor: [1297, 700],
} as const;
type CamK = {at: number; x: number; y: number; s: number};
const CARD = {left: 40, top: 290, w: 1000, h: 1140};
const camOf = (frame: number, keys: CamK[], dur = 18) => {
	let c = {x: keys[0].x, y: keys[0].y, s: keys[0].s};
	for (const k of keys.slice(1)) {
		const t = interpolate(frame, [k.at, k.at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
		c = {x: c.x + (k.x - c.x) * t, y: c.y + (k.y - c.y) * t, s: c.s + (k.s - c.s) * t};
	}
	return c;
};
type Ring = {from: number; to?: number; x: number; y: number; r: number; ry?: number};
/** Le schéma dans une carte blanche : caméra qui glisse et zoome au mot près, cercles roses qui pulsent, `focus` 0 → 1
 * fondu des poumons vers la comparaison sain / cancer ; `children` : calques dans le repère de l'image. */
const Diagram: React.FC<{keys: CamK[]; rings?: Ring[]; o?: number; focus?: number; children?: React.ReactNode}> = ({keys, rings = [], o = 1, focus = 0, children}) => {
	const frame = useCurrentFrame();
	const c = camOf(frame, keys);
	const tx = CARD.w / 2 - c.x * c.s;
	const ty = CARD.h / 2 - c.y * c.s;
	return (
		<div style={{position: 'absolute', left: CARD.left, top: CARD.top, width: CARD.w, height: CARD.h, borderRadius: 48, overflow: 'hidden', background: '#FFFFFF', boxShadow: `0 18px 50px ${alpha(N, 0.18)}`, opacity: o}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: IMG.w, height: IMG.h, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${c.s})`}}>
				<Img src={staticFile(IMG.anat)} style={{position: 'absolute', width: IMG.w, height: IMG.h, display: 'block', opacity: 1 - focus}} />
				<Img src={staticFile(IMG.focus)} style={{position: 'absolute', width: IMG.w, height: IMG.h, display: 'block', opacity: focus}} />
				<svg width={IMG.w} height={IMG.h} viewBox={`0 0 ${IMG.w} ${IMG.h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
					{children}
					{rings.map((r, i) => {
						const k = fadeIn(frame, r.from, 6) * (r.to === undefined ? 1 : 1 - lin(frame, r.to, r.to + 8));
						if (k <= 0) return null;
						const p = 0.5 + 0.5 * Math.sin((frame - r.from) / 5);
						const sc = 0.8 + 0.2 * popAt(frame, r.from);
						return (
							<g key={i} opacity={k} transform={`translate(${r.x} ${r.y}) scale(${sc})`}>
								<ellipse rx={r.r + 10 + 6 * p} ry={(r.ry ?? r.r) + 10 + 6 * p} fill="none" stroke={alpha(LPI.pink, 0.45)} strokeWidth={14 / c.s} />
								<ellipse rx={r.r} ry={r.ry ?? r.r} fill="none" stroke={LPI.pink} strokeWidth={7 / c.s + 3} strokeDasharray={`${14 / c.s + 6} ${8 / c.s + 4}`} />
							</g>
						);
					})}
				</svg>
			</div>
		</div>
	);
};

/* ── Les dessins du calque « focus » (et les poumons entiers), découpés et posés seuls ── */
const REG = {
	lungH: {x: 852, y: 218, w: 282, h: 290, layer: IMG.focus},
	lungC: {x: 1152, y: 218, w: 288, h: 294, layer: IMG.focus},
	alvH: {x: 826, y: 588, w: 193, h: 190, layer: IMG.focus},
	alvC: {x: 1146, y: 588, w: 198, h: 190, layer: IMG.focus},
	lungs: {x: 130, y: 118, w: 660, h: 880, layer: IMG.anat},
} as const;
/** Repères dans la découpe « lungC » (pixels) : la tumeur, le trajet du fibroscope (de la bronche à la tumeur). */
const TUMOR = [DG.tumor[0] - REG.lungC.x, DG.tumor[1] - REG.lungC.y] as const;
const SCOPE: [number, number][] = [
	[300, 40],
	[262, 86],
	[238, 128],
	[224, 162],
	[TUMOR[0] + 2, TUMOR[1] - 26],
];
/** Un dessin du schéma fourni, à l'échelle uniforme `s` (jamais déformé), centré en (cx, cy) ; `filter` CSS (rendu
 * « imagerie ») ; `children` : calques SVG dans le repère de la découpe. */
const Art: React.FC<{which: keyof typeof REG; cx: number; cy: number; s: number; o?: number; filter?: string; children?: React.ReactNode}> = ({which, cx, cy, s, o = 1, filter, children}) => {
	const r = REG[which];
	return (
		<div style={{position: 'absolute', left: cx - (r.w * s) / 2, top: cy - (r.h * s) / 2, width: r.w, height: r.h, transformOrigin: '0 0', transform: `scale(${s})`, opacity: o}}>
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden', filter}}>
				<Img src={staticFile(r.layer)} style={{position: 'absolute', left: -r.x, top: -r.y, width: IMG.w, height: IMG.h}} />
			</div>
			<svg width={r.w} height={r.h} viewBox={`0 0 ${r.w} ${r.h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				{children}
			</svg>
		</div>
	);
};
const ArtCard: React.FC<{top?: number; h?: number; o?: number}> = ({top = 290, h = 960, o = 1}) => (
	<div style={{position: 'absolute', left: 40, top, width: 1000, height: h, borderRadius: 48, background: '#FFFFFF', boxShadow: `0 18px 50px ${alpha(N, 0.18)}`, opacity: o}} />
);
const PulseRing: React.FC<{x: number; y: number; r: number; from: number; to?: number; sw?: number}> = ({x, y, r, from, to = 1e9, sw = 2.5}) => {
	const frame = useCurrentFrame();
	const k = fadeIn(frame, from, 6) * (1 - lin(frame, to, to + 8));
	if (k <= 0) return null;
	const p = 0.5 + 0.5 * Math.sin((frame - from) / 5);
	return (
		<g opacity={k}>
			<circle cx={x} cy={y} r={r + 4 + 3 * p} fill="none" stroke={alpha(LPI.pink, 0.45)} strokeWidth={sw * 2} />
			<circle cx={x} cy={y} r={r} fill="none" stroke={LPI.pink} strokeWidth={sw} strokeDasharray={`${sw * 3} ${sw * 2}`} />
		</g>
	);
};

/** Point sur une ligne brisée (t 0 → 1). */
const along = (pts: readonly (readonly [number, number])[], t: number): [number, number] => {
	const segs = pts.length - 1;
	const u = Math.max(0, Math.min(0.9999, t)) * segs;
	const i = Math.floor(u);
	const k = u - i;
	return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
};
/** Le trajet de l'air (ou de la fumée) dans les poumons du schéma : de la trachée jusqu'aux alvéoles. */
const AIRWAYS: [number, number][][] = [
	[[462, 130], [462, 420], [398, 482], [330, 570], [290, 690], [278, 800]],
	[[462, 130], [462, 420], [528, 482], [580, 560], [625, 640], [660, 740]],
	[[462, 130], [462, 420], [398, 482], [330, 520], [250, 560]],
	[[462, 130], [462, 420], [528, 482], [610, 500], [690, 520]],
];
/** Particules qui descendent les voies aériennes (repère de l'image) : l'air (bleu) ou la fumée (gris). */
const Flow: React.FC<{from: number; to: number; smoke?: boolean}> = ({from, to, smoke = false}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{AIRWAYS.map((pts, j) =>
				[0, 1, 2, 3].map((i) => {
					const t = (((frame - from) * 0.012 + i / 4 + j * 0.07) % 1 + 1) % 1;
					const [x, y] = along(pts, t);
					return smoke ? (
						<circle key={`${j}-${i}`} cx={x} cy={y} r={9 + 5 * t} fill={alpha('#6B7280', 0.55)} />
					) : (
						<circle key={`${j}-${i}`} cx={x} cy={y} r={8} fill={LPI.sky} stroke={LPI.blue} strokeWidth={3} />
					);
				}),
			)}
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE BALCON ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 250;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ALLUME = at('intro', 'allume');
	const COMME = at('intro', 'comme');
	const TRENTE = at('intro', 'trente');
	const TOUSSE = at('intro', 'tousse');
	const ENCORE = at('intro', 'encore');
	const MOUCHOIR = at('intro', 'mouchoir');
	const SANG = at('intro', 'sang');
	const DIT = at('intro', 'dit');
	const RIEN = at('intro', 'rien');
	const PEUT = at('intro', 'peut-être');
	const MAIS = at('intro', 'mais');
	const SANG2 = at('intro', 'sang', 2);
	const MEDECIN = at('intro', 'médecin');
	// deux bouffées, puis la quinte de toux dans le mouchoir
	const smoke = lin(frame, ALLUME - 6, ALLUME + 6) * (1 - lin(frame, COMME + 6, COMME + 16)) + lin(frame, TRENTE - 6, TRENTE + 4) * (1 - lin(frame, TOUSSE - 12, TOUSSE - 4));
	const puff = Math.max(0, smoke - 0.7) / 0.3;
	const cough = lin(frame, TOUSSE - 6, TOUSSE) * (1 - lin(frame, ENCORE + 14, ENCORE + 22));
	const show = lin(frame, MOUCHOIR - 8, MOUCHOIR + 6);
	const blood = fadeIn(frame, SANG - 6, 6);
	const worry = Math.min(1, lin(frame, SANG - 2, SANG + 6) * (1 - lin(frame, DIT, DIT + 10)) + 0.8 * lin(frame, PEUT, PEUT + 8));
	const shrug = lin(frame, RIEN - 8, RIEN + 4) * (1 - lin(frame, PEUT - 4, PEUT + 4));
	// caméra : vers le mouchoir (le sang), puis on recule ; enfin plongée vers ses poumons
	const tissue = dadPt(DAD.tissueLow);
	const chest = dadPt([300, 560]);
	const c1 = lin(frame, MOUCHOIR - 4, SANG + 2) * (1 - lin(frame, DIT - 6, DIT + 8));
	const c2 = lin(frame, MAIS - 4, SANG2 + 8);
	const s = 1 + 0.6 * c1 + 0.55 * c2;
	const fx = c2 > 0 ? chest.x : tissue.x;
	const fy = c2 > 0 ? chest.y : tissue.y;
	const k = Math.max(c1, c2);
	const tx = interpolate(k, [0, 1], [0, 540 - fx * s]);
	const ty = interpolate(k, [0, 1], [0, 1000 - fy * s]);
	const lens = popAt(frame, SANG2 - 2);
	const head = dadPt(DAD.face);
	return (
		<AbsoluteFill style={{background: '#2C3A68', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Balcony>
					<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
						<DadBalcony width={DAD_W} smoke={smoke} puff={puff} cough={cough} show={show} blood={blood} worry={worry} shrug={shrug} cig={frame < ENCORE + 30} />
					</foreignObject>
				</Balcony>
				{/* loupe sur la poitrine : le poumon du schéma, la tumeur entourée */}
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: chest.x - 170, top: chest.y - 170, width: 340, height: 340, borderRadius: 170, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<Art which="lungC" cx={170} cy={170} s={1.08}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={44} from={SANG2 + 4} sw={5} />
						</Art>
					</div>
				) : null}
			</AbsoluteFill>
			{/* « ce n'est rien… » : bulle de pensée */}
			{frame >= DIT + 2 && frame < MAIS + 4 ? (
				<div style={{position: 'absolute', left: head.x - 560, top: head.y - 330, transform: `scale(${popAt(frame, DIT + 2)})`, opacity: 1 - lin(frame, MAIS - 4, MAIS + 4)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>
							Ce n'est rien…{frame >= PEUT ? <span style={{color: LPI.pink}}> ?</span> : null}
						</span>
					</Bubble>
				</div>
			) : null}
			<Sfx name="lighter" at={ALLUME - 8} volume={0.3} />
			<Sfx name="smoke" at={ALLUME + 6} volume={0.25} />
			<Sfx name="smoke" at={TRENTE + 4} volume={0.2} />
			<Sfx name="cough" at={TOUSSE - 4} volume={0.45} />
			<Sfx name="pop" at={SANG - 4} volume={0.07} />
			<Sfx name="whoosh" at={MAIS} volume={0.08} />
			<Sfx name="ding" at={SANG2 + 4} volume={0.07} />
			<Sfx name="pop" at={MEDECIN} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE TRAJET DE L'AIR ═══════════════════════════════ */
export const Poumons: React.FC = () => {
	const frame = useCurrentFrame();
	const TRACHEE = at('poumons', 'trachée');
	const BRONCHES = at('poumons', 'bronches');
	const BRONCHIOLES = at('poumons', 'bronchioles');
	const PETITES = at('poumons', 'petites');
	const ALVEOLES = at('poumons', 'alvéoles');
	const SACS = at('poumons', 'sacs');
	const OXYGENE = at('poumons', "l'oxygène");
	const DIAPH = at('poumons', 'diaphragme');
	const MUSCLE = at('poumons', 'muscle');
	const RESPIRER = at('poumons', 'respirer');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: TRACHEE - 4, x: 462, y: 300, s: 1.9},
		{at: BRONCHES - 4, x: 462, y: 480, s: 1.9},
		{at: BRONCHIOLES - 4, x: 400, y: 600, s: 1.5},
		{at: ALVEOLES - 6, x: 290, y: 790, s: 2.6},
		{at: DIAPH - 6, x: 462, y: 760, s: 1.35},
	];
	// le diaphragme qui monte et descend (flèches), sur « respirer »
	const breath = Math.sin((frame - RESPIRER) / 9);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={TRACHEE - 8} text={"Le trajet de *l'air*"} size={100} y={150} center />
			<Big from={TRACHEE - 2} to={BRONCHES - 8} text={'La *trachée*'} size={110} y={150} center />
			<Big from={BRONCHES - 2} to={BRONCHIOLES - 8} text={'Les *bronches*'} size={110} y={150} center />
			<Big from={BRONCHIOLES - 2} to={ALVEOLES - 8} text={'Les *bronchioles*'} size={104} y={150} center />
			<Big from={ALVEOLES - 2} to={DIAPH - 8} text={'Les *alvéoles*'} size={110} y={150} center />
			<Big from={DIAPH - 2} text={'Le *diaphragme*'} size={104} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: TRACHEE, to: BRONCHES - 6, x: DG.trachea[0], y: DG.trachea[1], r: 48, ry: 120},
					{from: BRONCHES, to: BRONCHIOLES - 6, x: DG.bronchL[0], y: DG.bronchL[1], r: 44},
					{from: BRONCHES + 4, to: BRONCHIOLES - 6, x: DG.bronchR[0], y: DG.bronchR[1], r: 44},
					...DG.bronchioles.map(([x, y]) => ({from: BRONCHIOLES, to: ALVEOLES - 8, x, y, r: 80, ry: 100})),
					{from: ALVEOLES, to: DIAPH - 8, x: DG.alveoli[0], y: DG.alveoli[1], r: 74},
					{from: DIAPH, x: DG.diaphragm[0], y: DG.diaphragm[1], r: 290, ry: 80},
				]}
			>
				<Flow from={4} to={DIAPH - 8} />
				{frame >= OXYGENE - 4 && frame < DIAPH ? (
					<g opacity={fadeIn(frame, OXYGENE - 4, 6) * (1 - lin(frame, DIAPH - 8, DIAPH))}>
						{[0, 1, 2, 3, 4].map((i) => {
							const t = (((frame - OXYGENE) * 0.03 + i / 5) % 1 + 1) % 1;
							return <circle key={i} cx={248 + i * 14} cy={790 + t * 70} r={6} fill={LPI.pink} stroke={N} strokeWidth={2} opacity={1 - t * 0.6} />;
						})}
					</g>
				) : null}
				{frame >= RESPIRER - 6 ? (
					<g opacity={fadeIn(frame, RESPIRER - 6, 6)}>
						{[300, 462, 624].map((x) => (
							<path key={x} d={`M${x} ${950 + 12 * breath} l-16 -18 m16 18 l16 -18 M${x} ${950 + 12 * breath} L${x} ${990 + 12 * breath}`} fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
						))}
					</g>
				) : null}
			</Diagram>
			<Note at={TRACHEE + 4} to={BRONCHES - 8} y={1510} size={46} tone={LPI.paper}>
				le tuyau de l'air
			</Note>
			<Note at={BRONCHES + 4} to={BRONCHIOLES - 8} y={1510} size={46} tone={LPI.paper}>
				une pour chaque poumon
			</Note>
			<Note at={PETITES - 4} to={ALVEOLES - 8} y={1510} size={46} tone={LPI.sky}>
				de plus en plus petites
			</Note>
			<Note at={SACS - 4} to={OXYGENE - 6} y={1510} size={46} tone={LPI.sky}>
				de minuscules sacs d'air
			</Note>
			<Note at={OXYGENE} to={DIAPH - 8} y={1510} size={46} tone={LPI.pink}>
				l'oxygène passe dans le sang
			</Note>
			<Note at={MUSCLE - 2} y={1510} size={46} tone={LPI.paper}>
				le muscle de la respiration
			</Note>
			<Sfx name="whoosh" at={TRACHEE - 4} volume={0.05} />
			<Sfx name="whoosh" at={BRONCHES - 4} volume={0.05} />
			<Sfx name="whoosh" at={BRONCHIOLES - 4} volume={0.05} />
			<Sfx name="pop" at={ALVEOLES} volume={0.07} />
			<Sfx name="ding" at={OXYGENE} volume={0.06} />
			<Sfx name="whoosh" at={DIAPH - 6} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELL = at('cancer', 'cellules');
	const MULTI = at('cancer', 'multiplient');
	const BRONCHE = at('cancer', 'bronche');
	const TUMEUR = at('cancer', 'tumeur');
	const PLACE = at('cancer', 'place');
	const FRANCE = at('cancer', 'france');
	const TUE = at('cancer', 'tue');
	const diagO = fadeIn(frame, 0, 8) * (1 - lin(frame, FRANCE - 8, FRANCE));
	const numO = fadeIn(frame, FRANCE, 6);
	const keys: CamK[] = [
		{at: 0, x: 462, y: 500, s: 1.7},
		{at: CELL - 8, ...DG.focus},
		{at: MULTI, x: DG.lungC[0] + 20, y: DG.lungC[1] + 20, s: 2.6},
		{at: TUMEUR - 4, x: 1270, y: 690, s: 3.0},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELL - 10} text={'Le *cancer*'} size={110} y={150} center />
			<Big from={CELL - 6} to={MULTI - 6} text={'Sain… ou *cancer* ?'} size={96} y={150} center />
			<Big from={MULTI} to={TUMEUR - 6} text={'Dans une *bronche*'} size={100} y={150} center />
			<Big from={TUMEUR - 2} to={FRANCE - 8} text={'Une *tumeur*'} size={110} y={150} center />
			{diagO > 0.01 ? (
				<Diagram
					o={diagO}
					focus={fadeIn(frame, CELL - 6, 14)}
					keys={keys}
					rings={[
						{from: 6, to: CELL - 10, x: DG.bronchL[0], y: DG.bronchL[1], r: 44},
						{from: 6, to: CELL - 10, x: DG.bronchR[0], y: DG.bronchR[1], r: 44},
						{from: CELL - 2, to: MULTI - 4, x: DG.lungH[0], y: DG.lungH[1], r: 160, ry: 160},
						{from: MULTI + 6, to: TUMEUR - 6, x: DG.tumor[0], y: DG.tumor[1], r: 48},
						{from: BRONCHE - 4, to: TUMEUR - 6, x: DG.cBronchus[0], y: DG.cBronchus[1], r: 30},
						{from: TUMEUR + 2, x: DG.alvTumor[0], y: DG.alvTumor[1], r: 50},
					]}
				/>
			) : null}
			<Note at={MULTI + 8} to={BRONCHE - 6} y={1510} size={42} tone={LPI.pink}>
				des cellules qui se multiplient
			</Note>
			<Note at={PLACE - 4} to={FRANCE - 8} y={1510} size={44} tone={LPI.paper}>
				elle prend la place de l'air
			</Note>
			{numO > 0 ? (
				<AbsoluteFill style={{opacity: numO}}>
					<Big from={FRANCE} text={'En *France*…'} size={110} y={150} center />
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 380, color: LPI.blue, lineHeight: 1, transform: `scale(${popAt(frame, TUE - 6)})`, opacity: fadeIn(frame, TUE - 6, 4)}}>
						1<span style={{fontSize: 160}}>re</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N, opacity: fadeIn(frame, TUE, 6)}}>
						cause de mort par cancer
					</div>
					<div style={{position: 'absolute', left: 440, top: 940, transform: `scale(${popAt(frame, TUE + 4)})`}}>
						<RibbonIcon size={200} color={N} />
					</div>
				</AbsoluteFill>
			) : null}
			<Burst at={TUE} x={540} y={560} r={260} n={12} />
			<Sfx name="whoosh" at={CELL - 8} volume={0.06} />
			<Sfx name="whoosh" at={MULTI} volume={0.06} />
			<Sfx name="pop" at={MULTI + 6} volume={0.07} />
			<Sfx name="whoosh" at={TUMEUR - 4} volume={0.06} />
			<Sfx name="impact" at={TUE - 6} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE TABAC ═══════════════════════════════ */
export const Tabac: React.FC = () => {
	const frame = useCurrentFrame();
	const HUIT = at('tabac', 'huit');
	const COUPABLE = at('tabac', 'coupable');
	const TABAC = at('tabac', 'tabac');
	const BOUFFEE = at('tabac', 'bouffée');
	const TOXIQUES = at('tabac', 'toxiques');
	const FOND = at('tabac', 'fond');
	const FUMEE = at('tabac', 'fumée');
	const AUTRES = at('tabac', 'autres');
	const PASSIF = at('tabac', 'passif');
	const aO = 1 - lin(frame, BOUFFEE - 8, BOUFFEE);
	const bO = fadeIn(frame, BOUFFEE - 4, 8) * (1 - lin(frame, FUMEE - 8, FUMEE));
	const cO = fadeIn(frame, FUMEE - 4, 8);
	return (
		<AbsoluteFill>
			<Bg />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<Big from={0} to={COUPABLE - 6} text={'*8* *cas* *sur* *10*'} size={120} y={150} center />
					<Big from={COUPABLE} text={'Le *coupable*…'} size={110} y={150} center />
					{Array.from({length: 10}).map((_, i) => {
						const t0 = HUIT - 4 + i * 2;
						const guilty = i < 8 && frame >= TABAC - 4 + i;
						return (
							<div key={i} style={{position: 'absolute', left: 125 + (i % 5) * 180, top: 520 + Math.floor(i / 5) * 200, width: 150, height: 150, borderRadius: 75, background: guilty ? LPI.pink : LPI.paper, border: `7px solid ${N}`, transform: `scale(${popAt(frame, t0)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: frame >= t0 ? 1 : 0}}>
								{guilty ? <CigaretteIcon size={100} /> : null}
							</div>
						);
					})}
					<Pill at={TABAC - 2} x={540} y={1050} tone={LPI.paper} size={64}>
						le tabac
					</Pill>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<Big from={BOUFFEE - 2} text={'Chaque *bouffée*…'} size={110} y={150} center />
					<Diagram keys={[{at: 0, ...DG.all}, {at: FOND - 4, x: 420, y: 600, s: 1.6}]} rings={[...DG.bronchioles.map(([x, y]) => ({from: FOND, x, y, r: 80, ry: 100}))]}>
						<Flow from={BOUFFEE} to={FUMEE} smoke />
					</Diagram>
					<Note at={TOXIQUES - 4} y={1510} size={46} tone={LPI.pink}>
						des produits toxiques jusqu'au fond
					</Note>
				</AbsoluteFill>
			) : null}
			{cO > 0 ? (
				<AbsoluteFill style={{opacity: cO}}>
					<Big from={FUMEE - 2} text={'La fumée des *autres*'} size={100} y={150} center />
					<div style={{position: 'absolute', left: 540 - 220, top: 440, transform: `scale(${popAt(frame, AUTRES - 4)})`}}>
						<PassiveSmokeIcon size={440} />
					</div>
					<Pill at={PASSIF - 4} x={540} y={1050} tone={LPI.paper} size={56}>
						le tabagisme passif
					</Pill>
				</AbsoluteFill>
			) : null}
			<Sfx name="impact" at={HUIT} volume={0.1} />
			<Sfx name="stamp" at={TABAC - 2} volume={0.1} />
			<Sfx name="smoke" at={BOUFFEE} volume={0.25} />
			<Sfx name="pop" at={AUTRES - 4} volume={0.08} />
			<Sfx name="pop" at={PASSIF - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const DEBUT = at('signes', 'début');
	const AUCUN = at('signes', 'aucun');
	const PLUS = at('signes', 'plus');
	const TOUX = at('signes', 'toux');
	const CHANGE = at('signes', 'change');
	const SANG = at('signes', 'sang');
	const ESSOUF = at('signes', 'essoufflement');
	const DOULEUR = at('signes', 'douleur');
	const FATIGUE = at('signes', 'fatigue');
	const PERTE = at('signes', 'perte');
	const aO = 1 - lin(frame, PLUS - 8, PLUS);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<Big from={0} text={'Le *piège*'} size={120} y={150} center />
					<ArtCard top={330} h={820} />
					<Art which="lungC" cx={540} cy={740} s={2.4}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={46} from={DEBUT} sw={3} />
					</Art>
					<Note at={DEBUT + 2} y={1250} size={46} tone={LPI.paper}>
						au début : souvent rien
					</Note>
					<Stamp at={AUCUN} x={600} y={1400} text="AUCUN SIGNE" size={62} />
				</AbsoluteFill>
			) : null}
			<Big from={PLUS} text={'Plus *tard*…'} size={110} y={150} center />
			<RowCard at={TOUX - 6} y={330} h={185} art={150} badge={1} title="Une toux qui ne passe pas" sub="ou qui change" subAt={CHANGE - 4} size={48}>
				<CoughIcon size={120} />
			</RowCard>
			<RowCard at={SANG - 6} y={535} h={185} art={150} badge={2} title="Du sang dans les crachats" size={48} from="left">
				<SputumIcon size={120} />
			</RowCard>
			<RowCard at={ESSOUF - 6} y={740} h={185} art={150} badge={3} title="Un essoufflement" size={50}>
				<BreathAlertIcon size={120} />
			</RowCard>
			<RowCard at={DOULEUR - 6} y={945} h={185} art={150} badge={4} title="Une douleur dans la poitrine" size={46} from="left">
				<PainIcon size={120} />
			</RowCard>
			<RowCard at={FATIGUE - 6} y={1150} h={185} art={150} badge={5} title="De la fatigue" sub="et une perte de poids" subAt={PERTE - 4} size={50}>
				<WeightLossIcon size={120} />
			</RowCard>
			<Sfx name="stamp" at={AUCUN} volume={0.12} />
			{[TOUX - 6, SANG - 6, ESSOUF - 6, DOULEUR - 6, FATIGUE - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const RADIO = at('examens', 'radio');
	const SCANNER = at('examens', 'scanner');
	const FIBRO = at('examens', 'fibroscopie');
	const TUBE = at('examens', 'tube');
	const DESCEND = at('examens', 'descend');
	const BIOPSIE = at('examens', 'biopsie');
	const PRELEV = at('examens', 'prélèvement');
	const CONFIRME = at('examens', 'confirme');
	const scanO = 1 - lin(frame, FIBRO - 8, FIBRO);
	const dO = fadeIn(frame, FIBRO - 4, 8);
	const reach = lin(frame, TUBE - 6, BIOPSIE);
	const head = along(SCOPE, reach);
	const drawn = SCOPE.slice(0, Math.floor(reach * (SCOPE.length - 1)) + 1).concat([head]);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={FIBRO - 6} text={'Pour le *rechercher*'} size={100} y={150} center />
			{scanO > 0 ? (
				<AbsoluteFill style={{opacity: scanO}}>
					{frame >= RADIO - 4 ? (
						<div style={{position: 'absolute', left: 540 - 270, top: 330, transform: `scale(${popAt(frame, RADIO - 4)})`}}>
							<ScanMonitor label="RADIO" scan={lin(frame, RADIO, RADIO + 40)} width={540} height={470}>
								<Art which="lungs" cx={252} cy={217} s={0.47} filter="grayscale(1) invert(1) contrast(1.3)" />
							</ScanMonitor>
						</div>
					) : null}
					{frame >= SCANNER - 4 ? (
						<div style={{position: 'absolute', left: 540 - 270, top: 850, transform: `scale(${popAt(frame, SCANNER - 4)})`}}>
							<ScanMonitor label="SCANNER" scan={lin(frame, SCANNER, SCANNER + 40)} width={540} height={470}>
								<Art which="lungC" cx={252} cy={217} s={1.35} filter="grayscale(1) invert(1) contrast(1.2)">
									<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={46} from={SCANNER + 16} sw={4} />
								</Art>
							</ScanMonitor>
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Big from={FIBRO - 2} to={BIOPSIE - 6} text={'La *fibroscopie*'} size={104} y={150} center />
					<Big from={BIOPSIE - 2} text={'La *biopsie*'} size={110} y={150} center />
					<ArtCard />
					<Art which="lungC" cx={540} cy={770} s={2.9}>
						{reach > 0 ? (
							<g>
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke="#7E8CA0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
								<circle cx={head[0]} cy={head[1]} r={6} fill={N} />
								<circle cx={head[0]} cy={head[1]} r={2.5} fill={LPI.sky} opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
								<circle cx={head[0]} cy={head[1]} r={14} fill={alpha(LPI.sky, 0.35)} />
							</g>
						) : null}
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={46} from={BIOPSIE + 2} sw={3} />
					</Art>
					<Note at={TUBE - 2} to={BIOPSIE - 6} y={1320} size={44} tone={LPI.sky}>
						un petit tube avec une caméra
					</Note>
					<Note at={PRELEV - 2} y={1320} size={44} tone={LPI.paper}>
						un petit prélèvement
					</Note>
					<Stamp at={CONFIRME + 2} x={580} y={1460} text="CONFIRMÉ" size={66} />
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={RADIO - 4} volume={0.08} />
			<Sfx name="pop" at={SCANNER - 4} volume={0.08} />
			<Sfx name="whoosh" at={FIBRO - 4} volume={0.06} />
			<Sfx name="whoosh" at={DESCEND} volume={0.05} />
			<Sfx name="pop" at={PRELEV - 2} volume={0.06} />
			<Sfx name="stamp" at={CONFIRME + 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const TABAC = at('risques', 'tabac');
	const AMIANTE = at('risques', "l'amiante");
	const TRAVAIL = at('risques', 'travail');
	const RADON = at('risques', 'radon');
	const GAZ = at('risques', 'gaz');
	const POLLUTION = at('risques', 'pollution');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			<RowCard at={TABAC - 6} y={340} h={220} art={170} badge={1} title="Le tabac" sub="avant tout" subAt={TABAC + 10} size={56}>
				<CigaretteIcon size={150} />
			</RowCard>
			<RowCard at={AMIANTE - 6} y={590} h={220} art={170} badge={2} title="L'amiante" sub="et des produits respirés au travail" subAt={TRAVAIL - 6} size={56} from="left">
				<HelmetIcon size={150} />
			</RowCard>
			<RowCard at={RADON - 6} y={840} h={220} art={170} badge={3} title="Le radon" sub="un gaz qui sort du sol" subAt={GAZ - 2} size={56}>
				<RadonIcon size={150} />
			</RowCard>
			<RowCard at={POLLUTION - 6} y={1090} h={220} art={170} badge={4} title="La pollution de l'air" size={56} from="left">
				<SmogIcon size={150} />
			</RowCard>
			{[TABAC - 6, AMIANTE - 6, RADON - 6, POLLUTION - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const CHIR = at('traitement', 'chirurgie');
	const RETIRE = at('traitement', 'retire');
	const RADIO = at('traitement', 'radiothérapie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const IMMUNO = at('traitement', "l'immunothérapie");
	const DEFENSES = at('traitement', 'défenses');
	const CIBLES = at('traitement', 'traitements');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'Pour le *soigner*'} size={110} y={150} center />
			<RowCard at={CHIR - 6} y={330} h={185} art={150} badge={1} title="La chirurgie" sub="retire une partie du poumon" subAt={RETIRE} size={50}>
				<ScalpelIcon size={120} />
			</RowCard>
			<RowCard at={RADIO - 6} y={535} h={185} art={150} badge={2} title="La radiothérapie" sub="des rayons sur la tumeur" subAt={RADIO + 14} size={50} from="left">
				<RayIcon size={120} />
			</RowCard>
			<RowCard at={CHIMIO - 6} y={740} h={185} art={150} badge={3} title="La chimiothérapie" sub="des médicaments contre les cellules" subAt={CHIMIO + 14} size={50}>
				<ChemoIcon size={120} />
			</RowCard>
			<RowCard at={IMMUNO - 6} y={945} h={185} art={150} badge={4} title="L'immunothérapie" sub="aide les défenses du corps" subAt={DEFENSES - 4} size={50} from="left">
				<ImmunoIcon size={120} />
			</RowCard>
			<RowCard at={CIBLES - 6} y={1150} h={185} art={150} badge={5} title="Des traitements ciblés" size={50}>
				<TargetIcon size={120} />
			</RowCard>
			{[CHIR - 6, RADIO - 6, CHIMIO - 6, IMMUNO - 6, CIBLES - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ARRÊTER DE FUMER ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const ARRETER = at('fin', 'arrêter');
	const FUMER = at('fin', 'fumer');
	const POUMONS = at('fin', 'poumons');
	const TOUT = at('fin', 'tout');
	const JAMAIS = at('fin', 'jamais');
	const COMMENCER = at('fin', 'commencer');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={ARRETER - 8} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={ARRETER - 2} to={JAMAIS - 6} text={'Arrêter de *fumer*'} size={110} y={170} center />
			<Big from={JAMAIS} text={'Il n\'est jamais trop *tard* !'} size={90} y={170} center />
			{frame >= FUMER - 4 ? (
				<div style={{position: 'absolute', left: 290 - 150, top: 470, transform: `scale(${popAt(frame, FUMER - 4)})`}}>
					<NoSmokeIcon size={300} />
				</div>
			) : null}
			{frame >= POUMONS - 6 ? (
				<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${0.6 + 0.4 * popAt(frame, POUMONS - 6)})`, transformOrigin: '790px 640px'}}>
					<Art which="lungH" cx={790} cy={640} s={1.45} />
				</div>
			) : null}
			<Pill at={POUMONS - 2} x={760} y={900} tone={LPI.sky} size={46}>
				ses poumons protégés
			</Pill>
			<Pill at={TOUT - 2} x={540} y={1060} tone={LPI.paper} size={56}>
				à tout âge
			</Pill>
			<Burst at={COMMENCER} x={540} y={700} r={320} n={12} />
			<Sfx name="pop" at={FUMER - 4} volume={0.08} />
			<Sfx name="pop" at={POUMONS - 6} volume={0.08} />
			<Sfx name="pop" at={TOUT - 2} volume={0.07} />
			<Sfx name="ding" at={COMMENCER} volume={0.08} />
		</AbsoluteFill>
	);
};
