// Série « Le diabète », partie 1 / 2 : les 3 types (voix +0 %, animations plus posées que la v1 : demandé « ça va un peu
// vite, ralentis et prends le temps »). Accroche « paradoxe » (son sang est plein de sucre… et ses cellules meurent de
// faim : la clé insuline manque), carte de la série, le principe (renvoi « vidéo glycémie »), type 1 = insulinodépendant
// (DID : les défenses attaquent le pancréas, la clé manque, l'insuline le garde en vie), type 2 = non insulinodépendant
// (DNID : la clé coince ; au début, pas besoin d'insuline), diabète gestationnel (hormones du placenta, dépistage
// 24 – 28 SA par HGPO, bébé trop gros, disparaît après l'accouchement mais risque de type 2), récap + « à suivre ».
// Briques : src/brand/diabetes.tsx (+ glyco.tsx, pain.tsx, heartfail.tsx).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BloodBand, Defender, DIABETE_PARTS, GCell, InsulinKey, InsulinPen, MomToBe, Pancreas, SweetDrink, VideoLink, WeeksBar} from '../../brand/diabetes';
import {CamKey, CauseChip, Head, Pill, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {SugarCube} from '../../brand/glyco';
import {BathScale} from '../../brand/heartfail';
import {DiabetesIcon, RunIcon} from '../../brand/icons';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {Kid} from '../../brand/pain';
import {Patient} from '../../brand/patient';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 10) => interpolate(frame, [a, a + d], [0, 1], clamp);
/** Pop plus posé que d'habitude (ressort plus lent, ~10 % de dépassement). */
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.1 * Math.exp(-(frame - t0) / 5) * Math.cos((frame - t0) * 0.55) - Math.exp(-(frame - t0) / 3.2));

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

/** Élément qui « pop » à `from` et s'efface à `to` (posé en x, y). */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'center'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 8) return null;
	const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.75 + 0.25 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
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

