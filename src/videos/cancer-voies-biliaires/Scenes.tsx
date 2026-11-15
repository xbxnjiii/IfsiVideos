// Scènes de « Le cancer des voies biliaires » (n° 60, voix gratuite d'abord). Accroche sans texte, réaliste : la chambre
// la nuit, le réveil passe de 01:00 à 03:00, ton père se gratte (griffures, la couette remue) ; le matin, les urines
// foncées ; dans le miroir, le blanc de ses yeux jaunit ; plongée et loupe sur la voie biliaire : la tumeur. Puis les voies
// biliaires (schéma fourni par le propriétaire, nettoyé de ses annotations : la bile coule du foie vers la vésicule puis le
// cholédoque et le duodénum), le cancer, les 2 types, les signes (pourquoi le jaune), les risques, les examens, les
// traitements (prothèse : la jaunisse disparaît), chute « des yeux jaunes, des urines foncées, une peau qui gratte : on
// consulte vite ». Storyboard : docs/lpi/storyboard-cancer-voies-biliaires.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ItchIcon} from '../../brand/anal';
import {DuctIcon, GallbladderIcon, GallstoneIcon, PaleStoolIcon, ScratchMarks} from '../../brand/biliary';
import {ScopeIcon} from '../../brand/bladder';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {Bathroom, ChemoIcon, EchoIcon} from '../../brand/breast';
import {FeverIcon, ScalpelIcon, SyringeIcon, TiredIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {FattyLiverIcon, RibPainIcon} from '../../brand/liver';
import {DadBalcony, WeightLossIcon} from '../../brand/lungcancer';
import {GutInflamIcon} from '../../brand/anal';
import {Burst} from '../../brand/motion3';
import {StentIcon} from '../../brand/oesophagus';
import {DarkUrineIcon, InflamIcon, JaundiceEyeIcon, ScannerIcon} from '../../brand/pancreas';
import {Bedroom, FamilyIcon, RayIcon} from '../../brand/prostate';
import {Sfx} from '../../brand/Sfx';
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
// Schéma « Les voies biliaires et les cancers des voies biliaires » fourni par le propriétaire (1536 × 1024), sans ses
// annotations (demandé) : le foie, les voies biliaires dans et hors du foie, la vésicule, le cholédoque, le duodénum ; la
// voie biliaire saine / avec cancer.
const IMG = {anat: 'images/biliaire/biliaire-propre-anatomie.png', w: 1536, h: 1024};
const DG = {
	all: {x: 415, y: 470, s: 1.25},
	liver: [255, 280],
	intra: [445, 230],
	gall: [268, 492],
	extra: [446, 440],
	chol: [440, 570],
	duo: [330, 710],
} as const;
/** La bile : des petits canaux du foie jusqu'au duodénum ; une branche vers la vésicule (pixels de l'image). */
const BILE_L: [number, number][] = [[400, 135], [420, 200], [440, 260], [446, 330], [446, 420], [440, 520], [420, 600], [380, 660], [330, 700]];
const BILE_R: [number, number][] = [[600, 180], [520, 210], [470, 250], [448, 320], [446, 420], [440, 520], [420, 600], [380, 660], [330, 700]];
const TO_GB: [number, number][] = [[446, 360], [420, 345], [380, 340], [330, 380], [280, 440], [262, 490]];

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

/* ── Les deux vues de la voie biliaire (saine / avec cancer) ── */
const REG = {
	healthy: {x: 855, y: 158, w: 264, h: 168, layer: 'images/biliaire/biliaire-propre-sain.png'},
	cancer: {x: 1180, y: 156, w: 268, h: 164, layer: 'images/biliaire/biliaire-propre-cancer.png'},
} as const;
const TUMOR = [1345 - REG.cancer.x, 257 - REG.cancer.y] as const;
const TUMOR_H = [1020 - REG.healthy.x, 257 - REG.healthy.y] as const;
const Art: React.FC<{which: keyof typeof REG; cx: number; cy: number; s: number; o?: number; radius?: number; children?: React.ReactNode}> = ({which, cx, cy, s, o = 1, radius = 18, children}) => {
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
/** Gouttes de bile qui avancent en boucle ; `upto` arrête le trajet avant la fin (bouché). */
const DropFlow: React.FC<{paths: [number, number][][]; from: number; to?: number; speed?: number; n?: number; upto?: number}> = ({paths, from, to = 1e9, speed = 0.013, n = 6, upto = 1}) => {
	const frame = useCurrentFrame();
	const o = fadeIn(frame, from, 8) * (1 - lin(frame, to, to + 10));
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			{paths.map((p, j) =>
				Array.from({length: n}).map((_, i) => {
					const t = ((((frame - from) * speed + i / n + j * 0.07) % 1 + 1) % 1) * upto;
					const [x, y] = along(p, t);
					return <circle key={`${j}-${i}`} cx={x} cy={y} r={8} fill="#C8E04A" stroke="#FFFFFF" strokeWidth={2.5} opacity={Math.min(1, t * 8, (upto - t) * 8)} />;
				}),
			)}
		</g>
	);
};

/* ═══════════════════════════════ ACCROCHE : IL SE GRATTE LA NUIT ═══════════════════════════════ */
const DAD_W = 900;
const DAD_X = 90;
const DAD_Y = 330;
const dadPt = (p: readonly [number, number]) => ({x: DAD_X + (p[0] * DAD_W) / 600, y: DAD_Y + (p[1] * DAD_W) / 600});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('intro', 'trois');
	const GRATTE = at('intro', 'gratte');
	const DORMIR = at('intro', 'dormir');
	const MATIN = at('intro', 'matin');
	const URINES = at('intro', 'urines');
	const MIROIR = at('intro', 'miroir');
	const JAUNE = at('intro', 'jaune');
	const BILE = at('intro', 'bile');
	const MEDECIN = at('intro', 'médecin');
	const time = frame < TROIS - 2 ? '01:00' : '03:00';
	const pop = frame >= TROIS - 2 && frame < TROIS + 8 ? 1 - (frame - TROIS + 2) / 10 : 0;
	const scratch = lin(frame, GRATTE - 4, DORMIR);
	const wiggle = frame >= GRATTE - 4 && frame < MATIN - 6 ? Math.sin(frame / 1.6) * 10 : 0;
	const slide = lin(frame, MATIN - 10, MATIN + 4);
	const urine = popAt(frame, URINES - 4) * (1 - lin(frame, MIROIR - 6, MIROIR + 2));
	const jaundice = lin(frame, JAUNE - 16, JAUNE + 6);
	const face = dadPt([300, 212]);
	const eyes = lin(frame, MIROIR - 6, MIROIR + 10) * (1 - lin(frame, BILE - 8, BILE + 4));
	const dive = lin(frame, BILE - 8, BILE + 14);
	const belly = dadPt([250, 560]);
	const target = dive > 0 ? belly : face;
	const s = 1 + 1.6 * eyes + 0.7 * dive;
	const tx = 540 - target.x * s;
	const ty = 900 - target.y * s;
	const k = Math.max(eyes, dive);
	const lens = popAt(frame, BILE + 6);
	return (
		<AbsoluteFill style={{background: '#10182A', overflow: 'hidden'}}>
			{slide < 1 ? (
				<AbsoluteFill style={{transform: `translateX(${-1080 * slide}px)`}}>
					<Bedroom time={time} clockPop={pop} lamp={0} asleep={1}>
						{null}
					</Bedroom>
					<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
						<g transform={`translate(${wiggle} 0)`}>
							<ScratchMarks x={520} y={1120} k={scratch} s={1.5} />
							<ScratchMarks x={640} y={1150} k={lin(frame, GRATTE + 10, DORMIR + 14)} s={1.2} />
						</g>
					</svg>
				</AbsoluteFill>
			) : null}
			{slide > 0 ? (
				<AbsoluteFill style={{transform: `translateX(${1080 * (1 - slide)}px)`}}>
					<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx * k}px, ${ty * k}px) scale(${1 + (s - 1) * (k > 0 ? 1 : 0)})`}}>
						<Bathroom>
							<foreignObject x={DAD_X} y={DAD_Y} width={DAD_W} height={DAD_W * 1.7} style={{overflow: 'visible'}}>
								<DadBalcony width={DAD_W} cig={false} jaundice={jaundice} worry={jaundice * 0.7} />
							</foreignObject>
						</Bathroom>
					</AbsoluteFill>
					{urine > 0.01 ? (
						<div style={{position: 'absolute', left: 540 - 130, top: 1300, transform: `scale(${urine})`, background: '#FFFFFF', borderRadius: 40, padding: 20, boxShadow: `0 10px 30px ${alpha(N, 0.25)}`}}>
							<DarkUrineIcon size={220} />
						</div>
					) : null}
					{lens > 0.01 ? (
						<div style={{position: 'absolute', left: 540 - 240, top: 1120, width: 480, height: 480, borderRadius: 240, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
							<Art which="cancer" cx={240} cy={240} s={2.6} radius={0}>
								<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={44} from={MEDECIN - 6} sw={3} />
							</Art>
						</div>
					) : null}
				</AbsoluteFill>
			) : null}
			<Sfx name="tick" at={TROIS - 2} volume={0.08} />
			<Sfx name="whoosh" at={MATIN - 10} volume={0.06} />
			<Sfx name="pop" at={URINES - 4} volume={0.06} />
			<Sfx name="whoosh" at={MIROIR - 6} volume={0.06} />
			<Sfx name="ding" at={JAUNE - 2} volume={0.07} />
			<Sfx name="whoosh" at={BILE - 8} volume={0.06} />
			<Sfx name="pop" at={BILE + 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES VOIES BILIAIRES ═══════════════════════════════ */
export const Voies: React.FC = () => {
	const frame = useCurrentFrame();
	const FOIE = at('voies', 'foie');
	const BILE = at('voies', 'bile');
	const GRAISSES = at('voies', 'graisses');
	const CANAUX = at('voies', 'canaux');
	const DABORD = at('voies', "d'abord");
	const REJOIGNENT = at('voies', 'rejoignent');
	const VESICULE = at('voies', 'vésicule');
	const STOCKE = at('voies', 'stocke');
	const CHOL = at('voies', 'cholédoque');
	const DUO = at('voies', 'duodénum');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: DABORD - 4, x: 470, y: 260, s: 1.7},
		{at: VESICULE - 4, x: 330, y: 440, s: 1.8},
		{at: CHOL - 4, x: 410, y: 600, s: 1.7},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={CANAUX - 6} text={'La *bile*'} size={120} y={150} center />
			<Big from={CANAUX - 2} to={VESICULE - 6} text={'Les voies *biliaires*'} size={96} y={150} center />
			<Big from={VESICULE - 2} to={CHOL - 6} text={'La *vésicule*'} size={110} y={150} center />
			<Big from={CHOL - 2} text={'Le *cholédoque*'} size={104} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: FOIE, to: BILE + 10, x: DG.liver[0], y: DG.liver[1], r: 160, ry: 140},
					{from: DABORD, to: VESICULE - 4, x: DG.intra[0], y: DG.intra[1], r: 90, ry: 70},
					{from: REJOIGNENT, to: VESICULE - 4, x: DG.extra[0], y: DG.extra[1], r: 30, ry: 60},
					{from: VESICULE, to: CHOL - 4, x: DG.gall[0], y: DG.gall[1], r: 70, ry: 60},
					{from: CHOL, to: DUO - 4, x: DG.chol[0], y: DG.chol[1], r: 30, ry: 70},
					{from: DUO, x: DG.duo[0], y: DG.duo[1], r: 110, ry: 60},
				]}
			>
				<DropFlow paths={[BILE_L, BILE_R]} from={CANAUX - 4} />
				<DropFlow paths={[TO_GB]} from={STOCKE - 6} n={4} speed={0.016} />
			</Diagram>
			<Note at={BILE} to={CANAUX - 6} y={1510} size={46} tone={LPI.paper}>
				{frame >= GRAISSES - 4 ? 'elle aide à digérer les graisses' : 'fabriquée par le foie'}
			</Note>
			<Note at={DABORD} to={VESICULE - 6} y={1510} size={46} tone={LPI.sky}>
				{frame >= REJOIGNENT - 4 ? 'puis ils se rejoignent' : "d'abord dans le foie"}
			</Note>
			<Note at={STOCKE} to={CHOL - 6} y={1510} size={46} tone={LPI.paper}>
				elle stocke la bile entre les repas
			</Note>
			<Note at={CHOL + 10} y={1510} size={46} tone={LPI.pink}>
				{frame >= DUO - 4 ? 'il la verse dans le duodénum' : 'le canal principal'}
			</Note>
			<Sfx name="whoosh" at={DABORD - 4} volume={0.05} />
			<Sfx name="whoosh" at={VESICULE - 4} volume={0.05} />
			<Sfx name="whoosh" at={CHOL - 4} volume={0.05} />
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
				<circle key={i} cx={x + dx} cy={y + dy} r={5.5 * popAt(frame, from + i * ((to - from) / 12))} fill="#F6B07A" stroke="#C9703C" strokeWidth={1.2} />
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
	const RARE = at('cancer', 'rare');
	const TARD = at('cancer', 'tard');
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	const squeeze = lin(frame, RETRECIT - 4, RETRECIT + 10);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={'Le *cancer* des voies biliaires'} size={76} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={RARE - 6} text={'Le canal *rétrécit*'} size={100} y={150} center />
			<Big from={RARE - 2} text={'Rare… mais *tardif*'} size={100} y={150} center />
			<ArtCard top={380} h={760} o={fadeIn(frame, 0, 8)} />
			<Art which="healthy" cx={540} cy={760} s={3.5} o={(1 - toCancer) * fadeIn(frame, 0, 8)}>
				<PulseRing x={TUMOR_H[0]} y={TUMOR_H[1]} r={22} from={CELLULES} to={MULTIPLIENT + 8} sw={1.5} />
				<Dividing x={TUMOR_H[0]} y={TUMOR_H[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
			</Art>
			<Art which="cancer" cx={540} cy={760} s={3.5} o={toCancer}>
				<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={42} from={TUMEUR + 2} to={RARE} sw={1.8} />
				{squeeze > 0 ? (
					<g opacity={squeeze} stroke={LPI.blue} strokeWidth={3.5} strokeLinecap="round" fill="none">
						<path d={`M${TUMOR[0] - 60 + 10 * squeeze} ${TUMOR[1] + 20} l12 -6 M${TUMOR[0] - 60 + 10 * squeeze} ${TUMOR[1] + 20} l6 10`} />
					</g>
				) : null}
			</Art>
			<Note at={CELLULES + 4} to={TUMEUR - 6} y={1250} size={44} tone={LPI.paper}>
				dans la paroi des canaux
			</Note>
			<Note at={TUMEUR} to={RARE - 6} y={1250} size={44} tone={LPI.paper}>
				une tumeur qui bouche le passage
			</Note>
			<Stamp at={TARD} x={560} y={1300} text="SOUVENT DÉCOUVERT TARD" size={56} />
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="stamp" at={TARD} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES DEUX TYPES ═══════════════════════════════ */
export const Types: React.FC = () => {
	const frame = useCurrentFrame();
	const CHOLANGIO = at('types', 'cholangiocarcinome');
	const FREQUENT = at('types', 'fréquent');
	const VESICULE = at('types', 'vésicule');
	const RARE = at('types', 'rare');
	const cards: [number, string, React.ReactNode, number, string, string][] = [
		[CHOLANGIO, 'Cholangiocarcinome', <DuctIcon key="d" size={200} />, FREQUENT, 'le plus fréquent', 'la tumeur des canaux biliaires'],
		[VESICULE, 'Cancer de la vésicule', <GallbladderIcon key="g" size={200} tumor />, RARE, 'plus rare', 'la vésicule biliaire'],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Deux *types*'} size={110} y={150} center />
			{cards.map(([t, title, icon, tb, badge, sub], i) =>
				frame >= t - 6 ? (
					<div key={i} style={{position: 'absolute', left: 60, top: 340 + i * 560, width: 960, height: 500, borderRadius: 40, background: '#FFFFFF', border: `6px solid ${N}`, boxShadow: `0 14px 36px ${alpha(N, 0.16)}`, transform: `scale(${popAt(frame, t - 6)})`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px'}}>
						{icon}
						<div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, lineHeight: 1.1}}>{title}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 40, color: LPI.blue, marginTop: 10}}>{sub}</div>
							{frame >= tb - 4 ? (
								<div style={{display: 'inline-block', marginTop: 18, padding: '10px 26px', borderRadius: 999, background: i ? LPI.sky : LPI.pink, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, transform: `scale(${popAt(frame, tb - 4)})`}}>{badge}</div>
							) : null}
						</div>
					</div>
				) : null,
			)}
			<Sfx name="pop" at={CHOLANGIO - 6} volume={0.08} />
			<Sfx name="pop" at={FREQUENT - 4} volume={0.06} />
			<Sfx name="pop" at={VESICULE - 6} volume={0.08} />
			<Sfx name="pop" at={RARE - 4} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const BOUCHE = at('signes', 'bouche');
	const SANG = at('signes', 'sang');
	const JAUNISSENT = at('signes', 'jaunissent');
	const ICTERE = at('signes', "l'ictère");
	const URINES = at('signes', 'urines');
	const SELLES = at('signes', 'selles');
	const GRATTE = at('signes', 'gratte');
	const PARFOIS = at('signes', 'parfois');
	const DOULEUR = at('signes', 'douleur');
	const FATIGUE = at('signes', 'fatigue');
	const PERTE = at('signes', 'perte');
	const FIEVRE = at('signes', 'fièvre');
	const dO = 1 - lin(frame, JAUNISSENT - 8, JAUNISSENT);
	const back = interpolate(frame, [SANG - 10, SANG + 20], [0, 1], clamp);
	const first: [number, string, React.ReactNode, string?, number?][] = [
		[JAUNISSENT, 'La peau et les yeux jaunes', <JaundiceEyeIcon key="j" size={120} />, "c'est l'ictère", ICTERE],
		[URINES, 'Des urines foncées', <DarkUrineIcon key="u" size={120} />],
		[SELLES, 'Des selles claires', <PaleStoolIcon key="s" size={120} />],
		[GRATTE, 'La peau qui gratte', <ItchIcon key="i" size={120} />],
	];
	const more: [number, string, React.ReactNode][] = [
		[DOULEUR, 'Douleur à droite', <RibPainIcon key="r" size={150} />],
		[FATIGUE, 'Fatigue', <TiredIcon key="t" size={140} />],
		[PERTE, 'Perte de poids', <WeightLossIcon key="w" size={150} />],
		[FIEVRE, 'Fièvre', <FeverIcon key="f" size={140} />],
	];
	const fO = 1 - lin(frame, PARFOIS - 8, PARFOIS);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={JAUNISSENT - 6} text={'Pourquoi ce *jaune* ?'} size={100} y={150} center />
			<Big from={JAUNISSENT - 2} to={PARFOIS - 6} text={'La bile *repart*'} size={104} y={150} center />
			<Big from={PARFOIS - 2} text={'Parfois *aussi*'} size={110} y={150} center />
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Diagram keys={[{at: 0, x: 430, y: 470, s: 1.5}]}>
						<DropFlow paths={[BILE_L, BILE_R]} from={0} upto={0.62} speed={0.012} />
						<circle cx={443} cy={545} r={26} fill="#F6B07A" stroke="#C9703C" strokeWidth={3} opacity={popAt(frame, BOUCHE - 4)} />
						{back > 0 ? (
							<g opacity={Math.min(1, back * 3)}>
								{[0, 1, 2, 3].map((i) => {
									const t = (back + i * 0.25) % 1;
									return <circle key={i} cx={430 - 280 * t} cy={420 - 80 * t} r={9} fill="#C8E04A" stroke="#B3122E" strokeWidth={3} />;
								})}
							</g>
						) : null}
					</Diagram>
					<Note at={BOUCHE} to={SANG - 6} y={1510} size={46} tone={LPI.paper}>
						la tumeur bouche le canal
					</Note>
					<Note at={SANG} y={1510} size={46} tone={LPI.pink}>
						la bile repart dans le sang
					</Note>
				</AbsoluteFill>
			) : null}
			{fO > 0
				? first.map(([t, title, icon, sub, subAt], i) => (
						<div key={i} style={{opacity: fO}}>
							<RowCard at={t - 6} y={340 + i * 240} h={210} art={150} badge={i + 1} title={title} sub={sub} subAt={subAt} size={50} from={i % 2 ? 'left' : 'right'}>
								{icon}
							</RowCard>
						</div>
					))
				: null}
			{more.map(([t, label, icon], i) =>
				frame >= t - 4 ? (
					<div key={i} style={{position: 'absolute', left: 60 + (i % 2) * 500, top: 380 + Math.floor(i / 2) * 520, width: 460, textAlign: 'center', transform: `scale(${popAt(frame, t - 4)})`}}>
						<div style={{display: 'inline-block', background: '#FFFFFF', borderRadius: 40, padding: 30, border: `5px solid ${N}`}}>{icon}</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N, marginTop: 14}}>{label}</div>
					</div>
				) : null,
			)}
			<Sfx name="impact" at={BOUCHE} volume={0.08} />
			<Sfx name="whoosh" at={SANG - 6} volume={0.05} />
			{first.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			{more.map(([t], i) => (
				<Sfx key={`m${i}`} name="pop" at={t - 4} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const CALCULS = at('risques', 'calculs');
	const INFLAM = at('risques', 'inflammation');
	const MALADIE = at('risques', 'maladie');
	const CIRRHOSE = at('risques', 'cirrhose');
	const MALADIES = at('risques', 'maladies');
	const PREDISPO = at('risques', 'prédisposition');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[CALCULS, 'Des calculs biliaires qui durent', <GallstoneIcon key="g" size={125} />],
		[INFLAM, 'Une inflammation des canaux', <InflamIcon key="i" size={120} />],
		[MALADIE, 'Une maladie du foie', <FattyLiverIcon key="f" size={125} />, 'cirrhose, hépatite', CIRRHOSE - 4],
		[MALADIES, "Maladies inflammatoires de l'intestin", <GutInflamIcon key="m" size={120} />],
		[PREDISPO, 'Parfois, la famille', <FamilyIcon key="a" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={subAt} size={44} from={i % 2 ? 'left' : 'right'}>
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
	const PRISE = at('examens', 'prise');
	const ECHO = at('examens', 'échographie');
	const SCANNER = at('examens', 'scanner');
	const IRM = at('examens', 'irm');
	const CAMERA = at('examens', 'caméra');
	const BIOPSIE = at('examens', 'biopsie');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[PRISE, 'Une prise de sang', <SyringeIcon key="s" size={115} color={N} />],
		[ECHO, 'Une échographie', <EchoIcon key="e" size={125} />],
		[SCANNER, 'Scanner et IRM', <ScannerIcon key="c" size={125} />, 'des voies biliaires', IRM + 10],
		[CAMERA, 'Une petite caméra par la bouche', <ScopeIcon key="o" size={120} />, 'et une biopsie', BIOPSIE - 4],
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'Pour le *trouver*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={350 + i * 250} h={225} art={160} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const CHIR = at('traitement', 'chirurgie');
	const FOIE = at('traitement', 'foie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const RADIO = at('traitement', 'radiothérapie');
	const PROTHESE = at('traitement', 'prothèse');
	const JAUNISSE = at('traitement', 'jaunisse');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[CHIR, 'La chirurgie', <ScalpelIcon key="c" size={120} />, 'avec une partie du foie ou la vésicule', FOIE - 4],
		[CHIMIO, 'La chimiothérapie', <ChemoIcon key="h" size={120} />],
		[RADIO, 'Parfois, la radiothérapie', <RayIcon key="r" size={120} />],
		[PROTHESE, 'Une prothèse', <StentIcon key="p" size={120} />, 'la bile passe à nouveau', JAUNISSE - 30],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Pour le *soigner*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={340 + i * 250} h={225} art={160} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Stamp at={JAUNISSE} x={560} y={1430} text="LA JAUNISSE DISPARAÎT" size={58} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="stamp" at={JAUNISSE} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const YEUX = at('fin', 'yeux');
	const URINES = at('fin', 'urines');
	const PEAU = at('fin', 'peau');
	const CONSULTE = at('fin', 'consulte');
	const icons: [number, React.ReactNode, string][] = [
		[YEUX, <JaundiceEyeIcon key="j" size={230} />, 'des yeux jaunes'],
		[URINES, <DarkUrineIcon key="u" size={230} />, 'des urines foncées'],
		[PEAU, <ItchIcon key="i" size={230} />, 'une peau qui gratte'],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Va lui en *parler*'} size={110} y={170} center />
			{icons.map(([t, icon, label], i) =>
				frame >= t - 4 ? (
					<div key={i} style={{position: 'absolute', left: 40 + i * 340, top: 460, width: 320, textAlign: 'center', transform: `scale(${popAt(frame, t - 4)})`}}>
						{icon}
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, marginTop: 10}}>{label}</div>
					</div>
				) : null,
			)}
			<Stamp at={CONSULTE} x={560} y={1060} text="ON CONSULTE VITE" size={76} />
			<Burst at={CONSULTE + 2} x={540} y={1060} r={360} n={12} />
			{icons.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 4} volume={0.08} />
			))}
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
		</AbsoluteFill>
	);
};
