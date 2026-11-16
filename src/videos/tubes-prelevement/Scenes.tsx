// « L'ordre des tubes » (n° 61, format inventaire, look 2026) : accroche « fausse hyperkaliémie » (le patient va très
// bien, le labo appelle : potassium à 7 → une erreur dans l'ordre des tubes), pourquoi l'ordre (la micro-goutte
// d'additif emportée par l'aiguille), puis un tube par scène (hémocultures, citrate, sec, héparine, EDTA, fluorure) avec la
// frise de l'ordre qui se remplit en bas, les gestes (retourner, étiqueter, protocole du labo), récap. Bouchons aux
// vraies couleurs (src/brand/tubes.tsx, exception à la palette).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Flash, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, ease} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {Phone} from '../../brand/devices';
import {Bed, Microbe, Sparkles} from '../../brand/hands';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Bin} from '../../brand/precautions';
import {Butterfly} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, HemoFlask, Ion, LabSheet, NeedleUp, OrderRail, Platelet, RedCell, SugarCube, Tube, WhiteCell} from '../../brand/tubes';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const RAIL_Y = 1440;
const PAST = -100;

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<FlatBg tone={tone} light={0.24} />
	</>
);

/** Frise de l'ordre en bas de l'écran : cases passées remplies et cochées, case `cur` qui se remplit à `t`. */
const Rail: React.FC<{cur: number; t: number; out?: number}> = ({cur, t, out}) => (
	<OrderRail y={RAIL_Y} at={0} out={out} cur={cur} fill={[0, 1, 2, 3, 4, 5].map((i) => (i < cur ? PAST : i === cur ? t : 1e9))} check={[0, 1, 2, 3, 4, 5].map((i) => (i < cur ? PAST : (undefined as unknown as number)))} />
);

/** Numéro de la case (pastille rose) + titre. */
const TubeTitle: React.FC<{n: number; at: number; text: string; size?: number; to?: number}> = ({n, at: t0, text, size = 92, to = 1e9}) => {
	const frame = useCurrentFrame();
	if (frame > to + 8) return null;
	return (
		<div style={{opacity: interpolate(frame, [to, to + 7], [1, 0], clamp)}}>
			<div style={{position: 'absolute', left: 54, top: 150, width: 140, height: 140, borderRadius: 70, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: N, transform: `scale(${popAt(frame, Math.max(0, t0 - 4))}) rotate(-6deg)`}}>{n}</div>
			<div style={{position: 'absolute', left: 230, top: 146, width: 820}}>
				<Title at={t0} text={text} size={size} />
			</div>
		</div>
	);
};

/** Carte d'explication dans la colonne de droite (x 470 → 1030). */
const SideCard: React.FC<{at: number; to?: number; y: number; title: React.ReactNode; sub?: React.ReactNode; subAt?: number; icon?: React.ReactNode; h?: number}> = ({at: t0, to = 1e9, y, title, sub, subAt = -1e9, icon, h = 210}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 10) return null;
	const k = interpolate(frame, [t0, t0 + 10], [0, 1], {...clamp});
	const ko = interpolate(frame, [to, to + 9], [0, 1], ease);
	return (
		<div
			style={{
				position: 'absolute',
				left: 470,
				top: y,
				width: 570,
				height: h,
				boxSizing: 'border-box',
				borderRadius: 38,
				background: LPI.paper,
				border: `6px solid ${N}`,
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: '0 26px',
				transform: `translateX(${(1 - k) * 500 + ko * 700}px) scale(${popAt(frame, t0)})`,
				opacity: 1 - ko,
			}}
		>
			{icon ? <div style={{width: 120, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{icon}</div> : null}
			<div style={{flex: 1, minWidth: 0}}>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, lineHeight: 1.04, color: N}}>{title}</div>
				{sub && frame >= subAt ? <div style={{marginTop: 8, fontFamily: FONT.body, fontWeight: 800, fontSize: 33, lineHeight: 1.12, color: alpha(N, 0.8), opacity: fadeIn(frame, Math.max(subAt, t0 + 4), 6)}}>{sub}</div> : null}
			</div>
		</div>
	);
};

/** Le grand tube de la scène, à gauche. */
const HeroTube: React.FC<{at: number; out?: number; cap: string; label?: string; level?: (f: number) => number; serum?: (f: number) => number; mark?: (f: number) => number; additive?: (f: number) => number; gel?: boolean; x?: number; size?: number; y?: number}> = ({at: t0, out, cap, label, level, serum, mark, additive, gel, x = 250, size = 160, y = 900}) => (
	<Fly at={t0} out={out} x={x} y={y} from="left" to="left">
		<Live render={(f) => <Tube size={size} cap={cap} label={label} level={level ? level(f) : 0.74} serum={serum ? serum(f) : 0} mark={mark ? mark(f) : 0} additive={additive ? additive(f) : 0} gel={gel} />} />
	</Fly>
);

const Arrow: React.FC<{at: number; to?: number; x1: number; y1: number; x2: number; y2: number; color?: string}> = ({at: t0, to = 1e9, x1, y1, x2, y2, color = LPI.pink}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	const k = interpolate(frame, [t0, t0 + 10], [0, 1], ease) * interpolate(frame, [to, to + 7], [1, 0], clamp);
	const a = Math.atan2(y2 - y1, x2 - x1);
	const ex = x1 + (x2 - x1) * k;
	const ey = y1 + (y2 - y1) * k;
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<line x1={x1} y1={y1} x2={ex} y2={ey} stroke={N} strokeWidth={16} strokeLinecap="round" />
			<line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={8} strokeLinecap="round" />
			<path d={`M${ex} ${ey} l${Math.cos(a + 2.6) * 38} ${Math.sin(a + 2.6) * 38} l${Math.cos(a - 2.6) * 38 - Math.cos(a + 2.6) * 38} ${Math.sin(a - 2.6) * 38 - Math.sin(a + 2.6) * 38} Z`} fill={color} stroke={N} strokeWidth={5} strokeLinejoin="round" />
		</svg>
	);
};

