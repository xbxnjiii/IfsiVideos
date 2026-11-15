// Scènes de « Le cancer du rein » (n° 56, voix gratuite d'abord). Accroche sans texte, réaliste : ton père a mal au dos ;
// à l'échographie, sur l'écran, une boule apparaît sur le rein (mesure « 3,2 cm ») — découverte par hasard, la loupe montre
// le rein avec sa tumeur. Puis le rein (schéma fourni par le propriétaire, nettoyé de ses annotations : le sang arrive par
// l'artère, repart par la veine, l'urine du bassinet à l'uretère, la glande surrénale), le cancer, les signes (souvent
// aucun), les risques, les examens (scanner, biopsie), les traitements (chirurgie partielle ou totale, on vit bien avec
// un seul rein, froid / chaleur, surveillance, médicaments), chute « du sang dans les urines : on consulte ».
// Storyboard : docs/lpi/storyboard-cancer-rein.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {BloodUrineIcon} from '../../brand/bladder';
import {Bathroom, ScaleSofaIcon} from '../../brand/breast';
import {CigaretteIcon, FeverIcon, HypertensionIcon, PillIcon, ScalpelIcon, TiredIcon} from '../../brand/icons';
import {ColdHeatIcon, DialysisIcon, EchoScreen, FlankLumpIcon, OneKidneyIcon} from '../../brand/kidney';
import {Stamp} from '../../brand/kit';
import {DadBalcony, NoSmokeIcon, WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {BackPainIcon, ScannerIcon, Sparkle} from '../../brand/pancreas';
import {AgeIcon, FamilyIcon, WatchIcon} from '../../brand/prostate';
import {Sfx} from '../../brand/Sfx';
import {PainBolts} from '../../brand/stomach';
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
// Schéma « Le rein et le cancer du rein » fourni par le propriétaire (1536 × 1024), sans ses annotations (demandé) : le
// rein en coupe avec la glande surrénale, l'artère et la veine rénales, l'uretère ; le rein sain / avec cancer.
const IMG = {anat: 'images/rein/rein-propre-anatomie.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 465, y: 550, s: 1.2},
	adrenal: [440, 195],
	artery: [640, 425],
	vein: [670, 510],
	pelvis: [440, 490],
	ureter: [590, 830],
	cortex: [240, 470],
} as const;
/** Le sang qui arrive par l'artère, celui qui repart par la veine, l'urine du bassinet à l'uretère (pixels de l'image). */
const ART: [number, number][] = [[705, 450], [640, 432], [560, 425], [490, 440], [430, 470]];
const VEIN: [number, number][] = [[470, 455], [560, 485], [660, 512], [770, 530]];
const URINE: [number, number][] = [[430, 500], [500, 520], [560, 580], [590, 680], [592, 800], [575, 960]];

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

/* ── Les deux reins (sain / avec cancer), chacun dans son calque ── */
const REG = {
	healthy: {x: 862, y: 222, w: 310, h: 385, layer: 'images/rein/rein-propre-sain.png'},
	cancer: {x: 1188, y: 222, w: 295, h: 380, layer: 'images/rein/rein-propre-cancer.png'},
} as const;
/** La tumeur dans la découpe du rein avec cancer, et le même endroit sur le rein sain (pixels). */
const TUMOR = [1390 - REG.cancer.x, 322 - REG.cancer.y] as const;
const TUMOR_H = [1062 - REG.healthy.x, 330 - REG.healthy.y] as const;
/** Un dessin du schéma fourni, à l'échelle uniforme `s` (jamais déformé), centré en (cx, cy) ; `children` : calques SVG
 * dans le repère de la découpe. */
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

/* ═══════════════════════════════ ACCROCHE : DÉCOUVERT PAR HASARD ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 330;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MAL = at('intro', 'mal');
	const ECHO = at('intro', 'échographie');
	const BOULE = at('intro', 'boule');
	const REIN = at('intro', 'rein');
	const PERSONNE = at('intro', 'personne');
	const CANCER = at('intro', 'cancer');
	const REIN2 = at('intro', 'rein', 2);
	const HASARD = at('intro', 'hasard');
	const slide = lin(frame, ECHO - 8, ECHO + 4);
	const pain = lin(frame, MAL - 6, MAL + 4);
	const worry = pain * 0.7;
	const mass = lin(frame, BOULE - 8, BOULE + 6);
	const measure = lin(frame, REIN - 2, REIN + 14);
	const zoom = lin(frame, PERSONNE - 6, PERSONNE + 14);
	const s = 1 + 0.45 * zoom;
	const tx = (540 - 640 * s) * zoom + 0;
	const ty = (900 - 760 * s) * zoom;
	const lens = popAt(frame, CANCER - 4);
	return (
		<AbsoluteFill style={{background: '#DCE6EE', overflow: 'hidden'}}>
			{slide < 1 ? (
				<AbsoluteFill style={{transform: `translateX(${-1080 * slide}px)`}}>
					<Bathroom>
						<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
							<DadBalcony width={DAD_W} cig={false} worry={worry} />
						</foreignObject>
					</Bathroom>
					<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
						<PainBolts x={dadPt([470, 640]).x} y={dadPt([470, 640]).y} k={pain} s={1.1} />
					</svg>
				</AbsoluteFill>
			) : null}
			{slide > 0 ? (
				<AbsoluteFill style={{transform: `translateX(${1080 * (1 - slide)}px)`}}>
					<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
						<EchoScreen mass={mass} measure={measure} />
					</AbsoluteFill>
					{lens > 0.01 ? (
						<div style={{position: 'absolute', left: 540 - 220, top: 1180, width: 440, height: 440, borderRadius: 220, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
							<Art which="cancer" cx={220} cy={225} s={1.05}>
								<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={80} from={REIN2 - 4} sw={5} />
							</Art>
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			<Stamp at={HASARD} x={560} y={380} text="PAR HASARD" size={72} />
			<Sfx name="whoosh" at={ECHO - 8} volume={0.07} />
			<Sfx name="ding" at={BOULE - 4} volume={0.07} />
			<Sfx name="pop" at={REIN} volume={0.05} />
			<Sfx name="whoosh" at={PERSONNE - 6} volume={0.05} />
			<Sfx name="pop" at={CANCER - 4} volume={0.07} />
			<Sfx name="stamp" at={HASARD} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE REIN ═══════════════════════════════ */
export const Rein: React.FC = () => {
	const frame = useCurrentFrame();
	const FILTRENT = at('rein', 'filtrent');
	const ARTERE = at('rein', "l'artère");
	const VEINE = at('rein', 'veine');
	const PROPRE = at('rein', 'propre');
	const DECHETS = at('rein', 'déchets');
	const BASSINET = at('rein', 'bassinet');
	const URETERE = at('rein', "l'uretère");
	const DESSUS = at('rein', 'au-dessus');
	const SURRENALE = at('rein', 'surrénale');
	const HORMONES = at('rein', 'hormones');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: ARTERE - 4, x: 600, y: 470, s: 1.8},
		{at: DECHETS - 4, x: 470, y: 560, s: 1.4},
		{at: URETERE - 4, x: 560, y: 760, s: 1.6},
		{at: DESSUS - 2, x: 440, y: 300, s: 1.7},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={DECHETS - 6} text={'Le *rein* filtre le sang'} size={92} y={150} center />
			<Big from={DECHETS - 2} to={DESSUS - 6} text={"Les déchets → *l'urine*"} size={92} y={150} center />
			<Big from={DESSUS - 2} text={'La glande *surrénale*'} size={92} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: FILTRENT, to: ARTERE - 6, x: DG.cortex[0], y: DG.cortex[1], r: 90, ry: 200},
					{from: BASSINET, to: URETERE - 4, x: DG.pelvis[0], y: DG.pelvis[1], r: 110, ry: 110},
					{from: URETERE, to: DESSUS - 6, x: DG.ureter[0], y: DG.ureter[1], r: 45, ry: 130},
					{from: SURRENALE, x: DG.adrenal[0], y: DG.adrenal[1], r: 170, ry: 80},
				]}
			>
				<DropFlow paths={[ART]} from={ARTERE - 2} to={DESSUS} speed={0.016} n={6} fill="#E8445A" stroke="#9E1F33" />
				<DropFlow paths={[VEIN]} from={VEINE - 2} to={DESSUS} speed={0.016} n={6} fill={LPI.blue} stroke={N} />
				<DropFlow paths={[URINE]} from={DECHETS - 2} speed={0.012} n={6} />
				{frame >= HORMONES - 4 ? <Sparkle x={440} y={190} from={HORMONES - 4} n={10} spread={150} color={LPI.pink} /> : null}
			</Diagram>
			<Note at={ARTERE} to={VEINE - 6} y={1510} size={46} tone={LPI.pink}>
				l'artère rénale apporte le sang
			</Note>
			<Note at={VEINE} to={DECHETS - 6} y={1510} size={46} tone={LPI.sky}>
				la veine rénale le ramène, propre
			</Note>
			<Note at={BASSINET} to={DESSUS - 6} y={1510} size={46} tone={LPI.paper}>
				le bassinet → l'uretère
			</Note>
			<Note at={HORMONES - 4} y={1510} size={46} tone={LPI.paper}>
				elle fabrique des hormones
			</Note>
			<Sfx name="whoosh" at={ARTERE - 4} volume={0.05} />
			<Sfx name="pop" at={PROPRE} volume={0.04} />
			<Sfx name="whoosh" at={DECHETS - 4} volume={0.05} />
			<Sfx name="whoosh" at={URETERE - 4} volume={0.05} />
			<Sfx name="whoosh" at={DESSUS - 2} volume={0.05} />
			<Sfx name="ding" at={HORMONES - 4} volume={0.05} />
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
				<circle key={i} cx={x + dx} cy={y + dy} r={9 * popAt(frame, from + i * ((to - from) / 12))} fill="#F4B63E" stroke="#B9781A" strokeWidth={1.5} />
			))}
		</g>
	);
};

