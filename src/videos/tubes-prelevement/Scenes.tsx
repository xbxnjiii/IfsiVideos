// « L'ordre des tubes » (n° 61, format inventaire, look 2026) : accroche « fausse hyperkaliémie » (le patient va très
// bien, le labo appelle : potassium à 7 → une erreur dans l'ordre des tubes), pourquoi l'ordre (la micro-goutte
// d'additif emportée par l'aiguille), puis un tube par scène (hémocultures, citrate, sec, héparine, EDTA, fluorure) avec la
// frise de l'ordre qui se remplit en bas, les gestes (retourner, étiqueter, protocole du labo), récap. Bouchons aux
// vraies couleurs (src/brand/tubes.tsx, exception à la palette).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Flash, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, ease} from '../../brand/bold';
import {Sparkles} from '../../brand/hands';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Bin} from '../../brand/precautions';
import {Butterfly, VacuNeedle} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, HEMO_CAP, HemoFlask, Ion, LabSheet, NeedleUp, OrderRail, Tube} from '../../brand/tubes';
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

/** Frise de l'ordre en bas de l'écran : cases avant `from` remplies et cochées ; `fills` = {case: image} pour la scène. */
const Rail: React.FC<{from: number; fills: Record<number, number>; cur: (f: number) => number; first?: 'hemoc' | 'purge' | 'both'}> = ({from, fills, cur, first}) => {
	const frame = useCurrentFrame();
	const idx = [0, 1, 2, 3, 4, 5, 6];
	return <OrderRail y={RAIL_Y} at={0} cur={cur(frame)} first={first} fill={idx.map((i) => (i < from ? PAST : fills[i] ?? 1e9))} check={idx.map((i) => (i < from ? PAST : (undefined as unknown as number)))} />;
};

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

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Les 7 « cases » de l'ordre, mélangées sur le portoir dès l'image 0 (violet juste avant jaune : l'erreur de l'accroche).
const SHUFFLE = [6, 5, 2, 0, 1, 4, 3];
const SHUFFLE2 = [3, 0, 4, 6, 5, 1, 2];
const slotX = (slot: number) => 560 + (slot - 3) * 138;
const RACK_Y = 960;

