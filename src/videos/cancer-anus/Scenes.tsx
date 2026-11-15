// Scènes de « Le cancer de l'anus » (n° 59, voix gratuite d'abord). Accroche sans texte, réaliste : le rouleau de papier
// toilette en gros plan, la feuille tirée, une petite tache de sang ; puis ta mère dans la salle de bain, gênée
// (« Des hémorroïdes… », « C'est gênant… ») ; loupe sur le canal anal : la tumeur. Puis l'anus (schéma fourni par le
// propriétaire, nettoyé de ses annotations : rectum, canal anal, sphincters), le cancer (rare mais en hausse, femmes après
// 50 ans), le papillomavirus, les signes (comme des hémorroïdes), les risques, les examens, les traitements, chute
// « du sang qui dure, on consulte… et le vaccin contre le papillomavirus ».
// Storyboard : docs/lpi/storyboard-cancer-anus.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AnoscopeIcon, BloodPaperIcon, DischargeIcon, ForcepsIcon, GirlBoyIcon, GloveFingerIcon, GutInflamIcon, Hpv, HpvIcon, HpvVaccineIcon, ItchIcon, PartnersIcon, ShieldLowIcon, SphincterKeepIcon, ToiletPaperWall, WallCell} from '../../brand/anal';
import {Big, fadeIn, Note, popAt, RowCard} from '../../brand/bold';
import {Bathroom, ChemoIcon, LumpIcon, MumTowel} from '../../brand/breast';
import {CigaretteIcon, PainIcon, ScalpelIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {ScannerIcon} from '../../brand/pancreas';
import {AgeIcon, RayIcon} from '../../brand/prostate';
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
// Schéma « L'anus et le cancer de l'anus » fourni par le propriétaire (1536 × 1024), sans ses annotations (demandé) :
// la bande centrale (rectum, canal anal, sphincters interne et externe, anus) ; le canal sain / avec cancer.
const IMG = {anat: 'images/anus/anus-propre-anatomie.png', w: 1536, h: 1024};
const DG = {
	all: {x: 430, y: 430, s: 1.6},
	rectum: [418, 220],
	canal: [402, 540],
	anus: [418, 702],
	intL: [292, 640],
	intR: [528, 625],
	ext: [553, 610],
} as const;
/** Les selles qui descendent du rectum jusqu'à l'anus (pixels de l'image). */
const STOOL: [number, number][] = [[418, 230], [412, 330], [404, 440], [404, 560], [414, 680], [418, 740]];

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

/* ── Les deux vues du canal (sain / avec cancer), recadrées ── */
const REG = {
	healthy: {x: 848, y: 182, w: 268, h: 176, layer: 'images/anus/anus-propre-sain.png'},
	cancer: {x: 1182, y: 182, w: 266, h: 176, layer: 'images/anus/anus-propre-cancer.png'},
} as const;
const TUMOR = [1355 - REG.cancer.x, 262 - REG.cancer.y] as const;
const TUMOR_H = [1021 - REG.healthy.x, 262 - REG.healthy.y] as const;
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

/* ═══════════════════════════════ ACCROCHE : LE PAPIER TOILETTE ═══════════════════════════════ */
const MUM_W = 900;
const MUM_X = 90;
const MUM_Y = 280;

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('intro', 'sang');
	const GRATTE = at('intro', 'gratte');
	const DIT = at('intro', 'dit');
	const OSE = at('intro', "n'ose");
	const POURTANT = at('intro', 'pourtant');
	const SAIGNEMENT = at('intro', 'saignement');
	const MEDECIN = at('intro', 'médecin');
	const pull = lin(frame, 4, 40);
	const blood = lin(frame, SANG - 6, SANG + 12);
	const slide = lin(frame, GRATTE - 14, GRATTE);
	const worry = lin(frame, GRATTE - 4, GRATTE + 10);
	const look = lin(frame, OSE - 6, OSE + 8) * (1 - lin(frame, POURTANT, POURTANT + 10));
	const lens = popAt(frame, POURTANT + 2);
	const toCancer = lin(frame, SAIGNEMENT - 4, SAIGNEMENT + 12);
	return (
		<AbsoluteFill style={{background: '#EEF2F4', overflow: 'hidden'}}>
			{slide < 1 ? (
				<AbsoluteFill style={{transform: `translateX(${-1080 * slide}px) scale(${1 + 0.06 * pull})`, transformOrigin: '50% 40%'}}>
					<ToiletPaperWall pull={pull} blood={blood} />
				</AbsoluteFill>
			) : null}
			{slide > 0 ? (
				<AbsoluteFill style={{transform: `translateX(${1080 * (1 - slide)}px)`}}>
					<Bathroom>
						<foreignObject x={MUM_X} y={MUM_Y} width={MUM_W} height={MUM_W * 1.7} style={{overflow: 'visible'}}>
							<MumTowel width={MUM_W} worry={worry} look={look} />
						</foreignObject>
					</Bathroom>
				</AbsoluteFill>
			) : null}
			{frame >= DIT - 4 && frame < OSE - 2 ? (
				<div style={{position: 'absolute', left: 60, top: 260, transform: `scale(${popAt(frame, DIT - 4)})`, opacity: 1 - lin(frame, OSE - 10, OSE - 2)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>Des hémorroïdes…</span>
					</Bubble>
				</div>
			) : null}
			{frame >= OSE - 2 && frame < POURTANT + 6 ? (
				<div style={{position: 'absolute', left: 420, top: 260, transform: `scale(${popAt(frame, OSE - 2)})`, opacity: 1 - lin(frame, POURTANT - 2, POURTANT + 6)}}>
					<Bubble think tail="left">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>C'est gênant…</span>
					</Bubble>
				</div>
			) : null}
			{lens > 0.01 ? (
				<div style={{position: 'absolute', left: 540 - 250, top: 1120, width: 500, height: 500, borderRadius: 250, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.pink, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
					<Art which="healthy" cx={250} cy={250} s={2.6} o={1 - toCancer} radius={0} />
					<Art which="cancer" cx={250} cy={250} s={2.6} o={toCancer} radius={0}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={44} from={MEDECIN - 4} sw={3} />
					</Art>
				</div>
			) : null}
			<Sfx name="whoosh" at={2} volume={0.04} />
			<Sfx name="ding" at={SANG - 4} volume={0.06} />
			<Sfx name="whoosh" at={GRATTE - 14} volume={0.06} />
			<Sfx name="pop" at={DIT - 4} volume={0.06} />
			<Sfx name="pop" at={OSE - 2} volume={0.06} />
			<Sfx name="pop" at={POURTANT + 2} volume={0.07} />
			<Sfx name="ding" at={MEDECIN - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ANUS ═══════════════════════════════ */
export const Anus: React.FC = () => {
	const frame = useCurrentFrame();
	const TUBE = at('anus', 'tube');
	const DESSUS = at('anus', 'au-dessus');
	const RECTUM = at('anus', 'rectum');
	const SELLES = at('anus', 'selles');
	const CANAL = at('anus', 'canal');
	const TROIS = at('anus', 'trois');
	const CONDUIT = at('anus', 'conduit');
	const EXT = at('anus', "l'extérieur");
	const AUTOUR = at('anus', 'autour');
	const SPHINCTERS = at('anus', 'sphincters');
	const FERME = at('anus', 'fermé');
	const LUN = at('anus', "l'un");
	const LAUTRE = at('anus', "l'autre");
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: DESSUS - 4, x: 420, y: 270, s: 2.0},
		{at: CANAL - 4, x: 410, y: 540, s: 2.1},
		{at: AUTOUR - 4, ...DG.all},
		{at: SPHINCTERS - 4, x: 420, y: 600, s: 1.9},
	];
	const stoolT = interpolate(frame, [CONDUIT - 4, EXT + 30], [0, 1], clamp);
	const stoolO = fadeIn(frame, SELLES - 4, 6) * (1 - lin(frame, EXT + 26, EXT + 34));
	const [sx, sy] = along(STOOL, stoolT);
	const ruler = lin(frame, TROIS - 4, TROIS + 14) * (1 - lin(frame, EXT + 4, EXT + 12));
	const squeeze = lin(frame, FERME - 6, FERME + 6);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} to={DESSUS - 6} text={"*L'anus*"} size={120} y={150} center />
			<Big from={DESSUS - 2} to={CANAL - 6} text={'Le *rectum*'} size={110} y={150} center />
			<Big from={CANAL - 2} to={AUTOUR - 6} text={'Le canal *anal*'} size={104} y={150} center />
			<Big from={AUTOUR - 2} text={'Les *sphincters*'} size={104} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: TUBE, to: DESSUS - 4, x: DG.anus[0], y: DG.anus[1], r: 50, ry: 26},
					{from: RECTUM, to: CANAL - 4, x: DG.rectum[0], y: DG.rectum[1] + 20, r: 120, ry: 110},
					{from: CANAL, to: AUTOUR - 4, x: DG.canal[0], y: DG.canal[1], r: 40, ry: 110},
					{from: LUN - 2, to: LAUTRE - 4, x: DG.intL[0] + 18, y: DG.intL[1] - 10, r: 34, ry: 60},
					{from: LUN - 2, to: LAUTRE - 4, x: DG.intR[0] - 18, y: DG.intR[1], r: 34, ry: 60},
					{from: LAUTRE - 2, x: DG.ext[0] + 10, y: DG.ext[1], r: 40, ry: 80},
				]}
			>
				{stoolO > 0 ? (
					<g opacity={stoolO}>
						<ellipse cx={sx} cy={sy} rx={22} ry={16} fill="#8A5A34" stroke="#5E3B1E" strokeWidth={3} />
						<ellipse cx={sx - 6} cy={sy - 5} rx={6} ry={4} fill="#B07A4C" />
					</g>
				) : null}
				{ruler > 0 ? (
					<g opacity={ruler}>
						<line x1={470} y1={470} x2={470} y2={470 + 230 * ruler} stroke={LPI.blue} strokeWidth={4} strokeDasharray="10 7" />
						<path d="M458 470 L482 470" stroke={LPI.blue} strokeWidth={4} />
						{ruler > 0.95 ? <path d="M458 700 L482 700" stroke={LPI.blue} strokeWidth={4} /> : null}
					</g>
				) : null}
				{squeeze > 0 ? (
					<g stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" fill="none" opacity={squeeze}>
						<path d={`M${352 + 16 * squeeze} 640 l14 0 M${352 + 16 * squeeze + 6} 632 l8 8 l-8 8`} />
						<path d={`M${484 - 16 * squeeze} 640 l-14 0 M${484 - 16 * squeeze - 6} 632 l-8 8 l8 8`} />
					</g>
				) : null}
			</Diagram>
			<Note at={TUBE} to={DESSUS - 6} y={1510} size={46} tone={LPI.paper}>
				la toute fin du tube digestif
			</Note>
			<Note at={SELLES} to={CANAL - 6} y={1510} size={46} tone={LPI.sky}>
				il garde les selles
			</Note>
			<Note at={TROIS} to={AUTOUR - 6} y={1510} size={46} tone={LPI.paper}>
				3 à 4 cm, vers l'extérieur
			</Note>
			<Note at={SPHINCTERS} to={LUN - 6} y={1510} size={46} tone={LPI.paper}>
				deux anneaux de muscle
			</Note>
			<Note at={LUN} to={LAUTRE - 6} y={1510} size={46} tone={LPI.sky}>
				l'interne : sans qu'on y pense
			</Note>
			<Note at={LAUTRE} y={1510} size={46} tone={LPI.pink}>
				l'externe : quand on le décide
			</Note>
			<Sfx name="whoosh" at={DESSUS - 4} volume={0.05} />
			<Sfx name="whoosh" at={CANAL - 4} volume={0.05} />
			<Sfx name="whoosh" at={AUTOUR - 4} volume={0.05} />
			<Sfx name="pop" at={FERME - 4} volume={0.06} />
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
				<circle key={i} cx={x + dx} cy={y + dy} r={5.5 * popAt(frame, from + i * ((to - from) / 12))} fill="#F6A6A0" stroke="#C0505A" strokeWidth={1.2} />
			))}
		</g>
	);
};