/** Pastille ✕ rose (résultat faux). */
const Cross: React.FC<{at: number; x: number; y: number; size?: number; to?: number}> = ({at: t0, x, y, size = 110, to = 1e9}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	return (
		<div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, background: LPI.pink, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${popAt(frame, t0)})`, opacity: interpolate(frame, [to, to + 7], [1, 0], clamp), boxShadow: SHADOW}}>
			<svg width={size * 0.5} height={size * 0.5} viewBox="0 0 100 100">
				<path d="M20 20 L80 80 M80 20 L20 80" stroke={N} strokeWidth={18} strokeLinecap="round" />
			</svg>
		</div>
	);
};
const Check: React.FC<{at: number; x: number; y: number; size?: number; to?: number}> = ({at: t0, x, y, size = 100, to = 1e9}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	return (
		<div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, background: LPI.blue, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${popAt(frame, t0)})`, boxShadow: SHADOW}}>
			<svg width={size * 0.55} height={size * 0.55} viewBox="0 0 100 100">
				<path d="M20 54 L42 74 L80 28" fill="none" stroke={LPI.paper} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	);
};

/** Mini-scène « une goutte de X dans le tube Y » : le tube Y (à droite) se teinte, ✕. */
const Contam: React.FC<{at: number; bad: number; to?: number; cap: string; taintColor: string; x?: number; y?: number; label?: string}> = ({at: t0, bad, to = 1e9, cap, taintColor, x = 790, y = 860, label}) => (
	<>
		<Fly at={t0} out={to} x={x} y={y} from="right" to="right">
			<Live render={(f) => <Tube size={130} cap={cap} level={0.7} label={label} taint={interpolate(f, [t0 + 14, t0 + 40], [0, 1], ease)} taintColor={taintColor} />} />
		</Fly>
		<Live
			render={(f) => {
				const k = interpolate(f, [t0 + 4, t0 + 16], [0, 1], ease);
				if (f < t0 + 4 || f > to) return null;
				const px = interpolate(k, [0, 1], [430, x]);
				const py = interpolate(k, [0, 1], [560, y - 230]) - Math.sin(k * Math.PI) * 120;
				return k < 1 ? (
					<svg width={60} height={70} viewBox="0 0 60 70" style={{position: 'absolute', left: px - 30, top: py - 35}}>
						<path d="M30 4 Q52 36 52 46 A22 22 0 0 1 8 46 Q8 36 30 4 Z" fill={taintColor} stroke={N} strokeWidth={5} />
					</svg>
				) : null;
			}}
		/>
		<Cross at={bad} x={x + 90} y={y - 120} to={to} />
	</>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
const HOOK_TUBES = [CAP.citrate, CAP.sec, CAP.edta, CAP.hepar, CAP.fluor];

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const BIEN = at('intro', 'bien…');
	const LABO = at('intro', 'labo');
	const SEPT = at('intro', 'sept');
	const URG = at('intro', 'urgence');
	const NON = at('intro', 'non.');
	const ERR = at('intro', 'erreur…');
	const TUB = at('intro', 'tubes.');
	const away = ERR - 4;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[LABO + 1, SEPT + 1, NON + 1, ERR + 1]} shakes={[SEPT + 2]} strength={0.03}>
				{/* le patient, dans son lit, va très bien */}
				<Fly at={-2} out={away} x={360} y={900} from="bottom" to="left" move={[{at: LABO - 2, x: 300, s: 0.92, dur: 12}]}>
					<div style={{position: 'relative', width: 720, height: 900}}>
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Bed width={660} rail={1} />
						</div>
						<div style={{position: 'absolute', left: 130, top: 0}}>
							<Patient size={460} mood="content" />
						</div>
					</div>
				</Fly>
				<Sparkles at={BIEN} x={370} y={560} r={190} />
				{/* le labo appelle */}
				<Fly at={LABO - 6} out={away} x={830} y={520} from="right" to="right">
					<Live render={(f) => <Phone digits="" ring={interpolate(f, [LABO - 6, LABO, SEPT + 20, SEPT + 30], [0, 1, 1, 0], clamp)} size={250} />} />
				</Fly>
				<Fly at={SEPT - 10} out={away} x={540} y={1330} from="bottom" to="bottom">
					<Live render={(f) => <LabSheet width={760} value="7,0" alarm={fadeIn(f, SEPT, 4)} fake={interpolate(f, [NON + 2, NON + 12], [0, 1], ease)} />} />
				</Fly>
				<Big from={URG - 2} to={NON - 4} text={'Une *urgence* ?'} size={110} y={170} />
				<Stamp at={NON} x={540} y={300} text="NON !" size={90} out={away} />
				{/* une erreur dans l'ordre des tubes */}
				<Big from={ERR} text={'Une *erreur*…\ndans *l\'ordre*\ndes tubes'} size={118} y={190} />
				{HOOK_TUBES.map((c, i) => (
					<Fly key={i} at={TUB - 14 + i * 3} x={540 + (i - 2) * 190} y={1240} from="top" to="bottom">
						<Live
							render={(f) => {
								const hot = i === 2 || i === 3;
								const j = hot && f > TUB + 12 ? Math.sin(f / 1.6) * 5 : 0;
								return (
									<div style={{transform: `translateX(${j}px)`}}>
										<Tube size={118} cap={c} level={0.72} bad={i === 3 ? fadeIn(f, TUB + 16, 6) : 0} taint={i === 3 ? interpolate(f, [TUB + 8, TUB + 26], [0, 0.8], ease) : 0} taintColor={CAP.edta} />
									</div>
								);
							}}
						/>
					</Fly>
				))}
				<Arrow at={TUB + 2} x1={540} y1={940} x2={700} y2={970} />
			</Camera>
			<Flash at={SEPT} max={0.4} />
			<Sfx name="ring" at={LABO - 4} volume={0.5} />
			<Sfx name="impact" at={SEPT} volume={0.5} />
			<Sfx name="buzz" at={SEPT + 4} volume={0.25} />
			<Sfx name="stamp" at={NON} volume={0.5} />
			<Sfx name="whoosh" at={away} volume={0.2} />
			{HOOK_TUBES.map((_, i) => (
				<Sfx key={i} name="pop" at={TUB - 12 + i * 3} volume={0.18} />
			))}
			<Sfx name="buzz" at={TUB + 16} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI UN ORDRE ═══════════════════════════════ */
