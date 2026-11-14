// Scènes de « Le cancer de la vessie » (n° 53, voix gratuite d'abord). Accroche sans texte, réaliste : les toilettes vues
// d'en haut, l'eau se teinte de rouge ; ton grand-père, dans la salle de bain, hausse les épaules (« ça ne fait pas
// mal… ») ; la caméra plonge vers son bas-ventre (loupe sur la vessie avec sa tumeur). Puis l'appareil urinaire (schéma
// fourni par le propriétaire, nettoyé de ses annotations : reins, uretères, vessie, urètre, l'urine qui descend), le
// cancer (cellules de la paroi qui se multiplient, tumeur sur la couche intérieure, surtout les hommes après 60 ans), les
// signes (sang dans les urines sans douleur, qui disparaît puis revient), le tabac (les toxiques passent dans le sang,
// les reins, l'urine, au contact de la paroi : un cas sur deux), les examens (cystoscopie), les autres risques, les
// traitements, chute « du sang dans les urines, même une seule fois, on consulte ». Storyboard :
// docs/lpi/storyboard-cancer-vessie.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {BloodUrineIcon, BurningIcon, ChemicalIcon, ComeBackIcon, InstillIcon, BladderOutIcon, LOO_WATER, MaleIcon, ScopeIcon, ToiletTop, UrgeIcon, UrineTestIcon} from '../../brand/bladder';
import {Bathroom, EchoIcon} from '../../brand/breast';
import {CigaretteIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {DadBalcony, NoSmokeIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {AgeIcon} from '../../brand/prostate';
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
// Schéma « La vessie et le cancer de la vessie » fourni par le propriétaire (1536 × 1024), sans ses annotations
// (demandé) : deux calques dans le même repère (l'appareil urinaire dans le corps / vessie saine ou avec cancer).
const IMG = {anat: 'images/vessie/vessie-propre-anatomie.png', focus: 'images/vessie/vessie-propre-focus.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 395, y: 567, s: 1.25},
	kidneyL: [290, 312],
	kidneyR: [625, 312],
	ureterL: [345, 470],
	ureterR: [575, 470],
	bladder: [452, 715],
	urethra: [452, 935],
} as const;
/** Trajets de l'urine (pixels de l'image) : du rein à la vessie par chaque uretère, puis l'urètre. */
const URL: [number, number][] = [[352, 300], [375, 350], [376, 380], [372, 410], [356, 440], [340, 470], [328, 500], [323, 530], [315, 560], [313, 590], [316, 620], [332, 652], [380, 760]];
const URR: [number, number][] = [[566, 300], [544, 350], [546, 380], [556, 410], [566, 440], [580, 470], [590, 500], [596, 530], [600, 560], [596, 590], [591, 620], [578, 652], [525, 760]];
const URETHRA: [number, number][] = [[452, 790], [452, 860], [452, 1010]];
/** Le sang qui arrive aux reins : l'aorte, puis les artères des reins. */
const BLOODL: [number, number][] = [[480, 150], [480, 290], [400, 292], [320, 305]];
const BLOODR: [number, number][] = [[480, 150], [480, 290], [550, 294], [600, 305]];

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

/* ── Les deux vessies du calque « focus », découpées et posées seules ── */
const REG = {
	healthy: {x: 790, y: 245, w: 345, h: 345, layer: IMG.focus},
	cancer: {x: 1148, y: 245, w: 334, h: 345, layer: IMG.focus},
} as const;
/** Repères dans la découpe de la vessie avec cancer (pixels) : la tumeur, le col (sortie vers l'urètre). */
const TUMOR = [1378 - REG.cancer.x, 443 - REG.cancer.y] as const;
const NECK = [1314 - REG.cancer.x, 345] as const;
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
/** Gouttes d'urine (jaunes) qui descendent en boucle le long des trajets donnés. */
const UrineFlow: React.FC<{paths: [number, number][][]; from: number; to?: number; speed?: number; n?: number}> = ({paths, from, to = 1e9, speed = 0.012, n = 5}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{paths.map((p, j) =>
				Array.from({length: n}).map((_, i) => {
					const t = (((frame - from) * speed + i / n + j * 0.1) % 1 + 1) % 1;
					const [x, y] = along(p, t);
					return <circle key={`${j}-${i}`} cx={x} cy={y} r={8} fill="#FFD84D" stroke="#C99A1A" strokeWidth={2.5} opacity={Math.min(1, t * 8, (1 - t) * 8)} />;
				}),
			)}
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : L'EAU QUI ROUGIT ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 330;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const URINES = at('intro', 'urines');
	const ROUGES = at('intro', 'rouges');
	const CA = at('intro', 'ça');
	const MAL = at('intro', 'mal');
	const DIT = at('intro', 'dit');
	const POURTANT = at('intro', 'pourtant');
	const SANG = at('intro', 'sang');
	const URINES2 = at('intro', 'urines', 2);
	const DOULEUR = at('intro', 'douleur');
	const MEDECIN = at('intro', 'médecin');
	// plan 1 : la cuvette vue d'en haut, l'eau rougit ; plan 2 (glissé) : la salle de bain, le grand-père
	const tint = 0.12 + 0.88 * lin(frame, URINES - 10, ROUGES + 14);
	const push = 1 + 0.18 * lin(frame, 0, CA);
	const slide = lin(frame, CA - 8, CA + 4);
	const shrug = lin(frame, MAL - 8, MAL + 4) * (1 - lin(frame, POURTANT - 4, POURTANT + 4));
	const worry = lin(frame, POURTANT, POURTANT + 8);
	// caméra : vers son bas-ventre, loupe sur la vessie
	const belly = dadPt([300, 700]);
	const c = lin(frame, SANG - 6, URINES2 + 6);
	const s = 1 + 0.6 * c;
	const tx = interpolate(c, [0, 1], [0, 540 - belly.x * s]);
	const ty = interpolate(c, [0, 1], [0, 960 - belly.y * s]);
	const lens = popAt(frame, URINES2 + 2);
	const head = dadPt([300, 220]);
	return (
		<AbsoluteFill style={{background: '#E9EDF1', overflow: 'hidden'}}>
			{slide < 1 ? (
				<AbsoluteFill style={{transform: `translateX(${-1080 * slide}px)`}}>
					<AbsoluteFill style={{transformOrigin: `${LOO_WATER.x}px ${LOO_WATER.y}px`, transform: `scale(${push})`}}>
						<ToiletTop tint={tint} ripple={1 - lin(frame, 20, 60)} />
					</AbsoluteFill>
				</AbsoluteFill>
			) : null}
			{slide > 0 ? (
				<AbsoluteFill style={{transform: `translateX(${1080 * (1 - slide)}px)`}}>
					<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
						<Bathroom>
							<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
								<DadBalcony width={DAD_W} cig={false} shrug={shrug} worry={worry} />
							</foreignObject>
						</Bathroom>
						{lens > 0.01 ? (
							<div style={{position: 'absolute', left: belly.x - 170, top: belly.y - 170, width: 340, height: 340, borderRadius: 170, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
								<Art which="cancer" cx={170} cy={175} s={0.95}>
									<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={52} from={DOULEUR} sw={5} />
								</Art>
							</div>
						) : null}
					</AbsoluteFill>
					{/* « ce n'est rien… » : bulle de pensée */}
					{frame >= DIT - 4 && frame < POURTANT + 6 ? (
						<div style={{position: 'absolute', left: head.x - 560, top: head.y - 330, transform: `scale(${popAt(frame, DIT - 4)})`, opacity: 1 - lin(frame, POURTANT - 2, POURTANT + 6)}}>
							<Bubble think tail="right">
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>Ce n'est rien…</span>
							</Bubble>
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			<Sfx name="tap" at={4} volume={0.04} dur={30} />
			<Sfx name="whoosh" at={ROUGES - 6} volume={0.05} />
			<Sfx name="whoosh" at={CA - 8} volume={0.08} />
			<Sfx name="pop" at={DIT - 4} volume={0.06} />
			<Sfx name="whoosh" at={SANG - 6} volume={0.07} />
			<Sfx name="ding" at={MEDECIN - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'APPAREIL URINAIRE ═══════════════════════════════ */
export const Vessie: React.FC = () => {
	const frame = useCurrentFrame();
	const REINS = at('vessie', 'reins');
	const SANG = at('vessie', 'sang');
	const URINE = at('vessie', "l'urine");
	const DESCEND = at('vessie', 'descend');
	const TUYAUX = at('vessie', 'tuyaux');
	const URETERES = at('vessie', 'uretères');
	const VESSIE = at('vessie', 'vessie');
	const RESERVOIR = at('vessie', 'réservoir');
	const URETRE = at('vessie', "l'urètre");
	const EVACUE = at('vessie', "l'évacue");
	const EXT = at('vessie', "l'extérieur");
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: REINS - 4, x: 458, y: 330, s: 1.75},
		{at: DESCEND - 4, x: 455, y: 500, s: 1.5},
		{at: VESSIE - 4, x: 452, y: 735, s: 2.1},
		{at: URETRE - 4, x: 452, y: 860, s: 1.9},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={DESCEND - 8} text={'Les *reins*'} size={110} y={150} center />
			<Big from={DESCEND - 2} to={VESSIE - 8} text={'Les *uretères*'} size={110} y={150} center />
			<Big from={VESSIE - 2} to={URETRE - 8} text={'La *vessie*'} size={110} y={150} center />
			<Big from={URETRE - 2} text={"*L'urètre*"} size={110} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: REINS, to: DESCEND - 6, x: DG.kidneyL[0], y: DG.kidneyL[1], r: 85, ry: 125},
					{from: REINS + 4, to: DESCEND - 6, x: DG.kidneyR[0], y: DG.kidneyR[1], r: 85, ry: 125},
					{from: URETERES, to: VESSIE - 6, x: DG.ureterL[0], y: DG.ureterL[1], r: 45, ry: 175},
					{from: URETERES + 3, to: VESSIE - 6, x: DG.ureterR[0], y: DG.ureterR[1], r: 45, ry: 175},
					{from: VESSIE, to: URETRE - 6, x: DG.bladder[0], y: DG.bladder[1], r: 185, ry: 160},
					{from: URETRE, x: DG.urethra[0], y: DG.urethra[1], r: 34, ry: 90},
				]}
			>
				<UrineFlow paths={[URL, URR]} from={DESCEND - 4} />
				<UrineFlow paths={[URETHRA]} from={EVACUE - 4} speed={0.02} n={4} />
			</Diagram>
			<Note at={SANG - 2} to={DESCEND - 8} y={1510} size={46} tone={LPI.paper}>
				ils filtrent le sang → l'urine
			</Note>
			<Note at={TUYAUX - 4} to={VESSIE - 8} y={1510} size={46} tone={LPI.pink}>
				deux petits tuyaux
			</Note>
			<Note at={RESERVOIR - 4} to={URETRE - 8} y={1510} size={46} tone={LPI.paper}>
				un réservoir qui se remplit
			</Note>
			<Note at={EXT - 6} y={1510} size={46} tone={LPI.sky}>
				vers l'extérieur
			</Note>
			<Sfx name="whoosh" at={REINS - 4} volume={0.05} />
			<Sfx name="pop" at={URINE} volume={0.05} />
			<Sfx name="whoosh" at={DESCEND - 4} volume={0.05} />
			<Sfx name="whoosh" at={VESSIE - 4} volume={0.05} />
			<Sfx name="whoosh" at={URETRE - 4} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
/** Des cellules roses qui se divisent sur la paroi (1 → 2 → 4 → 8…), dans le repère de la découpe. */
const Dividing: React.FC<{x: number; y: number; from: number; to: number}> = ({x, y, from, to}) => {
	const frame = useCurrentFrame();
	const k = lin(frame, from, to);
	if (frame < from) return null;
	const n = Math.min(12, Math.floor(1 + k * 12));
	const pts = [[0, 0], [12, -6], [-10, 8], [6, 12], [-14, -8], [18, 8], [0, -16], [-4, 22], [22, -12], [-20, 14], [12, 22], [-22, -2]];
	return (
		<g>
			{pts.slice(0, n).map(([dx, dy], i) => (
				<circle key={i} cx={x + dx} cy={y + dy} r={8 * popAt(frame, from + i * ((to - from) / 12))} fill="#EE6D86" stroke="#A8364F" strokeWidth={1.5} />
			))}
		</g>
	);
};

export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELLULES = at('cancer', 'cellules');
	const PAROI = at('cancer', 'paroi');
	const MULTIPLIENT = at('cancer', 'multiplient');
	const TUMEUR = at('cancer', 'tumeur');
	const COUCHE = at('cancer', 'couche');
	const HOMMES = at('cancer', 'hommes');
	const TOUCHE = at('cancer', 'touche');
	const SOIXANTE = at('cancer', 'soixante');
	const artO = fadeIn(frame, 0, 8) * (1 - lin(frame, TOUCHE - 8, TOUCHE));
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={'Le *cancer* de la vessie'} size={88} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={TOUCHE - 8} text={'Une *tumeur*'} size={110} y={150} center />
			{artO > 0.01 ? (
				<AbsoluteFill style={{opacity: artO}}>
					<ArtCard />
					<Art which="healthy" cx={540} cy={770} s={2.55} o={1 - toCancer}>
						<PulseRing x={TUMOR[0] - 3} y={TUMOR[1]} r={40} from={PAROI} to={MULTIPLIENT} sw={2.5} />
						<Dividing x={TUMOR[0] - 3} y={TUMOR[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
					</Art>
					<Art which="cancer" cx={540} cy={770} s={2.6} o={toCancer}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={52} from={TUMEUR + 2} sw={3} />
					</Art>
				</AbsoluteFill>
			) : null}
			<Note at={PAROI - 2} to={TUMEUR - 8} y={1330} size={44} tone={LPI.paper}>
				dans la paroi de la vessie
			</Note>
			<Note at={COUCHE - 4} to={TOUCHE - 8} y={1330} size={44} tone={LPI.sky}>
				sur la couche intérieure
			</Note>
			{frame >= TOUCHE - 4 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, TOUCHE - 4, 6)}}>
					<Big from={TOUCHE - 4} text={'Qui est *touché* ?'} size={104} y={150} center />
					<div style={{position: 'absolute', left: 120, top: 520, transform: `scale(${popAt(frame, HOMMES - 4)})`, opacity: frame >= HOMMES - 4 ? 1 : 0, textAlign: 'center', width: 360}}>
						<MaleIcon size={300} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 20}}>surtout les hommes</div>
					</div>
					<div style={{position: 'absolute', left: 600, top: 520, transform: `scale(${popAt(frame, SOIXANTE - 4)})`, opacity: frame >= SOIXANTE - 4 ? 1 : 0, textAlign: 'center', width: 360}}>
						<AgeIcon size={300} label="60+" />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 20}}>après 60 ans</div>
					</div>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={PAROI} volume={0.06} />
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="pop" at={HOMMES - 4} volume={0.08} />
			<Sfx name="pop" at={SOIXANTE - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const SANG = at('signes', 'sang');
	const DOULEUR = at('signes', 'douleur');
	const PIEGE = at('signes', 'piège');
	const DISPARAITRE = at('signes', 'disparaître');
	const REVENIR = at('signes', 'revenir');
	const PARFOIS = at('signes', 'parfois');
	const ENVIE = at('signes', 'envie');
	const PRESSANTE = at('signes', 'pressante');
	const BRULURES = at('signes', 'brûlures');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={PIEGE - 6} text={'Le signe n° *1*'} size={110} y={150} center />
			<Big from={PIEGE - 2} to={PARFOIS - 6} text={'Le *piège*'} size={110} y={150} center />
			<Big from={PARFOIS - 2} text={'Parfois *aussi*'} size={110} y={150} center />
			<RowCard at={SANG - 6} y={340} h={230} art={180} badge={1} title="Du sang dans les urines" sub="souvent sans douleur" subAt={DOULEUR - 4} size={52}>
				<BloodUrineIcon size={160} />
			</RowCard>
			<RowCard at={DISPARAITRE - 6} y={600} h={230} art={180} badge={2} title="Il disparaît…" sub="puis il revient" subAt={REVENIR - 4} size={56} from="left">
				<ComeBackIcon size={160} />
			</RowCard>
			<RowCard at={ENVIE - 6} y={860} h={230} art={180} badge={3} title="Envie d'uriner souvent" sub="envie pressante" subAt={PRESSANTE - 4} size={52}>
				<UrgeIcon size={160} />
			</RowCard>
			<RowCard at={BRULURES - 6} y={1120} h={230} art={180} badge={4} title="Des brûlures en urinant" size={52} from="left">
				<BurningIcon size={160} />
			</RowCard>
			<Stamp at={REVENIR + 6} x={560} y={1450} text="ON CONSULTE" size={56} />
			<Sfx name="stamp" at={REVENIR + 6} volume={0.1} />
			{[SANG - 6, DISPARAITRE - 6, ENVIE - 6, BRULURES - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE TABAC ═══════════════════════════════ */
/** Les toxiques du tabac (points bleu nuit) : sang → reins (`a` 0 → 1), reins → urine dans la vessie (`b` 0 → 1),
 * puis ils restent collés à la paroi. */
const Toxins: React.FC<{a: number; b: number; o: number}> = ({a, b, o}) => {
	const frame = useCurrentFrame();
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{Array.from({length: 14}).map((_, i) => {
				const left = i % 2 === 0;
				const lag = (i >> 1) * 0.07;
				const ta = Math.max(0, Math.min(1, a * 1.45 - lag));
				const tb = Math.max(0, Math.min(1, b * 1.45 - lag));
				let p: [number, number];
				if (tb <= 0) p = along(left ? BLOODL : BLOODR, ta);
				else if (tb < 1) p = along(left ? URL : URR, tb);
				else {
					// contre la paroi, au fond de la vessie (l'urine)
					const ang = Math.PI * (0.12 + 0.76 * ((i * 0.37) % 1));
					const end = [452 + 150 * Math.cos(ang), 760 + 85 * Math.sin(ang)];
					const k = 1;
					p = [end[0] * k + 2 * Math.sin(frame / 9 + i), end[1] * k + 2 * Math.cos(frame / 11 + i)];
				}
				if (ta <= 0 && tb <= 0) return null;
				return (
					<g key={i} transform={`translate(${p[0]} ${p[1]})`}>
						<circle r={11} fill={alpha(N, 0.25)} />
						<circle r={7} fill={N} stroke={LPI.paper} strokeWidth={2} />
					</g>
				);
			})}
		</g>
	);
};

export const Tabac: React.FC = () => {
	const frame = useCurrentFrame();
	const TABAC = at('tabac', 'tabac');
	const PRODUITS = at('tabac', 'produits');
	const FUMEE = at('tabac', 'fumée');
	const PASSENT = at('tabac', 'passent');
	const REINS = at('tabac', 'reins');
	const FILTRENT = at('tabac', 'filtrent');
	const RESTENT = at('tabac', 'restent');
	const URINE = at('tabac', "l'urine");
	const CONTACT = at('tabac', 'contact');
	const PAROI = at('tabac', 'paroi');
	const TABAC2 = at('tabac', 'tabac', 2);
	const CAUSE = at('tabac', 'cause');
	const DEUX = at('tabac', 'deux');
	const cigO = 1 - lin(frame, PRODUITS + 4, FUMEE);
	const dO = fadeIn(frame, PRODUITS, 8) * (1 - lin(frame, TABAC2 - 8, TABAC2));
	const a = lin(frame, PASSENT - 6, REINS + 8);
	const b = lin(frame, FILTRENT, URINE + 10);
	const keys: CamK[] = [
		{at: 0, x: 458, y: 320, s: 1.5},
		{at: FILTRENT, x: 455, y: 520, s: 1.35},
		{at: RESTENT - 2, x: 452, y: 740, s: 2.2},
	];
	const numO = fadeIn(frame, TABAC2, 6);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={TABAC - 6} text={'Responsable n° *1*'} size={104} y={150} center />
			<Big from={TABAC - 2} to={TABAC2 - 8} text={'Le *tabac*'} size={120} y={150} center />
			{cigO > 0 && frame >= TABAC - 6 ? (
				<div style={{position: 'absolute', left: 540 - 210, top: 600, transform: `scale(${popAt(frame, TABAC - 6)})`, opacity: cigO}}>
					<CigaretteIcon size={420} color={N} />
				</div>
			) : null}
			{dO > 0 ? (
				<Diagram keys={keys} o={dO} rings={[{from: PAROI, to: TABAC2 - 8, x: 452, y: 760, r: 165, ry: 100}]}>
					<Toxins a={a} b={b} o={fadeIn(frame, FUMEE, 6)} />
				</Diagram>
			) : null}
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Note at={PASSENT} to={FILTRENT - 6} y={1510} size={46} tone={LPI.paper}>
						les toxiques passent dans le sang
					</Note>
					<Note at={FILTRENT} to={RESTENT - 6} y={1510} size={46} tone={LPI.sky}>
						les reins les filtrent…
					</Note>
					<Note at={CONTACT - 4} y={1510} size={46} tone={LPI.pink}>
						au contact de la paroi
					</Note>
				</AbsoluteFill>
			) : null}
			{numO > 0 ? (
				<AbsoluteFill style={{opacity: numO}}>
					<Big from={TABAC2} text={'Le *tabac*…'} size={110} y={150} center />
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N, opacity: fadeIn(frame, CAUSE - 4, 6)}}>
						en cause dans environ
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 250, color: LPI.blue, lineHeight: 1, transform: `scale(${popAt(frame, DEUX - 6)})`, opacity: frame >= DEUX - 6 ? 1 : 0}}>
						1<span style={{fontSize: 110, color: N}}> cas sur </span>2
					</div>
					{[0, 1].map((i) => (
						<div key={i} style={{position: 'absolute', left: 230 + i * 360, top: 860, width: 260, height: 260, borderRadius: 130, background: i === 0 && frame >= DEUX ? LPI.pink : LPI.paper, border: `8px solid ${N}`, transform: `scale(${popAt(frame, DEUX - 4 + i * 4)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							{i === 0 ? <CigaretteIcon size={170} color={N} /> : null}
						</div>
					))}
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={TABAC - 6} volume={0.08} />
			<Sfx name="whoosh" at={PASSENT - 6} volume={0.05} />
			<Sfx name="whoosh" at={FILTRENT} volume={0.05} />
			<Sfx name="whoosh" at={RESTENT - 2} volume={0.05} />
			<Sfx name="impact" at={DEUX - 6} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const ANALYSE = at('examens', 'analyse');
	const ECHO = at('examens', 'échographie');
	const CYSTO = at('examens', 'cystoscopie');
	const CAMERA = at('examens', 'caméra');
	const ENTRE = at('examens', 'entre');
	const REGARDE = at('examens', 'regarde');
	const INTERIEUR = at('examens', "l'intérieur");
	const aO = 1 - lin(frame, CYSTO - 8, CYSTO);
	const bO = fadeIn(frame, CYSTO - 4, 8);
	// la caméra entre par le col de la vessie (sous la découpe) et monte vers la tumeur
	const reach = lin(frame, ENTRE - 6, REGARDE);
	const tip: [number, number] = [NECK[0] + (TUMOR[0] - 70 - NECK[0]) * reach, NECK[1] + 40 + (TUMOR[1] + 30 - NECK[1] - 40) * reach];
	const light = fadeIn(frame, REGARDE - 2, 6);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={CYSTO - 6} text={'Pour le *trouver*'} size={110} y={150} center />
			<Big from={CYSTO - 2} text={'La *cystoscopie*'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<RowCard at={ANALYSE - 6} y={400} h={250} art={190} badge={1} title="Une analyse d'urine" size={56}>
						<UrineTestIcon size={170} />
					</RowCard>
					<RowCard at={ECHO - 6} y={690} h={250} art={190} badge={2} title="Une échographie" size={56} from="left">
						<EchoIcon size={170} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<ArtCard />
					<Art which="cancer" cx={540} cy={740} s={2.5}>
						{reach > 0 ? (
							<g>
								<path d={`M${NECK[0]} ${NECK[1] + 22} L${NECK[0]} ${NECK[1] + 10} Q${NECK[0]} ${tip[1] + 30} ${tip[0]} ${tip[1]}`} fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
								<path d={`M${NECK[0]} ${NECK[1] + 22} L${NECK[0]} ${NECK[1] + 10} Q${NECK[0]} ${tip[1] + 30} ${tip[0]} ${tip[1]}`} fill="none" stroke="#7E8CA0" strokeWidth={3} strokeLinecap="round" />
								{light > 0 ? <path d={`M${tip[0]} ${tip[1]} L${TUMOR[0] - 10} ${TUMOR[1] - 55} L${TUMOR[0] + 30} ${TUMOR[1] + 40} Z`} fill={alpha(LPI.sky, 0.55 * light)} /> : null}
								<circle cx={tip[0]} cy={tip[1]} r={8} fill={N} />
								<circle cx={tip[0]} cy={tip[1]} r={3} fill={LPI.sky} opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
							</g>
						) : null}
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={52} from={INTERIEUR + 4} sw={3} />
					</Art>
					<Note at={CAMERA - 4} y={1330} size={44} tone={LPI.sky}>
						une petite caméra, par l'urètre
					</Note>
					<Pill at={INTERIEUR + 6} x={540} y={1450} tone={LPI.paper} size={46}>
						elle voit la tumeur
					</Pill>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={ANALYSE - 6} volume={0.08} />
			<Sfx name="pop" at={ECHO - 6} volume={0.08} />
			<Sfx name="whoosh" at={CYSTO - 4} volume={0.06} />
			<Sfx name="whoosh" at={ENTRE - 6} volume={0.05} />
			<Sfx name="ding" at={INTERIEUR + 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES AUTRES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const AGE = at('risques', "l'âge");
	const PRODUITS = at('risques', 'produits');
	const PEINTURE = at('risques', 'peinture');
	const TEINTURES = at('risques', 'teintures');
	const CAOUTCHOUC = at('risques', 'caoutchouc');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			<RowCard at={AGE - 6} y={360} h={240} art={180} badge={1} title="Avec l'âge" size={58}>
				<AgeIcon size={160} label="60+" />
			</RowCard>
			<RowCard at={PRODUITS - 6} y={640} h={240} art={180} badge={2} title="Produits chimiques" sub="au travail" subAt={PRODUITS + 6} size={56} from="left">
				<ChemicalIcon size={160} />
			</RowCard>
			<Pill at={PEINTURE - 4} x={300} y={1010} tone={LPI.paper} size={50}>
				peinture
			</Pill>
			<Pill at={TEINTURES - 4} x={760} y={1010} tone={LPI.pink} size={50}>
				teintures
			</Pill>
			<Pill at={CAOUTCHOUC - 4} x={540} y={1150} tone={LPI.paper} size={50}>
				caoutchouc
			</Pill>
			{[AGE - 6, PRODUITS - 6, PEINTURE - 4, TEINTURES - 4, CAOUTCHOUC - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const RETIRE = at('traitement', 'retire');
	const URETRE = at('traitement', "l'urètre");
	const LAVAGES = at('traitement', 'lavages');
	const MEDICAMENT = at('traitement', 'médicament');
	const RETIRER = at('traitement', 'retirer');
	const ET = at('traitement', 'et');
	const TOT = at('traitement', 'tôt');
	const SOIGNE = at('traitement', 'soigne');
	const BIEN = at('traitement', 'bien');
	const fade = 1 - lin(frame, ET - 6, ET + 4);
	const bO = fadeIn(frame, ET, 8);
	const heal = lin(frame, SOIGNE - 6, BIEN + 4);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={ET - 6} text={'Pour le *soigner*'} size={110} y={150} center />
			{fade > 0 ? (
				<AbsoluteFill style={{opacity: fade}}>
					<RowCard at={at('traitement', 'souvent') - 4} y={360} h={250} art={180} badge={1} title="Retirer la tumeur" sub="par l'urètre, sans ouvrir le ventre" subAt={URETRE - 4} size={54}>
						<ScopeIcon size={160} />
					</RowCard>
					<RowCard at={LAVAGES - 6} y={640} h={250} art={180} badge={2} title="Des lavages de la vessie" sub="avec un médicament" subAt={MEDICAMENT - 4} size={50} from="left">
						<InstillIcon size={160} />
					</RowCard>
					<RowCard at={RETIRER - 6} y={920} h={250} art={180} badge={3} title="Retirer toute la vessie" sub="parfois" subAt={RETIRER} size={52}>
						<BladderOutIcon size={160} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<Big from={ET} text={'Pris *tôt*…'} size={120} y={150} center />
					<ArtCard top={330} h={900} />
					<Art which="cancer" cx={540} cy={780} s={2.4} o={1 - heal} />
					<Art which="healthy" cx={540} cy={780} s={2.35} o={heal} />
					<Stamp at={BIEN - 2} x={560} y={1330} text="IL SE SOIGNE TRÈS BIEN" size={52} />
				</AbsoluteFill>
			) : null}
			<Burst at={BIEN} x={540} y={780} r={360} n={12} />
			{[RETIRE - 6, LAVAGES - 6, RETIRER - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="whoosh" at={TOT - 6} volume={0.06} />
			<Sfx name="stamp" at={BIEN - 2} volume={0.1} />
			<Sfx name="ding" at={BIEN + 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CONSULTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('fin', 'sang');
	const SEULE = at('fin', 'seule');
	const CONSULTE = at('fin', 'consulte');
	const ARRETER = at('fin', 'arrêter');
	const FUMER = at('fin', 'fumer');
	const PROTEGE = at('fin', 'protège');
	const VESSIE = at('fin', 'vessie');
	const aO = 1 - lin(frame, ARRETER - 8, ARRETER);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={SANG - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={SANG - 2} to={ARRETER - 6} text={'Du *sang* dans les urines ?'} size={70} y={170} center />
			<Big from={ARRETER - 2} text={'Arrêter de *fumer*'} size={104} y={170} center />
			{aO > 0 && frame >= SANG - 4 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<div style={{position: 'absolute', left: 540 - 200, top: 420, transform: `scale(${popAt(frame, SANG - 4)})`}}>
						<BloodUrineIcon size={400} />
					</div>
					<Pill at={SEULE - 4} x={540} y={940} tone={LPI.paper} size={54}>
						même une seule fois
					</Pill>
					<Stamp at={CONSULTE} x={560} y={1120} text="ON CONSULTE" size={70} />
				</AbsoluteFill>
			) : null}
			{frame >= FUMER - 4 ? (
				<div style={{position: 'absolute', left: 540 - 200, top: 420, transform: `scale(${popAt(frame, FUMER - 4)})`}}>
					<NoSmokeIcon size={400} />
				</div>
			) : null}
			<Pill at={PROTEGE - 2} x={540} y={940} tone={LPI.pink} size={54}>
				protège aussi sa vessie
			</Pill>
			<Burst at={VESSIE} x={540} y={620} r={320} n={12} />
			<Sfx name="pop" at={SANG - 4} volume={0.08} />
			<Sfx name="pop" at={SEULE - 4} volume={0.07} />
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
			<Sfx name="pop" at={FUMER - 4} volume={0.08} />
			<Sfx name="ding" at={VESSIE} volume={0.08} />
		</AbsoluteFill>
	);
};
