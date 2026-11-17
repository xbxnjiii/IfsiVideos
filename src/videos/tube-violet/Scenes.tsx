// « Le tube violet » (n° 62, 1re vidéo de la série sur les tubes, look 2026) : accroche « pâle, essoufflé, épuisé… un seul
// tube va te dire pourquoi » (patient pâle + tube violet dès l'image 0, fiche NFS « hémoglobine 8,0 », tampon ANÉMIE), puis
// l'EDTA (il capture le calcium : pas de caillot, cellules entières → hématologie), la NFS (numération = compter, formule =
// les familles de globules blancs), globules rouges (hémoglobine, anémie, VGM), globules blancs, plaquettes, le groupe
// sanguin et l'hémoglobine glyquée, le piège (jamais d'ionogramme : potassium ; après le vert, avant le gris), les gestes,
// récap + la série. Bouchons et sang aux vraies couleurs (src/brand/tubes.tsx).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Flash, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, RowCard, ease} from '../../brand/bold';
import {GlycatedCell} from '../../brand/diabetes';
import {Microbe, Sparkles} from '../../brand/hands';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {BLOOD, BLOOD_DARK, CAP, HEMO_CAP, HemoFlask, Ion, LabSheet, OrderRail, Platelet, RedCell, SugarCube, Tube, WhiteCell} from '../../brand/tubes';
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

/** Le tube violet, à gauche de l'écran. */
const HeroTube: React.FC<{at: number; out?: number; x?: number; y?: number; size?: number; additive?: (f: number) => number; taint?: (f: number) => number; taintColor?: string}> = ({at: t0, out, x = 250, y = 900, size = 160, additive, taint, taintColor}) => (
	<Fly at={t0} out={out} x={x} y={y} from="left" to="left">
		<Live render={(f) => <Tube size={size} cap={VIOLET} label="EDTA" level={0.72} additive={additive ? additive(f) : 0} taint={taint ? taint(f) : 0} taintColor={taintColor} />} />
	</Fly>
);