export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const TUBE = at('pourquoi', 'tube');
	const ADD = at('pourquoi', 'additif.');
	const QUAND = at('pourquoi', 'quand');
	const TRAV = at('pourquoi', 'traverse');
	const EMP = at('pourquoi', 'emporte');
	const MICRO = at('pourquoi', 'micro-goutte');
	const SUIV = at('pourquoi', 'suivant.');
	const SI = at('pourquoi', 'si');
	const FAUX = at('pourquoi', 'faux.');
	const CEST = at('pourquoi', "c'est");
	const ORDRE = at('pourquoi', 'ordre');
	const TOUJ = at('pourquoi', 'toujours');
	// tube violet qui descend sur l'aiguille puis remonte ; tube vert ensuite
	const NX = 540;
	const NY = 1250;
	const tubeY = (f: number, down: number, up: number) => interpolate(f, [down - 12, down, up, up + 12], [-40, NY + 24, NY + 24, -40], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.55)} />
			<Camera punches={[ADD + 1, TRAV + 1, MICRO + 1, FAUX + 1, ORDRE + 1]} strength={0.03}>
				<Big from={0} to={QUAND - 4} text={'Chaque tube :\nun *additif*'} size={112} />
				<Fly at={TUBE - 6} out={QUAND - 4} x={540} y={1010} from="top" to="top">
					<Live render={(f) => <Tube size={160} cap={CAP.edta} additive={fadeIn(f, ADD, 8)} label="EDTA" />} />
				</Fly>
				<PTag at={ADD + 2} to={QUAND - 4} x={820} y={1420} px={560} py={1530}>
					l'additif
				</PTag>
				{/* l'aiguille passe d'un bouchon à l'autre */}
				<Big from={QUAND} to={SI - 4} text={'L\'aiguille\n*traverse* les bouchons'} size={100} />
				{frame >= QUAND - 2 && frame < CEST ? (
					<>
						<div style={{position: 'absolute', left: NX - 40, top: NY - 6, opacity: fadeIn(frame, QUAND - 2, 8)}}>
							<NeedleUp size={80} drop={interpolate(frame, [EMP, EMP + 10, SUIV, SUIV + 6], [0, 1, 1, 0], ease)} />
						</div>
						<Live
							render={(f) => {
								const y = tubeY(f, TRAV, EMP - 4);
								if (f < TRAV - 13 || f > EMP + 9) return null;
								return (
									<div style={{position: 'absolute', left: NX - 75, top: y - 600, transform: 'rotate(180deg)', transformOrigin: '75px 300px'}}>
										<Tube size={150} cap={CAP.edta} level={0} label="EDTA" />
									</div>
								);
							}}
						/>
						<Live
							render={(f) => {
								if (f < SUIV - 14) return null;
								const y = interpolate(f, [SUIV - 12, SUIV], [-40, NY + 24], ease);
								const side = interpolate(f, [SI, SI + 12], [0, 1], ease);
								return (
									<div style={{position: 'absolute', left: NX - 75 + 230 * side, top: y - 600 - 40 * side, transform: 'rotate(180deg)', transformOrigin: '75px 300px'}}>
										<Tube size={150} cap={CAP.hepar} level={0} label="hép." taint={interpolate(f, [SUIV + 2, SUIV + 30], [0, 1], ease)} taintColor={CAP.edta} />
									</div>
								);
							}}
						/>
					</>
				) : null}
				<PTag at={MICRO} to={SUIV + 6} x={260} y={1000} px={NX} py={NY - 8}>
					micro-goutte
				</PTag>
				<Cross at={FAUX - 2} x={NX + 380} y={920} to={CEST - 4} size={150} />
				<Big from={SI} to={CEST - 4} text={'Résultat\n*faux* !'} size={120} />
				{/* d'où un ordre précis */}
				<Big from={CEST} text={'Un *ordre*\n*précis*'} size={130} />
				<OrderRail y={980} at={ORDRE - 4} fill={[0, 1, 2, 3, 4, 5].map((i) => TOUJ + i * 5)} scale={1.05} labels={[0, 1, 2, 3, 4, 5].map((i) => TOUJ + i * 5 + 2)} />
			</Camera>
			<Flash at={FAUX} max={0.3} />
			<Sfx name="pop" at={TUBE - 4} volume={0.2} />
			<Sfx name="ding" at={ADD} volume={0.15} />
			<Sfx name="pop" at={TRAV} volume={0.25} />
			<Sfx name="pop" at={SUIV} volume={0.25} />
			<Sfx name="buzz" at={FAUX - 2} volume={0.25} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={i} name="tick" at={TOUJ + i * 5} volume={0.12} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · HÉMOCULTURES ═══════════════════════════════ */
