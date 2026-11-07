// Série « Le diabète », partie 2 / 2 : le découvrir et le soigner (voix +0 %, animations posées). Accroche « il va très
// bien… » (image 0 : le patient sourit, « Il va très bien… vraiment ? » ; trois pastilles cochées : pas soif, pas fatigué,
// en pleine forme ; « Et pourtant » : flash, du sucre dans le corps, la caméra va aux yeux, aux reins, puis le pied
// s'abîme ; « aucun bruit » : sourdine ; « comment le repérer à temps ? »), carte de la série (partie 1 cochée), le
// découvrir (signes, souvent silencieux, à jeun ≥ 1,26 g/L sur deux prises de sang), complications, traitement (type 2 :
// comprimés, parfois insuline ; type 1 : insuline toujours ; HbA1c), ton rôle, récap + « série terminée ».
// Briques : src/brand/diabetes.tsx (+ glyco.tsx, wound.tsx, pain.tsx).
import React, {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BrainIcon, DIABETE_PARTS, GlycatedCell, InjectionSites, InsulinPen, KidneysIcon, Plate, VideoLink} from '../../brand/diabetes';
import {CamKey, CauseChip, Head, Pill, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {Glucometer, SugarCube} from '../../brand/glyco';
import {EyeIcon, LegIcon, PillIcon, RunIcon, ThirstIcon, TiredIcon, UrineIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {NormScale, Zone} from '../../brand/NormScale';
import {MuteIcon} from '../../brand/pain';
import {Patient} from '../../brand/patient';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {LowerLeg} from '../../brand/wound';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
const fadeIn = (frame: number, a: number, d = 10) => interpolate(frame, [a, a + d], [0, 1], clamp);
/** Pop plus posé que d'habitude (ressort plus lent, ~10 % de dépassement). */
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.1 * Math.exp(-(frame - t0) / 5) * Math.cos((frame - t0) * 0.55) - Math.exp(-(frame - t0) / 3.2));
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; max?: number}> = ({at: t0, max = 0.45}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 18], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, o * 0.4)} 20%, ${alpha(LPI.pink, o)} 100%)`}} />;
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; stagger?: number}> = ({from, to = 1e9, text, size = 92, y = 236, stagger = 4}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 8) return null;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, opacity: interpolate(frame, [to, to + 8], [1, 0], clamp)}}>
			<Title at={from} text={text} size={size} stagger={stagger} />
		</div>
	);
};

/** Petite pastille (« ? », « ! ») qui tangue. */
const Badge: React.FC<{at: number; until?: number; x: number; y: number; text: string; tone?: string; size?: number}> = ({at: t0, until = 1e9, x, y, text, tone = LPI.pink, size = 100}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= until) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.6, color: tone === LPI.blue ? LPI.paper : N, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 8) * 7}deg)`}}>
			{text}
		</div>
	);
};

/** Petit cœur (icône des pastilles). */
const HeartIco: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		<path d="M0 32 C-46 -4 -30 -52 0 -26 C30 -52 46 -4 0 32 Z" fill={LPI.pink} stroke={N} strokeWidth={7} strokeLinejoin="round" />
	</svg>
);

/** Coche ronde (pastilles « tout va bien »). */
const OkIco: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={42} fill={LPI.sky} stroke={N} strokeWidth={7} />
		<path d="M30 52 L45 66 L72 36" fill="none" stroke={N} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Repères roses sur les organes du `Patient` (yeux, reins), dans son repère 400 × 560. */
