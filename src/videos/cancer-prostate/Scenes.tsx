// Scènes de « Le cancer de la prostate » (n° 49, voix gratuite d'abord). Accroche sans texte, réaliste : la chambre la
// nuit, il se lève à 1 h, 3 h, 5 h pour aller aux toilettes ; « c'est l'âge… » ; la caméra plonge vers sa prostate.
// Puis la prostate (châtaigne, sous la vessie, autour de l'urètre), l'adénome (sans gravité, serre l'urètre : levers la
// nuit, jet faible), le cancer (cellules qui se multiplient, 1er cancer de l'homme, souvent aucun signe au début), les
// signes tardifs, les examens (toucher rectal, PSA, IRM, biopsie), les risques, les traitements, chute « dès 50 ans ».
// Storyboard : docs/lpi/storyboard-cancer-prostate.md.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {ScanMonitor} from '../../brand/devices';
import {Drop} from '../../brand/hands';
import {MoonIcon, PillIcon, RibbonIcon, ScalpelIcon} from '../../brand/icons';
import {Stetho, Walker} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {AgeIcon, AlarmClock, BonePain, Bedroom, Chestnut, FamilyIcon, GlobeIcon, NIGHT, RayIcon, ROOM, WatchIcon} from '../../brand/prostate';
import {BloodTube} from '../../brand/sampling';
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

