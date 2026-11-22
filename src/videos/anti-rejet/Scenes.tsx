// « Les anti-rejet » (n° 72, série « le tube violet », dernière vidéo ; directives Instagram du 20/11/2026) : sujet + enjeu
// dès l'image 0 (« Les anti-rejet », compteur 0/4, le rein greffé, la jauge trop bas / trop haut). 1 · pourquoi (le greffon
// est un intrus, l'anti-rejet freine les défenses : immunosuppresseur) ; 2 · lesquels (ciclosporine, tacrolimus,
// évérolimus, dosés dans le sang entier → tube violet) ; 3 · marge étroite (trop bas : rejet ; trop haut : reins, tremblements,
// infections) ; 4 · le bon moment (juste avant la prise suivante = taux résiduel, noter l'heure de la dernière prise).
// Fin : le pamplemousse fait monter leur taux + série terminée. Ajout de l'agent (demandé : « complète si j'ai oublié »).
// Sources : RCP (ANSM / EMA) de la ciclosporine, du tacrolimus et de l'évérolimus (suivi des concentrations sanguines
// résiduelles sur sang total, interaction avec le jus de pamplemousse) ; HAS, suivi du patient transplanté rénal.
// « greffe » est entendu « grève » avec la voix : l'accroche dit « le rein d'un donneur ».
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, FlatBg, Live, Note, popAt, RowCard, ease} from '../../brand/bold';
import {Defender, KidneysIcon} from '../../brand/diabetes';
import {Microbe} from '../../brand/hands';
import {PillIcon, TremorIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const VIOLET = CAP.edta;

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<FlatBg tone={tone} light={0.24} />
	</>
);

