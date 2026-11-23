// « Le tube jaune » (n° 63, série « les tubes », look 2026) : l'ionogramme, sur le contenu et le tableau de normes fournis
// par le propriétaire. Accroche directe : le tube jaune en grand dès l'image 0, les 7 ions qui tournent autour, cœur /
// muscles / nerfs, « un seul chiffre de travers peut arrêter un cœur » (l'ECG devient plat). Puis le tube (sec + gel →
// sérum), ce qu'est un ion (cation +, anion −, extra / intracellulaire, schéma de cellule), et un ion par scène avec sa
// carte de normes : sodium, potassium, chlore, bicarbonates, phosphore, magnésium, calcium ; récap + la série des tubes.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Flash, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, RowCard, ease} from '../../brand/bold';
import {EcgMonitor} from '../../brand/arrest';
import {Battery} from '../../brand/heartfail';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, HEMO_CAP, HemoFlask, Ion, NormCard, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const YELLOW = CAP.gel;
const NORM_Y = 1440;
const CAT = LPI.pink;
const ANI = LPI.sky;

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

const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number}> = ({at: t0, to, up = true, x, y, size = 100}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: `translateY(${(up ? -1 : 1) * 10 * Math.sin(f / 3)}px)`}}>{up ? '↑' : '↓'}</div>} />
	</Pop>
);

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 40}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const Norms: React.FC<{at: number; value: string; y?: number}> = ({at: t0, value, y = NORM_Y}) => (
	<Pop at={t0} x={540} y={y}>
		<NormCard rows={[['', value]]} />
	</Pop>
);

/** Grand ion en haut à gauche (pastille rose = cation, bleu clair = anion). */
const BigIon: React.FC<{at?: number; label: string; tone: string; size?: number}> = ({at: t0 = 2, label, tone, size = 190}) => (
	<Pop at={t0} x={190} y={470}>
		<Ion label={label} tone={tone} size={size} />
	</Pop>
);

/**
 * Une cellule dans le sang : dehors = milieu extracellulaire, dedans = milieu intracellulaire. `out` / `inn` : étiquettes
 * des ions qui flottent dehors / dedans ; `swell` : taille de la cellule (déshydratée < 1 < gorgée d'eau) ; `labels`.
 */