export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELLULES = at('cancer', 'cellules');
	const MULTIPLIENT = at('cancer', 'multiplient');
	const TUMEUR = at('cancer', 'tumeur');
	const RARE = at('cancer', 'rare');
	const FREQUENT = at('cancer', 'fréquent');
	const FEMMES = at('cancer', 'femmes');
	const CINQUANTE = at('cancer', 'cinquante');
	const toCancer = lin(frame, TUMEUR - 10, TUMEUR + 6);
	const artO = fadeIn(frame, 0, 8) * (1 - lin(frame, RARE - 8, RARE));
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELLULES - 8} text={"Le *cancer* de l'anus"} size={96} y={150} center />
			<Big from={CELLULES - 2} to={TUMEUR - 8} text={'Des *cellules* en trop'} size={92} y={150} center />
			<Big from={TUMEUR - 2} to={RARE - 6} text={'Une *tumeur*'} size={110} y={150} center />
			<Big from={RARE - 2} text={'Rare… mais en *hausse*'} size={92} y={150} center />
			{artO > 0.01 ? (
				<AbsoluteFill style={{opacity: artO}}>
					<ArtCard top={380} h={760} />
					<Art which="healthy" cx={540} cy={760} s={3.5} o={1 - toCancer}>
						<PulseRing x={TUMOR_H[0]} y={TUMOR_H[1]} r={22} from={CELLULES} to={MULTIPLIENT + 8} sw={1.5} />
						<Dividing x={TUMOR_H[0]} y={TUMOR_H[1]} from={MULTIPLIENT - 4} to={TUMEUR - 6} />
					</Art>
					<Art which="cancer" cx={540} cy={760} s={3.5} o={toCancer}>
						<PulseRing x={TUMOR[0]} y={TUMOR[1]} r={40} from={TUMEUR + 2} sw={1.8} />
					</Art>
					<Note at={CELLULES + 4} y={1250} size={44} tone={LPI.paper}>
						dans la paroi du canal anal
					</Note>
				</AbsoluteFill>
			) : null}
			{frame >= RARE - 4 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, RARE - 4, 6)}}>
					{frame >= FREQUENT - 4 ? (
						<div style={{position: 'absolute', left: 540 - 300, top: 380, width: 600, transform: `scale(${popAt(frame, FREQUENT - 4)})`}}>
							<svg width={600} height={300} viewBox="0 0 600 300">
								{[60, 90, 130, 175, 230].map((h, i) => (
									<rect key={i} x={40 + i * 110} y={260 - h * lin(frame, FREQUENT - 4 + i * 3, FREQUENT + 8 + i * 3)} width={80} height={h * lin(frame, FREQUENT - 4 + i * 3, FREQUENT + 8 + i * 3)} rx={10} fill={i === 4 ? LPI.pink : LPI.sky} stroke={N} strokeWidth={5} />
								))}
								<path d="M40 270 L580 270" stroke={N} strokeWidth={5} strokeLinecap="round" />
							</svg>
						</div>
					) : null}
					<div style={{position: 'absolute', left: 120, top: 820, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, FEMMES - 4)})`, opacity: frame >= FEMMES - 4 ? 1 : 0}}>
						<svg width={260} height={260} viewBox="0 0 100 100">
							<circle cx={50} cy={30} r={16} fill={LPI.pink} stroke={N} strokeWidth={5} />
							<path d="M24 92 L36 54 L64 54 L76 92 Z" fill={LPI.pink} stroke={N} strokeWidth={5} strokeLinejoin="round" />
						</svg>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 10}}>surtout les femmes</div>
					</div>
					<div style={{position: 'absolute', left: 600, top: 820, textAlign: 'center', width: 360, transform: `scale(${popAt(frame, CINQUANTE - 4)})`, opacity: frame >= CINQUANTE - 4 ? 1 : 0}}>
						<AgeIcon size={260} label="50+" />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, marginTop: 10}}>après 50 ans</div>
					</div>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={MULTIPLIENT} volume={0.06} />
			<Sfx name="impact" at={TUMEUR} volume={0.1} />
			<Sfx name="pop" at={FREQUENT - 4} volume={0.07} />
			<Sfx name="pop" at={FEMMES - 4} volume={0.07} />
			<Sfx name="pop" at={CINQUANTE - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PAPILLOMAVIRUS ═══════════════════════════════ */
const CELLS: [number, number][] = [];
for (let row = 0; row < 3; row++) for (let col = 0; col < 6; col++) CELLS.push([170 + col * 150 + (row % 2) * 40, 1090 + row * 120]);
const FLOCK: [number, number][] = [[300, 640], [760, 600], [420, 780], [660, 800], [220, 860], [860, 820], [540, 540], [520, 900]];

export const Papillomavirus: React.FC = () => {
	const frame = useCurrentFrame();
	const VIRUS = at('hpv', 'virus');
	const TRANSMET = at('hpv', 'transmet');
	const FREQUENT = at('hpv', 'fréquent');
	const ELIMINE = at('hpv', "l'élimine");
	const PARFOIS = at('hpv', 'parfois');
	const RESTE = at('hpv', 'reste');
	const ANNEES = at('hpv', 'années');
	const ABIME = at('hpv', 'abîme');
	const flock = lin(frame, FREQUENT - 6, FREQUENT + 10);
	const gone = lin(frame, ELIMINE - 4, ELIMINE + 16);
	const enter = lin(frame, RESTE - 4, RESTE + 16);
	const sick = lin(frame, ABIME - 6, ABIME + 30);
	const years = Math.min(10, Math.max(0, Math.floor(interpolate(frame, [ANNEES - 6, ABIME], [1, 10], clamp))));
	const mainX = interpolate(enter, [0, 1], [540, CELLS[8][0]]);
	const mainY = interpolate(enter, [0, 1], [720, CELLS[8][1]]);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={TRANSMET - 6} text={'Un *virus*'} size={120} y={150} center />
			<Big from={TRANSMET - 2} to={PARFOIS - 6} text={'Le *papillomavirus*'} size={96} y={150} center />
			<Big from={PARFOIS - 2} text={'Parfois, il *reste*'} size={104} y={150} center />
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				{CELLS.map(([x, y], i) => (
					<g key={i} opacity={fadeIn(frame, 4 + i, 8)}>
						<WallCell x={x} y={y} r={58} sick={sick * (Math.abs(i - 8) <= 2 || Math.abs(i - 14) <= 1 ? 1 : 0)} />
					</g>
				))}
				{FLOCK.map(([x, y], i) => (
					<Hpv key={i} x={540 + (x - 540) * flock} y={720 + (y - 720) * flock} s={0.9} o={flock * (1 - gone)} spin={i * 40} />
				))}
				{frame >= VIRUS - 6 ? <Hpv x={mainX} y={mainY} s={(1.8 - 0.9 * enter) * popAt(frame, VIRUS - 6)} o={1 - lin(frame, RESTE + 16, RESTE + 26)} /> : null}
			</svg>
			{frame >= VIRUS + 20 ? (
				<div style={{position: 'absolute', left: 540 - 100, top: 360, transform: `scale(${popAt(frame, VIRUS + 20)})`}}>
					<HpvIcon size={200} />
				</div>
			) : null}
			<Note at={TRANSMET} to={FREQUENT - 6} y={1500} size={44} tone={LPI.paper}>
				lors des relations intimes
			</Note>
			<Note at={FREQUENT} to={ELIMINE - 6} y={1500} size={44} tone={LPI.sky}>
				très fréquent
			</Note>
			<Note at={ELIMINE} to={PARFOIS - 6} y={1500} size={44} tone={LPI.paper}>
				le plus souvent, le corps l'élimine
			</Note>
			{frame >= ANNEES - 6 ? (
				<Note at={ANNEES - 6} to={ABIME - 6} y={1500} size={48} tone={LPI.sky}>
					{`${years} an${years > 1 ? 's' : ''}…`}
				</Note>
			) : null}
			<Note at={ABIME} y={1500} size={44} tone={LPI.pink}>
				il abîme les cellules
			</Note>
			<Sfx name="pop" at={VIRUS - 6} volume={0.07} />
			<Sfx name="whoosh" at={FREQUENT - 6} volume={0.05} />
			<Sfx name="pop" at={ELIMINE} volume={0.06} />
			<Sfx name="whoosh" at={RESTE - 4} volume={0.05} />
			<Sfx name="impact" at={ABIME} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const SANG = at('signes', 'sang');
	const SELLES = at('signes', 'selles');
	const DOULEUR = at('signes', 'douleur');
	const DEMANG = at('signes', 'démangeaisons');
	const BOULE = at('signes', 'boule');
	const ECOUL = at('signes', 'écoulement');
	const TARD = at('signes', 'tard');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[SANG, 'Du sang', <BloodPaperIcon key="b" size={125} />, 'sur le papier ou dans les selles', SELLES - 4],
		[DOULEUR, 'Une douleur', <PainIcon key="p" size={110} color={N} />],
		[DEMANG, 'Des démangeaisons', <ItchIcon key="i" size={120} />],
		[BOULE, "Une petite boule près de l'anus", <LumpIcon key="l" size={120} />],
		[ECOUL, 'Un écoulement', <DischargeIcon key="d" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Comme des *hémorroïdes*'} size={70} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={330 + i * 215} h={190} art={140} badge={i + 1} title={title} sub={sub} subAt={subAt} size={46} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Stamp at={TARD - 4} x={560} y={1480} text="DÉCOUVERT PARFOIS TARD" size={56} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="stamp" at={TARD - 4} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const HPV = at('risques', 'papillomavirus');
	const TABAC = at('risques', 'tabac');
	const DEFENSES = at('risques', 'défenses');
	const VIH = at('risques', 'vih');
	const PARTENAIRES = at('risques', 'partenaires');
	const PRESERVATIF = at('risques', 'préservatif');
	const MALADIES = at('risques', 'maladies');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[HPV, 'Le papillomavirus', <HpvIcon key="h" size={125} />],
		[TABAC, 'Le tabac', <CigaretteIcon key="t" size={120} color={N} />],
		[DEFENSES, 'Des défenses affaiblies', <ShieldLowIcon key="s" size={120} />, 'VIH, après une greffe', VIH - 4],
		[PARTENAIRES, 'De nombreux partenaires', <PartnersIcon key="p" size={120} />, 'sans préservatif', PRESERVATIF - 4],
		[MALADIES, "Maladies inflammatoires de l'intestin", <GutInflamIcon key="g" size={120} />],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
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
	const TOUCHER = at('examens', 'toucher');
	const REGARDE = at('examens', 'regarde');
	const TUBE = at('examens', 'tube');
	const ANUSCOPIE = at('examens', "l'anuscopie");
	const BIOPSIE = at('examens', 'biopsie');
	const PRELEVEMENT = at('examens', 'prélèvement');
	const IRM = at('examens', 'irm');
	const ETENDUE = at('examens', 'étendue');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[TOUCHER, 'Le toucher rectal', <GloveFingerIcon key="g" size={120} />],
		[REGARDE, "L'anuscopie", <AnoscopeIcon key="a" size={120} />, 'un petit tube éclairé', TUBE - 4],
		[BIOPSIE, 'Une biopsie', <ForcepsIcon key="f" size={120} />, 'un petit prélèvement', PRELEVEMENT - 4],
		[IRM, 'IRM et scanner', <ScannerIcon key="s" size={125} />, 'son étendue', ETENDUE - 4],
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'Pour le *trouver*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={350 + i * 250} h={225} art={160} badge={i + 1} title={title} sub={sub} subAt={subAt} size={50} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="ding" at={ANUSCOPIE} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const RADIO = at('traitement', 'radiothérapie');
	const CHIMIO = at('traitement', 'chimiothérapie');
	const GUERIT = at('traitement', 'guérit');
	const SPHINCTER = at('traitement', 'sphincter');
	const CHIR = at('traitement', 'chirurgie');
	const PETITES = at('traitement', 'petites');
	const rows: [number, string, React.ReactNode, string?, number?][] = [
		[RADIO, 'La radiothérapie', <RayIcon key="r" size={120} />],
		[CHIMIO, 'Avec une chimiothérapie', <ChemoIcon key="c" size={120} />],
		[SPHINCTER, 'On garde le sphincter', <SphincterKeepIcon key="s" size={125} />],
		[CHIR, 'La chirurgie', <ScalpelIcon key="k" size={120} />, 'petites tumeurs, ou si ça ne suffit pas', PETITES - 4],
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={0} text={'Pour le *soigner*'} size={110} y={150} center />
			{rows.map(([t, title, icon, sub, subAt], i) => (
				<RowCard key={i} at={t - 6} y={340 + i * 250} h={225} art={160} badge={i + 1} title={title} sub={sub} subAt={subAt} size={48} from={i % 2 ? 'left' : 'right'}>
					{icon}
				</RowCard>
			))}
			<Stamp at={GUERIT} x={560} y={1430} text="IL GUÉRIT SOUVENT" size={66} />
			{rows.map(([t], i) => (
				<Sfx key={i} name="pop" at={t - 6} volume={0.08} />
			))}
			<Sfx name="stamp" at={GUERIT} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('fin', 'sang');
	const HEMO = at('fin', 'hémorroïdes');
	const CONSULTE = at('fin', 'consulte');
	const VACCIN = at('fin', 'vaccin');
	const FILLES = at('fin', 'filles');
	const GARCONS = at('fin', 'garçons');
	const PROTEGE = at('fin', 'protège');
	const aO = 1 - lin(frame, VACCIN - 10, VACCIN - 2);
	const strike = lin(frame, HEMO + 4, HEMO + 16);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={VACCIN - 6} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={VACCIN - 2} text={'Le *vaccin*'} size={120} y={170} center />
			{aO > 0 && frame >= SANG - 6 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<div style={{position: 'absolute', left: 540 - 180, top: 400, transform: `scale(${popAt(frame, SANG - 6)})`}}>
						<BloodPaperIcon size={360} />
					</div>
					{frame >= HEMO - 4 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', transform: `scale(${popAt(frame, HEMO - 4)})`}}>
							<span style={{position: 'relative', display: 'inline-block', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N}}>
								toujours des hémorroïdes ?
								<span style={{position: 'absolute', left: 0, top: '52%', height: 10, width: `${100 * strike}%`, background: LPI.pink, borderRadius: 5}} />
							</span>
						</div>
					) : null}
					<Stamp at={CONSULTE} x={560} y={1060} text="ON CONSULTE" size={76} />
				</AbsoluteFill>
			) : null}
			{frame >= VACCIN - 4 ? (
				<>
					<div style={{position: 'absolute', left: 540 - 190, top: 380, transform: `scale(${popAt(frame, VACCIN - 4)})`}}>
						<HpvVaccineIcon size={380} />
					</div>
					{frame >= FILLES - 4 ? (
						<div style={{position: 'absolute', left: 540 - 140, top: 800, transform: `scale(${popAt(frame, FILLES - 4)})`}}>
							<GirlBoyIcon size={280} />
						</div>
					) : null}
					<Note at={FILLES} to={PROTEGE - 4} y={1150} size={48} tone={LPI.paper}>
						{frame >= GARCONS ? 'les filles comme les garçons' : 'les filles…'}
					</Note>
					<Note at={PROTEGE} y={1150} size={52} tone={LPI.sky}>
						il protège de ce cancer
					</Note>
				</>
			) : null}
			<Burst at={PROTEGE + 4} x={540} y={600} r={360} n={12} />
			<Sfx name="pop" at={SANG - 6} volume={0.08} />
			<Sfx name="pop" at={HEMO - 4} volume={0.06} />
			<Sfx name="stamp" at={CONSULTE} volume={0.12} />
			<Sfx name="pop" at={VACCIN - 4} volume={0.08} />
			<Sfx name="pop" at={FILLES - 4} volume={0.07} />
			<Sfx name="ding" at={PROTEGE} volume={0.08} />
		</AbsoluteFill>
	);
};