const Pop: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, to = 1e9, x, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * interpolate(frame, [to, to + 7], [1, 0], clamp)})`}}>{children}</div>;
};

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue || tone === LPI.navy ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 18, height: 24, borderRadius: 5, background: VIOLET, border: `3px solid ${N}`}} />
		LE TUBE VIOLET · ANTI-REJET
	</div>
);

const Counter: React.FC<{steps: [number, number][]; done?: boolean}> = ({steps, done}) => {
	const frame = useCurrentFrame();
	let n = 0;
	let bump = -100;
	for (const [t, v] of steps) if (frame >= t) [n, bump] = [v, t];
	const s = frame >= bump && frame < bump + 20 ? 1 + 0.15 * Math.sin(((frame - bump) / 20) * Math.PI) : 1;
	return (
		<div style={{position: 'absolute', left: 900, top: 250, transform: `translate(-50%, -50%) scale(${s})`, padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{n} / 4
		</div>
	);
};

/* ───────────── briques de la vidéo ───────────── */

/** Le rein greffé (cicatrice de sutures) ; `hurt` = abîmé (pâle, fissures). */
const Graft: React.FC<{size?: number; hurt?: number}> = ({size = 360, hurt = 0}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
		<path d="M110 20 C160 20 186 60 180 104 C174 150 140 184 100 180 C70 177 66 150 78 128 C88 110 70 98 62 82 C48 50 70 20 110 20 Z" fill={hurt ? `color-mix(in srgb, ${LPI.pink} ${100 - hurt * 60}%, ${LPI.paper})` : LPI.pink} stroke={N} strokeWidth={8} strokeLinejoin="round" />
		<path d="M118 46 C148 52 162 86 154 118" fill="none" stroke={alpha(N, 0.35)} strokeWidth={6} strokeLinecap="round" />
		{/* l'uretère et les vaisseaux */}
		<path d="M72 100 C50 104 36 118 30 150" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" />
		{/* sutures */}
		{[0, 1, 2, 3, 4].map((i) => (
			<path key={i} d={`M${92 + i * 14} ${34 + i * 3} l8 14`} stroke={N} strokeWidth={4} strokeLinecap="round" />
		))}
		<path d="M90 42 Q120 46 158 50" fill="none" stroke={N} strokeWidth={3} />
		{hurt > 0 ? <path d="M120 90 l14 18 l-10 10 l16 22 M150 120 l-12 8" stroke={N} strokeWidth={4} strokeLinecap="round" fill="none" opacity={hurt} /> : null}
	</svg>
);

/** Jauge « marge étroite » : rejet ← fenêtre efficace → toxique ; `v` de 0 (bas) à 1 (haut). */
const Window: React.FC<{v: number; width?: number; labels?: boolean}> = ({v, width = 900, labels = true}) => {
	const x = 30 + v * (width - 60);
	return (
		<div style={{position: 'relative', width, height: 170}}>
			<div style={{position: 'absolute', left: 0, top: 50, width, height: 70, borderRadius: 35, overflow: 'hidden', border: `6px solid ${N}`, display: 'flex'}}>
				<div style={{flex: 4, background: LPI.pink}} />
				<div style={{flex: 2, background: LPI.sky, borderLeft: `5px solid ${N}`, borderRight: `5px solid ${N}`}} />
				<div style={{flex: 4, background: LPI.pink}} />
			</div>
			<div style={{position: 'absolute', left: x - 28, top: 6, width: 0, height: 0, borderLeft: '28px solid transparent', borderRight: '28px solid transparent', borderTop: `40px solid ${N}`}} />
			{labels ? (
				<>
					<div style={{position: 'absolute', left: 20, top: 128, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>rejet</div>
					<div style={{position: 'absolute', left: width / 2, top: 128, transform: 'translateX(-50%)', fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: LPI.blue}}>efficace</div>
					<div style={{position: 'absolute', right: 20, top: 128, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>toxique</div>
				</>
			) : null}
		</div>
	);
};

/** Pamplemousse coupé (vraies couleurs : objet réel). */
const Grapefruit: React.FC<{size?: number}> = ({size = 220}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={44} fill="#F2A33A" stroke={N} strokeWidth={4} />
		<circle cx={50} cy={50} r={37} fill="#F7E3C4" />
		<circle cx={50} cy={50} r={33} fill="#F0717A" />
		{[...Array(10)].map((_, i) => {
			const a = (i / 10) * Math.PI * 2;
			return <line key={i} x1={50} y1={50} x2={50 + Math.cos(a) * 33} y2={50 + Math.sin(a) * 33} stroke="#F7E3C4" strokeWidth={2.5} />;
		})}
		<circle cx={50} cy={50} r={4} fill="#F7E3C4" />
	</svg>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const REIN = at('intro', 'rein');
	const ANTI = at('intro', "l'anti-rejet");
	const VIE = at('intro', 'vie');
	const BAS = at('intro', 'bas');
	const REJ = at('intro', 'rejette');
	const HAUT = at('intro', 'haut');
	const ABIME = at('intro', 'abîme');
	const v = frame < BAS - 4 ? 0.5 + 0.08 * Math.sin(frame / 6) : frame < HAUT - 4 ? interpolate(frame, [BAS - 4, BAS + 8], [0.5, 0.1], ease) : interpolate(frame, [HAUT - 4, HAUT + 8], [0.1, 0.9], ease);
	const attack = frame >= REJ - 4 && frame < HAUT - 4 ? interpolate(frame, [REJ - 4, REJ + 12], [0, 1], ease) : 0;
	const hurt = frame >= ABIME - 4 ? interpolate(frame, [ABIME - 4, ABIME + 10], [0, 1], clamp) : 0;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[]} />
			<Camera punches={[REIN + 1, ANTI + 1, BAS + 1, REJ + 1, HAUT + 1, ABIME + 1]} shakes={[REJ + 3, ABIME + 3]} strength={0.03}>
				<Big from={-60} text={'Les\n*anti-rejet*'} size={110} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 540, top: 780, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 12) * 3}deg)`}}>
							<Graft size={380} hurt={hurt} />
						</div>
					)}
				/>
				{[0, 1, 2].map((i) => {
					const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
					const r = 330 - 120 * attack;
					return attack > 0 ? (
						<div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r - 60, top: 780 + Math.sin(a) * r * 0.8 - 60}}>
							<Defender size={120} />
						</div>
					) : null;
				})}
				<Chip at={ANTI - 2} to={BAS - 4} x={540} y={1050} tone={LPI.blue} size={44}>
					💊 à vie
				</Chip>
				<div style={{position: 'absolute', left: 90, top: 1150}}>
					<Window v={v} />
				</div>
				<Stamp at={REJ} x={300} y={1420} text="REJET" size={80} />
				<Stamp at={ABIME} x={780} y={1420} text="TOXIQUE" size={80} />
				{VIE > 0 ? null : null}
			</Camera>
			<Sfx name="pop" at={REIN} volume={0.18} />
			<Sfx name="pop" at={ANTI} volume={0.18} />
			<Sfx name="stamp" at={REJ} volume={0.4} />
			<Sfx name="stamp" at={ABIME} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · POURQUOI ═══════════════════════════════ */
