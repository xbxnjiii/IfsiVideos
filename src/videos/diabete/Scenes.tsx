// Scènes de « Le diabète » (format pathologie) : chaque mouvement part d'un mot de la voix (`npm run cues`).
// Accroche « paradoxe » choisie par le propriétaire (image 0 : un vaisseau rempli de sucres au-dessus de cellules aux
// portes fermées, « Du sucre partout… et elles ont faim ? » ; le sucre frappe à la porte, cadenas, la clé « INSULINE » manque,
// « C'est le diabète » flash), le principe (renvoi « vidéo glycémie », la clé ouvre la porte, le pancréas fabrique les
// clés), type 1 / type 2, le découvrir (signes, souvent silencieux, à jeun ≥ 1,26 g/L deux fois), complications,
// traitement + HbA1c, ton rôle (glycémies, injections en changeant de site, pieds, resucrage — renvoi glycémie), récap.
// Briques : src/brand/diabetes.tsx (+ glyco.tsx, wound.tsx, pain.tsx).
import React, {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BloodBand, BrainIcon, GCell, GlycatedCell, InjectionSites, InsulinKey, InsulinPen, KidneysIcon, Pancreas, Plate, VideoLink} from '../../brand/diabetes';
import {CamKey, CauseChip, Head, Pill, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {Glucometer, SugarCube} from '../../brand/glyco';
import {EyeIcon, LegIcon, PillIcon, RunIcon, ThirstIcon, TiredIcon, UrineIcon} from '../../brand/icons';
import {CheckChip, Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {NormScale, Zone} from '../../brand/NormScale';
import {Kid} from '../../brand/pain';
import {Patient} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {LowerLeg} from '../../brand/wound';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; max?: number}> = ({at: t0, max = 0.45}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, o * 0.4)} 20%, ${alpha(LPI.pink, o)} 100%)`}} />;
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; stagger?: number}> = ({from, to = 1e9, text, size = 92, y = 236, stagger = 3}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 6) return null;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, opacity: interpolate(frame, [to, to + 6], [1, 0], clamp)}}>
			<Title at={from} text={text} size={size} stagger={stagger} />
		</div>
	);
};

/** Élément qui « pop » à `from` et s'efface à `to` (posé en x, y). */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'center'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 6) return null;
	const out = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.7 + 0.3 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
};

/** Petite pastille (« ? », « ! ») qui tangue. */
const Badge: React.FC<{at: number; until?: number; x: number; y: number; text: string; tone?: string; size?: number}> = ({at: t0, until = 1e9, x, y, text, tone = LPI.pink, size = 100}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= until) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.6, color: tone === LPI.blue ? LPI.paper : N, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 8}deg)`}}>
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

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Du sucre partout… et elles ont faim ? », le sang (étiqueté) rempli de sucres au-dessus de 3 cellules
// (étiquetées) aux portes fermées.
// « rempli de sucre » : il en arrive encore ; « meurent de faim » : leurs jauges se vident, elles ont faim ; gros plan :
// un sucre frappe à la porte… et rebondit ; cadenas (croix) ; « il lui manque une clé » : la clé « INSULINE » n'est qu'un
// contour en pointillés ; « C'est le diabète » (flash, secousse).
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
	const INSU = at('intro', "l'insuline");
	const MAL = at('intro', 'maladie');
	const DIAB = at('intro', 'diabète');
	const keys: CamKey[] = [
		{at: SUCRE2 - 4, s: 1.7, x: 540, y: 760, dur: 14},
		{at: MANQ - 6, s: 1.15, x: 540, y: 880, dur: 14},
		{at: MAL - 2, s: 1, dur: 14},
	];
	const energy = interpolate(frame, [CELLU - 2, FAIM + 8], [0.45, 0.05], ease);
	const pile = Math.round(interpolate(frame, [SUCRE2 - 2, PORTE + 10], [2, 7], clamp));
	// le sucre qui frappe à la porte (cellule du milieu) puis rebondit
	const knock = frame < DEVANT - 6 || frame > IMPO + 10 ? null : interpolate(frame, [DEVANT - 6, PORTE - 2, PORTE + 2, PORTE + 8, IMPO - 2, IMPO + 2, IMPO + 10], [0, 1, 0.82, 1, 0.82, 1, 0], ease);
	const doorTop = CELL.y + ((-112 + 125) / 240) * CELL.size;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SUCRE + 1, FAIM + 1, PORTE + 1, ENTR + 1, CLE + 1, INSU + 1]} shakes={[DIAB + 2]} strength={0.04}>
				<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
					<div style={{position: 'absolute', left: 0, top: VES.y}}>
						<BloodBand width={1080} height={VES.h} sugar={interpolate(frame, [0, SUCRE + 8], [0.65, 1], clamp)} piles={CELLS.map((x) => ({x, n: frame >= SUCRE2 - 2 ? pile : 2}))} />
					</div>
					{/* étiquettes (lisibles dès l'image 0) */}
					<div style={{position: 'absolute', left: 24, top: VES.y + 14, padding: '6px 16px', borderRadius: 14, background: N, color: LPI.paper, fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.1em'}}>LE SANG</div>
					<div style={{position: 'absolute', left: 0, width: 1080, top: CELL.y + CELL.size + 14, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 34, letterSpacing: '0.14em', color: alpha(N, 0.6), opacity: 1 - fadeIn(frame, SUCRE2 - 8, 6)}}>LES CELLULES</div>
					{/* les canaux entre le vaisseau et les portes */}
					{CELLS.map((x) => (
						<div key={x} style={{position: 'absolute', left: x - 22, top: VES.y + VES.h - 6, width: 44, height: doorTop - VES.y - VES.h + 14, background: alpha(LPI.pink, 0.25), borderLeft: `5px dashed ${alpha(N, 0.3)}`, borderRight: `5px dashed ${alpha(N, 0.3)}`}} />
					))}
					{CELLS.map((x, i) => (
						<div key={x} style={{position: 'absolute', left: x - CELL.size / 2, top: CELL.y}}>
							<GCell size={CELL.size} energy={energy} hungry={fadeIn(frame, MEUR - 2, 6)} lock={frame >= IMPO - 2 ? 1 : 0.4} reject={i === 1 ? interpolate(frame, [ENTR - 2, ENTR + 2, ENTR + 20, ENTR + 26], [0, 1, 1, 0], clamp) : 0} />
						</div>
					))}
					{knock !== null ? (
						<div style={{position: 'absolute', left: 540 - 22, top: VES.y + VES.h - 50 + knock * (doorTop - VES.y - VES.h + 20)}}>
							<SugarCube size={44} rot={frame * 3} />
						</div>
					) : null}
					{/* la clé qui manque */}
					{frame >= MANQ - 2 ? (
						<div style={{position: 'absolute', left: 540 - 130, top: 1090, transform: `scale(${popAt(frame, MANQ - 2)})`}}>
							<InsulinKey width={260} ghost />
						</div>
					) : null}
					<Badge at={CLE} until={MAL - 2} x={700} y={1060} text="?" size={96} />
				</ZoomCam>
				{/* pastilles fixes */}
				<Pop from={SUCRE - 2} to={CELLU - 4} x={250} y={1110}>
					<Pill at={SUCRE - 2} size={46} color={LPI.pink}>
						plein de sucre
					</Pill>
				</Pop>
				<Pop from={FAIM - 2} to={SUCRE2 - 6} x={200} y={1110}>
					<Pill at={FAIM - 2} size={46} color={LPI.sky}>
						les cellules ont faim
					</Pill>
				</Pop>
				{/* titres */}
				<TitleAt from={-60} to={MANQ - 4} text={'Du *sucre* partout…\net elles ont *faim* ?'} size={92} stagger={0} />
				<TitleAt from={MANQ - 2} to={MAL - 4} text="Il manque une *clé*…" size={98} />
				{frame >= MAL - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, transform: `scale(${frame >= DIAB ? 1 + 0.1 * Math.exp(-(frame - DIAB) / 4) : 1})`, transformOrigin: 'left center'}}>
						<Title at={MAL - 2} text="C'est le *diabète*" size={120} stagger={4} />
					</div>
				) : null}
				<Burst at={DIAB} x={540} y={900} r={340} n={18} />
			</Camera>
			<Flash at={DIAB} />
			<Sfx name="heartbeat" at={0} volume={0.06} />
			<Sfx name="pop" at={SUCRE - 2} volume={0.08} />
			<Sfx name="buzz" at={FAIM} volume={0.05} dur={14} />
			<Sfx name="whoosh" at={SUCRE2 - 4} volume={0.07} />
			<Sfx name="tick" at={PORTE - 1} volume={0.1} />
			<Sfx name="tick" at={IMPO + 1} volume={0.1} />
			<Sfx name="buzz" at={ENTR} volume={0.05} dur={12} />
			<Sfx name="pop" at={MANQ - 2} volume={0.08} />
			<Sfx name="impact" at={DIAB} volume={0.13} />
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
	const FAB = at('def', 'fabriquée');
	const PANC = at('def', 'pancréas');
	const kx = interpolate(frame, [CLE - 2, INSU - 2], [40, DC.x - 30], ease);
	const ky = interpolate(frame, [CLE - 2, INSU - 2], [380, DC.y - 70], ease);
	const turn = interpolate(frame, [INSU, INSU + 8], [0, 1], ease);
	const door = interpolate(frame, [INSU + 6, INSU + 14], [0, 1], ease);
	const fed = interpolate(frame, [INSU + 12, INSU + 32], [0, 1], clamp);
	const energy = interpolate(frame, [INSU + 14, INSU + 40], [0.2, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CARB + 1, ENTR + 1, CLE + 1, INSU + 1, PANC + 1]} strength={0.03}>
				<Head kicker="Le principe" kAt={2} title="L'insuline, c'est la *clé*" tAt={8} />
				<Stage y={440} h={560} at={4} bumps={[CARB, INSU, PANC]}>
					<div style={{position: 'absolute', left: 20, top: 16}}>
						<BloodBand width={896} height={140} sugar={0.4} />
					</div>
					<div style={{position: 'absolute', left: DC.x - 22, top: 150, width: 44, height: DC.y - 150 + 18, background: alpha(LPI.pink, 0.25), borderLeft: `5px dashed ${alpha(N, 0.3)}`, borderRight: `5px dashed ${alpha(N, 0.3)}`}} />
					<div style={{position: 'absolute', left: DC.x - DC.size / 2, top: DC.y}}>
						<GCell size={DC.size} door={door} lock={1 - door} energy={energy} hungry={frame < INSU + 20 ? fadeIn(frame, ENTR - 2, 6) : 0} fed={fed} reject={interpolate(frame, [ENTR, ENTR + 4, CLE - 6, CLE - 2], [0, 1, 1, 0], clamp)} />
					</div>
					{frame >= CARB - 2 ? (
						<div style={{position: 'absolute', left: DC.x + 150, top: DC.y + 70, transform: `scale(${popAt(frame, CARB - 2)})`}}>
							<Pill at={CARB - 2} size={36} color={LPI.sky}>
								sucre = carburant
							</Pill>
						</div>
					) : null}
					{frame >= CLE - 2 && frame < INSU + 30 ? (
						<div style={{position: 'absolute', left: kx, top: ky, transform: `rotate(90deg) scale(${popAt(frame, CLE - 2) * 0.8})`, transformOrigin: '0 0', opacity: 1 - fadeIn(frame, INSU + 18, 10)}}>
							<InsulinKey width={200} turn={turn} />
						</div>
					) : null}
					{frame >= FAB - 4 ? (
						<div style={{position: 'absolute', left: 20, top: 380, transform: `scale(${popAt(frame, FAB - 4)})`, transformOrigin: 'left bottom'}}>
							<Pancreas width={300} make={fadeIn(frame, PANC - 2, 8)} />
						</div>
					) : null}
					<StagePill from={PANC} x={30} y={500} color={LPI.pink}>
						le pancréas fabrique l'insuline
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1018}}>
					<VideoLink at={VIDEO - 2} until={CLE - 8} title="La glycémie" />
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
			<Sfx name="tick" at={INSU + 4} volume={0.1} />
			<Sfx name="ding" at={INSU + 14} volume={0.09} />
			<Sfx name="pop" at={FAB - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · TYPE 1 / TYPE 2 ═══════════════════════════════ */
// Deux cartes. Type 1 : le pancréas s'éteint, plus de clé (pointillés), porte fermée ; souvent jeune ; insuline à vie.
// Type 2 (le plus fréquent) : le pancréas fait des clés, mais la clé coince dans la serrure ; surpoids, manque d'activité.
const TypeCard: React.FC<{at: number; x: number; tone: string; title: string; children: React.ReactNode}> = ({at: t0, x, tone, title, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: 440, width: 450, height: 700, borderRadius: 44, background: LPI.paper, border: `7px solid ${tone}`, boxShadow: SHADOW, overflow: 'hidden', transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 74, background: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: tone === LPI.blue ? LPI.paper : N, letterSpacing: '0.04em'}}>{title}</div>
			{children}
		</div>
	);
};

