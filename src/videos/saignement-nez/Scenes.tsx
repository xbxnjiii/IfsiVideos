// Scènes de « Saignement de nez » (format court). Accroche sans texte : il lit, une goutte de sang tombe sur la page, le
// nez saigne… et il bascule la tête en arrière. Puis l'idée reçue (vue en coupe : le sang file dans la gorge), le bon
// geste (assis, tête en avant, comprimer la partie molle avec un mouchoir ou une compresse 5 – 15 min en respirant par la
// bouche, une mèche si ça saigne encore), après, quand
// consulter, chute. Tout part d'un mot de la voix (`at`).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Flash, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {Phone} from '../../brand/devices';
import {HeadacheIcon, PillIcon, RunIcon} from '../../brand/icons';
import {DayChip} from '../../brand/injury';
import {Burst} from '../../brand/motion3';
import {BlowIcon, BloodDrop, BreathPuffs, HEAD, HeadSide, headPt, OpenBook} from '../../brand/nose';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const cl01 = (v: number) => Math.min(1, Math.max(0, v));

/** Fond : mur bleu clair, dossier du canapé, lampe douce. */
const Room: React.FC = () => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${LPI.sky} 0%, ${LPI.paper} 100%)`}} />
		<div style={{position: 'absolute', left: -80, top: 1180, width: 1240, height: 900, borderRadius: 120, background: alpha(LPI.blue, 0.35), border: `6px solid ${alpha(N, 0.25)}`}} />
		<div style={{position: 'absolute', right: 70, top: 170, width: 200, height: 200, borderRadius: 100, background: `radial-gradient(circle, ${alpha(LPI.paper, 0.95)} 0%, ${alpha(LPI.paper, 0)} 70%)`}} />
	</AbsoluteFill>
);

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Bulle « ? » qui claque. */
const Question: React.FC<{at: number; x: number; y: number}> = ({at: t0, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x - 60, top: y - 60, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 6}deg)`}}>
			<div style={{width: 120, height: 120, borderRadius: 60, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: N}}>?</div>
		</div>
	);
};

/** Grande croix rose qui barre une carte. */
const Cross: React.FC<{at: number; size?: number}> = ({at: t0, size = 150}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = lin(frame, t0, t0 + 6);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, overflow: 'visible'}}>
			{[
				[18, 18, 82, 82],
				[82, 18, 18, 82],
			].map(([a, b, c, d], i) => (
				<line key={i} x1={a} y1={b} x2={a + (c - a) * k} y2={b + (d - b) * k} stroke={LPI.pink} strokeWidth={13} strokeLinecap="round" />
			))}
		</svg>
	);
};