export const Hemoc: React.FC = () => {
	const frame = useCurrentFrame();
	const HEMO = at('hemoc', 'hémocultures,');
	const MIC = at('hemoc', 'microbes');
	const AVANT = at('hemoc', 'avant');
	const STER = at('hemoc', 'stériles.');
	const AERO = at('hemoc', 'aérobie,');
	const OXY = at('hemoc', "l'oxygène,");
	const ANA = at('hemoc', "l'anaérobie,");
	const VEUL = at('hemoc', 'veulent');
	const big = (f: number, t: number, t2: number) => 1 + 0.1 * interpolate(f, [t, t + 8, t2, t2 + 8], [0, 1, 1, 0], ease);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[HEMO + 1, MIC + 1, STER + 1, AERO + 1, ANA + 1]} strength={0.03}>
				<TubeTitle n={1} at={HEMO - 2} text={'Les\n*hémocultures*'} size={96} />
				<Fly at={HEMO} x={320} y={830} from="left" to="left">
					<Live render={(f) => <div style={{transform: `scale(${big(f, AERO, ANA - 4)})`}}><HemoFlask size={250} label="AÉRO" cap={LPI.blue} o2={fadeIn(f, OXY, 8)} /></div>} />
				</Fly>
				<Fly at={HEMO + 4} x={760} y={830} from="right" to="right">
					<Live render={(f) => <div style={{transform: `scale(${big(f, ANA, 1e9)})`}}><HemoFlask size={250} label="ANAÉRO" cap={N} noO2={fadeIn(f, VEUL, 8)} /></div>} />
				</Fly>
				{[
					[260, 940],
					[380, 1010],
					[700, 960],
					[820, 1020],
				].map(([x, y], i) => (
					<Live
						key={i}
						render={(f) =>
							f >= MIC + i * 3 && f < STER - 4 + 8 ? (
								<div style={{position: 'absolute', left: x - 40, top: y - 40 + 6 * Math.sin(f / 5 + i), transform: `scale(${popAt(f, MIC + i * 3) * interpolate(f, [STER - 4, STER + 4], [1, 0], clamp)})`}}>
									<Microbe size={80} seed={i} tone={LPI.pink} />
								</div>
							) : null
						}
					/>
				))}
				<Note at={MIC + 4} to={AVANT - 4} y={1150} size={50}>
					On cherche des microbes
				</Note>
				<Note at={AVANT} to={AERO - 4} y={1150} size={50} tone={LPI.pink}>
					Avant tout : stérile !
				</Note>
				<Sparkles at={STER} x={320} y={760} r={190} />
				<Sparkles at={STER + 4} x={760} y={760} r={190} />
				<Note at={AERO + 2} to={ANA - 4} y={1150} size={46} x={70}>
					① aime l'oxygène
				</Note>
				<Note at={ANA + 2} y={1150} size={46} x={500}>
					② n'en veut pas
				</Note>
			</Camera>
			<Rail cur={0} t={HEMO} />
			<Sfx name="pop" at={HEMO} volume={0.2} />
			<Sfx name="pop" at={HEMO + 4} volume={0.2} />
			<Sfx name="ding" at={STER} volume={0.18} />
			<Sfx name="pop" at={AERO} volume={0.2} />
			<Sfx name="pop" at={ANA} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · CITRATE ═══════════════════════════════ */