const RackItem: React.FC<{k: number; taint?: number; bad?: number}> = ({k, taint = 0, bad = 0}) =>
	k === 0 ? (
		<div style={{position: 'relative', width: 150, height: 380}}>
			<div style={{position: 'absolute', left: 0, bottom: 0}}>
				<HemoFlask size={84} label="" cap={HEMO_CAP.aero} />
			</div>
			<div style={{position: 'absolute', left: 70, bottom: 0}}>
				<HemoFlask size={84} label="" cap={HEMO_CAP.anaero} />
			</div>
		</div>
	) : (
		<Tube size={95} cap={CAP[(['', 'citrate', 'gel', 'sec', 'hepar', 'edta', 'fluor'] as const)[k] as keyof typeof CAP]} gel={k === 2} level={0.72} taint={taint} taintColor={CAP.edta} bad={bad} />
	);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SEPT = at('intro', 'sept');
	const REMP = at('intro', 'remplis');
	const ORDRE = at('intro', 'ordre');
	const SI = at('intro', 'si');
	const TROMP = at('intro', 'trompes,');
	const PAT = at('intro', 'patient,');
	const K = at('intro', 'potassium');
	const K7 = at('intro', 'sept', 2);
	const ALORS = at('intro', 'alors,');
	const BON = at('intro', 'ordre', 2);
	const POURQ = at('intro', 'pourquoi');
	const away = ALORS - 2;
	// position (case) de chaque élément k au fil du temps : mélange → re-mélange → mélange → bon ordre
	const slotOf = (k: number, f: number) => {
		const a = SHUFFLE.indexOf(k);
		const b = SHUFFLE2.indexOf(k);
		const m = interpolate(f, [REMP, REMP + 9, REMP + 16, REMP + 25], [0, 1, 1, 0], ease);
		const sorted = interpolate(f, [ALORS + 4, BON + 6], [0, 1], ease);
		return (a + (b - a) * m) * (1 - sorted) + k * sorted;
	};
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[SEPT + 1, ORDRE + 1, TROMP + 1, K7 + 1, BON + 1]} shakes={[K7 + 2]} strength={0.03}>
				<Big from={ORDRE - 4} to={SI - 4} text={'Dans quel\n*ordre* ?'} size={130} />
				<Big from={BON - 2} text={'Le bon *ordre*…\net *pourquoi* ?'} size={110} />
				{/* les tubes sur le portoir */}
				{[0, 1, 2, 3, 4, 5, 6].map((k) => (
					<Live
						key={k}
						render={(f) => {
							const hop = f >= SEPT - 4 + k * 3 && f < SEPT + 8 + k * 3 ? -40 * Math.sin(((f - SEPT + 4 - k * 3) / 12) * Math.PI) : 0;
							const hot = (k === 5 || k === 2) && f >= TROMP && f < away;
							const lift = hot ? -30 * Math.min(1, (f - TROMP) / 6) : 0;
							const shake = hot && f > TROMP + 8 ? Math.sin(f / 1.6) * 4 : 0;
							const x = slotX(slotOf(k, f));
							const swapLift = -60 * Math.sin(Math.PI * interpolate(f, [REMP, REMP + 9], [0, 1], clamp)) * (k % 2 ? 1 : -0.4);
							return (
								<div style={{position: 'absolute', left: x, top: RACK_Y + hop + lift + swapLift, transform: `translate(-50%, -50%) translateX(${shake}px)`}}>
									<RackItem k={k} taint={k === 2 ? interpolate(f, [TROMP + 6, TROMP + 26, away, away + 8], [0, 0.8, 0.8, 0], clamp) : 0} bad={k === 2 ? interpolate(f, [TROMP + 18, TROMP + 24, away, away + 6], [0, 1, 1, 0], clamp) : 0} />
								</div>
							);
						}}
					/>
				))}
				{/* le portoir */}
				<div style={{position: 'absolute', left: 50, top: RACK_Y + 70, width: 980, height: 70, borderRadius: 18, background: '#E6EBF1', border: `6px solid ${N}`, boxShadow: SHADOW}} />
				<div style={{position: 'absolute', left: 80, top: RACK_Y + 140, width: 30, height: 70, background: '#C9D2DC', border: `5px solid ${N}`, borderTop: 'none'}} />
				<div style={{position: 'absolute', left: 970, top: RACK_Y + 140, width: 30, height: 70, background: '#C9D2DC', border: `5px solid ${N}`, borderTop: 'none'}} />
				{/* numéros du bon ordre */}
				{[0, 1, 2, 3, 4, 5, 6].map((k) =>
					frame >= BON + 4 + k * 3 ? (
						<div key={k} style={{position: 'absolute', left: slotX(k) - 34, top: RACK_Y + 225, width: 68, height: 68, borderRadius: 34, background: LPI.pink, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, transform: `scale(${popAt(frame, BON + 4 + k * 3)})`}}>
							{k + 1}
						</div>
					) : null,
				)}
				{/* le temps de répondre : 3 · 2 · 1 */}
				{[0, 1, 2].map((i) => {
					const t0 = ORDRE + 14 + i * 26;
					if (frame < t0 || frame >= t0 + 26 || frame >= SI - 2) return null;
					return (
						<div key={i} style={{position: 'absolute', left: 540 - 90, top: 1300, width: 180, height: 180, borderRadius: 90, background: LPI.paper, border: `8px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 110, color: N, transform: `scale(${popAt(frame, t0)})`}}>
							{3 - i}
						</div>
					);
				})}
				{/* si tu te trompes : le violet avant le jaune */}
				<Arrow at={TROMP + 2} to={away} x1={slotX(1) - 20} y1={RACK_Y - 270} x2={slotX(2) + 10} y2={RACK_Y - 250} />
				<Fly at={PAT - 4} out={away} x={250} y={1450} from="left" to="left">
					<Patient size={300} mood="content" />
				</Fly>
				<Fly at={K - 6} out={away} x={700} y={1430} from="right" to="right">
					<Live render={(f) => <LabSheet width={560} value="7,0" alarm={fadeIn(f, K7, 4)} />} />
				</Fly>
			</Camera>
			<Flash at={K7} max={0.4} />
			{[0, 1, 2, 3, 4, 5, 6].map((k) => (
				<Sfx key={k} name="pop" at={SEPT - 4 + k * 3} volume={0.12} />
			))}
			<Sfx name="whoosh" at={REMP} volume={0.2} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="tick" at={ORDRE + 14 + i * 26} volume={0.3} />
			))}
			<Sfx name="buzz" at={TROMP + 18} volume={0.2} />
			<Sfx name="impact" at={K7} volume={0.5} />
			<Sfx name="whoosh" at={ALORS + 4} volume={0.2} />
			{[0, 1, 2, 3, 4, 5, 6].map((k) => (
				<Sfx key={k} name="pop" at={BON + 4 + k * 3} volume={0.12} />
			))}
			<Sfx name="ding" at={POURQ} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI UN ORDRE ═══════════════════════════════ */
export const Pourquoi: React.FC = () => {
	const TUBE = at('pourquoi', 'tube');
	const ADD = at('pourquoi', 'additif.');
	const QUAND = at('pourquoi', 'quand');
	const TRAV = at('pourquoi', 'traverse');
	const EMP = at('pourquoi', 'emporte');
	const MICRO = at('pourquoi', 'micro-goutte');
	const SUIV = at('pourquoi', 'suivant.');
	const VIOL = at('pourquoi', 'violet,');
	const K = at('pourquoi', 'potassium.');
	const AVANT = at('pourquoi', 'avant');
	const JAUNE = at('pourquoi', 'jaune,');
	const MONTE = at('pourquoi', 'monte…');
	const SEUL = at('pourquoi', 'seulement');
	const VOILA = at('pourquoi', 'voilà');
	const PAT = at('pourquoi', 'sept');
	const CEST = at('pourquoi', "c'est");
	const ORDRE = at('pourquoi', 'ordre');
	const TOUJ = at('pourquoi', 'toujours');
	const NX = 600;
	const NY = 1250;
	const away = VOILA - 4;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.55)} />
			<Camera punches={[ADD + 1, TRAV + 1, MICRO + 1, K + 1, MONTE + 1, VOILA + 1, ORDRE + 1]} shakes={[VOILA + 2]} strength={0.03}>
				<Big from={0} to={QUAND - 4} text={'Chaque tube :\nun *additif*'} size={112} />
				<Fly at={TUBE - 6} out={QUAND - 4} x={540} y={1010} from="top" to="top">
					<Live render={(f) => <Tube size={160} cap={CAP.edta} additive={fadeIn(f, ADD, 8)} label="EDTA" />} />
				</Fly>
				<PTag at={ADD + 2} to={QUAND - 4} x={830} y={1120} px={555} py={1300}>
					l'additif
				</PTag>
				<Big from={QUAND} to={VIOL - 4} text={'L\'aiguille\n*traverse* les bouchons'} size={100} />
				<Big from={VIOL} to={AVANT - 4} text={'Le *violet* :\ndu *potassium*'} size={104} />
				<Big from={AVANT} to={away} text={'*Avant* le jaune ?'} size={104} />
				<Live
					render={(f) => {
						if (f < QUAND - 2 || f > away + 8) return null;
						const o = interpolate(f, [away, away + 7], [1, 0], clamp) * fadeIn(f, QUAND - 2, 8);
						return (
							<div style={{position: 'absolute', left: NX - 40, top: NY - 6, opacity: o}}>
								<NeedleUp size={80} drop={interpolate(f, [EMP, EMP + 10, SUIV, SUIV + 6], [0, 1, 1, 0], ease)} />
							</div>
						);
					}}
				/>
				{/* le tube violet descend sur l'aiguille, remonte puis se range à gauche */}
				<Live
					render={(f) => {
						if (f < TRAV - 13 || f > away + 8) return null;
						const down = interpolate(f, [TRAV - 12, TRAV, EMP - 4, EMP + 8], [-40, NY + 24, NY + 24, 760], ease);
						const park = interpolate(f, [EMP + 4, EMP + 18], [0, 1], ease);
						const x = NX + (200 - NX) * park;
						const y = down + (930 - down) * park * (f > EMP + 8 ? 1 : 0);
						const rot = 180 * (1 - park);
						const o = interpolate(f, [away, away + 7], [1, 0], clamp);
						return (
							<div style={{position: 'absolute', left: x - 75, top: y - 600 + 300 * park, transform: `rotate(${rot}deg) scale(${1 - 0.25 * park})`, transformOrigin: '75px 300px', opacity: o}}>
								<Tube size={150} cap={CAP.edta} level={0.7 * park} label="EDTA" />
							</div>
						);
					}}
				/>
				{/* le tube jaune arrive : la micro-goutte violette tombe dedans */}
				<Live
					render={(f) => {
						if (f < SUIV - 14 || f > away + 8) return null;
						const y = interpolate(f, [SUIV - 12, SUIV], [-40, NY + 24], ease);
						const o = interpolate(f, [away, away + 7], [1, 0], clamp);
						return (
							<div style={{position: 'absolute', left: NX - 75, top: y - 600, transform: 'rotate(180deg)', transformOrigin: '75px 300px', opacity: o}}>
								<Tube size={150} cap={CAP.gel} level={0} gel label="gel" taint={interpolate(f, [SUIV + 2, SUIV + 30], [0, 1], ease)} taintColor={CAP.edta} />
							</div>
						);
					}}
				/>
				<PTag at={MICRO} to={SUIV + 6} x={300} y={1000} px={NX} py={NY - 8}>
					micro-goutte
				</PTag>
				<Live
					render={(f) =>
						f >= K && f < away + 8 ? (
							<div style={{position: 'absolute', left: 130, top: 470, opacity: interpolate(f, [away, away + 7], [1, 0], clamp), transform: `scale(${popAt(f, K)})`}}>
								<Ion label="K⁺" size={120} tone={LPI.pink} />
							</div>
						) : null
					}
				/>
				<Arrow at={JAUNE} to={away} x1={300} y1={860} x2={470} y2={880} />
				<Live
					render={(f) =>
						f >= MONTE - 6 && f < away + 8 ? (
							<div style={{position: 'absolute', left: 760, top: 760, display: 'flex', alignItems: 'center', gap: 8, opacity: interpolate(f, [away, away + 7], [1, 0], clamp), transform: `scale(${popAt(f, MONTE - 6)})`}}>
								<Ion label="K⁺" size={110} tone={LPI.pink} />
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 100, color: N, transform: `translateY(${-10 * Math.sin(f / 3)}px)`}}>↑</div>
							</div>
						) : null
					}
				/>
				<Note at={SEUL} to={away} y={1520} size={46}>
					dans le tube… pas chez le patient !
				</Note>
				{/* voilà l'erreur */}
				<Big from={VOILA} to={CEST - 4} text={'Un *faux*\npotassium !'} size={110} />
				<Fly at={VOILA} out={CEST - 4} x={540} y={900} from="bottom" to="bottom">
					<Live render={(f) => <LabSheet width={760} value="7,0" alarm={1} fake={interpolate(f, [PAT, PAT + 10], [0, 1], ease)} />} />
				</Fly>
				<Stamp at={PAT + 4} x={540} y={1190} text="FAUSSE ALERTE" size={64} out={CEST - 4} />
				<Big from={CEST} text={'Un *ordre*\n*précis*'} size={130} />
				<OrderRail y={980} at={ORDRE - 4} fill={[0, 1, 2, 3, 4, 5, 6].map((i) => TOUJ + i * 5)} labels={[0, 1, 2, 3, 4, 5, 6].map((i) => TOUJ + i * 5 + 2)} />
			</Camera>
			<Flash at={VOILA} max={0.3} />
			<Sfx name="pop" at={TUBE - 4} volume={0.2} />
			<Sfx name="ding" at={ADD} volume={0.15} />
			<Sfx name="pop" at={TRAV} volume={0.25} />
			<Sfx name="pop" at={SUIV} volume={0.25} />
			<Sfx name="pop" at={K} volume={0.2} />
			<Sfx name="buzz" at={MONTE - 4} volume={0.2} />
			<Sfx name="impact" at={VOILA} volume={0.4} />
			<Sfx name="stamp" at={PAT + 4} volume={0.45} />
			{[0, 1, 2, 3, 4, 5, 6].map((i) => (
				<Sfx key={i} name="tick" at={TOUJ + i * 5} volume={0.12} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · HÉMOCULTURES ═══════════════════════════════ */
export const Hemoc: React.FC = () => {
	const PREM = at('hemoc', 'premier,');
	const HEMO = at('hemoc', 'hémocultures.');
	const STER = at('hemoc', 'stériles.');
	const AERO = at('hemoc', 'aérobie,');
	const VERT = at('hemoc', 'vert,');
	const ANA = at('hemoc', 'anaérobie,');
	const ORANGE = at('hemoc', 'orange.');
	const big = (f: number, t: number, t2: number) => 1 + 0.12 * interpolate(f, [t, t + 8, t2, t2 + 8], [0, 1, 1, 0], ease);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[HEMO + 1, STER + 1, AERO + 1, ANA + 1]} strength={0.03}>
				<Big from={PREM - 2} to={HEMO - 4} text={'En *premier*…'} size={120} />
				<TubeTitle n={1} at={HEMO - 2} text={'Les\n*hémocultures*'} size={96} />
				<Fly at={HEMO} x={320} y={830} from="left" to="left">
					<Live render={(f) => <div style={{transform: `scale(${big(f, AERO, ANA - 4)})`}}><HemoFlask size={250} label="AÉRO" cap={HEMO_CAP.aero} /></div>} />
				</Fly>
				<Fly at={HEMO + 4} x={760} y={830} from="right" to="right">
					<Live render={(f) => <div style={{transform: `scale(${big(f, ANA, 1e9)})`}}><HemoFlask size={250} label="ANAÉRO" cap={HEMO_CAP.anaero} /></div>} />
				</Fly>
				<Note at={STER - 4} to={AERO - 4} y={1150} size={50} tone={LPI.pink}>
					Avant tout : stériles !
				</Note>
				<Sparkles at={STER} x={320} y={760} r={190} />
				<Sparkles at={STER + 4} x={760} y={760} r={190} />
				<Note at={AERO + 2} y={1150} size={44} x={90}>
					① aérobie
				</Note>
				<Note at={ANA + 2} y={1150} size={44} x={560}>
					② anaérobie
				</Note>
				<PTag at={VERT} x={150} y={470} px={320} py={600} size={38}>
					vert
				</PTag>
				<PTag at={ORANGE} x={930} y={470} px={760} py={600} size={38}>
					orange
				</PTag>
			</Camera>
			<Rail from={0} fills={{0: HEMO}} cur={() => 0} first="hemoc" />
			<Sfx name="pop" at={HEMO} volume={0.2} />
			<Sfx name="pop" at={HEMO + 4} volume={0.2} />
			<Sfx name="ding" at={STER} volume={0.18} />
			<Sfx name="pop" at={AERO} volume={0.2} />
			<Sfx name="pop" at={ANA} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ OU : LE TUBE DE PURGE ═══════════════════════════════ */
export const Purge: React.FC = () => {
	const AIL = at('purge', 'ailettes');
	const AIR = at('purge', "d'air");
	const COMM = at('purge', 'commence');
	const PURGE = at('purge', 'purge,');
	const BLANC = at('purge', 'blanc,');
	const JETTE = at('purge', 'jette.');
	const AVEC = at('purge', 'avec');
	const SIMPLE = at('purge', 'simple,');
	const BLEU = at('purge', 'bleu.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[AIL + 1, AIR + 1, PURGE + 1, JETTE + 1, SIMPLE + 1, BLEU + 1]} strength={0.03}>
				<Big from={0} to={COMM - 4} text={'Pas d\'hémocultures,\nmais des *ailettes* ?'} size={92} />
				<Fly at={AIL - 6} out={AVEC - 4} x={430} y={720} from="left" to="left">
					<Live
						render={(f) => (
							<div style={{position: 'relative', width: 560, height: 360}}>
								<div style={{position: 'absolute', left: 20, top: 0}}>
									<Butterfly size={320} />
								</div>
								<svg width={560} height={360} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
									<path d="M190 160 Q300 290 430 260 Q520 240 500 380" fill="none" stroke={N} strokeWidth={22} strokeLinecap="round" />
									<path d="M190 160 Q300 290 430 260 Q520 240 500 380" fill="none" stroke="#EEF3F8" strokeWidth={12} strokeLinecap="round" />
									{f >= AIR - 4
										? [0, 1, 2, 3].map((k) => {
												const t = (f / 30 + k / 4) % 1;
												return <circle key={k} cx={220 + t * 260} cy={200 + Math.sin(t * 3) * 70} r={8} fill="#fff" stroke={LPI.blue} strokeWidth={3} opacity={fadeIn(f, AIR - 4, 6)} />;
											})
										: null}
								</svg>
							</div>
						)}
					/>
				</Fly>
				<PTag at={AIR} to={PURGE - 4} x={820} y={560} px={640} py={880}>
					de l'air
				</PTag>
				<Big from={COMM} to={AVEC - 4} text={'Un tube\nde *purge*'} size={110} />
				<Fly at={PURGE - 8} out={JETTE + 6} x={880} y={1040} from="right" to="bottom" move={[{at: JETTE, x: 760, y: 1200, rot: 60, s: 0.6, dur: 10}]}>
					<Live render={(f) => <Tube size={100} cap={CAP.purge} label="purge" level={interpolate(f, [PURGE, PURGE + 20], [0, 0.35], ease)} />} />
				</Fly>
				<PTag at={BLANC} to={JETTE} x={600} y={1100} px={850} py={850}>
					bouchon blanc
				</PTag>
				<Fly at={JETTE - 10} out={AVEC - 4} x={760} y={1280} from="bottom" to="bottom">
					<Live render={(f) => <Bin width={170} open={interpolate(f, [JETTE - 6, JETTE, JETTE + 14, JETTE + 20], [0, 1, 1, 0], ease)} />} />
				</Fly>
				{/* aiguille simple : on commence par le bleu */}
				<Big from={AVEC} text={'Aiguille *simple* :\ndirect le *bleu*'} size={100} />
				<Fly at={SIMPLE - 6} x={300} y={900} from="left" to="left" rot={-90}>
					<VacuNeedle size={330} />
				</Fly>
				<Arrow at={BLEU - 8} x1={500} y1={900} x2={680} y2={900} />
				<Fly at={BLEU - 4} x={820} y={900} from="right" to="right">
					<Tube size={110} cap={CAP.citrate} label="citraté" />
				</Fly>
			</Camera>
			<Rail from={0} fills={{0: PURGE}} cur={() => 0} first="purge" />
			<Sfx name="whoosh" at={AIL - 6} volume={0.15} />
			<Sfx name="pop" at={PURGE - 6} volume={0.2} />
			<Sfx name="whoosh" at={JETTE} volume={0.2} />
			<Sfx name="pop" at={SIMPLE - 4} volume={0.2} />
			<Sfx name="pop" at={BLEU - 2} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE BLEU ═══════════════════════════════ */
export const Bleu: React.FC = () => {
	const BLEU = at('bleu', 'bleu,');
	const CIT = at('bleu', 'citraté.');
	const REMP = at('bleu', 'remplit');
	const TRAIT = at('bleu', 'trait,');
	const PLUS = at('bleu', 'plus,');
	const MOINS = at('bleu', 'moins.');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[BLEU + 1, TRAIT + 1, PLUS + 1, MOINS + 1]} strength={0.03}>
				<TubeTitle n={2} at={BLEU - 2} text={'Le tube *bleu*'} />
				<HeroTube at={BLEU - 4} cap={CAP.citrate} label="citraté" x={290} size={170} level={(f) => interpolate(f, [REMP, REMP + 20], [0, 0.72], ease)} mark={(f) => fadeIn(f, TRAIT - 2, 6)} />
				<PTag at={CIT} to={REMP - 4} x={760} y={620} px={300} py={940}>
					citraté
				</PTag>
				<PTag at={TRAIT} x={760} y={560} px={300} py={858}>
					jusqu'au trait
				</PTag>
				<Fly at={PLUS - 4} x={680} y={960} from="right" to="right">
					<Tube size={90} cap={CAP.citrate} level={0.92} mark={1} bad={1} />
				</Fly>
				<Fly at={MOINS - 4} x={900} y={960} from="right" to="right">
					<Tube size={90} cap={CAP.citrate} level={0.45} mark={1} bad={1} />
				</Fly>
				<Note at={PLUS} y={1220} size={46} x={560}>
					ni plus, ni moins
				</Note>
			</Camera>
			<Rail from={1} fills={{1: BLEU}} cur={() => 1} first="both" />
			<Sfx name="pop" at={BLEU - 2} volume={0.2} />
			<Sfx name="tick" at={TRAIT} volume={0.2} />
			<Sfx name="buzz" at={PLUS} volume={0.15} />
			<Sfx name="buzz" at={MOINS} volume={0.15} />
		</AbsoluteFill>
	);
};

/** Pastille de numéro au-dessus d'un tube. */
const NumBadge: React.FC<{at: number; x: number; y: number; n: number}> = ({at: t0, x, y, n}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return <div style={{position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 50, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, transform: `scale(${popAt(frame, t0)}) rotate(-6deg)`}}>{n}</div>;
};
const TubeName: React.FC<{at: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, x, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return <div style={{position: 'absolute', left: x - 200, width: 400, top: y, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N, transform: `scale(${popAt(frame, t0)})`}}>{children}</div>;
};

/* ═══════════════════════════════ 3 · 4 · LES TUBES SECS ═══════════════════════════════ */
export const Secs: React.FC = () => {
	const SECS = at('secs', 'secs');
	const JAUNE = at('secs', 'jaune,');
	const GEL = at('secs', 'gel…');
	const ROUGE = at('secs', 'rouge.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[SECS + 1, JAUNE + 1, ROUGE + 1]} strength={0.03}>
				<Big from={0} text={'Les tubes *secs*'} size={112} />
				<Fly at={JAUNE - 4} x={340} y={900} from="left" to="left">
					<Tube size={150} cap={CAP.gel} gel label="gel" />
				</Fly>
				<NumBadge at={JAUNE} x={340} y={480} n={3} />
				<TubeName at={JAUNE + 2} x={340} y={1240}>
					jaune
				</TubeName>
				<PTag at={GEL} x={560} y={1170} px={360} py={1150} size={38}>
					gel
				</PTag>
				<Arrow at={ROUGE - 8} x1={470} y1={900} x2={600} y2={900} />
				<Fly at={ROUGE - 4} x={740} y={900} from="right" to="right">
					<Tube size={150} cap={CAP.sec} label="sec" />
				</Fly>
				<NumBadge at={ROUGE} x={740} y={480} n={4} />
				<TubeName at={ROUGE + 2} x={740} y={1240}>
					rouge
				</TubeName>
			</Camera>
			<Rail from={2} fills={{2: JAUNE, 3: ROUGE}} cur={(f) => (f < ROUGE ? 2 : 3)} first="both" />
			<Sfx name="pop" at={JAUNE - 2} volume={0.2} />
			<Sfx name="pop" at={ROUGE - 2} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · 6 · 7 · VERT, VIOLET, GRIS ═══════════════════════════════ */
export const Suite: React.FC = () => {
	const VERT = at('suite', 'vert,');
	const HEP = at('suite', 'hépariné.');
	const VIOL = at('suite', 'violet,');
	const EDTA = at('suite', "l'edta.");
	const DERN = at('suite', 'dernier,');
	const GRIS = at('suite', 'gris,');
	const FLU = at('suite', 'fluorure.');
	const T = [
		{t: VERT, sub: HEP, cap: CAP.hepar, label: 'hépar.', name: 'vert', subName: 'hépariné', x: 220},
		{t: VIOL, sub: EDTA, cap: CAP.edta, label: 'EDTA', name: 'violet', subName: 'EDTA', x: 540},
		{t: GRIS, sub: FLU, cap: CAP.fluor, label: 'fluor.', name: 'gris', subName: 'fluorure', x: 860},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[VERT + 1, VIOL + 1, DERN + 1, GRIS + 1]} strength={0.03}>
				<Big from={0} to={DERN - 4} text={'Puis…'} size={120} />
				<Big from={DERN} text={'En *dernier* :'} size={120} />
				{T.map((o, i) => (
					<React.Fragment key={o.name}>
						<Fly at={o.t - 4} x={o.x} y={880} from="bottom" to="bottom">
							<Tube size={130} cap={o.cap} label={o.label} />
						</Fly>
						<NumBadge at={o.t} x={o.x} y={500} n={5 + i} />
						<TubeName at={o.t + 2} x={o.x} y={1170}>
							{o.name}
						</TubeName>
						<Live render={(f) => (f >= o.sub ? <div style={{position: 'absolute', left: o.x - 180, width: 360, top: 1240, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 36, color: alpha(N, 0.8), opacity: fadeIn(f, o.sub, 6)}}>{o.subName}</div> : null)} />
					</React.Fragment>
				))}
			</Camera>
			<Rail from={4} fills={{4: VERT, 5: VIOL, 6: GRIS}} cur={(f) => (f < VIOL ? 4 : f < GRIS ? 5 : 6)} first="both" />
			{T.map((o) => (
				<Sfx key={o.name} name="pop" at={o.t - 2} volume={0.2} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES GESTES ═══════════════════════════════ */
export const Gestes: React.FC = () => {
	const RET = at('gestes', 'retourne-le');
	const SANS = at('gestes', 'sans');
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
			<Camera punches={[RET + 1, SANS + 1, ETIQ + 1, COUL + 1, PROTO + 1]} strength={0.03}>
				<Big from={0} to={ETIQ - 4} text={'On le *retourne*\n*doucement*'} size={104} />
				<Fly at={2} out={ETIQ - 4} x={320} y={980} from="left" to="left">
					<Live
						render={(f) => {
							const t = interpolate(f, [RET, RET + 70], [0, 3], clamp);
							const rot = (180 * (1 - Math.cos(t * Math.PI))) / 2;
							return (
								<div style={{transform: `rotate(${rot}deg)`}}>
									<Tube size={140} cap={CAP.edta} label="EDTA" level={0.72} />
								</div>
							);
						}}
					/>
				</Fly>
				<Fly at={SANS - 4} out={ETIQ - 4} x={790} y={860} from="right" to="right">
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f * 1.4) * 22}deg)`}}><Tube size={90} cap={CAP.edta} level={0.72} /></div>} />
				</Fly>
				<Cross at={SANS + 2} x={910} y={680} to={ETIQ - 4} size={100} />
				<Note at={SANS} to={ETIQ - 4} y={1250} size={46} x={570}>
					sans secouer !
				</Note>
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
			<Sfx name="pop" at={ETIQ + 10} volume={0.2} />
			<Sfx name="pop" at={COUL - 6} volume={0.15} />
			<Sfx name="ding" at={LABO} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const REC = at('fin', 'récapitule');
	const W = [at('fin', 'hémocultures,'), at('fin', 'bleu,'), at('fin', 'jaune,'), at('fin', 'rouge,'), at('fin', 'vert,'), at('fin', 'violet,'), at('fin', 'gris.')];
	const PURGE = at('fin', 'purge…');
	const RESP = at('fin', 'respecte');
	const ORD = at('fin', "l'ordre…");
	const LABO = at('fin', 'labo');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[REC + 1, ...W.map((w) => w + 1), RESP + 1]} strength={0.025}>
				<Big from={0} to={RESP - 4} text={'On *récapitule*'} size={120} />
				<Big from={RESP} text={'Respecte\n*l\'ordre* !'} size={124} />
				<Live render={(f) => <OrderRail y={820} at={REC - 6} fill={W} labels={W.map((w) => w + 2)} check={W.map((_, i) => RESP + i * 4)} scale={1.05} first={f < PURGE ? 'hemoc' : 'both'} />} />
				<Fly at={LABO - 6} x={540} y={1260} from="bottom" to="bottom">
					<LabSheet width={720} value="4,2" />
				</Fly>
				<Check at={LABO + 10} x={900} y={1080} size={110} />
			</Camera>
			<Confetti at={ORD} />
			{W.map((w, i) => (
				<Sfx key={i} name="pop" at={w} volume={0.2} />
			))}
			<Sfx name="pop" at={PURGE} volume={0.2} />
			<Sfx name="ding" at={RESP} volume={0.25} />
			<Sfx name="ding" at={LABO + 10} volume={0.2} />
		</AbsoluteFill>
	);
};
