// Scènes de « Le matériel pour une prise de sang » (format inventaire) : accroche (le plateau et ses 3 familles, les
// 13 objets tombent à leur place : « Ça, c'est le matériel qu'il te faut… », « 13 objets ! »), puis chaque objet repris
// un par un en gros plan avec une explication courte et une liste qui se coche : prélèvement (aiguille Vacutainer,
// porte-tube, ailettes, tubes sous vide), hygiène et antisepsie (SHA, gants, garrot, antiseptique + compresses
// stériles), fin du soin (compresse, pansement, collecteur à OPCT, sac DASRI), récap. Dessins : src/brand/sampling.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CamKey, Head, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {ScalpelIcon} from '../../brand/icons';
import {Stamp, Strike} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {AntisepticBottle, Arm, ARM_PT, BloodTube, Butterfly, DasriBag, Gauze, Hand, Holder, Plaster, ShaBottle, SharpsBox, TourniquetStrap, VacuNeedle} from '../../brand/sampling';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {abs, at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
const CAPS = [LPI.blue, LPI.pink, LPI.sky, N, LPI.blue];

/** Objet posé (x, y, échelle) qui apparaît en ressort à `at`. */
const Pop: React.FC<{at: number; x: number; y: number; children: React.ReactNode; s?: number; rot?: number; o?: number}> = ({at: t0, x, y, children, s = 1, rot = 0, o = 1}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || o <= 0) return null;
	return <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${popAt(frame, t0) * s}) rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>{children}</div>;
};

/* ═══════════════════════════════ LA LISTE QUI SE COCHE ═══════════════════════════════ */
type Row = {at: number; icon: React.ReactNode; label: string; sub: string};
const Checklist: React.FC<{rows: Row[]; y?: number}> = ({rows, y = 1010}) => {
	const frame = useCurrentFrame();
	return (
		<>
			{rows.map((r, i) => {
				if (frame < r.at) return null;
				const t = frame - r.at;
				const s = interpolate(t, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
				const tick = fadeIn(frame, r.at + 10, 6);
				return (
					<div key={r.label} style={{position: 'absolute', left: 72, top: y + i * 112, width: 936, height: 98, borderRadius: 30, background: LPI.paper, border: `5px solid ${LPI.sky}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px', boxSizing: 'border-box', opacity: s, transform: `translateX(${(1 - s) * 120}px)`}}>
						<div style={{width: 74, height: 74, borderRadius: 37, background: alpha(LPI.sky, 0.6), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden'}}>{r.icon}</div>
						<div style={{flex: 1, minWidth: 0}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{r.label}</div>
							<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: alpha(N, 0.7), whiteSpace: 'nowrap'}}>{r.sub}</div>
						</div>
						<div style={{width: 58, height: 58, borderRadius: 16, border: `5px solid ${N}`, background: tick > 0 ? LPI.pink : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
							{tick > 0 ? (
								<svg width={42} height={42} viewBox="0 0 100 100">
									<path d="M22 52 L42 72 L78 30" fill="none" stroke={N} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${tick} 1`} />
								</svg>
							) : null}
						</div>
					</div>
				);
			})}
		</>
	);
};

/* ═══════════════════════════════ COMPTEUR « MATÉRIEL n / 13 » ═══════════════════════════════ */
/** Frames absolues où chaque objet est présenté (13 objets). */
export const itemMarks = () => [
	abs('prelevement', "l'aiguille"),
	abs('prelevement', 'corps'),
	abs('prelevement', "l'unité"),
	abs('tubes', 'tubes'),
	abs('mains', 'solution'),
	abs('mains', 'gants'),
	abs('bras', 'garrot'),
	abs('bras', "l'antiseptique"),
	abs('bras', 'compresse'),
	abs('fin', 'compresse'),
	abs('fin', 'pansement'),
	abs('dechets', 'collecteur'),
	abs('dechets', 'sac'),
];