/** Une goutte qui tombe de (x0, y0) à (x1, y1) entre `t0` et `t1` (accélère), puis disparaît. */
const Falling: React.FC<{t0: number; t1: number; x0: number; y0: number; x1: number; y1: number; r?: number}> = ({t0, t1, x0, y0, x1, y1, r = 14}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= t1) return null;
	const k = interpolate(frame, [t0, t1], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<g transform={`translate(${x0 + (x1 - x0) * k} ${y0 + (y1 - y0) * k}) scale(${1 + 0.15 * k} ${1 + 0.35 * k})`}>
				<BloodDrop r={r} />
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE : IL LIT… UNE GOUTTE TOMBE SUR LA PAGE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const GOUTTE = at('intro', 'goutte');
	const TOMBE = at('intro', 'tombe');
	const PAGE = at('intro', 'page.');
	const SAIGNE = at('intro', 'saigne !');
	const BASCULE = at('intro', 'basculer');
	const ARRIERE = at('intro', 'arrière ?');
	const HX = 0;
	const HY = 330;
	// il lit (tête un peu penchée vers le livre), puis bascule la tête en arrière
	const back = lin(frame, BASCULE - 2, BASCULE + 16);
	const tilt = 8 - 38 * back + Math.sin(frame / 18) * 1.2 * (1 - back);
	const bleed = interpolate(frame, [GOUTTE - 6, GOUTTE + 8, SAIGNE, SAIGNE + 16], [0, 0.35, 0.35, 1], clamp);
	const nose = headPt(HEAD.nostril, tilt);
	// le livre (repère 600 × 300, largeur 540) : les gouttes tombent sur la page de gauche
	const BK = {x: 520, y: 1110, w: 540};
	const k = BK.w / 600;
	const spot = (bx: number, by: number) => ({x: BK.x + bx * k, y: BK.y + by * k});
	const s1 = spot(250, 150);
	const s2 = spot(210, 178);
	const spots = [
		...(frame >= TOMBE + 12 ? [{x: 250, y: 150, r: 15 * cl01((frame - TOMBE - 12) / 4)}] : []),
		...(frame >= PAGE + 16 ? [{x: 210, y: 178, r: 12 * cl01((frame - PAGE - 16) / 4)}] : []),
		...(frame >= SAIGNE + 14 ? [{x: 280, y: 190, r: 10 * cl01((frame - SAIGNE - 14) / 4)}] : []),
	];
	// le livre descend quand il bascule la tête
	const bookDrop = 220 * back;
	// petit coup de caméra sur le nez quand ça saigne, qui se relâche quand il bascule
	const zoom = 1 + 0.18 * lin(frame, SAIGNE - 4, SAIGNE + 10) * (1 - back);
	return (
		<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${HX + nose.x}px ${HY + nose.y}px`}}>
			<Room />
			<div style={{position: 'absolute', left: HX, top: HY}}>
				<HeadSide width={1000} tilt={tilt} bleed={bleed} eyes={back > 0.4 ? 'up' : 'down'} mood={frame >= SAIGNE ? 'worried' : 'calm'} shirt={LPI.pink} />
			</div>
			<div style={{position: 'absolute', left: BK.x, top: BK.y + bookDrop, transform: `rotate(${-6 + 10 * back}deg)`}}>
				<OpenBook width={BK.w} spots={spots} />
			</div>
			<Falling t0={TOMBE} t1={TOMBE + 12} x0={HX + nose.x - 6} y0={HY + nose.y + 40} x1={s1.x} y1={s1.y} />
			<Falling t0={PAGE + 4} t1={PAGE + 16} x0={HX + nose.x - 6} y0={HY + nose.y + 40} x1={s2.x} y1={s2.y} r={12} />
			<Falling t0={SAIGNE + 2} t1={SAIGNE + 14} x0={HX + nose.x - 6} y0={HY + nose.y + 40} x1={spot(280, 190).x} y1={spot(280, 190).y} r={11} />
			<Question at={ARRIERE - 2} x={860} y={420} />
			<Sfx name="pop" at={TOMBE + 12} volume={0.06} />
			<Sfx name="pop" at={PAGE + 16} volume={0.05} />
			<Sfx name="pop" at={SAIGNE + 14} volume={0.05} />
			<Sfx name="whoosh" at={BASCULE} volume={0.05} />
			<Sfx name="pop" at={ARRIERE - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ IDÉE REÇUE : LA TÊTE EN ARRIÈRE ═══════════════════════════════ */
export const Idees: React.FC = () => {
	const frame = useCurrentFrame();
	const PAS = at('idees', 'pas !');
	const COULE = at('idees', 'coule');
	const GORGE = at('idees', 'gorge :');
	const AVALES = at('idees', "l'avales,");
	const VOMIR = at('idees', 'vomir.');
	const VOIS = at('idees', 'vois');
	const ENCORE = at('idees', 'encore.');
	const HX = 40;
	const HY = 520;
	const tilt = -30;
	const cut = fadeIn(frame, COULE - 10, 12);
	const throat = lin(frame, COULE, GORGE + 18);
	const gulp = frame >= AVALES && frame < AVALES + 16 ? Math.sin(((frame - AVALES) / 16) * Math.PI) : 0;
	const thr = headPt({x: 500, y: 720}, tilt);
	const eye = headPt({x: 640, y: 430}, tilt);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<div style={{position: 'absolute', left: HX, top: HY + gulp * 6}}>
				<HeadSide width={1000} tilt={tilt} bleed={1} cut={cut} throat={throat} eyes="up" mood={frame >= VOMIR ? 'sick' : 'worried'} shirt={LPI.pink} />
			</div>
			<Big from={0} text={'Surtout *pas* !'} size={116} y={150} center />
			<PointTag at={GORGE - 2} to={VOMIR - 4} x={260} y={460} px={HX + thr.x} py={HY + thr.y} size={46} tone={LPI.paper}>
				dans la gorge
			</PointTag>
			<PointTag at={VOMIR - 2} to={VOIS - 4} x={290} y={460} px={HX + thr.x} py={HY + thr.y + 60} size={46} tone={LPI.sky}>
				envie de vomir
			</PointTag>
			<PointTag at={VOIS - 2} x={300} y={460} px={HX + eye.x} py={HY + eye.y} size={44} tone={LPI.sky}>
				tu ne vois plus le sang
			</PointTag>
			<Flash at={PAS} max={0.3} />
			<Sfx name="stamp" at={PAS} volume={0.12} />
			<Sfx name="buzz" at={AVALES} volume={0.05} dur={12} />
			<Sfx name="pop" at={ENCORE} volume={0.05} />
		</AbsoluteFill>
	);
};

/** Minuteur rond « 5 – 15 min » qui se remplit. */
const Timer: React.FC<{at: number; fill: number}> = ({at: t0, fill}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const r = 92;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'absolute', left: 60, top: 300, width: 240, height: 240, transform: `scale(${popAt(frame, t0)})`}}>
			<svg width={240} height={240} viewBox="0 0 240 240">
				<circle cx={120} cy={120} r={112} fill={LPI.paper} stroke={N} strokeWidth={8} />
				<circle cx={120} cy={120} r={r} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={22} />
				<circle cx={120} cy={120} r={r} fill="none" stroke={LPI.blue} strokeWidth={22} strokeDasharray={`${c * fill} ${c}`} transform="rotate(-90 120 120)" strokeLinecap="round" />
				<text x={120} y={126} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={50} fill={N}>
					5 – 15
				</text>
				<text x={120} y={166} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill={N}>
					min
				</text>
			</svg>
		</div>
	);
};

/* ═══════════════════════════════ LE BON GESTE ═══════════════════════════════ */
export const Methode: React.FC = () => {
	const frame = useCurrentFrame();
	const ASSIEDS = at('methode', 'assieds-toi,');
	const PENCHE = at('methode', 'penche');
	const AVANT = at('methode', 'avant.');
	const COMPRIME = at('methode', 'comprime');
	const BAS = at('methode', 'bas');
	const MOLLE = at('methode', 'molle,');
	const OS = at('methode', "l'os,");
	const MOUCHOIR = at('methode', 'mouchoir');
	const TIENS = at('methode', 'tiens');
	const CINQ = at('methode', 'cinq');
	const RELACHER = at('methode', 'relâcher,');
	const RESPIRANT = at('methode', 'respirant');
	const HX = 0;
	const HY = 540;
	// en arrière → droit (assis) → penché en avant
	const up = lin(frame, ASSIEDS - 6, ASSIEDS + 12);
	const fwd = lin(frame, PENCHE - 2, AVANT + 6);
	const tilt = -30 * (1 - up) + 24 * fwd;
	const bone = fadeIn(frame, BAS, 8);
	// on comprime à travers une compresse (pas les doigts nus) : la main arrive au mot « mouchoir »
	const pinch = lin(frame, MOUCHOIR - 8, MOUCHOIR + 8);
	const breathe = fadeIn(frame, RESPIRANT - 2, 8);
	const bleed = 1 - pinch * 0.7;
	const nose = headPt(HEAD.nostril, tilt);
	const soft = headPt(HEAD.soft, tilt);
	const boneP = headPt(HEAD.bone, tilt);
	const mouth = headPt(HEAD.mouth, tilt);
	// gouttes qui tombent en avant (on voit que ça saigne encore), puis plus rien une fois comprimé
	const drips = [AVANT - 4, AVANT + 12, AVANT + 28].map((t) => <Falling key={t} t0={t} t1={t + 16} x0={HX + nose.x} y0={HY + nose.y + 20} x1={HX + nose.x + 20} y1={1920} r={12} />);
	const titles: [number, number, string][] = [
		[0, PENCHE - 4, 'Assieds-toi'],
		[PENCHE - 4, COMPRIME - 4, 'Tête en *avant*'],
		[COMPRIME - 4, TIENS - 4, 'Comprime la partie *molle*'],
		[TIENS - 4, 1e9, '*5* à *15* *minutes*'],
	];
	return (
		<AbsoluteFill>
			<Bg />
			{drips}
			<div style={{position: 'absolute', left: HX, top: HY}}>
				<HeadSide width={1000} tilt={tilt} bleed={bleed} bone={bone * (1 - pinch * 0.5)} pinch={pinch} pad breathe={breathe} eyes="down" mood={frame >= TIENS ? 'calm' : 'worried'} shirt={LPI.pink} />
			</div>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<g transform={`translate(${HX} ${HY})`}>
					<BreathPuffs tilt={tilt} on={breathe} />
				</g>
			</svg>
			{titles.map(([a, b, t], i) => (
				<Big key={t} from={i === 0 ? a : a + 6} to={b} text={t} size={96} y={150} center />
			))}
			<PointTag at={MOLLE - 2} to={MOUCHOIR - 6} x={880} y={1500} px={HX + soft.x} py={HY + soft.y} size={44} tone={LPI.pink}>
				partie molle
			</PointTag>
			<PointTag at={OS - 2} to={MOUCHOIR - 6} x={900} y={420} px={HX + boneP.x} py={HY + boneP.y} size={44} tone={LPI.paper}>
				l'os
			</PointTag>
			<PointTag at={MOUCHOIR - 2} to={TIENS - 4} x={640} y={1500} px={HX + soft.x + 40} py={HY + soft.y + 30} size={44} tone={LPI.sky}>
				mouchoir ou compresse
			</PointTag>
			<Timer at={CINQ - 2} fill={lin(frame, CINQ, RELACHER + 30)} />
			{frame >= RELACHER - 4 && frame < RESPIRANT - 2 ? (
				<Note at={RELACHER - 4} to={RESPIRANT - 4} y={1560} size={46} tone={LPI.sky}>
					sans relâcher
				</Note>
			) : null}
			<PointTag at={RESPIRANT - 2} x={860} y={1560} px={HX + mouth.x + 40} py={HY + mouth.y} size={44} tone={LPI.sky}>
				par la bouche
			</PointTag>
			<Sfx name="whoosh" at={PENCHE} volume={0.05} />
			<Sfx name="pop" at={MOUCHOIR} volume={0.08} />
			<Sfx name="tick" at={CINQ} volume={0.08} />
			<Sfx name="ding" at={RELACHER + 30} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA MÈCHE ═══════════════════════════════ */
export const Meche: React.FC = () => {
	const frame = useCurrentFrame();
	const MECHE = at('meche', 'mèche');
	const NARINE = at('meche', 'narine :');
	const TAMPON = at('meche', 'tampon');
	const CAILLOT = at('meche', 'caillot.');
	const HX = -140;
	const HY = 300;
	const W = 1500;
	const k = W / 1000;
	const wick = lin(frame, MECHE - 4, NARINE + 6);
	const nostril = {x: HX + HEAD.nostril.x * k, y: HY + HEAD.nostril.y * k};
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<div style={{position: 'absolute', left: HX, top: HY}}>
				<HeadSide width={W} tilt={0} bleed={0.5 * (1 - lin(frame, TAMPON, CAILLOT + 10))} wick={wick} eyes="open" mood="calm" shirt={LPI.pink} />
			</div>
			<Big from={0} to={MECHE - 6} text={'Ça saigne *encore*\u00a0?'} size={96} y={150} center />
			<Big from={MECHE - 2} text={'Une *mèche*'} size={104} y={150} center />
			<PointTag at={TAMPON - 4} x={300} y={1600} px={nostril.x - 6} py={nostril.y - 10} size={44} tone={LPI.sky}>
				un petit tampon
			</PointTag>
			{frame >= CAILLOT - 6 ? (
				<Note at={CAILLOT - 6} y={1720} size={44} tone={LPI.pink}>
					il aide à former un caillot
				</Note>
			) : null}
			<Sfx name="pop" at={MECHE} volume={0.08} />
			<Sfx name="ding" at={CAILLOT + 8} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ APRÈS : QUELQUES HEURES DE CALME ═══════════════════════════════ */
export const Apres: React.FC = () => {
	const MOUCHE = at('apres', 'mouche');
	const EVITE = at('apres', 'évite');
	const CAILLOT = at('apres', 'caillot');
	const TENIR = at('apres', 'tenir.');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'Quelques *heures*'} size={104} y={360} center />
			<RowCard at={MOUCHE - 4} y={680} h={200} art={180} badge={1} title="Pas de mouchage fort" check={EVITE - 4} size={50}>
				<div style={{position: 'relative'}}>
					<BlowIcon size={140} />
					<Cross at={MOUCHE + 6} />
				</div>
			</RowCard>
			<RowCard at={EVITE - 3} y={920} h={200} art={180} badge={2} title="Pas de sport" check={CAILLOT - 4} from="left" size={50}>
				<div style={{position: 'relative'}}>
					<RunIcon size={130} />
					<Cross at={EVITE + 8} />
				</div>
			</RowCard>
			<RowCard at={CAILLOT - 3} y={1160} h={200} art={180} badge={3} title="Le caillot doit tenir" check={TENIR + 6} size={50}>
				<svg width={120} height={120} viewBox="-60 -60 120 120">
					<BloodDrop r={36} />
				</svg>
			</RowCard>
			{[MOUCHE - 4, EVITE - 3, CAILLOT - 3].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={TENIR + 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ QUAND CONSULTER ═══════════════════════════════ */
export const Consulter: React.FC = () => {
	const frame = useCurrentFrame();
	const VINGT = at('consulter', 'vingt');
	const CHOC = at('consulter', 'choc');
	const TRAITEMENT = at('consulter', 'traitement');
	const CONSULTE = at('consulter', 'consulte');
	const APPELLE = at('consulter', 'appelle');
	const QUINZE = at('consulter', 'quinze.');
	const ring = fadeIn(frame, QUINZE, 4);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CONSULTE - 4} text={'Et *si*…'} size={110} y={200} center />
			<Big from={CONSULTE + 2} text={'Consulte *vite* !'} size={104} y={200} center />
			<RowCard at={VINGT - 4} y={430} h={190} art={170} badge="!" title="Encore après 20 min" size={48}>
				<DayChip text="20'" size={130} />
			</RowCard>
			<RowCard at={CHOC - 4} y={640} h={190} art={170} badge="!" title="Un choc sur la tête" from="left" size={48}>
				<HeadacheIcon size={130} />
			</RowCard>
			<RowCard at={TRAITEMENT - 4} y={850} h={190} art={170} badge="!" title="Un traitement" sub="qui fluidifie le sang" subAt={TRAITEMENT + 14} size={48}>
				<PillIcon size={130} />
			</RowCard>
			{frame >= APPELLE - 4 ? (
				<div style={{position: 'absolute', left: 540 - 130, top: 1110, transform: `scale(${popAt(frame, APPELLE - 4)})`}}>
					<Phone digits="15" press={lin(frame, APPELLE, QUINZE)} ring={ring} size={260} />
				</div>
			) : null}
			{[VINGT - 4, CHOC - 4, TRAITEMENT - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="stamp" at={CONSULTE} volume={0.08} />
			<Sfx name="dtmf-1" at={APPELLE + 2} volume={0.15} />
			<Sfx name="dtmf-5" at={APPELLE + 8} volume={0.15} />
			<Sfx name="ring" at={QUINZE + 4} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const TETE = at('fin', 'tête');
	const AVANT = at('fin', 'avant…');
	const PINCE = at('fin', 'comprime !');
	const HX = 0;
	const HY = 560;
	const tilt = 24 * lin(frame, TETE - 4, AVANT + 6);
	const pinch = lin(frame, PINCE - 6, PINCE + 6); // à travers une compresse
	return (
		<AbsoluteFill>
			<Bg />
			<div style={{position: 'absolute', left: HX, top: HY}}>
				<HeadSide width={1000} tilt={tilt} pinch={pinch} pad eyes="down" mood="happy" shirt={LPI.pink} />
			</div>
			<Big from={TETE - 4} to={PINCE - 6} text={'Tête en *avant*…'} size={104} y={200} center />
			<Big from={PINCE - 4} text={'…et on *comprime*\u00a0!'} size={104} y={200} center />
			<Burst at={PINCE} x={HX + headPt(HEAD.soft, 24).x} y={HY + headPt(HEAD.soft, 24).y} r={200} n={12} />
			<Sfx name="whoosh" at={TETE - 4} volume={0.05} />
			<Sfx name="ding" at={PINCE} volume={0.08} />
		</AbsoluteFill>
	);
};