export const Types: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('types', 'un');
	const MANQ = at('types', 'manque');
	const FABR = at('types', 'fabrique');
	const JEUN = at('types', 'jeunes');
	const SOIG = at('types', 'soigne');
	const VIE = at('types', 'vie');
	const DEUX = at('types', 'deux');
	const FREQ = at('types', 'fréquent');
	const MARCHE = at('types', 'marche');
	const SURP = at('types', 'surpoids');
	const ACTI = at('types', "d'activité");
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[UN + 1, MANQ + 1, JEUN + 1, DEUX + 1, MARCHE + 1, SURP + 1]} strength={0.03}>
				<Head kicker="Deux types" kAt={2} title="Type *1* · type *2*" tAt={8} size={100} />
				<TypeCard at={UN - 2} x={72} tone={LPI.pink} title="TYPE 1">
					<div style={{position: 'absolute', left: 70, top: 92}}>
						<Pancreas width={300} dead={fadeIn(frame, FABR - 2, 10)} />
					</div>
					<div style={{position: 'absolute', left: 140, top: 290}}>
						<GCell size={170} lock={1} energy={0.08} hungry={1} />
					</div>
					{frame >= MANQ - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 296, transform: `scale(${popAt(frame, MANQ - 2)}) rotate(-20deg)`}}>
							<InsulinKey width={130} ghost label={false} />
						</div>
					) : null}
					<Pop from={FABR} x={24} y={222} origin="left center">
						<Pill at={FABR} size={28} color={LPI.pink}>
							plus d'insuline
						</Pill>
					</Pop>
					{frame >= JEUN - 4 ? (
						<div style={{position: 'absolute', left: 24, top: 480, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${popAt(frame, JEUN - 4)})`, transformOrigin: 'left center'}}>
							<Kid size={90} />
							<Pill at={JEUN - 4} size={32} color={LPI.sky}>
								souvent jeune
							</Pill>
						</div>
					) : null}
					{frame >= SOIG - 2 ? (
						<div style={{position: 'absolute', left: 24, top: 592, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${popAt(frame, SOIG - 2)})`, transformOrigin: 'left center'}}>
							<InsulinPen width={170} />
							<Pill at={VIE - 2} size={32} color={LPI.pink}>
								à vie
							</Pill>
						</div>
					) : null}
				</TypeCard>
				<TypeCard at={DEUX - 2} x={558} tone={LPI.blue} title="TYPE 2">
					<div style={{position: 'absolute', left: 70, top: 92}}>
						<Pancreas width={300} make={1} />
					</div>
					<div style={{position: 'absolute', left: 140, top: 290}}>
						<GCell size={170} lock={1} energy={0.25} hungry={fadeIn(frame, MARCHE, 6)} reject={fadeIn(frame, MARCHE + 4, 6)} />
					</div>
					{frame >= DEUX + 6 ? (
						<div style={{position: 'absolute', left: 40, top: 292, transform: `scale(${popAt(frame, DEUX + 6)}) rotate(-20deg)`}}>
							<InsulinKey width={130} jam={fadeIn(frame, MARCHE - 2, 6)} label={false} />
						</div>
					) : null}
					<Pop from={MARCHE} x={24} y={222} origin="left center">
						<Pill at={MARCHE} size={28} color={LPI.blue}>
							la clé coince
						</Pill>
					</Pop>
					{frame >= FREQ - 2 ? (
						<div style={{position: 'absolute', left: 24, top: 492}}>
							<Pill at={FREQ - 2} size={30} color={LPI.sky}>
								le plus fréquent (9 sur 10)
							</Pill>
						</div>
					) : null}
					<div style={{position: 'absolute', left: 24, top: 592, display: 'flex', gap: 10}}>
						{frame >= SURP - 2 ? (
							<Pill at={SURP - 2} size={30} color={LPI.paper}>
								surpoids
							</Pill>
						) : null}
						{frame >= ACTI - 6 ? (
							<Pill at={ACTI - 6} size={30} color={LPI.paper}>
								peu d'activité
							</Pill>
						) : null}
					</div>
				</TypeCard>
			</Camera>
			<Sfx name="pop" at={UN - 2} volume={0.09} />
			<Sfx name="buzz" at={FABR} volume={0.04} dur={12} />
			<Sfx name="pop" at={JEUN - 4} volume={0.08} />
			<Sfx name="pop" at={DEUX - 2} volume={0.09} />
			<Sfx name="buzz" at={MARCHE} volume={0.05} dur={14} />
			<Sfx name="pop" at={SURP - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LE DÉCOUVRIR ═══════════════════════════════ */
// Les signes arrivent en pastilles (soif, urines, fatigue) ; « mais » : ils pâlissent, le patient va bien (« souvent aucun
// signe ») ; la prise de sang : 2 résultats à jeun ; l'échelle (normale · intermédiaire · diabète ≥ 1,26 g/L) ; « deux
// fois » : tampon.
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
	const SOIF = at('diag', 'soif');
	const URIN = at('diag', "d'urines");
	const FATI = at('diag', 'fatigue');
	const MAIS = at('diag', 'mais');
	const SILE = at('diag', 'silencieux');
	const PRISE = at('diag', 'prise');
	const REVE = at('diag', 'révèle');
	const DIAB = at('diag', 'diabète');
	const ATTE = at('diag', 'atteint');
	const VING = at('diag', 'vingt-six');
	const DEUX = at('diag', 'deux');
	const FOIS = at('diag', 'fois');
	const chips = 1 - fadeIn(frame, PRISE - 6, 8);
	const dim = 1 - 0.6 * fadeIn(frame, MAIS, 8);
	const value = interpolate(frame, [ATTE - 2, VING + 10], [0.95, 1.32], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SOIF + 1, URIN + 1, FATI + 1, SILE + 1, PRISE + 1, VING + 1, FOIS + 1]} strength={0.03}>
				<Head kicker="Le découvrir" kAt={2} title="Souvent *silencieux*" tAt={8} />
				<Stage y={440} h={520} at={4} bumps={[SILE, PRISE, FOIS]}>
					<div style={{position: 'absolute', left: 30, top: 60}}>
						<Patient size={280} breath={idle(frame)} mood={frame >= MAIS ? 'content' : 'mal'} sweat={frame < MAIS ? 0.5 : 0} />
					</div>
					{chips > 0 ? (
						<div style={{position: 'absolute', left: 350, top: 40, display: 'flex', flexDirection: 'column', gap: 16, opacity: chips * dim}}>
							<CauseChip at={SOIF - 2} icon={<ThirstIcon size={52} />} label="très soif" tone={LPI.sky} />
							<CauseChip at={URIN - 2} icon={<UrineIcon size={52} />} label="beaucoup d'urines" tone={LPI.sky} />
							<CauseChip at={FATI - 2} icon={<TiredIcon size={52} />} label="fatigue" tone={LPI.sky} />
						</div>
					) : null}
					<StagePill from={SILE - 2} to={PRISE - 6} color={LPI.pink} x={350} y={400}>
						souvent aucun signe
					</StagePill>
					<div style={{position: 'absolute', left: 360, top: 50, display: 'flex', gap: 24}}>
						<LabSlip at={PRISE - 2} label="1re PRISE DE SANG" value="1,32 g/L" ok={fadeIn(frame, VING, 4)} />
						<LabSlip at={DEUX - 4} label="2e PRISE DE SANG" value="1,40 g/L" ok={1} />
					</div>
					<StagePill from={REVE - 2} to={DIAB - 4} color={LPI.blue} x={360} y={420}>
						la prise de sang le révèle
					</StagePill>
				</Stage>
				<NormScale zones={DIAB_ZONES} value={value} at={DIAB - 4} markerAt={ATTE - 2} y={990} tag="À jeun" rangeSize={20} />
				<Stamp at={FOIS + 2} x={700} y={850} text="2 fois = diabète" size={52} rot={-6} />
			</Camera>
			{[SOIF, URIN, FATI].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="whoosh" at={MAIS} volume={0.05} />
			<Sfx name="pop" at={PRISE - 2} volume={0.09} />
			<Sfx name="ding" at={VING} volume={0.08} />
			<Sfx name="pop" at={DEUX - 4} volume={0.09} />
			<Sfx name="stamp" at={FOIS + 2} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LES COMPLICATIONS ═══════════════════════════════ */
// « pendant des années » ; vaisseaux et nerfs ; la caméra va des yeux aux reins, au cœur, au cerveau ; puis le pied :
// une petite plaie qu'on ne sent pas (le message de douleur ne remonte plus), elle grandit… jusqu'à l'amputation.
const CP = {x: 100, y: 30, size: 330};
const cPt = (px: number, py: number) => ({x: CP.x + (px * CP.size) / 400, y: CP.y + (py * CP.size) / 400});
const CL = {x: 600, y: 120, w: 270};
const clPt = (px: number, py: number) => ({x: CL.x + (px * CL.w) / 500, y: CL.y + (py * CL.w) / 500});

const OrganMarks: React.FC<{eyes: number; kidneys: number}> = ({eyes, kidneys}) => {
	const frame = useCurrentFrame();
	const id = useId();
	const k = CP.size / 400;
	return (
		<svg key={id} width={CP.size} height={CP.size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', left: CP.x, top: CP.y, overflow: 'visible'}}>
			{eyes > 0
				? [176, 224].map((x) => <circle key={x} cx={x} cy={118} r={18 + 3 * Math.sin(frame / 3)} fill="none" stroke={LPI.pink} strokeWidth={6 / Math.max(0.6, k)} opacity={eyes} />)
				: null}
			{kidneys > 0
				? [
						[156, 405, 1],
						[244, 405, -1],
					].map(([x, y, s]) => (
						<path key={x} d="M0 -30 C22 -30 30 -14 28 2 C26 22 14 32 -2 30 C-14 28 -12 14 -8 4 C-2 -4 -14 -10 -16 -16 C-20 -28 -12 -30 0 -30 Z" transform={`translate(${x} ${y}) scale(${s} 1)`} fill={alpha(LPI.pink, 0.85)} stroke={N} strokeWidth={5} opacity={kidneys} />
					))
				: null}
		</svg>
	);
};

export const Compli: React.FC = () => {
	const frame = useCurrentFrame();
	const ANNE = at('compli', 'années');
	const VAIS = at('compli', 'vaisseaux');
	const NERF = at('compli', 'nerfs');
	const YEUX = at('compli', 'yeux');
	const REIN = at('compli', 'reins');
	const COEU = at('compli', 'cœur');
	const CERV = at('compli', 'cerveau');
	const PIED = at('compli', 'pieds');
	const PLAI = at('compli', 'plaie');
	const SENT = at('compli', 'sent');
	const AMPU = at('compli', "l'amputation");
	const eye = cPt(200, 118);
	const kid = cPt(200, 405);
	const hrt = cPt(228, 300);
	const brn = cPt(200, 66);
	const sole = clPt(372, 660);
	const keys: CamKey[] = [
		{at: YEUX - 4, s: 2.4, x: eye.x, y: eye.y + 10, dur: 12},
		{at: REIN - 4, s: 1.7, x: kid.x, y: kid.y, dur: 12},
		{at: COEU - 4, s: 2, x: hrt.x, y: hrt.y, dur: 12},
		{at: CERV - 4, s: 2.2, x: brn.x, y: brn.y + 20, dur: 12},
		{at: PIED - 4, s: 1.5, x: sole.x - 60, y: sole.y - 120, dur: 14},
		{at: AMPU + 14, s: 1, dur: 14},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ANNE + 1, VAIS + 1, YEUX + 1, REIN + 1, COEU + 1, CERV + 1, PIED + 1, AMPU + 1]} strength={0.03}>
				<Head kicker="Les complications" kAt={2} title="Le sucre en trop *abîme*" tAt={8} size={84} />
				<Stage y={440} h={540} at={4} bumps={[VAIS, YEUX, PIED, AMPU]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: CP.x, top: CP.y}}>
							<Patient size={CP.size} breath={idle(frame)} heart={fadeIn(frame, COEU - 4, 6)} beat={pulseAt(frame, 22)} flow={fadeIn(frame, VAIS - 4, 8)} brain={fadeIn(frame, CERV - 4, 6)} mood={frame >= YEUX ? 'mal' : 'calme'} />
						</div>
						<OrganMarks eyes={interpolate(frame, [YEUX - 2, YEUX + 4, REIN - 4, REIN], [0, 1, 1, 0.3], clamp)} kidneys={fadeIn(frame, REIN - 2, 6)} />
						{frame >= PIED - 6 ? (
							<div style={{position: 'absolute', left: CL.x, top: CL.y, transform: `scale(${popAt(frame, PIED - 6)})`, transformOrigin: '50% 100%'}}>
								<LowerLeg width={CL.w} footSore={fadeIn(frame, PLAI - 2, 6)} grow={interpolate(frame, [PLAI + 4, AMPU + 10], [0, 1], clamp)} silent={fadeIn(frame, SENT, 10)} nerve={fadeIn(frame, SENT - 4, 6)} numb={fadeIn(frame, SENT + 2, 6)} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={ANNE - 2} to={VAIS - 4} color={LPI.sky}>
						pendant des années
					</StagePill>
					<StagePill from={VAIS - 2} to={YEUX - 4} color={LPI.pink}>
						vaisseaux et nerfs abîmés
					</StagePill>
					<StagePill from={SENT - 2} color={LPI.pink}>
						il ne sent pas la plaie
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010}}>
					<CauseChip at={YEUX - 2} icon={<EyeIcon size={52} />} label="yeux · cécité" />
				</div>
				<div style={{position: 'absolute', left: 540, top: 1010}}>
					<CauseChip at={REIN - 2} icon={<KidneysIcon size={52} />} label="reins · dialyse" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CauseChip at={COEU - 2} icon={<HeartIco size={52} />} label="cœur · infarctus" />
				</div>
				<div style={{position: 'absolute', left: 540, top: 1120}}>
					<CauseChip at={CERV - 2} icon={<BrainIcon size={52} />} label="cerveau · AVC" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1230}}>
					<CauseChip at={AMPU - 2} icon={<LegIcon size={52} />} label="pieds · amputation" />
				</div>
			</Camera>
			<Sfx name="tick" at={ANNE} volume={0.07} />
			{[YEUX, REIN, COEU, CERV].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="whoosh" at={PIED - 4} volume={0.06} />
			<Sfx name="buzz" at={SENT} volume={0.05} dur={14} />
			<Sfx name="impact" at={AMPU} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · LE TRAITEMENT ═══════════════════════════════ */
// 4 étapes (assiette, activité, puis comprimés, insuline) ; le suivi : un globule rouge se couvre de sucres (hémoglobine
// glyquée), « 3 mois », objectif souvent ≤ 7 %.
const Step: React.FC<{at: number; x: number; label: string; children: React.ReactNode; tone?: string}> = ({at: t0, x, label, children, tone = LPI.paper}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: 460, width: 200, height: 250, borderRadius: 34, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{height: 130, display: 'flex', alignItems: 'center'}}>{children}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, textAlign: 'center', lineHeight: 1.05, whiteSpace: 'pre-line'}}>{label}</div>
		</div>
	);
};