export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELLULES = at('cancer', 'cellules');
	const MULTIPLIENT = at('cancer', 'multiplient');
	const TUMEUR = at('cancer', 'tumeur');
	const TOUCHE = at('cancer', 'touche');
	const SOIXANTE = at('cancer', 'soixante');
	const DEUX = at('cancer', 'deux');
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	const artO = fadeIn(frame, 0, 8) * (1 - lin(frame, TOUCHE - 8, TOUCHE));
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={'Le *cancer* du rein'} size={96} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={TOUCHE - 8} text={'Une *tumeur*'} size={110} y={150} center />
			{artO > 0.01 ? (
				<AbsoluteFill style={{opacity: artO}}>
					<ArtCard top={330} h={980} />
					<Art which="healthy" cx={540} cy={820} s={2.3} o={1 - toCancer}>
						<PulseRing x={TUMOR_H[0]} y={TUMOR_H[1]} r={40} from={CELLULES} to={MULTIPLIENT + 8} sw={2.5} />
						<Dividing x={TUMOR_H[0]} y={TUMOR_H[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
					</Art>
					<Art which="cancer" cx={540} cy={820} s={2.4} o={toCancer}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={84} from={TUMEUR + 2} sw={3} />
					</Art>
				</AbsoluteFill>
			) : null}
			<Note at={CELLULES + 4} to={TOUCHE - 8} y={1400} size={44} tone={LPI.paper}>
				elles se multiplient sans contrôle
			</Note>
			{frame >= TOUCHE - 4 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, TOUCHE - 4, 6)}}>
					<Big from={TOUCHE - 4} text={'Qui est *touché* ?'} size={104} y={150} center />
					<div style={{position: 'absolute', left: 120, top: 520, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, SOIXANTE - 4)})`, opacity: frame >= SOIXANTE - 4 ? 1 : 0}}>
						<AgeIcon size={300} label="60+" />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 20}}>après 60 ans</div>
					</div>
					<div style={{position: 'absolute', left: 600, top: 520, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, DEUX - 4)})`, opacity: frame >= DEUX - 4 ? 1 : 0}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 200, color: LPI.blue, lineHeight: 1.5}}>×2</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 20}}>plus souvent les hommes</div>
					</div>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="pop" at={SOIXANTE - 4} volume={0.08} />
			<Sfx name="pop" at={DEUX - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const AUCUN = at('signes', 'aucun');
	const PLUS = at('signes', 'plus');
	const SANG = at('signes', 'sang');
	const DOULEUR = at('signes', 'douleur');
	const BOULE = at('signes', 'boule');
	const PARFOIS = at('signes', 'parfois');
	const FATIGUE = at('signes', 'fatigue');
	const FIEVRE = at('signes', 'fièvre');
	const PERTE = at('signes', 'perte');
	const aO = 1 - lin(frame, PLUS - 6, PLUS + 2);
	const rows: [number, string, React.ReactNode][] = [
		[SANG, 'Du sang dans les urines', <BloodUrineIcon key="u" size={120} />],
		[DOULEUR, 'Une douleur dans le flanc', <BackPainIcon key="b" size={120} />],
		[BOULE, 'Une boule dans le ventre', <FlankLumpIcon key="l" size={120} />],
		[FATIGUE, 'Une grande fatigue', <TiredIcon key="t" size={115} />],
		[FIEVRE, 'De la fièvre', <FeverIcon key="f" size={115} />],
		[PERTE, 'Une perte de poids', <WeightLossIcon key="w" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={PLUS - 6} text={'Le *piège*'} size={120} y={150} center />
			<Big from={PLUS - 2} to={PARFOIS - 6} text={'Plus *tard*…'} size={110} y={150} center />
			<Big from={PARFOIS - 2} text={'Parfois *aussi*'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<ArtCard top={360} h={760} />
					<Art which="cancer" cx={540} cy={740} s={1.85} />
					<Stamp at={AUCUN} x={540} y={1260} text="AUCUN SIGNE" size={72} />
				</AbsoluteFill>
			) : null}
			{rows.map(([t, title, icon], i) => (
				<RowCard key={i} at={t - 6} y={320 + i * 190} h={170} art={130} badge={i + 1} title={title} size={48} from={i % 2 ? 'left' : 'right'} dim={i < 3 && frame >= PARFOIS ? 0.3 : 0}>
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

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const TABAC = at('risques', 'tabac');
	const SURPOIDS = at('risques', 'surpoids');
	const HTA = at('risques', "l'hypertension");
	const DIALYSE = at('risques', 'dialyse');
	const MALADIE = at('risques', 'maladie');
	const rows: [number, string, React.ReactNode, string?][] = [
		[TABAC, 'Le tabac', <CigaretteIcon key="t" size={120} color={N} />],
		[SURPOIDS, 'Le surpoids', <ScaleSofaIcon key="s" size={120} />],
		[HTA, "L'hypertension artérielle", <HypertensionIcon key="h" size={115} color={N} />, 'une tension trop haute'],
		[DIALYSE, 'Des années de dialyse', <DialysisIcon key="d" size={120} />],
		[MALADIE, 'Plus rarement : une maladie de famille', <FamilyIcon key="f" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			{rows.map(([t, title, icon, sub], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={t + 10} size={46} from={i % 2 ? 'left' : 'right'}>
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
	const SCANNER = at('examens', 'scanner');
	const MESURE = at('examens', 'mesure');
	const REGARDE = at('examens', 'regarde');
	const ETENDUE = at('examens', 'étendue');
	const BIOPSIE = at('examens', 'biopsie');
	const measure = lin(frame, MESURE - 2, MESURE + 14);
	const needle = lin(frame, BIOPSIE - 4, BIOPSIE + 12);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={BIOPSIE - 6} text={'Le *scanner*'} size={110} y={150} center />
			<Big from={BIOPSIE - 2} text={'Parfois, une *biopsie*'} size={96} y={150} center />
			{frame >= SCANNER - 6 ? (
				<div style={{position: 'absolute', left: 60, top: 330, transform: `scale(${popAt(frame, SCANNER - 6)})`}}>
					<ScannerIcon size={200} />
				</div>
			) : null}
			<div style={{position: 'absolute', left: 290, top: 330, width: 730, height: 900, borderRadius: 40, background: '#0B0D10', boxShadow: SHADOW, overflow: 'hidden', opacity: fadeIn(frame, SCANNER - 4, 8)}}>
				<Art which="cancer" cx={365} cy={450} s={2.2} filter="grayscale(1) contrast(1.4) brightness(0.95)">
					{measure > 0 ? (
						<g>
							<line x1={TUMOR[0] - 72} y1={TUMOR[1]} x2={TUMOR[0] - 72 + 144 * measure} y2={TUMOR[1]} stroke={LPI.blue} strokeWidth={4} strokeDasharray="8 6" />
							<text x={TUMOR[0] - 50} y={TUMOR[1] + 110} fill={LPI.blue} fontSize={30} fontFamily="Arial" fontWeight={700} opacity={measure}>3,2 cm</text>
						</g>
					) : null}
					<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={84} from={REGARDE} to={BIOPSIE - 4} sw={3} />
					{needle > 0 ? <line x1={TUMOR[0] + 160} y1={TUMOR[1] - 160} x2={TUMOR[0] + 160 - 140 * needle} y2={TUMOR[1] - 160 + 140 * needle} stroke="#D7DDE3" strokeWidth={5} strokeLinecap="round" /> : null}
				</Art>
			</div>
			<Note at={MESURE} to={REGARDE - 4} y={1330} size={46} tone={LPI.paper}>
				il mesure la tumeur
			</Note>
			<Note at={REGARDE} to={BIOPSIE - 6} y={1330} size={46} tone={LPI.sky}>
				s'est-elle étendue ?
			</Note>
			<Note at={BIOPSIE} y={1330} size={46} tone={LPI.pink}>
				un petit prélèvement
			</Note>
			<Sfx name="pop" at={SCANNER - 6} volume={0.08} />
			<Sfx name="pop" at={MESURE} volume={0.05} />
			<Sfx name="whoosh" at={ETENDUE} volume={0.04} />
			<Sfx name="pop" at={BIOPSIE} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIR = at('traitement', 'chirurgie');
	const TOUT = at('traitement', 'tout');
	const VIT = at('traitement', 'vit');
	const SEUL = at('traitement', 'seul');
	const PETITES = at('traitement', 'petites');
	const SURVEILLEES = at('traitement', 'surveillées');
	const ETENDU = at('traitement', 'étendu');
	const MEDS = at('traitement', 'médicaments');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[CHIR, 'La chirurgie', <ScalpelIcon key="c" size={120} />, 'la tumeur seule, ou tout le rein', TOUT - 4],
		[VIT, 'On vit bien avec un seul rein', <OneKidneyIcon key="o" size={125} />],
		[PETITES, 'Petites tumeurs : le froid ou la chaleur', <ColdHeatIcon key="h" size={125} />, 'ou une simple surveillance', SURVEILLEES - 4],
		[ETENDU, "S'il s'est étendu : des médicaments", <PillIcon key="p" size={115} color={N} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Pour le *soigner*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={340 + i * 250} h={225} art={160} badge={i + 1} title={title} sub={sub} subAt={subAt} size={46} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Stamp at={SEUL + 4} x={560} y={1440} text="ON VIT TRÈS BIEN !" size={60} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="stamp" at={SEUL + 4} volume={0.1} />
			<Sfx name="ding" at={MEDS} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CONSULTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('fin', 'sang');
	const CONSULTE = at('fin', 'consulte');
	const ARRETER = at('fin', 'arrêter');
	const FUMER = at('fin', 'fumer');
	const POIDS = at('fin', 'poids');
	const TENSION = at('fin', 'tension');
	const REINS = at('fin', 'reins');
	const aO = 1 - lin(frame, ARRETER - 8, ARRETER);
	const icons: [number, React.ReactNode, string][] = [
		[FUMER, <NoSmokeIcon key="n" size={230} />, 'ne pas fumer'],
		[POIDS, <ScaleSofaIcon key="s" size={230} />, 'un poids normal'],
		[TENSION, <HypertensionIcon key="h" size={220} color={N} />, 'sa tension'],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={ARRETER - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={ARRETER - 2} text={'Protéger ses *reins*'} size={104} y={170} center />
			{aO > 0 && frame >= SANG - 4 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<div style={{position: 'absolute', left: 540 - 200, top: 420, transform: `scale(${popAt(frame, SANG - 4)})`}}>
						<BloodUrineIcon size={400} />
					</div>
					<Stamp at={CONSULTE} x={560} y={1000} text="ON CONSULTE" size={72} />
				</AbsoluteFill>
			) : null}
			{icons.map(([t, icon, label], i) =>
				frame >= t - 4 ? (
					<div key={i} style={{position: 'absolute', left: 40 + i * 340, top: 420, width: 320, textAlign: 'center', transform: `scale(${popAt(frame, t - 4)})`}}>
						{icon}
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, marginTop: 10}}>{label}</div>
					</div>
				) : null,
			)}
			<Burst at={REINS} x={540} y={620} r={340} n={12} />
			<Sfx name="pop" at={SANG - 4} volume={0.08} />
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
			{icons.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 4} volume={0.08} />
			))}
			<Sfx name="ding" at={REINS} volume={0.08} />
		</AbsoluteFill>
	);
};
