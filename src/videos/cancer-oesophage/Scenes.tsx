// Scènes de « Le cancer de l'œsophage » (n° 58, voix gratuite d'abord). Accroche sans texte, réaliste : au repas, ton
// grand-père avale… et ça coince (il tousse, s'inquiète) ; il boit un grand verre d'eau ; l'assiette coupée en tout petits
// morceaux ; puis le bol de soupe ; plongée vers sa poitrine : loupe sur l'intérieur de l'œsophage, la tumeur apparaît.
// Puis l'œsophage (schéma fourni par le propriétaire, nettoyé de ses annotations : du fond de la gorge à l'estomac, la
// bouchée qui descend en vague, le sphincter), la paroi (coupe du tube : muqueuse, muscle, enveloppe), le cancer (la
// tumeur rétrécit le tube), les 2 types, les signes, les risques, la fibroscopie, les traitements, chute.
// Storyboard : docs/lpi/storyboard-cancer-oesophage.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ScopeIcon} from '../../brand/bladder';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {ChemoIcon, ScaleSofaIcon} from '../../brand/breast';
import {KIT, Kitchen} from '../../brand/colorectal';
import {CigaretteIcon, CoughIcon, ScalpelIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {LessAlcoholIcon} from '../../brand/liver';
import {DadBalcony, NoSmokeIcon, WeightLossIcon} from '../../brand/lungcancer';
import {Burst} from '../../brand/motion3';
import {CutPlateG, FruitVegIcon, GlandIcon, HoarseIcon, PainSwallowIcon, RefluxIcon, SoupBowlG, SquamousIcon, StentIcon, SwallowIcon, WaterGlassG} from '../../brand/oesophagus';
import {ScannerIcon, WineIcon} from '../../brand/pancreas';
import {RayIcon} from '../../brand/prostate';
import {Sfx} from '../../brand/Sfx';
import {DinnerPlate} from '../../brand/stomach';
import {alpha, FONT, LPI} from '../../brand/theme';
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
// Schéma « L'œsophage et le cancer de l'œsophage » fourni par le propriétaire (1536 × 1024), sans ses annotations
// (demandé) : la coupe de la tête (pharynx), l'œsophage, le sphincter, l'estomac ; la coupe du tube ; l'intérieur sain /
// avec cancer.
const IMG = {anat: 'images/oesophage/oesophage-propre-anatomie.png', w: 1536, h: 1024};
const DG = {
	all: {x: 386, y: 560, s: 1.15},
	pharynx: [352, 235],
	mid: [366, 520],
	sphincter: [378, 795],
	stomach: [470, 880],
} as const;
/** Le trajet de la bouchée, de la gorge à l'estomac (pixels de l'image). */
const BOLUS: [number, number][] = [[300, 175], [340, 215], [356, 300], [350, 420], [364, 520], [374, 620], [372, 720], [378, 795], [420, 850], [470, 885]];
/** L'acide qui veut remonter de l'estomac, arrêté par le sphincter. */
const ACID: [number, number][] = [[470, 900], [430, 860], [392, 820]];
/** Le tube de la fibroscopie, de la bouche jusqu'au milieu de l'œsophage. */
const SCOPE: [number, number][] = [[250, 150], [300, 175], [340, 215], [356, 300], [350, 420], [362, 500]];

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
const Diagram: React.FC<{keys: CamK[]; rings?: Ring[]; o?: number; card?: {left: number; top: number; w: number; h: number}; children?: React.ReactNode}> = ({keys, rings = [], o = 1, card = CARD, children}) => {
	const frame = useCurrentFrame();
	const c = camOf(frame, keys);
	const tx = card.w / 2 - c.x * c.s;
	const ty = card.h / 2 - c.y * c.s;
	return (
		<div style={{position: 'absolute', left: card.left, top: card.top, width: card.w, height: card.h, borderRadius: 48, overflow: 'hidden', background: '#FFFFFF', boxShadow: `0 18px 50px ${alpha(N, 0.18)}`, opacity: o}}>
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
								<ellipse rx={r.r + 8 + 5 * p} ry={(r.ry ?? r.r) + 8 + 5 * p} fill="none" stroke={alpha(LPI.pink, 0.45)} strokeWidth={14 / c.s} />
								<ellipse rx={r.r} ry={r.ry ?? r.r} fill="none" stroke={LPI.pink} strokeWidth={7 / c.s + 2} strokeDasharray={`${14 / c.s + 5} ${8 / c.s + 3}`} />
							</g>
						);
					})}
				</svg>
			</div>
		</div>
	);
};

