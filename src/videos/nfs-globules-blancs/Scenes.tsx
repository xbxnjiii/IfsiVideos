// « La NFS 2/2 : globules blancs et plaquettes » (n° 68, série « le tube violet », directives Instagram du 20/11/2026) :
// le sujet et l'enjeu dès l'image 0 (titre, compteur 0/7, tube violet, fiche de 7 lignes), ≈ 59 s, 1re info clé avant 15 s.
// Les 7 lignes : plaquettes, leucocytes, PNN, PNE, PNB, lymphocytes, monocytes, chacune avec ses normes adultes (tableau
// fourni par le propriétaire). Correction faite dans le texte fourni : c'est l'EXCÈS de lymphocytes (lymphocytose) qui
// fait penser d'abord à un virus. Fin : récap + « prochaine vidéo : l'hémoglobine glyquée ». Pas d'appel à l'action.
// Sources : tableau de normes du propriétaire (adulte) ; ANSM / HAS (thrombopénie < 150 000 / mm³) ; référentiel
// d'hématologie (lymphocytose et infections virales).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, FlatBg, Live, Note, popAt, RowCard, ease} from '../../brand/bold';
import {GlycatedCell} from '../../brand/diabetes';
import {Microbe} from '../../brand/hands';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {BLOOD, CAP, NormCard, Platelet, Tube, WhiteCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const VIOLET = CAP.edta;
const NORM_Y = 1390;

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

const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number}> = ({at: t0, to, up = true, x, y, size = 110}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: `translateY(${(up ? -1 : 1) * 10 * Math.sin(f / 3)}px)`}}>{up ? '↑' : '↓'}</div>} />
	</Pop>
);

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const Norms: React.FC<{at: number; to?: number; rows: string[][]; note?: string; y?: number}> = ({at: t0, to, rows, note, y = NORM_Y}) => (
	<Pop at={t0} to={to} x={540} y={y}>
		<NormCard rows={rows} note={note} />
	</Pop>
);

const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 18, height: 24, borderRadius: 5, background: VIOLET, border: `3px solid ${N}`}} />
		LE TUBE VIOLET · NFS 2/2
	</div>
);

