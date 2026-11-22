// « L'HbA1c » (n° 69, série « le tube violet », directives Instagram du 20/11/2026) : sujet + enjeu dès l'image 0
// (« L'HbA1c : le film de 3 mois », compteur 0/4, la photo de la glycémie). Image qui fait retenir : la glycémie est une
// photo, l'hémoglobine glyquée le film des 3 derniers mois. 1 · le sucre se colle à l'hémoglobine ; 2 · pourquoi 3 mois
// (globule rouge ≈ 120 jours) ; 3 · objectifs (texte du propriétaire : type 2 < 7 %, type 1 7 – 7,5 %), complications ;
// 4 · pas besoin d'être à jeun, contrôle ≈ tous les 3 mois pour ajuster le traitement. Pas d'appel à l'action.
// Sources : HAS, « Stratégie médicamenteuse du contrôle glycémique du diabète de type 2 » (2013, cible ≤ 7 % en général) ;
// HAS, guide parcours diabète de type 2 (HbA1c tous les 3 mois) ; objectifs type 1 : texte du propriétaire (SFD / ISPAD).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, FlatBg, Live, Note, popAt, RowCard, ease} from '../../brand/bold';
import {GlycatedCell, InsulinPen, KidneysIcon, Plate} from '../../brand/diabetes';
import {Glucometer} from '../../brand/glyco';
import {EyeIcon} from '../../brand/icons';
import {FootTop} from '../../brand/injury';
import {Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {BLOOD, CAP, SugarCube} from '../../brand/tubes';
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
		LE TUBE VIOLET · HbA1c
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

/** La « photo » : un polaroid avec le lecteur de glycémie (un seul instant). */
const PhotoCard: React.FC<{flash?: number; scale?: number}> = ({flash = 0, scale = 1}) => (
	<div style={{position: 'relative', width: 400 * scale, padding: 20 * scale, paddingBottom: 70 * scale, boxSizing: 'border-box', background: '#fff', border: `6px solid ${N}`, borderRadius: 18, boxShadow: SHADOW}}>
		<div style={{height: 230 * scale, borderRadius: 10, background: LPI.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
			<div style={{transform: `scale(${0.62 * scale})`}}>
				<Glucometer value={1.05} strip={1} blood={1} tone={null} beep={0} />
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 14 * scale, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40 * scale, color: N}}>glycémie</div>
		<div style={{position: 'absolute', inset: 0, borderRadius: 14, background: '#fff', opacity: flash}} />
	</div>
);

/** Le « film » : une pellicule de 3 images (mois 1 · 2 · 3), le sucre qui s'accumule. */
const FilmStrip: React.FC<{width?: number; lit?: number; shift?: number}> = ({width = 900, lit = 3, shift = 0}) => {
	const h = width * 0.3;
	return (
		<div style={{position: 'relative', width, height: h, borderRadius: 18, background: N, overflow: 'hidden', boxShadow: SHADOW}}>
			{[...Array(14)].map((_, i) => (
				<React.Fragment key={i}>
					<div style={{position: 'absolute', left: ((i * width) / 13 + shift) % (width + 40) - 20, top: h * 0.05, width: width * 0.035, height: h * 0.08, borderRadius: 4, background: LPI.paper}} />
					<div style={{position: 'absolute', left: ((i * width) / 13 + shift) % (width + 40) - 20, bottom: h * 0.05, width: width * 0.035, height: h * 0.08, borderRadius: 4, background: LPI.paper}} />
				</React.Fragment>
			))}
			{[0, 1, 2].map((k) => (
				<div key={k} style={{position: 'absolute', left: width * (0.04 + k * 0.32), top: h * 0.2, width: width * 0.28, height: h * 0.6, borderRadius: 10, background: k < lit ? LPI.paper : alpha(LPI.paper, 0.25), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
					{k < lit ? (
						<>
							<GlycatedCell width={width * 0.12} coat={0.35 + k * 0.3} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: width * 0.04, color: N}}>mois {k + 1}</div>
						</>
					) : null}
				</div>
			))}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const PHOTO = at('intro', 'photo');
	const HB = at('intro', "l'hémoglobine");
	const FILM = at('intro', 'film');
	const TROIS = at('intro', 'trois');
	const MOIS = at('intro', 'mois');
	const DIAB = at('intro', 'diabétique');
	const TRAIT = at('intro', 'traitement');
	const flash = frame >= PHOTO - 2 ? interpolate(frame, [PHOTO - 2, PHOTO + 2, PHOTO + 12], [0, 1, 0], clamp) : 0;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[]} />
			<Camera punches={[PHOTO + 1, FILM + 1, MOIS + 1, TRAIT + 1]} strength={0.03}>
				<Big from={-60} text={"*L'HbA1c* :\nle film de\n*3* *mois*"} size={104} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 300, top: 860, transform: `translate(-50%, -50%) rotate(${-5 + Math.sin(f / 12) * 2}deg)`}}>
							<PhotoCard flash={flash} scale={0.95} />
						</div>
					)}
				/>
				<Chip at={PHOTO} x={760} y={760} size={40}>
					📸 = un instant
				</Chip>
				<Live
					render={(f) => {
						if (f < FILM - 6) return null;
						const k = interpolate(f, [FILM - 6, FILM + 8], [0, 1], ease);
						const lit = f >= MOIS - 4 ? 3 : f >= TROIS ? 1 + Math.floor((f - TROIS) / 5) : 0;
						return (
							<div style={{position: 'absolute', left: 540 + (1 - k) * 900, top: 1260, transform: 'translate(-50%, -50%)'}}>
								<FilmStrip width={940} lit={Math.min(3, lit)} shift={f * 2} />
							</div>
						);
					}}
				/>
				<Chip at={HB - 2} to={DIAB - 4} x={760} y={1060} tone={LPI.pink} size={38}>
					hémoglobine glyquée
				</Chip>
				<Pop at={DIAB} x={720} y={1520}>
					<InsulinPen width={380} />
				</Pop>
				<Chip at={TRAIT - 4} x={330} y={1530} tone={LPI.blue} size={36}>
					guide le traitement
				</Chip>
			</Camera>
			<Sfx name="ding" at={PHOTO - 2} volume={0.2} />
			<Sfx name="whoosh" at={FILM - 6} volume={0.18} />
			<Sfx name="pop" at={MOIS} volume={0.18} />
			<Sfx name="pop" at={DIAB} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · C'EST QUOI ═══════════════════════════════ */