export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('pourquoi', 'un');
	const DEF = at('pourquoi', 'défenses');
	const INTRUS = at('pourquoi', 'intrus');
	const FREINE = at('pourquoi', 'freine');
	const IMMU = at('pourquoi', 'immunosuppresseur');
	const near = interpolate(frame, [DEF - 4, INTRUS + 6], [0, 1], ease);
	const calm = interpolate(frame, [FREINE - 2, FREINE + 14], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[UN, 1]]} />
			<Camera punches={[DEF + 1, INTRUS + 1, FREINE + 1, IMMU + 1]} strength={0.03}>
				<Big from={UN - 2} text={'*Pourquoi* ?'} size={116} y={330} />
				<div style={{position: 'absolute', left: 540, top: 820, transform: 'translate(-50%, -50%)'}}>
					<Graft size={340} />
				</div>
				{[0, 1, 2, 3].map((i) => {
					if (frame < DEF - 4) return null;
					const a = (i / 4) * Math.PI * 2 + 0.4;
					const r = 380 - 150 * near + 120 * calm;
					return (
						<div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r - 60, top: 820 + Math.sin(a) * r * 0.75 - 60, transform: `scale(${popAt(frame, DEF - 4 + i * 3) * (1 - 0.3 * calm)})`, opacity: 1 - 0.5 * calm}}>
							<Defender size={120} angry={1 - calm} />
						</div>
					);
				})}
				<Chip at={DEF} to={INTRUS - 4} x={540} y={1150} size={40}>
					les défenses du corps
				</Chip>
				<Chip at={INTRUS - 2} to={FREINE - 4} x={540} y={1150} tone={LPI.pink} size={52}>
					« un intrus ! »
				</Chip>
				<Pop at={FREINE - 2} x={540} y={1170}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 30px', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<PillIcon size={80} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N}}>l'anti-rejet freine</div>
					</div>
				</Pop>
				<Note at={IMMU - 4} y={1290} size={44} tone={LPI.blue}>
					= immunosuppresseur
				</Note>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="whoosh" at={DEF} volume={0.15} />
			<Sfx name="buzz" at={INTRUS} volume={0.15} />
			<Sfx name="ding" at={IMMU} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LESQUELS ═══════════════════════════════ */