/** Carte du sigle (sous le socle) : « DID » en grand, puis le sens des lettres mot par mot, puis l'explication. */
const SigleCard: React.FC<{at: number; sigle: string; words: [string, string][]; wordsAt: number[]; sub: string; subAt: number; tone?: string; y?: number; to?: number}> = ({at: t0, sigle, words, wordsAt, sub, subAt, tone = LPI.blue, y = 1030, to = 1e9}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, height: 210, boxSizing: 'border-box', borderRadius: 44, background: LPI.paper, border: `7px solid ${tone}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', transform: `scale(${popAt(frame, t0) * (0.8 + 0.2 * out)})`, opacity: out}}>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: sigle.length > 3 ? 92 : 112, color: tone, WebkitTextStroke: `4px ${N}`, letterSpacing: '0.02em', flexShrink: 0}}>{sigle}</div>
			<div style={{flex: 1}}>
				<div style={{display: 'flex', flexWrap: 'wrap', fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, lineHeight: 1.1}}>
					{words.map(([first, rest], i) => (
						<span key={i} style={{opacity: fadeIn(frame, wordsAt[i] ?? t0, 6), transform: `translateY(${(1 - fadeIn(frame, wordsAt[i] ?? t0, 6)) * 14}px)`, display: 'inline-block', marginRight: rest.endsWith('-') ? 0 : 12}}>
							<span style={{color: LPI.pink, WebkitTextStroke: `2px ${N}`}}>{first}</span>
							{rest}
						</span>
					))}
				</div>
				{frame >= subAt ? <div style={{marginTop: 10, fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: alpha(N, 0.8), opacity: fadeIn(frame, subAt, 8)}}>{sub}</div> : null}
			</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Du sucre partout… et elles ont faim ? », le sang (étiqueté) rempli de sucres au-dessus de 3 cellules
// (étiquetées) aux portes fermées. « meurent de faim » : leurs jauges se vident ; gros plan : un sucre frappe à la
// porte… et rebondit ; cadenas ; « il lui manque une clé » : la clé « INSULINE » n'est qu'un contour en pointillés ;
// « C'est le diabète » (flash, secousse).
const CELLS = [200, 540, 880];
const CELL = {size: 260, y: 770};
const VES = {y: 480, h: 230};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SUCRE = at('intro', 'sucre');
	const CELLU = at('intro', 'cellules');
	const MEUR = at('intro', 'meurent');
	const FAIM = at('intro', 'faim');
	const SUCRE2 = at('intro', 'sucre', 2);
	const DEVANT = at('intro', 'devant');
	const PORTE = at('intro', 'porte');
	const IMPO = at('intro', 'impossible');
	const ENTR = at('intro', "d'entrer");
	const MANQ = at('intro', 'manque');
	const CLE = at('intro', 'clé');
	const MAL = at('intro', 'maladie');
	const DIAB = at('intro', 'diabète');
	const keys: CamKey[] = [
		{at: SUCRE2 - 6, s: 1.7, x: 540, y: 760, dur: 20},
		{at: MANQ - 8, s: 1.15, x: 540, y: 880, dur: 20},
		{at: MAL - 4, s: 1, dur: 18},
	];
	const energy = interpolate(frame, [CELLU - 2, FAIM + 14], [0.45, 0.05], ease);
	const pile = Math.round(interpolate(frame, [SUCRE2 - 2, PORTE + 10], [2, 7], clamp));
	// le sucre qui frappe à la porte (cellule du milieu) puis rebondit
	const knock = frame < DEVANT - 8 || frame > IMPO + 14 ? null : interpolate(frame, [DEVANT - 8, PORTE - 2, PORTE + 3, PORTE + 10, IMPO - 2, IMPO + 3, IMPO + 14], [0, 1, 0.82, 1, 0.82, 1, 0], ease);
	const doorTop = CELL.y + ((-112 + 125) / 240) * CELL.size;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FAIM + 1, PORTE + 1, CLE + 1]} shakes={[DIAB + 2]} strength={0.03}>
				<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
					<div style={{position: 'absolute', left: 0, top: VES.y}}>
						<BloodBand width={1080} height={VES.h} sugar={interpolate(frame, [0, SUCRE + 10], [0.65, 1], clamp)} piles={CELLS.map((x) => ({x, n: frame >= SUCRE2 - 2 ? pile : 2}))} speed={2.2} />
					</div>
					<div style={{position: 'absolute', left: 24, top: VES.y + 14, padding: '6px 16px', borderRadius: 14, background: N, color: LPI.paper, fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.1em'}}>LE SANG</div>
					<div style={{position: 'absolute', left: 0, width: 1080, top: CELL.y + CELL.size + 14, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 34, letterSpacing: '0.14em', color: alpha(N, 0.6), opacity: 1 - fadeIn(frame, SUCRE2 - 10, 8)}}>LES CELLULES</div>
					{CELLS.map((x) => (
						<div key={x} style={{position: 'absolute', left: x - 22, top: VES.y + VES.h - 6, width: 44, height: doorTop - VES.y - VES.h + 14, background: alpha(LPI.pink, 0.25), borderLeft: `5px dashed ${alpha(N, 0.3)}`, borderRight: `5px dashed ${alpha(N, 0.3)}`}} />
					))}
					{CELLS.map((x, i) => (
						<div key={x} style={{position: 'absolute', left: x - CELL.size / 2, top: CELL.y}}>
							<GCell size={CELL.size} energy={energy} hungry={fadeIn(frame, MEUR - 2, 8)} lock={frame >= IMPO - 2 ? 1 : 0.4} reject={i === 1 ? interpolate(frame, [ENTR - 2, ENTR + 3, ENTR + 24, ENTR + 32], [0, 1, 1, 0], clamp) : 0} />
						</div>
					))}
					{knock !== null ? (
						<div style={{position: 'absolute', left: 540 - 22, top: VES.y + VES.h - 50 + knock * (doorTop - VES.y - VES.h + 20)}}>
							<SugarCube size={44} rot={frame * 2} />
						</div>
					) : null}
					{frame >= MANQ - 2 ? (
						<div style={{position: 'absolute', left: 540 - 130, top: 1090, transform: `scale(${popAt(frame, MANQ - 2)})`}}>
							<InsulinKey width={260} ghost />
						</div>
					) : null}
					<Badge at={CLE} until={MAL - 2} x={700} y={1060} text="?" size={96} />
				</ZoomCam>
				<Pop from={SUCRE - 2} to={CELLU - 4} x={250} y={1110}>
					<Pill at={SUCRE - 2} size={46} color={LPI.pink}>
						plein de sucre
					</Pill>
				</Pop>
				<Pop from={FAIM - 2} to={SUCRE2 - 8} x={200} y={1110}>
					<Pill at={FAIM - 2} size={46} color={LPI.sky}>
						les cellules ont faim
					</Pill>
				</Pop>
				<TitleAt from={-60} to={MANQ - 6} text={'Du *sucre* partout…\net elles ont *faim* ?'} size={92} stagger={0} />
				<TitleAt from={MANQ - 2} to={MAL - 6} text="Il manque une *clé*…" size={98} />
				{frame >= MAL - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, transform: `scale(${frame >= DIAB ? 1 + 0.1 * Math.exp(-(frame - DIAB) / 5) : 1})`, transformOrigin: 'left center'}}>
						<Title at={MAL - 2} text="C'est le *diabète*" size={120} stagger={4} />
					</div>
				) : null}
				<Burst at={DIAB} x={540} y={900} r={340} n={18} />
			</Camera>
			<Flash at={DIAB} />
			<Sfx name="heartbeat" at={0} volume={0.06} />
			<Sfx name="pop" at={SUCRE - 2} volume={0.08} />
			<Sfx name="buzz" at={FAIM} volume={0.05} dur={14} />
			<Sfx name="whoosh" at={SUCRE2 - 6} volume={0.07} />
			<Sfx name="tick" at={PORTE - 1} volume={0.1} />
			<Sfx name="tick" at={IMPO + 1} volume={0.1} />
			<Sfx name="buzz" at={ENTR} volume={0.05} dur={12} />
			<Sfx name="pop" at={MANQ - 2} volume={0.08} />
			<Sfx name="impact" at={DIAB} volume={0.13} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
// Carte de la série (partie 1 en cours, partie 2 avec cadenas) ; « Aujourd'hui : les 3 types » (3 pastilles).
export const Serie: React.FC = () => {
	const frame = useCurrentFrame();
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const UN = at('serie', 'un');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const TROIS = at('serie', 'trois');
	const TYPES = at('serie', 'types');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[UN + 1, SERIE + 1, TROIS + 1]} shakes={[UN + 2]} strength={0.03}>
				<Head kicker="Série · Le diabète" kAt={NOUS - 4} title="Partie *1* sur 2" tAt={PART - 2} size={92} />
				<SeriesParts parts={DIABETE_PARTS} current={0} at={UN - 2} stagger={8} />
				{frame >= AUJ - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, AUJ - 2)})`}}>
						<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>
							Aujourd'hui : <span style={{color: LPI.blue}}>les 3 types</span>
						</div>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', gap: 22}}>
					{['Type 1', 'Type 2', 'Gestationnel'].map((t, i) => {
						const t0 = [TROIS - 2, TYPES - 2, TYPES + 6][i];
						return frame >= t0 ? (
							<div key={t} style={{padding: '12px 28px', borderRadius: 999, background: i === 0 ? LPI.pink : i === 1 ? LPI.sky : LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, transform: `scale(${popAt(frame, t0)})`}}>
								{t}
							</div>
						) : null;
					})}
				</div>
			</Camera>
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={UN - 2 + i * 8} volume={0.09} />
			))}
			<Sfx name="ding" at={AUJ} volume={0.08} />
			{[TROIS - 2, TYPES - 2, TYPES + 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE PRINCIPE ═══════════════════════════════ */
// Renvoi « déjà vu en vidéo : la glycémie » ; le sucre = carburant ; il veut entrer : porte fermée ; la clé arrive, entre
// dans la serrure, tourne : la porte s'ouvre, le sucre entre, la cellule se recharge et sourit ; le pancréas fabrique
// les clés.
const DC = {x: 468, y: 220, size: 250};

export const Def: React.FC = () => {
	const frame = useCurrentFrame();
	const VIDEO = at('def', 'vidéo');
	const CARB = at('def', 'carburant');
	const ENTR = at('def', 'entrer');
	const CLE = at('def', 'clé');
	const INSU = at('def', "l'insuline");
	const PANC = at('def', 'pancréas');
	const FABR = at('def', 'fabrique');
	const kx = interpolate(frame, [CLE - 2, INSU + 2], [40, DC.x - 30], ease);
	const ky = interpolate(frame, [CLE - 2, INSU + 2], [380, DC.y - 70], ease);
	const turn = interpolate(frame, [INSU + 4, INSU + 14], [0, 1], ease);
	const door = interpolate(frame, [INSU + 12, INSU + 22], [0, 1], ease);
	const fed = interpolate(frame, [INSU + 18, INSU + 44], [0, 1], clamp);
	const energy = interpolate(frame, [INSU + 20, INSU + 56], [0.2, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CARB + 1, INSU + 1, PANC + 1]} strength={0.025}>
				<Head kicker="Le principe" kAt={2} title="L'insuline, c'est la *clé*" tAt={8} />
				<Stage y={440} h={560} at={4} bumps={[CARB, INSU, PANC]}>
					<div style={{position: 'absolute', left: 20, top: 16}}>
						<BloodBand width={896} height={140} sugar={0.4} speed={2} />
					</div>
					<div style={{position: 'absolute', left: DC.x - 22, top: 150, width: 44, height: DC.y - 150 + 18, background: alpha(LPI.pink, 0.25), borderLeft: `5px dashed ${alpha(N, 0.3)}`, borderRight: `5px dashed ${alpha(N, 0.3)}`}} />
					<div style={{position: 'absolute', left: DC.x - DC.size / 2, top: DC.y}}>
						<GCell size={DC.size} door={door} lock={1 - door} energy={energy} hungry={frame < INSU + 26 ? fadeIn(frame, ENTR - 2, 8) : 0} fed={fed} reject={interpolate(frame, [ENTR, ENTR + 5, CLE - 8, CLE - 2], [0, 1, 1, 0], clamp)} />
					</div>
					{frame >= CARB - 2 ? (
						<div style={{position: 'absolute', left: DC.x + 150, top: DC.y + 70, transform: `scale(${popAt(frame, CARB - 2)})`}}>
							<Pill at={CARB - 2} size={36} color={LPI.sky}>
								sucre = carburant
							</Pill>
						</div>
					) : null}
					{frame >= CLE - 2 && frame < INSU + 44 ? (
						<div style={{position: 'absolute', left: kx, top: ky, transform: `rotate(90deg) scale(${popAt(frame, CLE - 2) * 0.8})`, transformOrigin: '0 0', opacity: 1 - fadeIn(frame, INSU + 30, 12)}}>
							<InsulinKey width={200} turn={turn} />
						</div>
					) : null}
					{frame >= PANC - 6 ? (
						<div style={{position: 'absolute', left: 20, top: 380, transform: `scale(${popAt(frame, PANC - 6)})`, transformOrigin: 'left bottom'}}>
							<Pancreas width={300} make={fadeIn(frame, FABR - 2, 10)} />
						</div>
					) : null}
					<StagePill from={FABR - 2} x={30} y={500} color={LPI.pink}>
						le pancréas fabrique l'insuline
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1018}}>
					<VideoLink at={VIDEO - 2} until={CLE - 10} title="La glycémie" />
				</div>
				{frame >= INSU - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1030}}>
						<Pill at={INSU - 2} size={42} color={LPI.blue}>
							insuline = la clé qui fait entrer le sucre
						</Pill>
					</div>
				) : null}
			</Camera>
			<Sfx name="whoosh" at={VIDEO - 2} volume={0.06} />
			<Sfx name="buzz" at={ENTR} volume={0.04} dur={10} />
			<Sfx name="pop" at={CLE - 2} volume={0.09} />
			<Sfx name="tick" at={INSU + 8} volume={0.1} />
			<Sfx name="ding" at={INSU + 20} volume={0.09} />
			<Sfx name="pop" at={PANC - 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE TYPE 1 ═══════════════════════════════ */
// Les défenses du corps arrivent et cognent le pancréas, qui s'éteint (« plus d'insuline ») ; la cellule reste fermée,
// la clé n'est qu'un contour (« la clé manque ») ; carte « DID = Diabète Insulino-Dépendant » ; « sans insuline… » : le
// stylo pique, la clé apparaît, la porte s'ouvre, la cellule revit ; pastilles « surtout enfants et jeunes », « insuline
// toute sa vie ».
const T1 = {cell: {x: 630, y: 140, size: 255}, panc: {x: 10, y: 150, w: 470}};
const DEF_POS = [
	{x: 70, y: 60, from: {x: 1000, y: -60}},
	{x: 250, y: 40, from: {x: 1000, y: 120}},
	{x: 360, y: 280, from: {x: 1000, y: 420}},
];

export const Type1: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('type1', 'un');
	const DEF = at('type1', 'défenses');
	const ATTQ = at('type1', 'attaquent');
	const FABR = at('type1', 'fabrique');
	const PLUS = at('type1', 'plus');
	const CLE = at('type1', 'clé');
	const MANQ = at('type1', 'manque');
	const APPEL = at('type1', "l'appelle");
	const DID = at('type1', 'insulinodépendant');
	const SANS = at('type1', 'sans');
	const INSU = at('type1', 'insuline');
	const VIVRE = at('type1', 'vivre');
	const ENF = at('type1', 'enfants');
	const TOUTE = at('type1', 'toute');
	const VIE = at('type1', 'vie');
	const dead = interpolate(frame, [FABR - 2, PLUS + 14], [0, 1], ease);
	const defOut = 1 - fadeIn(frame, APPEL, 12);
	// la clé de l'insuline injectée : elle arrive avec le stylo, entre et tourne
	const keyIn = interpolate(frame, [INSU + 4, INSU + 22], [0, 1], ease);
	const turn = interpolate(frame, [INSU + 22, INSU + 32], [0, 1], ease);
	const door = interpolate(frame, [INSU + 30, INSU + 40], [0, 1], ease);
	const alive = interpolate(frame, [INSU + 36, VIVRE + 20], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[UN + 1, ATTQ + 1, MANQ + 1, DID + 1, VIVRE + 1]} strength={0.025}>
				<Head kicker="1er type" kAt={2} title="Le type *1*" tAt={UN - 6} size={100} />
				<Stage y={440} h={560} at={4} bumps={[ATTQ, MANQ, INSU + 30]}>
					<div style={{position: 'absolute', left: T1.panc.x, top: T1.panc.y}}>
						<Pancreas width={T1.panc.w} dead={dead} make={frame < DEF ? 1 : 1 - fadeIn(frame, ATTQ, 10)} />
					</div>
					{/* les défenses du corps : elles arrivent, puis cognent le pancréas */}
					{frame >= DEF - 4 && defOut > 0
						? DEF_POS.map((p, i) => {
								const t0 = DEF - 4 + i * 5;
								const f = interpolate(frame, [t0, t0 + 18], [0, 1], ease);
								const hit = frame >= ATTQ ? Math.max(0, Math.sin((frame - ATTQ - i * 4) / 3.2)) * 22 : 0;
								const x = p.from.x + (p.x - p.from.x) * f - hit * 0.6;
								const y = p.from.y + (p.y - p.from.y) * f + hit * 0.3;
								return (
									<div key={i} style={{position: 'absolute', left: x, top: y, opacity: defOut * Math.min(1, f * 3)}}>
										<Defender size={96} angry={fadeIn(frame, ATTQ - 4, 8)} />
									</div>
								);
							})
						: null}
					<StagePill from={DEF - 2} to={FABR - 6} x={30} y={470} color={LPI.sky}>
						les défenses attaquent le pancréas
					</StagePill>
					<StagePill from={FABR - 2} to={DID - 8} x={30} y={470} color={LPI.pink}>
						il ne fabrique plus d'insuline
					</StagePill>
					{/* la cellule : fermée, puis rouverte par l'insuline injectée */}
					<div style={{position: 'absolute', left: T1.cell.x, top: T1.cell.y}}>
						<GCell size={T1.cell.size} lock={1 - door} door={door} energy={0.08 + 0.85 * alive} hungry={frame >= MANQ - 2 && alive < 0.5 ? 1 : 0} fed={alive} />
					</div>
					{frame >= CLE - 4 && frame < INSU + 6 ? (
						<div style={{position: 'absolute', left: T1.cell.x - 20, top: T1.cell.y - 120, transform: `scale(${popAt(frame, CLE - 4)}) rotate(-15deg)`, opacity: 1 - fadeIn(frame, INSU, 6)}}>
							<InsulinKey width={200} ghost />
						</div>
					) : null}
					<Badge at={MANQ} until={SANS - 2} x={T1.cell.x + 190} y={T1.cell.y - 110} text="?" size={84} />
					{/* « sans insuline… » : le stylo, puis la clé qui entre */}
					{frame >= SANS - 4 ? (
						<div style={{position: 'absolute', left: 520, top: 410, transform: `scale(${popAt(frame, SANS - 4)}) rotate(-8deg)`, transformOrigin: 'right center', opacity: 1 - fadeIn(frame, VIVRE + 20, 10)}}>
							<InsulinPen width={300} press={interpolate(frame, [INSU - 2, INSU + 6], [0, 1], clamp)} />
						</div>
					) : null}
					{frame >= INSU + 4 && frame < VIVRE + 40 ? (
						<div style={{position: 'absolute', left: interpolate(keyIn, [0, 1], [560, T1.cell.x + 85]), top: interpolate(keyIn, [0, 1], [380, T1.cell.y + 20]), transform: `rotate(90deg) scale(${0.25 + 0.55 * keyIn})`, transformOrigin: '0 0', opacity: 1 - fadeIn(frame, VIVRE + 24, 12)}}>
							<InsulinKey width={200} turn={turn} />
						</div>
					) : null}
					<StagePill from={VIVRE - 2} x={470} y={470} color={LPI.blue}>
						l'insuline le garde en vie
					</StagePill>
				</Stage>
				<SigleCard
					at={DID - 6}
					sigle="DID"
					words={[
						['D', 'iabète'],
						['I', 'nsulino-'],
						['D', 'épendant'],
					]}
					wordsAt={[DID - 4, DID + 4, DID + 12]}
					sub="il dépend de l'insuline pour vivre"
					subAt={SANS - 2}
					tone={LPI.pink}
				/>
				<div style={{position: 'absolute', left: 72, top: 1268}}>
					<CauseChip at={ENF - 4} icon={<Kid size={84} />} label="surtout enfants et jeunes" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1376}}>
					<CauseChip at={TOUTE - 4} icon={<div style={{transform: 'rotate(-40deg)'}}><InsulinPen width={84} /></div>} label="insuline, toute sa vie" tone={LPI.pink} />
				</div>
			</Camera>
			<Sfx name="pop" at={UN - 6} volume={0.08} />
			<Sfx name="whoosh" at={DEF - 4} volume={0.06} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="tick" at={ATTQ + 2 + i * 10} volume={0.08} />
			))}
			<Sfx name="buzz" at={FABR} volume={0.05} dur={14} />
			<Sfx name="pop" at={CLE - 4} volume={0.08} />
			<Sfx name="pop" at={DID - 6} volume={0.1} />
			<Sfx name="pop" at={SANS - 4} volume={0.08} />
			<Sfx name="tick" at={INSU + 26} volume={0.1} />
			<Sfx name="ding" at={INSU + 38} volume={0.09} />
			<Sfx name="pop" at={ENF - 4} volume={0.08} />
			<Sfx name="pop" at={TOUTE - 4} volume={0.08} />
			<Sfx name="ding" at={VIE} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LE TYPE 2 ═══════════════════════════════ */