export const Quoi: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('quoi', 'un');
	const SUCRE = at('quoi', 'sucre');
	const COLLE = at('quoi', 'colle');
	const HB = at('quoi', "l'hémoglobine");
	const GR = at('quoi', 'globules');
	const COLLE2 = at('quoi', 'colle', 2);
	const GLYQ = at('quoi', 'glyquée');
	const coat = interpolate(frame, [COLLE, HB + 20, COLLE2, COLLE2 + 14], [0, 0.6, 0.6, 1], clamp);
	const cubes = [
		[-330, -160],
		[340, -120],
		[-300, 190],
		[320, 210],
		[0, -280],
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[UN, 1]]} />
			<Camera punches={[SUCRE + 1, COLLE + 1, HB + 1, GLYQ + 1]} strength={0.03}>
				<Big from={UN - 2} text={"C'est *quoi* ?"} size={110} y={330} />
				<Pop at={SUCRE - 6} x={540} y={900}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 10) * 4}deg)`}}><GlycatedCell width={440} coat={coat} /></div>} />
				</Pop>
				{cubes.map(([dx, dy], i) => (
					<Live
						key={i}
						render={(f) => {
							const t0 = SUCRE + i * 4;
							if (f < t0) return null;
							const k = interpolate(f, [t0, COLLE + 10 + i * 4], [0, 1], {...clamp, easing: (t) => t * t});
							if (k >= 1) return null;
							return (
								<div style={{position: 'absolute', left: 540 + dx * (1.4 - k * 1.2), top: 900 + dy * (1.4 - k * 1.2), transform: `translate(-50%, -50%) rotate(${f * 3 + i * 30}deg) scale(${popAt(f, t0)})`}}>
									<SugarCube size={70} />
								</div>
							);
						}}
					/>
				))}
				<Chip at={SUCRE} to={COLLE2 - 6} x={250} y={560} size={40}>
					sucre du sang
				</Chip>
				<Chip at={HB} to={COLLE2 - 6} x={800} y={1220} tone={LPI.paper} size={36}>
					hémoglobine du globule rouge
				</Chip>
				<Chip at={GLYQ - 6} x={540} y={1230} tone={LPI.pink} size={52}>
					= hémoglobine glyquée
				</Chip>
				<Note at={GLYQ + 6} y={1320} size={40}>
					HbA1c
				</Note>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="whoosh" at={SUCRE} volume={0.15} />
			<Sfx name="pop" at={COLLE + 8} volume={0.15} />
			<Sfx name="ding" at={GLYQ} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · POURQUOI 3 MOIS ═══════════════════════════════ */
export const Mois: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('mois', 'deux');
	const GR = at('mois', 'globule');
	const VIT = at('mois', 'vit');
	const JOURS = at('mois', 'jours');
	const GARDE = at('mois', 'garde');
	const BOUT = at('mois', 'bout');
	const REFL = at('mois', 'reflète');
	const MOY = at('mois', 'moyenne');
	const X0 = 130;
	const X1 = 950;
	const p = interpolate(frame, [VIT - 4, BOUT + 6], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 1], [DEUX, 2]]} />
			<Camera punches={[GR + 1, JOURS + 1, BOUT + 1, MOY + 1]} strength={0.03}>
				<Big from={DEUX - 2} text={'Pourquoi\n*3* *mois* ?'} size={106} y={330} />
				<Live
					render={(f) => {
						if (f < GR - 4) return null;
						return (
							<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: fadeIn(f, GR - 4, 8)}}>
								<div style={{position: 'absolute', left: X0, width: X1 - X0, top: 1000, height: 18, borderRadius: 9, background: N}} />
								{[0, 30, 60, 90, 120].map((d, i) => (
									<React.Fragment key={d}>
										<div style={{position: 'absolute', left: X0 + (i / 4) * (X1 - X0) - 4, top: 985, width: 8, height: 48, borderRadius: 4, background: N}} />
										<div style={{position: 'absolute', left: X0 + (i / 4) * (X1 - X0), top: 1050, transform: 'translateX(-50%)', fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>{d} j</div>
									</React.Fragment>
								))}
								{/* le globule rouge avance et garde son sucre */}
								<div style={{position: 'absolute', left: X0 + p * (X1 - X0), top: 880, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 6) * 6}deg)`}}>
									<GlycatedCell width={180} coat={0.15 + 0.85 * p} />
								</div>
								{/* les 2 – 3 derniers mois */}
								{f >= MOY - 6 ? (
									<div style={{position: 'absolute', left: X0 + 0.25 * (X1 - X0), width: 0.75 * (X1 - X0), top: 1110, height: 26, borderRadius: 13, background: LPI.pink, border: `5px solid ${N}`, transform: `scaleX(${interpolate(f, [MOY - 6, MOY + 8], [0, 1], ease)})`, transformOrigin: 'right'}} />
								) : null}
							</div>
						);
					}}
				/>
				<Chip at={JOURS - 8} x={540} y={620} tone={LPI.pink} size={52}>
					≈ 120 jours de vie
				</Chip>
				<Note at={GARDE} to={REFL - 4} y={1220} size={40}>
					il garde son sucre jusqu'au bout
				</Note>
				<Chip at={MOY - 4} x={540} y={1260} tone={LPI.blue} size={42}>
					= moyenne des 2 – 3 derniers mois
				</Chip>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="whoosh" at={VIT} volume={0.15} />
			<Sfx name="ding" at={JOURS} volume={0.18} />
			<Sfx name="pop" at={MOY} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · L'OBJECTIF ═══════════════════════════════ */