export const Lesquels: React.FC = () => {
	const DEUX = at('lesquels', 'deux');
	const CICLO = at('lesquels', 'ciclosporine');
	const TACRO = at('lesquels', 'tacrolimus');
	const EVERO = at('lesquels', "l'évérolimus");
	const SANG = at('lesquels', 'sang');
	const TUBE = at('lesquels', 'tube');
	const mols = [
		{t: CICLO, name: 'ciclosporine'},
		{t: TACRO, name: 'tacrolimus'},
		{t: EVERO, name: 'évérolimus'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 1], [DEUX, 2]]} />
			<Camera punches={[CICLO + 1, TACRO + 1, EVERO + 1, SANG + 1, TUBE + 1]} strength={0.03}>
				<Big from={DEUX - 2} text={'On dose\n*lesquels* ?'} size={106} y={330} />
				{mols.map((m, i) => (
					<RowCard key={m.name} at={m.t - 4} y={600 + i * 190} h={170} badge={<PillIcon size={60} />} badgeTone={LPI.sky} title={m.name} size={54} />
				))}
				<Pop at={SANG - 4} x={250} y={1350}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 7) * 5}deg)`}}><Tube size={100} cap={VIOLET} label="EDTA" level={0.72} /></div>} />
				</Pop>
				<Chip at={SANG} x={680} y={1300} tone={LPI.paper} size={40}>
					dans le sang entier
				</Chip>
				<Chip at={TUBE - 2} x={680} y={1410} tone={LPI.blue} size={44}>
					→ le tube violet
				</Chip>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			{mols.map((m) => (
				<Sfx key={m.name} name="whoosh" at={m.t - 4} volume={0.15} />
			))}
			<Sfx name="ding" at={TUBE} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LA MARGE ÉTROITE ═══════════════════════════════ */
export const Marge: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('marge', 'trois');
	const MARGE = at('marge', 'marge');
	const ETR = at('marge', 'étroite');
	const BAS = at('marge', 'bas');
	const REJ = at('marge', 'rejet');
	const HAUT = at('marge', 'haut');
	const TOX = at('marge', 'toxiques');
	const REINS = at('marge', 'reins');
	const MAINS = at('marge', 'mains');
	const INF = at('marge', 'infections');
	const v = frame < BAS - 4 ? 0.5 + 0.05 * Math.sin(frame / 5) : frame < HAUT - 4 ? interpolate(frame, [BAS - 4, BAS + 8], [0.5, 0.12], ease) : interpolate(frame, [HAUT - 4, HAUT + 8], [0.12, 0.88], ease);
	const tox = [
		{t: REINS, node: <KidneysIcon size={110} />, label: 'reins'},
		{t: MAINS, node: <TremorIcon size={100} />, label: 'tremblements'},
		{t: INF, node: <Microbe size={100} tone={LPI.pink} />, label: 'infections'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 2], [TROIS, 3]]} />
			<Camera punches={[MARGE + 1, ETR + 1, REJ + 1, TOX + 1]} strength={0.03}>
				<Big from={MARGE - 4} text={'Une marge\n*étroite*'} size={106} y={330} />
				<Pop at={MARGE + 4} x={540} y={700}>
					<Window v={v} />
				</Pop>
				<Chip at={REJ - 4} to={TOX - 6} x={300} y={900} tone={LPI.pink} size={44}>
					risque de rejet
				</Chip>
				<Chip at={TOX - 4} x={780} y={900} tone={LPI.pink} size={44}>
					toxique
				</Chip>
				{tox.map((c, i) => (
					<Pop key={c.label} at={c.t - 4} x={220 + i * 320} y={1130}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<div style={{width: 190, height: 190, borderRadius: 95, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{c.node}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>{c.label}</div>
						</div>
					</Pop>
				))}
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="buzz" at={REJ} volume={0.15} />
			<Sfx name="buzz" at={TOX} volume={0.15} />
			{tox.map((c) => (
				<Sfx key={c.label} name="pop" at={c.t - 4} volume={0.15} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LE BON MOMENT ═══════════════════════════════ */
export const Moment: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('moment', 'quatre');
	const PREL = at('moment', 'prélève');
	const AVANT = at('moment', 'avant');
	const TAUX = at('moment', 'taux');
	const NOTES = at('moment', 'notes');
	const DERN = at('moment', 'dernière');
	const W = 900;
	const H = 380;
	// taux dans le sang : il monte après chaque prise (8 h, 20 h) puis redescend ; le creux = juste avant la prise
	const pts: string[] = [];
	const draw = interpolate(frame, [PREL - 6, AVANT + 10], [0, 1], ease);
	for (let i = 0; i <= 120; i++) {
		const t = i / 120;
		if (t > draw) break;
		const ph = (t * 2) % 1;
		const c = ph < 0.12 ? 0.25 + (ph / 0.12) * 0.65 : 0.9 - ((ph - 0.12) / 0.88) * 0.65;
		pts.push(`${50 + t * (W - 100)},${H - 50 - c * (H - 110)}`);
	}
	const troughX = 50 + 0.5 * (W - 100);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} />
			<Camera punches={[PREL + 1, AVANT + 1, TAUX + 1, NOTES + 1]} strength={0.03}>
				<Big from={PREL - 6} text={'Le bon\n*moment*'} size={106} y={330} />
				<Pop at={PREL - 6} x={540} y={800}>
					<svg width={W} height={H} style={{overflow: 'visible'}}>
						<rect x={0} y={0} width={W} height={H} rx={30} fill={LPI.paper} stroke={N} strokeWidth={6} />
						<polyline points={pts.join(' ')} fill="none" stroke={LPI.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
						{[0, 0.5].map((t, i) => (
							<g key={i} transform={`translate(${50 + t * (W - 100)} ${H - 18})`}>
								<circle r={16} fill={LPI.pink} stroke={N} strokeWidth={4} />
								<text y={-28} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill={N}>
									prise
								</text>
							</g>
						))}
						{frame >= AVANT - 2 ? (
							<g transform={`translate(${troughX - 30} ${H - 64}) scale(${popAt(frame, AVANT - 2)})`}>
								<path d="M0 -150 V-30" stroke={N} strokeWidth={8} strokeLinecap="round" />
								<path d="M-18 -50 L0 -26 L18 -50" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
								<text y={-166} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
									on prélève ici
								</text>
							</g>
						) : null}
					</svg>
				</Pop>
				<Chip at={TAUX - 2} x={540} y={1080} tone={LPI.pink} size={52}>
					= le taux résiduel
				</Chip>
				<Pop at={NOTES - 4} x={540} y={1300}>
					<div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 34px', borderRadius: 40, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64}}>🕗</div>
						<Live
							render={(f) => (
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.paper, lineHeight: 1.15, whiteSpace: 'nowrap'}}>
									dernière prise : <span style={{color: LPI.pink, opacity: f >= DERN ? 1 : 0}}>20 h</span>
									<br />
									prélèvement : <span style={{color: LPI.sky}}>8 h</span>
								</div>
							)}
						/>
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={PREL - 6} volume={0.15} />
			<Sfx name="ding" at={AVANT} volume={0.2} />
			<Sfx name="pop" at={NOTES - 4} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN : PAMPLEMOUSSE + SÉRIE TERMINÉE ═══════════════════════════════ */
const SERIES = ['NFS 1/2 · globules rouges', 'NFS 2/2 · blancs + plaquettes', 'HbA1c', 'groupe + RAI', 'charge virale', 'anti-rejet'];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const BONUS = at('fin', 'bonus');
	const PAMP = at('fin', 'pamplemousse');
	const MONTER = at('fin', 'monter');
	const VOILA = at('fin', 'voilà');
	const TOUS = at('fin', 'tous');
	const VIOLET_W = at('fin', 'violet');
	const out = interpolate(frame, [VOILA - 6, VOILA + 6], [0, 1], ease);
	const checked = frame >= TOUS ? Math.min(6, 1 + Math.floor((frame - TOUS) / 4)) : 0;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 4]]} done />
			<Camera punches={[PAMP + 1, MONTER + 1, VOILA + 1, VIOLET_W + 1]} strength={0.025}>
				<Big from={BONUS - 4} to={VOILA - 8} text={'Petit *bonus*'} size={110} y={330} />
				<Pop at={PAMP - 6} to={VOILA - 8} x={360} y={800}>
					<Live render={(f) => <div style={{transform: `rotate(${f * 0.8}deg)`}}><Grapefruit size={320} /></div>} />
				</Pop>
				<Pop at={MONTER - 4} to={VOILA - 8} x={780} y={800}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 150, color: N, lineHeight: 1, transform: `translateY(${-10 * Math.sin(f / 3)}px)`}}>↑</div>} />
						<div style={{padding: '8px 24px', borderRadius: 999, background: LPI.pink, border: `6px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N}}>leur taux</div>
					</div>
				</Pop>
				{/* série terminée */}
				{out > 0 ? (
					<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: out}}>
						<div style={{position: 'absolute', left: 60, top: 300, width: 960, fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: N, lineHeight: 1.05}}>
							Le tube <span style={{color: LPI.blue}}>violet</span>
							<br />
							<span style={{fontSize: 64, color: LPI.blue}}>série terminée !</span>
						</div>
						{SERIES.map((s, i) => (
							<div key={s} style={{position: 'absolute', left: 90, top: 560 + i * 125, width: 900, height: 105, boxSizing: 'border-box', borderRadius: 30, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px'}}>
								<div style={{width: 22, height: 34, borderRadius: 6, background: VIOLET, border: `4px solid ${N}`}} />
								<div style={{flex: 1, fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N}}>{s}</div>
								<div style={{width: 56, height: 56, borderRadius: 28, background: i < checked ? LPI.blue : LPI.paper, border: `5px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 32}}>{i < checked ? '✓' : ''}</div>
							</div>
						))}
					</div>
				) : null}
				<Confetti at={VIOLET_W} />
			</Camera>
			<Sfx name="pop" at={PAMP} volume={0.18} />
			<Sfx name="ding" at={MONTER} volume={0.18} />
			<Sfx name="whoosh" at={VOILA - 6} volume={0.15} />
			{SERIES.map((s, i) => (
				<Sfx key={s} name="pop" at={TOUS + i * 4} volume={0.14} />
			))}
			<Sfx name="ding" at={VIOLET_W} volume={0.25} />
		</AbsoluteFill>
	);
};