export const CellMap: React.FC<{out?: string[]; inn?: string[]; swell?: number; labels?: number; flow?: number; w?: number}> = ({out = [], inn = [], swell = 1, labels = 1, flow = 0, w = 900}) => {
	const frame = useCurrentFrame();
	const H = 440;
	const rx = 190 * swell;
	const ry = 140 * swell;
	return (
		<div style={{position: 'relative', width: w, height: H}}>
			<svg width={w} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<rect x={4} y={4} width={w - 8} height={H - 8} rx={40} fill={alpha('#F6E7A8', 0.75)} stroke={N} strokeWidth={6} />
				<ellipse cx={w / 2} cy={H / 2} rx={rx} ry={ry} fill={alpha(LPI.pink, 0.55)} stroke={N} strokeWidth={6} />
				<ellipse cx={w / 2 - 30 * swell} cy={H / 2 - 10} rx={46 * swell} ry={36 * swell} fill={alpha(N, 0.25)} />
				{flow > 0
					? [0, 1, 2, 3].map((k) => {
							const t = (frame / 30 + k / 4) % 1;
							const a = (k / 4) * Math.PI * 2 + 0.6;
							const r0 = 1.5;
							const r = r0 - t * 0.6;
							return <circle key={k} cx={w / 2 + Math.cos(a) * rx * r} cy={H / 2 + Math.sin(a) * ry * r} r={10} fill="#8EC5EE" stroke={N} strokeWidth={2.5} opacity={flow * Math.sin(t * Math.PI)} />;
						})
					: null}
			</svg>
			{out.map((l, i) => {
				const a = (i / Math.max(1, out.length)) * Math.PI * 2 + 0.3;
				const x = w / 2 + Math.cos(a) * (rx + 120) + 8 * Math.sin(frame / 9 + i);
				const y = H / 2 + Math.sin(a) * (ry + 70) * 0.95;
				return (
					<div key={`o${i}`} style={{position: 'absolute', left: Math.min(w - 60, Math.max(60, x)) - 36, top: Math.min(H - 50, Math.max(50, y)) - 36}}>
						<Ion label={l} size={72} tone={l.includes('⁻') ? ANI : CAT} />
					</div>
				);
			})}
			{inn.map((l, i) => {
				const a = (i / Math.max(1, inn.length)) * Math.PI * 2 + 0.9;
				const x = w / 2 + 30 * swell + Math.cos(a) * rx * 0.5 + 6 * Math.sin(frame / 8 + i);
				const y = H / 2 + 20 + Math.sin(a) * ry * 0.3;
				return (
					<div key={`i${i}`} style={{position: 'absolute', left: x - 32, top: y - 32}}>
						<Ion label={l} size={64} tone={CAT} />
					</div>
				);
			})}
			{labels > 0 ? (
				<>
					<div style={{position: 'absolute', left: 24, top: 18, padding: '6px 16px', borderRadius: 999, background: LPI.paper, border: `4px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: N, opacity: labels}}>hors des cellules · extracellulaire</div>
					<div style={{position: 'absolute', left: w / 2 - 150, top: H / 2 - ry * 0.78, width: 300, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 24, color: N, opacity: labels}}>dans la cellule · intracellulaire</div>
				</>
			) : null}
		</div>
	);
};

/** Bascule acide ↔ base : `tilt` −1 (côté acide en bas) → +1 (côté base en bas). */
export const Seesaw: React.FC<{tilt: number; width?: number}> = ({tilt, width = 760}) => (
	<svg width={width} height={360} viewBox="0 0 760 360" style={{overflow: 'visible'}}>
		<path d="M380 220 L330 330 H430 Z" fill={LPI.blue} stroke={N} strokeWidth={6} strokeLinejoin="round" />
		<g transform={`rotate(${tilt * 12} 380 220)`}>
			<rect x={60} y={208} width={640} height={24} rx={12} fill={N} />
			<g transform="translate(110 120)">
				<rect x={-90} y={0} width={180} height={88} rx={22} fill={LPI.pink} stroke={N} strokeWidth={6} />
				<text x={0} y={58} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>
					ACIDE
				</text>
			</g>
			<g transform="translate(650 120)">
				<rect x={-90} y={0} width={180} height={88} rx={22} fill={LPI.sky} stroke={N} strokeWidth={6} />
				<text x={0} y={58} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>
					BASE
				</text>
			</g>
		</g>
	</svg>
);

const BoneIcon: React.FC<{size?: number}> = ({size = 200}) => (
	<svg width={size} height={size * 0.5} viewBox="0 0 200 100">
		<path d="M40 30 Q20 0 8 22 Q-6 40 18 50 Q-6 60 8 78 Q20 100 40 70 H160 Q180 100 192 78 Q206 60 182 50 Q206 40 192 22 Q180 0 160 30 Z" fill="#F4EEDF" stroke={N} strokeWidth={6} strokeLinejoin="round" />
	</svg>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
const ALL_IONS = [
	{l: 'Na⁺', t: CAT},
	{l: 'K⁺', t: CAT},
	{l: 'Cl⁻', t: ANI},
	{l: 'HCO₃⁻', t: ANI},
	{l: 'PO₄³⁻', t: ANI},
	{l: 'Mg²⁺', t: CAT},
	{l: 'Ca²⁺', t: CAT},
];

export const Hook: React.FC = () => {
	const SEPT = at('intro', 'sept');
	const COEUR = at('intro', 'cœur,');
	const MUSC = at('intro', 'muscles');
	const NERFS = at('intro', 'nerfs.');
	const IONO = at('intro', "l'ionogramme");
	const CHIF = at('intro', 'chiffre');
	const ARR = at('intro', 'arrêter');
	const away = CHIF - 4;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<Camera punches={[SEPT + 1, IONO + 1, ARR + 1]} shakes={[ARR + 4]} strength={0.03}>
				<Fly at={-14} x={540} y={860} from="bottom" to="bottom" move={[{at: CHIF - 4, y: 620, s: 0.7, dur: 14}]}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 9) * 2}deg)`}}><Tube size={190} cap={YELLOW} gel level={0.74} label="sec" /></div>} />
				</Fly>
				{ALL_IONS.map((ion, i) => (
					<Live
						key={ion.l}
						render={(f) => {
							const t0 = SEPT + i * 3;
							if (f < t0 || f > away + 8) return null;
							const a = (i / 7) * Math.PI * 2 + f / 50;
							const o = interpolate(f, [away, away + 7], [1, 0], clamp);
							return (
								<div style={{position: 'absolute', left: 540 + Math.cos(a) * 360 - 60, top: 860 + Math.sin(a) * 420 - 60, transform: `scale(${popAt(f, t0)})`, opacity: o}}>
									<Ion label={ion.l} size={120} tone={ion.t} />
								</div>
							);
						}}
					/>
				))}
				<Chip at={COEUR} to={away} x={230} y={1420} tone={CAT}>
					cœur
				</Chip>
				<Chip at={MUSC} to={away} x={540} y={1420} tone={CAT}>
					muscles
				</Chip>
				<Chip at={NERFS} to={away} x={850} y={1420} tone={CAT}>
					nerfs
				</Chip>
				<Big from={IONO - 2} text={"*L'ionogramme*"} size={120} />
				<Pop at={CHIF - 2} x={540} y={1200}>
					<Live render={(f) => <EcgMonitor width={880} height={330} rhythm={(t) => (t < ARR + 4 ? 'sinus' : 'flat')} readout={f < ARR + 4 ? '72' : '0'} alert={f >= ARR + 4 ? 1 : 0} />} />
				</Pop>
			</Camera>
			<Flash at={ARR + 4} max={0.4} />
			{ALL_IONS.map((ion, i) => (
				<Sfx key={ion.l} name="pop" at={SEPT + i * 3} volume={0.12} />
			))}
			<Sfx name="ding" at={IONO} volume={0.2} />
			<Sfx name="heartbeat" at={CHIF} volume={0.3} />
			<Sfx name="buzz" at={ARR + 4} volume={0.35} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE TUBE JAUNE ═══════════════════════════════ */
export const Jaune: React.FC = () => {
	const SEC = at('jaune', 'sec,');
	const GEL = at('jaune', 'gel.');
	const SANG = at('jaune', 'sang');
	const CAIL = at('jaune', 'caillot.');
	const CENT = at('jaune', 'centrifugé,');
	const SEP = at('jaune', 'sépare');
	const SERUM = at('jaune', 'sérum');
	const LIQ = at('jaune', 'liquide');
	const IONO = at('jaune', "l'ionogramme.");
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[SEC + 1, GEL + 1, CAIL + 1, CENT + 1, SERUM + 1]} strength={0.03}>
				<Big from={-2} text={'Le tube *jaune*'} size={120} />
				<Fly at={-2} x={330} y={930} from="left" to="left">
					<Live
						render={(f) => {
							const spin = interpolate(f, [CENT, CENT + 26], [0, 720], ease);
							return (
								<div style={{transform: `rotate(${spin}deg)`}}>
									<Tube size={180} cap={YELLOW} gel label="sec" level={interpolate(f, [SANG - 4, SANG + 16], [0, 0.8], ease)} serum={interpolate(f, [CENT + 20, CENT + 34], [0, 1], ease)} />
								</div>
							);
						}}
					/>
				</Fly>
				<Chip at={SEC} x={760} y={520}>
					tube sec
				</Chip>
				<PTag at={GEL} to={SANG - 4} x={760} y={1180} px={340} py={1230}>
					un gel
				</PTag>
				<Chip at={CAIL} to={CENT - 4} x={760} y={680}>
					le sang coagule
				</Chip>
				<Chip at={CENT} to={SEP - 2} x={760} y={680} tone={LPI.sky}>
					centrifugé
				</Chip>
				<PTag at={SEP + 4} x={760} y={1150} px={340} py={1170}>
					caillot
				</PTag>
				<PTag at={SEP + 10} x={760} y={1000} px={340} py={1000}>
					gel
				</PTag>
				<PTag at={SERUM} x={760} y={800} px={340} py={820}>
					sérum
				</PTag>
				<Note at={LIQ} y={1330} size={40} x={520}>
					le liquide jaune au-dessus
				</Note>
				<Chip at={IONO} x={540} y={1450} tone={CAT} size={48}>
					sérum → ionogramme
				</Chip>
			</Camera>
			<Sfx name="pop" at={SEC} volume={0.15} />
			<Sfx name="pop" at={GEL} volume={0.15} />
			<Sfx name="whoosh" at={CENT} volume={0.25} />
			<Sfx name="ding" at={SERUM} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ UN ION ═══════════════════════════════ */
export const Ions: React.FC = () => {
	const MIN = at('ions', 'minéral');
	const CHARGE = at('ions', 'charge');
	const CATIONS = at('ions', 'cations');
	const PLUS = at('ions', 'plus,');
	const ANIONS = at('ions', 'anions');
	const MOINS = at('ions', 'moins.');
	const CERT = at('ions', 'certains');
	const EXTRA = at('ions', 'extracellulaire.');
	const AUTRES = at('ions', "d'autres");
	const INTRA = at('ions', 'intracellulaire.');
	const out = CERT - 4;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[MIN + 1, CHARGE + 1, CATIONS + 1, ANIONS + 1, EXTRA + 1, INTRA + 1]} strength={0.03}>
				<Big from={-2} text={'Un *ion*'} size={130} />
				<Pop at={MIN - 2} to={out} x={540} y={640}>
					<Live render={(f) => <div style={{display: 'flex', gap: 30, alignItems: 'center'}}><Ion label="Na⁺" size={150} tone={CAT} /><div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: N, opacity: fadeIn(f, CHARGE, 6), transform: `scale(${1 + 0.15 * Math.sin(f / 3)})`}}>⚡</div></div>} />
				</Pop>
				<Note at={MIN + 6} to={out} y={800} size={44}>
					un minéral dissous dans le sang
				</Note>
				<Note at={CHARGE + 4} to={out} y={890} size={40} tone={LPI.paper}>
					avec une petite charge électrique
				</Note>
				<Pop at={CATIONS} to={out} x={290} y={1130}>
					<div style={{width: 400, padding: '22px 0', borderRadius: 36, background: CAT, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>cation = +</div>
				</Pop>
				<Pop at={PLUS + 4} to={out} x={290} y={1260}>
					<div style={{display: 'flex', gap: 12}}>
						{['Na⁺', 'K⁺', 'Ca²⁺'].map((l) => (
							<Ion key={l} label={l} size={84} tone={CAT} />
						))}
					</div>
				</Pop>
				<Pop at={ANIONS} to={out} x={790} y={1130}>
					<div style={{width: 400, padding: '22px 0', borderRadius: 36, background: ANI, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>anion = −</div>
				</Pop>
				<Pop at={MOINS + 4} to={out} x={790} y={1260}>
					<div style={{display: 'flex', gap: 12}}>
						{['Cl⁻', 'HCO₃⁻'].map((l) => (
							<Ion key={l} label={l} size={84} tone={ANI} />
						))}
					</div>
				</Pop>
				{/* les deux milieux */}
				<Pop at={CERT} x={540} y={900}>
					<Live render={(f) => <CellMap out={['Na⁺', 'Cl⁻', 'Na⁺', 'Cl⁻']} inn={f >= AUTRES ? ['K⁺', 'K⁺', 'K⁺'] : []} labels={1} />} />
				</Pop>
				<Chip at={EXTRA - 2} x={540} y={1240} tone={LPI.paper} size={40}>
					extra = dehors
				</Chip>
				<Chip at={INTRA - 2} x={540} y={1340} tone={CAT} size={40}>
					intra = dedans
				</Chip>
			</Camera>
			<Sfx name="pop" at={MIN} volume={0.15} />
			<Sfx name="ding" at={CHARGE} volume={0.15} />
			<Sfx name="pop" at={CATIONS} volume={0.18} />
			<Sfx name="pop" at={ANIONS} volume={0.18} />
			<Sfx name="whoosh" at={CERT} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SODIUM ═══════════════════════════════ */
export const Sodium: React.FC = () => {
	const NA = at('sodium', 'na⁺,');
	const CATION = at('sodium', 'cation');
	const PRESS = at('sodium', 'pression');
	const HYDR = at('sodium', "l'hydratation");
	const EQUI = at('sodium', "l'équilibre");
	const TROP = at('sodium', 'trop');
	const HYPER = at('sodium', 'hypernatrémie');
	const PAS = at('sodium', 'pas');
	const HYPO = at('sodium', 'hyponatrémie');
	const rolesOut = TROP - 4;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[NA + 1, CATION + 1, HYPER + 1, HYPO + 1]} strength={0.03}>
				<Big from={-2} text={'Le *sodium*'} size={120} />
				<BigIon at={NA - 2} label="Na⁺" tone={CAT} />
				<Chip at={PRESS} to={rolesOut} x={700} y={420} size={34}>
					pression artérielle
				</Chip>
				<Chip at={HYDR} to={rolesOut} x={700} y={500} size={34}>
					hydratation
				</Chip>
				<Chip at={EQUI} to={rolesOut} x={700} y={580} size={34}>
					équilibre des minéraux
				</Chip>
				<Pop at={CATION} x={540} y={930}>
					<Live
						render={(f) => {
							const swell = 1 - 0.28 * interpolate(f, [HYPER, HYPER + 16, PAS - 4, PAS + 6], [0, 1, 1, 0], ease) + 0.25 * interpolate(f, [HYPO, HYPO + 16], [0, 1], ease);
							return <CellMap out={['Na⁺', 'Na⁺', 'Na⁺', 'Na⁺', 'Na⁺']} swell={swell} labels={1} flow={f >= HYPO ? 1 : 0} />;
						}}
					/>
				</Pop>
				<Arrow at={TROP} to={PAS - 4} x={900} y={520} />
				<Chip at={HYPER} to={PAS - 4} x={540} y={1240} tone={CAT} size={42}>
					hypernatrémie
				</Chip>
				<Note at={HYPER + 10} to={PAS - 4} y={1300} size={34}>
					les cellules se déshydratent
				</Note>
				<Arrow at={PAS} up={false} x={900} y={520} />
				<Chip at={HYPO} x={540} y={1240} tone={ANI} size={42}>
					hyponatrémie
				</Chip>
				<Note at={HYPO + 10} y={1300} size={34}>
					les cellules se gorgent d'eau
				</Note>
				<Norms at={CATION + 10} value="133 – 150 mmol/L" />
			</Camera>
			<Sfx name="pop" at={NA} volume={0.18} />
			<Sfx name="pop" at={PRESS} volume={0.12} />
			<Sfx name="pop" at={HYDR} volume={0.12} />
			<Sfx name="pop" at={EQUI} volume={0.12} />
			<Sfx name="buzz" at={HYPER} volume={0.15} />
			<Sfx name="buzz" at={HYPO} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POTASSIUM ═══════════════════════════════ */
export const Potassium: React.FC = () => {
	const K = at('potassium', 'k⁺,');
	const CATION = at('potassium', 'cation');
	const NERFS = at('potassium', 'nerfs,');
	const MUSC = at('potassium', 'muscles…');
	const COEUR = at('potassium', 'cœur.');
	const TROP = at('potassium', 'trop');
	const HYPER = at('potassium', 'hyperkaliémie');
	const IR = at('potassium', 'insuffisance');
	const DETR = at('potassium', 'détruites');
	const ACID = at('potassium', 'acidose,');
	const PAS = at('potassium', 'pas');
	const HYPO = at('potassium', 'hypokaliémie');
	const DIG = at('potassium', 'digestives');
	const REINS = at('potassium', 'reins.');
	const DEUX = at('potassium', 'dans', 2);
	const DEREG = at('potassium', 'dérégler,');
	const ARR = at('potassium', "s'arrêter");
	const ECG = at('potassium', "l'ecg.");
	const URG = at('potassium', 'urgence');
	const mapOut = TROP - 4;
	const causesOut = DEUX - 4;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[K + 1, COEUR + 1, HYPER + 1, HYPO + 1, ARR + 1, URG + 1]} shakes={[URG + 2]} strength={0.03}>
				<Big from={-2} text={'Le *potassium*'} size={116} />
				<BigIon at={K - 2} label="K⁺" tone={CAT} />
				<Chip at={NERFS} to={mapOut} x={700} y={420} size={36}>
					nerfs
				</Chip>
				<Chip at={MUSC} to={mapOut} x={700} y={500} size={36}>
					muscles
				</Chip>
				<Chip at={COEUR} to={mapOut} x={700} y={580} size={40} tone={CAT}>
					le cœur !
				</Chip>
				<Pop at={CATION} to={mapOut} x={540} y={960}>
					<CellMap inn={['K⁺', 'K⁺', 'K⁺', 'K⁺']} out={['Na⁺', 'Na⁺']} labels={1} />
				</Pop>
				{/* trop / pas assez : les causes */}
				<Arrow at={TROP} to={causesOut} x={300} y={640} />
				<Chip at={HYPER} to={causesOut} x={300} y={760} tone={CAT} size={36}>
					hyperkaliémie
				</Chip>
				<Chip at={IR} to={causesOut} x={300} y={870} size={28}>
					insuffisance rénale
				</Chip>
				<Chip at={DETR} to={causesOut} x={300} y={960} size={28}>
					cellules détruites
				</Chip>
				<Chip at={ACID} to={causesOut} x={300} y={1050} size={28}>
					acidose : sang trop acide
				</Chip>
				<Arrow at={PAS} to={causesOut} up={false} x={790} y={640} />
				<Chip at={HYPO} to={causesOut} x={790} y={760} tone={ANI} size={36}>
					hypokaliémie
				</Chip>
				<Chip at={DIG} to={causesOut} x={790} y={870} size={28}>
					pertes digestives
				</Chip>
				<Chip at={REINS} to={causesOut} x={790} y={960} size={28}>
					pertes par les reins
				</Chip>
				{/* le cœur se dérègle */}
				<Pop at={DEUX} x={540} y={900}>
					<Live render={(f) => <EcgMonitor width={880} height={340} rhythm={(t) => (t < DEREG ? 'sinus' : t < ARR + 6 ? 'fv' : 'flat')} readout={f < DEREG ? '72' : f < ARR + 6 ? '?' : '0'} alert={f >= DEREG ? 1 : 0} />} />
				</Pop>
				<PTag at={ECG} x={760} y={1190} px={540} py={1060}>
					ça se voit à l'ECG
				</PTag>
				<Stamp at={URG} x={300} y={1210} text="URGENCE !" size={70} />
				<Norms at={HYPER + 6} value="3,5 – 5 mmol/L" />
			</Camera>
			<Flash at={ARR + 6} max={0.35} />
			<Sfx name="pop" at={K} volume={0.18} />
			<Sfx name="heartbeat" at={COEUR} volume={0.25} />
			<Sfx name="buzz" at={HYPER} volume={0.15} />
			<Sfx name="buzz" at={HYPO} volume={0.15} />
			<Sfx name="buzz" at={ARR + 6} volume={0.3} />
			<Sfx name="stamp" at={URG} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHLORE ═══════════════════════════════ */
export const Chlore: React.FC = () => {
	const CHLORURE = at('chlore', 'chlorure,');
	const ANION = at('chlore', 'anion');
	const ACIDE = at('chlore', "l'acide");
	const OSMO = at('chlore', 'osmotique');
	const FORCE = at('chlore', 'force');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[CHLORURE + 1, ANION + 1, ACIDE + 1, OSMO + 1]} strength={0.03}>
				<Big from={-2} text={'Le *chlore*'} size={120} />
				<BigIon at={2} label="Cl⁻" tone={ANI} />
				<Chip at={CHLORURE} x={700} y={460} size={40}>
					= chlorure
				</Chip>
				<Pop at={ANION} x={540} y={930}>
					<Live render={(f) => <CellMap out={['Cl⁻', 'Cl⁻', 'Cl⁻', 'Cl⁻']} labels={1} flow={f >= OSMO ? 1 : 0} />} />
				</Pop>
				<Chip at={ACIDE} x={540} y={1230} size={36}>
					équilibre acide / base
				</Chip>
				<Chip at={OSMO} x={540} y={1320} tone={ANI} size={36}>
					pression osmotique
				</Chip>
				<Note at={FORCE} y={1370} size={30}>
					la force qui fait passer l'eau
				</Note>
				<Norms at={ANION + 10} value="95 – 105 mmol/L" y={NORM_Y + 80} />
			</Camera>
			<Sfx name="pop" at={CHLORURE} volume={0.15} />
			<Sfx name="pop" at={ACIDE} volume={0.15} />
			<Sfx name="ding" at={OSMO} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ BICARBONATES ═══════════════════════════════ */
export const Bicar: React.FC = () => {
	const EQUI = at('bicar', "l'équilibre");
	const HAUTS = at('bicar', 'hauts,');
	const ALCA = at('bicar', 'alcalose');
	const PASASS = at('bicar', 'pas');
	const RESP = at('bicar', 'acidose');
	const BAS = at('bicar', 'bas,');
	const ACMET = at('bicar', 'acidose', 2);
	const TROPAC = at('bicar', 'trop', 3);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[EQUI + 1, HAUTS + 1, BAS + 1]} strength={0.03}>
				<Big from={-2} text={'Les\n*bicarbonates*'} size={110} />
				<Pop at={2} x={880} y={330}>
					<Ion label="HCO₃⁻" size={170} tone={ANI} />
				</Pop>
				<Pop at={EQUI} x={540} y={760}>
					<Live render={(f) => <Seesaw tilt={interpolate(f, [HAUTS, HAUTS + 14, BAS, BAS + 14], [0, 1, 1, -1], ease)} />} />
				</Pop>
				<Arrow at={HAUTS} to={BAS - 4} x={150} y={1000} />
				<Chip at={ALCA} to={BAS - 4} x={540} y={1000} tone={ANI} size={38}>
					alcalose métabolique
				</Chip>
				<Note at={PASASS} to={BAS - 4} y={1070} size={30}>
					sang pas assez acide
				</Note>
				<Chip at={RESP} to={BAS - 4} x={540} y={1180} size={34}>
					ou acidose respiratoire
				</Chip>
				<Arrow at={BAS} up={false} x={150} y={1000} />
				<Chip at={ACMET} x={540} y={1000} tone={CAT} size={38}>
					acidose métabolique
				</Chip>
				<Note at={TROPAC} y={1070} size={30}>
					sang trop acide
				</Note>
				<Norms at={EQUI + 14} value="22 – 30 mmol/L" />
			</Camera>
			<Sfx name="whoosh" at={HAUTS} volume={0.12} />
			<Sfx name="whoosh" at={BAS} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PHOSPHORE ═══════════════════════════════ */
export const Phosphore: React.FC = () => {
	const PHOSPHATE = at('phosphore', 'phosphate,');
	const OS = at('phosphore', 'os');
	const ENERG = at('phosphore', 'énergie.');
	const FAB = at('phosphore', 'fabriquer');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[PHOSPHATE + 1, OS + 1, FAB + 1]} strength={0.03}>
				<Big from={-2} text={'Le *phosphore*'} size={116} />
				<BigIon at={PHOSPHATE - 2} label="PO₄³⁻" tone={ANI} />
				<Chip at={PHOSPHATE + 4} x={700} y={470} size={34}>
					sous forme de phosphate
				</Chip>
				<Pop at={OS} x={300} y={870}>
					<BoneIcon size={300} />
				</Pop>
				<Chip at={OS + 6} x={300} y={1040} size={38}>
					des os solides
				</Chip>
				<Pop at={FAB - 4} x={780} y={870}>
					<Live render={(f) => <Battery level={interpolate(f, [FAB, ENERG + 10], [0.1, 1], clamp)} width={180} />} />
				</Pop>
				<Chip at={ENERG - 2} x={780} y={1040} size={38}>
					l'énergie des cellules
				</Chip>
				<Norms at={OS + 10} value="0,8 – 1,3 mmol/L" />
			</Camera>
			<Sfx name="pop" at={OS} volume={0.18} />
			<Sfx name="ding" at={ENERG} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ MAGNÉSIUM ═══════════════════════════════ */
export const Magnesium: React.FC = () => {
	const frame = useCurrentFrame();
	const PART = at('magnesium', 'participe');
	const TROIS = at('magnesium', 'trois');
	const REAC = at('magnesium', 'réactions');
	const NERFS = at('magnesium', 'nerfs,');
	const MUSC = at('magnesium', 'muscles,');
	const RYTHME = at('magnesium', 'rythme');
	const DEF = at('magnesium', 'défenses');
	const n = Math.round(interpolate(frame, [TROIS - 6, REAC + 6], [0, 300], clamp));
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[TROIS + 1, NERFS + 1, RYTHME + 1, DEF + 1]} strength={0.03}>
				<Big from={-2} text={'Le *magnésium*'} size={116} />
				<BigIon at={2} label="Mg²⁺" tone={CAT} />
				<Pop at={PART} x={680} y={560}>
					<div style={{padding: '18px 40px', borderRadius: 40, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 110, color: N, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>+ {n}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 32, color: alpha(N, 0.8)}}>réactions</div>
					</div>
				</Pop>
				<Chip at={NERFS} x={300} y={880} tone={CAT}>
					nerfs
				</Chip>
				<Chip at={MUSC} x={760} y={880} tone={CAT}>
					muscles
				</Chip>
				<Chip at={RYTHME} x={300} y={1020} tone={CAT}>
					rythme du cœur
				</Chip>
				<Chip at={DEF} x={760} y={1020} tone={CAT}>
					défenses
				</Chip>
				<Norms at={REAC + 10} value="0,75 – 1 mmol/L" />
			</Camera>
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={i} name="tick" at={TROIS - 6 + i * 4} volume={0.1} />
			))}
			<Sfx name="pop" at={NERFS} volume={0.12} />
			<Sfx name="pop" at={MUSC} volume={0.12} />
			<Sfx name="pop" at={RYTHME} volume={0.12} />
			<Sfx name="pop" at={DEF} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CALCIUM ═══════════════════════════════ */
export const Calcium: React.FC = () => {
	const SQUE = at('calcium', 'squelette');
	const COAG = at('calcium', 'coaguler,');
	const INFLUX = at('calcium', "l'influx");
	const MUSC = at('calcium', 'contracter');
	const TROP = at('calcium', 'trop');
	const APP = at('calcium', "d'apports");
	const PARA = at('calcium', 'parathyroïdes,');
	const COU = at('calcium', 'cou,');
	const CANC = at('calcium', 'cancers');
	const PAS = at('calcium', 'pas');
	const MANQ = at('calcium', 'manque');
	const PARA2 = at('calcium', 'parathyroïdes', 2);
	const IRC = at('calcium', 'insuffisance');
	const rolesOut = TROP - 4;
	const hyperOut = PAS - 4;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[SQUE + 1, TROP + 1, PARA + 1, PAS + 1]} strength={0.03}>
				<Big from={-2} text={'Le *calcium*'} size={120} />
				<BigIon at={2} label="Ca²⁺" tone={CAT} />
				<Pop at={SQUE - 4} to={rolesOut} x={740} y={500}>
					<BoneIcon size={260} />
				</Pop>
				<Chip at={SQUE} to={rolesOut} x={300} y={760} tone={CAT} size={36}>
					squelette solide
				</Chip>
				<Chip at={COAG} to={rolesOut} x={780} y={760} tone={CAT} size={36}>
					coagulation
				</Chip>
				<Chip at={INFLUX} to={rolesOut} x={300} y={880} tone={CAT} size={36}>
					influx nerveux
				</Chip>
				<Chip at={MUSC} to={rolesOut} x={780} y={880} tone={CAT} size={36}>
					contraction musculaire
				</Chip>
				{/* trop de calcium */}
				<Arrow at={TROP} to={hyperOut} x={900} y={500} />
				<Chip at={TROP + 2} to={hyperOut} x={540} y={680} tone={CAT} size={40}>
					hypercalcémie
				</Chip>
				<Chip at={APP} to={hyperOut} x={540} y={790} size={30}>
					trop d'apports ou de vitamine D
				</Chip>
				<Chip at={PARA} to={hyperOut} x={540} y={880} size={30}>
					parathyroïdes qui travaillent trop
				</Chip>
				<Note at={COU} to={hyperOut} y={940} size={26} tone={LPI.sky}>
					petites glandes du cou
				</Note>
				<Chip at={CANC} to={hyperOut} x={540} y={1050} size={30}>
					cancers des os, myélome
				</Chip>
				{/* pas assez */}
				<Arrow at={PAS} up={false} x={900} y={500} />
				<Chip at={PAS + 2} x={540} y={680} tone={ANI} size={40}>
					hypocalcémie
				</Chip>
				<Chip at={MANQ} x={540} y={790} size={30}>
					manque de vitamine D
				</Chip>
				<Chip at={PARA2} x={540} y={880} size={30}>
					parathyroïdes trop lentes
				</Chip>
				<Chip at={IRC} x={540} y={970} size={30}>
					insuffisance rénale chronique
				</Chip>
				<Norms at={TROP + 6} value="2,2 – 2,6 mmol/L" />
			</Camera>
			<Sfx name="pop" at={SQUE} volume={0.15} />
			<Sfx name="pop" at={COAG} volume={0.12} />
			<Sfx name="pop" at={INFLUX} volume={0.12} />
			<Sfx name="pop" at={MUSC} volume={0.12} />
			<Sfx name="whoosh" at={TROP} volume={0.12} />
			<Sfx name="whoosh" at={PAS} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + LA SÉRIE ═══════════════════════════════ */
const SERIES_CAPS = [HEMO_CAP.aero, CAP.citrate, CAP.gel, CAP.sec, CAP.hepar, CAP.edta, CAP.fluor];
const DONE = [2, 5];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const JAUNE = at('fin', 'jaune,');
	const SODIUM = at('fin', 'sodium');
	const POT = at('fin', 'potassium');
	const BIC = at('fin', 'bicarbonates');
	const PHOS = at('fin', 'phosphore');
	const MAG = at('fin', 'magnésium');
	const PROCH = at('fin', 'prochain');
	const SERIE = at('fin', 'série');
	const out = PROCH - 6;
	const rows = [
		{t: JAUNE, title: 'Tube jaune → le sérum'},
		{t: SODIUM, title: 'Na⁺ + Cl⁻ : hors des cellules'},
		{t: POT, title: 'K⁺ : dans les cellules'},
		{t: BIC, title: "HCO₃⁻ : l'acidité"},
		{t: PHOS, title: 'Phosphore : les os'},
		{t: MAG, title: 'Mg²⁺ + Ca²⁺ : nerfs, muscles'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[...rows.map((r) => r.t + 1), SERIE + 1]} strength={0.025}>
				<Big from={-2} to={out} text={'On *récapitule*'} size={116} />
				{rows.map((r, i) => (
					<Live key={r.title} render={(f) => (f > out + 10 ? null : <div style={{opacity: interpolate(f, [out, out + 8], [1, 0], clamp)}}><RowCard at={r.t - 2} y={380 + i * 150} h={130} badge={String(i + 1)} title={r.title} check={r.t + 10} size={42} /></div>)} />
				))}
				<Big from={PROCH} text={'La série\ndes *tubes*'} size={116} />
				{SERIES_CAPS.map((c, i) => {
					const t0 = PROCH + 2 + i * 3;
					if (frame < t0) return null;
					const done = DONE.includes(i);
					return (
						<div key={i} style={{position: 'absolute', left: 540 + (i - 3) * 138 - 60, top: 640, width: 120, height: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${popAt(frame, t0)})`, opacity: done ? 1 : 0.55}}>
							{i === 0 ? <HemoFlask size={100} label="" cap={c} /> : <Tube size={90} cap={c} gel={i === 2} level={done ? 0.74 : 0} serum={i === 2 ? 1 : 0} />}
							<div style={{marginTop: 18, width: 70, height: 70, borderRadius: 35, background: done ? LPI.blue : LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: done ? LPI.paper : N}}>{done ? '✓' : '?'}</div>
						</div>
					);
				})}
				<Note at={SERIE + 2} y={1280} size={52} tone={LPI.pink}>
					le prochain tube arrive bientôt !
				</Note>
			</Camera>
			<Confetti at={SERIE} />
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.15} />
			))}
			<Sfx name="ding" at={SERIE} volume={0.25} />
		</AbsoluteFill>
	);
};