const OrganMarks: React.FC<{x: number; y: number; size: number; eyes: number; kidneys: number}> = ({x, y, size, eyes, kidneys}) => {
	const frame = useCurrentFrame();
	const id = useId();
	return (
		<svg key={id} width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
			{eyes > 0 ? [176, 224].map((cx) => <circle key={cx} cx={cx} cy={118} r={18 + 3 * Math.sin(frame / 4)} fill="none" stroke={LPI.pink} strokeWidth={7} opacity={eyes} />) : null}
			{kidneys > 0
				? [
						[156, 405, 1],
						[244, 405, -1],
					].map(([kx, ky, s]) => (
						<path key={kx} d="M0 -30 C22 -30 30 -14 28 2 C26 22 14 32 -2 30 C-14 28 -12 14 -8 4 C-2 -4 -14 -10 -16 -16 C-20 -28 -12 -30 0 -30 Z" transform={`translate(${kx} ${ky}) scale(${s} 1)`} fill={alpha(LPI.pink, 0.85)} stroke={N} strokeWidth={5} opacity={kidneys} />
					))
				: null}
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Il va très bien… vraiment ? », le patient sourit. Pastilles cochées au mot : pas soif, pas fatigué, en
// pleine forme. « Et pourtant » : flash rose, les pastilles pâlissent, du sucre circule dans son corps ; la caméra va
// aux yeux puis aux reins (repères roses), le pied apparaît et sa plaie s'agrandit ; « aucun bruit » : sourdine ;
// « comment le repérer à temps ? » : le lecteur de glycémie avec un « ? ».
const HP = {x: 70, y: 470, size: 470};
const hpPt = (px: number, py: number) => ({x: HP.x + (px * HP.size) / 400, y: HP.y + (py * HP.size) / 400});
const HLEG = {x: 650, y: 560, w: 300};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SOIF = at('intro', 'soif');
	const FATI = at('intro', 'fatigué…');
	const FORME = at('intro', 'forme');
	const POURT = at('intro', 'pourtant');
	const ANNEES = at('intro', 'années');
	const SUCRE = at('intro', 'sucre');
	const ABIME = at('intro', 'abîme');
	const YEUX = at('intro', 'yeux');
	const REINS = at('intro', 'reins');
	const PIEDS = at('intro', 'pieds');
	const SON = at('intro', 'son');
	const BRUIT = at('intro', 'bruit…');
	const ALORS = at('intro', 'alors');
	const REPER = at('intro', 'repérer');
	const TEMPS = at('intro', 'temps');
	const eye = hpPt(200, 118);
	const kid = hpPt(200, 405);
	const keys: CamKey[] = [
		{at: YEUX - 6, s: 1.9, x: eye.x + 20, y: eye.y + 40, dur: 18},
		{at: REINS - 6, s: 1.5, x: kid.x + 60, y: kid.y - 40, dur: 16},
		{at: PIEDS - 6, s: 1, dur: 18},
	];
	const okDim = 1 - 0.65 * fadeIn(frame, POURT - 2, 10);
	const sugar = fadeIn(frame, SUCRE - 4, 12);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FORME + 1, POURT + 1, PIEDS + 1, BRUIT + 1, TEMPS + 1]} shakes={[POURT + 2]} strength={0.03}>
				<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
					<div style={{position: 'absolute', left: HP.x, top: HP.y}}>
						<Patient size={HP.size} breath={idle(frame)} mood={frame < POURT ? 'content' : 'calme'} flow={fadeIn(frame, SUCRE - 6, 10)} heart={fadeIn(frame, SUCRE - 6, 10)} beat={pulseAt(frame, 26)} />
					</div>
					{/* le sucre en trop qui circule dans le corps */}
					{sugar > 0
						? Array.from({length: 7}, (_, i) => {
								const p = hpPt(150 + ((i * 37) % 110), 250 + ((i * 53) % 260));
								return (
									<div key={i} style={{position: 'absolute', left: p.x + Math.sin(frame / 9 + i) * 10, top: p.y + Math.cos(frame / 11 + i) * 8, opacity: sugar * Math.min(1, fadeIn(frame, SUCRE - 4 + i * 2, 6)), transform: `scale(${0.8 + 0.2 * popAt(frame, SUCRE - 4 + i * 2)})`}}>
										<SugarCube size={34} rot={frame + i * 30} />
									</div>
								);
							})
						: null}
					<OrganMarks x={HP.x} y={HP.y} size={HP.size} eyes={interpolate(frame, [YEUX - 2, YEUX + 6, BRUIT, BRUIT + 10], [0, 1, 1, 0.4], clamp)} kidneys={fadeIn(frame, REINS - 2, 8)} />
					{frame >= PIEDS - 6 ? (
						<div style={{position: 'absolute', left: HLEG.x, top: HLEG.y, transform: `scale(${popAt(frame, PIEDS - 6)})`, transformOrigin: '50% 100%'}}>
							<LowerLeg width={HLEG.w} footSore={fadeIn(frame, PIEDS, 8)} grow={interpolate(frame, [PIEDS + 4, SON + 10], [0, 0.8], clamp)} numb={fadeIn(frame, PIEDS + 8, 8)} />
						</div>
					) : null}
				</ZoomCam>
				{/* tout va bien… */}
				<div style={{position: 'absolute', left: 72, top: 1240, opacity: okDim}}>
					<CauseChip at={SOIF - 3} icon={<OkIco />} label="pas soif" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 520, top: 1240, opacity: okDim}}>
					<CauseChip at={FATI - 3} icon={<OkIco />} label="pas fatigué" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1356, opacity: okDim}}>
					<CauseChip at={FORME - 3} icon={<OkIco />} label="en pleine forme" tone={LPI.sky} />
				</div>
				{/* … et pourtant */}
				<StagePill from={ANNEES - 2} to={YEUX - 6} x={520} y={1370} color={LPI.pink}>
					depuis des années…
				</StagePill>
				<StagePill from={ABIME - 2} to={SON - 6} x={520} y={1370} color={LPI.pink}>
					le sucre abîme
				</StagePill>
				{frame >= SON - 4 && frame < ALORS ? (
					<div style={{position: 'absolute', left: 860, top: 470, transform: `scale(${popAt(frame, SON - 4)}) rotate(-8deg)`, opacity: 1 - fadeIn(frame, ALORS - 8, 8)}}>
						<div style={{width: 150, height: 150, borderRadius: 75, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<MuteIcon size={100} />
						</div>
					</div>
				) : null}
				{frame >= ALORS - 4 ? (
					<div style={{position: 'absolute', left: 700, top: 470, transform: `scale(${popAt(frame, ALORS - 4) * 0.62})`, transformOrigin: '50% 0'}}>
						<Glucometer value={0} strip={1} blood={0} tone={null} beep={0} />
					</div>
				) : null}
				<Badge at={REPER - 2} x={748} y={452} text="?" size={110} />
				{/* titres */}
				<TitleAt from={-60} to={POURT - 6} text={'Il va *très* *bien*…\nvraiment ?'} size={100} stagger={0} />
				<TitleAt from={POURT - 2} to={SON - 6} text={'Et *pourtant*…'} size={110} />
				<TitleAt from={SON - 2} to={ALORS - 6} text={'Aucun *bruit*…'} size={110} />
				<TitleAt from={ALORS - 2} text={'Comment le *repérer*\nà *temps* ?'} size={96} />
				<Burst at={POURT} x={540} y={760} r={340} n={16} />
			</Camera>
			<Flash at={POURT} max={0.35} />
			{[SOIF, FATI, FORME].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="ding" at={FORME + 4} volume={0.07} />
			<Sfx name="impact" at={POURT} volume={0.1} />
			<Sfx name="heartbeat" at={SUCRE - 6} volume={0.06} />
			<Sfx name="whoosh" at={YEUX - 6} volume={0.06} />
			<Sfx name="whoosh" at={REINS - 6} volume={0.06} />
			<Sfx name="pop" at={PIEDS - 6} volume={0.08} />
			<Sfx name="buzz" at={SON} volume={0.04} dur={12} />
			<Sfx name="pop" at={ALORS - 4} volume={0.08} />
			<Sfx name="tick" at={REPER - 2} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
// Carte de la série (partie 1 cochée, partie 2 en cours) ; « Aujourd'hui : le découvrir… et le soigner ».
export const Serie: React.FC = () => {
	const frame = useCurrentFrame();
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const DEUX = at('serie', 'deux');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const DECOUV = at('serie', 'découvrir…');
	const SOIGN = at('serie', 'soigner');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, SERIE + 1, SOIGN + 1]} shakes={[DEUX + 2]} strength={0.03}>
				<Head kicker="Série · Le diabète" kAt={NOUS - 4} title="Partie *2* sur 2" tAt={PART - 2} size={92} />
				<SeriesParts parts={DIABETE_PARTS} current={1} at={DEUX - 6} stagger={8} />
				{frame >= AUJ - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, AUJ - 2)})`}}>
						<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>Aujourd'hui :</div>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', gap: 22}}>
					{['le découvrir', 'le soigner'].map((t, i) => {
						const t0 = [DECOUV - 2, SOIGN - 2][i];
						return frame >= t0 ? (
							<div key={t} style={{padding: '12px 30px', borderRadius: 999, background: i === 0 ? LPI.sky : LPI.pink, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, transform: `scale(${popAt(frame, t0)})`}}>
								{t}
							</div>
						) : null;
					})}
				</div>
			</Camera>
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={DEUX - 6 + i * 8} volume={0.09} />
			))}
			<Sfx name="pop" at={DECOUV - 2} volume={0.08} />
			<Sfx name="ding" at={SOIGN} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE DÉCOUVRIR ═══════════════════════════════ */
// « Parfois » : les signes arrivent en pastilles (soif, urines, fatigue) ; « mais » : ils pâlissent, le patient va bien
// (« souvent aucun signe ») ; la prise de sang : 2 résultats à jeun ; l'échelle (normale · intermédiaire · diabète
// ≥ 1,26 g/L) ; « sur deux prises de sang » : tampon.
const DIAB_ZONES: Zone[] = [
	{name: 'normale', range: '0,70 – 1,10 g/L\n(3,9 – 6,1 mmol/L)', tone: 'norm', w: 1.25, lo: 0.7, hi: 1.1},
	{name: 'intermédiaire', range: '1,10 – 1,26', tone: 'mid', w: 0.95, lo: 1.1, hi: 1.26},
	{name: 'diabète', range: '≥ 1,26 g/L\n(≥ 7 mmol/L)', tone: 'high', w: 1.15, lo: 1.26, hi: 1.6},
];

const LabSlip: React.FC<{at: number; label: string; value: string; ok?: number}> = ({at: t0, label, value, ok = 0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{width: 250, borderRadius: 26, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, overflow: 'hidden', transform: `scale(${popAt(frame, t0)}) rotate(${-3 + (t0 % 5)}deg)`}}>
			<div style={{background: N, color: LPI.paper, fontFamily: FONT.body, fontWeight: 900, fontSize: 22, letterSpacing: '0.08em', padding: '8px 16px'}}>{label}</div>
			<div style={{padding: '10px 16px 14px', fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: alpha(N, 0.7)}}>
				glycémie à jeun
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: ok > 0.5 ? LPI.pink : N, lineHeight: 1.1}}>{value}</div>
			</div>
		</div>
	);
};

export const Diag: React.FC = () => {
	const frame = useCurrentFrame();
	const PARF = at('diag', 'parfois');
	const SOIF = at('diag', 'soif');
	const URIN = at('diag', "d'urines");
	const FATI = at('diag', 'fatigue');
	const MAIS = at('diag', 'mais');
	const SILE = at('diag', 'silencieux');
	const PRISE = at('diag', 'prise');
	const REVE = at('diag', 'révèle');
	const DIAB = at('diag', 'diabète');
	const JEUN = at('diag', 'jeun');
	const ATTE = at('diag', 'atteint');
	const VING = at('diag', 'vingt-six');
	const DEUX = at('diag', 'deux', 2);
	const PRISES = at('diag', 'prises');
	const chips = 1 - fadeIn(frame, PRISE - 8, 10);
	const dim = 1 - 0.6 * fadeIn(frame, MAIS, 10);
	const value = interpolate(frame, [ATTE - 2, VING + 14], [0.95, 1.32], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SILE + 1, PRISE + 1, VING + 1, PRISES + 1]} strength={0.025}>
				<Head kicker="Le découvrir" kAt={2} title="Souvent *silencieux*" tAt={8} />
				<Stage y={440} h={520} at={4} bumps={[SILE, PRISE, PRISES]}>
					<div style={{position: 'absolute', left: 30, top: 60}}>
						<Patient size={280} breath={idle(frame)} mood={frame >= MAIS ? 'content' : 'mal'} sweat={frame < MAIS ? 0.5 : 0} />
					</div>
					<StagePill from={PARF - 2} to={SOIF - 2} color={LPI.paper} x={350} y={40}>
						parfois :
					</StagePill>
					{chips > 0 ? (
						<div style={{position: 'absolute', left: 350, top: 40, display: 'flex', flexDirection: 'column', gap: 16, opacity: chips * dim}}>
							<CauseChip at={SOIF - 3} icon={<ThirstIcon size={52} />} label="très soif" tone={LPI.sky} />
							<CauseChip at={URIN - 3} icon={<UrineIcon size={52} />} label="beaucoup d'urines" tone={LPI.sky} />
							<CauseChip at={FATI - 3} icon={<TiredIcon size={52} />} label="grande fatigue" tone={LPI.sky} />
						</div>
					) : null}
					<StagePill from={SILE - 2} to={PRISE - 8} color={LPI.pink} x={350} y={400}>
						souvent aucun signe
					</StagePill>
					<div style={{position: 'absolute', left: 360, top: 50, display: 'flex', gap: 24}}>
						<LabSlip at={PRISE - 2} label="1re PRISE DE SANG" value="1,32 g/L" ok={fadeIn(frame, VING, 6)} />
						<LabSlip at={DEUX - 4} label="2e PRISE DE SANG" value="1,40 g/L" ok={1} />
					</div>
					<StagePill from={REVE - 2} to={DIAB - 6} color={LPI.blue} x={360} y={420}>
						la prise de sang le révèle
					</StagePill>
					<StagePill from={JEUN - 2} to={DEUX - 6} color={LPI.paper} x={360} y={420}>
						à jeun = sans avoir mangé
					</StagePill>
				</Stage>
				<NormScale zones={DIAB_ZONES} value={value} at={DIAB - 4} markerAt={ATTE - 2} y={990} tag="À jeun" rangeSize={20} />
				<Stamp at={PRISES + 4} x={700} y={850} text="2 fois = diabète" size={52} rot={-6} />
			</Camera>
			{[SOIF, URIN, FATI].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="whoosh" at={MAIS} volume={0.05} />
			<Sfx name="pop" at={PRISE - 2} volume={0.09} />
			<Sfx name="ding" at={VING} volume={0.08} />
			<Sfx name="pop" at={DEUX - 4} volume={0.09} />
			<Sfx name="stamp" at={PRISES + 4} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LES COMPLICATIONS ═══════════════════════════════ */
// « pendant des années » ; vaisseaux et nerfs ; la caméra va des yeux aux reins, au cœur, au cerveau ; puis le pied :
// une petite plaie qu'on ne sent pas (le message de douleur ne remonte plus), elle s'infecte, grandit… jusqu'à
// l'amputation.
const CP = {x: 100, y: 30, size: 330};
const cPt = (px: number, py: number) => ({x: CP.x + (px * CP.size) / 400, y: CP.y + (py * CP.size) / 400});
const CL = {x: 600, y: 120, w: 270};
const clPt = (px: number, py: number) => ({x: CL.x + (px * CL.w) / 500, y: CL.y + (py * CL.w) / 500});

export const Compli: React.FC = () => {
	const frame = useCurrentFrame();
	const ANNE = at('compli', 'années');
	const VAIS = at('compli', 'vaisseaux');
	const YEUX = at('compli', 'yeux');
	const REIN = at('compli', 'reins');
	const COEU = at('compli', 'cœur');
	const CERV = at('compli', 'cerveau…');
	const PIED = at('compli', 'pieds');
	const PLAI = at('compli', 'plaie');
	const SENT = at('compli', 'sent');
	const INFE = at('compli', "s'infecter");
	const AMPU = at('compli', "l'amputation");
	const eye = cPt(200, 118);
	const kid = cPt(200, 405);
	const hrt = cPt(228, 300);
	const brn = cPt(200, 66);
	const sole = clPt(372, 660);
	const keys: CamKey[] = [
		{at: YEUX - 6, s: 2.4, x: eye.x, y: eye.y + 10, dur: 16},
		{at: REIN - 6, s: 1.7, x: kid.x, y: kid.y, dur: 16},
		{at: COEU - 6, s: 2, x: hrt.x, y: hrt.y, dur: 16},
		{at: CERV - 6, s: 2.2, x: brn.x, y: brn.y + 20, dur: 16},
		{at: PIED - 6, s: 1.5, x: sole.x - 60, y: sole.y - 120, dur: 18},
		{at: AMPU + 16, s: 1, dur: 18},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[VAIS + 1, YEUX + 1, PIED + 1, AMPU + 1]} strength={0.025}>
				<Head kicker="Les complications" kAt={2} title="Le sucre en trop *abîme*" tAt={8} size={84} />
				<Stage y={440} h={540} at={4} bumps={[VAIS, YEUX, PIED, AMPU]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: CP.x, top: CP.y}}>
							<Patient size={CP.size} breath={idle(frame)} heart={fadeIn(frame, COEU - 6, 8)} beat={pulseAt(frame, 24)} flow={fadeIn(frame, VAIS - 4, 10)} brain={fadeIn(frame, CERV - 6, 8)} mood={frame >= YEUX ? 'mal' : 'calme'} />
						</div>
						<OrganMarks x={CP.x} y={CP.y} size={CP.size} eyes={interpolate(frame, [YEUX - 2, YEUX + 6, REIN - 4, REIN + 2], [0, 1, 1, 0.3], clamp)} kidneys={fadeIn(frame, REIN - 2, 8)} />
						{frame >= PIED - 8 ? (
							<div style={{position: 'absolute', left: CL.x, top: CL.y, transform: `scale(${popAt(frame, PIED - 8)})`, transformOrigin: '50% 100%'}}>
								<LowerLeg width={CL.w} footSore={fadeIn(frame, PLAI - 2, 8)} grow={interpolate(frame, [PLAI + 6, AMPU + 12], [0, 1], clamp)} silent={fadeIn(frame, SENT, 12)} nerve={fadeIn(frame, SENT - 6, 8)} numb={fadeIn(frame, SENT + 2, 8)} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={ANNE - 2} to={VAIS - 6} color={LPI.sky}>
						pendant des années
					</StagePill>
					<StagePill from={VAIS - 2} to={YEUX - 6} color={LPI.pink}>
						vaisseaux et nerfs abîmés
					</StagePill>
					<StagePill from={SENT - 2} to={INFE - 6} color={LPI.pink}>
						il ne sent pas la plaie
					</StagePill>
					<StagePill from={INFE - 2} color={LPI.pink}>
						elle s'infecte, elle grandit
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010}}>
					<CauseChip at={YEUX - 3} icon={<EyeIcon size={52} />} label="yeux · cécité" />
				</div>
				<div style={{position: 'absolute', left: 540, top: 1010}}>
					<CauseChip at={REIN - 3} icon={<KidneysIcon size={52} />} label="reins · dialyse" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CauseChip at={COEU - 3} icon={<HeartIco size={52} />} label="cœur · infarctus" />
				</div>
				<div style={{position: 'absolute', left: 540, top: 1120}}>
					<CauseChip at={CERV - 3} icon={<BrainIcon size={52} />} label="cerveau · AVC" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1230}}>
					<CauseChip at={AMPU - 3} icon={<LegIcon size={52} />} label="pieds · amputation" />
				</div>
			</Camera>
			<Sfx name="tick" at={ANNE} volume={0.07} />
			{[YEUX, REIN, COEU, CERV].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="whoosh" at={PIED - 6} volume={0.06} />
			<Sfx name="buzz" at={SENT} volume={0.05} dur={14} />
			<Sfx name="impact" at={AMPU} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LE TRAITEMENT ═══════════════════════════════ */
// D'abord l'hygiène de vie (assiette, activité) ; puis selon le type : type 2 = comprimés, parfois insuline ; type 1 =
// insuline, toujours ; le suivi : un globule rouge se couvre de sucres (hémoglobine glyquée), « 3 mois », objectif
// souvent ≤ 7 %.
const Step: React.FC<{at: number; x: number; label: string; children: React.ReactNode; tone?: string}> = ({at: t0, x, label, children, tone = LPI.paper}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: 470, width: 200, height: 270, borderRadius: 34, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{height: 130, display: 'flex', alignItems: 'center'}}>{children}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, textAlign: 'center', lineHeight: 1.05, whiteSpace: 'pre-line'}}>{label}</div>
		</div>
	);
};

/** Ligne « selon le type » : étiquette TYPE n, icône, texte, puis un ajout éventuel (« + parfois insuline »). */
const TypeRow: React.FC<{at: number; y: number; type: string; tone: string; icon: React.ReactNode; text: string; extra?: React.ReactNode; extraAt?: number}> = ({at: t0, y, type, tone, icon, text, extra, extraAt = 1e9}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 528, top: y, width: 480, height: 128, boxSizing: 'border-box', borderRadius: 34, background: LPI.paper, border: `6px solid ${tone}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{padding: '6px 12px', borderRadius: 14, background: tone, fontFamily: FONT.title, fontWeight: 900, fontSize: 26, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap', flexShrink: 0}}>{type}</div>
			<div style={{flexShrink: 0}}>{icon}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, lineHeight: 1.05}}>
				{text}
				{extra && frame >= extraAt ? <div style={{fontSize: 26, color: LPI.blue, opacity: fadeIn(frame, extraAt, 8)}}>{extra}</div> : null}
			</div>
		</div>
	);
};