/** Compteur « n / 7 » ; `steps` = [image, n] : il passe à n et rebondit sur le mot du numéro. */
const Counter: React.FC<{steps: [number, number][]; done?: boolean}> = ({steps, done}) => {
	const frame = useCurrentFrame();
	let n = 0;
	let bump = -100;
	for (const [t, v] of steps) if (frame >= t) [n, bump] = [v, t];
	const s = frame >= bump && frame < bump + 20 ? 1 + 0.15 * Math.sin(((frame - bump) / 20) * Math.PI) : 1;
	return (
		<div style={{position: 'absolute', left: 900, top: 250, transform: `translate(-50%, -50%) scale(${s})`, padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{n} / 7
		</div>
	);
};

const ROWS = ['Plaquettes', 'Leucocytes', 'PNN', 'PNE', 'PNB', 'Lymphocytes', 'Monocytes'];
const WhiteSheet: React.FC<{hl?: number; checked?: number; width?: number; big?: boolean}> = ({hl = -1, checked = 0, width = 500, big = false}) => (
	<div style={{width, boxSizing: 'border-box', borderRadius: 30, background: '#fff', border: `6px solid ${N}`, boxShadow: SHADOW, padding: '16px 20px'}}>
		<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: big ? 28 : 22, letterSpacing: '0.12em', color: alpha(N, 0.7)}}>NFS · BLANCS + PLAQUETTES</div>
		{ROWS.map((r, i) => (
			<div key={r} style={{marginTop: big ? 10 : 7, height: big ? 70 : 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderRadius: 14, background: i === hl ? alpha(LPI.pink, 0.85) : alpha(LPI.sky, i % 2 ? 0.25 : 0.5)}}>
				<div style={{flex: 1, fontFamily: FONT.body, fontWeight: 900, fontSize: big ? 40 : 30, color: N}}>{r}</div>
				{i < checked ? (
					<div style={{width: big ? 50 : 38, height: big ? 50 : 38, borderRadius: 30, background: LPI.blue, border: `4px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: big ? 30 : 22}}>✓</div>
				) : (
					<div style={{width: big ? 110 : 80, height: 12, borderRadius: 6, background: alpha(N, 0.25)}} />
				)}
			</div>
		))}
	</div>
);

/** Carte « famille de globules blancs » : badge, nom, rôle, normes. */
const FamCard: React.FC<{at: number; y: number; badge: React.ReactNode; title: string; sub: React.ReactNode; subAt: number; kind: 'pnn' | 'eo' | 'baso' | 'lympho' | 'mono'; norm: string; h?: number}> = ({at: t0, y, badge, title, sub, subAt, kind, norm, h = 270}) => (
	<RowCard
		at={t0}
		y={y}
		h={h}
		badge={badge}
		badgeTone={LPI.sky}
		title={title}
		sub={
			<>
				{sub}
				<div style={{marginTop: 6, display: 'inline-block', padding: '2px 14px', borderRadius: 999, background: LPI.sky, border: `3px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N}}>{norm}</div>
			</>
		}
		subAt={subAt}
		art={190}
		size={46}
	>
		<WhiteCell size={170} kind={kind} />
	</RowCard>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const NFS = at('intro', 'nfs');
	const SEPT = at('intro', 'sept');
	const BLANCS = at('intro', 'blancs');
	const PLAQ = at('intro', 'plaquettes');
	const TRAV = at('intro', 'travers');
	const INF = at('intro', 'infection…');
	const HEMO = at('intro', 'hémorragie');
	const outs = [
		{t: BLANCS - 6, x: 120, y: 1400, node: <WhiteCell size={120} kind="pnn" />},
		{t: BLANCS - 2, x: 330, y: 1420, node: <WhiteCell size={110} kind="lympho" />},
		{t: PLAQ - 4, x: 220, y: 1560, node: <Platelet size={80} />},
		{t: PLAQ, x: 390, y: 1580, node: <Platelet size={70} />},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[]} />
			<Camera punches={[NFS + 1, SEPT + 1, BLANCS + 1, INF + 1, HEMO + 1]} shakes={[INF + 3, HEMO + 3]} strength={0.03}>
				<Big from={-60} text={'La *NFS* :\nglobules *blancs*\n+ plaquettes'} size={96} y={190} />
				<Live
					render={(f) => {
						const shake = f >= BLANCS - 6 && f < PLAQ + 16 ? Math.sin(f * 2.2) * 7 : Math.sin(f / 9) * 2;
						return (
							<div style={{position: 'absolute', left: 230, top: 1000, transform: `translate(-50%, -50%) rotate(${shake}deg)`}}>
								<Tube size={170} cap={VIOLET} label="EDTA" level={0.74} />
							</div>
						);
					}}
				/>
				{outs.map((c, i) => (
					<Live
						key={i}
						render={(f) => {
							if (f < c.t) return null;
							const k = interpolate(f, [c.t, c.t + 14], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
							return <div style={{position: 'absolute', left: 230 + (c.x - 230) * k, top: 860 + (c.y - 860) * k, transform: `translate(-50%, -50%) scale(${0.3 + 0.7 * k})`}}>{c.node}</div>;
						}}
					/>
				))}
				<Live
					render={(f) => {
						const hl = f >= SEPT && f < TRAV ? Math.floor(interpolate(f, [SEPT, SEPT + 30], [0, 6.99], clamp)) : -1;
						return (
							<div style={{position: 'absolute', left: 710, top: 1000, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 14)}deg)`}}>
								<WhiteSheet hl={hl} />
							</div>
						);
					}}
				/>
				<Chip at={SEPT - 2} to={TRAV - 4} x={710} y={1430} tone={LPI.pink} size={46}>
					7 lignes
				</Chip>
				{/* une infection : les microbes arrivent */}
				<Live
					render={(f) => {
						if (f < INF - 4) return null;
						return (
							<>
								{[0, 1, 2, 3].map((i) => (
									<div key={i} style={{position: 'absolute', left: 560 + i * 120, top: 1430 + 30 * Math.sin(f / 6 + i), transform: `scale(${popAt(f, INF - 4 + i * 2)})`}}>
										<Microbe size={80} seed={i} tone={LPI.pink} />
									</div>
								))}
							</>
						);
					}}
				/>
				<Stamp at={INF} x={720} y={1330} text="INFECTION ?" size={64} />
				{/* une hémorragie : des gouttes de sang */}
				<Live
					render={(f) => {
						if (f < HEMO - 4) return null;
						return (
							<svg width={1080} height={400} style={{position: 'absolute', left: 0, top: 1480}}>
								{[0, 1, 2].map((k) => {
									const t = (f - HEMO + 4 + k * 9) % 30;
									return <path key={k} d={`M${160 + k * 120} ${20 + t * 6} q18 28 0 42 q-18 -14 0 -42 Z`} fill={BLOOD} stroke={N} strokeWidth={3} />;
								})}
							</svg>
						);
					}}
				/>
				<Stamp at={HEMO} x={330} y={1660} text="HÉMORRAGIE ?" size={60} />
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={SEPT} volume={0.18} />
			<Sfx name="pop" at={BLANCS - 4} volume={0.2} />
			<Sfx name="pop" at={PLAQ} volume={0.2} />
			<Sfx name="stamp" at={INF} volume={0.4} />
			<Sfx name="stamp" at={HEMO} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · PLAQUETTES ═══════════════════════════════ */
export const Plaquettes: React.FC = () => {
	const UN = at('plaquettes', 'un');
	const PLAQ = at('plaquettes', 'plaquettes');
	const FORMENT = at('plaquettes', 'forment');
	const CAIL = at('plaquettes', 'caillot');
	const SAIGN = at('plaquettes', 'saignement');
	const PEU = at('plaquettes', 'peu');
	const THROMBOP = at('plaquettes', 'thrombopénie');
	const HEMO = at('plaquettes', "d'hémorragie");
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[UN, 1]]} />
			<Camera punches={[PLAQ + 1, CAIL + 1, PEU + 1, THROMBOP + 1]} strength={0.03}>
				<Big from={PLAQ - 4} text={'Les *plaquettes*'} size={106} y={330} />
				<Chip at={PLAQ + 10} x={540} y={520} size={36}>
					= thrombocytes
				</Chip>
				<Pop at={PLAQ} to={FORMENT - 4} x={540} y={820}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 8) * 8}deg)`}}><Platelet size={260} /></div>} />
				</Pop>
				{/* le caillot qui bouche la brèche ; trop peu → ça saigne */}
				<Live
					render={(f) => {
						if (f < FORMENT - 4) return null;
						const few = f >= PEU;
						const plug = few ? 0.25 : interpolate(f, [CAIL - 4, CAIL + 22], [0, 1], ease);
						const leak = few ? interpolate(f, [PEU + 6, PEU + 20], [0, 1], clamp) : 1 - plug;
						return (
							<svg width={1080} height={620} style={{position: 'absolute', left: 0, top: 560, opacity: fadeIn(f, FORMENT - 4, 8)}}>
								<rect x={0} y={60} width={1080} height={260} fill="#F3C3C8" />
								<path d="M0 320 H470 M610 320 H1080" stroke={N} strokeWidth={12} />
								<path d="M0 60 H1080" stroke={N} strokeWidth={12} />
								{[0, 1, 2, 3].map((k) => {
									const x = ((f * 3 + k * 280) % 1200) - 100;
									return <ellipse key={k} cx={x} cy={150 + (k % 2) * 70} rx={52} ry={40} fill="#D43A44" stroke={N} strokeWidth={4} />;
								})}
								{[0, 1, 2, 3, 4, 5].map((k) => {
									const kk = Math.min(1, Math.max(0, plug * 6 - k));
									if (kk <= 0) return null;
									const tx = 490 + (k % 3) * 46;
									const ty = 310 + Math.floor(k / 3) * 34;
									return <ellipse key={`p${k}`} cx={tx + (1 - kk) * (k - 2.5) * 80} cy={ty - (1 - kk) * 200} rx={26} ry={18} fill="#E9B7C9" stroke={N} strokeWidth={3} />;
								})}
								{leak > 0.02
									? [0, 1, 2].map((k) => {
											const t = ((f / 18 + k / 3) % 1) * leak;
											return <path key={`d${k}`} d={`M540 ${360 + t * 220} q14 22 0 32 q-14 -10 0 -32 Z`} fill={BLOOD} stroke={N} strokeWidth={3} opacity={leak} />;
										})
									: null}
							</svg>
						);
					}}
				/>
				<Chip at={SAIGN - 4} to={PEU - 4} x={540} y={1160} tone={LPI.blue} size={44}>
					le caillot arrête le saignement
				</Chip>
				<Arrow at={PEU} up={false} x={930} y={560} />
				<Chip at={THROMBOP - 2} x={540} y={1150} tone={LPI.pink} size={50}>
					thrombopénie
				</Chip>
				<Note at={HEMO - 2} y={1230} size={36}>
					risque d'hémorragie ↑
				</Note>
				<Norms at={THROMBOP + 4} rows={[['', '150 000 – 400 000 / mm³']]} y={NORM_Y + 30} />
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={CAIL} volume={0.15} />
			<Sfx name="buzz" at={THROMBOP} volume={0.18} />
			<Sfx name="impact" at={HEMO} volume={0.25} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LEUCOCYTES ═══════════════════════════════ */
export const Leucocytes: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('leucocytes', 'deux');
	const LEUCO = at('leucocytes', 'leucocytes');
	const GB = at('leucocytes', 'globules');
	const DEF = at('leucocytes', 'défendent');
	const MICR = at('leucocytes', 'microbes');
	const NOMB = at('leucocytes', 'nombreux');
	const INF = at('leucocytes', 'infection');
	const PEU = at('leucocytes', 'peu');
	const LEUCOP = at('leucocytes', 'leucopénie');
	const MAL = at('leucocytes', 'mal');
	const many = frame >= NOMB && frame < PEU - 4;
	const few = frame >= PEU;
	const nCells = many ? 9 : few ? 1 : 3;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[DEUX, 2]]} />
			<Camera punches={[LEUCO + 1, DEF + 1, NOMB + 1, PEU + 1, LEUCOP + 1]} strength={0.03}>
				<Big from={LEUCO - 4} text={'Les *leucocytes*'} size={106} y={330} />
				<Chip at={GB - 2} x={540} y={510} tone={LPI.paper} size={40}>
					= les globules blancs
				</Chip>
				<Live
					render={(f) => {
						if (f < LEUCO) return null;
						const microbes = f < MICR - 4 ? 0 : few ? 7 : 3;
						return (
							<div style={{position: 'absolute', left: 60, top: 580, width: 960, height: 500, borderRadius: 44, background: alpha(LPI.paper, 0.85), border: `6px solid ${N}`, opacity: fadeIn(f, LEUCO, 8), overflow: 'hidden'}}>
								{[...Array(nCells)].map((_, i) => (
									<div key={`w${i}`} style={{position: 'absolute', left: 60 + ((i * 197) % 760), top: 40 + ((i * 131) % 330) + 10 * Math.sin(f / 6 + i)}}>
										<WhiteCell size={120} kind={(['pnn', 'lympho', 'mono'] as const)[i % 3]} />
									</div>
								))}
								{[...Array(microbes)].map((_, i) => (
									<div key={`m${i}`} style={{position: 'absolute', left: 120 + ((i * 263) % 700), top: 90 + ((i * 89) % 300) + 8 * Math.cos(f / 5 + i)}}>
										<Microbe size={76} seed={i} tone={LPI.pink} />
									</div>
								))}
							</div>
						);
					}}
				/>
				<Chip at={DEF} to={NOMB - 4} x={540} y={1170} tone={LPI.blue} size={42}>
					ils défendent le corps
				</Chip>
				<Arrow at={NOMB} to={PEU - 4} x={960} y={1180} />
				<Chip at={INF - 4} to={PEU - 4} x={450} y={1170} tone={LPI.pink} size={46}>
					infection ?
				</Chip>
				<Arrow at={PEU} up={false} x={960} y={1180} />
				<Chip at={LEUCOP} x={450} y={1170} tone={LPI.pink} size={46}>
					leucopénie
				</Chip>
				<Note at={MAL - 8} y={1240} size={34}>
					il se défend mal (immunodéprimé)
				</Note>
				<Norms at={INF + 6} rows={[['', '4 000 – 10 000 / mm³']]} y={NORM_Y + 40} />
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={DEF} volume={0.15} />
			<Sfx name="pop" at={NOMB} volume={0.18} />
			<Sfx name="buzz" at={LEUCOP} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · 4 · 5 · LA FORMULE ═══════════════════════════════ */
export const Formule: React.FC = () => {
	const FORM = at('formule', 'formule');
	const TROIS = at('formule', 'trois');
	const NEU = at('formule', 'neutrophiles');
	const AVAL = at('formule', 'avalent');
	const QUATRE = at('formule', 'quatre');
	const EO = at('formule', 'éosinophiles');
	const ALL = at('formule', 'allergies');
	const CINQ = at('formule', 'cinq');
	const BASO = at('formule', 'basophiles');
	const PART = at('formule', 'participent');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 2], [TROIS, 3], [QUATRE, 4], [CINQ, 5]]} />
			<Camera punches={[FORM + 1, NEU + 1, EO + 1, BASO + 1]} strength={0.03}>
				<Big from={FORM - 4} text={'La *formule*'} size={110} y={330} />
				<Note at={FORM + 8} y={480} size={34}>
					les familles de globules blancs
				</Note>
				<FamCard at={TROIS - 2} y={600} badge={<span style={{fontSize: 26}}>PNN</span>} title="Neutrophiles" sub="avalent les microbes" subAt={AVAL - 4} kind="pnn" norm="1 500 – 7 000 / mm³" />
				<FamCard at={QUATRE - 2} y={890} badge={<span style={{fontSize: 26}}>PNE</span>} title="Éosinophiles" sub="↑ allergies, parasites" subAt={ALL - 4} kind="eo" norm="50 – 500 / mm³" />
				<FamCard at={CINQ - 2} y={1180} badge={<span style={{fontSize: 26}}>PNB</span>} title="Basophiles" sub="allergies" subAt={PART - 4} kind="baso" norm="0 – 200 / mm³" />
			</Camera>
			<Sfx name="whoosh" at={TROIS - 2} volume={0.15} />
			<Sfx name="whoosh" at={QUATRE - 2} volume={0.15} />
			<Sfx name="whoosh" at={CINQ - 2} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · 7 · LYMPHOCYTES ET MONOCYTES ═══════════════════════════════ */
export const Lymphocytes: React.FC = () => {
	const SIX = at('lymphocytes', 'six');
	const LYM = at('lymphocytes', 'lymphocytes');
	const MES = at('lymphocytes', 'mesure');
	const NOMB = at('lymphocytes', 'nombreux');
	const VIRUS = at('lymphocytes', 'virus');
	const SEPT = at('lymphocytes', 'sept');
	const MONO = at('lymphocytes', 'monocytes');
	const AVAL = at('lymphocytes', 'avalent');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 5], [SIX, 6], [SEPT, 7]]} />
			<Camera punches={[LYM + 1, NOMB + 1, VIRUS + 1, MONO + 1]} strength={0.03}>
				<Big from={LYM - 4} text={'Lymphocytes\net *monocytes*'} size={96} y={330} />
				<FamCard at={LYM - 2} y={560} badge="L" title="Lymphocytes" sub="défenses sur mesure" subAt={MES - 4} kind="lympho" norm="1 500 – 4 000 / mm³" />
				<Arrow at={NOMB} x={150} y={960} />
				<Chip at={NOMB + 4} x={540} y={940} tone={LPI.pink} size={44}>
					lymphocytose
				</Chip>
				<Note at={VIRUS - 4} y={1010} size={36}>
					d'abord : un virus ?
				</Note>
				<FamCard at={MONO - 4} y={1150} badge="M" title="Monocytes" sub="avalent aussi les microbes" subAt={AVAL - 4} kind="mono" norm="200 – 950 / mm³" />
			</Camera>
			<Sfx name="pop" at={SIX} volume={0.18} />
			<Sfx name="pop" at={NOMB + 4} volume={0.18} />
			<Sfx name="ding" at={VIRUS} volume={0.15} />
			<Sfx name="whoosh" at={MONO - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN : RÉCAP + PROCHAINE VIDÉO ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const PLAQ = at('fin', 'plaquettes');
	const GB = at('fin', 'globules');
	const CINQ = at('fin', 'cinq');
	const FAIT = at('fin', 'fait');
	const PROCH = at('fin', 'prochaine');
	const HB = at('fin', "l'hémoglobine");
	const checked = frame >= CINQ ? Math.min(7, 2 + Math.floor((frame - CINQ) / 4)) : frame >= GB ? 2 : frame >= PLAQ ? 1 : 0;
	const out = interpolate(frame, [PROCH - 8, PROCH + 4], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 7]]} done />
			<Camera punches={[PLAQ + 1, GB + 1, CINQ + 1, FAIT + 1, PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'La *NFS*\nest complète'} size={104} y={190} />
				<div style={{position: 'absolute', left: 540, top: 900 - out * 150, transform: `translate(-50%, -50%) scale(${1 - out * 0.3})`}}>
					<WhiteSheet big width={780} checked={checked} hl={checked > 0 && checked < 7 ? checked - 1 : -1} />
				</div>
				<Confetti at={FAIT} />
				<Pop at={PROCH - 2} x={540} y={1330}>
					<div style={{width: 900, boxSizing: 'border-box', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: LPI.sky}}>PROCHAINE VIDÉO</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: LPI.paper, lineHeight: 1.1}}>
								l'hémoglobine <span style={{color: LPI.pink}}>glyquée</span>
							</div>
						</div>
						<Live render={(f) => <GlycatedCell width={150} coat={interpolate(f, [HB, HB + 30], [0, 1], clamp)} />} />
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={PLAQ} volume={0.18} />
			<Sfx name="pop" at={GB} volume={0.18} />
			<Sfx name="pop" at={CINQ} volume={0.18} />
			<Sfx name="ding" at={FAIT} volume={0.25} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
