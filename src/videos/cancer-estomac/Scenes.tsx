// Scènes de « Le cancer de l'estomac » (n° 55, voix gratuite d'abord). Accroche sans texte, réaliste : au repas, dans la
// cuisine, ton grand-père repousse son assiette ; il a mal au ventre après manger, il a maigri (balance), il prend un
// sachet de pansement gastrique… ça passe, ça revient ; plongée vers son ventre (loupe sur la paroi avec la tumeur). Puis
// l'estomac (schéma fourni par le propriétaire, nettoyé de ses annotations : les aliments descendent l'œsophage, le liquide
// acide, le duodénum, la muqueuse et ses plis), le cancer (cellules de la muqueuse, tumeur qui s'enfonce dans la paroi),
// la bactérie Helicobacter pylori, les signes, les risques, la fibroscopie (+ biopsies, scanner), les traitements, chute
// « des douleurs qui durent, maigrir sans raison : on consulte… au lieu de prendre des pansements pendant des mois ».
// Storyboard : docs/lpi/storyboard-cancer-estomac.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {ScopeIcon} from '../../brand/bladder';
import {ChemoIcon} from '../../brand/breast';
import {BellyIcon, Kitchen} from '../../brand/colorectal';
import {BathScale} from '../../brand/heartfail';
import {CigaretteIcon, PillIcon, ScalpelIcon, TiredIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {DadBalcony, WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {ScannerIcon, Sparkle, TumorBlob, WineIcon} from '../../brand/pancreas';
import {AgeIcon, FamilyIcon} from '../../brand/prostate';
import {Sfx} from '../../brand/Sfx';
import {Bacterium, BacteriumIcon, BlackStoolIcon, DinnerPlate, FullIcon, GelSachet, PainBolts, SaltIcon, VomitIcon} from '../../brand/stomach';
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
// Schéma « L'estomac et le cancer de l'estomac » fourni par le propriétaire (1536 × 1024), sans ses annotations
// (demandé) : l'œsophage, l'estomac et le duodénum ; la paroi saine / avec cancer (chacune dans son calque).
const IMG = {anat: 'images/estomac/estomac-propre-anatomie.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 395, y: 520, s: 1.35},
	esophagus: [405, 240],
	stomach: [470, 610],
	duodenum: [95, 770],
	wall: [452, 530],
	tumor: [628, 560],
} as const;
/** Le trajet des aliments : l'œsophage → l'estomac → le duodénum (pixels de l'image). */
const FOOD: [number, number][] = [[405, 150], [405, 300], [440, 390], [500, 470], [540, 560], [520, 680], [420, 760], [300, 720], [210, 670], [140, 650], [95, 690], [80, 770], [90, 860]];
/** Le trajet de la caméra (fibroscopie) : par l'œsophage jusque dans l'estomac, face à la tumeur. */
const SCOPE: [number, number][] = [[405, 120], [405, 300], [440, 390], [500, 470], [545, 545]];

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

/* ── Les deux parois (saine / avec cancer), chacune dans son calque ── */
const REG = {
	healthy: {x: 805, y: 255, w: 340, h: 315, layer: 'images/estomac/estomac-propre-sain.png'},
	cancer: {x: 1150, y: 255, w: 350, h: 310, layer: 'images/estomac/estomac-propre-cancer.png'},
} as const;
/** La tumeur dans la découpe de la paroi avec cancer, et le même endroit sur la paroi saine (pixels). */
const TUMOR = [1365 - REG.cancer.x, 385 - REG.cancer.y] as const;
const TUMOR_H = [1020 - REG.healthy.x, 385 - REG.healthy.y] as const;
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

/* ═══════════════════════════════ ACCROCHE : L'ASSIETTE REPOUSSÉE ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 300;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const REPOUSSE = at('intro', 'repousse');
	const FAIM = at('intro', 'faim');
	const MAL = at('intro', 'mal');
	const MAIGRI = at('intro', 'maigri');
	const PANSEMENT = at('intro', 'pansement');
	const PASSE = at('intro', 'passe');
	const REVIENT = at('intro', 'revient');
	const POURTANT = at('intro', 'pourtant');
	const DOULEUR = at('intro', 'douleur');
	const PERTE = at('intro', 'perte');
	const MEDECIN = at('intro', 'médecin');
	const push = lin(frame, REPOUSSE - 4, REPOUSSE + 14);
	const pain = lin(frame, MAL - 6, MAL + 4) * (1 - lin(frame, PASSE - 4, PASSE + 8)) + lin(frame, REVIENT - 6, REVIENT + 4) * (1 - lin(frame, POURTANT + 6, POURTANT + 14));
	const worry = Math.max(lin(frame, FAIM - 10, FAIM) * 0.5, pain * 0.8, lin(frame, POURTANT, POURTANT + 8));
	const shrug = lin(frame, PASSE - 6, PASSE + 4) * (1 - lin(frame, REVIENT - 6, REVIENT));
	const belly = dadPt([300, 590]);
	const dive = lin(frame, DOULEUR - 6, PERTE);
	const s = 1 + 0.65 * dive;
	const tx = interpolate(dive, [0, 1], [0, 540 - belly.x * s]);
	const ty = interpolate(dive, [0, 1], [0, 960 - belly.y * s]);
	const lens = popAt(frame, PERTE + 2);
	const scaleK = frame >= MAIGRI - 6 && frame < PANSEMENT + 2 ? popAt(frame, MAIGRI - 6) * (1 - lin(frame, PANSEMENT - 8, PANSEMENT + 2)) : 0;
	const sachet = frame >= PANSEMENT - 6 ? popAt(frame, PANSEMENT - 6) * (1 - lin(frame, POURTANT - 4, POURTANT + 4)) : 0;
	return (
		<AbsoluteFill style={{background: '#F3EDE3', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Kitchen
					year="2026"
					onTop={
						<g transform={`translate(${540 + 280 * push} ${1262 - 30 * push}) scale(${1 - 0.15 * push})`}>
							<DinnerPlate r={210} />
						</g>
					}
				>
					<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
						<DadBalcony width={DAD_W} cig={false} shrug={shrug} worry={worry} />
					</foreignObject>
				</Kitchen>
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
					<PainBolts x={belly.x} y={belly.y - 20} k={pain} s={1.2} />
				</svg>
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: belly.x - 170, top: belly.y - 170, width: 340, height: 340, borderRadius: 170, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<Art which="cancer" cx={170} cy={175} s={1.05}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={78} from={MEDECIN - 6} sw={5} />
						</Art>
					</div>
				) : null}
			</AbsoluteFill>
			{scaleK > 0 ? (
				<div style={{position: 'absolute', left: 660, top: 1380, transform: `scale(${scaleK})`, transformOrigin: '50% 100%'}}>
					<BathScale value={5} delta minus width={330} />
				</div>
			) : null}
			{sachet > 0 ? (
				<div style={{position: 'absolute', left: 120, top: 1080, transform: `scale(${sachet}) rotate(-8deg)`}}>
					<GelSachet w={150} />
				</div>
			) : null}
			<Sfx name="whoosh" at={REPOUSSE - 2} volume={0.06} />
			<Sfx name="pop" at={MAIGRI - 6} volume={0.07} />
			<Sfx name="pop" at={PANSEMENT - 6} volume={0.07} />
			<Sfx name="whoosh" at={DOULEUR - 6} volume={0.07} />
			<Sfx name="ding" at={MEDECIN - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ESTOMAC ═══════════════════════════════ */
export const Estomac: React.FC = () => {
	const frame = useCurrentFrame();
	const ALIMENTS = at('estomac', 'aliments');
	const OESO = at('estomac', "l'œsophage");
	const MELANGE = at('estomac', 'mélange');
	const ACIDE = at('estomac', 'acide');
	const ENVOIE = at('estomac', 'envoie');
	const DUODENUM = at('estomac', 'duodénum');
	const INTERIEUR = at('estomac', "l'intérieur");
	const MUQUEUSE = at('estomac', 'muqueuse');
	const PLIS = at('estomac', 'plis');
	const dO = 1 - lin(frame, INTERIEUR - 6, INTERIEUR + 4);
	const aO = fadeIn(frame, INTERIEUR, 8);
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: OESO - 4, x: 420, y: 330, s: 1.7},
		{at: MELANGE - 4, x: 460, y: 600, s: 1.45},
		{at: ENVOIE - 4, x: 230, y: 700, s: 1.6},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={INTERIEUR - 6} text={"*L'estomac*"} size={110} y={150} center />
			<Big from={INTERIEUR - 2} text={'La *muqueuse*'} size={110} y={150} center />
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Diagram
						o={fadeIn(frame, 0, 8)}
						keys={keys}
						rings={[
							{from: OESO, to: MELANGE - 6, x: DG.esophagus[0], y: DG.esophagus[1], r: 50, ry: 130},
							{from: DUODENUM, x: DG.duodenum[0], y: DG.duodenum[1], r: 55, ry: 110},
						]}
					>
						<DropFlow paths={[FOOD]} from={ALIMENTS - 2} speed={0.008} n={8} fill="#C98B4E" stroke="#7A4E22" />
						<Sparkle x={470} y={640} from={ACIDE - 2} n={12} spread={150} color="#B9CF3A" />
					</Diagram>
					<Note at={ACIDE} to={ENVOIE - 6} y={1510} size={46} tone={LPI.paper}>
						un liquide acide pour digérer
					</Note>
					<Note at={DUODENUM + 4} to={INTERIEUR - 6} y={1510} size={46} tone={LPI.pink}>
						le duodénum : le début de l'intestin
					</Note>
				</AbsoluteFill>
			) : null}
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<ArtCard top={330} h={900} />
					<Art which="healthy" cx={540} cy={780} s={2.6}>
						{[60, 135, 215, 290].map((x, i) => (
							<PulseRing key={i} x={x} y={110} r={26} from={PLIS + i * 4} sw={2.5} />
						))}
					</Art>
					<Note at={MUQUEUSE} y={1330} size={46} tone={LPI.sky}>
						la couche intérieure, avec ses plis
					</Note>
				</AbsoluteFill>
			) : null}
			<Sfx name="whoosh" at={OESO - 4} volume={0.05} />
			<Sfx name="pop" at={ACIDE - 2} volume={0.05} />
			<Sfx name="whoosh" at={ENVOIE - 4} volume={0.05} />
			<Sfx name="whoosh" at={INTERIEUR - 4} volume={0.06} />
			<Sfx name="ding" at={PLIS} volume={0.05} />
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
	const ENFONCER = at('cancer', "s'enfoncer");
	const PAROI = at('cancer', 'paroi');
	const TOUCHE = at('cancer', 'touche');
	const SOIXANTE = at('cancer', 'soixante');
	const HOMMES = at('cancer', 'hommes');
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	const artO = fadeIn(frame, 0, 8) * (1 - lin(frame, TOUCHE - 8, TOUCHE));
	const deep = lin(frame, ENFONCER - 2, PAROI + 8);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={"Le *cancer* de l'estomac"} size={84} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={TOUCHE - 8} text={'Une *tumeur*'} size={110} y={150} center />
			{artO > 0.01 ? (
				<AbsoluteFill style={{opacity: artO}}>
					<ArtCard top={330} h={900} />
					<Art which="healthy" cx={540} cy={780} s={2.6} o={1 - toCancer}>
						<PulseRing x={TUMOR_H[0]} y={TUMOR_H[1] - 30} r={40} from={CELLULES} to={MULTIPLIENT + 8} sw={2.5} />
						<Dividing x={TUMOR_H[0]} y={TUMOR_H[1] - 30} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
					</Art>
					<Art which="cancer" cx={540} cy={780} s={2.6} o={toCancer}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={72} from={TUMEUR + 2} to={ENFONCER} sw={3} />
						{deep > 0 ? (
							<g opacity={deep}>
								<path d={`M${TUMOR[0]} ${TUMOR[1] + 55} L${TUMOR[0]} ${TUMOR[1] + 55 + 90 * deep}`} stroke={N} strokeWidth={7} strokeLinecap="round" />
								<path d={`M${TUMOR[0] - 14} ${TUMOR[1] + 40 + 90 * deep} L${TUMOR[0]} ${TUMOR[1] + 58 + 90 * deep} L${TUMOR[0] + 14} ${TUMOR[1] + 40 + 90 * deep}`} fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
							</g>
						) : null}
					</Art>
				</AbsoluteFill>
			) : null}
			<Note at={CELLULES + 4} to={TUMEUR - 8} y={1330} size={44} tone={LPI.paper}>
				dans la muqueuse
			</Note>
			<Note at={ENFONCER} to={TOUCHE - 8} y={1330} size={44} tone={LPI.sky}>
				elle peut s'enfoncer dans la paroi
			</Note>
			{frame >= TOUCHE - 4 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, TOUCHE - 4, 6)}}>
					<Big from={TOUCHE - 4} text={'Qui est *touché* ?'} size={104} y={150} center />
					<div style={{position: 'absolute', left: 120, top: 520, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, SOIXANTE - 4)})`, opacity: frame >= SOIXANTE - 4 ? 1 : 0}}>
						<AgeIcon size={300} label="60+" />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 20}}>après 60 ans</div>
					</div>
					<div style={{position: 'absolute', left: 600, top: 520, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, HOMMES - 4)})`, opacity: frame >= HOMMES - 4 ? 1 : 0}}>
						<svg width={300} height={300} viewBox="0 0 100 100">
							<circle cx={42} cy={58} r={24} fill={LPI.sky} stroke={N} strokeWidth={7} />
							<path d="M60 40 L84 16 M64 16 L84 16 L84 36" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 20}}>plus souvent les hommes</div>
					</div>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="whoosh" at={ENFONCER} volume={0.05} />
			<Sfx name="pop" at={SOIXANTE - 4} volume={0.08} />
			<Sfx name="pop" at={HOMMES - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA BACTÉRIE ═══════════════════════════════ */
const BUGS: [number, number, number][] = [[50, 96, -20], [120, 70, 15], [180, 112, -40], [250, 76, 25], [300, 104, -10], [90, 140, 30]];
export const Bacterie: React.FC = () => {
	const frame = useCurrentFrame();
	const BACTERIE = at('bacterie', 'bactérie');
	const VIT = at('bacterie', 'vit');
	const IRRITE = at('bacterie', 'irrite');
	const ANNEES = at('bacterie', 'années');
	const BONNE = at('bacterie', 'bonne');
	const CHERCHER = at('bacterie', 'chercher');
	const ANTIBIO = at('bacterie', 'antibiotiques');
	const ELIMINENT = at('bacterie', "l'éliminent");
	const red = lin(frame, IRRITE - 4, ANNEES + 10) * (1 - lin(frame, ELIMINENT, ELIMINENT + 16));
	const gone = lin(frame, ELIMINENT - 6, ELIMINENT + 10);
	const pill = frame >= ANTIBIO - 6 ? popAt(frame, ANTIBIO - 6) : 0;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={BACTERIE - 4} text={'Une cause *fréquente*'} size={96} y={150} center />
			<Big from={BACTERIE} to={BONNE - 6} text={'Une *bactérie*'} size={110} y={150} center />
			<Big from={BONNE - 2} text={'Bonne *nouvelle*'} size={110} y={150} center />
			<ArtCard top={330} h={900} o={fadeIn(frame, 0, 8)} />
			<Art which="healthy" cx={540} cy={780} s={2.6} o={fadeIn(frame, 0, 8)}>
				{red > 0 ? <rect x={0} y={20} width={340} height={170} rx={30} fill="#E8445A" opacity={0.28 * red} /> : null}
				{BUGS.map(([x, y, a], i) => (
					<Bacterium key={i} x={x + 4 * Math.sin(frame / 15 + i)} y={y} s={0.9 * popAt(frame, BACTERIE + i * 3) * (1 - gone)} angle={a} o={frame >= BACTERIE + i * 3 ? 1 - gone : 0} />
				))}
			</Art>
			<Pill at={BACTERIE + 10} x={540} y={1300} tone={LPI.paper} size={50}>
				<span style={{fontStyle: 'italic'}}>Helicobacter pylori</span>
			</Pill>
			<Note at={IRRITE} to={BONNE - 6} y={1420} size={46} tone={LPI.pink}>
				elle irrite la muqueuse pendant des années
			</Note>
			<Note at={CHERCHER - 4} y={1400} size={46} tone={LPI.sky}>
				on peut la chercher
			</Note>
			{pill > 0 ? (
				<div style={{position: 'absolute', left: 760, top: 380 + 240 * lin(frame, ANTIBIO, ELIMINENT), transform: `scale(${pill}) rotate(${-30 + 360 * lin(frame, ANTIBIO, ELIMINENT)}deg)`}}>
					<PillIcon size={190} color={N} />
				</div>
			) : null}
			<Stamp at={ELIMINENT + 6} x={560} y={1620} text="ÉLIMINÉE" size={64} />
			<Sfx name="pop" at={BACTERIE} volume={0.07} />
			<Sfx name="pop" at={IRRITE} volume={0.05} />
			<Sfx name="ding" at={BONNE} volume={0.06} />
			<Sfx name="whoosh" at={ANTIBIO - 6} volume={0.06} />
			<Sfx name="stamp" at={ELIMINENT + 6} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const AUCUN = at('signes', 'aucun');
	const PUIS = at('signes', 'puis');
	const DOULEURS = at('signes', 'douleurs');
	const VITE = at('signes', 'vite');
	const PERTE = at('signes', 'perte');
	const VOMI = at('signes', 'vomissements');
	const SELLES = at('signes', 'selles');
	const FATIGUE = at('signes', 'fatigue');
	const aO = 1 - lin(frame, PUIS - 6, PUIS + 2);
	const rows: [number, string, React.ReactNode][] = [
		[DOULEURS, 'Mal au creux de l\'estomac', <BellyIcon key="b" size={120} />],
		[VITE, 'Vite rassasié', <FullIcon key="f" size={120} />],
		[PERTE, 'Une perte de poids', <WeightLossIcon key="w" size={120} />],
		[VOMI, 'Des vomissements', <VomitIcon key="v" size={120} />],
		[SELLES, 'Des selles noires', <BlackStoolIcon key="s" size={120} />],
		[FATIGUE, 'Une grande fatigue', <TiredIcon key="t" size={115} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={PUIS - 6} text={'Au *début*…'} size={110} y={150} center />
			<Big from={PUIS - 2} text={'Puis *viennent*'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<ArtCard top={360} h={700} />
					<Art which="cancer" cx={540} cy={710} s={2.0} />
					<Stamp at={AUCUN} x={540} y={1220} text="AUCUN SIGNE" size={72} />
				</AbsoluteFill>
			) : null}
			{rows.map(([t, title, icon], i) => (
				<RowCard key={i} at={t - 6} y={320 + i * 190} h={170} art={130} badge={i + 1} title={title} size={48} from={i % 2 ? 'left' : 'right'}>
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
	const AGE = at('risques', "l'âge");
	const BACTERIE = at('risques', 'bactérie');
	const TABAC = at('risques', 'tabac');
	const ALCOOL = at('risques', "l'alcool");
	const SALEE = at('risques', 'salée');
	const PROCHE = at('risques', 'proche');
	const rows: [number, string, React.ReactNode][] = [
		[AGE, "Avec l'âge", <AgeIcon key="a" size={120} label="60+" />],
		[BACTERIE, 'La bactérie Helicobacter', <BacteriumIcon key="b" size={120} />],
		[TABAC, 'Le tabac', <CigaretteIcon key="t" size={120} color={N} />],
		[ALCOOL, "L'alcool", <WineIcon key="w" size={120} />],
		[SALEE - 4, 'Trop de sel', <SaltIcon key="s" size={120} />],
		[PROCHE, 'Un proche touché', <FamilyIcon key="p" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			{rows.map(([t, title, icon], i) => (
				<RowCard key={i} at={t - 6} y={320 + i * 190} h={170} art={130} badge={i + 1} title={title} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA FIBROSCOPIE ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const FIBRO = at('examens', 'fibroscopie');
	const CAMERA = at('examens', 'caméra');
	const BOUCHE = at('examens', 'bouche');
	const REGARDE = at('examens', 'regarde');
	const BIOPSIES = at('examens', 'biopsies');
	const PUIS = at('examens', 'puis');
	const SCANNER = at('examens', 'scanner');
	const ETENDU = at('examens', 'étendu');
	const dO = fadeIn(frame, 0, 8) * (1 - lin(frame, PUIS - 6, PUIS + 2));
	const reach = lin(frame, BOUCHE - 4, REGARDE);
	const head = along(SCOPE, reach);
	const nSeg = SCOPE.length - 1;
	const drawn = SCOPE.slice(0, Math.floor(reach * nSeg) + 1).concat([head]);
	const light = fadeIn(frame, REGARDE, 6);
	const needle = lin(frame, BIOPSIES - 4, BIOPSIES + 10);
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: REGARDE - 4, x: 560, y: 540, s: 2.1},
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={PUIS - 6} text={'La *fibroscopie*'} size={110} y={150} center />
			<Big from={PUIS - 2} text={'Puis un *scanner*'} size={110} y={150} center />
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Diagram keys={keys}>
						<TumorBlob x={DG.tumor[0]} y={DG.tumor[1]} r={28} />
						{reach > 0 ? (
							<g>
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={N} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
								<polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke="#7E8CA0" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
								{light > 0 ? <path d={`M${head[0]} ${head[1]} L${DG.tumor[0] - 10} ${DG.tumor[1] - 45} L${DG.tumor[0] + 5} ${DG.tumor[1] + 45} Z`} fill={alpha(LPI.sky, 0.55 * light)} /> : null}
								{needle > 0 ? <line x1={head[0]} y1={head[1]} x2={head[0] + (DG.tumor[0] - 26 - head[0]) * needle} y2={head[1] + (DG.tumor[1] - head[1]) * needle} stroke="#5E6B78" strokeWidth={4} strokeLinecap="round" /> : null}
								<circle cx={head[0]} cy={head[1]} r={14} fill={N} />
								<circle cx={head[0]} cy={head[1]} r={5} fill={LPI.sky} opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
							</g>
						) : null}
					</Diagram>
					<Note at={CAMERA - 4} to={BIOPSIES - 6} y={1510} size={46} tone={LPI.sky}>
						une petite caméra, par la bouche
					</Note>
					<Note at={BIOPSIES} to={PUIS - 6} y={1510} size={46} tone={LPI.pink}>
						+ des biopsies : de petits prélèvements
					</Note>
				</AbsoluteFill>
			) : null}
			{frame >= SCANNER - 6 ? (
				<div style={{position: 'absolute', left: 540 - 220, top: 480, transform: `scale(${popAt(frame, SCANNER - 6)})`}}>
					<ScannerIcon size={440} />
				</div>
			) : null}
			<Pill at={ETENDU - 6} x={540} y={1060} tone={LPI.paper} size={52}>
				s'est-il étendu ?
			</Pill>
			<Sfx name="whoosh" at={BOUCHE - 4} volume={0.06} />
			<Sfx name="ding" at={REGARDE} volume={0.05} />
			<Sfx name="pop" at={BIOPSIES} volume={0.06} />
			<Sfx name="pop" at={SCANNER - 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIR = at('traitement', 'chirurgie');
	const PARTIE = at('traitement', 'partie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const AVANT = at('traitement', 'avant');
	const ET = at('traitement', 'et', 2);
	const TOT = at('traitement', 'tôt');
	const RETIRER = at('traitement', 'retirer');
	const CAMERA = at('traitement', 'caméra');
	const OPERER = at('traitement', 'opérer');
	const aO = 1 - lin(frame, ET - 8, ET);
	const bO = fadeIn(frame, ET - 2, 8);
	const heal = lin(frame, RETIRER - 4, CAMERA + 8);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={ET - 6} text={'Pour le *soigner*'} size={110} y={150} center />
			<Big from={ET - 2} text={'Pris *très* *tôt*…'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<RowCard at={CHIR - 6} y={380} h={250} art={180} badge={1} title="La chirurgie" sub="retire une partie ou tout l'estomac" subAt={PARTIE - 4} size={56}>
						<ScalpelIcon size={150} />
					</RowCard>
					<RowCard at={CHIMIO - 6} y={670} h={250} art={180} badge={2} title="La chimiothérapie" sub="souvent avant et après" subAt={AVANT - 4} size={56} from="left">
						<ChemoIcon size={160} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<ArtCard top={330} h={820} />
					<Art which="cancer" cx={540} cy={740} s={2.4} o={1 - heal} />
					<Art which="healthy" cx={540} cy={740} s={2.38} o={heal} />
					{frame >= TOT - 4 ? (
						<div style={{position: 'absolute', left: 790, top: 360, transform: `scale(${popAt(frame, TOT - 4)})`}}>
							<ScopeIcon size={200} />
						</div>
					) : null}
					<Stamp at={OPERER - 2} x={560} y={1300} text="SANS OPÉRER" size={68} />
				</AbsoluteFill>
			) : null}
			<Burst at={OPERER} x={540} y={740} r={340} n={12} />
			<Sfx name="pop" at={CHIR - 6} volume={0.08} />
			<Sfx name="pop" at={CHIMIO - 6} volume={0.08} />
			<Sfx name="whoosh" at={TOT - 4} volume={0.06} />
			<Sfx name="stamp" at={OPERER - 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CONSULTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const DOULEURS = at('fin', 'douleurs');
	const PERTE = at('fin', 'perte');
	const CONSULTE = at('fin', 'consulte');
	const LIEU = at('fin', 'lieu');
	const PANSEMENTS = at('fin', 'pansements');
	const MOIS = at('fin', 'mois');
	const aO = 1 - lin(frame, LIEU - 8, LIEU);
	const cross = lin(frame, MOIS - 4, MOIS + 6);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={LIEU - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={LIEU - 2} text={'Pas des mois de *sachets*'} size={72} y={170} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					{frame >= DOULEURS - 4 ? (
						<div style={{position: 'absolute', left: 130, top: 420, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, DOULEURS - 4)})`}}>
							<BellyIcon size={300} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>des douleurs qui durent</div>
						</div>
					) : null}
					{frame >= PERTE - 4 ? (
						<div style={{position: 'absolute', left: 590, top: 420, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, PERTE - 4)})`}}>
							<WeightLossIcon size={300} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>maigrir sans raison</div>
						</div>
					) : null}
					<Stamp at={CONSULTE} x={560} y={1100} text="ON CONSULTE" size={72} />
				</AbsoluteFill>
			) : null}
			{frame >= PANSEMENTS - 6 ? (
				<div style={{position: 'absolute', left: 540 - 130, top: 420, transform: `scale(${popAt(frame, PANSEMENTS - 6)})`}}>
					<GelSachet w={260} />
					<svg width={340} height={340} viewBox="0 0 100 100" style={{position: 'absolute', left: -40, top: 0, overflow: 'visible'}}>
						<circle cx={50} cy={50} r={44} fill="none" stroke={LPI.pink} strokeWidth={8} opacity={cross} />
						<line x1={20} y1={20} x2={20 + 60 * cross} y2={20 + 60 * cross} stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
					</svg>
				</div>
			) : null}
			<Burst at={MOIS + 6} x={540} y={620} r={320} n={12} />
			<Sfx name="pop" at={DOULEURS - 4} volume={0.08} />
			<Sfx name="pop" at={PERTE - 4} volume={0.08} />
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
			<Sfx name="pop" at={PANSEMENTS - 6} volume={0.08} />
			<Sfx name="ding" at={MOIS + 6} volume={0.08} />
		</AbsoluteFill>
	);
};