const Pop: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, to = 1e9, x, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * interpolate(frame, [to, to + 7], [1, 0], clamp)})`}}>{children}</div>;
};

const Cross: React.FC<{at: number; x: number; y: number; size?: number; to?: number}> = ({at: t0, x, y, size = 110, to = 1e9}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{width: size, height: size, borderRadius: size / 2, background: LPI.pink, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW}}>
			<svg width={size * 0.5} height={size * 0.5} viewBox="0 0 100 100">
				<path d="M20 20 L80 80 M80 20 L20 80" stroke={N} strokeWidth={18} strokeLinecap="round" />
			</svg>
		</div>
	</Pop>
);

const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number}> = ({at: t0, to, up = true, x, y, size = 110}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: `translateY(${(up ? -1 : 1) * 10 * Math.sin(f / 3)}px)`}}>{up ? '↑' : '↓'}</div>} />
	</Pop>
);

/** Pince de l'EDTA (rose, « bouche » qui attrape le calcium). */
const Claw: React.FC<{size?: number; bite: number}> = ({size = 200, bite}) => {
	const a = 32 * (1 - bite) + 4;
	return (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
			<g transform="translate(100 100)">
				<path d={`M0 0 L${Math.cos((a * Math.PI) / 180) * 80} ${-Math.sin((a * Math.PI) / 180) * 80} A80 80 0 1 0 ${Math.cos((a * Math.PI) / 180) * 80} ${Math.sin((a * Math.PI) / 180) * 80} Z`} fill={LPI.pink} stroke={N} strokeWidth={7} strokeLinejoin="round" />
				<circle cx={-14} cy={-40} r={9} fill={N} />
			</g>
			<text x={86} y={176} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
				EDTA
			</text>
		</svg>
	);
};

/** Caillot (mailles de fibrine + globules). */
const ClotIcon: React.FC<{size?: number}> = ({size = 160}) => (
	<svg width={size} height={size} viewBox="0 0 160 160">
		<circle cx={80} cy={80} r={70} fill={LPI.paper} stroke={N} strokeWidth={5} />
		{[[60, 64], [92, 58], [74, 96], [104, 92], [52, 100]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={15} fill={BLOOD} stroke={N} strokeWidth={3} />
		))}
		<path d="M30 60 L130 104 M36 110 L126 50 M50 34 L110 128 M80 26 L72 136" stroke={alpha(N, 0.6)} strokeWidth={4} />
	</svg>
);

/** Jauge d'hémoglobine (0 → 18 g/dL) : zone normale 12 – 17 (repère adulte), curseur rose sur la valeur. */
const HbGauge: React.FC<{value: number; width?: number}> = ({value, width = 900}) => {
	const x = (v: number) => 20 + ((width - 40) * v) / 18;
	return (
		<svg width={width} height={170} style={{overflow: 'visible'}}>
			<rect x={20} y={60} width={width - 40} height={40} rx={20} fill={LPI.paper} stroke={N} strokeWidth={5} />
			<rect x={x(12)} y={60} width={x(17) - x(12)} height={40} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<text x={(x(12) + x(17)) / 2} y={44} textAnchor="middle" fontFamily={FONT.body} fontWeight={900} fontSize={30} fill={N}>
				normale : 12 – 17
			</text>
			<g transform={`translate(${x(value)} 80)`}>
				<circle r={30} fill={LPI.pink} stroke={N} strokeWidth={6} />
			</g>
			<text x={x(value)} y={152} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>
				{value.toFixed(1).replace('.', ',')} g/dL
			</text>
		</svg>
	);
};

const NFS_LINES = [
	['Hémoglobine', '8,0', 'g/dL'],
	['Globules blancs', '7,2', 'G/L'],
	['Plaquettes', '250', 'G/L'],
];

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const PALE = at('intro', 'pâle,');
	const ESS = at('intro', 'essoufflé,');
	const EPU = at('intro', 'épuisé');
	const SEUL = at('intro', 'seul');
	const VIOL = at('intro', 'violet.');
	const VERD = at('intro', 'verdict');
	const HUIT = at('intro', 'huit.');
	const ANEM = at('intro', 'anémie');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[SEUL + 1, VIOL + 1, HUIT + 1, ANEM + 1]} shakes={[HUIT + 2, ANEM + 2]} strength={0.03}>
				<Fly at={-14} x={330} y={830} from="left" to="left" move={[{at: VERD - 4, y: 700, s: 0.82, dur: 14}]}>
					<Live render={(f) => <Patient size={470} mood="mal" pale={fadeIn(f, PALE, 14)} breath={f >= ESS ? 0.5 + 0.5 * Math.sin(f / 3) : 0} sweat={fadeIn(f, EPU, 12)} />} />
				</Fly>
				<Fly at={-14} x={830} y={860} from="right" to="right" move={[{at: VERD - 4, y: 700, s: 0.82, dur: 14}]}>
					<Live render={(f) => <div style={{transform: `scale(${1 + 0.12 * interpolate(f, [SEUL, SEUL + 8, SEUL + 30], [0, 1, 0.4], clamp)})`}}><Tube size={150} cap={VIOLET} label="EDTA" level={0.72} /></div>} />
				</Fly>
				<Sparkles at={SEUL + 2} x={830} y={760} r={200} />
				<Big from={VIOL - 2} text={'Le tube *violet*'} size={116} />
				<Fly at={VERD - 2} x={540} y={1330} from="bottom" to="bottom">
					<Live render={(f) => <LabSheet width={800} lines={NFS_LINES} hot={0} alarm={fadeIn(f, HUIT, 4)} />} />
				</Fly>
				<Stamp at={ANEM} x={560} y={1580} text="ANÉMIE !" size={80} />
			</Camera>
			<Flash at={HUIT} max={0.35} />
			<Sfx name="gasp" at={ESS} volume={0.35} />
			<Sfx name="ding" at={SEUL + 2} volume={0.25} />
			<Sfx name="whoosh" at={VERD - 2} volume={0.2} />
			<Sfx name="impact" at={HUIT} volume={0.45} />
			<Sfx name="stamp" at={ANEM} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'EDTA ═══════════════════════════════ */
export const Edta: React.FC = () => {
	const ADD = at('edta', 'additif');
	const EDTA = at('edta', "l'edta.");
	const CAPT = at('edta', 'capture');
	const CA = at('edta', 'calcium');
	const SANS = at('edta', 'sans');
	const COAG = at('edta', 'coaguler.');
	const RES = at('edta', 'résultat');
	const LIQ = at('edta', 'liquide,');
	const CELL = at('edta', 'cellules');
	const HEMA = at('edta', "l'hématologie");
	const ETUDE = at('edta', "l'étude");
	const ions = [
		[600, 560],
		[930, 600],
		[640, 900],
		[960, 880],
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[EDTA + 1, CAPT + 1, COAG + 1, CELL + 1, HEMA + 1]} strength={0.03}>
				<Big from={0} to={HEMA - 4} text={'Un additif :\n*l\'EDTA*'} size={110} />
				<HeroTube at={-2} additive={(f) => fadeIn(f, ADD, 8)} />
				<PTag at={EDTA} to={CAPT - 4} x={700} y={1180} px={260} py={1200}>
					l'EDTA
				</PTag>
				{/* il capture le calcium */}
				<Pop at={CAPT - 4} to={RES - 4} x={790} y={730}>
					<Live render={(f) => <Claw size={230} bite={interpolate(f, [CA + 6, CA + 14, CA + 20, CA + 28], [0, 1, 0, 1], clamp)} />} />
				</Pop>
				{ions.map(([x, y], i) => (
					<Live
						key={i}
						render={(f) => {
							if (f < CAPT || f > RES + 4) return null;
							const k = interpolate(f, [CA + 4 + i * 4, CA + 14 + i * 4], [0, 1], ease);
							return (
								<div style={{position: 'absolute', left: x + (770 - x) * k - 45, top: y + (720 - y) * k - 45, transform: `scale(${popAt(f, CAPT + i * 3) * (1 - 0.8 * k)})`, opacity: 1 - k * 0.9}}>
									<Ion label="Ca²⁺" size={90} />
								</div>
							);
						}}
					/>
				))}
				<Pop at={SANS} to={RES - 4} x={790} y={1150}>
					<ClotIcon size={190} />
				</Pop>
				<Cross at={COAG} x={880} y={1080} to={RES - 4} />
				<Note at={SANS + 4} to={RES - 4} y={1290} size={44} x={490}>
					sans calcium : pas de caillot
				</Note>
				{/* le sang reste liquide, les cellules entières */}
				<Note at={LIQ - 4} to={HEMA - 4} y={560} size={44} x={500}>
					le sang reste liquide
				</Note>
				<Pop at={CELL} to={HEMA - 4} x={600} y={850}>
					<RedCell size={170} />
				</Pop>
				<Pop at={CELL + 4} to={HEMA - 4} x={830} y={800}>
					<WhiteCell size={170} />
				</Pop>
				<Pop at={CELL + 8} to={HEMA - 4} x={740} y={1020}>
					<Platelet size={110} />
				</Pop>
				<Note at={CELL + 12} to={HEMA - 4} y={1150} size={44} x={490}>
					des cellules bien entières
				</Note>
				<Big from={HEMA} text={'Le tube de\n*l\'hématologie*'} size={104} />
				<Pop at={HEMA + 4} x={790} y={860}>
					<div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
						<RedCell size={130} />
						<WhiteCell size={130} kind="lympho" />
						<Platelet size={90} />
					</div>
				</Pop>
				<Note at={ETUDE} y={1150} size={46} x={470}>
					l'étude des cellules du sang
				</Note>
			</Camera>
			<Sfx name="ding" at={ADD} volume={0.18} />
			<Sfx name="pop" at={CAPT} volume={0.2} />
			<Sfx name="pop" at={CA + 14} volume={0.2} />
			<Sfx name="buzz" at={COAG} volume={0.2} />
			<Sfx name="pop" at={CELL} volume={0.18} />
			<Sfx name="whoosh" at={HEMA} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA NFS ═══════════════════════════════ */
const FAMILIES: {kind: 'pnn' | 'lympho' | 'mono'; label: string}[] = [
	{kind: 'pnn', label: 'famille 1'},
	{kind: 'lympho', label: 'famille 2'},
	{kind: 'mono', label: 'famille 3'},
];

export const Nfs: React.FC = () => {
	const frame = useCurrentFrame();
	const NFS = at('nfs', 'nfs,');
	const NUM = at('nfs', 'numération');
	const FORM = at('nfs', 'formule');
	const SANG = at('nfs', 'sanguine.');
	const COMPT = at('nfs', 'compter');
	const FORM2 = at('nfs', 'formule', 2);
	const FAM = at('nfs', 'familles');
	const rows = [
		{l: 'N', w: 'Numération', t: NUM},
		{l: 'F', w: 'Formule', t: FORM},
		{l: 'S', w: 'Sanguine', t: SANG},
	];
	const count = Math.floor(interpolate(frame, [COMPT, COMPT + 40], [0, 12], clamp));
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[NFS + 1, NUM + 1, COMPT + 1, FORM2 + 1]} strength={0.03}>
				<Big from={-2} text={'Son examen star :\nla *NFS*'} size={104} />
				{rows.map((r, i) => (
					<Pop key={r.l} at={NFS + i * 4} x={540} y={520 + i * 130}>
						<div style={{width: 820, display: 'flex', alignItems: 'center', gap: 26}}>
							<div style={{width: 110, height: 110, borderRadius: 55, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 66, color: N}}>{r.l}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 62, color: N, opacity: fadeIn(frame, r.t, 6)}}>{r.w}</div>
						</div>
					</Pop>
				))}
				{/* numération = compter */}
				<Pop at={COMPT - 4} to={FORM2 - 4} x={540} y={1150}>
					<div style={{width: 900, height: 330, boxSizing: 'border-box', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, position: 'relative'}}>
						{[...Array(12)].map((_, i) =>
							i < count ? (
								<div key={i} style={{position: 'absolute', left: 30 + (i % 6) * 100, top: 40 + Math.floor(i / 6) * 130}}>
									<RedCell size={90} />
								</div>
							) : null,
						)}
						<div style={{position: 'absolute', right: 30, top: 90, width: 190, height: 150, borderRadius: 30, background: LPI.pink, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: N, fontVariantNumeric: 'tabular-nums'}}>{count}</div>
					</div>
				</Pop>
				<Note at={COMPT + 6} to={FORM2 - 4} y={1350} size={46}>
					numération = compter
				</Note>
				{/* formule = les familles de globules blancs */}
				{FAMILIES.map((fm, i) => (
					<Pop key={fm.kind} at={FAM + i * 5} x={240 + i * 300} y={1120}>
						<div style={{width: 260, height: 300, boxSizing: 'border-box', borderRadius: 36, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
							<WhiteCell size={150} kind={fm.kind} />
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: N}}>{fm.label}</div>
						</div>
					</Pop>
				))}
				<Note at={FORM2 + 4} y={1330} size={46}>
					formule = les familles de globules blancs
				</Note>
			</Camera>
			{rows.map((r, i) => (
				<Sfx key={r.l} name="pop" at={NFS + i * 4} volume={0.18} />
			))}
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={i} name="tick" at={COMPT + i * 7} volume={0.1} />
			))}
			{FAMILIES.map((fm, i) => (
				<Sfx key={fm.kind} name="pop" at={FAM + i * 5} volume={0.15} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ GLOBULES ROUGES ═══════════════════════════════ */
export const Rouges: React.FC = () => {
	const ROUGES = at('rouges', 'rouges.');
	const TRANS = at('rouges', 'transportent');
	const HB = at('rouges', "l'hémoglobine.");
	const BASSE = at('rouges', 'basse,');
	const ANEM = at('rouges', 'anémie');
	const PAT = at('rouges', 'patient');
	const TAILLE = at('rouges', 'taille');
	const VGM = at('rouges', 'vgm,');
	const out = TAILLE - 4;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[ROUGES + 1, HB + 1, BASSE + 1, ANEM + 1, TAILLE + 1, VGM + 1]} strength={0.03}>
				<Big from={-2} text={'Les globules\n*rouges*'} size={110} />
				{/* le vaisseau : les globules transportent l'oxygène */}
				<Live
					render={(f) => {
						if (f > BASSE + 8) return null;
						const o = interpolate(f, [BASSE, BASSE + 7], [1, 0], clamp);
						return (
							<div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 300, opacity: o, overflow: 'hidden'}}>
								<div style={{position: 'absolute', left: -20, right: -20, top: 20, height: 260, background: alpha('#F3C3C8', 0.9), borderTop: `8px solid ${N}`, borderBottom: `8px solid ${N}`}} />
								{[0, 1, 2, 3, 4].map((k) => {
									const x = ((f * 4 + k * 250) % 1300) - 150;
									return (
										<div key={k} style={{position: 'absolute', left: x, top: 80 + (k % 2) * 50}}>
											<RedCell size={130} />
											{f >= TRANS ? <div style={{position: 'absolute', right: -24, top: -20, width: 60, height: 60, borderRadius: 30, background: '#fff', border: `4px solid ${LPI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 24, color: LPI.blue, transform: `scale(${popAt(f, TRANS + k * 2)})`}}>O₂</div> : null}
										</div>
									);
								})}
							</div>
						);
					}}
				/>
				<Note at={HB} to={BASSE - 4} y={930} size={48}>
					grâce à l'hémoglobine
				</Note>
				{/* trop basse : l'anémie */}
				<Pop at={BASSE} to={out} x={540} y={680}>
					<Live render={(f) => <HbGauge value={interpolate(f, [BASSE, BASSE + 20], [14, 8], ease)} />} />
				</Pop>
				<Note at={ANEM} to={out} y={830} size={56} tone={LPI.pink}>
					= une anémie
				</Note>
				<Fly at={PAT - 4} out={out} x={540} y={1250} from="bottom" to="bottom">
					<Live render={(f) => <Patient size={330} mood="mal" pale={1} breath={0.5 + 0.5 * Math.sin(f / 3)} />} />
				</Fly>
				{/* le VGM : la taille des globules rouges */}
				{[0.7, 1, 1.35].map((s, i) => (
					<Pop key={i} at={TAILLE + i * 4} x={250 + i * 290} y={820}>
						<div style={{width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<RedCell size={150 * s} />
						</div>
					</Pop>
				))}
				{['petits', 'normaux', 'gros'].map((w, i) => (
					<Pop key={w} at={TAILLE + 6 + i * 4} x={250 + i * 290} y={1000}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{w}</div>
					</Pop>
				))}
				<Note at={VGM} y={1140} size={50}>
					VGM = volume globulaire moyen
				</Note>
			</Camera>
			<Sfx name="whoosh" at={ROUGES} volume={0.12} />
			<Sfx name="pop" at={TRANS} volume={0.15} />
			<Sfx name="buzz" at={BASSE + 16} volume={0.2} />
			<Sfx name="pop" at={ANEM} volume={0.2} />
			<Sfx name="pop" at={TAILLE} volume={0.15} />
			<Sfx name="ding" at={VGM} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ GLOBULES BLANCS ═══════════════════════════════ */
export const Blancs: React.FC = () => {
	const frame = useCurrentFrame();
	const BLANCS = at('blancs', 'blancs');
	const DEF = at('blancs', 'défenseurs');
	const NOMB = at('blancs', 'nombreux,');
	const INF = at('blancs', 'infection.');
	const PEU = at('blancs', 'peu,');
	const MAL = at('blancs', 'mal');
	const FORM = at('blancs', 'formule');
	const POLY = at('blancs', 'polynucléaires,');
	const LYM = at('blancs', 'lymphocytes…');
	const many = frame >= NOMB && frame < PEU - 4;
	const few = frame >= PEU && frame < FORM - 4;
	const nCells = many ? 9 : few ? 1 : 3;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[BLANCS + 1, DEF + 1, NOMB + 1, PEU + 1, FORM + 1]} strength={0.03}>
				<Big from={-2} text={'Les globules\n*blancs*'} size={110} />
				{/* le terrain : globules blancs et microbes */}
				<Live
					render={(f) => {
						if (f < DEF - 4 || f > FORM + 4) return null;
						const o = interpolate(f, [FORM - 4, FORM + 3], [1, 0], clamp) * fadeIn(f, DEF - 4, 8);
						const microbes = few ? 7 : many ? 4 : 3;
						return (
							<div style={{position: 'absolute', left: 60, top: 520, width: 960, height: 640, borderRadius: 44, background: alpha(LPI.paper, 0.85), border: `6px solid ${N}`, opacity: o, overflow: 'hidden'}}>
								{[...Array(nCells)].map((_, i) => (
									<div key={`w${i}`} style={{position: 'absolute', left: 60 + ((i * 197) % 760), top: 60 + ((i * 131) % 440) + 10 * Math.sin(f / 6 + i)}}>
										<WhiteCell size={130} kind={(['pnn', 'lympho', 'mono'] as const)[i % 3]} />
									</div>
								))}
								{[...Array(microbes)].map((_, i) => (
									<div key={`m${i}`} style={{position: 'absolute', left: 120 + ((i * 263) % 700), top: 120 + ((i * 89) % 380) + 8 * Math.cos(f / 5 + i)}}>
										<Microbe size={80} seed={i} tone={LPI.pink} />
									</div>
								))}
							</div>
						);
					}}
				/>
				<Note at={DEF + 4} to={NOMB - 4} y={1220} size={48}>
					les défenseurs du corps
				</Note>
				<Arrow at={NOMB} to={PEU - 4} x={940} y={1250} />
				<Note at={INF - 4} to={PEU - 4} y={1220} size={48} tone={LPI.pink} x={120}>
					infection ?
				</Note>
				<Arrow at={PEU} to={FORM - 4} up={false} x={940} y={1250} />
				<Note at={MAL - 6} to={FORM - 4} y={1220} size={44} tone={LPI.pink} x={90}>
					il se défend mal
				</Note>
				{/* la formule : chaque famille */}
				<RowCard at={POLY - 4} y={560} h={240} badge="1" title="Polynucléaires" sub="noyau en plusieurs morceaux" subAt={POLY + 6} art={200}>
					<WhiteCell size={170} kind="pnn" />
				</RowCard>
				<RowCard at={LYM - 4} y={830} h={240} badge="2" title="Lymphocytes" sub="gros noyau tout rond" subAt={LYM + 6} art={200}>
					<WhiteCell size={170} kind="lympho" />
				</RowCard>
				<Pop at={LYM + 10} x={540} y={1180}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>…</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={DEF} volume={0.15} />
			<Sfx name="pop" at={NOMB} volume={0.2} />
			<Sfx name="buzz" at={PEU + 4} volume={0.15} />
			<Sfx name="whoosh" at={POLY - 4} volume={0.15} />
			<Sfx name="whoosh" at={LYM - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAQUETTES ═══════════════════════════════ */
export const Plaquettes: React.FC = () => {
	const PLAQ = at('plaquettes', 'plaquettes');
	const BOUCH = at('plaquettes', 'bouchent');
	const PEU = at('plaquettes', 'peu');
	const SAIGNE = at('plaquettes', 'saigne');
	const BLEUS = at('plaquettes', 'bleus,');
	const NEZ = at('plaquettes', 'nez,');
	const GENC = at('plaquettes', 'gencives.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[PLAQ + 1, BOUCH + 1, PEU + 1, BLEUS + 1]} strength={0.03}>
				<Big from={-2} text={'Les *plaquettes*'} size={116} />
				{/* paroi du vaisseau avec une brèche */}
				<Live
					render={(f) => {
						const few = f >= PEU;
						const plug = few ? 0.25 : interpolate(f, [BOUCH, BOUCH + 24], [0, 1], ease);
						const leak = few ? interpolate(f, [PEU + 6, PEU + 20], [0, 1], clamp) : 1 - plug;
						return (
							<svg width={1080} height={760} style={{position: 'absolute', left: 0, top: 440}}>
								<rect x={0} y={60} width={1080} height={300} fill="#F3C3C8" />
								<path d="M0 360 H470 M610 360 H1080" stroke={N} strokeWidth={12} />
								<path d="M0 60 H1080" stroke={N} strokeWidth={12} />
								<path d="M470 360 L500 392 M610 360 L582 392" stroke={N} strokeWidth={10} strokeLinecap="round" />
								{[0, 1, 2, 3].map((k) => {
									const x = ((f * 3 + k * 280) % 1200) - 100;
									return <ellipse key={k} cx={x} cy={170 + (k % 2) * 70} rx={52} ry={40} fill="#D43A44" stroke={N} strokeWidth={4} />;
								})}
								{[0, 1, 2, 3, 4, 5].map((k) => {
									const kk = Math.min(1, Math.max(0, plug * 6 - k));
									if (kk <= 0) return null;
									const tx = 470 + (k % 3) * 46 + 20;
									const ty = 350 + Math.floor(k / 3) * 34;
									return <ellipse key={`p${k}`} cx={tx + (1 - kk) * (k - 2.5) * 80} cy={ty - (1 - kk) * 200} rx={26} ry={18} fill="#E9B7C9" stroke={N} strokeWidth={3} />;
								})}
								{leak > 0
									? [0, 1, 2].map((k) => {
											const t = ((f / 18 + k / 3) % 1) * leak;
											return <path key={`d${k}`} d={`M540 ${400 + t * 300} q14 22 0 32 q-14 -10 0 -32 Z`} fill={BLOOD} stroke={N} strokeWidth={3} opacity={leak} />;
										})
									: null}
							</svg>
						);
					}}
				/>
				<Note at={BOUCH + 6} to={PEU - 4} y={1220} size={46}>
					elles bouchent la brèche
				</Note>
				<Arrow at={PEU} up={false} x={930} y={680} />
				<Note at={SAIGNE} to={BLEUS - 4} y={1220} size={46} tone={LPI.pink}>
					le patient saigne plus facilement
				</Note>
				{[
					{t: BLEUS, w: 'des bleus'},
					{t: NEZ, w: 'le nez'},
					{t: GENC, w: 'les gencives'},
				].map((c, i) => (
					<Pop key={c.w} at={c.t} x={220 + i * 320} y={1250}>
						<div style={{padding: '18px 30px', borderRadius: 999, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>{c.w}</div>
					</Pop>
				))}
			</Camera>
			<Sfx name="pop" at={BOUCH} volume={0.2} />
			<Sfx name="buzz" at={PEU + 4} volume={0.15} />
			<Sfx name="pop" at={BLEUS} volume={0.15} />
			<Sfx name="pop" at={NEZ} volume={0.15} />
			<Sfx name="pop" at={GENC} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ GROUPE SANGUIN, HÉMOGLOBINE GLYQUÉE ═══════════════════════════════ */
const BloodBag: React.FC<{size?: number}> = ({size = 180}) => (
	<svg width={size} height={size * 1.3} viewBox="0 0 180 234">
		<rect x={70} y={4} width={40} height={30} rx={8} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<path d="M24 40 H156 Q170 40 170 56 V190 Q170 222 138 222 H42 Q10 222 10 190 V56 Q10 40 24 40 Z" fill={BLOOD} stroke={N} strokeWidth={6} />
		<rect x={40} y={90} width={100} height={70} rx={10} fill="#fff" stroke={N} strokeWidth={4} />
		<text x={90} y={138} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
			A+
		</text>
	</svg>
);

export const Autres: React.FC = () => {
	const AUSSI = at('autres', 'aussi');
	const GROUPE = at('autres', 'groupe');
	const TRANSF = at('autres', 'transfusion.');
	const HB = at('autres', "l'hémoglobine");
	const DIAB = at('autres', 'diabétique');
	const SUCRE = at('autres', 'sucre');
	const MOIS = at('autres', 'mois.');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[GROUPE + 1, TRANSF + 1, HB + 1, SUCRE + 1]} strength={0.03}>
				<Big from={-2} text={'Le violet sert\n*aussi*…'} size={110} />
				<RowCard at={GROUPE - 4} y={520} h={300} badge="1" title="Le groupe sanguin" sub="avant une transfusion" subAt={TRANSF} art={260}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						{['A', 'B', 'O'].map((g, i) => (
							<div key={g} style={{width: 66, height: 66, borderRadius: 33, background: [LPI.pink, LPI.sky, LPI.paper][i], border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>{g}</div>
						))}
					</div>
				</RowCard>
				<Pop at={TRANSF} x={900} y={430}>
					<BloodBag size={150} />
				</Pop>
				<RowCard at={HB - 4} y={870} h={300} badge="2" title="L'hémoglobine glyquée" sub="le sucre des 3 derniers mois" subAt={SUCRE} art={260}>
					<Live render={(f) => <GlycatedCell width={200} coat={interpolate(f, [DIAB, MOIS + 10], [0.2, 1], ease)} />} />
				</RowCard>
				{[0, 1, 2].map((i) => (
					<Pop key={i} at={SUCRE + i * 4} x={360 + i * 120} y={1290}>
						<SugarCube size={84} />
					</Pop>
				))}
				{['M-3', 'M-2', 'M-1'].map((m, i) => (
					<Pop key={m} at={MOIS - 8 + i * 4} x={760 + i * 100} y={1290}>
						<div style={{width: 86, height: 86, borderRadius: 18, background: LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N}}>{m}</div>
					</Pop>
				))}
			</Camera>
			<Sfx name="whoosh" at={GROUPE - 4} volume={0.15} />
			<Sfx name="pop" at={TRANSF} volume={0.18} />
			<Sfx name="whoosh" at={HB - 4} volume={0.15} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="pop" at={SUCRE + i * 4} volume={0.12} />
			))}
			<Sfx name="ding" at={MOIS} volume={0.15} />
			<Sfx name="pop" at={AUSSI} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PIÈGE ═══════════════════════════════ */
export const Piege: React.FC = () => {
	const ATT = at('piege', 'attention');
	const JAM = at('piege', 'jamais');
	const K = at('piege', 'potassium');
	const FAUX = at('piege', 'faux.');
	const ORDRE = at('piege', "l'ordre");
	const VIOL = at('piege', 'violet');
	const VERT = at('piege', 'vert…');
	const GRIS = at('piege', 'gris.');
	const out = ORDRE - 4;
	const idx = [0, 1, 2, 3, 4, 5, 6];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[JAM + 1, K + 1, FAUX + 1, VIOL + 1, GRIS + 1]} strength={0.03}>
				<Big from={ATT - 2} to={out} text={'Jamais\n*d\'ionogramme* !'} size={110} />
				<HeroTube at={-2} out={out} x={330} y={960} taint={(f) => interpolate(f, [K, K + 20], [0, 0.8], ease)} taintColor={LPI.pink} />
				{[0, 1, 2].map((i) => (
					<Pop key={i} at={K + i * 4} to={out} x={640 + i * 130} y={820 + (i % 2) * 90}>
						<Ion label="K⁺" size={100} tone={LPI.pink} />
					</Pop>
				))}
				<Note at={K + 6} to={out} y={1040} size={44} x={540}>
					l'EDTA contient du potassium
				</Note>
				<Cross at={FAUX} x={800} y={1230} to={out} size={130} />
				<Note at={FAUX + 4} to={out} y={1340} size={46} x={470} tone={LPI.pink}>
					potassium faux
				</Note>
				{/* l'ordre : après le vert, avant le gris */}
				<Big from={ORDRE} text={'Dans *l\'ordre*…'} size={116} />
				<OrderRail y={900} at={ORDRE - 2} fill={idx.map((i) => ORDRE + i * 3)} labels={idx.map((i) => ORDRE + i * 3 + 2)} cur={-1} scale={1.05} first="both" />
				<Live
					render={(f) => {
						const W = 130;
						const G = 10;
						const x0 = 540 - (7 * W + 6 * G) / 2;
						const cx = (i: number) => 540 + (x0 + i * (W + G) + W / 2 - 540) * 1.05;
						return (
							<>
								{f >= VIOL ? <div style={{position: 'absolute', left: cx(5) - 75, top: 900 - 125, width: 150, height: 250, borderRadius: 32, border: `9px solid ${LPI.pink}`, transform: `scale(${popAt(f, VIOL)})`}} /> : null}
								{f >= VERT - 4 ? <div style={{position: 'absolute', left: cx(4) - 40, top: 1110, fontFamily: FONT.body, fontWeight: 900, fontSize: 34, color: N, transform: `scale(${popAt(f, VERT - 4)})`}}>après</div> : null}
								{f >= GRIS - 4 ? <div style={{position: 'absolute', left: cx(6) - 46, top: 1110, fontFamily: FONT.body, fontWeight: 900, fontSize: 34, color: N, transform: `scale(${popAt(f, GRIS - 4)})`}}>avant</div> : null}
							</>
						);
					}}
				/>
			</Camera>
			<Sfx name="buzz" at={JAM} volume={0.2} />
			<Sfx name="pop" at={K} volume={0.18} />
			<Sfx name="buzz" at={FAUX} volume={0.2} />
			{idx.map((i) => (
				<Sfx key={i} name="tick" at={ORDRE + i * 3} volume={0.1} />
			))}
			<Sfx name="ding" at={VIOL} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES GESTES ═══════════════════════════════ */
export const Gestes: React.FC = () => {
	const RET = at('gestes', 'retourne-le');
	const HUIT = at('gestes', 'huit');
	const SANS = at('gestes', 'sans');
	const CAILL = at('gestes', 'caillots');
	const PLAQ = at('gestes', 'plaquettes');
	const BASSES = at('gestes', 'basses.');
	const PART = at('gestes', 'part');
	const LABO = at('gestes', 'labo.');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[RET + 1, HUIT + 1, SANS + 1, CAILL + 1, PART + 1]} strength={0.03}>
				<Big from={-2} to={CAILL - 4} text={'On le *retourne*\n*doucement*'} size={104} />
				<Fly at={-2} out={PART + 4} x={330} y={960} from="left" to="right" dist={1600}>
					<Live
						render={(f) => {
							const t = interpolate(f, [RET, RET + 80], [0, 4], clamp);
							const rot = (180 * (1 - Math.cos(t * Math.PI))) / 2;
							return (
								<div style={{transform: `rotate(${rot}deg)`}}>
									<Tube size={140} cap={VIOLET} label="EDTA" level={0.72} taint={interpolate(f, [CAILL, CAILL + 16, PART - 4, PART], [0, 0.7, 0.7, 0], clamp)} taintColor={BLOOD_DARK} />
								</div>
							);
						}}
					/>
				</Fly>
				<Pop at={HUIT} to={CAILL - 4} x={780} y={760}>
					<div style={{padding: '20px 40px', borderRadius: 40, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>8 à 10 fois</div>
				</Pop>
				<Fly at={SANS - 4} out={CAILL - 4} x={780} y={1060} from="right" to="right">
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f * 1.4) * 24}deg)`}}><Tube size={80} cap={VIOLET} level={0.72} /></div>} />
				</Fly>
				<Cross at={SANS + 2} x={900} y={950} to={CAILL - 4} size={100} />
				<Big from={CAILL} to={PART - 4} text={'Sinon : des\n*caillots*'} size={104} />
				<PTag at={CAILL + 6} to={PART - 4} x={760} y={760} px={340} py={1060}>
					petits caillots
				</PTag>
				<Note at={PLAQ} to={PART - 4} y={1150} size={44} x={520} tone={LPI.pink}>
					plaquettes faussement basses
				</Note>
				<Arrow at={BASSES} to={PART - 4} up={false} x={790} y={1310} />
				<Big from={PART} text={'Vite\nau *labo* !'} size={116} />
				<Pop at={LABO} x={700} y={960}>
					<div style={{padding: '22px 44px', borderRadius: 40, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N}}>→ LABO</div>
				</Pop>
			</Camera>
			<Sfx name="whoosh" at={RET} volume={0.12} />
			<Sfx name="buzz" at={SANS + 2} volume={0.15} />
			<Sfx name="buzz" at={BASSES} volume={0.15} />
			<Sfx name="whoosh" at={PART + 4} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + LA SÉRIE ═══════════════════════════════ */
const SERIES_CAPS = [HEMO_CAP.aero, CAP.citrate, CAP.gel, CAP.sec, CAP.hepar, CAP.edta, CAP.fluor];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const REC = at('fin', 'récapitule');
	const TUBE = at('fin', 'violet,');
	const HEMA = at('fin', "l'hématologie.");
	const NFS = at('fin', 'nfs');
	const ROUGES = at('fin', 'rouges,');
	const PLAQ = at('fin', 'plaquettes.');
	const GROUPE = at('fin', 'groupe');
	const HBG = at('fin', "l'hémoglobine");
	const PROCH = at('fin', 'prochain');
	const SERIE = at('fin', 'série');
	const out = PROCH - 4;
	const rows = [
		{t: TUBE, title: 'Tube violet = EDTA', sub: 'pas de caillot'},
		{t: HEMA, title: "L'hématologie", sub: 'les cellules du sang'},
		{t: NFS, title: 'La NFS', sub: 'rouges · blancs · plaquettes', subAt: ROUGES},
		{t: GROUPE, title: 'Groupe sanguin', sub: 'avant une transfusion'},
		{t: HBG, title: 'Hémoglobine glyquée', sub: 'le sucre des 3 mois'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[REC + 1, ...rows.map((r) => r.t + 1), SERIE + 1]} strength={0.025}>
				<Big from={-2} to={out} text={'On *récapitule*'} size={116} />
				{rows.map((r, i) => (
					<Live key={r.title} render={(f) => (f > out + 10 ? null : <div style={{opacity: interpolate(f, [out, out + 8], [1, 0], clamp)}}><RowCard at={r.t - 2} y={360 + i * 190} h={170} badge={String(i + 1)} title={r.title} sub={r.sub} subAt={r.subAt ?? r.t + 6} check={i === 2 ? PLAQ : r.t + 14} size={46} /></div>)} />
				))}
				{/* la série : les autres tubes arrivent */}
				<Big from={PROCH} text={'La série\ndes *tubes*'} size={116} />
				{SERIES_CAPS.map((c, i) => {
					const t0 = PROCH + 2 + i * 3;
					if (frame < t0) return null;
					const done = i === 5;
					return (
						<div key={i} style={{position: 'absolute', left: 540 + (i - 3) * 138 - 60, top: 640, width: 120, height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${popAt(frame, t0)})`, opacity: done ? 1 : 0.55}}>
							{i === 0 ? <HemoFlask size={100} label="" cap={c} /> : <Tube size={90} cap={c} level={done ? 0.72 : 0} />}
							<div style={{marginTop: 18, width: 70, height: 70, borderRadius: 35, background: done ? LPI.blue : LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: done ? LPI.paper : N}}>{done ? '✓' : '?'}</div>
						</div>
					);
				})}
				<Note at={SERIE + 4} y={1260} size={52} tone={LPI.pink}>
					le prochain arrive bientôt !
				</Note>
			</Camera>
			<Confetti at={SERIE} />
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.15} />
			))}
			<Sfx name="whoosh" at={PROCH} volume={0.15} />
			<Sfx name="ding" at={SERIE} volume={0.25} />
		</AbsoluteFill>
	);
};