// « le plus fréquent » (9 sur 10) ; le pancréas fabrique encore des clés, une clé va jusqu'à la porte… et coince (la
// cellule a faim) ; carte « DNID = Diabète Non Insulino-Dépendant » ; « au début, on peut se passer d'insuline » :
// hygiène de vie et comprimés, le stylo attend ; pastilles adulte, surpoids, peu d'activité.
const T2 = {cell: {x: 630, y: 140, size: 255}, panc: {x: 10, y: 150, w: 470}};

export const Type2: React.FC = () => {
	const frame = useCurrentFrame();
	const FREQ = at('type2', 'fréquent');
	const DEUX = at('type2', 'deux');
	const PANC = at('type2', 'pancréas');
	const FABR = at('type2', 'fabrique');
	const INSU = at('type2', "l'insuline");
	const MAIS = at('type2', 'mais');
	const MARCHE = at('type2', 'marche');
	const MAL = at('type2', 'mal');
	const NON = at('type2', 'non');
	const DNID = at('type2', 'insulinodépendant');
	const DEBUT = at('type2', 'début');
	const PASSER = at('type2', 'passer');
	const ADULT = at('type2', 'adultes');
	const SURP = at('type2', 'surpoids');
	const PEU = at('type2', 'peu');
	const keyIn = interpolate(frame, [INSU - 2, MAIS], [0, 1], ease);
	const jam = fadeIn(frame, MARCHE - 2, 8);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, MARCHE + 1, DNID + 1, SURP + 1]} strength={0.025}>
				<Head kicker="2e type" kAt={2} title="Le type *2*" tAt={DEUX - 8} size={100} />
				<Stage y={440} h={560} at={4} bumps={[FREQ, MARCHE, DNID]}>
					<div style={{position: 'absolute', left: T2.panc.x, top: T2.panc.y}}>
						<Pancreas width={T2.panc.w} make={fadeIn(frame, FABR - 2, 10)} />
					</div>
					<StagePill from={FREQ - 2} to={PANC - 6} x={30} y={30} color={LPI.sky}>
						le plus fréquent : 9 diabètes sur 10
					</StagePill>
					<StagePill from={FABR - 2} to={MARCHE - 6} x={30} y={470} color={LPI.sky}>
						le pancréas fabrique encore l'insuline
					</StagePill>
					<div style={{position: 'absolute', left: T2.cell.x, top: T2.cell.y}}>
						<GCell size={T2.cell.size} lock={1} energy={0.25} hungry={fadeIn(frame, MAL, 8)} reject={fadeIn(frame, MAL + 6, 8)} />
					</div>
					{frame >= INSU - 2 ? (
						<div style={{position: 'absolute', left: interpolate(keyIn, [0, 1], [300, T2.cell.x + 85]), top: interpolate(keyIn, [0, 1], [130, T2.cell.y + 20]), transform: `rotate(90deg) scale(${0.3 + 0.5 * keyIn})`, transformOrigin: '0 0'}}>
							<InsulinKey width={200} jam={jam} />
						</div>
					) : null}
					<StagePill from={MARCHE - 2} x={560} y={470} color={LPI.pink}>
						la clé coince
					</StagePill>
				</Stage>
				<SigleCard
					at={NON - 6}
					sigle="DNID"
					words={[
						['D', 'iabète'],
						['N', 'on'],
						['I', 'nsulino-'],
						['D', 'épendant'],
					]}
					wordsAt={[NON - 4, NON + 2, DNID, DNID + 8]}
					sub="au début : pas besoin d'insuline"
					subAt={DEBUT - 2}
					tone={LPI.blue}
				/>
				{/* au début : hygiène de vie et comprimés */}
				<div style={{position: 'absolute', left: 72, top: 1262, display: 'flex', gap: 18}}>
					{frame >= PASSER - 4 ? (
						<div style={{display: 'flex', gap: 18, transform: `scale(${popAt(frame, PASSER - 4)})`, transformOrigin: 'left center', opacity: 1 - fadeIn(frame, ADULT - 8, 8)}}>
							<Pill at={PASSER - 4} size={34} color={LPI.paper}>
								d'abord : hygiène de vie, comprimés
							</Pill>
						</div>
					) : null}
				</div>
				<div style={{position: 'absolute', left: 72, top: 1262, display: 'flex', flexDirection: 'column', gap: 14}}>
					<div style={{display: 'flex', gap: 18}}>
						<CauseChip at={ADULT - 4} icon={<div style={{marginTop: 20}}><Patient size={66} /></div>} label="surtout l'adulte" tone={LPI.sky} />
						<CauseChip at={SURP - 4} icon={<BathScale value={98} width={70} />} label="surpoids" />
					</div>
					<CauseChip at={PEU - 4} icon={<NoRun />} label="peu d'activité physique" />
				</div>
			</Camera>
			<Sfx name="pop" at={DEUX - 8} volume={0.08} />
			<Sfx name="pop" at={FREQ - 2} volume={0.08} />
			<Sfx name="whoosh" at={INSU - 2} volume={0.05} />
			<Sfx name="buzz" at={MARCHE} volume={0.05} dur={16} />
			<Sfx name="pop" at={NON - 6} volume={0.1} />
			<Sfx name="ding" at={DEBUT} volume={0.07} />
			{[ADULT, SURP, PEU].map((t) => (
				<Sfx key={t} name="pop" at={t - 4} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LE DIABÈTE GESTATIONNEL ═══════════════════════════════ */
// La future maman (son ventre s'arrondit sur « grossesse ») ; on voit dedans : le placenta envoie des hormones vers la
// cellule, la clé coince ; dépistage : la frise 0 → 40 SA, fenêtre 24 – 28 SA, la boisson sucrée (HGPO) puis la prise
// de sang ; le risque : le bébé grossit (macrosomie > 4 kg) ; après l'accouchement : ventre plat, bébé dans les bras, la
// clé remarche ; mais risque de type 2 plus tard.
const MOM = {x: 0, y: -16, w: 410};
const GC = {x: 640, y: 170, size: 220};

export const Gesta: React.FC = () => {
	const frame = useCurrentFrame();
	const GESTA = at('gesta', 'gestationnel');
	const PEND = at('gesta', 'pendant');
	const GROSS = at('gesta', 'grossesse');
	const HORM = at('gesta', 'hormones');
	const PLAC = at('gesta', 'placenta');
	const EMPE = at('gesta', 'empêchent');
	const RECH = at('gesta', 'recherche');
	const ENTRE = at('gesta', 'entre');
	const V24 = at('gesta', 'vingt-quatrième');
	const V28 = at('gesta', 'vingt-huitième');
	const AVEC = at('gesta', 'avec');
	const PRISE = at('gesta', 'prise');
	const BOISS = at('gesta', 'boisson');
	const RISQ = at('gesta', 'risque');
	const BEBE = at('gesta', 'bébé');
	const GROS = at('gesta', 'gros');
	const DISP = at('gesta', 'disparaît');
	const ACCOU = at('gesta', "l'accouchement");
	const MAIS = at('gesta', 'mais');
	const RISQ2 = at('gesta', 'risque', 2);
	const TARD = at('gesta', 'tard');
	const belly = interpolate(frame, [PEND - 2, GROSS + 16], [0.05, 1], ease);
	const inside = fadeIn(frame, HORM - 6, 12);
	const big = interpolate(frame, [BEBE - 2, GROS + 14], [0, 1], ease);
	const born = interpolate(frame, [ACCOU - 4, ACCOU + 16], [0, 1], ease);
	// la cellule de la maman (à droite) : pendant la grossesse la clé coince, après l'accouchement elle remarche
	const cellVis = frame < RECH - 4 ? fadeIn(frame, HORM - 4, 10) * (1 - fadeIn(frame, RECH - 10, 8)) : fadeIn(frame, DISP - 4, 10);
	const jam = frame < ACCOU ? fadeIn(frame, EMPE - 2, 8) : 0;
	const door = interpolate(frame, [ACCOU + 18, ACCOU + 28], [0, 1], ease);
	const keyTo = {x: GC.x + 75, y: GC.y + 10};
	// la frise des semaines : le curseur avance jusqu'à 26 SA
	const wk = interpolate(frame, [ENTRE - 2, V24, V28 + 6, AVEC], [0, 0.6, 0.7, 0.66], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[GESTA + 1, GROSS + 1, EMPE + 1, V24 + 1, GROS + 1, ACCOU + 1]} strength={0.025}>
				<Head kicker="3e type" kAt={2} title="Le diabète *gestationnel*" tAt={GESTA - 14} size={84} />
				<Stage y={440} h={560} at={4} bumps={[GROSS, EMPE, GROS, ACCOU]}>
					{/* la maman, coupée aux genoux par le bas du socle */}
					<div style={{position: 'absolute', left: MOM.x, top: 0, width: 936 - MOM.x, height: 548, overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: 0, top: MOM.y}}>
						<MomToBe width={MOM.w} belly={belly} inside={inside * (1 - born)} big={big} hormones={frame < ACCOU - 6 ? fadeIn(frame, PLAC - 2, 10) * (1 - fadeIn(frame, RECH - 10, 8)) : 0} to={{x: ((keyTo.x - MOM.x) * 320) / MOM.w, y: ((keyTo.y + 30 - MOM.y) * 320) / MOM.w}} born={born} mood={frame >= RISQ && frame < DISP ? 'inquiete' : frame >= ACCOU ? 'content' : 'calme'} />
					</div>
					</div>
					{/* la cellule et la clé */}
					{cellVis > 0 ? (
						<div style={{position: 'absolute', left: GC.x, top: GC.y, opacity: cellVis}}>
							<GCell size={GC.size} lock={1 - door} door={door} energy={frame < ACCOU ? 0.25 : 0.25 + 0.7 * door} hungry={frame >= EMPE && frame < ACCOU ? 1 : 0} fed={door} />
						</div>
					) : null}
					{cellVis > 0 ? (
						<div style={{position: 'absolute', left: keyTo.x, top: keyTo.y, transform: 'rotate(90deg) scale(0.8)', transformOrigin: '0 0', opacity: cellVis}}>
							<InsulinKey width={200} jam={jam} turn={door} />
						</div>
					) : null}
					<StagePill from={EMPE - 2} to={RECH - 8} x={420} y={470} color={LPI.pink}>
						les hormones gênent la clé
					</StagePill>
					{/* le dépistage : la boisson sucrée, puis la prise de sang */}
					{frame >= AVEC - 6 && frame < RISQ + 4 ? (
						<div style={{position: 'absolute', left: 480, top: 120, transform: `scale(${popAt(frame, AVEC - 6)})`, opacity: 1 - fadeIn(frame, RISQ - 4, 8)}}>
							<SweetDrink width={170} level={interpolate(frame, [BOISS, BOISS + 40], [1, 0.25], ease)} melt={fadeIn(frame, BOISS + 10, 20)} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, textAlign: 'center', marginTop: -14}}>boisson sucrée</div>
						</div>
					) : null}
					{frame >= PRISE - 4 && frame < RISQ + 4 ? (
						<div style={{position: 'absolute', left: 770, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `scale(${popAt(frame, PRISE - 4)})`, opacity: 1 - fadeIn(frame, RISQ - 4, 8)}}>
							<BloodVial />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>prise de sang</div>
						</div>
					) : null}
					<StagePill from={BOISS - 2} to={RISQ - 6} x={470} y={470} color={LPI.sky}>
						HGPO = le test au sucre
					</StagePill>
					{/* le risque : un bébé trop gros */}
					{frame >= TROP_AT(BEBE) && frame < DISP ? (
						<div style={{position: 'absolute', left: 470, top: 150, transform: `scale(${popAt(frame, TROP_AT(BEBE))})`, opacity: 1 - fadeIn(frame, DISP - 8, 8)}}>
							<div style={{padding: '18px 30px', borderRadius: 36, background: LPI.paper, border: `6px solid ${LPI.pink}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N, transform: `rotate(-5deg)`}}>
								bébé &gt; <span style={{color: LPI.pink}}>4 kg</span>
							</div>
						</div>
					) : null}
					<StagePill from={GROS - 2} to={DISP - 6} x={420} y={470} color={LPI.pink}>
						macrosomie = bébé trop gros
					</StagePill>
					<StagePill from={DISP - 2} x={420} y={470} color={LPI.blue}>
						en général, il disparaît
					</StagePill>
				</Stage>
				{/* sous le socle : le mot, la frise des semaines, puis le risque pour plus tard */}
				<Pop from={GESTA - 2} to={RECH - 8} x={72} y={1036} origin="left center">
					<Pill at={GESTA - 2} size={44} color={LPI.sky}>
						gestationnel = pendant la grossesse
					</Pill>
				</Pop>
				{frame >= RECH - 4 && frame < MAIS + 4 ? (
					<div style={{position: 'absolute', left: 72, top: 1030, width: 936, opacity: fadeIn(frame, RECH - 4, 10) * (1 - fadeIn(frame, MAIS - 6, 8))}}>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: alpha(N, 0.7), marginBottom: 4}}>ON LE RECHERCHE ENTRE</div>
						<WeeksBar width={936} fill={wk} win={fadeIn(frame, V24 - 2, 8)} />
						{frame >= V28 + 4 ? (
							<div style={{marginTop: 6}}>
								<Pill at={V28 + 4} size={34} color={LPI.pink}>
									24 – 28 SA (semaines d'aménorrhée)
								</Pill>
							</div>
						) : null}
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1050}}>
					<CauseChip at={RISQ2 - 4} icon={<DiabetesIcon size={56} />} label="risque de type 2 plus tard" />
				</div>
				{frame >= TARD + 6 ? (
					<div style={{position: 'absolute', left: 72, top: 1168}}>
						<Pill at={TARD + 6} size={36} color={LPI.paper}>
							on la surveille, même après la grossesse
						</Pill>
					</div>
				) : null}
			</Camera>
			<Sfx name="pop" at={GESTA - 2} volume={0.08} />
			<Sfx name="whoosh" at={PEND - 2} volume={0.06} />
			<Sfx name="heartbeat" at={HORM - 6} volume={0.05} />
			<Sfx name="buzz" at={EMPE} volume={0.05} dur={14} />
			<Sfx name="whoosh" at={RECH - 4} volume={0.06} />
			<Sfx name="ding" at={V24} volume={0.07} />
			<Sfx name="pop" at={AVEC - 6} volume={0.08} />
			<Sfx name="pop" at={PRISE - 4} volume={0.08} />
			<Sfx name="pop" at={TROP_AT(BEBE)} volume={0.09} />
			<Sfx name="impact" at={GROS} volume={0.07} />
			<Sfx name="ding" at={ACCOU + 24} volume={0.08} />
			<Sfx name="pop" at={RISQ2 - 4} volume={0.08} />
		</AbsoluteFill>
	);
};
const TROP_AT = (bebe: number) => bebe + 6;

/** « Peu d'activité » : le coureur barré. */
const NoRun: React.FC = () => (
	<div style={{position: 'relative', width: 60, height: 60}}>
		<RunIcon size={60} />
		<svg width={60} height={60} viewBox="0 0 60 60" style={{position: 'absolute', left: 0, top: 0}}>
			<path d="M8 52 L52 8" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
		</svg>
	</div>
);

/** Petit tube de sang (prise de sang). */
const BloodVial: React.FC = () => (
	<svg width={80} height={170} viewBox="0 0 80 170">
		<rect x={18} y={6} width={44} height={30} rx={8} fill={LPI.sky} stroke={N} strokeWidth={6} />
		<path d="M22 36 V146 A18 18 0 0 0 58 146 V36 Z" fill={LPI.paper} stroke={N} strokeWidth={6} strokeLinejoin="round" />
		<path d="M25 90 V146 A15 15 0 0 0 55 146 V90 Z" fill={LPI.pink} />
		<path d="M30 50 V80" stroke={alpha(LPI.sky, 0.9)} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const DANS = at('outro', 'dans');
	return (
		<AbsoluteFill>
			<RecapScene
				title="Les *3* *types*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', 'grossesse') + 16}
				rows={[
					[at('outro', 'un') - 2, 'empty', 'Type 1 · DID', 'la clé manque'],
					[at('outro', 'deux') - 2, 'squeeze', 'Type 2 · DNID', 'la clé coince'],
					[at('outro', 'gestationnel') - 4, 'check', 'Gestationnel', 'pendant la grossesse'],
				]}
			/>
			<NextUp at={DANS - 2} part={2} title="Découvrir et soigner" teaser="… le repérer à temps, et le soigner" icon={<div style={{transform: 'rotate(-40deg)'}}><InsulinPen width={110} /></div>} y={1060} />
			<Sfx name="whoosh" at={DANS - 2} volume={0.07} />
		</AbsoluteFill>
	);
};
