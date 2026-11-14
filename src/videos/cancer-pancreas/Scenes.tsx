// Scènes de « Le cancer du pancréas » (n° 54, voix gratuite d'abord). Accroche sans texte, réaliste : ton père, devant le
// miroir de la salle de bain, le blanc de ses yeux jaunit ; il a maigri (balance) ; « c'est la fatigue… » ; plongée vers
// son ventre (loupe sur le pancréas avec sa tumeur). Puis le pancréas (schéma fourni par le propriétaire, nettoyé de ses
// annotations : caché derrière l'estomac, collé au duodénum, le liquide qui aide à digérer, l'insuline), le cancer (souvent
// découvert tard), pourquoi le jaune (la tumeur de la tête écrase le canal de la bile), les autres signes, les risques, les
// examens (scanner, petite caméra par la bouche + biopsie), les traitements (dont la prothèse biliaire), chute « des yeux
// jaunes, une perte de poids sans raison : on consulte vite ». Storyboard : docs/lpi/storyboard-cancer-pancreas.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {Bathroom, ChemoIcon, ScaleSofaIcon} from '../../brand/breast';
import {BathScale} from '../../brand/heartfail';
import {CigaretteIcon, DiabetesIcon, ScalpelIcon, SyringeIcon, TiredIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {DadBalcony, NoSmokeIcon, WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {BackPainIcon, DarkUrineIcon, InflamIcon, JaundiceEyeIcon, ScannerIcon, Sparkle, Stent, TumorBlob, WineIcon} from '../../brand/pancreas';
import {AgeIcon, RayIcon} from '../../brand/prostate';
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
// Schéma « Le pancréas et le cancer du pancréas » fourni par le propriétaire (1536 × 1024), sans ses annotations
// (demandé) : deux calques dans le même repère (foie, vésicule, estomac, duodénum, pancréas / pancréas sain ou avec cancer).
const IMG = {anat: 'images/pancreas/pancreas-propre-anatomie.png', focus: 'images/pancreas/pancreas-propre-focus.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 400, y: 560, s: 1.22},
	pancreas: [480, 630],
	stomach: [600, 400],
	duodenum: [195, 690],
	liver: [235, 330],
	gall: [190, 470],
	head: [282, 650],
} as const;
/** Le canal du pancréas, de la queue jusqu'au duodénum (pixels de l'image). */
const PDUCT: [number, number][] = [[720, 535], [640, 570], [560, 600], [480, 615], [400, 640], [330, 665], [270, 705], [252, 745], [238, 772]];
/** Le canal de la bile, du foie jusqu'au duodénum, à travers la tête du pancréas. */
const BDUCT: [number, number][] = [[318, 368], [300, 420], [295, 470], [292, 530], [288, 580], [276, 630], [262, 680], [250, 730], [242, 772]];
/** Le trajet de la petite caméra : la bouche → l'œsophage → l'estomac, contre le pancréas. */
const SCOPE: [number, number][] = [[497, 150], [497, 300], [520, 380], [560, 450], [575, 520]];

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
/** Le schéma dans une carte blanche : caméra qui glisse et zoome au mot près, cercles roses qui pulsent ; `children` :
 * calques dans le repère de l'image. */
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

/* ── Les deux pancréas du calque « focus », découpés et posés seuls ── */
const REG = {
	healthy: {x: 800, y: 238, w: 472, h: 242, layer: 'images/pancreas/pancreas-propre-sain.png'},
	cancer: {x: 805, y: 460, w: 472, h: 234, layer: 'images/pancreas/pancreas-propre-cancer.png'},
} as const;
/** La tumeur dans la découpe du pancréas avec cancer, et le même endroit sur le pancréas sain (pixels). */
const TUMOR = [1152 - REG.cancer.x, 545 - REG.cancer.y] as const;
const TUMOR_H = [1150 - REG.healthy.x, 325 - REG.healthy.y] as const;
/** Un dessin du schéma fourni, à l'échelle uniforme `s` (jamais déformé), centré en (cx, cy) ; `children` : calques SVG
 * dans le repère de la découpe. */
const Art: React.FC<{which: keyof typeof REG; cx: number; cy: number; s: number; o?: number; children?: React.ReactNode}> = ({which, cx, cy, s, o = 1, children}) => {
	const r = REG[which];
	return (
		<div style={{position: 'absolute', left: cx - (r.w * s) / 2, top: cy - (r.h * s) / 2, width: r.w, height: r.h, transformOrigin: '0 0', transform: `scale(${s})`, opacity: o}}>
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
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
const DropFlow: React.FC<{paths: [number, number][][]; from: number; to?: number; speed?: number; n?: number; fill?: string; stroke?: string; upto?: number}> = ({paths, from, to = 1e9, speed = 0.012, n = 5, fill = '#FFD84D', stroke = '#C99A1A', upto = 1}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{paths.map((p, j) =>
				Array.from({length: n}).map((_, i) => {
					const t = ((((frame - from) * speed + i / n + j * 0.1) % 1 + 1) % 1) * upto;
					const [x, y] = along(p, t);
					return <circle key={`${j}-${i}`} cx={x} cy={y} r={8} fill={fill} stroke={stroke} strokeWidth={2.5} opacity={Math.min(1, t * 8, (1 - t / upto) * 8)} />;
				}),
			)}
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE JAUNE DANS LE MIROIR ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 330;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const YEUX = at('intro', 'yeux');
	const JAUNE = at('intro', 'jaune');
	const MAIGRI = at('intro', 'maigri');
	const DIT = at('intro', 'dit');
	const FATIGUE = at('intro', 'fatigue');
	const POURTANT = at('intro', 'pourtant');
	const JAUNISSE = at('intro', 'jaunisse');
	const DOULEUR = at('intro', 'douleur');
	const MEDECIN = at('intro', 'médecin');
	const jaundice = lin(frame, JAUNE - 16, JAUNE + 6);
	const shrug = lin(frame, FATIGUE - 8, FATIGUE + 4) * (1 - lin(frame, POURTANT - 4, POURTANT + 4));
	const worry = 0.3 * lin(frame, YEUX, JAUNE + 6) * (1 - shrug) + lin(frame, POURTANT, POURTANT + 8) * 0.7;
	// caméra : plan poitrine → gros plan sur les yeux → recul (la balance) → plongée vers le ventre
	const face = dadPt([300, 212]);
	const belly = dadPt([300, 600]);
	const eyes = lin(frame, YEUX - 10, YEUX + 6) * (1 - lin(frame, MAIGRI - 6, MAIGRI + 8));
	const dive = lin(frame, JAUNISSE - 8, JAUNISSE + 8);
	const s = 1.12 + 1.5 * eyes - 0.12 * lin(frame, MAIGRI - 6, MAIGRI + 8) + 0.6 * dive;
	const f = dive > 0 ? {x: face.x + (belly.x - face.x) * dive, y: face.y + (belly.y - face.y) * dive} : face;
	const tx = 540 - f.x * s;
	const ty = (eyes > 0 || dive > 0 ? 900 : 900) - f.y * s + 260 * (1 - Math.max(eyes, dive)) * (s < 1.2 ? 1 : 0);
	const lens = popAt(frame, JAUNISSE + 8);
	const scaleK = frame >= MAIGRI - 4 && frame < POURTANT + 4 ? popAt(frame, MAIGRI - 4) * (1 - lin(frame, POURTANT - 4, POURTANT + 4)) : 0;
	return (
		<AbsoluteFill style={{background: '#E9EDF1', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Bathroom>
					<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
						<DadBalcony width={DAD_W} cig={false} shrug={shrug} worry={worry} jaundice={jaundice} />
					</foreignObject>
				</Bathroom>
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: belly.x - 170, top: belly.y - 170, width: 340, height: 340, borderRadius: 170, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<Art which="cancer" cx={150} cy={175} s={0.72}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={62} from={DOULEUR} sw={6} />
						</Art>
					</div>
				) : null}
			</AbsoluteFill>
			{/* il a maigri : la balance */}
			{scaleK > 0 ? (
				<div style={{position: 'absolute', left: 640, top: 1330, transform: `scale(${scaleK})`, transformOrigin: '50% 100%'}}>
					<BathScale value={6} delta minus width={340} />
				</div>
			) : null}
			{/* « c'est la fatigue… » : bulle de pensée */}
			{frame >= DIT - 4 && frame < POURTANT + 6 ? (
				<div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${popAt(frame, DIT - 4)})`, opacity: 1 - lin(frame, POURTANT - 2, POURTANT + 6)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>C'est la fatigue…</span>
					</Bubble>
				</div>
			) : null}
			<Sfx name="whoosh" at={YEUX - 10} volume={0.06} />
			<Sfx name="ding" at={JAUNE - 4} volume={0.06} />
			<Sfx name="pop" at={MAIGRI - 4} volume={0.07} />
			<Sfx name="pop" at={DIT - 4} volume={0.06} />
			<Sfx name="whoosh" at={JAUNISSE - 8} volume={0.07} />
			<Sfx name="ding" at={MEDECIN - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PANCRÉAS ═══════════════════════════════ */
export const Pancreas: React.FC = () => {
	const frame = useCurrentFrame();
	const PANCREAS = at('pancreas', 'pancréas');
	const ESTOMAC = at('pancreas', "l'estomac");
	const DUODENUM = at('pancreas', 'duodénum');
	const DEUX = at('pancreas', 'deux');
	const LIQUIDE = at('pancreas', 'liquide');
	const VERSE = at('pancreas', 'versé');
	const INSULINE = at('pancreas', "l'insuline");
	const SUCRE = at('pancreas', 'sucre');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: PANCREAS - 4, x: 470, y: 620, s: 1.7},
		{at: ESTOMAC - 4, x: 520, y: 470, s: 1.35},
		{at: DUODENUM - 4, x: 260, y: 660, s: 1.8},
		{at: LIQUIDE - 4, x: 440, y: 640, s: 1.6},
		{at: INSULINE - 4, x: 470, y: 600, s: 1.55},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={DEUX - 8} text={'Le *pancréas*'} size={110} y={150} center />
			<Big from={DEUX - 2} text={'Deux *rôles*'} size={110} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: PANCREAS, to: ESTOMAC - 6, x: DG.pancreas[0], y: DG.pancreas[1], r: 280, ry: 120},
					{from: ESTOMAC, to: DUODENUM - 6, x: DG.stomach[0], y: DG.stomach[1], r: 150, ry: 140},
					{from: DUODENUM, to: DEUX - 6, x: DG.duodenum[0], y: DG.duodenum[1], r: 75, ry: 150},
				]}
			>
				<DropFlow paths={[PDUCT]} from={LIQUIDE - 2} to={INSULINE - 6} speed={0.014} n={7} fill="#FFB347" stroke="#C26A12" />
				<Sparkle x={500} y={600} from={INSULINE} n={10} spread={170} />
			</Diagram>
			<Note at={ESTOMAC} to={DUODENUM - 6} y={1510} size={46} tone={LPI.paper}>
				caché derrière l'estomac
			</Note>
			<Note at={DUODENUM + 6} to={DEUX - 6} y={1510} size={46} tone={LPI.pink}>
				le duodénum : le début de l'intestin
			</Note>
			<Note at={LIQUIDE} to={INSULINE - 6} y={1510} size={46} tone={LPI.paper}>
				① un liquide qui aide à digérer
			</Note>
			<Note at={INSULINE} y={1510} size={46} tone={LPI.sky}>
				② l'insuline : le sucre dans le sang
			</Note>
			<Sfx name="whoosh" at={PANCREAS - 4} volume={0.05} />
			<Sfx name="whoosh" at={ESTOMAC - 4} volume={0.05} />
			<Sfx name="whoosh" at={DUODENUM - 4} volume={0.05} />
			<Sfx name="pop" at={LIQUIDE} volume={0.06} />
			<Sfx name="pop" at={VERSE} volume={0.04} />
			<Sfx name="ding" at={INSULINE} volume={0.06} />
			<Sfx name="pop" at={SUCRE} volume={0.04} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
/** Des cellules qui se divisent (1 → 2 → 4…), dans le repère de la découpe. */
const Dividing: React.FC<{x: number; y: number; from: number; to: number}> = ({x, y, from, to}) => {
	const frame = useCurrentFrame();
	if (frame < from) return null;
	const k = lin(frame, from, to);
	const n = Math.min(12, Math.floor(1 + k * 12));
	const pts = [[0, 0], [14, -6], [-12, 8], [6, 14], [-16, -8], [20, 8], [0, -18], [-4, 24], [24, -12], [-22, 14], [12, 24], [-24, -2]];
	return (
		<g>
			{pts.slice(0, n).map(([dx, dy], i) => (
				<circle key={i} cx={x + dx} cy={y + dy} r={9 * popAt(frame, from + i * ((to - from) / 12))} fill="#D6405C" stroke="#8E1F36" strokeWidth={1.5} />
			))}
		</g>
	);
};

export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELLULES = at('cancer', 'cellules');
	const MULTIPLIENT = at('cancer', 'multiplient');
	const TUMEUR = at('cancer', 'tumeur');
	const MOINS = at('cancer', 'moins');
	const GRAVES = at('cancer', 'graves');
	const DECOUVRE = at('cancer', 'découvre');
	const TARD = at('cancer', 'tard');
	const artO = fadeIn(frame, 0, 8);
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	const up = lin(frame, MOINS - 6, MOINS + 8);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={'Le *cancer* du pancréas'} size={88} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={GRAVES - 8} text={'Une *tumeur*'} size={110} y={150} center />
			<Big from={GRAVES - 2} text={'L\'un des plus *graves*'} size={92} y={150} center />
			<AbsoluteFill style={{opacity: artO, transform: `translateY(${-180 * up}px) scale(${1 - 0.25 * up})`}}>
				<ArtCard top={330} h={760} />
				<Art which="healthy" cx={540} cy={710} s={1.95} o={1 - toCancer}>
					<PulseRing x={TUMOR_H[0]} y={TUMOR_H[1]} r={46} from={CELLULES} to={MULTIPLIENT + 10} sw={3} />
					<Dividing x={TUMOR_H[0]} y={TUMOR_H[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
				</Art>
				<Art which="cancer" cx={540} cy={710} s={1.95} o={toCancer}>
					<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={66} from={TUMEUR + 2} sw={3.5} />
				</Art>
			</AbsoluteFill>
			<Note at={CELLULES + 4} to={MOINS - 6} y={1180} size={44} tone={LPI.paper}>
				elles se multiplient sans contrôle
			</Note>
			<Pill at={MOINS - 2} x={540} y={1080} tone={LPI.paper} size={50}>
				moins fréquent…
			</Pill>
			{frame >= TARD - 6 ? (
				<div style={{position: 'absolute', left: 540 - 110, top: 1180, transform: `scale(${popAt(frame, TARD - 6)})`}}>
					<svg width={220} height={220} viewBox="0 0 100 100">
						<circle cx={50} cy={54} r={38} fill={LPI.paper} stroke={N} strokeWidth={6} />
						<path d="M50 54 L50 30 M50 54 L68 64" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
						<circle cx={50} cy={54} r={5} fill={N} />
						<rect x={42} y={6} width={16} height={9} rx={3} fill={LPI.blue} stroke={N} strokeWidth={4} />
					</svg>
				</div>
			) : null}
			<Stamp at={TARD + 2} x={560} y={1500} text="SOUVENT DÉCOUVERT TARD" size={52} />
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="pop" at={MOINS - 2} volume={0.06} />
			<Sfx name="whoosh" at={DECOUVRE} volume={0.05} />
			<Sfx name="stamp" at={TARD + 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI LE JAUNE ═══════════════════════════════ */
export const Jaunisse: React.FC = () => {
	const frame = useCurrentFrame();
	const BILE = at('jaunisse', 'bile');
	const FOIE = at('jaunisse', 'foie');
	const DESCEND = at('jaunisse', 'descend');
	const TRAVERSE = at('jaunisse', 'traverse');
	const TUMEUR = at('jaunisse', 'tumeur');
	const APPUIE = at('jaunisse', 'appuie');
	const PASSE = at('jaunisse', 'passe');
	const REPART = at('jaunisse', 'repart');
	const PEAU = at('jaunisse', 'peau');
	const URINES = at('jaunisse', 'urines');
	const SELLES = at('jaunisse', 'selles');
	const grow = lin(frame, TUMEUR - 6, APPUIE + 6);
	// la bile s'arrête juste au-dessus de la tumeur (≈ 60 % du trajet) quand elle appuie
	const upto = 1 - 0.42 * lin(frame, APPUIE, PASSE);
	const dO = 1 - lin(frame, PEAU - 8, PEAU);
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: FOIE - 4, x: 270, y: 420, s: 1.6},
		{at: DESCEND - 2, x: 285, y: 560, s: 1.7},
		{at: TUMEUR - 6, x: 280, y: 620, s: 2.3},
		{at: REPART - 4, x: 300, y: 560, s: 1.6},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={PEAU - 6} text={'Pourquoi ce *jaune* ?'} size={100} y={150} center />
			<Big from={PEAU - 2} text={'La *jaunisse*'} size={110} y={150} center />
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Diagram
						keys={keys}
						rings={[
							{from: BILE, to: FOIE + 20, x: DG.gall[0], y: DG.gall[1], r: 55, ry: 70},
							{from: FOIE, to: DESCEND - 4, x: DG.liver[0], y: DG.liver[1], r: 170, ry: 110},
							{from: TRAVERSE, to: TUMEUR - 4, x: DG.head[0], y: DG.head[1], r: 70, ry: 90},
						]}
					>
						<DropFlow paths={[BDUCT]} from={DESCEND - 4} speed={0.012} n={7} fill="#B9CF3A" stroke="#6E8A12" upto={upto} />
						<TumorBlob x={DG.head[0] + 10} y={DG.head[1] - 8} r={34} grow={grow} />
						{frame >= REPART - 2 ? (
							<g opacity={fadeIn(frame, REPART - 2, 8)}>
								{Array.from({length: 10}).map((_, i) => {
									const t = (((frame - REPART) / 50 + i / 10) % 1 + 1) % 1;
									const a = -Math.PI / 2 + (i - 4.5) * 0.28;
									return <circle key={i} cx={292 + Math.cos(a) * 160 * t} cy={560 + Math.sin(a) * 160 * t} r={8} fill="#E3C23A" stroke="#9C7F12" strokeWidth={2} opacity={1 - t} />;
								})}
							</g>
						) : null}
					</Diagram>
					<Note at={DESCEND} to={TUMEUR - 6} y={1510} size={46} tone={LPI.paper}>
						la bile passe à travers le pancréas
					</Note>
					<Note at={APPUIE} to={REPART - 6} y={1510} size={46} tone={LPI.pink}>
						la tumeur écrase le canal
					</Note>
					<Note at={REPART} y={1510} size={46} tone={LPI.sky}>
						la bile repart dans le sang
					</Note>
				</AbsoluteFill>
			) : null}
			{frame >= PEAU - 6 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, PEAU - 6, 8)}}>
					<div style={{position: 'absolute', left: 140, top: 300, width: 800, height: 560, borderRadius: 48, overflow: 'hidden', boxShadow: SHADOW, background: '#E9EDF1'}}>
						<div style={{position: 'absolute', left: -380, top: -150, width: 1560}}>
							<DadBalcony width={1560} cig={false} worry={0.6} jaundice={1} />
						</div>
					</div>
					<RowCard at={PEAU - 2} y={900} h={180} art={140} title="La peau et les yeux jaunes" size={50}>
						<JaundiceEyeIcon size={120} />
					</RowCard>
					<RowCard at={URINES - 4} y={1100} h={180} art={140} title="Des urines foncées" size={50} from="left">
						<DarkUrineIcon size={120} />
					</RowCard>
					<RowCard at={SELLES - 4} y={1300} h={180} art={140} title="Des selles claires" size={50}>
						<svg width={120} height={120} viewBox="0 0 100 100">
							<ellipse cx={50} cy={64} rx={34} ry={20} fill="#EFE6D2" stroke={N} strokeWidth={5} />
							<ellipse cx={50} cy={44} rx={24} ry={16} fill="#EFE6D2" stroke={N} strokeWidth={5} />
							<ellipse cx={50} cy={28} rx={12} ry={9} fill="#EFE6D2" stroke={N} strokeWidth={5} />
						</svg>
					</RowCard>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={BILE} volume={0.05} />
			<Sfx name="whoosh" at={DESCEND - 2} volume={0.05} />
			<Sfx name="impact" at={APPUIE} volume={0.09} />
			<Sfx name="whoosh" at={REPART - 4} volume={0.05} />
			<Sfx name="pop" at={PEAU - 2} volume={0.07} />
			<Sfx name="pop" at={URINES - 4} volume={0.07} />
			<Sfx name="pop" at={SELLES - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES AUTRES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const PERTE = at('signes', 'perte');
	const DOULEUR = at('signes', 'douleur');
	const DOS = at('signes', 'dos');
	const FATIGUE = at('signes', 'fatigue');
	const DIABETE = at('signes', 'diabète');
	const COUP = at('signes', 'coup');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Les autres *signes*'} size={104} y={150} center />
			<RowCard at={PERTE - 6} y={340} h={230} art={180} badge={1} title="Une perte de poids" sub="sans raison" subAt={PERTE + 14} size={54}>
				<WeightLossIcon size={160} />
			</RowCard>
			<RowCard at={DOULEUR - 6} y={600} h={230} art={180} badge={2} title="Mal au ventre" sub="qui part dans le dos" subAt={DOS - 6} size={54} from="left">
				<BackPainIcon size={160} />
			</RowCard>
			<RowCard at={FATIGUE - 6} y={860} h={230} art={180} badge={3} title="Une grande fatigue" size={54}>
				<TiredIcon size={150} />
			</RowCard>
			<RowCard at={DIABETE - 6} y={1120} h={230} art={180} badge={4} title="Un diabète" sub="qui apparaît d'un coup" subAt={COUP - 6} size={54} from="left">
				<DiabetesIcon size={150} />
			</RowCard>
			{[PERTE - 6, DOULEUR - 6, FATIGUE - 6, DIABETE - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const AGE = at('risques', "l'âge");
	const TABAC = at('risques', 'tabac');
	const SURPOIDS = at('risques', 'surpoids');
	const ALCOOL = at('risques', "l'alcool");
	const DIABETE = at('risques', 'diabète');
	const PANCREATITE = at('risques', 'pancréatite');
	const INFLAMMATION = at('risques', 'inflammation');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[AGE, "Avec l'âge", <AgeIcon key="a" size={120} label="60+" />],
		[TABAC, 'Le tabac', <CigaretteIcon key="t" size={120} color={N} />],
		[SURPOIDS, 'Le surpoids', <ScaleSofaIcon key="s" size={120} />],
		[ALCOOL, "L'alcool en excès", <WineIcon key="w" size={120} />],
		[DIABETE, 'Un diabète ancien', <DiabetesIcon key="d" size={115} />],
		[PANCREATITE, 'Une pancréatite qui dure', <InflamIcon key="i" size={120} />, 'une inflammation du pancréas', INFLAMMATION - 4],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={320 + i * 190} h={170} art={130} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const PRISE = at('examens', 'prise');
	const SCANNER = at('examens', 'scanner');
	const PARFOIS = at('examens', 'parfois');
	const CAMERA = at('examens', 'caméra');
	const BOUCHE = at('examens', 'bouche');
	const REGARDER = at('examens', 'regarder');
	const BIOPSIE = at('examens', 'biopsie');
	const PRELEVEMENT = at('examens', 'prélèvement');
	const aO = 1 - lin(frame, PARFOIS - 6, PARFOIS + 2);
	const bO = fadeIn(frame, PARFOIS - 2, 8);
	const reach = lin(frame, BOUCHE - 6, REGARDER - 4);
	const head = along(SCOPE, reach);
	const nSeg = SCOPE.length - 1;
	const drawn = SCOPE.slice(0, Math.floor(reach * nSeg) + 1).concat([head]);
	const wave = fadeIn(frame, REGARDER, 6);
	const needle = lin(frame, BIOPSIE - 4, BIOPSIE + 10);
	const keys: CamK[] = [
		{at: 0, x: 470, y: 470, s: 1.25},
		{at: REGARDER - 4, x: 540, y: 560, s: 1.9},
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={PARFOIS - 6} text={'Pour le *trouver*'} size={110} y={150} center />
			<Big from={PARFOIS - 2} text={'Une *caméra* tout près'} size={92} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<RowCard at={PRISE - 6} y={400} h={250} art={190} badge={1} title="Une prise de sang" size={56}>
						<SyringeIcon size={150} />
					</RowCard>
					<RowCard at={SCANNER - 6} y={690} h={250} art={190} badge={2} title="Un scanner" size={56} from="left">
						<ScannerIcon size={170} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<Diagram keys={keys}>
						{reach > 0 ? (
							<g>
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={N} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke="#7E8CA0" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
								{wave > 0
									? [0, 1, 2].map((i) => {
											const t = ((frame / 18 + i / 3) % 1 + 1) % 1;
											return <path key={i} d={`M${head[0] - 40 - 30 * t} ${head[1] + 40 + 50 * t} Q${head[0]} ${head[1] + 70 + 60 * t} ${head[0] + 40 + 30 * t} ${head[1] + 40 + 50 * t}`} fill="none" stroke={LPI.blue} strokeWidth={5} opacity={wave * (1 - t)} />;
										})
									: null}
								{needle > 0 ? <line x1={head[0]} y1={head[1]} x2={head[0] - 30 * needle} y2={head[1] + 90 * needle} stroke="#5E6B78" strokeWidth={4} strokeLinecap="round" /> : null}
								<circle cx={head[0]} cy={head[1]} r={14} fill={N} />
								<circle cx={head[0]} cy={head[1]} r={5} fill={LPI.sky} opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
							</g>
						) : null}
					</Diagram>
					<Note at={CAMERA - 4} to={BIOPSIE - 6} y={1510} size={46} tone={LPI.sky}>
						par la bouche, jusqu'à l'estomac
					</Note>
					<Note at={BIOPSIE} y={1510} size={46} tone={LPI.pink}>
						+ une biopsie : un petit prélèvement
					</Note>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={PRISE - 6} volume={0.08} />
			<Sfx name="pop" at={SCANNER - 6} volume={0.08} />
			<Sfx name="whoosh" at={BOUCHE - 6} volume={0.06} />
			<Sfx name="pop" at={BIOPSIE} volume={0.06} />
			<Sfx name="ding" at={PRELEVEMENT} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIR = at('traitement', 'chirurgie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const RADIO = at('traitement', 'radiothérapie');
	const BILE = at('traitement', 'bile');
	const BLOQUEE = at('traitement', 'bloquée');
	const PROTHESE = at('traitement', 'prothèse');
	const PASSER = at('traitement', 'passer');
	const aO = 1 - lin(frame, BILE - 8, BILE);
	const bO = fadeIn(frame, BILE - 4, 8);
	const stent = lin(frame, PROTHESE - 2, PROTHESE + 14);
	const upto = 0.58 + 0.42 * lin(frame, PROTHESE + 10, PASSER);
	const keys: CamK[] = [{at: 0, x: 285, y: 600, s: 2.0}];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={BILE - 6} text={'Pour le *soigner*'} size={110} y={150} center />
			<Big from={BILE - 2} text={'La bile *bloquée*'} size={104} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<RowCard at={CHIR - 6} y={360} h={240} art={180} badge={1} title="La chirurgie" sub="quand c'est possible" subAt={CHIR + 14} size={56}>
						<ScalpelIcon size={150} />
					</RowCard>
					<RowCard at={CHIMIO - 6} y={630} h={240} art={180} badge={2} title="La chimiothérapie" size={56} from="left">
						<ChemoIcon size={160} />
					</RowCard>
					<RowCard at={RADIO - 6} y={900} h={240} art={180} badge={3} title="Parfois : la radiothérapie" size={50}>
						<RayIcon size={160} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<Diagram keys={keys}>
						<DropFlow paths={[BDUCT]} from={BILE - 4} speed={0.012} n={7} fill="#B9CF3A" stroke="#6E8A12" upto={upto} />
						<Stent pts={BDUCT.slice(4)} k={stent} w={12} />
						<TumorBlob x={DG.head[0] + 10} y={DG.head[1] - 8} r={34} />
					</Diagram>
					<Note at={PROTHESE} to={PASSER - 4} y={1510} size={46} tone={LPI.paper}>
						une prothèse : un petit tube
					</Note>
					<Pill at={PASSER - 2} x={540} y={1510} tone={LPI.sky} size={48}>
						la bile passe à nouveau ✓
					</Pill>
				</AbsoluteFill>
			) : null}
			{[CHIR - 6, CHIMIO - 6, RADIO - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="whoosh" at={BILE - 4} volume={0.06} />
			<Sfx name="pop" at={PROTHESE} volume={0.08} />
			<Sfx name="ding" at={PASSER} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CONSULTE VITE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const YEUX = at('fin', 'yeux');
	const PERTE = at('fin', 'perte');
	const CONSULTE = at('fin', 'consulte');
	const ARRETER = at('fin', 'arrêter');
	const FUMER = at('fin', 'fumer');
	const PROTEGE = at('fin', 'protège');
	const PANCREAS = at('fin', 'pancréas');
	const aO = 1 - lin(frame, ARRETER - 8, ARRETER);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={ARRETER - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={ARRETER - 2} text={'Arrêter de *fumer*'} size={104} y={170} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					{frame >= YEUX - 4 ? (
						<div style={{position: 'absolute', left: 130, top: 420, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, YEUX - 4)})`}}>
							<JaundiceEyeIcon size={300} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N}}>des yeux jaunes</div>
						</div>
					) : null}
					{frame >= PERTE - 4 ? (
						<div style={{position: 'absolute', left: 590, top: 420, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, PERTE - 4)})`}}>
							<WeightLossIcon size={300} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N}}>maigrir sans raison</div>
						</div>
					) : null}
					<Stamp at={CONSULTE} x={560} y={1060} text="ON CONSULTE VITE" size={68} />
				</AbsoluteFill>
			) : null}
			{frame >= FUMER - 4 ? (
				<div style={{position: 'absolute', left: 540 - 200, top: 420, transform: `scale(${popAt(frame, FUMER - 4)})`}}>
					<NoSmokeIcon size={400} />
				</div>
			) : null}
			<Pill at={PROTEGE - 2} x={540} y={940} tone={LPI.pink} size={54}>
				protège aussi son pancréas
			</Pill>
			<Burst at={PANCREAS} x={540} y={620} r={320} n={12} />
			<Sfx name="pop" at={YEUX - 4} volume={0.08} />
			<Sfx name="pop" at={PERTE - 4} volume={0.08} />
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
			<Sfx name="pop" at={FUMER - 4} volume={0.08} />
			<Sfx name="ding" at={PANCREAS} volume={0.08} />
		</AbsoluteFill>
	);
};
