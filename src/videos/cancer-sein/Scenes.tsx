// Scènes de « Le cancer du sein » (n° 50, voix gratuite d'abord). Accroche sans texte, réaliste : le matin dans la salle
// de bain, ta mère lève le bras, palpe le haut de son sein et sent une petite boule ; « ce n'est rien… » ; la caméra
// plonge vers son sein (loupe sur le schéma). Puis le sein (schéma fourni par le propriétaire, nettoyé de ses
// annotations : graisse, lobules, canaux galactophores, mamelon, muscle pectoral), le cancer (sain / cancer, la tumeur,
// une femme sur huit), les signes, le dépistage, les examens, les risques, les traitements, chute « la palpation chaque
// mois, la mammographie dès 50 ans ». Storyboard : docs/lpi/storyboard-cancer-sein.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {ArmpitIcon, Bathroom, ChemoIcon, LumpIcon, MammoIcon, MUM, MumTowel, NippleIcon, OneInEight, OrangeSkinIcon, PalpationIcon, ScaleSofaIcon, WineSmokeIcon, WomenFamilyIcon} from '../../brand/breast';
import {ScanMonitor} from '../../brand/devices';
import {PillIcon, RibbonIcon, ScalpelIcon} from '../../brand/icons';
import {Stetho} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
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
// Schéma « Le sein et le cancer du sein » fourni par le propriétaire (1536 × 1024), sans ses annotations (demandé) :
// deux calques dans le même repère (le sein en coupe / sein sain et cancer), jamais déformés.
const IMG = {anat: 'images/sein/sein-propre-anatomie.png', focus: 'images/sein/sein-propre-focus.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 330, y: 560, s: 1.22},
	focus: {x: 1137, y: 440, s: 1.35},
	fat: [[395, 300], [180, 870], [470, 715]],
	lobules: [[318, 440], [272, 560], [262, 690]],
	canals: [470, 612],
	nipple: [586, 612],
	muscle: [150, 560],
	healthy: [962, 445],
	cancer: [1312, 445],
	tumor: [1377, 487],
	cCanal: [1250, 505],
	cLobule: [1330, 350],
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
 * fondu du sein en coupe vers la comparaison sain / cancer ; `children` : calques dans le repère de l'image. */
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

/* ── Les deux dessins du calque « focus » (sein sain / cancer), découpés et posés seuls ── */
const REG = {healthy: {x: 784, y: 284, w: 356, h: 314}, cancer: {x: 1136, y: 284, w: 352, h: 314}} as const;
/** Repères dans la découpe « cancer » (pixels) : la tumeur. */
const TUMOR = [DG.tumor[0] - REG.cancer.x, DG.tumor[1] - REG.cancer.y] as const;
/** Un dessin du schéma fourni (sain ou cancer), à l'échelle uniforme `s` (jamais déformé), centré en (cx, cy) ;
 * `filter` CSS (rendu « imagerie ») ; `children` : calques SVG dans le repère de la découpe. */
const BreastArt: React.FC<{which: keyof typeof REG; cx: number; cy: number; s: number; o?: number; filter?: string; children?: React.ReactNode}> = ({which, cx, cy, s, o = 1, filter, children}) => {
	const r = REG[which];
	return (
		<div style={{position: 'absolute', left: cx - (r.w * s) / 2, top: cy - (r.h * s) / 2, width: r.w, height: r.h, transformOrigin: '0 0', transform: `scale(${s})`, opacity: o}}>
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden', filter}}>
				<Img src={staticFile(IMG.focus)} style={{position: 'absolute', left: -r.x, top: -r.y, width: IMG.w, height: IMG.h}} />
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

/* ═══════════════════════════════ ACCROCHE : LA SALLE DE BAIN ═══════════════════════════════ */
const MUM_W = 900;
const MUM_X = 90;
const MUM_Y = 280;
const mumPt = (p: readonly [number, number]) => ({x: MUM_X + (p[0] * MUM_W) / 600, y: MUM_Y + (p[1] * MUM_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MERE = at('intro', 'mère');
	const SENT = at('intro', 'sent');
	const BOULE = at('intro', 'boule');
	const DIT = at('intro', 'dit');
	const RIEN = at('intro', 'rien');
	const PEUT = at('intro', 'peut-être');
	const MAIS = at('intro', 'mais');
	const BOULE2 = at('intro', 'boule', 2);
	const SEIN2 = at('intro', 'sein', 2);
	const MEDECIN = at('intro', 'médecin');
	const raise = lin(frame, MERE - 6, MERE + 8);
	const palp = lin(frame, SENT - 6, SENT + 6);
	const rub = fadeIn(frame, SENT + 4, 4) * (1 - lin(frame, BOULE + 2, BOULE + 6));
	const look = lin(frame, SENT - 2, SENT + 8);
	const worry = Math.min(1, lin(frame, BOULE, BOULE + 6) * (1 - lin(frame, DIT, DIT + 10)) + 0.8 * lin(frame, PEUT, PEUT + 8));
	const smile = lin(frame, RIEN - 8, RIEN + 4) * (1 - lin(frame, PEUT - 4, PEUT + 4));
	// caméra : plongée vers le haut de son sein
	const target = mumPt(MUM.palp);
	const cz = lin(frame, MAIS - 4, BOULE2 + 8);
	const s = 1 + 0.75 * cz;
	const tx = interpolate(cz, [0, 1], [0, 540 - target.x * s]);
	const ty = interpolate(cz, [0, 1], [0, 1000 - target.y * s]);
	const lens = popAt(frame, BOULE2 - 2);
	const head = mumPt(MUM.face);
	return (
		<AbsoluteFill style={{background: '#EEF1F4', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Bathroom>
					<foreignObject x={MUM_X} y={MUM_Y} width={MUM_W} height={MUM_W * 1.7} style={{overflow: 'visible'}}>
						<MumTowel width={MUM_W} raise={raise} palp={palp} rub={rub} worry={worry} smile={smile} look={look} />
					</foreignObject>
				</Bathroom>
				{/* loupe sur le sein : le schéma, la boule entourée */}
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: target.x - 160, top: target.y - 160, width: 320, height: 320, borderRadius: 160, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<BreastArt which="cancer" cx={160 - (TUMOR[0] - REG.cancer.w / 2) * 0.8} cy={160 - (TUMOR[1] - REG.cancer.h / 2) * 0.8} s={0.8}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={70} from={SEIN2 - 2} sw={6} />
						</BreastArt>
					</div>
				) : null}
			</AbsoluteFill>
			{/* « ! » : elle sent la boule */}
			{frame >= BOULE - 2 && frame < DIT + 6 ? (
				<div style={{position: 'absolute', left: head.x + 170, top: head.y - 250, fontFamily: FONT.title, fontWeight: 900, fontSize: 150, color: LPI.pink, WebkitTextStroke: `6px ${N}`, transform: `scale(${popAt(frame, BOULE - 2)}) rotate(10deg)`, opacity: 1 - lin(frame, DIT - 2, DIT + 6)}}>!</div>
			) : null}
			{/* « ce n'est rien… » : bulle de pensée */}
			{frame >= DIT + 2 && frame < MAIS + 4 ? (
				<div style={{position: 'absolute', left: head.x - 520, top: head.y - 330, transform: `scale(${popAt(frame, DIT + 2)})`, opacity: 1 - lin(frame, MAIS - 4, MAIS + 4)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>
							Ce n'est rien…{frame >= PEUT ? <span style={{color: LPI.pink}}> ?</span> : null}
						</span>
					</Bubble>
				</div>
			) : null}
			<Sfx name="tap" at={0} volume={0.04} dur={40} />
			<Sfx name="pop" at={BOULE - 2} volume={0.08} />
			<Sfx name="sigh" at={RIEN - 6} volume={0.25} />
			<Sfx name="whoosh" at={MAIS} volume={0.08} />
			<Sfx name="ding" at={SEIN2} volume={0.07} />
			<Sfx name="pop" at={MEDECIN} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE SEIN ═══════════════════════════════ */
/** Gouttes de lait qui descendent les canaux, des lobules jusqu'au mamelon (repère de l'image). */
const MilkFlow: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	const paths: [number, number][][] = [
		[[318, 470], [430, 560], [586, 612]],
		[[290, 580], [440, 600], [586, 612]],
		[[290, 680], [450, 640], [586, 612]],
	];
	return (
		<g opacity={o}>
			{paths.map((pts, j) =>
				[0, 1, 2].map((i) => {
					const t = (((frame - from) * 0.018 + i / 3 + j * 0.11) % 1 + 1) % 1;
					const [a, b, c] = pts;
					const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0];
					const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1];
					return <circle key={`${j}-${i}`} cx={x} cy={y} r={7} fill="#FFFFFF" stroke={LPI.blue} strokeWidth={2.5} />;
				}),
			)}
		</g>
	);
};

export const Sein: React.FC = () => {
	const frame = useCurrentFrame();
	const GRAISSE = at('sein', 'graisse');
	const GLANDE = at('sein', 'glande');
	const LOBULES = at('sein', 'lobules');
	const PASSE = at('sein', 'passe');
	const CANAUX = at('sein', 'canaux');
	const MAMELON = at('sein', 'mamelon');
	const MUSCLE = at('sein', 'muscle');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: GLANDE - 4, x: 300, y: 560, s: 1.75},
		{at: CANAUX - 6, x: 470, y: 600, s: 2.1},
		{at: MAMELON - 4, x: 530, y: 612, s: 2.6},
		{at: MUSCLE - 6, x: 260, y: 560, s: 1.45},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={LOBULES - 8} text={'Le *sein*'} size={110} y={150} center />
			<Big from={LOBULES - 2} to={CANAUX - 8} text={'Les *lobules*'} size={110} y={150} center />
			<Big from={CANAUX - 2} to={MAMELON - 8} text={'Les *canaux*'} size={110} y={150} center />
			<Big from={MAMELON - 2} to={MUSCLE - 8} text={'Le *mamelon*'} size={110} y={150} center />
			<Big from={MUSCLE - 2} text={'Le *pectoral*'} size={110} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					...DG.fat.map(([x, y]) => ({from: GRAISSE - 2, to: GLANDE - 6, x, y, r: 56})),
					...DG.lobules.map(([x, y]) => ({from: LOBULES - 6, to: CANAUX - 8, x, y, r: 74, ry: 60})),
					{from: CANAUX - 2, to: MAMELON - 6, x: DG.canals[0], y: DG.canals[1], r: 120, ry: 44},
					{from: MAMELON - 2, to: MUSCLE - 8, x: DG.nipple[0], y: DG.nipple[1], r: 30},
					{from: MUSCLE, x: DG.muscle[0], y: DG.muscle[1], r: 70, ry: 360},
				]}
			>
				<MilkFlow from={PASSE - 6} to={MUSCLE - 8} />
			</Diagram>
			<Note at={GRAISSE - 2} to={GLANDE - 6} y={1510} size={46} tone={LPI.paper}>
				surtout de la graisse
			</Note>
			<Note at={GLANDE} to={CANAUX - 8} y={1510} size={46} tone={LPI.sky}>
				la glande qui fabrique le lait
			</Note>
			<Note at={CANAUX} to={MAMELON - 8} y={1510} size={46} tone={LPI.sky}>
				galactophores : ils amènent le lait
			</Note>
			<Note at={MAMELON} to={MUSCLE - 8} y={1510} size={46} tone={LPI.paper}>
				le lait sort par le mamelon
			</Note>
			<Note at={MUSCLE + 2} y={1510} size={46} tone={LPI.paper}>
				le muscle de la poitrine
			</Note>
			<Sfx name="pop" at={GRAISSE - 2} volume={0.06} />
			<Sfx name="whoosh" at={GLANDE - 4} volume={0.05} />
			<Sfx name="pop" at={LOBULES - 6} volume={0.07} />
			<Sfx name="whoosh" at={CANAUX - 6} volume={0.05} />
			<Sfx name="whoosh" at={MAMELON - 4} volume={0.05} />
			<Sfx name="whoosh" at={MUSCLE - 6} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELL = at('cancer', 'cellules');
	const MULTI = at('cancer', 'multiplient');
	const CANAL = at('cancer', 'canal');
	const LOBULE = at('cancer', 'lobule');
	const TUMEUR = at('cancer', 'tumeur');
	const CEST = at('cancer', "c'est");
	const FREQ = at('cancer', 'fréquent');
	const FEMME = at('cancer', 'femme');
	const ENVIRON = at('cancer', 'environ');
	const HUIT = at('cancer', 'huit');
	const diagO = fadeIn(frame, 0, 8) * (1 - lin(frame, CEST - 8, CEST));
	const numO = fadeIn(frame, CEST, 6);
	const keys: CamK[] = [
		{at: 0, x: 300, y: 560, s: 1.75},
		{at: CELL - 8, ...DG.focus},
		{at: MULTI, x: DG.cancer[0] + 10, y: DG.cancer[1] + 10, s: 2.5},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELL - 10} text={'Le *cancer*'} size={110} y={150} center />
			<Big from={CELL - 6} to={MULTI - 6} text={'Sain… ou *cancer* ?'} size={96} y={150} center />
			<Big from={MULTI} to={TUMEUR - 6} text={'Sans *contrôle*'} size={110} y={150} center />
			<Big from={TUMEUR - 2} to={CEST - 8} text={'Une *tumeur*'} size={110} y={150} center />
			{diagO > 0.01 ? (
				<Diagram
					o={diagO}
					focus={fadeIn(frame, CELL - 6, 14)}
					keys={keys}
					rings={[
						...DG.lobules.map(([x, y]) => ({from: 6, to: CELL - 10, x, y, r: 74, ry: 60})),
						{from: CELL - 2, to: MULTI - 4, x: DG.healthy[0], y: DG.healthy[1], r: 165, ry: 145},
						{from: MULTI + 6, to: CANAL - 6, x: DG.tumor[0], y: DG.tumor[1], r: 62},
						{from: CANAL - 2, to: TUMEUR - 6, x: DG.cCanal[0], y: DG.cCanal[1], r: 34},
						{from: LOBULE - 2, to: TUMEUR - 6, x: DG.cLobule[0], y: DG.cLobule[1], r: 44},
						{from: TUMEUR - 2, x: DG.tumor[0], y: DG.tumor[1], r: 66},
					]}
				/>
			) : null}
			<Note at={MULTI + 8} to={CANAL - 6} y={1510} size={42} tone={LPI.pink}>
				des cellules qui se multiplient
			</Note>
			<Note at={CANAL - 2} to={TUMEUR - 6} y={1510} size={42} tone={LPI.paper}>
				le plus souvent : un canal ou un lobule
			</Note>
			{numO > 0 ? (
				<AbsoluteFill style={{opacity: numO}}>
					<Big from={CEST} text={'Le plus *fréquent*'} size={110} y={150} center />
					<div style={{position: 'absolute', left: 0, right: 0, top: 310, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N, opacity: fadeIn(frame, FEMME - 4, 6)}}>
						chez la femme
					</div>
					<div style={{position: 'absolute', left: 440, top: 430, transform: `scale(${popAt(frame, FREQ)})`}}>
						<RibbonIcon size={200} color={LPI.pink} />
					</div>
					<div style={{position: 'absolute', left: 60, top: 680}}>
						<OneInEight width={960} n={8 * lin(frame, ENVIRON - 4, HUIT - 4)} hit={fadeIn(frame, HUIT - 2, 4)} />
					</div>
					<Pill at={HUIT - 2} x={540} y={1420} tone={LPI.paper} size={58}>
						≈ 1 femme sur 8
					</Pill>
				</AbsoluteFill>
			) : null}
			<Burst at={HUIT} x={840} y={1130} r={200} n={10} />
			<Sfx name="whoosh" at={CELL - 8} volume={0.06} />
			<Sfx name="whoosh" at={MULTI} volume={0.06} />
			<Sfx name="pop" at={MULTI + 6} volume={0.07} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="pop" at={FREQ} volume={0.07} />
			<Sfx name="stamp" at={HUIT - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const BOULE = at('signes', 'boule');
	const PEAU = at('signes', 'peau');
	const ORANGE = at('signes', "d'orange");
	const MAMELON = at('signes', 'mamelon');
	const COULE = at('signes', 'coule');
	const BOULE2 = at('signes', 'boule', 2);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={"Les signes *d'alerte*"} size={100} y={150} center />
			<RowCard at={BOULE - 6} y={340} h={220} art={170} badge={1} title="Une boule" sub="dans le sein" subAt={BOULE + 8} size={56}>
				<LumpIcon size={160} />
			</RowCard>
			<RowCard at={PEAU - 6} y={590} h={220} art={170} badge={2} title="La peau qui se creuse" sub="ou en « peau d'orange »" subAt={ORANGE - 4} size={52} from="left">
				<OrangeSkinIcon size={160} />
			</RowCard>
			<RowCard at={MAMELON - 6} y={840} h={220} art={170} badge={3} title="Le mamelon qui rentre" sub="ou qui coule" subAt={COULE - 4} size={52}>
				<NippleIcon size={160} />
			</RowCard>
			<RowCard at={BOULE2 - 6} y={1090} h={220} art={170} badge={4} title="Une boule sous le bras" sub="sous l'aisselle" subAt={BOULE2 + 10} size={52} from="left">
				<ArmpitIcon size={160} />
			</RowCard>
			{[BOULE - 6, PEAU - 6, MAMELON - 6, BOULE2 - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE DÉPISTAGE ═══════════════════════════════ */
export const Depistage: React.FC = () => {
	const frame = useCurrentFrame();
	const PALP = at('depistage', 'palpation');
	const MOIS = at('depistage', 'mois');
	const EXAMEN = at('depistage', 'examen');
	const AN = at('depistage', 'an');
	const CINQ = at('depistage', 'cinquante');
	const MAMMO = at('depistage', 'mammographie');
	const PRISE = at('depistage', 'prise');
	const DEPIST = at('depistage', 'dépistage');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le repérer *tôt*'} size={110} y={150} center />
			<RowCard at={PALP - 6} y={340} h={240} art={190} badge={1} title="La palpation" sub="1 fois par mois" subAt={MOIS - 4} size={56}>
				<PalpationIcon size={180} spin={-frame * 6} />
			</RowCard>
			<RowCard at={EXAMEN - 6} y={610} h={240} art={190} badge={2} title="Médecin ou sage-femme" sub="1 fois par an, dès 25 ans" subAt={AN - 6} size={50} from="left">
				<Stetho size={170} />
			</RowCard>
			<RowCard at={CINQ - 6} y={880} h={240} art={190} badge={3} title="De 50 à 74 ans" sub="mammographie tous les 2 ans" subAt={MAMMO - 4} size={56}>
				<MammoIcon size={180} press={0.5 + 0.5 * Math.sin(frame / 8)} />
			</RowCard>
			<Pill at={PRISE - 2} x={540} y={1230} tone={LPI.sky} size={50}>
				prise en charge à 100 %
			</Pill>
			<Stamp at={DEPIST} x={560} y={1400} text="DÉPISTAGE ORGANISÉ" size={54} />
			<Sfx name="pop" at={PALP - 6} volume={0.08} />
			<Sfx name="pop" at={EXAMEN - 6} volume={0.08} />
			<Sfx name="pop" at={CINQ - 6} volume={0.08} />
			<Sfx name="ding" at={PRISE - 2} volume={0.07} />
			<Sfx name="stamp" at={DEPIST} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const MAMMO = at('examens', 'mammographie');
	const ECHO = at('examens', 'échographie');
	const BIOPSIE = at('examens', 'biopsie');
	const PRELEV = at('examens', 'prélèvement');
	const CONFIRME = at('examens', 'confirme');
	const scanO = 1 - lin(frame, BIOPSIE - 8, BIOPSIE);
	const dO = fadeIn(frame, BIOPSIE - 4, 8);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={BIOPSIE - 6} text={"Si c'est *suspect*…"} size={100} y={150} center />
			{scanO > 0 ? (
				<AbsoluteFill style={{opacity: scanO}}>
					{frame >= MAMMO - 4 ? (
						<div style={{position: 'absolute', left: 540 - 270, top: 330, transform: `scale(${popAt(frame, MAMMO - 4)})`}}>
							<ScanMonitor label="MAMMOGRAPHIE" scan={lin(frame, MAMMO, MAMMO + 40)} width={540} height={470}>
								<BreastArt which="cancer" cx={252} cy={222} s={1.3} filter="grayscale(1) invert(1) contrast(1.2)">
									<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={66} from={MAMMO + 16} sw={4} />
								</BreastArt>
							</ScanMonitor>
						</div>
					) : null}
					{frame >= ECHO - 4 ? (
						<div style={{position: 'absolute', left: 540 - 270, top: 850, transform: `scale(${popAt(frame, ECHO - 4)})`}}>
							<ScanMonitor label="ÉCHOGRAPHIE" scan={lin(frame, ECHO, ECHO + 40)} width={540} height={470}>
								<div style={{position: 'absolute', inset: 0, clipPath: 'polygon(50% 4%, 96% 96%, 4% 96%)', background: '#0E0E0E'}}>
									<BreastArt which="cancer" cx={252 - (TUMOR[0] - REG.cancer.w / 2) * 2.2} cy={300 - (TUMOR[1] - REG.cancer.h / 2) * 2.2} s={2.2} filter="grayscale(1) invert(1) blur(1.5px) contrast(0.9)">
										<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={66} from={ECHO + 16} sw={3} />
									</BreastArt>
								</div>
							</ScanMonitor>
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Big from={BIOPSIE} text={'La *biopsie*'} size={110} y={150} center />
					<ArtCard />
					<BreastArt which="cancer" cx={540} cy={760} s={2.6}>
						{(() => {
							const k = lin(frame, BIOPSIE + 4, PRELEV + 4);
							const sx = TUMOR[0] + 80;
							const sy = TUMOR[1] - 80;
							const ex = sx + (TUMOR[0] + 10 - sx) * k;
							const ey = sy + (TUMOR[1] - 10 - sy) * k;
							return (
								<g>
									<line x1={sx + 14} y1={sy - 14} x2={ex} y2={ey} stroke="#5E6B78" strokeWidth={4} strokeLinecap="round" />
									<line x1={sx + 14} y1={sy - 14} x2={ex} y2={ey} stroke="#D7DEE6" strokeWidth={1.5} strokeLinecap="round" />
									<rect x={sx + 8} y={sy - 44} width={16} height={32} rx={6} fill="#8FBCEB" stroke="#3F6E9E" strokeWidth={2} transform={`rotate(45 ${sx + 16} ${sy - 28})`} />
								</g>
							);
						})()}
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={64} from={CONFIRME - 2} sw={3} />
					</BreastArt>
					<Note at={PRELEV - 2} y={1330} size={44} tone={LPI.paper}>
						un petit prélèvement
					</Note>
					<Stamp at={CONFIRME + 2} x={580} y={1470} text="CONFIRMÉ" size={66} />
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={MAMMO - 4} volume={0.08} />
			<Sfx name="pop" at={ECHO - 4} volume={0.08} />
			<Sfx name="whoosh" at={BIOPSIE - 4} volume={0.06} />
			<Sfx name="pop" at={PRELEV - 2} volume={0.06} />
			<Sfx name="stamp" at={CONFIRME + 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const AGE = at('risques', "l'âge");
	const PROCHE = at('risques', 'proche');
	const FAMILLE = at('risques', 'famille');
	const ALCOOL = at('risques', "l'alcool");
	const SURPOIDS = at('risques', 'surpoids');
	const MANQUE = at('risques', 'manque');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			<RowCard at={AGE - 6} y={340} h={220} art={170} badge={1} title="Avec l'âge" sub="surtout après 50 ans" subAt={AGE + 10} size={56}>
				<AgeIcon size={150} />
			</RowCard>
			<RowCard at={PROCHE - 6} y={590} h={220} art={170} badge={2} title="Une proche touchée" sub="dans la famille" subAt={FAMILLE - 2} size={56} from="left">
				<WomenFamilyIcon size={150} />
			</RowCard>
			<RowCard at={ALCOOL - 6} y={840} h={220} art={170} badge={3} title="L'alcool, le tabac" size={56}>
				<WineSmokeIcon size={150} />
			</RowCard>
			<RowCard at={SURPOIDS - 6} y={1090} h={220} art={170} badge={4} title="Le surpoids" sub="et le manque d'activité" subAt={MANQUE - 2} size={56} from="left">
				<ScaleSofaIcon size={150} />
			</RowCard>
			{[AGE - 6, PROCHE - 6, ALCOOL - 6, SURPOIDS - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIR = at('traitement', 'chirurgie');
	const RETIRE = at('traitement', 'retire');
	const RADIO = at('traitement', 'radiothérapie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const HORM = at('traitement', 'traitement');
	const ET = at('traitement', 'et');
	const DETECTE = at('traitement', 'détecté');
	const GUERIT = at('traitement', 'guérit');
	const NEUF = at('traitement', 'neuf');
	const DIX = at('traitement', 'dix');
	const fade = 1 - lin(frame, ET - 6, ET + 4);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={ET - 6} text={'Pour le *soigner*'} size={110} y={150} center />
			{fade > 0 ? (
				<AbsoluteFill style={{opacity: fade}}>
					<RowCard at={CHIR - 6} y={340} h={220} art={160} badge={1} title="La chirurgie" sub="la tumeur, parfois tout le sein" subAt={RETIRE} size={54}>
						<ScalpelIcon size={140} />
					</RowCard>
					<RowCard at={RADIO - 6} y={590} h={220} art={160} badge={2} title="La radiothérapie" sub="des rayons sur la zone" subAt={RADIO + 14} size={54} from="left">
						<RayIcon size={140} />
					</RowCard>
					<RowCard at={CHIMIO - 6} y={840} h={220} art={160} badge={3} title="La chimiothérapie" sub="des médicaments, souvent en perfusion" subAt={CHIMIO + 14} size={54}>
						<ChemoIcon size={140} />
					</RowCard>
					<RowCard at={HORM - 6} y={1090} h={220} art={160} badge={4} title="L'hormonothérapie" sub="un traitement hormonal" subAt={HORM + 6} size={54} from="left">
						<PillIcon size={140} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			<Big from={DETECTE - 2} text={'Détecté *tôt*…'} size={110} y={150} center />
			{frame >= GUERIT - 4 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N, opacity: fadeIn(frame, GUERIT - 4, 6)}}>
					il guérit dans
				</div>
			) : null}
			{frame >= NEUF - 2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 300, color: LPI.blue, lineHeight: 1, transform: `scale(${popAt(frame, NEUF - 2)})`}}>
					9<span style={{fontSize: 140, color: N}}> / 10</span>
				</div>
			) : null}
			{/* 10 cas : 9 se cochent */}
			{frame >= NEUF - 2
				? Array.from({length: 10}).map((_, i) => {
						const t0 = NEUF + i * 2;
						const ok = i < 9;
						const k = popAt(frame, t0);
						return (
							<div key={i} style={{position: 'absolute', left: 125 + (i % 5) * 180, top: 860 + Math.floor(i / 5) * 190, width: 140, height: 140, borderRadius: 70, background: ok && frame >= t0 + 4 ? LPI.blue : LPI.paper, border: `7px solid ${N}`, transform: `scale(${k})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.paper}}>
								{ok && frame >= t0 + 4 ? '✓' : ''}
							</div>
						);
					})
				: null}
			<Burst at={DIX} x={540} y={560} r={320} n={12} />
			{[CHIR - 6, RADIO - 6, CHIMIO - 6, HORM - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="impact" at={NEUF - 2} volume={0.1} />
			<Sfx name="ding" at={DIX} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : PALPATION ET MAMMOGRAPHIE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const PALP = at('fin', 'palpation');
	const MOIS = at('fin', 'mois');
	const DES = at('fin', 'dès');
	const MAMMO = at('fin', 'mammographie');
	const MEME = at('fin', 'même');
	const BIEN = at('fin', 'bien');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={PALP - 8} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={PALP - 2} to={DES - 6} text={'La *palpation*…'} size={110} y={170} center />
			<Big from={DES - 2} to={MEME - 6} text={'Dès *50* *ans*…'} size={120} y={170} center />
			<Big from={MEME} text={'…même quand *tout* *va* *bien* !'} size={88} y={170} center />
			{frame >= PALP - 4 ? (
				<div style={{position: 'absolute', left: 300 - 150, top: 480, transform: `scale(${popAt(frame, PALP - 4)})`}}>
					<PalpationIcon size={300} spin={-frame * 6} />
				</div>
			) : null}
			<Pill at={MOIS - 4} x={300} y={880} tone={LPI.paper} size={48}>
				chaque mois
			</Pill>
			{frame >= DES - 4 ? (
				<div style={{position: 'absolute', left: 780 - 150, top: 480, transform: `scale(${popAt(frame, DES - 4)})`}}>
					<MammoIcon size={300} press={0.5 + 0.5 * Math.sin(frame / 8)} />
				</div>
			) : null}
			<Pill at={MAMMO - 2} x={780} y={880} tone={LPI.sky} size={48}>
				la mammographie
			</Pill>
			<Burst at={BIEN} x={540} y={700} r={320} n={12} />
			<Sfx name="pop" at={PALP - 4} volume={0.08} />
			<Sfx name="pop" at={DES - 4} volume={0.08} />
			<Sfx name="ding" at={BIEN} volume={0.08} />
		</AbsoluteFill>
	);
};
