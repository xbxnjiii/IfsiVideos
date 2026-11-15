// Scènes de « Le cancer du foie » (n° 57, voix gratuite d'abord). Accroche sans texte, réaliste : la cuisine le soir, ton
// père se sert un verre de vin… puis un deuxième ; le calendrier défile (depuis des années) ; « je me sens très bien ! » ;
// plongée vers son foie (loupe) : en silence il s'abîme (nodules de cirrhose)… puis la tumeur. Puis le foie (schéma fourni
// par le propriétaire, nettoyé de ses annotations : lobes, filtre, bile, vésicule, voie biliaire), le cancer sur un foie
// malade (cirrhose), les causes, les signes, les examens, les traitements, chute « ça protège son foie ».
// Storyboard : docs/lpi/storyboard-cancer-foie.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {EchoIcon, ScaleSofaIcon} from '../../brand/breast';
import {KIT, Kitchen} from '../../brand/colorectal';
import {PillIcon, ScalpelIcon, SyringeIcon, TiredIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {BiopsyIcon, BloodCutIcon, Cirrhosis, FattyLiverIcon, HeatIcon, LessAlcoholIcon, NightWindow, RibPainIcon, ScreenCIcon, SwollenBellyIcon, TransplantIcon, VaccineIcon, VirusIcon, WineBottleG, WineGlassG} from '../../brand/liver';
import {DadBalcony, WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {JaundiceEyeIcon, ScannerIcon, Sparkle, WineIcon} from '../../brand/pancreas';
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

/* ═══════════════════════════════ SCHÉMA FOURNI (NETTOYÉ) ═══════════════════════════════ */
// Schéma « Le foie et le cancer du foie » fourni par le propriétaire (1536 × 1024), sans ses annotations (demandé) : le
// foie (lobes droit et gauche), la vésicule biliaire, la voie biliaire ; le foie sain / avec cancer.
const IMG = {anat: 'images/foie/foie-propre-anatomie.png', w: 1536, h: 1024};
const DG = {
	all: {x: 441, y: 592, s: 1.25},
	right: [300, 480],
	left: [640, 380],
	gall: [290, 735],
	duct: [452, 830],
} as const;
/** Le sang qui traverse le foie, la bile qui descend vers la vésicule puis vers l'intestin (pixels de l'image). */
const BLOOD: [number, number][] = [[790, 330], [640, 400], [480, 460], [300, 470], [150, 520]];
const BILE_IN: [number, number][] = [[520, 470], [470, 560], [445, 630], [420, 665], [370, 690], [320, 720]];
const BILE_OUT: [number, number][] = [[445, 630], [452, 700], [452, 790], [452, 890]];

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
/** Le schéma dans une carte blanche : caméra qui glisse et zoome au mot près, cercles roses qui pulsent. */
const Diagram: React.FC<{keys: CamK[]; rings?: Ring[]; o?: number; children?: React.ReactNode}> = ({keys, rings = [], o = 1, children}) => {
	const frame = useCurrentFrame();
	const c = camOf(frame, keys);
	const tx = CARD.w / 2 - c.x * c.s;
	const ty = CARD.h / 2 - c.y * c.s;
	return (
		<div style={{position: 'absolute', left: CARD.left, top: CARD.top, width: CARD.w, height: CARD.h, borderRadius: 48, overflow: 'hidden', background: '#FFFFFF', boxShadow: `0 18px 50px ${alpha(N, 0.18)}`, opacity: o}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: IMG.w, height: IMG.h, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${c.s})`}}>
				<Img src={staticFile(IMG.anat)} style={{position: 'absolute', width: IMG.w, height: IMG.h, display: 'block'}} />
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

/* ── Les deux foies (sain / avec cancer), chacun dans son calque ── */
const REG = {
	healthy: {x: 810, y: 300, w: 352, h: 258, layer: 'images/foie/foie-propre-sain.png'},
	cancer: {x: 1147, y: 300, w: 368, h: 256, layer: 'images/foie/foie-propre-cancer.png'},
} as const;
/** La tumeur dans la découpe du foie avec cancer, et le même endroit sur le foie sain (pixels). */
const TUMOR = [1376 - REG.cancer.x, 396 - REG.cancer.y] as const;
const TUMOR_H = [1031 - REG.healthy.x, 396 - REG.healthy.y] as const;
/** Le contour du foie sain (dans sa découpe), un peu rentré : là où poussent les nodules de la cirrhose. */
const HEALTHY_POLY: [number, number][] = (
	[[25, 70], [58, 22], [115, 8], [185, 14], [270, 22], [322, 34], [318, 58], [262, 92], [202, 125], [178, 160], [110, 176], [52, 208], [30, 228], [14, 172]] as [number, number][]
).map(([x, y]) => [x + 5 + (165 - x - 5) * 0.12, y + 5 + (100 - y - 5) * 0.12] as [number, number]);
/** Un dessin du schéma fourni, à l'échelle uniforme `s` (jamais déformé), centré en (cx, cy). */
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

/** Point sur une ligne brisée (t 0 → 1), à vitesse constante le long du trajet. */
const along = (pts: readonly (readonly [number, number])[], t: number): [number, number] => {
	const L: number[] = [0];
	for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
	const d = Math.max(0, Math.min(1, t)) * L[L.length - 1];
	let i = 1;
	while (i < L.length - 1 && L[i] < d) i++;
	const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
	return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
};
/** Gouttes qui avancent en boucle le long des trajets donnés. */
const DropFlow: React.FC<{paths: [number, number][][]; from: number; to?: number; speed?: number; n?: number; fill?: string; stroke?: string; r?: number}> = ({paths, from, to = 1e9, speed = 0.012, n = 5, fill = '#9BC53D', stroke = '#5E7F1E', r = 8}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{paths.map((p, j) =>
				Array.from({length: n}).map((_, i) => {
					const t = (((frame - from) * speed + i / n + j * 0.1) % 1 + 1) % 1;
					const [x, y] = along(p, t);
					return <circle key={`${j}-${i}`} cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={2.5} opacity={Math.min(1, t * 8, (1 - t) * 8)} />;
				}),
			)}
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : UN VERRE… PUIS UN DEUXIÈME ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 300;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});
const GLASS = {x: 640, y: KIT.counter - 6};
const BOTTLE = {x: 860, y: KIT.counter - 6};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const VERRE = at('intro', 'verre');
	const DEUX = at('intro', 'deuxième');
	const ANNEES = at('intro', 'années');
	const BIEN = at('intro', 'bien');
	const FOIE = at('intro', 'foie');
	const SILENCE = at('intro', 'silence');
	const ABIME = at('intro', "s'abîme");
	const CANCER = at('intro', 'cancer');
	// on se sert : la bouteille penche, le verre se remplit ; il boit ; on ressert
	const pour1 = lin(frame, VERRE - 8, VERRE + 14);
	const drink = lin(frame, DEUX - 10, DEUX - 2);
	const pour2 = lin(frame, DEUX + 2, DEUX + 22);
	const fill = 0.7 * pour1 * (1 - drink) + 0.7 * pour2;
	const tilt = -48 * (Math.sin(Math.PI * pour1) + Math.sin(Math.PI * pour2));
	// depuis des années : le calendrier défile de 2006 à 2026
	const yk = lin(frame, ANNEES - 14, ANNEES + 26);
	const yf = yk * 20;
	const year = String(2006 + Math.min(20, Math.floor(yf)));
	const next = String(2006 + Math.min(20, Math.floor(yf) + 1));
	const flip = yk > 0 && yk < 1 ? yf - Math.floor(yf) : 0;
	const shrug = lin(frame, BIEN - 8, BIEN + 4) * (1 - lin(frame, FOIE - 10, FOIE - 2));
	// plongée vers son foie (à droite pour lui : à gauche de l'écran, sous les côtes)
	const liver = dadPt([225, 545]);
	const dive = lin(frame, FOIE - 8, FOIE + 18);
	const s = 1 + 0.65 * dive;
	const tx = interpolate(dive, [0, 1], [0, 540 - liver.x * s]);
	const ty = interpolate(dive, [0, 1], [0, 900 - liver.y * s]);
	const lens = popAt(frame, FOIE + 6);
	const cirr = lin(frame, SILENCE - 4, ABIME + 26);
	const toCancer = lin(frame, CANCER - 10, CANCER + 4);
	return (
		<AbsoluteFill style={{background: '#F3EDE3', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Kitchen
					year={year}
					nextYear={next}
					flip={flip}
					onTop={
						<>
							<g transform={`translate(${GLASS.x} ${GLASS.y})`}>
								<WineGlassG fill={fill} s={0.9} />
							</g>
							<g transform={`translate(${BOTTLE.x} ${BOTTLE.y})`}>
								<WineBottleG s={0.75} tilt={tilt} />
							</g>
						</>
					}
				>
					<NightWindow />
					<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
						<DadBalcony width={DAD_W} cig={false} shrug={shrug} />
					</foreignObject>
				</Kitchen>
				{/* le soir : lumière chaude de la lampe, coins plus sombres */}
				<AbsoluteFill style={{background: 'radial-gradient(circle at 55% 45%, rgba(255,214,150,0.12) 0%, rgba(20,30,60,0.28) 85%)'}} />
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: liver.x - 190, top: liver.y - 190, width: 380, height: 380, borderRadius: 190, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<Art which="healthy" cx={190} cy={195} s={1.0} o={1 - toCancer}>
							<Cirrhosis poly={HEALTHY_POLY} k={cirr} r={8} />
						</Art>
						<Art which="cancer" cx={190} cy={195} s={0.97} o={toCancer}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={72} from={CANCER + 2} sw={5} />
						</Art>
					</div>
				) : null}
			</AbsoluteFill>
			{/* « je me sens très bien ! » : bulle */}
			{frame >= BIEN - 6 && frame < FOIE ? (
				<div style={{position: 'absolute', left: 80, top: 250, transform: `scale(${popAt(frame, BIEN - 6)})`, opacity: 1 - lin(frame, FOIE - 10, FOIE - 2)}}>
					<Bubble tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>Je vais très bien !</span>
					</Bubble>
				</div>
			) : null}
			<Sfx name="pop" at={VERRE - 8} volume={0.05} />
			<Sfx name="pop" at={DEUX + 2} volume={0.05} />
			<Sfx name="whoosh" at={ANNEES - 14} volume={0.05} />
			<Sfx name="pop" at={BIEN - 6} volume={0.06} />
			<Sfx name="whoosh" at={FOIE - 8} volume={0.07} />
			<Sfx name="pop" at={FOIE + 6} volume={0.07} />
			<Sfx name="ding" at={CANCER - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE FOIE ═══════════════════════════════ */
export const Foie: React.FC = () => {
	const frame = useCurrentFrame();
	const GROS = at('foie', 'gros');
	const COTES = at('foie', 'côtes');
	const LOBES = at('foie', 'lobes');
	const DROIT = at('foie', 'droit');
	const GAUCHE = at('foie', 'gauche');
	const FILTRE = at('foie', 'filtre');
	const SANG = at('foie', 'sang');
	const TOXINES = at('foie', 'toxines');
	const BILE = at('foie', 'bile');
	const VESICULE = at('foie', 'vésicule');
	const INTESTIN = at('foie', "l'intestin");
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: DROIT - 4, x: 320, y: 500, s: 1.6},
		{at: GAUCHE - 4, x: 610, y: 420, s: 1.7},
		{at: FILTRE - 4, ...DG.all},
		{at: BILE - 4, x: 410, y: 640, s: 1.45},
		{at: VESICULE - 4, x: 340, y: 720, s: 1.9},
		{at: INTESTIN - 6, x: 420, y: 740, s: 1.4},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={LOBES - 6} text={'Le *foie*'} size={110} y={150} center />
			<Big from={LOBES - 2} to={FILTRE - 6} text={'Deux *lobes*'} size={110} y={150} center />
			<Big from={FILTRE - 2} to={BILE - 6} text={'Il *filtre* le sang'} size={100} y={150} center />
			<Big from={BILE - 2} text={'La *bile*'} size={110} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: GROS, to: LOBES - 4, x: DG.all.x, y: 560, r: 380, ry: 280},
					{from: DROIT, to: GAUCHE - 4, x: DG.right[0], y: DG.right[1], r: 190, ry: 230},
					{from: GAUCHE, to: FILTRE - 4, x: DG.left[0], y: DG.left[1], r: 150, ry: 110},
					{from: VESICULE, to: INTESTIN - 4, x: DG.gall[0], y: DG.gall[1], r: 95, ry: 70},
					{from: INTESTIN, x: DG.duct[0], y: DG.duct[1], r: 32, ry: 80},
				]}
			>
				<DropFlow paths={[BLOOD]} from={SANG - 4} to={BILE - 4} speed={0.014} n={7} fill="#B3122E" stroke="#FFFFFF" r={10} />
				{frame >= TOXINES - 4 && frame < BILE ? <Sparkle x={420} y={460} from={TOXINES - 4} n={12} spread={260} color={LPI.blue} /> : null}
				<DropFlow paths={[BILE_IN]} from={BILE - 2} speed={0.014} n={6} fill="#C8E04A" stroke="#FFFFFF" r={9} />
				<DropFlow paths={[BILE_OUT]} from={INTESTIN - 8} speed={0.016} n={5} fill="#C8E04A" stroke="#FFFFFF" r={9} />
			</Diagram>
			<Note at={COTES} to={LOBES - 6} y={1510} size={46} tone={LPI.paper}>
				sous les côtes, à droite
			</Note>
			<Note at={DROIT} to={GAUCHE - 6} y={1510} size={46} tone={LPI.sky}>
				le lobe droit, le plus gros
			</Note>
			<Note at={GAUCHE} to={FILTRE - 6} y={1510} size={46} tone={LPI.sky}>
				le lobe gauche
			</Note>
			<Note at={TOXINES} to={BILE - 6} y={1510} size={46} tone={LPI.pink}>
				il élimine les toxines
			</Note>
			<Note at={BILE + 6} to={VESICULE - 6} y={1510} size={46} tone={LPI.paper}>
				elle aide à digérer
			</Note>
			<Note at={VESICULE} to={INTESTIN - 6} y={1510} size={46} tone={LPI.paper}>
				stockée dans la vésicule biliaire
			</Note>
			<Note at={INTESTIN} y={1510} size={46} tone={LPI.paper}>
				puis vers l'intestin
			</Note>
			<Sfx name="whoosh" at={DROIT - 4} volume={0.05} />
			<Sfx name="whoosh" at={GAUCHE - 4} volume={0.05} />
			<Sfx name="ding" at={TOXINES - 4} volume={0.05} />
			<Sfx name="whoosh" at={BILE - 4} volume={0.05} />
			<Sfx name="whoosh" at={VESICULE - 4} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
const Dividing: React.FC<{x: number; y: number; from: number; to: number}> = ({x, y, from, to}) => {
	const frame = useCurrentFrame();
	if (frame < from) return null;
	const k = lin(frame, from, to);
	const n = Math.min(12, Math.floor(1 + k * 12));
	const pts = [[0, 0], [14, -6], [-12, 8], [6, 14], [-16, -8], [20, 8], [0, -18], [-4, 24], [24, -12], [-22, 14], [12, 24], [-24, -2]];
	return (
		<g>
			{pts.slice(0, n).map(([dx, dy], i) => (
				<circle key={i} cx={x + dx} cy={y + dy} r={9 * popAt(frame, from + i * ((to - from) / 12))} fill="#F6C38C" stroke="#C97B3C" strokeWidth={1.5} />
			))}
		</g>
	);
};

export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELLULES = at('cancer', 'cellules');
	const MULTIPLIENT = at('cancer', 'multiplient');
	const TUMEUR = at('cancer', 'tumeur');
	const SOUVENT = at('cancer', 'souvent');
	const MALADE = at('cancer', 'malade');
	const CIRRHOSE = at('cancer', 'cirrhose');
	const ABIME = at('cancer', 'abîmé');
	const DURCI = at('cancer', 'durci');
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6) * (1 - lin(frame, SOUVENT - 6, SOUVENT + 8));
	const cirr = lin(frame, MALADE - 6, DURCI + 10);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={'Le *cancer* du foie'} size={96} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={SOUVENT - 6} text={'Une *tumeur*'} size={110} y={150} center />
			<Big from={SOUVENT - 2} to={CIRRHOSE - 6} text={'Sur un foie *malade*'} size={96} y={150} center />
			<Big from={CIRRHOSE - 2} text={'La *cirrhose*'} size={110} y={150} center />
			<ArtCard top={330} h={980} o={fadeIn(frame, 0, 8)} />
			<Art which="healthy" cx={540} cy={820} s={2.55} o={(1 - toCancer) * fadeIn(frame, 0, 8)}>
				<PulseRing x={TUMOR_H[0]} y={TUMOR_H[1]} r={40} from={CELLULES} to={MULTIPLIENT + 8} sw={2.5} />
				{frame < SOUVENT ? <Dividing x={TUMOR_H[0]} y={TUMOR_H[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} /> : null}
				<Cirrhosis poly={HEALTHY_POLY} k={cirr} r={7} />
			</Art>
			<Art which="cancer" cx={540} cy={820} s={2.45} o={toCancer}>
				<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={72} from={TUMEUR + 2} sw={3} />
			</Art>
			<Note at={CELLULES + 4} to={SOUVENT - 6} y={1400} size={44} tone={LPI.paper}>
				elles se multiplient sans contrôle
			</Note>
			<Note at={MALADE} to={ABIME - 6} y={1400} size={44} tone={LPI.paper}>
				le plus souvent, sur un foie déjà malade
			</Note>
			<Note at={ABIME} y={1400} size={44} tone={LPI.sky}>
				un foie abîmé et durci
			</Note>
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="whoosh" at={SOUVENT - 6} volume={0.05} />
			<Sfx name="pop" at={CIRRHOSE} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES CAUSES ═══════════════════════════════ */
export const Causes: React.FC = () => {
	const ALCOOL = at('causes', "l'alcool");
	const VIRUS = at('causes', 'virus');
	const GRAS = at('causes', 'gras');
	const SURPOIDS = at('causes', 'surpoids');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[ALCOOL, "L'alcool", <WineIcon key="w" size={150} />],
		[VIRUS, 'Les hépatites B et C', <VirusIcon key="v" size={150} />, 'des virus qui attaquent le foie', VIRUS + 8],
		[GRAS, 'Le gras dans le foie', <FattyLiverIcon key="f" size={150} />, 'avec le surpoids et le diabète', SURPOIDS - 4],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Ce qui *abîme* le foie'} size={96} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={360 + i * 330} h={290} art={190} badge={i + 1} title={title} sub={sub} subAt={subAt} size={54} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const AUCUN = at('signes', 'aucun');
	const PUIS = at('signes', 'puis');
	const FATIGUE = at('signes', 'fatigue');
	const PERTE = at('signes', 'perte');
	const DOULEUR = at('signes', 'douleur');
	const COTES = at('signes', 'côtes');
	const JAUNE = at('signes', 'jaunissent');
	const GONFLE = at('signes', 'gonfle');
	const aO = 1 - lin(frame, PUIS - 6, PUIS + 2);
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[FATIGUE, 'Une grande fatigue', <TiredIcon key="t" size={115} />],
		[PERTE, 'Une perte de poids', <WeightLossIcon key="w" size={120} />],
		[DOULEUR, 'Une douleur à droite', <RibPainIcon key="r" size={120} />, 'juste sous les côtes', COTES - 4],
		[JAUNE, 'La peau et les yeux jaunes', <JaundiceEyeIcon key="j" size={120} />],
		[GONFLE, 'Un ventre qui gonfle', <SwollenBellyIcon key="b" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={PUIS - 6} text={'Au *début*'} size={120} y={150} center />
			<Big from={PUIS - 2} text={'Puis *viennent*…'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<ArtCard top={360} h={760} />
					<Art which="cancer" cx={540} cy={740} s={2.4} />
					<Stamp at={AUCUN} x={540} y={1260} text="AUCUN SIGNE" size={72} />
				</AbsoluteFill>
			) : null}
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Sfx name="stamp" at={AUCUN} volume={0.12} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const ECHO = at('examens', 'échographie');
	const SIX = at('examens', 'six');
	const TOT = at('examens', 'tôt');
	const SCANNER = at('examens', 'scanner');
	const PRISE = at('examens', 'prise');
	const BIOPSIE = at('examens', 'biopsie');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[ECHO, 'Une échographie du foie', <EchoIcon key="e" size={130} />, 'tous les 6 mois, si cirrhose', SIX - 4],
		[SCANNER, 'Un scanner ou une IRM', <ScannerIcon key="s" size={130} />],
		[PRISE, 'Une prise de sang', <SyringeIcon key="p" size={120} color={N} />],
		[BIOPSIE, 'Parfois, une biopsie', <BiopsyIcon key="b" size={130} />, 'un petit prélèvement', BIOPSIE + 18],
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={SCANNER - 6} text={'Avec une *cirrhose*'} size={100} y={150} center />
			<Big from={SCANNER - 2} text={'Pour le *confirmer*'} size={100} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={350 + i * 250} h={225} art={160} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Stamp at={TOT} x={560} y={1430} text="LE TROUVER TÔT" size={70} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="stamp" at={TOT} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const RETIRER = at('traitement', 'retirer');
	const REPOUSSE = at('traitement', 'repousse');
	const REMPLACE = at('traitement', 'remplace');
	const GREFFE = at('traitement', 'greffe');
	const CHALEUR = at('traitement', 'chaleur');
	const COUPER = at('traitement', 'couper');
	const MEDS = at('traitement', 'médicaments');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[RETIRER, 'Retirer la partie malade', <ScalpelIcon key="c" size={120} />, 'le foie repousse !', REPOUSSE - 4],
		[REMPLACE, 'La greffe', <TransplantIcon key="g" size={125} />, 'un nouveau foie', GREFFE],
		[CHALEUR, 'Détruire la tumeur par la chaleur', <HeatIcon key="h" size={125} />],
		[COUPER, "Lui couper l'arrivée de sang", <BloodCutIcon key="b" size={125} />],
		[MEDS, 'Des médicaments', <PillIcon key="p" size={115} color={N} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Pour le *soigner*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={subAt} size={46} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Stamp at={REPOUSSE + 4} x={560} y={1500} text="LE FOIE REPOUSSE !" size={62} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="stamp" at={REPOUSSE + 4} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ÇA PROTÈGE SON FOIE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const ALCOOL = at('fin', "d'alcool");
	const VACCIN = at('fin', 'vaccin');
	const DEPISTAGE = at('fin', 'dépistage');
	const GUERIT = at('fin', 'guérit');
	const POIDS = at('fin', 'poids');
	const PROTEGE = at('fin', 'protège');
	const gO = 1 - lin(frame, PROTEGE - 8, PROTEGE);
	const tiles: [number, React.ReactNode, string, string?, number?][] = [
		[ALCOOL, <LessAlcoholIcon key="a" size={230} />, "moins d'alcool"],
		[VACCIN, <VaccineIcon key="v" size={230} />, "le vaccin de l'hépatite B"],
		[DEPISTAGE, <ScreenCIcon key="c" size={230} />, "dépister l'hépatite C", 'elle se guérit', GUERIT - 4],
		[POIDS, <ScaleSofaIcon key="s" size={230} />, 'un poids normal'],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={PROTEGE - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={PROTEGE - 2} text={'Ça protège son *foie*'} size={100} y={170} center />
			{gO > 0
				? tiles.map(([t, icon, label, sub, subAt], i) =>
						frame >= t - 4 ? (
							<div key={i} style={{position: 'absolute', left: 50 + (i % 2) * 500, top: 380 + Math.floor(i / 2) * 560, width: 480, textAlign: 'center', transform: `scale(${popAt(frame, t - 4)})`, opacity: gO}}>
								{icon}
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N, marginTop: 8, lineHeight: 1.15}}>{label}</div>
								{sub && subAt !== undefined && frame >= subAt ? (
									<div style={{display: 'inline-block', marginTop: 14, padding: '8px 22px', borderRadius: 999, background: LPI.sky, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, transform: `scale(${popAt(frame, subAt)})`}}>{sub}</div>
								) : null}
							</div>
						) : null,
					)
				: null}
			{frame >= PROTEGE - 6 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, PROTEGE - 6, 8)}}>
					<ArtCard top={520} h={760} />
					<div style={{position: 'absolute', inset: 0, transform: `scale(${popAt(frame, PROTEGE - 6)})`}}>
						<Art which="healthy" cx={540} cy={900} s={2.5} />
					</div>
				</AbsoluteFill>
			) : null}
			<Burst at={at('fin', 'foie')} x={540} y={900} r={380} n={12} />
			{tiles.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 4} volume={0.08} />
			))}
			<Sfx name="pop" at={GUERIT - 4} volume={0.06} />
			<Sfx name="ding" at={PROTEGE} volume={0.08} />
		</AbsoluteFill>
	);
};