const Months: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{display: 'flex', gap: 10, transform: `scale(${popAt(frame, t0)})`, transformOrigin: 'left center'}}>
			{['M1', 'M2', 'M3'].map((m, i) => (
				<div key={m} style={{width: 74, height: 84, borderRadius: 14, background: LPI.paper, border: `5px solid ${N}`, overflow: 'hidden', opacity: interpolate(frame, [t0 + i * 6, t0 + i * 6 + 6], [0, 1], clamp)}}>
					<div style={{height: 22, background: LPI.pink}} />
					<div style={{textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, marginTop: 6}}>{m}</div>
				</div>
			))}
		</div>
	);
};

export const Trait: React.FC = () => {
	const frame = useCurrentFrame();
	const ALIM = at('trait', 'alimentation');
	const ACTI = at('trait', "l'activité");
	const DEUX = at('trait', 'deux,');
	const COMP = at('trait', 'comprimés…');
	const PARF = at('trait', 'parfois');
	const UN = at('trait', 'un,');
	const TOUJ = at('trait', 'toujours');
	const SUIV = at('trait', 'suivi');
	const HEMO = at('trait', "l'hémoglobine");
	const GLYQ = at('trait', 'glyquée');
	const REFL = at('trait', 'reflet');
	const TROIS = at('trait', 'trois');
	const MOIS = at('trait', 'mois');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ALIM + 1, DEUX + 1, UN + 1, HEMO + 1, TROIS + 1]} strength={0.025}>
				<Head kicker="Le traitement" kAt={2} title="*Hygiène* de vie… puis *médicaments*" tAt={8} size={84} />
				<Step at={ALIM - 2} x={72} label={'alimentation\néquilibrée'}>
					<Plate size={120} />
				</Step>
				<Step at={ACTI - 2} x={296} label={'activité\nphysique'}>
					<RunIcon size={110} />
				</Step>
				<TypeRow at={DEUX - 4} y={470} type="TYPE 2" tone={LPI.sky} icon={<PillIcon size={70} />} text="comprimés" extra="+ parfois l'insuline" extraAt={PARF - 2} />
				<TypeRow
					at={UN - 4}
					y={612}
					type="TYPE 1"
					tone={LPI.pink}
					icon={
						<div style={{transform: 'rotate(-45deg)'}}>
							<InsulinPen width={84} />
						</div>
					}
					text="l'insuline"
					extra="toujours"
					extraAt={TOUJ - 2}
				/>
				{/* le suivi : l'hémoglobine glyquée */}
				{frame >= SUIV - 6 ? (
					<div style={{position: 'absolute', left: 72, top: 790, width: 936, height: 300, borderRadius: 44, background: alpha(LPI.sky, 0.45), opacity: fadeIn(frame, SUIV - 6, 10)}}>
						<div style={{position: 'absolute', left: 30, top: 20, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: alpha(N, 0.7)}}>LE SUIVI</div>
						{frame >= HEMO - 6 ? (
							<div style={{position: 'absolute', left: 30, top: 70, transform: `scale(${popAt(frame, HEMO - 6)})`}}>
								<GlycatedCell width={230} coat={interpolate(frame, [HEMO, GLYQ + 30], [0, 1], clamp)} />
							</div>
						) : null}
						{frame >= GLYQ - 2 ? (
							<div style={{position: 'absolute', left: 300, top: 60}}>
								<Pill at={GLYQ - 2} size={38} color={LPI.blue}>
									HbA1c = hémoglobine glyquée
								</Pill>
							</div>
						) : null}
						<div style={{position: 'absolute', left: 300, top: 150, display: 'flex', alignItems: 'center', gap: 18}}>
							<Months at={TROIS - 2} />
							{frame >= REFL - 2 ? (
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, opacity: fadeIn(frame, REFL - 2, 8), lineHeight: 1.1}}>
									le sucre sur
									{frame >= TROIS - 2 ? (
										<>
											<br />
											<span style={{color: LPI.blue}}>3 mois</span>
										</>
									) : (
										'…'
									)}
								</div>
							) : null}
						</div>
					</div>
				) : null}
				{frame >= MOIS + 10 ? (
					<div style={{position: 'absolute', left: 72, top: 1120}}>
						<Pill at={MOIS + 10} size={36} color={LPI.paper}>
							objectif souvent : HbA1c ≤ 7 %
						</Pill>
					</div>
				) : null}
			</Camera>
			{[ALIM, ACTI].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="pop" at={DEUX - 4} volume={0.08} />
			<Sfx name="tick" at={PARF - 2} volume={0.07} />
			<Sfx name="pop" at={UN - 4} volume={0.08} />
			<Sfx name="ding" at={TOUJ} volume={0.07} />
			<Sfx name="whoosh" at={SUIV - 6} volume={0.06} />
			<Sfx name="tick" at={GLYQ} volume={0.08} />
			<Sfx name="ding" at={TROIS} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · TON RÔLE ═══════════════════════════════ */
// 4 cases qui s'allument au mot : glycémies capillaires (lecteur), injections d'insuline (stylo + sites qui tournent sur
// le ventre), les pieds tous les jours (jambe + loupe), l'hypo (lecteur 0,55 → 3 sucres) ; renvoi « vidéo glycémie ».
const Panel: React.FC<{at: number; x: number; y: number; title: string; children: React.ReactNode}> = ({at: t0, x, y, title, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 456, height: 272, borderRadius: 36, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, overflow: 'hidden', transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 58, background: LPI.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: LPI.paper, whiteSpace: 'nowrap'}}>{title}</div>
			{children}
		</div>
	);
};