export const Citrate: React.FC = () => {
	const BOUCH = at('citrate', 'bouchon');
	const BLEU = at('citrate', 'bleu');
	const COAG = at('citrate', 'coagulation,');
	const TP = at('citrate', 'tp');
	const REMP = at('citrate', 'remplit');
	const TRAIT = at('citrate', 'trait,');
	const NI = at('citrate', 'ni');
	const MEL = at('citrate', 'mélange');
	const ET = at('citrate', 'et', 2);
	const AIL = at('citrate', 'ailettes,');
	const AIR = at('citrate', "d'air");
	const PURGE = at('citrate', 'purge,');
	const JETTE = at('citrate', 'jette.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<Camera punches={[BLEU + 1, COAG + 1, TRAIT + 1, MEL + 1, AIL + 1, PURGE + 1]} strength={0.03}>
				<TubeTitle n={2} at={BLEU - 2} text={'Bleu clair :\nle *citrate*'} />
				<HeroTube at={BOUCH - 4} cap={CAP.citrate} label="citrate" level={(f) => interpolate(f, [REMP, REMP + 26], [0, 0.72], ease)} mark={(f) => fadeIn(f, TRAIT - 2, 6)} />
				<SideCard at={COAG} to={ET - 6} y={480} title="Coagulation" sub={'TP · TCA : le temps que met le sang à coaguler'} subAt={TP} h={240} />
				<SideCard at={TRAIT} to={ET - 6} y={750} title={"Jusqu'au trait"} sub="ni plus, ni moins" subAt={NI} />
				<SideCard at={MEL} to={ET - 6} y={990} title="9 sang : 1 citrate" sub="un mélange exact" subAt={MEL + 6} />
				{/* aiguille à ailettes : de l'air dans la tubulure → tube de purge */}
				<Fly at={AIL - 6} out={JETTE + 16} x={760} y={600} from="right" to="right">
					<Live
						render={(f) => (
							<div style={{position: 'relative', width: 520, height: 300}}>
								<div style={{position: 'absolute', left: 40, top: 0}}>
									<Butterfly size={300} />
								</div>
								<svg width={520} height={300} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
									<path d="M190 150 Q300 260 420 240 Q500 230 470 330" fill="none" stroke={N} strokeWidth={22} strokeLinecap="round" />
									<path d="M190 150 Q300 260 420 240 Q500 230 470 330" fill="none" stroke="#EEF3F8" strokeWidth={12} strokeLinecap="round" />
									{f >= AIR - 4
										? [0, 1, 2, 3].map((k) => {
												const t = (f / 30 + k / 4) % 1;
												return <circle key={k} cx={220 + t * 240} cy={180 + Math.sin(t * 3) * 60} r={7} fill="#fff" stroke={LPI.blue} strokeWidth={3} opacity={fadeIn(f, AIR - 4, 6)} />;
											})
										: null}
								</svg>
							</div>
						)}
					/>
				</Fly>
				<PTag at={AIR} to={PURGE - 4} x={720} y={330} px={880} py={830}>
					de l'air
				</PTag>
				<Fly at={PURGE - 8} out={JETTE + 6} x={880} y={1080} from="bottom" to="bottom" move={[{at: JETTE, x: 760, y: 1240, rot: 60, s: 0.6, dur: 10}]}>
					<Live render={(f) => <Tube size={90} cap={CAP.citrate} label="purge" level={interpolate(f, [PURGE, PURGE + 20], [0, 0.4], ease)} />} />
				</Fly>
				<Fly at={PURGE - 2} out={JETTE + 22} x={640} y={1180} from="bottom" to="bottom">
					<Live render={(f) => <Bin width={170} open={interpolate(f, [JETTE - 6, JETTE, JETTE + 14, JETTE + 20], [0, 1, 1, 0], ease)} />} />
				</Fly>
				<PTag at={PURGE + 4} to={JETTE + 4} x={560} y={960} px={850} py={1020}>
					tube de purge
				</PTag>
			</Camera>
			<Rail cur={1} t={BLEU} />
			<Sfx name="pop" at={BOUCH - 2} volume={0.2} />
			<Sfx name="pop" at={COAG} volume={0.15} />
			<Sfx name="tick" at={TRAIT} volume={0.2} />
			<Sfx name="pop" at={MEL} volume={0.15} />
			<Sfx name="whoosh" at={AIL - 6} volume={0.15} />
			<Sfx name="pop" at={PURGE - 6} volume={0.2} />
			<Sfx name="whoosh" at={JETTE} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · TUBE SEC ═══════════════════════════════ */
export const Sec: React.FC = () => {
	const SEC = at('sec', 'sec,');
	const ROUGE = at('sec', 'rouge,');
	const JAUNE = at('sec', 'jaune');
	const GEL = at('sec', 'gel.');
	const AIDE = at('sec', 'aide');
	const CAIL = at('sec', 'caillot.');
	const SER = at('sec', 'sérum,');
	const LIQ = at('sec', 'liquide');
	const BIO = at('sec', 'biochimie');
	const SIL = at('sec', "s'il");
	const BLEU = at('sec', 'bleu,');
	const FAUS = at('sec', 'fausserait');
	const sep = (f: number) => interpolate(f, [AIDE, CAIL + 14], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[SEC + 1, JAUNE + 1, CAIL + 1, SER + 1, BIO + 1, FAUS + 1]} strength={0.03}>
				<TubeTitle n={3} at={SEC - 2} text={'Le tube *sec*'} />
				<HeroTube at={ROUGE - 4} cap={CAP.sec} label="sec" x={170} size={130} serum={sep} />
				<HeroTube at={JAUNE - 2} cap={CAP.gel} label="gel" x={360} size={130} serum={sep} gel />
				<PTag at={GEL} to={AIDE - 4} x={640} y={560} px={400} py={1050}>
					gel
				</PTag>
				<SideCard at={AIDE} to={SIL - 6} y={480} title="Il fait un caillot" sub="il aide le sang à coaguler" subAt={AIDE + 6} />
				<SideCard at={SER} to={SIL - 6} y={720} title="Le sérum" sub="le liquide au-dessus" subAt={LIQ} />
				<PTag at={SER + 2} to={SIL - 6} x={300} y={430} px={170} py={780}>
					sérum
				</PTag>
				<SideCard at={BIO} to={SIL - 6} y={960} title="Biochimie" sub="et sérologies" subAt={BIO + 10} />
				{/* s'il passait avant le bleu : son activateur fausserait la coagulation */}
				<Contam at={SIL} bad={FAUS} cap={CAP.citrate} taintColor={CAP.sec} label="citrate" />
				<Note at={BLEU} y={1130} size={46} x={500}>
					coagulation faussée
				</Note>
			</Camera>
			<Rail cur={2} t={SEC} />
			<Sfx name="pop" at={ROUGE - 2} volume={0.2} />
			<Sfx name="pop" at={JAUNE} volume={0.2} />
			<Sfx name="pop" at={AIDE} volume={0.15} />
			<Sfx name="pop" at={SER} volume={0.15} />
			<Sfx name="pop" at={BIO} volume={0.15} />
			<Sfx name="whoosh" at={SIL} volume={0.15} />
			<Sfx name="buzz" at={FAUS} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · HÉPARINE ═══════════════════════════════ */
export const Hepar: React.FC = () => {
	const VERT = at('hepar', 'vert');
	const HEP = at('hepar', "l'héparine.");
	const EMP = at('hepar', 'empêche');
	const IONO = at('hepar', "l'ionogramme,");
	const K = at('hepar', 'potassium');
	const NA = at('hepar', 'sodium,');
	const CREA = at('hepar', 'créatinine,');
	const REINS = at('hepar', 'reins.');
	const UNE = at('hepar', 'une');
	const FAUS = at('hepar', 'fausserait');
	const APRES = at('hepar', 'après.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<Camera punches={[VERT + 1, HEP + 1, IONO + 1, CREA + 1, FAUS + 1]} strength={0.03}>
				<TubeTitle n={4} at={VERT - 2} text={'Vert :\n*l\'héparine*'} />
				<HeroTube at={VERT - 4} cap={CAP.hepar} label="hépar." />
				<SideCard at={EMP} to={UNE - 6} y={480} title="Anti-caillot" sub="le sang reste liquide" subAt={EMP + 10} />
				<SideCard
					at={IONO}
					to={UNE - 6}
					y={720}
					title="Ionogramme"
					sub={
						<div style={{display: 'flex', gap: 14, marginTop: 4}}>
							<Live render={(f) => (f >= K ? <div style={{transform: `scale(${popAt(f, K)})`}}><Ion label="K⁺" size={78} tone={LPI.pink} /></div> : null)} />
							<Live render={(f) => (f >= NA ? <div style={{transform: `scale(${popAt(f, NA)})`}}><Ion label="Na⁺" size={78} /></div> : null)} />
						</div>
					}
					subAt={K}
					h={230}
				/>
				<SideCard at={CREA} to={UNE - 6} y={990} title="Créatinine" sub="pour les reins" subAt={REINS} icon={<KidneysIcon size={110} />} />
				<Contam at={UNE} bad={FAUS} cap={CAP.citrate} taintColor={CAP.hepar} label="citrate" />
				<Note at={FAUS + 4} y={1130} size={46} x={500}>
					coagulation faussée
				</Note>
			</Camera>
			<Rail cur={3} t={VERT} />
			<Live
				render={(f) =>
					f >= APRES - 2 ? (
						<div style={{position: 'absolute', left: 0, top: 0}}>
							<Arrow at={APRES - 2} x1={300} y1={RAIL_Y - 150} x2={540} y2={RAIL_Y - 150} />
						</div>
					) : null
				}
			/>
			<Sfx name="pop" at={VERT - 2} volume={0.2} />
			<Sfx name="pop" at={EMP} volume={0.15} />
			<Sfx name="pop" at={K} volume={0.15} />
			<Sfx name="pop" at={NA} volume={0.15} />
			<Sfx name="pop" at={CREA} volume={0.15} />
			<Sfx name="whoosh" at={UNE} volume={0.15} />
			<Sfx name="buzz" at={FAUS} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · EDTA ═══════════════════════════════ */
export const Edta: React.FC = () => {
	const VIOL = at('edta', 'violet');
	const GARDE = at('edta', 'garde');
	const NUM = at('edta', 'numération');
	const NFS = at('edta', 'nfs.');
	const MAIS = at('edta', 'mais');
	const K = at('edta', 'potassium,');
	const CAPT = at('edta', 'capture');
	const CA = at('edta', 'calcium.');
	const UNE = at('edta', 'une');
	const MONTE = at('edta', 'monte,');
	const CHUTE = at('edta', 'chute.');
	const VOILA = at('edta', 'voilà');
	const PAT = at('edta', 'patient');
	const out = VOILA - 4;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[VIOL + 1, GARDE + 1, NFS + 1, K + 1, CA + 1, MONTE + 1, CHUTE + 1, VOILA + 1]} shakes={[VOILA + 2]} strength={0.03}>
				<TubeTitle n={5} at={VIOL - 2} to={out} text={'Violet :\n*l\'EDTA*'} />
				<HeroTube at={VIOL - 4} out={out} cap={CAP.edta} label="EDTA" />
				{/* les cellules restent intactes → NFS */}
				<SideCard
					at={GARDE}
					to={MAIS - 6}
					y={480}
					title="Cellules intactes"
					sub={
						<div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 6}}>
							<RedCell size={84} />
							<WhiteCell size={84} />
							<Platelet size={62} />
						</div>
					}
					subAt={GARDE + 8}
					h={250}
				/>
				<SideCard at={NUM} to={MAIS - 6} y={760} title="La NFS" sub="numération formule sanguine" subAt={NFS} />
				{/* mais : du potassium, et il capture le calcium */}
				<Live
					render={(f) => {
						if (f < K || f > out + 8) return null;
						const o = interpolate(f, [out, out + 7], [1, 0], clamp);
						const grab = interpolate(f, [CA, CA + 12], [0, 1], ease);
						return (
							<div style={{opacity: o}}>
								<div style={{position: 'absolute', left: 560, top: 520, transform: `scale(${popAt(f, K)})`}}>
									<Ion label="K⁺" size={120} tone={LPI.pink} />
								</div>
								<div style={{position: 'absolute', left: 560 + 200 * (1 - grab) + 170, top: 540 + 60 * grab, transform: `scale(${(f >= CAPT ? popAt(f, CAPT) : 0) * (1 - 0.3 * grab)})`}}>
									<Ion label="Ca²⁺" size={120} />
								</div>
							</div>
						);
					}}
				/>
				<Note at={K + 4} to={UNE - 6} y={700} size={42} x={500}>
					du potassium dedans
				</Note>
				<Note at={CA + 4} to={UNE - 6} y={810} size={42} x={500}>
					et il capture le calcium
				</Note>
				{/* une micro-goutte dans le tube vert */}
				<Contam at={UNE} to={out} bad={1e9} cap={CAP.hepar} taintColor={CAP.edta} label="hépar." x={800} y={1080} />
				<Live
					render={(f) => {
						if (f < MONTE - 4 || f > out + 8) return null;
						const o = interpolate(f, [out, out + 7], [1, 0], clamp);
						return (
							<div style={{opacity: o}}>
								<div style={{position: 'absolute', left: 500, top: 960, display: 'flex', alignItems: 'center', gap: 8, transform: `scale(${popAt(f, MONTE - 4)})`}}>
									<Ion label="K⁺" size={96} tone={LPI.pink} />
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: N, transform: `translateY(${-10 * Math.sin(f / 3)}px)`}}>↑</div>
								</div>
								{f >= CHUTE - 6 ? (
									<div style={{position: 'absolute', left: 500, top: 1110, display: 'flex', alignItems: 'center', gap: 8, transform: `scale(${popAt(f, CHUTE - 6)})`}}>
										<Ion label="Ca²⁺" size={96} />
										<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: N, transform: `translateY(${10 * Math.sin(f / 3)}px)`}}>↓</div>
									</div>
								) : null}
							</div>
						);
					}}
				/>
				{/* voilà l'erreur de notre patient */}
				<Fly at={VOILA} x={540} y={860} from="bottom" to="bottom">
					<Live render={(f) => <LabSheet width={760} value="7,0" alarm={1} fake={interpolate(f, [PAT, PAT + 10], [0, 1], ease)} />} />
				</Fly>
				<Stamp at={PAT + 4} x={540} y={1150} text="FAUSSE ALERTE" size={64} />
				<Big from={VOILA} text={'*L\'erreur*\ndu patient !'} size={110} y={170} />
			</Camera>
			<Rail cur={4} t={VIOL} />
			<Flash at={VOILA} max={0.3} />
			<Sfx name="pop" at={VIOL - 2} volume={0.2} />
			<Sfx name="pop" at={GARDE} volume={0.15} />
			<Sfx name="pop" at={NUM} volume={0.15} />
			<Sfx name="pop" at={K} volume={0.2} />
			<Sfx name="pop" at={CAPT} volume={0.2} />
			<Sfx name="whoosh" at={UNE} volume={0.15} />
			<Sfx name="ding" at={MONTE - 4} volume={0.15} />
			<Sfx name="impact" at={VOILA} volume={0.4} />
			<Sfx name="stamp" at={PAT + 4} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · FLUORURE ═══════════════════════════════ */