/* ═══════════════════════════════ ACCROCHE : IL SE LÈVE LA NUIT ═══════════════════════════════ */
const MAN_W = 330;
const MAN_TOP = ROOM.floor - (590 * MAN_W) / 300;

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const LEVE = at('intro', 'lève');
	const TOIL = at('intro', 'toilettes');
	const TROIS = at('intro', 'trois');
	const ENC1 = at('intro', 'encore');
	const CINQ = at('intro', 'cinq');
	const ENC2 = at('intro', 'encore', 2);
	const ET = at('intro', 'et');
	const DIT = at('intro', 'dit');
	const AGE = at('intro', "l'âge");
	const PEUT = at('intro', 'peut-être');
	const MAIS = at('intro', 'mais');
	const VERIF = at('intro', 'vérifier');
	const PROST = at('intro', 'prostate');

	// trois réveils : il se lève, marche jusqu'à la porte, la porte s'ouvre, il sort
	const cycles = [
		{s: LEVE - 3, door: TOIL - 6, end: TROIS - 2, walk: 30},
		{s: ENC1 - 8, door: ENC1, end: CINQ - 2, walk: 20},
		{s: ENC2 - 8, door: ENC2, end: ET, walk: 18},
	];
	const time = frame < TROIS ? '01:00' : frame < CINQ ? '03:00' : '05:00';
	const clockPop = Math.max(0, 1 - Math.abs(frame - TROIS) / 6) + Math.max(0, 1 - Math.abs(frame - CINQ) / 6);
	let lamp = 0;
	let door = 0;
	let asleep = 1;
	let manX: number | null = null;
	let manO = 1;
	let flip = false;
	let walking = true;
	for (const c of cycles) {
		if (frame >= c.s && frame < c.end) {
			const t = frame - c.s;
			lamp = fadeIn(frame, c.s, 4);
			asleep = 1 - lin(frame, c.s, c.s + 6);
			const w = lin(frame, c.s + 6, c.s + 6 + c.walk);
			manX = interpolate(w, [0, 1], [ROOM.bedX + 230, ROOM.doorX + 40]);
			manO = fadeIn(frame, c.s + 2, 5) * (1 - lin(frame, c.s + 6 + c.walk - 2, c.s + 6 + c.walk + 6));
			door = lin(frame, c.door - 4, c.door + 6);
			if (t < 0) manX = null;
		}
	}
	// retour : il ressort des toilettes et s'arrête au milieu de la chambre (tourné vers la gauche)
	if (frame >= ET) {
		lamp = 1;
		asleep = 0;
		door = 1;
		flip = true;
		const w = lin(frame, ET, DIT + 14);
		manX = interpolate(w, [0, 1], [ROOM.doorX + 20, ROOM.standX - 40]);
		manO = fadeIn(frame, ET, 6);
		walking = w < 1;
	}
	// caméra : plongée vers son bas-ventre
	const belly = {x: (manX ?? 0) + (flip ? 300 - 176 : 176) * (MAN_W / 300), y: MAN_TOP + 322 * (MAN_W / 300)};
	const cz = lin(frame, MAIS - 2, PROST + 8);
	const s = 1 + 1.7 * cz;
	const tx = interpolate(cz, [0, 1], [0, 540 - belly.x * s]);
	const ty = interpolate(cz, [0, 1], [0, 900 - belly.y * s]);
	const lens = popAt(frame, VERIF - 2);
	const head = {x: (manX ?? 0) + (flip ? 300 - 196 : 196) * (MAN_W / 300), y: MAN_TOP + 40};
	return (
		<AbsoluteFill style={{background: '#0A1024', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Bedroom lamp={lamp} door={door} asleep={asleep} time={time} clockPop={clockPop}>
					{manX !== null && manO > 0 ? (
						<foreignObject x={manX} y={MAN_TOP} width={MAN_W} height={MAN_W * 2} opacity={manO} style={{overflow: 'visible'}}>
							<div style={{transform: flip ? 'scaleX(-1)' : undefined, width: MAN_W}}>
								<Walker width={MAN_W} pose="walk" phase={walking ? frame * 0.3 : 0} hair="old" shirt={NIGHT.pyjama} tee skin={NIGHT.skin} />
							</div>
						</foreignObject>
					) : null}
				</Bedroom>
				{/* loupe « rayons X » sur le bas-ventre : la vessie et la prostate */}
				{lens > 0.01 && manX !== null ? (
					<div style={{position: 'absolute', left: belly.x - 120, top: belly.y - 120, width: 240, height: 240, borderRadius: 120, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.sky, 0.8)}`, background: '#FFFFFF', transform: `scale(${lens})`}}>
						<div style={{position: 'absolute', left: 120 - 565 * 0.55, top: 120 - 470 * 0.55, width: 1536, height: 1024, transformOrigin: '0 0', transform: 'scale(0.55)'}}>
							<Img src={staticFile('images/prostate/appareil-propre-anatomie.png')} style={{width: 1536, height: 1024}} />
						</div>
						<div style={{position: 'absolute', left: 120 - 50, top: 120 + (548 - 470) * 0.55 - 40, width: 100, height: 80, borderRadius: 50, border: `5px solid ${LPI.pink}`, opacity: fadeIn(frame, PROST - 2, 6)}} />
					</div>
				) : null}
			</AbsoluteFill>
			{/* « c'est l'âge… » : bulle de pensée */}
			{frame >= DIT + 2 && frame < MAIS + 4 ? (
				<div style={{position: 'absolute', left: head.x - 360, top: head.y - 230, transform: `scale(${popAt(frame, DIT + 2)})`, opacity: 1 - lin(frame, MAIS - 4, MAIS + 4)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>
							C'est l'âge…{frame >= PEUT ? <span style={{color: LPI.pink}}> ?</span> : null}
						</span>
					</Bubble>
				</div>
			) : null}
			{/* le réveil en gros plan (en haut) : l'heure qui avance */}
			{frame < ET + 8 ? (
				<div style={{position: 'absolute', left: 540 - 231, top: 70, width: 462, height: 252, opacity: 1 - lin(frame, ET, ET + 8), transform: `scale(${1 + 0.08 * clockPop})`}}>
					<div style={{transform: 'scale(2.1)', transformOrigin: '0 0'}}>
						<AlarmClock time={time} />
					</div>
				</div>
			) : null}
			<Sfx name="tap" at={TOIL + 6} volume={0.05} dur={20} />
			<Sfx name="tick" at={TROIS} volume={0.08} />
			<Sfx name="tick" at={CINQ} volume={0.08} />
			<Sfx name="sigh" at={AGE - 4} volume={0.3} />
			<Sfx name="whoosh" at={MAIS} volume={0.08} />
			<Sfx name="ding" at={PROST} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SCHÉMA FOURNI : CAMÉRA QUI GLISSE ET ZOOME DEDANS ═══════════════════════════════ */
// Schéma « Appareil génital masculin » fourni par le propriétaire (1536 × 1024), gardé tel quel (couleurs, annotations) :
// on se déplace dedans au mot près et on entoure la structure dont parle la voix.
const IMG = {anat: 'images/prostate/appareil-propre-anatomie.png', focus: 'images/prostate/appareil-propre-focus.png', w: 1536, h: 1024};
/** Repères du schéma (pixels de l'image). */
const DG = {
	all: {x: 572, y: 572, s: 1.24},
	bladder: [560, 315],
	vesL: [395, 455],
	vesR: [745, 455],
	prostate: [570, 548],
	urethra: [565, 760],
	testisL: [440, 860],
	testisR: [700, 860],
	healthy: [1045, 450],
	cancer: [1345, 450],
	tumor: [1401, 470],
	panel: [1197, 455],
	info: [1182, 835],
} as const;
type CamK = {at: number; x: number; y: number; s: number};
const CARD = {left: 40, top: 290, w: 1000, h: 1140};
/** Position de la caméra : chaque clé prend le relais en douceur (18 images). */
const camOf = (frame: number, keys: CamK[], dur = 18) => {
	let c = {x: keys[0].x, y: keys[0].y, s: keys[0].s};
	for (const k of keys.slice(1)) {
		const t = interpolate(frame, [k.at, k.at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
		c = {x: c.x + (k.x - c.x) * t, y: c.y + (k.y - c.y) * t, s: c.s + (k.s - c.s) * t};
	}
	return c;
};
/** Cercle rose qui pulse sur une structure du schéma (repère de l'image), visible de `from` à `to`. */
type Ring = {from: number; to?: number; x: number; y: number; r: number; ry?: number};
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
				{children}
			</div>
		</div>
	);
};

/* ── Les deux dessins de prostate du schéma fourni (calque « focus »), découpés et posés seuls ── */
const REG = {healthy: {x: 905, y: 328, w: 280, h: 236}, cancer: {x: 1203, y: 328, w: 282, h: 236}} as const;
/** Repères dans chaque dessin (pixels de la découpe) : urètre (x), tumeur. */
const ART = {urethra: 140, uTop: 0, uBot: 236, tumor: [198, 142] as const};
/** Un dessin de prostate (saine ou avec cancer) du schéma fourni, à l'échelle uniforme `s` (jamais déformé), centré en
 * (cx, cy) ; `children` : calques SVG dans le repère de la découpe. */
const ProstateArt: React.FC<{which: keyof typeof REG; cx: number; cy: number; s: number; o?: number; children?: React.ReactNode}> = ({which, cx, cy, s, o = 1, children}) => {
	const r = REG[which];
	return (
		<div style={{position: 'absolute', left: cx - (r.w * s) / 2, top: cy - (r.h * s) / 2, width: r.w, height: r.h, transformOrigin: '0 0', transform: `scale(${s})`, opacity: o}}>
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
				<Img src={staticFile(IMG.focus)} style={{position: 'absolute', left: -r.x, top: -r.y, width: IMG.w, height: IMG.h}} />
			</div>
			<svg width={r.w} height={r.h} viewBox={`0 0 ${r.w} ${r.h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				{children}
			</svg>
		</div>
	);
};
/** Carte blanche (même style que le schéma). */
const ArtCard: React.FC<{top?: number; h?: number; o?: number}> = ({top = 290, h = 960, o = 1}) => (
	<div style={{position: 'absolute', left: 40, top, width: 1000, height: h, borderRadius: 48, background: '#FFFFFF', boxShadow: `0 18px 50px ${alpha(N, 0.18)}`, opacity: o}} />
);
/** Cercle rose qui pulse (dans le repère d'un dessin). */
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
/** Gouttes d'urine qui descendent l'urètre (repère d'un dessin) ; `speed` < 1 : le jet ralentit. */
const UrineDrops: React.FC<{speed: number; o?: number}> = ({speed, o = 1}) => {
	const frame = useCurrentFrame();
	return (
		<g opacity={o}>
			{[0, 1, 2, 3, 4].map((i) => {
				const t = (((frame * 0.02 * speed + i / 5) % 1) + 1) % 1;
				return <circle key={i} cx={ART.urethra} cy={ART.uTop + (ART.uBot - ART.uTop) * t} r={4.5} fill="#F8D35A" stroke="#C9A22A" strokeWidth={1.2} />;
			})}
		</g>
	);
};

/* ═══════════════════════════════ LA PROSTATE ═══════════════════════════════ */
export const Prostate: React.FC = () => {
	const frame = useCurrentFrame();
	const PR = at('prostate', 'prostate');
	const GLANDE = at('prostate', 'glande');
	const CHAT = at('prostate', 'châtaigne');
	const SOUS = at('prostate', 'sous');
	const VESSIE = at('prostate', 'vessie');
	const ENTOURE = at('prostate', 'entoure');
	const URETRE = at('prostate', "l'urètre");
	const FABRIQUE = at('prostate', 'fabrique');
	const SPERME = at('prostate', 'sperme');
	const keys: CamK[] = [
		{at: 0, ...DG.all},
		{at: PR, x: 569, y: 545, s: 2.3},
		{at: SOUS - 4, x: 569, y: 430, s: 1.7},
		{at: ENTOURE - 2, x: 569, y: 700, s: 1.6},
		{at: FABRIQUE - 4, ...DG.all},
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={ENTOURE - 6} text={'La *prostate*'} size={110} y={150} center />
			<Big from={ENTOURE} to={FABRIQUE - 6} text={"Autour de *l'urètre*"} size={96} y={150} center />
			<Big from={FABRIQUE} text={'+ une partie du *sperme*'} size={88} y={150} center />
			<Diagram
				o={fadeIn(frame, 0, 8)}
				keys={keys}
				rings={[
					{from: PR + 4, to: SOUS - 4, x: DG.prostate[0], y: DG.prostate[1], r: 125, ry: 92},
					{from: VESSIE - 2, to: ENTOURE - 4, x: DG.bladder[0], y: DG.bladder[1], r: 180, ry: 140},
					{from: URETRE - 4, to: FABRIQUE - 4, x: DG.urethra[0], y: DG.urethra[1], r: 34, ry: 240},
					{from: SPERME - 6, x: DG.vesL[0], y: DG.vesL[1], r: 60, ry: 75},
					{from: SPERME - 6, x: DG.vesR[0], y: DG.vesR[1], r: 60, ry: 75},
					{from: SPERME, x: DG.testisL[0], y: DG.testisL[1], r: 75},
					{from: SPERME, x: DG.testisR[0], y: DG.testisR[1], r: 75},
				]}
			/>
			{frame < CHAT + 2 ? (
				<AbsoluteFill style={{opacity: 1 - lin(frame, CHAT - 6, CHAT)}}>
					<Pill at={GLANDE - 2} x={540} y={1500} tone={LPI.pink}>
						une petite glande
					</Pill>
				</AbsoluteFill>
			) : null}
			{frame >= CHAT - 2 && frame < SOUS + 4 ? (
				<div style={{position: 'absolute', left: 770, top: 1420, transform: `scale(${popAt(frame, CHAT - 2) * (1 - lin(frame, SOUS - 4, SOUS + 4))})`}}>
					<Chestnut size={190} />
				</div>
			) : null}
			{frame >= CHAT ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1470, display: 'flex', justifyContent: 'center', opacity: 1 - lin(frame, SOUS - 4, SOUS + 4)}}>
					<Pill at={CHAT} x={420} y={30} tone={LPI.paper}>
						la taille d'une châtaigne
					</Pill>
				</div>
			) : null}
			<Note at={VESSIE - 2} to={ENTOURE - 6} y={1500} size={46} tone={LPI.sky}>
				juste sous la vessie
			</Note>
			<Note at={URETRE - 2} to={FABRIQUE - 6} y={1500} size={46} tone={LPI.sky}>
				l'urètre : l'urine sort par là
			</Note>
			<Sfx name="whoosh" at={PR} volume={0.06} />
			<Sfx name="pop" at={GLANDE - 2} volume={0.07} />
			<Sfx name="pop" at={CHAT - 2} volume={0.08} />
			<Sfx name="whoosh" at={SOUS - 4} volume={0.05} />
			<Sfx name="whoosh" at={ENTOURE - 2} volume={0.05} />
			<Sfx name="pop" at={SPERME - 6} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ADÉNOME ═══════════════════════════════ */
export const Adenome: React.FC = () => {
	const frame = useCurrentFrame();
	const GROSSIT = at('adenome', 'grossit');
	const ADENOME = at('adenome', "l'adénome");
	const GROSSE = at('adenome', 'grosse');
	const GRAVITE = at('adenome', 'gravité');
	const SERRE = at('adenome', 'serre');
	const ENVIES = at('adenome', 'envies');
	const JET = at('adenome', 'jet');
	const grow = lin(frame, GROSSIT - 2, GROSSIT + 30);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={ADENOME - 6} text={'Avec *l\'âge*…'} size={110} y={150} center />
			<Big from={ADENOME} text={"*L'adénome*"} size={110} y={150} center />
			<ArtCard />
			<ProstateArt which="healthy" cx={540} cy={760} s={2.7 * (1 + 0.24 * grow)}>
				<UrineDrops speed={1 - 0.7 * lin(frame, SERRE - 2, SERRE + 20)} />
				{frame >= SERRE - 2
					? [-1, 1].map((sg) => {
							const k = fadeIn(frame, SERRE - 2, 6);
							const w = Math.sin(frame / 4) * 2;
							return <path key={sg} d={`M${ART.urethra + sg * (40 + w)} 150 l${sg * 16} -12 l0 24 Z`} fill={N} opacity={k} />;
						})
					: null}
				<PulseRing x={ART.urethra} y={150} r={22} from={SERRE + 2} sw={2} />
			</ProstateArt>
			{/* taille normale (pointillés) : la prostate a grossi d'un bloc */}
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: fadeIn(frame, GROSSIT + 8, 8)}}>
				<path d="M240 560 Q240 520 300 520 L780 520 Q840 520 840 560 Q850 760 700 900 Q620 975 540 990 Q460 975 380 900 Q230 760 240 560 Z" fill="none" stroke={N} strokeWidth={6} strokeDasharray="18 12" opacity={0.8} />
			</svg>
			<Note at={GROSSIT + 8} to={GROSSE - 6} y={1300} size={42} tone={LPI.paper}>
				pointillés : la taille normale
			</Note>
			{frame < SERRE + 4 ? (
				<AbsoluteFill style={{opacity: 1 - lin(frame, SERRE - 6, SERRE + 2)}}>
					<Pill at={GROSSE - 2} x={540} y={1340} tone={LPI.paper}>
						une grosse prostate
					</Pill>
					<Pill at={GRAVITE - 2} x={540} y={1450} tone={LPI.sky}>
						sans gravité ✓
					</Pill>
				</AbsoluteFill>
			) : null}
			{frame >= SERRE - 2 ? (
				<Note at={SERRE - 2} to={ENVIES - 6} y={1400} size={44} tone={LPI.pink}>
					l'urètre est serré
				</Note>
			) : null}
			{frame >= ENVIES - 4 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, ENVIES - 4, 6)}}>
					<Pill at={ENVIES - 4} x={300} y={1420} tone={LPI.paper}>
						<MoonIcon size={56} /> levers la nuit
					</Pill>
					<Pill at={JET - 2} x={790} y={1420} tone={LPI.paper}>
						jet faible
					</Pill>
				</AbsoluteFill>
			) : null}
			<Sfx name="whoosh" at={GROSSIT} volume={0.06} />
			<Sfx name="pop" at={GROSSE - 2} volume={0.07} />
			<Sfx name="ding" at={GRAVITE - 2} volume={0.06} />
			<Sfx name="pop" at={ENVIES - 4} volume={0.07} />
			<Sfx name="pop" at={JET - 2} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELL = at('cancer', 'cellules');
	const MULTI = at('cancer', 'multiplient');
	const CONTROLE = at('cancer', 'contrôle');
	const CEST = at('cancer', "c'est");
	const FREQ = at('cancer', 'fréquent');
	const CINQ = at('cancer', 'cinquante');
	const PIEGE = at('cancer', 'piège');
	const DEBUT = at('cancer', 'début');
	const AUCUN = at('cancer', 'aucun');
	// le schéma : zoom sur la prostate → saine / cancer → la tumeur → l'encadré ; il revient pour « le piège »
	const diagO = fadeIn(frame, 0, 8) * (1 - lin(frame, CEST - 8, CEST)) + fadeIn(frame, PIEGE - 4, 8);
	const numO = fadeIn(frame, CEST, 6) * (1 - lin(frame, PIEGE - 8, PIEGE));
	const keys: CamK[] = [
		{at: 0, x: 569, y: 545, s: 2.3},
		{at: CELL - 8, x: DG.panel[0], y: 442, s: 1.65},
		{at: MULTI, x: DG.cancer[0] + 20, y: DG.cancer[1] + 30, s: 2.6},
		{at: PIEGE - 6, x: DG.cancer[0] + 20, y: DG.cancer[1] + 30, s: 2.4},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CELL - 10} text={'Le *cancer*'} size={110} y={150} center />
			<Big from={CELL - 6} to={MULTI - 6} text={'Saine… ou *cancer* ?'} size={96} y={150} center />
			<Big from={MULTI} to={CEST - 8} text={'Une *tumeur*'} size={110} y={150} center />
			{diagO > 0.01 ? (
				<Diagram
					o={Math.min(1, diagO)}
					focus={fadeIn(frame, CELL - 6, 14)}
					keys={keys}
					rings={[
						{from: 6, to: CELL - 10, x: DG.prostate[0], y: DG.prostate[1], r: 125, ry: 92},
						{from: CELL - 2, to: MULTI - 4, x: DG.healthy[0], y: DG.healthy[1] + 10, r: 140, ry: 120},
						{from: MULTI + 6, to: CEST - 10, x: DG.tumor[0], y: DG.tumor[1], r: 52},
						{from: PIEGE + 4, x: DG.tumor[0], y: DG.tumor[1], r: 52},
					]}
				/>
			) : null}
			<Note at={MULTI + 8} to={CEST - 10} y={1490} size={42} tone={LPI.pink}>
				des cellules qui se multiplient sans contrôle
			</Note>
			{numO > 0 ? (
				<AbsoluteFill style={{opacity: numO}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 380, color: LPI.blue, lineHeight: 1, transform: `scale(${popAt(frame, CEST)})`}}>
						1<span style={{fontSize: 160}}>er</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N, opacity: fadeIn(frame, FREQ - 2, 6)}}>
						cancer de l'homme
					</div>
					<div style={{position: 'absolute', left: 440, top: 960, transform: `scale(${popAt(frame, FREQ)})`}}>
						<RibbonIcon size={200} />
					</div>
					<Pill at={CINQ - 2} x={540} y={1300} tone={LPI.paper} size={50}>
						surtout après 50 ans
					</Pill>
				</AbsoluteFill>
			) : null}
			<Big from={PIEGE} text={'Le *piège*'} size={110} y={150} center />
			<Note at={DEBUT + 2} y={1460} size={44} tone={LPI.paper}>
				au début : rien ne se sent
			</Note>
			<Stamp at={AUCUN} x={640} y={1600} text="AUCUN SIGNE" size={62} />
			<Burst at={CEST} x={540} y={560} r={260} n={12} />
			<Sfx name="whoosh" at={CELL - 8} volume={0.06} />
			<Sfx name="whoosh" at={MULTI} volume={0.06} />
			<Sfx name="pop" at={MULTI + 6} volume={0.07} />
			<Sfx name="impact" at={CEST} volume={0.12} />
			<Sfx name="pop" at={CINQ - 2} volume={0.07} />
			<Sfx name="whoosh" at={PIEGE - 2} volume={0.06} />
			<Sfx name="stamp" at={AUCUN} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES (PLUS TARD) ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('signes', 'sang');
	const URINES = at('signes', 'urines');
	const DOUL = at('signes', 'douleurs');
	const OS = at('signes', 'os');
	const ETENDU = at('signes', 'étendu');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'Plus *tard*…'} size={110} y={150} center />
			<RowCard at={SANG - 4} y={380} h={220} art={160} title="Du sang" sub="dans les urines ou le sperme" subAt={URINES} size={56}>
				<Drop size={100} />
			</RowCard>
			<RowCard at={DOUL - 4} y={630} h={220} art={200} title="Des douleurs dans les os" sub="quand il s'est étendu" subAt={ETENDU - 4} size={52} from="left">
				<BonePain size={190} pain={fadeIn(frame, OS, 6)} />
			</RowCard>
			{frame >= ETENDU - 8 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, ETENDU - 8, 8)}}>
					<ArtCard top={900} h={560} />
					<ProstateArt which="cancer" cx={540} cy={1180} s={1.9}>
						<PulseRing x={ART.tumor[0]} y={ART.tumor[1]} r={30} from={ETENDU - 6} sw={2.5} />
						{[[1, -0.7], [1.2, 0.3], [0.6, 1], [-0.4, 1.1], [-1.2, 0.5], [-1, -0.8]].map(([dx, dy], i) => {
							const k = lin(frame, ETENDU - 2 + i * 3, ETENDU + 34 + i * 3);
							if (k <= 0) return null;
							return <circle key={i} cx={ART.tumor[0] + dx * 120 * k} cy={ART.tumor[1] + dy * 100 * k} r={6} fill="#C0304A" stroke="#7A1426" strokeWidth={1.5} opacity={1 - 0.4 * k} />;
						})}
					</ProstateArt>
				</AbsoluteFill>
			) : null}
			<Sfx name="pop" at={SANG - 4} volume={0.08} />
			<Sfx name="pop" at={DOUL - 4} volume={0.08} />
			<Sfx name="whoosh" at={ETENDU - 4} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const TOUCHER = at('examens', 'toucher');
	const PALPE = at('examens', 'palpe');
	const DOIGT = at('examens', 'doigt');
	const PRISE = at('examens', 'prise');
	const DOSAGE = at('examens', 'dosage');
	const PSA = at('examens', 'psa');
	const PROTEINE = at('examens', 'protéine');
	const SUSPECT = at('examens', 'suspect');
	const IRM = at('examens', 'irm');
	const BIOPSIE = at('examens', 'biopsie');
	const PRELEV = at('examens', 'prélèvement');
	const CONFIRME = at('examens', 'confirme');
	const aO = fadeIn(frame, 0, 8) * (1 - lin(frame, PRISE - 8, PRISE));
	const bO = fadeIn(frame, PRISE - 2, 8) * (1 - lin(frame, SUSPECT - 6, SUSPECT + 2));
	const cO = fadeIn(frame, IRM - 4, 8) * (1 - lin(frame, BIOPSIE - 8, BIOPSIE));
	const dO = fadeIn(frame, BIOPSIE - 4, 8);
	return (
		<AbsoluteFill>
			<Bg />
			{/* 1. le toucher rectal */}
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<Big from={TOUCHER - 4} to={PRISE - 10} text={'Le toucher *rectal*'} size={96} y={150} center />
					<ArtCard />
					<ProstateArt which="cancer" cx={540} cy={740} s={2.7}>
						{/* doigt ganté qui vient appuyer sous le lobe (par le rectum, juste derrière la prostate) */}
						<g transform={`translate(${ART.tumor[0] + 4} ${ART.tumor[1] + 58 + 60 * (1 - lin(frame, TOUCHER, PALPE + 6))}) rotate(-20)`} opacity={fadeIn(frame, TOUCHER - 2, 6)}>
							<rect x={-15} y={0} width={30} height={64} rx={15} fill="#8FBCEB" stroke="#3F6E9E" strokeWidth={2.5} />
							<path d="M-8 12 Q0 3 8 12" fill="none" stroke="#3F6E9E" strokeWidth={2} />
							<path d="M-9 44 q9 5 18 0" fill="none" stroke="#3F6E9E" strokeWidth={1.6} opacity={0.6} />
						</g>
						<PulseRing x={ART.tumor[0]} y={ART.tumor[1]} r={32} from={PALPE + 4} sw={2.5} />
					</ProstateArt>
					<Note at={DOIGT - 4} y={1330} size={42} tone={LPI.sky}>
						doigt ganté, par le rectum
					</Note>
					<Note at={PALPE + 4} y={1450} size={44} tone={LPI.pink}>
						il sent une zone dure
					</Note>
				</AbsoluteFill>
			) : null}
			{/* 2. la prise de sang : PSA */}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<Big from={PRISE - 2} to={DOSAGE - 4} text={'Une prise de *sang*'} size={96} y={150} center />
					<Big from={DOSAGE} to={SUSPECT - 6} text={'Le dosage du *PSA*'} size={96} y={150} center />
					<div style={{position: 'absolute', left: 540 - 90, top: 420, transform: `scale(${popAt(frame, PRISE - 2)}) rotate(-8deg)`}}>
						<BloodTube size={180} level={lin(frame, PRISE, DOSAGE + 10)} cap={LPI.blue} />
					</div>
					<Pill at={PSA - 2} x={540} y={1240} tone={LPI.sky} size={60}>
						PSA
					</Pill>
					<Note at={PROTEINE - 2} y={1380} size={44} tone={LPI.paper}>
						une protéine fabriquée par la prostate
					</Note>
				</AbsoluteFill>
			) : null}
			{/* 3. si c'est suspect : l'IRM */}
			<Big from={SUSPECT} to={BIOPSIE - 6} text={"Si c'est *suspect*…"} size={96} y={150} center />
			{cO > 0 ? (
				<div style={{position: 'absolute', left: 540 - 300, top: 470, opacity: cO, transform: `scale(${popAt(frame, IRM - 4)})`}}>
					<ScanMonitor label="IRM" scan={lin(frame, IRM, IRM + 50)} width={600} height={600}>
						<ProstateArt which="cancer" cx={300} cy={290} s={1.9}>
							<PulseRing x={ART.tumor[0]} y={ART.tumor[1]} r={32} from={IRM + 20} sw={3} />
						</ProstateArt>
					</ScanMonitor>
				</div>
			) : null}
			{/* 4. la biopsie */}
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Big from={BIOPSIE} text={'La *biopsie*'} size={110} y={150} center />
					<ArtCard />
					<ProstateArt which="cancer" cx={540} cy={740} s={2.7}>
						{(() => {
							const k = lin(frame, BIOPSIE + 4, PRELEV + 6);
							const sx = ART.tumor[0] + 62;
							const sy = ART.tumor[1] + 62;
							const ex = sx + (ART.tumor[0] + 6 - sx) * k;
							const ey = sy + (ART.tumor[1] + 6 - sy) * k;
							return (
								<g>
									<line x1={sx + 14} y1={sy + 14} x2={ex} y2={ey} stroke="#5E6B78" strokeWidth={3} strokeLinecap="round" />
									<line x1={sx + 14} y1={sy + 14} x2={ex} y2={ey} stroke="#D7DEE6" strokeWidth={1.2} strokeLinecap="round" />
									<rect x={sx + 8} y={sy + 8} width={16} height={30} rx={6} fill="#8FBCEB" stroke="#3F6E9E" strokeWidth={1.6} transform={`rotate(-45 ${sx + 16} ${sy + 23})`} />
								</g>
							);
						})()}
						<PulseRing x={ART.tumor[0]} y={ART.tumor[1]} r={32} from={CONFIRME - 2} sw={2.5} />
					</ProstateArt>
					<Note at={PRELEV - 2} y={1330} size={44} tone={LPI.paper}>
						un petit prélèvement
					</Note>
					<Stamp at={CONFIRME + 2} x={580} y={1470} text="CONFIRMÉ" size={66} />
				</AbsoluteFill>
			) : null}
			<Sfx name="whoosh" at={TOUCHER} volume={0.05} />
			<Sfx name="pop" at={PRISE - 2} volume={0.08} />
			<Sfx name="pop" at={PSA - 2} volume={0.08} />
			<Sfx name="whoosh" at={IRM - 4} volume={0.06} />
			<Sfx name="pop" at={PRELEV - 2} volume={0.06} />
			<Sfx name="stamp" at={CONFIRME + 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const AGE = at('risques', "l'âge");
	const PERE = at('risques', 'père');
	const FRERE = at('risques', 'frère');
	const FAMILLE = at('risques', 'famille');
	const AFRIQUE = at('risques', "d'afrique");
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			<RowCard at={AGE - 6} y={420} h={270} art={180} badge={1} title="Avec l'âge" sub="surtout après 50 ans" subAt={AGE + 10} size={60}>
				<AgeIcon size={160} />
			</RowCard>
			<RowCard at={PERE - 6} y={730} h={270} art={180} badge={2} title="Un père ou un frère touché" subAt={FRERE} size={56} from="left">
				<FamilyIcon size={160} />
			</RowCard>
			<RowCard at={FAMILLE - 6} y={1040} h={270} art={180} badge={3} title="Une famille venue d'Afrique" sub="ou des Antilles" subAt={AFRIQUE + 8} size={56}>
				<GlobeIcon size={160} />
			</RowCard>
			{[AGE - 6, PERE - 6, FAMILLE - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const PETIT = at('traitement', 'petit');
	const SURV = at('traitement', 'surveille');
	const SINON = at('traitement', 'sinon');
	const CHIR = at('traitement', 'chirurgie');
	const RADIO = at('traitement', 'radiothérapie');
	const HORM = at('traitement', 'hormonal');
	const PARFOIS = at('traitement', 'parfois');
	const FUITES = at('traitement', 'fuites');
	const TROUBLES = at('traitement', 'troubles');
	const fade = 1 - lin(frame, PARFOIS - 6, PARFOIS + 4);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={SINON - 6} text={'Petit et *lent* ?'} size={110} y={150} center />
			<Big from={SINON} to={PARFOIS - 6} text={'Sinon…'} size={110} y={150} center />
			<Big from={PARFOIS} text={'Après, *parfois*…'} size={110} y={150} center />
			{fade > 0 ? (
				<AbsoluteFill style={{opacity: fade}}>
					<RowCard at={PETIT + 6} y={360} h={200} art={160} title="On le surveille" sub="sans traiter tout de suite" subAt={SURV + 14} size={50}>
						<WatchIcon size={140} />
					</RowCard>
					<RowCard at={CHIR - 6} y={590} h={200} art={160} title="La chirurgie" sub="on retire la prostate" subAt={CHIR + 12} size={50} from="left">
						<ScalpelIcon size={140} />
					</RowCard>
					<RowCard at={RADIO - 6} y={820} h={200} art={160} title="La radiothérapie" sub="des rayons sur la tumeur" subAt={RADIO + 16} size={50}>
						<RayIcon size={140} />
					</RowCard>
					<RowCard at={HORM - 8} y={1050} h={200} art={160} title="Un traitement hormonal" size={50} from="left">
						<PillIcon size={140} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{frame >= PARFOIS + 4 ? (
				<div style={{position: 'absolute', left: 540 - 70, top: 520, transform: `scale(${popAt(frame, PARFOIS + 4)})`}}>
					<Drop size={140} tone={LPI.sky} />
				</div>
			) : null}
			<Pill at={FUITES - 2} x={540} y={900} tone={LPI.sky} size={54}>
				des fuites urinaires
			</Pill>
			<Pill at={TROUBLES - 2} x={540} y={1040} tone={LPI.pink} size={54}>
				des troubles de l'érection
			</Pill>
			{[PETIT + 6, CHIR - 6, RADIO - 6, HORM - 8, FUITES - 2, TROUBLES - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : DÈS 50 ANS, ON EN PARLE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const CINQ = at('fin', 'cinquante');
	const PARLE = at('fin', 'parle');
	const MEDECIN = at('fin', 'médecin');
	const MEME = at('fin', 'même');
	const BIEN = at('fin', 'bien');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CINQ - 8} text={'Va lui en *parler*'} size={110} y={170} center />
			<Big from={CINQ - 2} to={MEME - 6} text={'Dès *50* *ans*…'} size={130} y={170} center />
			<Big from={MEME} text={'…même quand *tout* *va* *bien* !'} size={92} y={170} center />
			{frame >= CINQ - 4 ? (
				<div style={{position: 'absolute', left: 540 - 150, top: 480, transform: `scale(${popAt(frame, CINQ - 4)})`}}>
					<AgeIcon size={300} />
				</div>
			) : null}
			{frame >= PARLE - 2 ? (
				<div style={{position: 'absolute', left: 540 - 150, top: 840, transform: `scale(${popAt(frame, PARLE - 2)})`}}>
					<Stetho size={300} />
				</div>
			) : null}
			<Pill at={MEDECIN - 2} x={540} y={1250} tone={LPI.paper} size={54}>
				on en parle à son médecin
			</Pill>
			<Burst at={BIEN} x={540} y={700} r={300} n={12} />
			<Sfx name="pop" at={CINQ - 4} volume={0.08} />
			<Sfx name="pop" at={PARLE - 2} volume={0.08} />
			<Sfx name="ding" at={BIEN} volume={0.08} />
		</AbsoluteFill>
	);
};