/* ── La coupe du tube et les deux vues de l'intérieur (sain / avec cancer), chacune dans son calque ── */
const REG = {
	coupe: {x: 484, y: 310, w: 152, h: 412, layer: 'images/oesophage/oesophage-propre-coupe.png'},
	healthy: {x: 866, y: 192, w: 237, h: 160, layer: 'images/oesophage/oesophage-propre-sain.png'},
	cancer: {x: 1201, y: 192, w: 237, h: 160, layer: 'images/oesophage/oesophage-propre-cancer.png'},
} as const;
/** La tumeur dans la vue « cancer », et le même endroit dans la vue saine (pixels de la découpe). */
const TUMOR = [1376 - REG.cancer.x, 268 - REG.cancer.y] as const;
const LUMEN = [1319 - REG.cancer.x, 270 - REG.cancer.y] as const;
/** Les trois couches de la paroi, dans la découpe de la coupe (muqueuse, muscle, enveloppe). */
const LAYERS = {muq: [585 - REG.coupe.x, 430 - REG.coupe.y], mus: [603 - REG.coupe.x, 528 - REG.coupe.y], adv: [612 - REG.coupe.x, 640 - REG.coupe.y]} as const;
const Art: React.FC<{which: keyof typeof REG; cx: number; cy: number; s: number; o?: number; radius?: number; children?: React.ReactNode}> = ({which, cx, cy, s, o = 1, radius = 0, children}) => {
	const r = REG[which];
	return (
		<div style={{position: 'absolute', left: cx - (r.w * s) / 2, top: cy - (r.h * s) / 2, width: r.w, height: r.h, transformOrigin: '0 0', transform: `scale(${s})`, opacity: o}}>
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius}}>
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

const along = (pts: readonly (readonly [number, number])[], t: number): [number, number] => {
	const L: number[] = [0];
	for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
	const d = Math.max(0, Math.min(1, t)) * L[L.length - 1];
	let i = 1;
	while (i < L.length - 1 && L[i] < d) i++;
	const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
	return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
};
/** Le début d'un trajet (t 0 → 1), en polyligne. */
const partial = (pts: readonly (readonly [number, number])[], t: number) => {
	const out: string[] = [];
	const steps = 40;
	for (let i = 0; i <= steps; i++) {
		const [x, y] = along(pts, (i / steps) * t);
		out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
	}
	return out.join(' ');
};