export const ItemCounter: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const marks = itemMarks();
	const o = interpolate(frame, [from, from + 10, to - 8, to], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	const n = marks.filter((m) => frame >= m).length;
	const last = marks[Math.max(0, n - 1)];
	const bump = n > 0 && frame - last < 10 ? 1 + 0.25 * Math.exp(-(frame - last) / 3) : 1;
	return (
		<div style={{position: 'absolute', right: 60, top: 222, opacity: o, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 18px', borderRadius: 999, background: LPI.paper, border: `4px solid ${LPI.sky}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.1em', color: N}}>
			MATÉRIEL
			<span style={{display: 'inline-block', padding: '2px 12px', borderRadius: 999, background: LPI.pink, color: N, transform: `scale(${bump})`, fontVariantNumeric: 'tabular-nums'}}>
				{n} / 13
			</span>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE PLATEAU ═══════════════════════════════ */
// Image 0 : titre + le plateau et ses 3 familles (vides) ; les 13 objets tombent à leur place en 1,5 s.
// « 13 objets ! » sur « beaucoup », les familles s'allument une à une sur « un par un ».
type TrayItem = {label: string; w: number; node: React.ReactNode};
const GROUPS: {n: number; title: string; tone: string; items: TrayItem[]}[] = [
	{
		n: 1,
		title: 'Prélèvement',
		tone: LPI.pink,
		items: [
			{label: 'aiguille', w: 280, node: <VacuNeedle size={280} />},
			{label: 'porte-tube', w: 200, node: <Holder size={200} />},
			{label: 'ailettes', w: 220, node: <Butterfly size={220} />},
			{
				label: 'tubes',
				w: 162,
				node: (
					<div style={{display: 'flex', gap: 8}}>
						{[LPI.blue, LPI.pink, N].map((c) => (
							<BloodTube key={c} size={46} cap={c} />
						))}
					</div>
				),
			},
		],
	},
	{
		n: 2,
		title: 'Hygiène et antisepsie',
		tone: LPI.blue,
		items: [
			{label: 'SHA', w: 104, node: <ShaBottle size={104} />},
			{label: 'antiseptique', w: 96, node: <AntisepticBottle size={96} />},
			{label: 'compresses', w: 140, node: <Gauze size={140} sterile />},
			{label: 'garrot', w: 240, node: <TourniquetStrap size={240} />},
			{label: 'gants', w: 126, node: <Hand size={126} gloved={1} />},
		],
	},
	{
		n: 3,
		title: 'Fin du soin',
		tone: N,
		items: [
			{label: 'compresse', w: 140, node: <Gauze size={140} />},
			{label: 'pansement', w: 240, node: <Plaster size={240} />},
			{label: 'collecteur', w: 152, node: <SharpsBox size={152} />},
			{label: 'sac DASRI', w: 152, node: <DasriBag size={152} />},
		],
	},
];
const PANEL = {x: 40, w: 1000, h: 340, y0: 430, gap: 24};

const GroupBadge: React.FC<{n: number; title: string; tone: string; glow?: number}> = ({n, title, tone, glow = 0}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
		<div style={{width: 64, height: 64, borderRadius: 32, background: tone, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: tone === N ? LPI.paper : N, boxShadow: glow > 0 ? `0 0 ${30 * glow}px ${alpha(LPI.pink, 0.9)}` : 'none', transform: `scale(${1 + 0.15 * glow})`}}>{n}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N}}>{title}</div>
	</div>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MAT = at('intro', 'matériel');
	const SANG = at('intro', 'sang');
	const BEAU = at('intro', 'beaucoup');
	const PANI = at('intro', 'panique');
	const REPR = at('intro', 'reprend');
	const UN = at('intro', 'un');
	const PAR = at('intro', 'par');
	const UN2 = at('intro', 'un', 2);
	const lights = [REPR + 8, PAR - 2, UN2 + 4];
	let k = 0;
	const wiggle = frame >= BEAU && frame < BEAU + 26 ? Math.sin((frame - BEAU) * 1.4) * 4 * Math.exp(-(frame - BEAU) / 10) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SANG + 1, BEAU + 1, ...lights.map((l) => l + 1)]} shakes={[BEAU + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 180, width: 936}}>
					<Title at={-20} text={'Prise de sang :\nle *matériel*'} size={96} align="center" stagger={0} />
				</div>
				{GROUPS.map((g, gi) => {
					const y = PANEL.y0 + gi * (PANEL.h + PANEL.gap);
					const glow = interpolate(frame, [lights[gi], lights[gi] + 6, lights[gi] + 22], [0, 1, 0.35], clamp);
					const total = g.items.reduce((s, it) => s + it.w, 0);
					const gapX = (PANEL.w - 80 - total) / (g.items.length - 1);
					let x = 40;
					return (
						<div key={g.n} style={{position: 'absolute', left: PANEL.x, top: y, width: PANEL.w, height: PANEL.h, borderRadius: 44, background: LPI.paper, border: `6px solid ${glow > 0.1 ? LPI.pink : alpha(g.tone, 0.6)}`, boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${alpha(LPI.pink, 0.6)}` : SHADOW}}>
							<div style={{position: 'absolute', left: 26, top: 18}}>
								<GroupBadge n={g.n} title={g.title} tone={g.tone} glow={glow} />
							</div>
							{g.items.map((it) => {
								const land = -6 + k++ * 3;
								const t = frame - land;
								// chute qui accélère (12 images) puis petits rebonds à l'atterrissage
								const drop = t < 0 ? -420 * (t / 12) ** 2 : t < 14 ? -24 * Math.exp(-t / 2.5) * Math.abs(Math.sin(t * 0.9)) : 0;
								const left = x;
								x += it.w + gapX;
								return (
									<div key={it.label} style={{position: 'absolute', left, top: 96, width: it.w, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', transform: `translateY(${drop}px) rotate(${wiggle * (k % 2 ? 1 : -1)}deg)`, opacity: t < -12 ? 0 : 1}}>
										<div style={{flex: 1, display: 'flex', alignItems: 'center'}}>{it.node}</div>
										<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: alpha(N, 0.8), opacity: fadeIn(frame, land + 4, 6), whiteSpace: 'nowrap'}}>{it.label}</div>
									</div>
								);
							})}
						</div>
					);
				})}
				<Stamp at={BEAU} x={830} y={448} text="13 objets !" size={60} rot={-8} out={PANI + 20} />
				<Burst at={SANG} x={540} y={300} r={340} n={16} />
			</Camera>
			{Array.from({length: 13}, (_, i) => (
				<Sfx key={i} name="pop" at={Math.max(0, -6 + i * 3)} volume={0.05} />
			))}
			<Sfx name="ding" at={SANG} volume={0.08} />
			<Sfx name="stamp" at={BEAU} volume={0.1} />
			{lights.map((l) => (
				<Sfx key={l} name="tick" at={l} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · PRÉLÈVEMENT : AIGUILLE, PORTE-TUBE, AILETTES ═══════════════════════════════ */
export const Prelevement: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('prelevement', 'un');
	const PREL = at('prelevement', 'prélèvement');
	const AIG = at('prelevement', "l'aiguille");
	const DEUX = at('prelevement', 'deux');
	const VEINE = at('prelevement', 'veine');
	const TUBE = at('prelevement', 'tube');
	const VISSE = at('prelevement', 'visse');
	const CORPS = at('prelevement', 'corps');
	const PT = at('prelevement', 'porte-tube');
	const FINE = at('prelevement', 'fine');
	const UNITE = at('prelevement', "l'unité");
	const AIL = at('prelevement', 'ailettes');
	const EPI = at('prelevement', 'épicrânienne');
	// aiguille seule (760 px) → vissée sur le porte-tube (600 px)
	const a = interpolate(frame, [VISSE - 6, VISSE + 10], [0, 1], ease);
	const nx = 88 + (235 - 88) * a;
	const ny = 150 + (188 - 150) * a;
	const ns = 760 + (600 - 760) * a;
	const screw = frame >= VISSE && frame < VISSE + 18 ? Math.sin((frame - VISSE) * 1.2) * 6 : 0;
	const setO = 1 - 0.75 * fadeIn(frame, UNITE - 6, 10);
	const keys: CamKey[] = [
		{at: VEINE - 4, s: 1.9, x: 88 + 380 * 1.9, y: 245, dur: 14},
		{at: TUBE - 4, s: 1.9, x: 88 + 95 * 1.9, y: 245, dur: 14},
		{at: VISSE - 6, s: 1, dur: 14},
		{at: AIL - 4, s: 1.4, x: 590, y: 300, dur: 14},
		{at: EPI + 24, s: 1, dur: 16},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[UN + 1, AIG + 1, VEINE + 1, TUBE + 1, CORPS + 1, UNITE + 1]} shakes={[VISSE + 10]}>
				<Head kicker="1 · Prélèvement" kAt={UN - 4} title="Pour *piquer*" tAt={PREL - 4} />
				<Stage y={440} h={540} at={UN} bumps={[AIG, VISSE, UNITE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', inset: 0, opacity: setO}}>
							{frame >= AIG - 4 ? (
								<div style={{position: 'absolute', left: nx, top: ny, transform: `scale(${popAt(frame, AIG - 4)}) rotate(${screw}deg)`, transformOrigin: '40% 50%'}}>
									<VacuNeedle size={ns} glowVein={fadeIn(frame, VEINE - 4, 6) * (1 - fadeIn(frame, TUBE - 4, 6))} glowTube={fadeIn(frame, TUBE - 4, 6) * (1 - fadeIn(frame, VISSE - 6, 6))} />
								</div>
							) : null}
							{frame >= VISSE - 6 ? (
								<div style={{position: 'absolute', left: -450 + 510 * a, top: 170}}>
									<Holder size={400} />
								</div>
							) : null}
						</div>
						{frame >= UNITE - 4 ? (
							<div style={{position: 'absolute', left: 170, top: 140, transform: `scale(${popAt(frame, UNITE - 4)})`}}>
								<Butterfly size={600} flap={fadeIn(frame, AIL - 2, 4) * (1 - fadeIn(frame, AIL + 40, 8))} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={VEINE - 2} to={TUBE - 4} x={520} y={40}>
						pointe côté veine
					</StagePill>
					<StagePill from={TUBE - 2} to={VISSE - 6} x={40} y={40} color={LPI.sky}>
						pointe côté tube, sous le manchon
					</StagePill>
					<StagePill from={CORPS - 2} to={PT - 2} x={40} y={40} color={LPI.sky}>
						corps de prélèvement
					</StagePill>
					<StagePill from={PT - 2} to={FINE - 4} x={40} y={40} color={LPI.blue}>
						= le porte-tube, qu'on tient en main
					</StagePill>
					<StagePill from={FINE - 2} to={EPI - 2} x={40} y={40}>
						veine fine ou fragile ?
					</StagePill>
					<StagePill from={EPI - 2} x={40} y={40} color={LPI.blue}>
						unité à ailettes = épicrânienne
					</StagePill>
				</Stage>
				<Checklist
					rows={[
						{at: AIG, icon: <VacuNeedle size={70} />, label: 'Aiguille Vacutainer', sub: '2 pointes : une veine, une tube'},
						{at: CORPS, icon: <Holder size={64} />, label: 'Corps de prélèvement', sub: 'le porte-tube'},
						{at: UNITE, icon: <Butterfly size={66} />, label: 'Unité à ailettes', sub: 'épicrânienne : veine fine ou fragile'},
					]}
				/>
			</Camera>
			<Sfx name="pop" at={AIG} volume={0.09} />
			<Sfx name="whoosh" at={VEINE - 4} volume={0.05} />
			<Sfx name="whoosh" at={TUBE - 4} volume={0.05} />
			<Sfx name="whoosh" at={VISSE - 6} volume={0.06} />
			{[0, 6, 12].map((d) => (
				<Sfx key={d} name="tick" at={VISSE + d} volume={0.06} />
			))}
			<Sfx name="pop" at={UNITE} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · PRÉLÈVEMENT : LES TUBES ═══════════════════════════════ */
export const Tubes: React.FC = () => {
	const frame = useCurrentFrame();
	const TUBES = at('tubes', 'tubes');
	const PRESC = at('tubes', 'prescription');
	const COUL = at('tubes', 'couleur');
	const BOUCH = at('tubes', 'bouchon');
	const ANAL = at('tubes', 'analyse');
	const DEDANS = at('tubes', 'dedans');
	const VIDE = at('tubes', 'vide');
	const ASP = at('tubes', 'aspire');
	const QTE = at('tubes', 'quantité');
	const T = {x: 360, y: 150, gap: 104, size: 74};
	const sel = 2;
	const sx = T.x + sel * T.gap + T.size / 2;
	const keys: CamKey[] = [
		{at: DEDANS - 4, s: 1.7, x: sx, y: 300, dur: 16},
		{at: QTE + 30, s: 1, dur: 16},
	];
	const pierce = interpolate(frame, [ASP - 10, ASP], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TUBES + 1, COUL + 1, ANAL + 1, VIDE + 1, ASP + 1, QTE + 1]} shakes={[ASP + 2]}>
				<Head kicker="1 · Prélèvement" kAt={TUBES - 8} title="Les *tubes*" tAt={TUBES - 4} />
				<Stage y={440} h={540} at={TUBES - 6} bumps={[PRESC, COUL, VIDE, ASP]}>
					<ZoomCam keys={keys} w={936} h={540}>
						{/* la prescription */}
						<Pop at={PRESC - 4} x={40} y={70}>
							<div style={{width: 260, height: 380, borderRadius: 18, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, padding: '22px 22px', boxSizing: 'border-box'}}>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>Prescription</div>
								{CAPS.slice(0, 4).map((c, i) => (
									<div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 24}}>
										<div style={{width: 30, height: 30, borderRadius: 8, border: `4px solid ${N}`, background: frame >= PRESC + 6 + i * 5 ? c : LPI.paper}} />
										<div style={{height: 10, width: 140 - (i % 2) * 40, borderRadius: 5, background: alpha(N, 0.2)}} />
									</div>
								))}
							</div>
						</Pop>
						{/* les tubes */}
						{CAPS.map((c, i) => {
							const lit = frame >= COUL + i * 5 && frame < ANAL + 20;
							const focus = i === sel && frame >= DEDANS - 4;
							return (
								<div key={i} style={{position: 'absolute', left: T.x + i * T.gap, top: T.y, transform: `scale(${popAt(frame, TUBES - 2 + i * 3) * (lit ? 1.08 : 1)})`, opacity: frame >= DEDANS - 4 && !focus ? 0.35 : 1}}>
									<BloodTube size={T.size} cap={c} vacuum={focus ? fadeIn(frame, VIDE - 2, 6) * (1 - fadeIn(frame, ASP, 6)) : 0} level={focus ? interpolate(frame, [ASP, QTE + 10], [0, 0.72], ease) : 0} mark={focus ? fadeIn(frame, QTE - 4, 6) : 0} />
								</div>
							);
						})}
						{/* l'aiguille (côté tube) perce le bouchon */}
						{frame >= ASP - 12 ? (
							<div style={{position: 'absolute', left: sx - 32, top: T.y - 210 + 64 * pierce, transform: 'rotate(90deg)', transformOrigin: '0 0'}}>
								<div style={{transform: 'translate(-6px, -40px)'}}>
									<VacuNeedle size={160} />
								</div>
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={ANAL - 2} to={DEDANS - 4} x={360} y={460} color={LPI.blue}>
						1 couleur = 1 analyse
					</StagePill>
					<StagePill from={VIDE - 2} to={ASP - 2} color={LPI.sky}>
						dedans : du vide
					</StagePill>
					<StagePill from={ASP - 2} to={QTE - 4}>
						il aspire le sang tout seul
					</StagePill>
					<StagePill from={QTE - 2} color={LPI.blue}>
						jusqu'à la bonne quantité
					</StagePill>
				</Stage>
				<Checklist
					rows={[
						{at: TUBES, icon: <BloodTube size={30} cap={LPI.blue} />, label: 'Tubes', sub: 'ceux de la prescription'},
						{at: BOUCH, icon: <BloodTube size={30} cap={LPI.pink} />, label: 'Couleur du bouchon', sub: '= le type d’analyse'},
						{at: VIDE, icon: <BloodTube size={30} cap={N} level={0.6} />, label: 'Tube sous vide', sub: 'il aspire la bonne quantité'},
					]}
				/>
			</Camera>
			{CAPS.map((_, i) => (
				<Sfx key={i} name="pop" at={TUBES - 2 + i * 3} volume={0.06} />
			))}
			<Sfx name="tick" at={PRESC + 6} volume={0.07} />
			<Sfx name="whoosh" at={DEDANS - 4} volume={0.06} />
			<Sfx name="pop" at={ASP} volume={0.09} />
			<Sfx name="ding" at={QTE + 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · HYGIÈNE : SHA ET GANTS ═══════════════════════════════ */
export const Mains: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('mains', 'deux');
	const HYG = at('mains', "l'hygiène");
	const DAB = at('mains', "d'abord");
	const SOL = at('mains', 'solution');
	const SHA = at('mains', 'sha');
	const MAINS = at('mains', 'mains');
	const GANTS = at('mains', 'gants');
	const NON = at('mains', 'non');
	const PROT = at('mains', 'protègent');
	const rub = frame >= MAINS - 4 && frame < GANTS - 6 ? Math.sin(frame / 2.2) * 16 : 0;
	const gloved = fadeIn(frame, GANTS, 4) > 0.5 ? 1 : 0;
	const keys: CamKey[] = [
		{at: SOL - 4, s: 1.35, x: 240, y: 290, dur: 14},
		{at: MAINS - 6, s: 1.3, x: 600, y: 290, dur: 14},
		{at: PROT + 30, s: 1, dur: 16},
	];
	const drip = interpolate(frame, [MAINS - 10, MAINS + 6], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, SOL + 1, MAINS + 1, GANTS + 1, PROT + 1]} shakes={[GANTS + 2]}>
				<Head kicker="2 · Hygiène et antisepsie" kAt={DEUX - 4} title="D’abord, les *mains*" tAt={HYG - 2} size={84} />
				<Stage y={440} h={540} at={DEUX} bumps={[SOL, MAINS, GANTS]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Pop at={SOL - 4} x={150} y={110}>
							<ShaBottle size={190} press={frame >= MAINS - 12 && frame < MAINS ? 1 : 0} />
						</Pop>
						{drip > 0 && drip < 1 ? <div style={{position: 'absolute', left: 445 + 150 * drip, top: 150 + 150 * drip * drip, width: 22, height: 30, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: LPI.sky, border: `4px solid ${N}`}} /> : null}
						<Pop at={DAB} x={470 + rub} y={150}>
							<div style={{transform: 'scaleX(-1)'}}>
								<Hand size={170} gloved={gloved} />
							</div>
						</Pop>
						<Pop at={DAB + 4} x={660 - rub} y={150}>
							<Hand size={170} gloved={gloved} />
						</Pop>
						{frame >= MAINS && frame < GANTS
							? Array.from({length: 6}, (_, i) => {
									const t = ((frame - MAINS) / 18 + i / 6) % 1;
									return <div key={i} style={{position: 'absolute', left: 560 + Math.cos(i * 1.7) * 160 * t, top: 260 - 120 * t + Math.sin(i * 2.3) * 40, width: 16, height: 16, borderRadius: 8, background: i % 2 ? LPI.sky : LPI.pink, opacity: 1 - t}} />;
								})
							: null}
						{frame >= PROT - 2 ? (
							<div style={{position: 'absolute', left: 590, top: 40, transform: `scale(${popAt(frame, PROT - 2)})`}}>
								<svg width={140} height={160} viewBox="0 0 100 114">
									<path d="M50 4 L92 20 V54 C92 82 72 100 50 110 C28 100 8 82 8 54 V20 Z" fill={LPI.blue} stroke={N} strokeWidth={6} strokeLinejoin="round" />
									<path d="M50 34 C50 34 64 52 64 62 A14 14 0 0 1 36 62 C36 52 50 34 50 34 Z" fill={LPI.pink} stroke={N} strokeWidth={4} />
								</svg>
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={SHA - 2} to={MAINS - 4} color={LPI.sky}>
						SHA = solution hydroalcoolique
					</StagePill>
					<StagePill from={MAINS - 2} to={GANTS - 4} color={LPI.blue}>
						friction des mains
					</StagePill>
					<StagePill from={NON - 2} to={PROT - 2}>
						usage unique · non stériles
					</StagePill>
					<StagePill from={PROT - 2} color={LPI.blue}>
						ils te protègent du sang
					</StagePill>
				</Stage>
				<Checklist
					rows={[
						{at: SOL, icon: <ShaBottle size={40} />, label: 'Solution hydroalcoolique', sub: 'la SHA, pour les mains'},
						{at: GANTS, icon: <Hand size={52} gloved={1} />, label: 'Gants à usage unique', sub: 'non stériles : te protègent du sang'},
					]}
				/>
			</Camera>
			<Sfx name="pop" at={SOL} volume={0.09} />
			<Sfx name="pop" at={MAINS - 8} volume={0.06} />
			<Sfx name="whoosh" at={MAINS} volume={0.05} />
			<Sfx name="pop" at={GANTS + 2} volume={0.1} />
			<Sfx name="ding" at={PROT} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · ANTISEPSIE : GARROT, ANTISEPTIQUE, COMPRESSES STÉRILES ═══════════════════════════════ */
const AB = {x: 18, y: 130, w: 900};
const armPt = (p: readonly [number, number]) => ({x: AB.x + (p[0] * AB.w) / 900, y: AB.y + (p[1] * AB.w) / 900});

export const Bras: React.FC = () => {
	const frame = useCurrentFrame();
	const GARROT = at('bras', 'garrot');
	const SERRE = at('bras', 'serre');
	const DESSUS = at('bras', 'au-dessus');
	const POINT = at('bras', 'point');
	const LA = at('bras', 'là');
	const VEINE = at('bras', 'veine');
	const GONFLE = at('bras', 'gonfle');
	const ANTI = at('bras', "l'antiseptique");
	const COMP = at('bras', 'compresse');
	const DESINF = at('bras', 'désinfecte');
	const pt = armPt(ARM_PT.point);
	const keys: CamKey[] = [
		{at: GONFLE - 4, s: 1.6, x: pt.x - 60, y: pt.y, dur: 14},
		{at: ANTI - 4, s: 1.25, x: pt.x + 80, y: pt.y - 40, dur: 14},
		{at: DESINF - 4, s: 1.7, x: pt.x, y: pt.y, dur: 14},
	];
	const wipeT = interpolate(frame, [DESINF - 4, DESINF + 24], [0, 1], ease);
	const gz = frame >= COMP ? {x: pt.x - 60 + Math.cos(frame / 3) * 40 * wipeT, y: pt.y - 60 + Math.sin(frame / 3) * 26 * wipeT} : {x: 700, y: 30};
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[GARROT + 1, SERRE + 1, POINT + 1, GONFLE + 1, ANTI + 1, DESINF + 1]} shakes={[SERRE + 2]}>
				<Head kicker="2 · Hygiène et antisepsie" kAt={GARROT - 8} title="Préparer le *bras*" tAt={GARROT - 4} size={84} />
				<Stage y={440} h={540} at={GARROT - 6} bumps={[SERRE, GONFLE, DESINF]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: AB.x, top: AB.y}}>
							<Arm width={AB.w} tourniquet={fadeIn(frame, GARROT - 4, 10)} tight={fadeIn(frame, SERRE, 8)} mark={fadeIn(frame, POINT - 2, 8)} swell={interpolate(frame, [GONFLE - 4, GONFLE + 14], [0, 1], ease)} wipe={wipeT} />
						</div>
						{frame >= DESSUS - 2 && frame < VEINE ? (
							<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: fadeIn(frame, DESSUS - 2, 6)}}>
								<path d={`M${pt.x - 30} ${AB.y + 20} C${pt.x - 70} ${AB.y - 30} ${AB.x + 320} ${AB.y - 40} ${AB.x + 310} ${AB.y + 20}`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" strokeDasharray="14 10" />
								<path d={`M${AB.x + 296} ${AB.y + 4} L${AB.x + 310} ${AB.y + 24} L${AB.x + 328} ${AB.y + 8}`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						) : null}
						{frame >= ANTI - 4 ? (
							<div style={{position: 'absolute', left: 560, top: 20, transform: `scale(${popAt(frame, ANTI - 4)})`, opacity: 1 - fadeIn(frame, DESINF + 40, 8)}}>
								<AntisepticBottle size={110} />
							</div>
						) : null}
						{frame >= COMP - 4 ? (
							<div style={{position: 'absolute', left: gz.x, top: gz.y, transform: `scale(${popAt(frame, COMP - 4) * (frame >= COMP ? 0.85 : 1)})`}}>
								<Gauze size={120} sterile={frame < COMP + 6} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={SERRE - 2} to={POINT - 2} color={LPI.blue}>
						le garrot se serre…
					</StagePill>
					<StagePill from={POINT - 2} to={VEINE - 2}>
						… au-dessus du point de ponction
					</StagePill>
					<StagePill from={GONFLE - 2} to={ANTI - 4} color={LPI.blue}>
						la veine gonfle : plus facile à trouver
					</StagePill>
					<StagePill from={COMP - 2} to={DESINF - 2} color={LPI.sky}>
						sur une compresse stérile
					</StagePill>
					<StagePill from={DESINF - 2} color={LPI.blue}>
						on désinfecte la peau
					</StagePill>
				</Stage>
				{frame >= LA - 2 && frame < VEINE + 10 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1370, display: 'flex', justifyContent: 'center', opacity: fadeIn(frame, LA - 2, 6)}}>
						<div style={{padding: '8px 24px', borderRadius: 999, background: N, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 34}}>point de ponction = là où on va piquer</div>
					</div>
				) : null}
				<Checklist
					y={1010}
					rows={[
						{at: GARROT, icon: <TourniquetStrap size={68} />, label: 'Garrot', sub: 'au-dessus du point de ponction'},
						{at: ANTI, icon: <AntisepticBottle size={38} />, label: 'Antiseptique cutané', sub: 'désinfecte la peau'},
						{at: COMP, icon: <Gauze size={60} sterile />, label: 'Compresses stériles', sub: 'pour appliquer l’antiseptique'},
					]}
				/>
			</Camera>
			<Sfx name="pop" at={GARROT} volume={0.08} />
			<Sfx name="tick" at={SERRE} volume={0.09} />
			<Sfx name="pop" at={POINT} volume={0.07} />
			<Sfx name="whoosh" at={GONFLE - 4} volume={0.05} />
			<Sfx name="pop" at={ANTI} volume={0.08} />
			<Sfx name="whoosh" at={DESINF} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · FIN DU SOIN : COMPRESSE, PANSEMENT ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('fin', 'trois');
	const TERM = at('fin', 'terminer');
	const COMP = at('fin', 'compresse');
	const APP = at('fin', 'appuyer');
	const RET = at('fin', 'retire');
	const PANS = at('fin', 'pansement');
	const SPAR = at('fin', 'sparadrap');
	const pt = armPt(ARM_PT.point);
	const keys: CamKey[] = [
		{at: -1, s: 1.5, x: pt.x + 100, y: pt.y - 20, dur: 1},
		{at: APP - 4, s: 1.8, x: pt.x + 30, y: pt.y, dur: 14},
		{at: SPAR + 20, s: 1.3, x: pt.x, y: pt.y, dur: 16},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TROIS + 1, COMP + 1, APP + 1, RET + 1, PANS + 1]} shakes={[RET + 2]}>
				<Head kicker="3 · Fin du soin" kAt={TROIS - 4} title="Pour *terminer*" tAt={TERM - 4} />
				<Stage y={440} h={540} at={TROIS} bumps={[COMP, RET, PANS]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: AB.x, top: AB.y}}>
							<Arm width={AB.w} needle={1 - interpolate(frame, [RET - 2, RET + 12], [0, 1], ease)} gauze={frame >= PANS + 2 ? 0 : popAt(frame, APP - 2)} plaster={popAt(frame, PANS + 2)} />
						</div>
						{frame >= COMP - 4 && frame < APP - 2 ? (
							<div style={{position: 'absolute', left: pt.x - 60, top: pt.y - 220, transform: `scale(${popAt(frame, COMP - 4)})`}}>
								<Gauze size={120} />
							</div>
						) : null}
						{frame >= APP - 2 && frame < PANS ? (
							<div style={{position: 'absolute', left: pt.x - 40, top: pt.y - 150 + 8 * Math.sin(frame / 3), transform: 'rotate(180deg)'}}>
								<svg width={80} height={110} viewBox="0 0 80 110">
									<path d="M14 0 V70 C14 100 66 100 66 70 V0" fill={LPI.paper} stroke={N} strokeWidth={6} />
									<path d="M14 0 V70 C14 100 66 100 66 70 V0" fill={alpha(LPI.pink, 0.28)} />
								</svg>
							</div>
						) : null}
						{frame >= SPAR - 2 ? (
							<div style={{position: 'absolute', left: 640, top: 40, transform: `scale(${popAt(frame, SPAR - 2)}) rotate(-8deg)`}}>
								<svg width={170} height={120} viewBox="0 0 170 120">
									<circle cx={60} cy={60} r={52} fill={LPI.sky} stroke={N} strokeWidth={6} />
									<circle cx={60} cy={60} r={22} fill={LPI.paper} stroke={N} strokeWidth={5} />
									<path d="M108 34 H164 V86 H108" fill={LPI.paper} stroke={N} strokeWidth={6} strokeLinejoin="round" />
								</svg>
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={APP - 2} to={RET - 2} color={LPI.blue}>
						on appuie avec la compresse…
					</StagePill>
					<StagePill from={RET - 2} to={PANS - 2}>
						… en retirant l'aiguille
					</StagePill>
					<StagePill from={PANS - 2} color={LPI.sky}>
						pansement ou sparadrap
					</StagePill>
				</Stage>
				<Checklist
					rows={[
						{at: COMP, icon: <Gauze size={60} />, label: 'Compresse', sub: 'on appuie en retirant l’aiguille'},
						{at: PANS, icon: <Plaster size={68} />, label: 'Pansement ou sparadrap', sub: 'pour protéger'},
					]}
				/>
			</Camera>
			<Sfx name="pop" at={COMP} volume={0.08} />
			<Sfx name="whoosh" at={RET} volume={0.06} />
			<Sfx name="pop" at={PANS + 2} volume={0.09} />
			<Sfx name="pop" at={SPAR} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · FIN DU SOIN : LES DÉCHETS ═══════════════════════════════ */
export const Dechets: React.FC = () => {
	const frame = useCurrentFrame();
	const IMP = at('dechets', 'important');
	const COLL = at('dechets', 'collecteur');
	const OPCT = at('dechets', 'opct');
	const PIQ = at('dechets', 'piquants');
	const COUP = at('dechets', 'coupants');
	const TRANCH = at('dechets', 'tranchants');
	const AIG = at('dechets', "l'aiguille");
	const JAMAIS = at('dechets', 'jamais');
	const RECAP = at('dechets', 'recapuchonner');
	const DECH = at('dechets', 'déchets', 2);
	const SAC = at('dechets', 'sac');
	const RISQ = at('dechets', 'risque');
	const keys: CamKey[] = [
		{at: AIG - 4, s: 1.4, x: 250, y: 230, dur: 14},
		{at: DECH - 6, s: 1, dur: 16},
	];
	const icon = (node: React.ReactNode, t0: number, i: number) => {
		if (frame < t0) return null;
		const fall = interpolate(frame, [t0 + 14, t0 + 26], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
		if (fall >= 1) return null;
		return (
			<div key={i} style={{position: 'absolute', left: 120 + i * 110, top: 20 + 150 * fall, transform: `scale(${popAt(frame, t0) * (1 - 0.6 * fall)})`, opacity: 1 - fall}}>
				{node}
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[IMP + 1, COLL + 1, PIQ + 1, COUP + 1, TRANCH + 1, AIG + 1, RECAP + 1, SAC + 1]} shakes={[RECAP + 2]}>
				<Head kicker="3 · Fin du soin" kAt={IMP - 8} title="Les *déchets*" tAt={IMP - 4} />
				<Stage y={440} h={540} at={IMP - 6} bumps={[COLL, AIG, SAC]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Pop at={COLL - 4} x={120} y={170}>
							<SharpsBox size={260} drop={interpolate(frame, [AIG + 4, AIG + 22], [0, 1], clamp)} />
						</Pop>
						{icon(<VacuNeedle size={110} />, PIQ - 2, 0)}
						{icon(<ScalpelIcon size={90} />, COUP - 2, 1)}
						{icon(
							<svg width={90} height={90} viewBox="0 0 100 100">
								<path d="M20 80 L70 20 L84 34 L34 90 Z" fill={LPI.paper} stroke={N} strokeWidth={6} strokeLinejoin="round" />
								<path d="M70 20 L84 34" stroke={LPI.pink} strokeWidth={8} />
							</svg>,
							TRANCH - 2,
							2,
						)}
						<Pop at={SAC - 4} x={560} y={170}>
							<DasriBag size={260} fill={interpolate(frame, [SAC + 6, SAC + 26], [0, 1], clamp)} />
						</Pop>
						{frame >= DECH - 2 && frame < SAC + 6 ? (
							<div style={{position: 'absolute', left: 600, top: 40, transform: `scale(${popAt(frame, DECH - 2)})`, display: 'flex', gap: 14}}>
								<Gauze size={90} />
								<Hand size={70} gloved={1} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={OPCT - 2} to={AIG - 4} x={420} y={40} color={LPI.blue}>
						OPCT = objets piquants, coupants, tranchants
					</StagePill>
					<StagePill from={AIG} to={JAMAIS - 2} x={420} y={40}>
						l'aiguille y va tout de suite
					</StagePill>
					<StagePill from={RISQ - 2} x={420} y={40} color={LPI.blue}>
						DASRI : déchets à risque infectieux
					</StagePill>
				</Stage>
				{frame >= JAMAIS - 2 && frame < DECH - 6 ? (
					<div style={{position: 'absolute', left: 300, top: 560, transform: `scale(${popAt(frame, JAMAIS - 2)}) rotate(-12deg)`, opacity: 1 - fadeIn(frame, DECH - 12, 6)}}>
						<VacuNeedle size={420} cap={1} />
						<div style={{position: 'absolute', left: -20, top: 40}}>
							<Strike at={RECAP} width={460} rot={-6} />
						</div>
					</div>
				) : null}
				<Stamp at={RECAP} x={540} y={820} text="Jamais recapuchonner !" size={56} rot={-6} out={DECH - 8} />
				<Checklist
					rows={[
						{at: COLL, icon: <SharpsBox size={52} />, label: 'Collecteur à OPCT', sub: 'piquants · coupants · tranchants'},
						{at: SAC, icon: <DasriBag size={52} />, label: 'Sac DASRI', sub: 'déchets à risque infectieux'},
					]}
				/>
				<Burst at={RECAP} x={540} y={820} r={300} n={14} />
			</Camera>
			<Sfx name="pop" at={COLL} volume={0.09} />
			{[PIQ, COUP, TRANCH].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="whoosh" at={AIG + 4} volume={0.06} />
			<Sfx name="impact" at={AIG + 22} volume={0.07} />
			<Sfx name="stamp" at={RECAP} volume={0.11} />
			<Sfx name="pop" at={SAC} volume={0.09} />
			<Sfx name="impact" at={SAC + 26} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Ton *plateau*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'prêt') + 8}
		rows={[
			[at('outro', 'prélèvement'), 'device', 'Prélèvement', 'aiguille · porte-tube · tubes'],
			[at('outro', 'hygiène'), 'check', 'Hygiène', 'SHA · gants · garrot · antiseptique'],
			[at('outro', 'fin'), 'check', 'Fin du soin', 'pansement · OPCT · DASRI'],
		]}
	/>
);