const ObjCard: React.FC<{rows: string[][]}> = ({rows}) => (
	<div style={{width: 900, boxSizing: 'border-box', borderRadius: 30, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20}}>
		<div style={{padding: '8px 16px', borderRadius: 999, background: LPI.pink, border: `4px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.08em', color: N, whiteSpace: 'nowrap'}}>OBJECTIF</div>
		<div style={{flex: 1, minHeight: 120}}>
			{rows.map(([who, v]) => (
				<div key={who} style={{display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N, lineHeight: 1.2}}>
					<span style={{fontFamily: FONT.body, fontSize: 34, color: alpha(N, 0.75), minWidth: 170}}>{who}</span>
					<span>{v}</span>
				</div>
			))}
		</div>
	</div>
);

export const Objectif: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('objectif', 'trois');
	const OBJ = at('objectif', "l'objectif");
	const T2 = at('objectif', 'deux');
	const T1 = at('objectif', 'un');
	const MONTE = at('objectif', 'monte');
	const COMPL = at('objectif', 'complications');
	const val = interpolate(frame, [MONTE - 4, MONTE + 24], [6.6, 9.2], ease);
	const SX = (v: number) => 110 + ((v - 5) / 6) * 860;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 2], [TROIS, 3]]} />
			<Camera punches={[OBJ + 1, T2 + 1, T1 + 1, MONTE + 1, COMPL + 1]} strength={0.03}>
				<Big from={OBJ - 4} text={"*L'objectif*"} size={110} y={330} />
				<Pop at={T2 - 8} x={540} y={640}>
					<Live render={(f) => <ObjCard rows={[['Type 2', '< 7 %'], ['Type 1', '7 – 7,5 %']].filter((_, i) => f >= (i ? T1 : T2) - 4)} />} />
				</Pop>
				{/* échelle 5 → 11 % : zone visée, puis la valeur qui monte */}
				<Live
					render={(f) => {
						if (f < OBJ + 6) return null;
						return (
							<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: fadeIn(f, OBJ + 6, 10)}}>
								<div style={{position: 'absolute', left: SX(5), width: SX(7.5) - SX(5), top: 900, height: 60, borderRadius: '30px 0 0 30px', background: LPI.sky, border: `5px solid ${N}`}} />
								<div style={{position: 'absolute', left: SX(7.5), width: SX(11) - SX(7.5), top: 900, height: 60, borderRadius: '0 30px 30px 0', background: LPI.pink, border: `5px solid ${N}`}} />
								{[5, 6, 7, 8, 9, 10, 11].map((v) => (
									<div key={v} style={{position: 'absolute', left: SX(v), top: 975, transform: 'translateX(-50%)', fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>{v} %</div>
								))}
								<div style={{position: 'absolute', left: SX(val), top: 860, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderTop: `36px solid ${N}`}} />
							</div>
						);
					}}
				/>
				<Chip at={MONTE} x={540} y={1100} tone={LPI.pink} size={44}>
					risque de complications ↑
				</Chip>
				{[
					{node: <EyeIcon size={120} />, x: 260},
					{node: <KidneysIcon size={130} />, x: 540},
					{node: <FootTop width={110} />, x: 820},
				].map((c, i) => (
					<Pop key={i} at={COMPL + i * 5} x={c.x} y={1290}>
						<div style={{width: 200, height: 200, borderRadius: 100, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{c.node}</div>
					</Pop>
				))}
				<Note at={COMPL + 18} y={1430} size={32}>
					yeux · reins · pieds
				</Note>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="pop" at={T2} volume={0.18} />
			<Sfx name="pop" at={T1} volume={0.18} />
			<Sfx name="buzz" at={MONTE + 4} volume={0.15} />
			<Sfx name="pop" at={COMPL} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · EN PRATIQUE ═══════════════════════════════ */
const Calendar: React.FC<{size?: number}> = ({size = 170}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={8} y={16} width={84} height={76} rx={12} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<rect x={8} y={16} width={84} height={20} rx={10} fill={LPI.pink} stroke={N} strokeWidth={5} />
		<path d="M28 8 V24 M72 8 V24" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<text x={50} y={74} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>
			3 m
		</text>
	</svg>
);

export const Pratique: React.FC = () => {
	const QUATRE = at('pratique', 'quatre');
	const PRAT = at('pratique', 'pratique');
	const PAS = at('pratique', 'pas');
	const CONTR = at('pratique', 'contrôle');
	const MOIS = at('pratique', 'mois');
	const AJ = at('pratique', 'ajuster');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} />
			<Camera punches={[PAS + 1, CONTR + 1, AJ + 1]} strength={0.03}>
				<Big from={PRAT - 4} text={'En *pratique*'} size={110} y={330} />
				<RowCard at={PAS - 4} y={540} h={260} badge="✓" badgeTone={LPI.sky} title="pas besoin d'être à jeun" sub="on peut avoir mangé" subAt={PAS + 12} art={200} size={50}>
					<Plate size={180} />
				</RowCard>
				<RowCard at={CONTR - 4} y={840} h={260} badge="↻" badgeTone={LPI.sky} title="tous les 3 mois" sub="environ" subAt={MOIS} art={200} size={50}>
					<Calendar size={180} />
				</RowCard>
				<Pop at={AJ - 4} x={540} y={1260}>
					<div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 34px', borderRadius: 40, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<InsulinPen width={200} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: LPI.paper, whiteSpace: 'nowrap'}}>
							→ ajuster le <span style={{color: LPI.pink}}>traitement</span>
						</div>
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={PAS - 4} volume={0.15} />
			<Sfx name="whoosh" at={CONTR - 4} volume={0.15} />
			<Sfx name="ding" at={AJ} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const GLY = at('fin', 'glycémie');
	const INST = at('fin', "l'instant");
	const HB = at('fin', "l'hémoglobine");
	const MOIS = at('fin', 'mois');
	const PROCH = at('fin', 'prochaine');
	const GROUPE = at('fin', 'groupe');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 4]]} done />
			<Camera punches={[GLY + 1, HB + 1, MOIS + 1, PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'Photo\nou *film* ?'} size={110} y={190} />
				<Pop at={GLY - 4} x={290} y={760}>
					<div style={{transform: 'rotate(-4deg)'}}>
						<PhotoCard scale={0.8} />
					</div>
				</Pop>
				<Chip at={INST - 2} x={290} y={1000} tone={LPI.paper} size={40}>
					l'instant
				</Chip>
				<Pop at={HB - 4} x={760} y={760}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>HbA1c</div>
						<Live render={(f) => <FilmStrip width={420} shift={f * 2} />} />
					</div>
				</Pop>
				<Chip at={MOIS - 4} x={760} y={1000} tone={LPI.pink} size={40}>
					3 mois
				</Chip>
				<Confetti at={MOIS} />
				<Pop at={PROCH - 2} x={540} y={1290}>
					<div style={{width: 900, boxSizing: 'border-box', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: LPI.sky}}>PROCHAINE VIDÉO</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: LPI.paper, lineHeight: 1.1}}>
								le groupe <span style={{color: LPI.pink}}>sanguin</span>
							</div>
						</div>
						<Live
							render={(f) => (
								<svg width={130} height={150} viewBox="0 0 100 120" style={{transform: `scale(${f >= GROUPE ? popAt(f, GROUPE) : 0.0001})`}}>
									<path d="M50 6 C70 40 90 60 90 82 A40 38 0 0 1 10 82 C10 60 30 40 50 6 Z" fill={BLOOD} stroke={LPI.paper} strokeWidth={5} />
									<text x={50} y={96} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={LPI.paper}>
										ABO
									</text>
								</svg>
							)}
						/>
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={GLY} volume={0.18} />
			<Sfx name="pop" at={HB} volume={0.18} />
			<Sfx name="ding" at={MOIS} volume={0.22} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