const Months: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{display: 'flex', gap: 10, transform: `scale(${popAt(frame, t0)})`, transformOrigin: 'left center'}}>
			{['M1', 'M2', 'M3'].map((m, i) => (
				<div key={m} style={{width: 74, height: 84, borderRadius: 14, background: LPI.paper, border: `5px solid ${N}`, overflow: 'hidden', opacity: interpolate(frame, [t0 + i * 4, t0 + i * 4 + 4], [0, 1], clamp)}}>
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
	const PUIS = at('trait', 'puis');
	const COMP = at('trait', 'comprimés');
	const INSU = at('trait', "l'insuline");
	const SUIV = at('trait', 'suivi');
	const HEMO = at('trait', "l'hémoglobine");
	const GLYQ = at('trait', 'glyquée');
	const REFL = at('trait', 'reflet');
	const TROIS = at('trait', 'trois');
	const MOIS = at('trait', 'mois');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ALIM + 1, ACTI + 1, COMP + 1, INSU + 1, HEMO + 1, TROIS + 1]} strength={0.03}>
				<Head kicker="Le traitement" kAt={2} title="*Hygiène* de vie… puis *médicaments*" tAt={8} size={88} />
				<Step at={ALIM - 2} x={72} label={'alimentation\néquilibrée'}>
					<Plate size={120} />
				</Step>
				<Step at={ACTI - 2} x={300} label={'activité\nphysique'}>
					<RunIcon size={110} />
				</Step>
				{frame >= PUIS - 2 ? (
					<div style={{position: 'absolute', left: 506, top: 560, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: LPI.blue, transform: `scale(${popAt(frame, PUIS - 2)})`}}>puis</div>
				) : null}
				<Step at={COMP - 2} x={576} label={'comprimés\n(type 2)'} tone={alpha(LPI.sky, 0.6)}>
					<PillIcon size={110} />
				</Step>
				<Step at={INSU - 2} x={804} label={'insuline\nsi besoin'} tone={alpha(LPI.sky, 0.6)}>
					<div style={{transform: 'rotate(-50deg)'}}>
						<InsulinPen width={160} />
					</div>
				</Step>
				{/* le suivi : l'hémoglobine glyquée */}
				{frame >= SUIV - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 760, width: 936, height: 300, borderRadius: 44, background: alpha(LPI.sky, 0.45), opacity: fadeIn(frame, SUIV - 4, 8)}}>
						<div style={{position: 'absolute', left: 30, top: 20, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: alpha(N, 0.7)}}>LE SUIVI</div>
						{frame >= HEMO - 4 ? (
							<div style={{position: 'absolute', left: 30, top: 70, transform: `scale(${popAt(frame, HEMO - 4)})`}}>
								<GlycatedCell width={230} coat={interpolate(frame, [HEMO, GLYQ + 24], [0, 1], clamp)} />
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
							{frame >= REFL - 2 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, opacity: fadeIn(frame, REFL - 2, 6), lineHeight: 1.1}}>le sucre sur{frame >= TROIS - 2 ? <><br /><span style={{color: LPI.blue}}>3 mois</span></> : '…'}</div> : null}
						</div>
					</div>
				) : null}
				{frame >= MOIS + 8 ? (
					<div style={{position: 'absolute', left: 72, top: 1090}}>
						<Pill at={MOIS + 8} size={36} color={LPI.paper}>
							objectif souvent : HbA1c ≤ 7 %
						</Pill>
					</div>
				) : null}
			</Camera>
			{[ALIM, ACTI, COMP, INSU].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="whoosh" at={SUIV - 4} volume={0.06} />
			<Sfx name="tick" at={GLYQ} volume={0.08} />
			<Sfx name="ding" at={TROIS} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · TON RÔLE ═══════════════════════════════ */
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
			<Camera punches={[CTRL + 1, INJ + 1, CHAN + 1, REGA + 1, HYPO + 1, RESU + 1]} strength={0.03}>
				<Head kicker="Ton rôle" kAt={2} title="Surveiller et *prévenir*" tAt={8} />
				<Panel at={CTRL - 2} x={72} y={440} title="glycémies capillaires">
					<div style={{position: 'absolute', left: 70, top: 20, transform: 'scale(0.72)', transformOrigin: '0 0'}}>
						<Glucometer value={interpolate(frame, [CTRL + 4, CTRL + 24], [0, 1.45], clamp)} strip={1} blood={1} tone={null} beep={pulseAt(frame - CTRL, 1000)} />
					</div>
				</Panel>
				<Panel at={INJ - 2} x={552} y={440} title="insuline : changer de site">
					<div style={{position: 'absolute', left: 20, top: 26}}>
						<InsulinPen width={180} press={frame >= CHAN - 2 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0} />
					</div>
					<div style={{position: 'absolute', left: 210, top: 10}}>
						<InjectionSites width={220} done={Math.max(0, active)} active={active} />
					</div>
				</Panel>
				<Panel at={REGA - 2} x={72} y={730} title="les pieds, tous les jours">
					<div style={{position: 'absolute', left: 20, top: -140}}>
						<LowerLeg width={230} />
					</div>
					<svg width={130} height={130} viewBox="0 0 130 130" style={{position: 'absolute', left: 100 + Math.sin(frame / 10) * 40, top: 30}}>
						<circle cx={50} cy={50} r={36} fill={alpha(LPI.paper, 0.4)} stroke={N} strokeWidth={9} />
						<path d="M76 76 L112 112" stroke={N} strokeWidth={16} strokeLinecap="round" />
					</svg>
					{/* « tous les jours » : la semaine se coche */}
					<div style={{position: 'absolute', left: 262, top: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 40px)', gap: 8}}>
						{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
							const ok = frame >= JOUR - 4 + i * 3;
							return (
								<div key={i} style={{width: 40, height: 40, borderRadius: 12, border: `4px solid ${N}`, background: ok ? LPI.pink : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 22, color: N, opacity: fadeIn(frame, REGA, 6), transform: `scale(${ok ? popAt(frame, JOUR - 4 + i * 3) : 1})`}}>
									{ok ? '✓' : d}
								</div>
							);
						})}
					</div>
				</Panel>
				<Panel at={HYPO - 2} x={552} y={730} title="hypo : on resucre !">
					<div style={{position: 'absolute', left: 20, top: 30, transform: 'scale(0.6)', transformOrigin: '0 0'}}>
						<Glucometer value={0.55} strip={1} blood={1} tone={LPI.pink} beep={0} />
					</div>
					<div style={{position: 'absolute', left: 300, top: 40, display: 'flex', flexDirection: 'column', gap: 8}}>
						{[0, 1, 2].map((i) =>
							frame >= RESU - 2 + i * 4 ? (
								<div key={i} style={{transform: `scale(${popAt(frame, RESU - 2 + i * 4)})`}}>
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
			<Sfx name="pop" at={CTRL - 2} volume={0.08} />
			<Sfx name="ding" at={CTRL + 24} volume={0.07} />
			<Sfx name="pop" at={INJ - 2} volume={0.08} />
			{[CHAN, SITE, CHAQ, FOIS].map((t) => (
				<Sfx key={t} name="tick" at={t - 2} volume={0.06} />
			))}
			<Sfx name="pop" at={REGA - 2} volume={0.08} />
			<Sfx name="buzz" at={HYPO} volume={0.05} dur={12} />
			<Sfx name="whoosh" at={COMME - 2} volume={0.06} />
			<Sfx name="pop" at={RESU - 2} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Le *diabète*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', "d'hypo") + 14}
		rows={[
			[at('outro', 'diabète'), 'up', 'Trop de sucre', 'dans le sang'],
			[at('outro', 'un'), 'empty', 'Type 1', "l'insuline manque"],
			[at('outro', 'deux'), 'squeeze', 'Type 2', 'elle marche mal'],
			[at('outro', 'abîme'), 'alert', 'Il abîme', 'yeux, reins, cœur, pieds'],
			[at('outro', 'rôle'), 'check', 'Ton rôle', 'glycémies · insuline · pieds'],
			[at('outro', "d'hypo"), 'alert', 'Hypo ?', 'on resucre !'],
		]}
	/>
);