export const Fluor: React.FC = () => {
	const GRIS = at('fluor', 'gris,');
	const FLUO = at('fluor', 'fluorure.');
	const EMP = at('fluor', 'empêche');
	const GLOB = at('fluor', 'globules');
	const SUCRE = at('fluor', 'sucre');
	const GLY = at('fluor', 'glycémie');
	const LAC = at('fluor', 'lactates.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<Camera punches={[GRIS + 1, GLOB + 1, SUCRE + 1, GLY + 1]} strength={0.03}>
				<TubeTitle n={6} at={GRIS - 2} text={'Gris :\nle *fluorure*'} />
				<HeroTube at={GRIS - 4} cap={CAP.fluor} label="fluor." />
				<SideCard
					at={EMP}
					y={480}
					h={400}
					title="Pas de grignotage !"
					sub={
						<Live
							render={(f) => {
								const stop = f >= SUCRE + 8;
								const chomp = stop ? 0 : 0.5 + 0.5 * Math.sin(f / 2);
								return (
									<div style={{position: 'relative', height: 220, marginTop: 6}}>
										<div style={{position: 'absolute', left: 10, top: 30}}>
											<RedCell size={150} mouth={chomp} />
										</div>
										{[0, 1, 2].map((k) => (
											<div key={k} style={{position: 'absolute', left: 190 + k * 80, top: 80 + (k % 2) * 40}}>
												<SugarCube size={70} />
											</div>
										))}
										{stop ? (
											<div style={{position: 'absolute', left: 60, top: 0, transform: `scale(${popAt(f, SUCRE + 8)})`}}>
												<svg width={230} height={230} viewBox="0 0 100 100">
													<circle cx={50} cy={50} r={44} fill="none" stroke={LPI.pink} strokeWidth={9} />
													<line x1={20} y1={80} x2={80} y2={20} stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
												</svg>
											</div>
										) : null}
									</div>
								);
							}}
						/>
					}
					subAt={GLOB}
				/>
				<SideCard at={GLY} y={920} title="Glycémie" sub="et lactates" subAt={LAC} />
				<PTag at={FLUO + 2} to={EMP - 4} x={740} y={640} px={300} py={1200}>
					fluorure
				</PTag>
			</Camera>
			<Rail cur={5} t={GRIS} />
			<Sfx name="pop" at={GRIS - 2} volume={0.2} />
			<Sfx name="pop" at={EMP} volume={0.15} />
			<Sfx name="buzz" at={SUCRE + 8} volume={0.2} />
			<Sfx name="pop" at={GLY} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES GESTES ═══════════════════════════════ */
export const Gestes: React.FC = () => {
	const RET = at('gestes', 'retourne-le');
	const SANS = at('gestes', 'sans');
	const ADD = at('gestes', "l'additif");
	const GLOB = at('gestes', 'globules');
	const ETIQ = at('gestes', 'étiquette');
	const PAT = at('gestes', 'patient.');
	const ATT = at('gestes', 'attention');
	const COUL = at('gestes', 'couleurs');
	const SUIS = at('gestes', 'suis');
	const PROTO = at('gestes', 'protocole');
	const LABO = at('gestes', 'labo.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[RET + 1, SANS + 1, GLOB + 1, ETIQ + 1, COUL + 1, PROTO + 1]} strength={0.03}>
				<Big from={0} to={ETIQ - 4} text={'On le *retourne*\n*doucement*'} size={104} />
				<Fly at={2} out={ETIQ - 4} x={300} y={980} from="left" to="left">
					<Live
						render={(f) => {
							const t = interpolate(f, [RET, RET + 90], [0, 3], clamp);
							const rot = 180 * (1 - Math.cos(t * Math.PI)) / 2;
							return (
								<div style={{transform: `rotate(${rot}deg)`}}>
									<Tube size={140} cap={CAP.edta} label="EDTA" level={0.72} additive={interpolate(f, [ADD, ADD + 10, ADD + 50], [0, 1, 0], clamp)} />
								</div>
							);
						}}
					/>
				</Fly>
				{/* sans secouer */}
				<Fly at={SANS - 4} out={ETIQ - 4} x={790} y={720} from="right" to="right">
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f * 1.4) * 22}deg)`}}><Tube size={80} cap={CAP.edta} level={0.72} /></div>} />
				</Fly>
				<Cross at={SANS + 2} x={900} y={560} to={ETIQ - 4} size={100} />
				<Note at={SANS} to={GLOB - 4} y={1000} size={44} x={560}>
					sans secouer !
				</Note>
				{/* les globules ne cassent pas */}
				<Live
					render={(f) =>
						f >= GLOB && f < ETIQ + 4 ? (
							<div style={{position: 'absolute', left: 560, top: 960, display: 'flex', gap: 40, opacity: interpolate(f, [ETIQ - 4, ETIQ + 3], [1, 0], clamp), transform: `scale(${popAt(f, GLOB)})`}}>
								<RedCell size={150} />
								<RedCell size={150} broken={1} />
							</div>
						) : null
					}
				/>
				<Check at={GLOB + 4} x={630} y={960} size={80} to={ETIQ - 4} />
				<Cross at={GLOB + 8} x={820} y={960} size={80} to={ETIQ - 4} />
				{/* étiqueter devant le patient */}
				<Big from={ETIQ} to={ATT - 4} text={'*Étiqueter*\ndevant le patient'} size={104} />
				<Fly at={ETIQ - 2} out={ATT - 4} x={330} y={1000} from="left" to="left">
					<Live
						render={(f) => {
							const k = interpolate(f, [ETIQ + 4, ETIQ + 14], [0, 1], ease);
							return (
								<div style={{position: 'relative'}}>
									<Tube size={140} cap={CAP.edta} level={0.72} />
									<div style={{position: 'absolute', left: 6 - 200 * (1 - k), top: 220 - 140 * (1 - k), width: 128, height: 210, background: '#fff', border: `4px solid ${N}`, borderRadius: 8, transform: `rotate(${-30 * (1 - k)}deg)`, opacity: Math.min(1, k * 3), padding: 10, boxSizing: 'border-box', fontFamily: FONT.body, fontWeight: 900, fontSize: 19, color: N, lineHeight: 1.2}}>
										NOM
										<br />
										Prénom
										<br />
										né le
										<br />
										<div style={{marginTop: 8, height: 40, background: `repeating-linear-gradient(90deg, ${N} 0 3px, #fff 3px 6px, ${N} 6px 8px, #fff 8px 12px)`}} />
									</div>
								</div>
							);
						}}
					/>
				</Fly>
				<Fly at={PAT - 6} out={ATT - 4} x={790} y={980} from="right" to="right">
					<Patient size={360} mood="content" />
				</Fly>
				{/* les couleurs changent selon les marques : protocole du labo */}
				<Big from={ATT} text={'Les couleurs\n*changent* parfois'} size={104} />
				{['#8E5CC0', '#B56CC9', '#6E4BA6'].map((c, i) => (
					<Fly key={c} at={COUL - 6 + i * 3} out={SUIS - 4} x={290 + i * 250} y={960} from="bottom" to="bottom">
						<Tube size={120} cap={c} label="EDTA" level={0.72} />
					</Fly>
				))}
				<Note at={COUL + 6} to={SUIS - 4} y={1220} size={48}>
					selon la marque des tubes
				</Note>
				<Fly at={PROTO - 4} x={540} y={1000} from="bottom" to="bottom">
					<div style={{width: 640, boxSizing: 'border-box', borderRadius: 34, background: '#fff', border: `6px solid ${N}`, boxShadow: SHADOW, padding: '28px 34px'}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>Protocole du labo</div>
						{[0, 1, 2, 3].map((k) => (
							<div key={k} style={{marginTop: 18, height: 22, width: `${92 - k * 12}%`, borderRadius: 11, background: alpha(LPI.sky, 0.9)}} />
						))}
					</div>
				</Fly>
				<Check at={LABO} x={820} y={860} size={110} />
			</Camera>
			<Sfx name="whoosh" at={RET} volume={0.12} />
			<Sfx name="buzz" at={SANS + 2} volume={0.18} />
			<Sfx name="pop" at={GLOB} volume={0.15} />
			<Sfx name="pop" at={ETIQ + 10} volume={0.2} />
			<Sfx name="pop" at={COUL - 6} volume={0.15} />
			<Sfx name="ding" at={LABO} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const REC = at('fin', 'récapitule');
	const W = [at('fin', 'hémocultures,'), at('fin', 'bleu,'), at('fin', 'rouge'), at('fin', 'vert,'), at('fin', 'violet,'), at('fin', 'gris.')];
	const RESP = at('fin', 'respecte');
	const ORD = at('fin', "l'ordre…");
	const LABO = at('fin', 'labo');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[REC + 1, ...W.map((w) => w + 1), RESP + 1]} strength={0.025}>
				<Big from={0} to={RESP - 4} text={'On *récapitule*'} size={120} />
				<Big from={RESP} text={'Respecte\n*l\'ordre* !'} size={124} />
				<OrderRail y={820} at={REC - 6} fill={W} labels={W.map((w) => w + 2)} check={W.map((_, i) => RESP + i * 4)} scale={1.05} />
				<Fly at={LABO - 6} x={540} y={1260} from="bottom" to="bottom">
					<LabSheet width={720} value="4,2" />
				</Fly>
				<Check at={LABO + 10} x={900} y={1080} size={110} />
			</Camera>
			<Confetti at={ORD} />
			{W.map((w, i) => (
				<Sfx key={i} name="pop" at={w} volume={0.2} />
			))}
			<Sfx name="ding" at={RESP} volume={0.25} />
			<Sfx name="ding" at={LABO + 10} volume={0.2} />
		</AbsoluteFill>
	);
};