export const Role: React.FC = () => {
	const frame = useCurrentFrame();
	const CTRL = at('role', 'contrôler');
	const INJ = at('role', 'injections');
	const CHAN = at('role', 'changeant');
	const SITE = at('role', 'site');
	const CHAQ = at('role', 'chaque');
	const FOIS = at('role', 'fois');
	const REGA = at('role', 'regarder');
	const JOUR = at('role', 'jours');
	const HYPO = at('role', "d'hypoglycémie");
	const COMME = at('role', 'comme');
	const RESU = at('role', 'resucre');
	const active = frame < CHAN - 2 ? -1 : frame < SITE - 2 ? 0 : frame < CHAQ - 2 ? 1 : frame < FOIS - 2 ? 2 : 3;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CTRL + 1, INJ + 1, REGA + 1, HYPO + 1, RESU + 1]} strength={0.025}>
				<Head kicker="Ton rôle" kAt={2} title="Surveiller et *prévenir*" tAt={8} />
				<Panel at={CTRL - 3} x={72} y={440} title="glycémies capillaires">
					<div style={{position: 'absolute', left: 70, top: 20, transform: 'scale(0.72)', transformOrigin: '0 0'}}>
						<Glucometer value={interpolate(frame, [CTRL + 6, CTRL + 30], [0, 1.45], clamp)} strip={1} blood={1} tone={null} beep={pulseAt(frame - CTRL, 1000)} />
					</div>
				</Panel>
				<Panel at={INJ - 3} x={552} y={440} title="insuline : changer de site">
					<div style={{position: 'absolute', left: 20, top: 26}}>
						<InsulinPen width={180} press={frame >= CHAN - 2 ? 0.5 + 0.5 * Math.sin(frame / 4) : 0} />
					</div>
					<div style={{position: 'absolute', left: 210, top: 10}}>
						<InjectionSites width={220} done={Math.max(0, active)} active={active} />
					</div>
				</Panel>
				<Panel at={REGA - 3} x={72} y={730} title="les pieds, tous les jours">
					<div style={{position: 'absolute', left: 20, top: -140}}>
						<LowerLeg width={230} />
					</div>
					<svg width={130} height={130} viewBox="0 0 130 130" style={{position: 'absolute', left: 100 + Math.sin(frame / 14) * 40, top: 30}}>
						<circle cx={50} cy={50} r={36} fill={alpha(LPI.paper, 0.4)} stroke={N} strokeWidth={9} />
						<path d="M76 76 L112 112" stroke={N} strokeWidth={16} strokeLinecap="round" />
					</svg>
					<div style={{position: 'absolute', left: 262, top: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 40px)', gap: 8}}>
						{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
							const ok = frame >= JOUR - 4 + i * 4;
							return (
								<div key={i} style={{width: 40, height: 40, borderRadius: 12, border: `4px solid ${N}`, background: ok ? LPI.pink : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 22, color: N, opacity: fadeIn(frame, REGA, 8), transform: `scale(${ok ? popAt(frame, JOUR - 4 + i * 4) : 1})`}}>
									{ok ? '✓' : d}
								</div>
							);
						})}
					</div>
				</Panel>
				<Panel at={HYPO - 3} x={552} y={730} title="hypo : on resucre !">
					<div style={{position: 'absolute', left: 20, top: 30, transform: 'scale(0.6)', transformOrigin: '0 0'}}>
						<Glucometer value={0.55} strip={1} blood={1} tone={LPI.pink} beep={0} />
					</div>
					<div style={{position: 'absolute', left: 300, top: 40, display: 'flex', flexDirection: 'column', gap: 8}}>
						{[0, 1, 2].map((i) =>
							frame >= RESU - 2 + i * 5 ? (
								<div key={i} style={{transform: `scale(${popAt(frame, RESU - 2 + i * 5)})`}}>
									<SugarCube size={46} rot={i * 12 - 10} />
								</div>
							) : null,
						)}
					</div>
				</Panel>
				<div style={{position: 'absolute', left: 72, top: 1034}}>
					<VideoLink at={COMME - 2} title="La glycémie" />
				</div>
				{frame >= RESU - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1160}}>
						<Pill at={RESU - 2} size={38} color={LPI.pink}>
							s'il est conscient : 15 g de sucre
						</Pill>
					</div>
				) : null}
			</Camera>
			<Sfx name="pop" at={CTRL - 3} volume={0.08} />
			<Sfx name="ding" at={CTRL + 30} volume={0.07} />
			<Sfx name="pop" at={INJ - 3} volume={0.08} />
			{[CHAN, SITE, CHAQ, FOIS].map((t) => (
				<Sfx key={t} name="tick" at={t - 2} volume={0.06} />
			))}
			<Sfx name="pop" at={REGA - 3} volume={0.08} />
			<Sfx name="buzz" at={HYPO} volume={0.05} dur={12} />
			<Sfx name="whoosh" at={COMME - 2} volume={0.06} />
			<Sfx name="pop" at={RESU - 2} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const VOILA = at('outro', 'voilà');
	return (
		<AbsoluteFill>
			<RecapScene
				title="Le *diabète*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', "d'hypo") + 14}
				rows={[
					[at('outro', 'silencieux,') - 4, 'alert', 'Souvent silencieux', 'la prise de sang le révèle'],
					[at('outro', 'abîme') - 3, 'alert', 'Il abîme', 'yeux, reins, cœur, pieds'],
					[at('outro', 'soigne') - 3, 'check', 'On le soigne', 'hygiène de vie, médicaments'],
					[at('outro', 'rôle') - 3, 'check', 'Ton rôle', 'glycémies · insuline · pieds'],
					[at('outro', "d'hypo") - 3, 'alert', 'Hypo ?', 'on resucre !'],
				]}
			/>
			<NextUp at={VOILA - 4} part={2} done title="Le diabète" teaser="les 3 types · le découvrir · le soigner" icon={<div style={{transform: 'rotate(-40deg)'}}><InsulinPen width={110} /></div>} y={1120} />
			<Sfx name="whoosh" at={VOILA - 4} volume={0.07} />
		</AbsoluteFill>
	);
};
