// Scènes de « Le cancer colorectal » (n° 52, voix gratuite d'abord). Accroche sans texte, réaliste : dans la cuisine,
// ton père reçoit la lettre du dépistage et la glisse dans un tiroir… deux ans plus tard, encore ; le tiroir garde les
// lettres ; la caméra plonge vers son ventre (loupe sur le schéma). Puis le côlon (schéma fourni par le propriétaire,
// nettoyé de ses annotations : intestin grêle, cæcum, appendice, côlon qui monte, traverse, redescend, sigmoïde,
// rectum, anus), le polype qui devient un cancer (2e cancer qui tue le plus), les signes, le dépistage (test à faire chez
// soi de 50 à 74 ans, tous les 2 ans, gratuit), la coloscopie (retire les polypes), les risques, les traitements, chute
// « cette lettre, il faut l'ouvrir… et faire le test ». Storyboard : docs/lpi/storyboard-cancer-colorectal.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {ChemoIcon, ScaleSofaIcon, WineSmokeIcon} from '../../brand/breast';
import {BellyIcon, Envelope, KIT, Kitchen, KitIcon, MeatIcon, Polyp, TransitIcon} from '../../brand/colorectal';
import {Drop} from '../../brand/hands';
import {RibbonIcon, ScalpelIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {DadBalcony} from '../../brand/lungcancer';
import {WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {AgeIcon, FamilyIcon, RayIcon} from '../../brand/prostate';
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
// Schéma « Le côlon, le rectum et le cancer colorectal » fourni par le propriétaire (1536 × 1024), sans ses annotations
// (demandé) : deux calques dans le même repère (le côlon dans le ventre / côlon sain ou avec cancer), jamais déformés.
const IMG = {anat: 'images/colon/colon-propre-anatomie.png', focus: 'images/colon/colon-propre-focus.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 425, y: 600, s: 1.22},
	focus: {x: 1140, y: 425, s: 1.6},
	grele: [440, 520],
	caecum: [240, 640],
	appendix: [292, 740],
	ascending: [215, 460],
	transverse: [430, 318],
	descending: [652, 455],
	sigmoid: [560, 702],
	rectum: [432, 840],
	anus: [425, 945],
	tubeH: [997, 425],
	tubeC: [1300, 425],
	tumor: [1355, 472],
} as const;
/** Le trajet dans le côlon, du cæcum jusqu'à l'anus (pixels de l'image). */
const CPATH: [number, number][] = [
	[250, 655], [228, 560], [215, 420], [228, 305], [330, 300], [430, 322], [560, 302], [650, 300], [656, 420], [656, 560], [640, 650], [560, 705],
	[480, 690], [432, 760], [430, 860], [425, 945],
];
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
 * fondu du côlon vers la comparaison sain / cancer ; `children` : calques dans le repère de l'image. */
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
	tubeH: {x: 842, y: 248, w: 314, h: 352, layer: IMG.focus},
	tubeC: {x: 1160, y: 248, w: 330, h: 352, layer: IMG.focus},
	body: {x: 20, y: 110, w: 800, h: 900, layer: IMG.anat},
} as const;
/** Repères dans les découpes (pixels) : la tumeur (tubeC), l'endroit où pousse le polype (tubeH). */
const TUMOR = [DG.tumor[0] - REG.tubeC.x, DG.tumor[1] - REG.tubeC.y] as const;
const POLYP = [203, 277] as const;
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
/** Particules qui avancent dans le côlon du schéma (ce qu'on mange), du cæcum jusqu'à l'anus. */
const Flow: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{Array.from({length: 9}).map((_, i) => {
				const t = (((frame - from) * 0.006 + i / 9) % 1 + 1) % 1;
				const [x, y] = along(CPATH, t);
				return <circle key={i} cx={x} cy={y} r={9} fill={LPI.sky} stroke={LPI.blue} strokeWidth={3} />;
			})}
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : LA LETTRE DANS LE TIROIR ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 300;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});
const ON_TOP = {x: 400, y: 1210};
const IN_DRAWER = {x: KIT.drawer.x + 60, y: KIT.drawer.y + 30};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const LETTRE = at('intro', 'lettre');
	const GLISSE = at('intro', 'glisse');
	const TIROIR = at('intro', 'tiroir');
	const PLUS = at('intro', 'plus');
	const DEUX = at('intro', 'deux');
	const NOUVELLE = at('intro', 'nouvelle');
	const ENCORE = at('intro', 'encore');
	const TIROIR2 = at('intro', 'tiroir', 2);
	const POURTANT = at('intro', 'pourtant');
	const REPERER = at('intro', 'repérer');
	const CANCER = at('intro', 'cancer');
	const COLORECTAL = at('intro', 'colorectal');
	// tiroir : ouvert pour la 1re lettre, refermé ; rouvert pour la 2e (on voit la 1re dedans), reste ouvert
	const drawer = lin(frame, GLISSE - 6, GLISSE + 4) * (1 - lin(frame, TIROIR + 10, TIROIR + 20)) + lin(frame, ENCORE - 6, ENCORE + 4);
	const inside = frame >= TIROIR2 + 4 ? 2 : frame >= TIROIR + 4 ? 1 : 0;
	const letter = (t0: number, slide: number, end: number) => {
		const fly = lin(frame, t0 - 10, t0 + 6);
		const go = lin(frame, slide, end);
		const x = interpolate(fly, [0, 1], [-320, ON_TOP.x]) + (IN_DRAWER.x - ON_TOP.x) * go;
		const y = interpolate(fly, [0, 1], [1050, ON_TOP.y]) + (IN_DRAWER.y - ON_TOP.y) * go - 40 * Math.sin(Math.PI * fly);
		return {x, y, rot: (1 - fly) * -30 + go * 6, o: frame < t0 - 10 || frame > end ? 0 : 1, s: 1 - 0.1 * go};
	};
	const l1 = letter(LETTRE, GLISSE - 2, TIROIR + 6);
	const l2 = letter(NOUVELLE, ENCORE, TIROIR2 + 6);
	const flip = lin(frame, DEUX - 2, DEUX + 14);
	const shrug = lin(frame, PLUS - 8, PLUS + 4) * (1 - lin(frame, DEUX - 4, DEUX + 6)) + lin(frame, TIROIR2 - 6, TIROIR2 + 4) * (1 - lin(frame, POURTANT - 4, POURTANT + 4));
	const worry = lin(frame, POURTANT, POURTANT + 8);
	// caméra : vers le tiroir plein de lettres, puis vers son ventre
	const drawerPt = {x: KIT.drawer.x + KIT.drawer.w / 2, y: KIT.drawer.y + 100};
	const belly = dadPt([300, 600]);
	const c1 = lin(frame, POURTANT - 4, POURTANT + 12) * (1 - lin(frame, REPERER - 6, REPERER + 8));
	const c2 = lin(frame, CANCER - 8, CANCER + 8);
	const s = 1 + 0.55 * c1 + 0.5 * c2;
	const f = c2 > 0 ? belly : drawerPt;
	const k = Math.max(c1, c2);
	const tx = interpolate(k, [0, 1], [0, 540 - f.x * s]);
	const ty = interpolate(k, [0, 1], [0, 1000 - f.y * s]);
	const lens = popAt(frame, CANCER - 2);
	const head = dadPt([300, 220]);
	const Letter = ({l}: {l: ReturnType<typeof letter>}) =>
		l.o > 0 ? (
			<g transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}>
				<foreignObject x={0} y={0} width={280} height={190} style={{overflow: 'visible'}}>
					<Envelope width={260} />
				</foreignObject>
			</g>
		) : null;
	return (
		<AbsoluteFill style={{background: '#F3EDE3', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Kitchen year="2024" nextYear="2026" flip={flip} drawer={drawer} inside={inside} onTop={<><Letter l={l1} /><Letter l={l2} /></>}>
					<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
						<DadBalcony width={DAD_W} cig={false} shrug={shrug} worry={worry} />
					</foreignObject>
				</Kitchen>
				{/* loupe sur le ventre : le côlon du schéma, la tumeur entourée */}
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: belly.x - 170, top: belly.y - 200, width: 340, height: 340, borderRadius: 170, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<Art which="tubeC" cx={170} cy={170} s={1.0}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={56} from={COLORECTAL - 4} sw={5} />
						</Art>
					</div>
				) : null}
			</AbsoluteFill>
			{/* « plus tard… » : bulle de pensée */}
			{frame >= PLUS - 4 && frame < DEUX + 4 ? (
				<div style={{position: 'absolute', left: head.x - 520, top: head.y - 330, transform: `scale(${popAt(frame, PLUS - 4)})`, opacity: 1 - lin(frame, DEUX - 4, DEUX + 4)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>Plus tard…</span>
					</Bubble>
				</div>
			) : null}
			<Sfx name="whoosh" at={LETTRE - 10} volume={0.06} />
			<Sfx name="pop" at={LETTRE + 4} volume={0.06} />
			<Sfx name="whoosh" at={GLISSE} volume={0.05} />
			<Sfx name="tap" at={TIROIR + 16} volume={0.06} dur={8} />
			<Sfx name="whoosh" at={DEUX} volume={0.07} />
			<Sfx name="whoosh" at={NOUVELLE - 10} volume={0.06} />
			<Sfx name="pop" at={NOUVELLE + 4} volume={0.06} />
			<Sfx name="whoosh" at={POURTANT} volume={0.07} />
			<Sfx name="ding" at={COLORECTAL - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CÔLON ═══════════════════════════════ */
export const Colon: React.FC = () => {
	const frame = useCurrentFrame();
	const GRELE = at('colon', 'grêle');
	const COLON = at('colon', 'côlon');
	const GROS = at('colon', 'gros');
	const CAECUM = at('colon', 'cæcum');
	const APPENDICE = at('colon', "l'appendice");
	const MONTE = at('colon', 'monte');
	const TRAVERSE = at('colon', 'traverse');
	const REDESCEND = at('colon', 'redescend');
	const SIGMOIDE = at('colon', 'sigmoïde');
	const RECTUM = at('colon', 'rectum');
	const ANUS = at('colon', "l'anus");
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: GRELE - 4, x: 440, y: 520, s: 1.8},
		{at: COLON - 4, ...DG.all},
		{at: CAECUM - 4, x: 265, y: 680, s: 2.3},
		{at: MONTE - 4, x: 300, y: 450, s: 1.6},
		{at: TRAVERSE - 2, x: 440, y: 360, s: 1.6},
		{at: REDESCEND - 2, x: 600, y: 480, s: 1.6},
		{at: SIGMOIDE - 6, x: 540, y: 720, s: 2.0},
		{at: RECTUM - 6, x: 440, y: 840, s: 1.9},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={COLON - 8} text={"L'intestin *grêle*"} size={104} y={150} center />
			<Big from={COLON - 2} to={CAECUM - 8} text={'Le *côlon*'} size={110} y={150} center />
			<Big from={CAECUM - 2} to={MONTE - 8} text={'Le *cæcum*'} size={110} y={150} center />
			<Big from={MONTE - 2} to={SIGMOIDE - 8} text={'Le côlon fait le *tour*'} size={96} y={150} center />
			<Big from={SIGMOIDE - 2} to={RECTUM - 8} text={'Le *sigmoïde*'} size={110} y={150} center />
			<Big from={RECTUM - 2} text={'Le *rectum*, *l\'anus*'} size={96} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: GRELE, to: COLON - 6, x: DG.grele[0], y: DG.grele[1], r: 160, ry: 130},
					{from: CAECUM, to: MONTE - 6, x: DG.caecum[0], y: DG.caecum[1], r: 60},
					{from: APPENDICE - 2, to: MONTE - 6, x: DG.appendix[0], y: DG.appendix[1], r: 28, ry: 48},
					{from: MONTE, to: TRAVERSE - 4, x: DG.ascending[0], y: DG.ascending[1], r: 55, ry: 180},
					{from: TRAVERSE, to: REDESCEND - 4, x: DG.transverse[0], y: DG.transverse[1], r: 230, ry: 55},
					{from: REDESCEND, to: SIGMOIDE - 6, x: DG.descending[0], y: DG.descending[1], r: 55, ry: 180},
					{from: SIGMOIDE, to: RECTUM - 6, x: DG.sigmoid[0], y: DG.sigmoid[1], r: 110, ry: 55},
					{from: RECTUM, x: DG.rectum[0], y: DG.rectum[1], r: 50, ry: 90},
					{from: ANUS, x: DG.anus[0], y: DG.anus[1], r: 26},
				]}
			>
				<Flow from={COLON} to={1e9} />
			</Diagram>
			<Note at={GRELE + 4} to={COLON - 8} y={1510} size={46} tone={LPI.paper}>
				ce qu'on mange y passe d'abord
			</Note>
			<Note at={GROS - 2} to={CAECUM - 8} y={1510} size={46} tone={LPI.sky}>
				le gros intestin
			</Note>
			<Note at={APPENDICE - 2} to={MONTE - 8} y={1510} size={46} tone={LPI.paper}>
				+ l'appendice
			</Note>
			<Note at={SIGMOIDE + 2} to={RECTUM - 8} y={1510} size={46} tone={LPI.sky}>
				une boucle en forme de S
			</Note>
			<Note at={ANUS - 2} y={1510} size={46} tone={LPI.paper}>
				la sortie
			</Note>
			<Sfx name="whoosh" at={GRELE - 4} volume={0.05} />
			<Sfx name="whoosh" at={COLON - 4} volume={0.05} />
			<Sfx name="whoosh" at={CAECUM - 4} volume={0.05} />
			<Sfx name="pop" at={APPENDICE - 2} volume={0.06} />
			<Sfx name="whoosh" at={MONTE - 4} volume={0.04} />
			<Sfx name="whoosh" at={SIGMOIDE - 6} volume={0.05} />
			<Sfx name="whoosh" at={RECTUM - 6} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ DU POLYPE AU CANCER ═══════════════════════════════ */
export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const POLYPE = at('cancer', 'polype');
	const BOULE = at('cancer', 'boule');
	const DANGER = at('cancer', 'danger');
	const ANNEES = at('cancer', 'années');
	const DEVIENNENT = at('cancer', 'deviennent');
	const DEUXIEME = at('cancer', 'deuxième');
	const TUE = at('cancer', 'tue');
	const artO = fadeIn(frame, 0, 8) * (1 - lin(frame, DEUXIEME - 8, DEUXIEME));
	const toCancer = lin(frame, ANNEES + 4, DEVIENNENT + 4);
	const numO = fadeIn(frame, DEUXIEME, 6);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={POLYPE - 8} text={'Le *cancer* *colorectal*'} size={92} y={150} center />
			<Big from={POLYPE - 2} to={ANNEES - 6} text={'Un *polype*'} size={110} y={150} center />
			<Big from={ANNEES} to={DEUXIEME - 8} text={'Avec les *années*…'} size={100} y={150} center />
			{artO > 0.01 ? (
				<AbsoluteFill style={{opacity: artO}}>
					<ArtCard />
					<Art which="tubeH" cx={540} cy={760} s={2.5} o={1 - toCancer}>
						<Polyp x={POLYP[0]} y={POLYP[1]} angle={-45} grow={lin(frame, POLYPE - 4, POLYPE + 14) * (1 + 0.4 * lin(frame, ANNEES, DEVIENNENT))} r={18} />
						<PulseRing x={POLYP[0] - 22} y={POLYP[1] - 22} r={26} from={BOULE} to={ANNEES} sw={2.5} />
					</Art>
					<Art which="tubeC" cx={540} cy={760} s={2.5} o={toCancer}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={56} from={DEVIENNENT + 2} sw={3} />
					</Art>
				</AbsoluteFill>
			) : null}
			<Note at={BOULE - 2} to={DANGER - 4} y={1330} size={44} tone={LPI.paper}>
				une petite boule sur la paroi
			</Note>
			{frame < ANNEES + 8 ? (
				<AbsoluteFill style={{opacity: 1 - lin(frame, ANNEES - 2, ANNEES + 6)}}>
					<Pill at={DANGER - 2} x={540} y={1340} tone={LPI.sky} size={48}>
						au début : sans danger ✓
					</Pill>
				</AbsoluteFill>
			) : null}
			<Note at={DEVIENNENT} to={DEUXIEME - 8} y={1450} size={46} tone={LPI.pink}>
				certains deviennent un cancer
			</Note>
			{numO > 0 ? (
				<AbsoluteFill style={{opacity: numO}}>
					<Big from={DEUXIEME} text={'En *France*…'} size={110} y={150} center />
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 380, color: LPI.blue, lineHeight: 1, transform: `scale(${popAt(frame, DEUXIEME)})`}}>
						2<span style={{fontSize: 160}}>e</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, opacity: fadeIn(frame, TUE - 4, 6)}}>
						cancer qui tue le plus
					</div>
					<div style={{position: 'absolute', left: 440, top: 940, transform: `scale(${popAt(frame, TUE)})`}}>
						<RibbonIcon size={200} color={LPI.blue} />
					</div>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={POLYPE - 4} volume={0.07} />
			<Sfx name="ding" at={DANGER - 2} volume={0.06} />
			<Sfx name="whoosh" at={ANNEES + 4} volume={0.06} />
			<Sfx name="impact" at={DEUXIEME} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const DEBUT = at('signes', 'début');
	const AUCUN = at('signes', 'aucun');
	const PLUS = at('signes', 'plus');
	const SANG = at('signes', 'sang');
	const TRANSIT = at('signes', 'transit');
	const DIARRHEE = at('signes', 'diarrhée');
	const DOULEURS = at('signes', 'douleurs');
	const FATIGUE = at('signes', 'fatigue');
	const PERTE = at('signes', 'perte');
	const aO = 1 - lin(frame, PLUS - 8, PLUS);
	return (
		<AbsoluteFill>
			<Bg />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<Big from={0} text={'Le *piège*'} size={120} y={150} center />
					<ArtCard top={330} h={820} />
					<Art which="tubeC" cx={540} cy={740} s={2.2}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={56} from={DEBUT} sw={3} />
					</Art>
					<Note at={DEBUT + 2} y={1250} size={46} tone={LPI.paper}>
						au début : souvent rien
					</Note>
					<Stamp at={AUCUN} x={600} y={1400} text="AUCUN SIGNE" size={62} />
				</AbsoluteFill>
			) : null}
			<Big from={PLUS} text={'Plus *tard*…'} size={110} y={150} center />
			<RowCard at={SANG - 6} y={340} h={220} art={170} badge={1} title="Du sang dans les selles" size={52}>
				<Drop size={110} />
			</RowCard>
			<RowCard at={TRANSIT - 6} y={590} h={220} art={170} badge={2} title="Un transit qui change" sub="diarrhée ou constipation qui dure" subAt={DIARRHEE - 4} size={52} from="left">
				<TransitIcon size={150} />
			</RowCard>
			<RowCard at={DOULEURS - 6} y={840} h={220} art={170} badge={3} title="Des douleurs au ventre" size={52}>
				<BellyIcon size={150} />
			</RowCard>
			<RowCard at={FATIGUE - 6} y={1090} h={220} art={170} badge={4} title="De la fatigue" sub="et une perte de poids" subAt={PERTE - 4} size={52} from="left">
				<WeightLossIcon size={150} />
			</RowCard>
			<Sfx name="stamp" at={AUCUN} volume={0.12} />
			{[SANG - 6, TRANSIT - 6, DOULEURS - 6, FATIGUE - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE DÉPISTAGE ═══════════════════════════════ */
export const Depistage: React.FC = () => {
	const frame = useCurrentFrame();
	const CINQ = at('depistage', 'cinquante');
	const DEUX = at('depistage', 'deux');
	const TEST = at('depistage', 'test');
	const INVISIBLE = at('depistage', 'invisible');
	const GRATUIT = at('depistage', 'gratuit');
	const MINUTES = at('depistage', 'minutes');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={TEST - 6} text={'La bonne *nouvelle*'} size={104} y={150} center />
			<Big from={TEST - 2} text={'Un test à faire *chez* *soi*'} size={88} y={150} center />
			<RowCard at={CINQ - 6} y={340} h={220} art={170} title="De 50 à 74 ans" sub="tous les 2 ans" subAt={DEUX - 4} size={58}>
				<AgeIcon size={150} />
			</RowCard>
			{frame >= TEST - 4 ? (
				<div style={{position: 'absolute', left: 540 - 190, top: 620, transform: `scale(${popAt(frame, TEST - 4)})`}}>
					<KitIcon size={380} />
				</div>
			) : null}
			<Note at={INVISIBLE - 6} y={1080} size={44} tone={LPI.pink}>
				il cherche du sang invisible dans les selles
			</Note>
			<Pill at={GRATUIT - 4} x={330} y={1230} tone={LPI.paper} size={56}>
				gratuit
			</Pill>
			<Pill at={MINUTES - 8} x={740} y={1230} tone={LPI.sky} size={48}>
				quelques minutes
			</Pill>
			<Sfx name="pop" at={CINQ - 6} volume={0.08} />
			<Sfx name="pop" at={TEST - 4} volume={0.08} />
			<Sfx name="ding" at={GRATUIT - 4} volume={0.07} />
			<Sfx name="pop" at={MINUTES - 8} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA COLOSCOPIE ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const POSITIF = at('examens', 'positif');
	const COLOSCOPIE = at('examens', 'coloscopie');
	const CAMERA = at('examens', 'caméra');
	const PAROI = at('examens', 'paroi');
	const RETIRE = at('examens', 'retire');
	const POLYPES = at('examens', 'polypes');
	const AVANT = at('examens', 'avant');
	// le coloscope remonte de l'anus jusqu'au cæcum (trajet inverse)
	const REV = [...CPATH].reverse();
	const reach = lin(frame, CAMERA - 4, PAROI + 10);
	const head = along(REV, reach);
	const nSeg = REV.length - 1;
	const drawn = REV.slice(0, Math.floor(reach * nSeg) + 1).concat([head]);
	const aO = 1 - lin(frame, RETIRE - 8, RETIRE);
	const bO = fadeIn(frame, RETIRE - 4, 8);
	const cut = lin(frame, POLYPES - 2, AVANT + 6);
	const keys: CamK[] = [{at: 0, ...DG.all}];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={COLOSCOPIE - 6} text={'Test *positif* ?'} size={110} y={150} center />
			<Big from={COLOSCOPIE - 2} text={'La *coloscopie*'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<Diagram keys={keys}>
						{reach > 0 ? (
							<g>
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke="#7E8CA0" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
								<circle cx={head[0]} cy={head[1]} r={26} fill={alpha(LPI.sky, 0.45)} />
								<circle cx={head[0]} cy={head[1]} r={11} fill={N} />
								<circle cx={head[0]} cy={head[1]} r={4} fill={LPI.sky} opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
							</g>
						) : null}
					</Diagram>
					<Note at={CAMERA - 4} y={1510} size={46} tone={LPI.sky}>
						une petite caméra dans le côlon
					</Note>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<ArtCard />
					<Art which="tubeH" cx={540} cy={760} s={2.5}>
						<g transform={`translate(${-60 * cut} ${-80 * cut})`} opacity={1 - lin(frame, AVANT + 6, AVANT + 14)}>
							<Polyp x={POLYP[0]} y={POLYP[1]} angle={-45} r={14} />
						</g>
						{/* l'anse du coloscope qui attrape le polype */}
						<g opacity={fadeIn(frame, RETIRE - 2, 6) * (1 - lin(frame, AVANT + 6, AVANT + 14))}>
							<path d={`M${110 - 60 * cut} ${120 - 80 * cut} L${POLYP[0] - 30 - 60 * cut} ${POLYP[1] - 30 - 80 * cut}`} stroke={N} strokeWidth={4} strokeLinecap="round" />
							<ellipse cx={POLYP[0] - 22 - 60 * cut} cy={POLYP[1] - 22 - 80 * cut} rx={20 - 8 * lin(frame, RETIRE, POLYPES)} ry={14 - 6 * lin(frame, RETIRE, POLYPES)} fill="none" stroke="#5E6B78" strokeWidth={2.5} />
						</g>
						<PulseRing x={POLYP[0] - 22} y={POLYP[1] - 22} r={30} from={RETIRE + 2} to={POLYPES} sw={2.5} />
					</Art>
					<Note at={RETIRE} y={1330} size={44} tone={LPI.paper}>
						il retire les polypes
					</Note>
					<Stamp at={AVANT + 2} x={580} y={1460} text="AVANT LE CANCER" size={56} />
				</AbsoluteFill>
			) : null}
			<Sfx name="whoosh" at={POSITIF} volume={0.06} />
			<Sfx name="whoosh" at={CAMERA - 4} volume={0.05} />
			<Sfx name="pop" at={RETIRE} volume={0.07} />
			<Sfx name="stamp" at={AVANT + 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const AGE = at('risques', "l'âge");
	const PROCHE = at('risques', 'proche');
	const VIANDE = at('risques', 'viande');
	const CHARCUTERIE = at('risques', 'charcuterie');
	const ALCOOL = at('risques', "l'alcool");
	const SURPOIDS = at('risques', 'surpoids');
	const MANQUE = at('risques', 'manque');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			<RowCard at={AGE - 6} y={330} h={185} art={150} badge={1} title="Avec l'âge" size={52}>
				<AgeIcon size={130} />
			</RowCard>
			<RowCard at={PROCHE - 6} y={535} h={185} art={150} badge={2} title="Un proche touché" size={52} from="left">
				<FamilyIcon size={130} />
			</RowCard>
			<RowCard at={VIANDE - 6} y={740} h={185} art={150} badge={3} title="La viande rouge" sub="et la charcuterie" subAt={CHARCUTERIE - 4} size={52}>
				<MeatIcon size={130} />
			</RowCard>
			<RowCard at={ALCOOL - 6} y={945} h={185} art={150} badge={4} title="L'alcool, le tabac" size={52} from="left">
				<WineSmokeIcon size={130} />
			</RowCard>
			<RowCard at={SURPOIDS - 6} y={1150} h={185} art={150} badge={5} title="Le surpoids" sub="et le manque d'activité" subAt={MANQUE - 2} size={52}>
				<ScaleSofaIcon size={130} />
			</RowCard>
			{[AGE - 6, PROCHE - 6, VIANDE - 6, ALCOOL - 6, SURPOIDS - 6].map((t) => (
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
	const CHIMIO = at('traitement', 'chimiothérapie');
	const RADIO = at('traitement', 'radiothérapie');
	const ET = at('traitement', 'et', 2);
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
					<RowCard at={CHIR - 6} y={360} h={230} art={170} badge={1} title="La chirurgie" sub="retire la partie malade" subAt={RETIRE} size={56}>
						<ScalpelIcon size={150} />
					</RowCard>
					<RowCard at={CHIMIO - 6} y={620} h={230} art={170} badge={2} title="Parfois : la chimiothérapie" size={50} from="left">
						<ChemoIcon size={150} />
					</RowCard>
					<RowCard at={RADIO - 6} y={880} h={230} art={170} badge={3} title="… ou la radiothérapie" size={52}>
						<RayIcon size={150} />
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
			{frame >= NEUF - 2
				? Array.from({length: 10}).map((_, i) => {
						const t0 = NEUF + i * 2;
						const ok = i < 9;
						return (
							<div key={i} style={{position: 'absolute', left: 125 + (i % 5) * 180, top: 860 + Math.floor(i / 5) * 190, width: 140, height: 140, borderRadius: 70, background: ok && frame >= t0 + 4 ? LPI.blue : LPI.paper, border: `7px solid ${N}`, transform: `scale(${popAt(frame, t0)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.paper}}>
								{ok && frame >= t0 + 4 ? '✓' : ''}
							</div>
						);
					})
				: null}
			<Burst at={DIX} x={540} y={560} r={320} n={12} />
			{[CHIR - 6, CHIMIO - 6, RADIO - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="impact" at={NEUF - 2} volume={0.1} />
			<Sfx name="ding" at={DIX} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : OUVRIR LA LETTRE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const LETTRE = at('fin', 'lettre');
	const OUVRIR = at('fin', "l'ouvrir");
	const FAIRE = at('fin', 'faire');
	const TEST = at('fin', 'test');
	const open = lin(frame, OUVRIR - 4, OUVRIR + 8);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={LETTRE - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={LETTRE - 2} to={FAIRE - 6} text={'Cette lettre…'} size={110} y={170} center />
			<Big from={FAIRE - 2} text={'…on fait le *test* !'} size={104} y={170} center />
			{frame >= LETTRE - 4 ? (
				<div style={{position: 'absolute', left: 540 - 260, top: 760, transform: `scale(${popAt(frame, LETTRE - 4)})`}}>
					<Envelope width={520} open={open} />
				</div>
			) : null}
			{frame >= TEST - 6 ? (
				<div style={{position: 'absolute', left: 540 - 150, top: 420 + 120 * (1 - lin(frame, TEST - 6, TEST + 6)), transform: `scale(${popAt(frame, TEST - 6)})`}}>
					<KitIcon size={300} />
				</div>
			) : null}
			<Burst at={TEST + 4} x={540} y={600} r={320} n={12} />
			<Sfx name="pop" at={LETTRE - 4} volume={0.08} />
			<Sfx name="whoosh" at={OUVRIR - 4} volume={0.06} />
			<Sfx name="ding" at={TEST + 4} volume={0.08} />
		</AbsoluteFill>
	);
};