/** La bouchée (brune) qui descend, avec l'anneau de muscle qui se serre juste au-dessus (la vague). */
const Bolus: React.FC<{t: number; o?: number}> = ({t, o = 1}) => {
	if (o <= 0 || t <= 0 || t >= 1) return null;
	const [x, y] = along(BOLUS, t);
	const [xa, ya] = along(BOLUS, Math.max(0, t - 0.06));
	return (
		<g opacity={o}>
			<ellipse cx={xa} cy={ya} rx={20} ry={6} fill="none" stroke={LPI.pink} strokeWidth={6} opacity={0.9} />
			<circle cx={x} cy={y} r={13} fill="#B9784A" stroke="#7A4A2A" strokeWidth={3} />
			<circle cx={x - 4} cy={y - 4} r={4} fill="#E0B48C" />
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : ÇA COINCE ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 300;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});
const PLATE = {x: 500, y: KIT.counter - 38};
const GLASS = {x: 860, y: KIT.counter - 6};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const COINCE = at('intro', 'coince');
	const BOIT = at('intro', 'boit');
	const PASSER = at('intro', 'passer');
	const COUPE = at('intro', 'coupe');
	const SOUPE = at('intro', 'soupe');
	const POURTANT = at('intro', 'pourtant');
	const MAL = at('intro', 'mal');
	const MEDECIN = at('intro', 'médecin');
	const cough = lin(frame, COINCE - 6, COINCE + 4) * (1 - lin(frame, BOIT - 6, BOIT + 4));
	const worry = Math.max(cough * 0.9, lin(frame, POURTANT - 6, POURTANT + 6) * 0.7);
	const water = 1 - 0.65 * lin(frame, BOIT, PASSER + 6);
	const toCut = lin(frame, COUPE - 6, COUPE + 8);
	const toSoup = lin(frame, SOUPE - 8, SOUPE + 6);
	const throat = dadPt([300, 470]);
	const dive = lin(frame, MAL - 10, MAL + 16);
	const s = 1 + 0.6 * dive;
	const tx = interpolate(dive, [0, 1], [0, 540 - throat.x * s]);
	const ty = interpolate(dive, [0, 1], [0, 880 - throat.y * s]);
	const lens = popAt(frame, MAL + 4);
	const toCancer = lin(frame, MEDECIN - 14, MEDECIN);
	return (
		<AbsoluteFill style={{background: '#F3EDE3', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Kitchen
					year="2026"
					onTop={
						<>
							<g transform={`translate(${PLATE.x} ${PLATE.y})`} opacity={1 - toSoup}>
								<g opacity={1 - toCut}>
									<DinnerPlate r={200} />
								</g>
								<g opacity={toCut}>
									<CutPlateG r={200} />
								</g>
							</g>
							{toSoup > 0 ? (
								<g transform={`translate(${PLATE.x} ${PLATE.y - 10})`} opacity={toSoup}>
									<SoupBowlG r={150} />
								</g>
							) : null}
							<g transform={`translate(${GLASS.x} ${GLASS.y})`}>
								<WaterGlassG fill={water} s={0.85} />
							</g>
						</>
					}
				>
					<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
						<DadBalcony width={DAD_W} cig={false} cough={cough} worry={worry} />
					</foreignObject>
				</Kitchen>
				{lens > 0.01 ? (
					<div style={{position: 'absolute', left: throat.x - 190, top: throat.y - 190, width: 380, height: 380, borderRadius: 190, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<Art which="healthy" cx={190} cy={190} s={1.95} o={1 - toCancer} />
						<Art which="cancer" cx={190} cy={190} s={1.95} o={toCancer}>
							<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={44} from={MEDECIN} sw={3} />
						</Art>
					</div>
				) : null}
			</AbsoluteFill>
			<Sfx name="cough-1" at={COINCE - 4} volume={0.5} />
			<Sfx name="pop" at={COUPE - 6} volume={0.05} />
			<Sfx name="pop" at={SOUPE - 8} volume={0.05} />
			<Sfx name="whoosh" at={MAL - 10} volume={0.07} />
			<Sfx name="pop" at={MAL + 4} volume={0.07} />
			<Sfx name="ding" at={MEDECIN - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ŒSOPHAGE ═══════════════════════════════ */
export const Oesophage: React.FC = () => {
	const frame = useCurrentFrame();
	const TUBE = at('oesophage', 'tube');
	const VINGT = at('oesophage', 'vingt-cinq');
	const GORGE = at('oesophage', 'gorge');
	const ESTOMAC = at('oesophage', "l'estomac");
	const MUSCLES = at('oesophage', 'muscles');
	const VAGUE = at('oesophage', 'vague');
	const ALIMENTS = at('oesophage', 'aliments');
	const BAS = at('oesophage', 'bas');
	const ANNEAU = at('oesophage', 'anneau');
	const FERME = at('oesophage', 'ferme');
	const ACIDE = at('oesophage', "l'acide");
	const REMONTER = at('oesophage', 'remonter');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: GORGE - 6, x: 330, y: 270, s: 1.9},
		{at: ESTOMAC - 4, x: 420, y: 840, s: 1.7},
		{at: MUSCLES - 4, ...DG.all},
		{at: BAS - 4, x: 385, y: 810, s: 2.4},
	];
	const ruler = lin(frame, VINGT - 6, VINGT + 14) * (1 - lin(frame, GORGE - 10, GORGE - 2));
	const bolusT = interpolate(frame, [MUSCLES, ALIMENTS + 30], [0, 1], clamp);
	const shut = lin(frame, FERME - 6, FERME + 6);
	const acidT = interpolate(frame, [ACIDE - 4, REMONTER + 6], [0, 1], clamp);
	const [ax, ay] = along(ACID, Math.min(acidT, 0.85));
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={MUSCLES - 6} text={"*L'œsophage*"} size={110} y={150} center />
			<Big from={MUSCLES - 2} to={BAS - 6} text={'Une *vague* de muscle'} size={96} y={150} center />
			<Big from={BAS - 2} text={'Le *sphincter*'} size={110} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: TUBE, to: VINGT + 30, x: 362, y: 510, r: 42, ry: 300},
					{from: GORGE - 2, to: ESTOMAC - 4, x: DG.pharynx[0], y: DG.pharynx[1], r: 50, ry: 60},
					{from: ESTOMAC, to: MUSCLES - 4, x: DG.stomach[0], y: DG.stomach[1], r: 110, ry: 90},
					{from: ANNEAU, x: DG.sphincter[0], y: DG.sphincter[1], r: 30, ry: 26},
				]}
			>
				{ruler > 0 ? (
					<g opacity={ruler}>
						<line x1={450} y1={230} x2={450} y2={230 + 565 * ruler} stroke={LPI.blue} strokeWidth={5} strokeDasharray="12 8" />
						<path d="M436 230 L464 230" stroke={LPI.blue} strokeWidth={5} />
						{ruler > 0.95 ? <path d="M436 795 L464 795" stroke={LPI.blue} strokeWidth={5} /> : null}
					</g>
				) : null}
				<Bolus t={bolusT} />
				{shut > 0 ? (
					<g transform={`translate(${DG.sphincter[0]} ${DG.sphincter[1]})`}>
						<path d={`M${-26 + 14 * shut} -6 L${-6 * (1 - shut)} 0 L${-26 + 14 * shut} 6`} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
						<path d={`M${26 - 14 * shut} -6 L${6 * (1 - shut)} 0 L${26 - 14 * shut} 6`} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
					</g>
				) : null}
				{acidT > 0 && acidT < 1 ? (
					<g opacity={Math.min(1, acidT * 6) * (1 - lin(frame, REMONTER + 6, REMONTER + 16))}>
						{[0, 1, 2].map((i) => (
							<circle key={i} cx={ax + (i - 1) * 16} cy={ay + Math.abs(i - 1) * 10} r={8} fill="#C8E04A" stroke="#FFFFFF" strokeWidth={2.5} />
						))}
					</g>
				) : null}
				{frame >= REMONTER ? (
					<g transform={`translate(${DG.sphincter[0] + 30} ${DG.sphincter[1] + 20}) scale(${popAt(frame, REMONTER)})`}>
						<circle r={16} fill={LPI.pink} stroke={N} strokeWidth={3} />
						<path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke={N} strokeWidth={4} strokeLinecap="round" />
					</g>
				) : null}
			</Diagram>
			<Note at={VINGT} to={GORGE - 6} y={1510} size={46} tone={LPI.paper}>
				≈ 25 cm
			</Note>
			<Note at={GORGE} to={ESTOMAC - 6} y={1510} size={46} tone={LPI.sky}>
				du fond de la gorge…
			</Note>
			<Note at={ESTOMAC} to={MUSCLES - 6} y={1510} size={46} tone={LPI.sky}>
				… jusqu'à l'estomac
			</Note>
			<Note at={VAGUE} to={BAS - 6} y={1510} size={46} tone={LPI.paper}>
				elle fait descendre les aliments
			</Note>
			<Note at={ANNEAU} to={ACIDE - 6} y={1510} size={46} tone={LPI.paper}>
				un anneau de muscle qui se ferme
			</Note>
			<Note at={ACIDE} y={1510} size={46} tone={LPI.pink}>
				l'acide ne remonte pas
			</Note>
			<Sfx name="whoosh" at={GORGE - 6} volume={0.05} />
			<Sfx name="whoosh" at={ESTOMAC - 4} volume={0.05} />
			<Sfx name="whoosh" at={MUSCLES} volume={0.05} />
			<Sfx name="pop" at={FERME - 4} volume={0.06} />
			<Sfx name="pop" at={REMONTER} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA PAROI ═══════════════════════════════ */
export const Paroi: React.FC = () => {
	const frame = useCurrentFrame();
	const MUQ = at('paroi', 'muqueuse');
	const MUS = at('paroi', 'muscle');
	const ENV = at('paroi', 'enveloppe');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Trois *couches*'} size={110} y={150} center />
			<ArtCard top={300} h={1080} o={fadeIn(frame, 0, 8)} />
			<Art which="coupe" cx={400} cy={840} s={2.45} o={fadeIn(frame, 0, 8)}>
				<PulseRing x={LAYERS.muq[0]} y={LAYERS.muq[1]} r={11} from={MUQ - 2} to={MUS - 4} sw={2.5} />
				<PulseRing x={LAYERS.mus[0]} y={LAYERS.mus[1]} r={11} from={MUS - 2} to={ENV - 4} sw={2.5} />
				<PulseRing x={LAYERS.adv[0]} y={LAYERS.adv[1]} r={11} from={ENV - 2} sw={2.5} />
			</Art>
			{(
				[
					[MUQ, 'la muqueuse', "à l'intérieur", 560, LPI.pink],
					[MUS, 'le muscle', 'il fait la vague', 820, LPI.sky],
					[ENV, "l'enveloppe", "l'attache aux voisins", 1100, LPI.paper],
				] as [number, string, string, number, string][]
			).map(([t, title, sub, y, tone], i) =>
				frame >= t - 4 ? (
					<div key={i} style={{position: 'absolute', left: 640, top: y, width: 380, transform: `scale(${popAt(frame, t - 4)})`, transformOrigin: '0 50%'}}>
						<div style={{display: 'inline-block', padding: '10px 24px', borderRadius: 999, background: tone, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{title}</div>
						<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: N, marginTop: 10, marginLeft: 8}}>{sub}</div>
					</div>
				) : null,
			)}
			<Sfx name="pop" at={MUQ - 4} volume={0.07} />
			<Sfx name="pop" at={MUS - 4} volume={0.07} />
			<Sfx name="pop" at={ENV - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
const Dividing: React.FC<{x: number; y: number; from: number; to: number}> = ({x, y, from, to}) => {
	const frame = useCurrentFrame();
	if (frame < from) return null;
	const k = lin(frame, from, to);
	const n = Math.min(12, Math.floor(1 + k * 12));
	const pts = [[0, 0], [8, -4], [-7, 5], [4, 9], [-9, -5], [11, 5], [0, -11], [-3, 14], [13, -7], [-12, 8], [7, 14], [-14, -1]];
	return (
		<g>
			{pts.slice(0, n).map(([dx, dy], i) => (
				<circle key={i} cx={x + dx} cy={y + dy} r={5.5 * popAt(frame, from + i * ((to - from) / 12))} fill="#F6C38C" stroke="#C97B3C" strokeWidth={1.2} />
			))}
		</g>
	);
};

export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELLULES = at('cancer', 'cellules');
	const MULTIPLIENT = at('cancer', 'multiplient');
	const TUMEUR = at('cancer', 'tumeur');
	const RETRECIT = at('cancer', 'rétrécit');
	const ALIMENTS = at('cancer', 'aliments');
	const MAL = at('cancer', 'mal');
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	const squeeze = lin(frame, RETRECIT - 4, RETRECIT + 10);
	const food = interpolate(frame, [ALIMENTS - 6, MAL + 6], [0, 1], clamp);
	const jiggle = food > 0.8 ? Math.sin(frame / 1.5) * 2 : 0;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={"Le *cancer* de l'œsophage"} size={84} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={ALIMENTS - 6} text={'Le tube *rétrécit*'} size={100} y={150} center />
			<Big from={ALIMENTS - 2} text={'Ça passe *mal*'} size={110} y={150} center />
			<ArtCard top={380} h={760} o={fadeIn(frame, 0, 8)} />
			<Art which="healthy" cx={540} cy={760} s={3.7} o={(1 - toCancer) * fadeIn(frame, 0, 8)} radius={22}>
				<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={22} from={CELLULES} to={MULTIPLIENT + 8} sw={1.5} />
				<Dividing x={TUMOR[0]} y={TUMOR[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
			</Art>
			<Art which="cancer" cx={540} cy={760} s={3.7} o={toCancer} radius={22}>
				<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={36} from={TUMEUR + 2} to={RETRECIT} sw={1.8} />
				{squeeze > 0 ? (
					<g opacity={squeeze} stroke={LPI.blue} strokeWidth={3.5} strokeLinecap="round" fill="none">
						<path d={`M${TUMOR[0] - 20} ${TUMOR[1]} l${-12 * squeeze} 0 M${TUMOR[0] - 26} ${TUMOR[1] - 6} l${-6} 6 l6 6`} />
					</g>
				) : null}
				{food > 0 ? (
					<g transform={`translate(${LUMEN[0] + jiggle} ${LUMEN[1]}) scale(${1.6 - 0.6 * food})`} opacity={Math.min(1, food * 4)}>
						<circle r={14} fill="#B9784A" stroke="#7A4A2A" strokeWidth={2} />
						<circle cx={-4} cy={-4} r={4} fill="#E0B48C" />
					</g>
				) : null}
			</Art>
			<Note at={CELLULES + 4} to={TUMEUR - 6} y={1250} size={44} tone={LPI.paper}>
				dans la paroi, sans contrôle
			</Note>
			<Note at={TUMEUR} to={ALIMENTS - 6} y={1250} size={44} tone={LPI.paper}>
				une tumeur prend la place
			</Note>
			<Note at={ALIMENTS} y={1250} size={44} tone={LPI.sky}>
				les aliments coincent
			</Note>
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="whoosh" at={ALIMENTS - 6} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES DEUX TYPES ═══════════════════════════════ */
export const Types: React.FC = () => {
	const frame = useCurrentFrame();
	const CARCINOME = at('types', 'carcinome');
	const HAUT = at('types', 'haut');
	const TABAC = at('types', 'tabac');
	const ADENO = at('types', "l'adénocarcinome");
	const BAS = at('types', 'bas');
	const REFLUX = at('types', 'reflux');
	const keys: CamK[] = [{at: 0, ...DG.all}];
	const card = {left: 40, top: 290, w: 470, h: 1140};
	const types: [number, string, React.ReactNode, number, string, React.ReactNode, string][] = [
		[CARCINOME, 'Carcinome épidermoïde', <SquamousIcon key="s" size={130} />, TABAC, 'tabac + alcool', <span key="i" style={{display: 'flex', gap: 6}}><CigaretteIcon size={70} color={N} /><WineIcon size={70} /></span>, 'en haut et au milieu'],
		[ADENO, 'Adénocarcinome', <GlandIcon key="g" size={130} />, REFLUX, "le reflux d'acide", <RefluxIcon key="r" size={80} />, "en bas, près de l'estomac"],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Deux *types*'} size={110} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				card={card}
				keys={[{...keys[0], s: 1.0, x: 380}]}
				rings={[
					{from: HAUT - 4, to: ADENO - 4, x: 358, y: 440, r: 36, ry: 210},
					{from: BAS - 4, x: 380, y: 770, r: 36, ry: 70},
				]}
			/>
			{types.map(([t, title, icon, tc, cause, causeIcon, where], i) =>
				frame >= t - 6 ? (
					<div key={i} style={{position: 'absolute', left: 540, top: 330 + i * 560, width: 500, padding: '24px 22px', borderRadius: 36, background: '#FFFFFF', border: `5px solid ${N}`, boxShadow: `0 12px 30px ${alpha(N, 0.15)}`, transform: `scale(${popAt(frame, t - 6)})`, transformOrigin: '50% 0'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							{icon}
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, lineHeight: 1.1}}>{title}</div>
						</div>
						{frame >= (i === 0 ? HAUT : BAS) - 4 ? (
							<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: LPI.blue, marginTop: 12, opacity: fadeIn(frame, (i === 0 ? HAUT : BAS) - 4, 6)}}>{where}</div>
						) : null}
						{frame >= tc - 4 ? (
							<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: '10px 18px', borderRadius: 999, background: LPI.pink, border: `4px solid ${N}`, transform: `scale(${popAt(frame, tc - 4)})`, transformOrigin: '0 50%'}}>
								{causeIcon}
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>{cause}</span>
							</div>
						) : null}
					</div>
				) : null,
			)}
			<Sfx name="pop" at={CARCINOME - 6} volume={0.08} />
			<Sfx name="pop" at={TABAC - 4} volume={0.06} />
			<Sfx name="pop" at={ADENO - 6} volume={0.08} />
			<Sfx name="pop" at={REFLUX - 4} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const AUCUN = at('signes', 'aucun');
	const PUIS = at('signes', 'puis');
	const AVALER = at('signes', 'avaler');
	const SOLIDES = at('signes', 'solides');
	const DOULEUR = at('signes', 'douleur');
	const PERTE = at('signes', 'perte');
	const VOIX = at('signes', 'voix');
	const TOUX = at('signes', 'toux');
	const aO = 1 - lin(frame, PUIS - 6, PUIS + 2);
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[AVALER, 'Du mal à avaler', <SwallowIcon key="s" size={125} />, "d'abord le solide, puis le liquide", SOLIDES - 4],
		[DOULEUR, 'Une douleur en avalant', <PainSwallowIcon key="p" size={125} />],
		[PERTE, 'Une perte de poids', <WeightLossIcon key="w" size={120} />],
		[VOIX, 'Une voix enrouée', <HoarseIcon key="h" size={120} />],
		[TOUX, 'Une toux en mangeant', <CoughIcon key="c" size={110} color={N} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={PUIS - 6} text={'Au *début*'} size={120} y={150} center />
			<Big from={PUIS - 2} text={'Puis *viennent*…'} size={110} y={150} center />
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<ArtCard top={380} h={700} />
					<Art which="cancer" cx={540} cy={730} s={3.6} radius={22} />
					<Stamp at={AUCUN} x={540} y={1220} text="AUCUN SIGNE" size={72} />
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

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const TABAC = at('risques', 'tabac');
	const ALCOOL = at('risques', "l'alcool");
	const ENSEMBLE = at('risques', 'ensemble');
	const REFLUX = at('risques', 'reflux');
	const SURPOIDS = at('risques', 'surpoids');
	const ALIM = at('risques', 'alimentation');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[TABAC, 'Le tabac', <CigaretteIcon key="t" size={120} color={N} />],
		[ALCOOL, "L'alcool", <WineIcon key="w" size={125} />, 'surtout avec le tabac', ENSEMBLE - 4],
		[REFLUX, 'Le reflux qui dure', <RefluxIcon key="r" size={125} />],
		[SURPOIDS, 'Le surpoids', <ScaleSofaIcon key="s" size={120} />],
		[ALIM, 'Peu de fruits et légumes', <FruitVegIcon key="f" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
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
	const FIBRO = at('examens', 'fibroscopie');
	const CAMERA = at('examens', 'caméra');
	const INTERIEUR = at('examens', "l'intérieur");
	const BIOPSIES = at('examens', 'biopsies');
	const SCANNER = at('examens', 'scanner');
	const ETENDU = at('examens', 'étendu');
	const scopeT = lin(frame, CAMERA - 4, INTERIEUR + 10);
	const [sx, sy] = along(SCOPE, scopeT);
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: CAMERA - 4, x: 330, y: 330, s: 1.6},
		{at: INTERIEUR - 4, x: 360, y: 470, s: 1.9},
	];
	const view = popAt(frame, INTERIEUR + 6);
	const vO = 1 - lin(frame, SCANNER - 8, SCANNER);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={SCANNER - 6} text={'La *fibroscopie*'} size={110} y={150} center />
			<Big from={SCANNER - 2} text={'Puis un *scanner*'} size={110} y={150} center />
			<Diagram o={fadeIn(frame, 0, 8) * vO} keys={keys}>
				{scopeT > 0 ? (
					<g>
						<polyline points={partial(SCOPE, scopeT)} fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
						<polyline points={partial(SCOPE, scopeT)} fill="none" stroke="#5E6670" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
						<circle cx={sx} cy={sy} r={8} fill={LPI.paper} stroke={N} strokeWidth={3} />
						<circle cx={sx} cy={sy} r={14 + 4 * Math.sin(frame / 3)} fill={alpha('#FFF6C8', 0.5)} />
					</g>
				) : null}
			</Diagram>
			{frame >= INTERIEUR + 6 && vO > 0 ? (
				<div style={{position: 'absolute', left: 540 - 230, top: 980, width: 460, height: 460, borderRadius: 230, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${view})`, opacity: vO}}>
					<Art which="cancer" cx={230} cy={230} s={2.4}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={34} from={INTERIEUR + 10} sw={2.5} />
						{frame >= BIOPSIES - 4 ? (
							<g transform={`translate(${TUMOR[0] - 30 + 12 * lin(frame, BIOPSIES - 4, BIOPSIES + 10)} ${TUMOR[1] + 40})`}>
								<line x1={-60} y1={40} x2={0} y2={0} stroke="#5E6670" strokeWidth={4} strokeLinecap="round" />
								<path d="M0 0 l8 -6 M0 0 l8 6" stroke={N} strokeWidth={3} strokeLinecap="round" />
							</g>
						) : null}
					</Art>
				</div>
			) : null}
			<Note at={CAMERA} to={INTERIEUR - 6} y={1510} size={46} tone={LPI.paper}>
				une petite caméra par la bouche
			</Note>
			<Note at={BIOPSIES} to={SCANNER - 6} y={1510} size={46} tone={LPI.pink}>
				des biopsies : de petits prélèvements
			</Note>
			{frame >= SCANNER - 6 ? (
				<div style={{position: 'absolute', left: 540 - 170, top: 520, transform: `scale(${popAt(frame, SCANNER - 6)})`}}>
					<ScannerIcon size={340} />
				</div>
			) : null}
			<Note at={ETENDU - 6} y={1000} size={50} tone={LPI.sky}>
				s'est-il étendu ?
			</Note>
			<Sfx name="pop" at={FIBRO - 4} volume={0.05} />
			<Sfx name="whoosh" at={CAMERA - 4} volume={0.06} />
			<Sfx name="pop" at={INTERIEUR + 6} volume={0.07} />
			<Sfx name="pop" at={BIOPSIES - 4} volume={0.06} />
			<Sfx name="pop" at={SCANNER - 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const CHIR = at('traitement', 'chirurgie');
	const PARTIE = at('traitement', 'partie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const RADIO = at('traitement', 'radiothérapie');
	const ASSOC = at('traitement', 'associées');
	const TOT = at('traitement', 'tôt');
	const PROTHESE = at('traitement', 'prothèse');
	const OUVERT = at('traitement', 'ouvert');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[CHIR, 'La chirurgie', <ScalpelIcon key="c" size={120} />, "retire une partie de l'œsophage", PARTIE - 4],
		[CHIMIO, 'La chimiothérapie', <ChemoIcon key="h" size={120} />],
		[RADIO, 'La radiothérapie', <RayIcon key="r" size={120} />, 'souvent associées', ASSOC - 4],
		[TOT, 'Pris très tôt : par la caméra', <ScopeIcon key="s" size={120} />],
		[PROTHESE, 'Une prothèse', <StentIcon key="p" size={120} />, 'elle garde le tube ouvert', OUVERT - 6],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Pour le *soigner*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={subAt} size={46} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const AVALER = at('fin', 'avaler');
	const CONSULTE = at('fin', 'consulte');
	const TABAC = at('fin', 'tabac');
	const ALCOOL = at('fin', "d'alcool");
	const REFLUX = at('fin', 'reflux');
	const PROTEGE = at('fin', 'protège');
	const aO = 1 - lin(frame, TABAC - 10, TABAC - 2);
	const gO = 1 - lin(frame, PROTEGE - 8, PROTEGE);
	const icons: [number, React.ReactNode, string][] = [
		[TABAC, <NoSmokeIcon key="n" size={230} />, 'moins de tabac'],
		[ALCOOL, <LessAlcoholIcon key="a" size={230} />, "moins d'alcool"],
		[REFLUX, <RefluxIcon key="r" size={230} />, 'soigner son reflux'],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={PROTEGE - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={PROTEGE - 2} text={'Ça protège son *œsophage*'} size={72} y={170} center />
			{aO > 0 && frame >= AVALER - 6 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<div style={{position: 'absolute', left: 540 - 200, top: 420, transform: `scale(${popAt(frame, AVALER - 6)})`}}>
						<SwallowIcon size={400} />
					</div>
					<Stamp at={CONSULTE} x={560} y={1000} text="ON CONSULTE VITE" size={70} />
				</AbsoluteFill>
			) : null}
			{gO > 0
				? icons.map(([t, icon, label], i) =>
						frame >= t - 4 ? (
							<div key={i} style={{position: 'absolute', left: 40 + i * 340, top: 460, width: 320, textAlign: 'center', transform: `scale(${popAt(frame, t - 4)})`, opacity: gO}}>
								{icon}
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, marginTop: 10}}>{label}</div>
							</div>
						) : null,
					)
				: null}
			{frame >= PROTEGE - 6 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, PROTEGE - 6, 8)}}>
					<ArtCard top={480} h={720} />
					<div style={{position: 'absolute', inset: 0, transform: `scale(${popAt(frame, PROTEGE - 6)})`}}>
						<Art which="healthy" cx={540} cy={840} s={3.6} radius={22} />
					</div>
				</AbsoluteFill>
			) : null}
			<Burst at={at('fin', 'œsophage')} x={540} y={840} r={420} n={12} />
			<Sfx name="pop" at={AVALER - 6} volume={0.08} />
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
			{icons.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 4} volume={0.08} />
			))}
			<Sfx name="ding" at={PROTEGE} volume={0.08} />
		</AbsoluteFill>
	);
};
