// Scènes de « Le cancer de la prostate » (n° 49, voix gratuite d'abord). Accroche sans texte, réaliste : la chambre la
// nuit, il se lève à 1 h, 3 h, 5 h pour aller aux toilettes ; « c'est l'âge… » ; la caméra plonge vers sa prostate.
// Puis la prostate (châtaigne, sous la vessie, autour de l'urètre), l'adénome (sans gravité, serre l'urètre : levers la
// nuit, jet faible), le cancer (cellules qui se multiplient, 1er cancer de l'homme, souvent aucun signe au début), les
// signes tardifs, les examens (toucher rectal, PSA, IRM, biopsie), les risques, les traitements, chute « dès 50 ans ».
// Storyboard : docs/lpi/storyboard-cancer-prostate.md.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {ScanMonitor} from '../../brand/devices';
import {Drop} from '../../brand/hands';
import {MoonIcon, PillIcon, RibbonIcon, ScalpelIcon} from '../../brand/icons';
import {Stetho, Walker} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst} from '../../brand/motion3';
import {Bubble} from '../../brand/pain';
import {AgeIcon, AlarmClock, BonePain, Bedroom, CellField, Chestnut, FamilyIcon, GlobeIcon, NIGHT, Pelvis, PELVIS, pelvisPt, RayIcon, ROOM, WatchIcon} from '../../brand/prostate';
import {BloodTube} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Bassin posé en (left, top) sur W pixels. */
const PelvisAt: React.FC<{left?: number; top?: number; W?: number; o?: number} & React.ComponentProps<typeof Pelvis>> = ({left = 90, top = 280, W = 900, o = 1, ...p}) => (
	<div style={{position: 'absolute', left, top, opacity: o}}>
		<Pelvis width={W} {...p} />
	</div>
);
const pp = (k: keyof typeof PELVIS, left = 90, top = 280, W = 900) => pelvisPt(PELVIS[k], left, top, W);

/** Petite pastille de texte (sans coche), centrée sur (x, y). */
const Pill: React.FC<{at: number; x: number; y: number; tone?: string; size?: number; children: React.ReactNode}> = ({at: t0, x, y, tone = LPI.sky, size = 44, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, padding: '12px 28px', borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12}}>
			{children}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE : IL SE LÈVE LA NUIT ═══════════════════════════════ */
const MAN_W = 330;
const MAN_TOP = ROOM.floor - (590 * MAN_W) / 300;

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const LEVE = at('intro', 'lève');
	const TOIL = at('intro', 'toilettes');
	const TROIS = at('intro', 'trois');
	const ENC1 = at('intro', 'encore');
	const CINQ = at('intro', 'cinq');
	const ENC2 = at('intro', 'encore', 2);
	const ET = at('intro', 'et');
	const DIT = at('intro', 'dit');
	const AGE = at('intro', "l'âge");
	const PEUT = at('intro', 'peut-être');
	const MAIS = at('intro', 'mais');
	const VERIF = at('intro', 'vérifier');
	const PROST = at('intro', 'prostate');

	// trois réveils : il se lève, marche jusqu'à la porte, la porte s'ouvre, il sort
	const cycles = [
		{s: LEVE - 3, door: TOIL - 6, end: TROIS - 2, walk: 30},
		{s: ENC1 - 8, door: ENC1, end: CINQ - 2, walk: 20},
		{s: ENC2 - 8, door: ENC2, end: ET, walk: 18},
	];
	const time = frame < TROIS ? '01:00' : frame < CINQ ? '03:00' : '05:00';
	const clockPop = Math.max(0, 1 - Math.abs(frame - TROIS) / 6) + Math.max(0, 1 - Math.abs(frame - CINQ) / 6);
	let lamp = 0;
	let door = 0;
	let asleep = 1;
	let manX: number | null = null;
	let manO = 1;
	let flip = false;
	let walking = true;
	for (const c of cycles) {
		if (frame >= c.s && frame < c.end) {
			const t = frame - c.s;
			lamp = fadeIn(frame, c.s, 4);
			asleep = 1 - lin(frame, c.s, c.s + 6);
			const w = lin(frame, c.s + 6, c.s + 6 + c.walk);
			manX = interpolate(w, [0, 1], [ROOM.bedX + 230, ROOM.doorX + 40]);
			manO = fadeIn(frame, c.s + 2, 5) * (1 - lin(frame, c.s + 6 + c.walk - 2, c.s + 6 + c.walk + 6));
			door = lin(frame, c.door - 4, c.door + 6);
			if (t < 0) manX = null;
		}
	}
	// retour : il ressort des toilettes et s'arrête au milieu de la chambre (tourné vers la gauche)
	if (frame >= ET) {
		lamp = 1;
		asleep = 0;
		door = 1;
		flip = true;
		const w = lin(frame, ET, DIT + 14);
		manX = interpolate(w, [0, 1], [ROOM.doorX + 20, ROOM.standX - 40]);
		manO = fadeIn(frame, ET, 6);
		walking = w < 1;
	}
	// caméra : plongée vers son bas-ventre
	const belly = {x: (manX ?? 0) + (flip ? 300 - 176 : 176) * (MAN_W / 300), y: MAN_TOP + 322 * (MAN_W / 300)};
	const cz = lin(frame, MAIS - 2, PROST + 8);
	const s = 1 + 1.7 * cz;
	const tx = interpolate(cz, [0, 1], [0, 540 - belly.x * s]);
	const ty = interpolate(cz, [0, 1], [0, 900 - belly.y * s]);
	const lens = popAt(frame, VERIF - 2);
	const head = {x: (manX ?? 0) + (flip ? 300 - 196 : 196) * (MAN_W / 300), y: MAN_TOP + 40};
	return (
		<AbsoluteFill style={{background: '#0A1024', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
				<Bedroom lamp={lamp} door={door} asleep={asleep} time={time} clockPop={clockPop}>
					{manX !== null && manO > 0 ? (
						<foreignObject x={manX} y={MAN_TOP} width={MAN_W} height={MAN_W * 2} opacity={manO} style={{overflow: 'visible'}}>
							<div style={{transform: flip ? 'scaleX(-1)' : undefined, width: MAN_W}}>
								<Walker width={MAN_W} pose="walk" phase={walking ? frame * 0.3 : 0} hair="old" shirt={NIGHT.pyjama} tee skin={NIGHT.skin} />
							</div>
						</foreignObject>
					) : null}
				</Bedroom>
				{/* loupe « rayons X » sur le bas-ventre : la vessie et la prostate */}
				{lens > 0.01 && manX !== null ? (
					<div style={{position: 'absolute', left: belly.x - 120, top: belly.y - 120, width: 240, height: 240, borderRadius: 120, overflow: 'hidden', border: `8px solid ${LPI.paper}`, boxShadow: `0 0 40px ${alpha(LPI.sky, 0.8)}`, background: alpha(LPI.navy, 0.85), transform: `scale(${lens})`}}>
						<div style={{position: 'absolute', left: -78, top: -74}}>
							<Pelvis width={360} body={false} fill={0.8} glow={fadeIn(frame, PROST - 2, 6)} />
						</div>
					</div>
				) : null}
			</AbsoluteFill>
			{/* « c'est l'âge… » : bulle de pensée */}
			{frame >= DIT + 2 && frame < MAIS + 4 ? (
				<div style={{position: 'absolute', left: head.x - 360, top: head.y - 230, transform: `scale(${popAt(frame, DIT + 2)})`, opacity: 1 - lin(frame, MAIS - 4, MAIS + 4)}}>
					<Bubble think tail="right">
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>
							C'est l'âge…{frame >= PEUT ? <span style={{color: LPI.pink}}> ?</span> : null}
						</span>
					</Bubble>
				</div>
			) : null}
			{/* le réveil en gros plan (en haut) : l'heure qui avance */}
			{frame < ET + 8 ? (
				<div style={{position: 'absolute', left: 540 - 231, top: 70, width: 462, height: 252, opacity: 1 - lin(frame, ET, ET + 8), transform: `scale(${1 + 0.08 * clockPop})`}}>
					<div style={{transform: 'scale(2.1)', transformOrigin: '0 0'}}>
						<AlarmClock time={time} />
					</div>
				</div>
			) : null}
			<Sfx name="tap" at={TOIL + 6} volume={0.05} dur={20} />
			<Sfx name="tick" at={TROIS} volume={0.08} />
			<Sfx name="tick" at={CINQ} volume={0.08} />
			<Sfx name="sigh" at={AGE - 4} volume={0.3} />
			<Sfx name="whoosh" at={MAIS} volume={0.08} />
			<Sfx name="ding" at={PROST} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA PROSTATE ═══════════════════════════════ */
export const Prostate: React.FC = () => {
	const frame = useCurrentFrame();
	const PR = at('prostate', 'prostate');
	const GLANDE = at('prostate', 'glande');
	const CHAT = at('prostate', 'châtaigne');
	const SOUS = at('prostate', 'sous');
	const VESSIE = at('prostate', 'vessie');
	const ENTOURE = at('prostate', 'entoure');
	const CANAL = at('prostate', 'canal');
	const URETRE = at('prostate', "l'urètre");
	const FABRIQUE = at('prostate', 'fabrique');
	const SPERME = at('prostate', 'sperme');
	const P = pp('prostate');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={ENTOURE - 6} text={'La *prostate*'} size={110} y={150} center />
			<Big from={ENTOURE} text={"Autour de *l'urètre*"} size={96} y={150} center />
			<PelvisAt o={fadeIn(frame, 0, 8)} glow={fadeIn(frame, PR, 8) * (1 - 0.6 * lin(frame, VESSIE, VESSIE + 10))} bladderGlow={fadeIn(frame, VESSIE - 2, 6) * (1 - lin(frame, ENTOURE, ENTOURE + 8))} urethraGlow={fadeIn(frame, CANAL - 2, 8)} flow={fadeIn(frame, CANAL, 8)} />
			<PointTag at={GLANDE - 2} to={CHAT - 4} x={330} y={1360} px={P.x} py={P.y + 40} size={44} tone={LPI.pink}>
				une petite glande
			</PointTag>
			{frame >= CHAT - 2 ? (
				<div style={{position: 'absolute', left: 380, top: 1270, transform: `scale(${popAt(frame, CHAT - 2)})`}}>
					<Chestnut size={170} />
				</div>
			) : null}
			<PointTag at={CHAT + 4} to={SOUS - 2} x={790} y={1360} px={560} py={1350} size={42}>
				une châtaigne
			</PointTag>
			<PointTag at={VESSIE - 2} to={ENTOURE - 4} x={250} y={330} px={pp('bladder').x - 40} py={pp('bladder').y - 40} size={46} tone={LPI.sky}>
				la vessie
			</PointTag>
			<PointTag at={URETRE - 2} x={790} y={1300} px={pp('urethra').x} py={pp('urethra').y + 60} size={46} tone={LPI.sky}>
				l'urètre : l'urine sort
			</PointTag>
			<Note at={FABRIQUE} y={1520} size={46} tone={LPI.pink}>
				+ une partie du sperme
			</Note>
			<Sfx name="pop" at={GLANDE - 2} volume={0.07} />
			<Sfx name="pop" at={CHAT - 2} volume={0.08} />
			<Sfx name="pop" at={VESSIE - 2} volume={0.07} />
			<Sfx name="pop" at={URETRE - 2} volume={0.07} />
			<Sfx name="pop" at={SPERME - 8} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ADÉNOME ═══════════════════════════════ */
export const Adenome: React.FC = () => {
	const frame = useCurrentFrame();
	const GROSSIT = at('adenome', 'grossit');
	const ADENOME = at('adenome', "l'adénome");
	const GROSSE = at('adenome', 'grosse');
	const GRAVITE = at('adenome', 'gravité');
	const SERRE = at('adenome', 'serre');
	const ENVIES = at('adenome', 'envies');
	const JET = at('adenome', 'jet');
	const grow = lin(frame, GROSSIT - 2, GROSSIT + 30);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={ADENOME - 6} text={'Avec *l\'âge*…'} size={110} y={150} center />
			<Big from={ADENOME} text={"*L'adénome*"} size={110} y={150} center />
			<PelvisAt grow={grow} flow={1} glow={fadeIn(frame, GROSSIT, 8) * (1 - lin(frame, SERRE - 4, SERRE + 6))} urethraGlow={fadeIn(frame, SERRE - 2, 6)} />
			{frame < SERRE + 4 ? (
				<AbsoluteFill style={{opacity: 1 - lin(frame, SERRE - 6, SERRE + 2)}}>
					<Pill at={GROSSE - 2} x={540} y={1390} tone={LPI.paper}>
						une grosse prostate
					</Pill>
					<Pill at={GRAVITE - 2} x={540} y={1500} tone={LPI.sky}>
						sans gravité ✓
					</Pill>
				</AbsoluteFill>
			) : null}
			{frame >= SERRE - 2 ? (
				<PointTag at={SERRE - 2} x={540} y={1400} px={pp('urethra').x} py={pp('urethra').y - 50} size={44} tone={LPI.pink}>
					l'urètre est serré
				</PointTag>
			) : null}
			{frame >= ENVIES - 4 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, ENVIES - 4, 6)}}>
					<Pill at={ENVIES - 4} x={300} y={1530} tone={LPI.paper}>
						<MoonIcon size={56} /> levers la nuit
					</Pill>
					<Pill at={JET - 2} x={790} y={1530} tone={LPI.paper}>
						jet faible
					</Pill>
				</AbsoluteFill>
			) : null}
			<Sfx name="whoosh" at={GROSSIT} volume={0.06} />
			<Sfx name="pop" at={GROSSE - 2} volume={0.07} />
			<Sfx name="ding" at={GRAVITE - 2} volume={0.06} />
			<Sfx name="pop" at={ENVIES - 4} volume={0.07} />
			<Sfx name="pop" at={JET - 2} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE CANCER ═══════════════════════════════ */
export const Cancer: React.FC = () => {
	const frame = useCurrentFrame();
	const CELL = at('cancer', 'cellules');
	const MULTI = at('cancer', 'multiplient');
	const CONTROLE = at('cancer', 'contrôle');
	const CEST = at('cancer', "c'est");
	const FREQ = at('cancer', 'fréquent');
	const CINQ = at('cancer', 'cinquante');
	const PIEGE = at('cancer', 'piège');
	const DEBUT = at('cancer', 'début');
	const AUCUN = at('cancer', 'aucun');
	const cellsO = fadeIn(frame, 2, 8) * (1 - lin(frame, CEST - 8, CEST));
	const k = lin(frame, MULTI - 4, CONTROLE + 24);
	const numO = fadeIn(frame, CEST, 6) * (1 - lin(frame, PIEGE - 8, PIEGE));
	const pelO = fadeIn(frame, PIEGE - 2, 8);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={CEST - 8} text={'Le *cancer*'} size={110} y={150} center />
			{cellsO > 0 ? (
				<div style={{position: 'absolute', left: 90, top: 520, opacity: cellsO}}>
					<CellField k={k} width={900} />
				</div>
			) : null}
			<Note at={CELL} to={CEST - 10} y={1300} size={46} tone={LPI.paper}>
				des cellules…
			</Note>
			<Note at={MULTI} to={CEST - 10} y={1420} size={46} tone={LPI.pink}>
				qui se multiplient sans contrôle
			</Note>
			{numO > 0 ? (
				<AbsoluteFill style={{opacity: numO}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 380, color: LPI.blue, lineHeight: 1, transform: `scale(${popAt(frame, CEST)})`}}>
						1<span style={{fontSize: 160}}>er</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N, opacity: fadeIn(frame, FREQ - 2, 6)}}>
						cancer de l'homme
					</div>
					<div style={{position: 'absolute', left: 440, top: 960, transform: `scale(${popAt(frame, FREQ)})`}}>
						<RibbonIcon size={200} />
					</div>
					<Pill at={CINQ - 2} x={540} y={1300} tone={LPI.paper} size={50}>
						surtout après 50 ans
					</Pill>
				</AbsoluteFill>
			) : null}
			{pelO > 0 ? (
				<>
					<Big from={PIEGE} text={'Le *piège*'} size={110} y={150} center />
					<PelvisAt o={pelO} flow={1} tumor={lin(frame, DEBUT - 6, DEBUT + 10)} />
					<PointTag at={DEBUT + 4} x={260} y={1330} px={pp('tumor').x} py={pp('tumor').y} size={44} tone={LPI.pink}>
						une tumeur
					</PointTag>
					<Stamp at={AUCUN} x={600} y={1500} text="AUCUN SIGNE" size={66} />
				</>
			) : null}
			<Burst at={CEST} x={540} y={560} r={260} n={12} />
			<Sfx name="pop" at={CELL} volume={0.06} />
			<Sfx name="whoosh" at={MULTI} volume={0.06} />
			<Sfx name="impact" at={CEST} volume={0.12} />
			<Sfx name="pop" at={CINQ - 2} volume={0.07} />
			<Sfx name="whoosh" at={PIEGE - 2} volume={0.06} />
			<Sfx name="stamp" at={AUCUN} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES SIGNES (PLUS TARD) ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('signes', 'sang');
	const URINES = at('signes', 'urines');
	const DOUL = at('signes', 'douleurs');
	const OS = at('signes', 'os');
	const ETENDU = at('signes', 'étendu');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'Plus *tard*…'} size={110} y={150} center />
			<RowCard at={SANG - 4} y={380} h={220} art={160} title="Du sang" sub="dans les urines ou le sperme" subAt={URINES} size={56}>
				<Drop size={100} />
			</RowCard>
			<RowCard at={DOUL - 4} y={630} h={220} art={200} title="Des douleurs dans les os" sub="quand il s'est étendu" subAt={ETENDU - 4} size={52} from="left">
				<BonePain size={190} pain={fadeIn(frame, OS, 6)} />
			</RowCard>
			{frame >= ETENDU - 8 ? (
				<PelvisAt o={fadeIn(frame, ETENDU - 8, 8)} left={250} top={890} W={580} flow={1} tumor={1} spread={lin(frame, ETENDU - 4, ETENDU + 30)} />
			) : null}
			<Sfx name="pop" at={SANG - 4} volume={0.08} />
			<Sfx name="pop" at={DOUL - 4} volume={0.08} />
			<Sfx name="whoosh" at={ETENDU - 4} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES EXAMENS ═══════════════════════════════ */
export const Examens: React.FC = () => {
	const frame = useCurrentFrame();
	const TOUCHER = at('examens', 'toucher');
	const PALPE = at('examens', 'palpe');
	const DOIGT = at('examens', 'doigt');
	const PRISE = at('examens', 'prise');
	const DOSAGE = at('examens', 'dosage');
	const PSA = at('examens', 'psa');
	const PROTEINE = at('examens', 'protéine');
	const SUSPECT = at('examens', 'suspect');
	const IRM = at('examens', 'irm');
	const BIOPSIE = at('examens', 'biopsie');
	const PRELEV = at('examens', 'prélèvement');
	const CONFIRME = at('examens', 'confirme');
	const aO = fadeIn(frame, 0, 8) * (1 - lin(frame, PRISE - 8, PRISE));
	const bO = fadeIn(frame, PRISE - 2, 8) * (1 - lin(frame, SUSPECT - 6, SUSPECT + 2));
	const cO = fadeIn(frame, IRM - 4, 8) * (1 - lin(frame, BIOPSIE - 8, BIOPSIE));
	const dO = fadeIn(frame, BIOPSIE - 4, 8);
	return (
		<AbsoluteFill>
			<Bg />
			{/* 1. le toucher rectal */}
			{aO > 0 ? (
				<AbsoluteFill style={{opacity: aO}}>
					<Big from={TOUCHER - 4} to={PRISE - 10} text={'Le toucher *rectal*'} size={96} y={150} center />
					<PelvisAt flow={1} tumor={1} finger={lin(frame, TOUCHER, PALPE + 6)} glow={fadeIn(frame, PALPE + 4, 6)} />
					<PointTag at={DOIGT - 4} x={250} y={1380} px={pp('back').x - 30} py={pp('back').y + 120} size={44} tone={LPI.sky}>
						le doigt (ganté)
					</PointTag>
					<Note at={PALPE + 4} y={1500} size={44} tone={LPI.pink}>
						il sent l'arrière de la prostate
					</Note>
				</AbsoluteFill>
			) : null}
			{/* 2. la prise de sang : PSA */}
			{bO > 0 ? (
				<AbsoluteFill style={{opacity: bO}}>
					<Big from={PRISE - 2} to={DOSAGE - 4} text={'Une prise de *sang*'} size={96} y={150} center />
					<Big from={DOSAGE} to={SUSPECT - 6} text={'Le dosage du *PSA*'} size={96} y={150} center />
					<div style={{position: 'absolute', left: 540 - 90, top: 420, transform: `scale(${popAt(frame, PRISE - 2)}) rotate(-8deg)`}}>
						<BloodTube size={180} level={lin(frame, PRISE, DOSAGE + 10)} cap={LPI.blue} />
					</div>
					<Pill at={PSA - 2} x={540} y={1240} tone={LPI.sky} size={60}>
						PSA
					</Pill>
					<Note at={PROTEINE - 2} y={1380} size={44} tone={LPI.paper}>
						une protéine fabriquée par la prostate
					</Note>
				</AbsoluteFill>
			) : null}
			{/* 3. si c'est suspect : l'IRM */}
			<Big from={SUSPECT} to={BIOPSIE - 6} text={"Si c'est *suspect*…"} size={96} y={150} center />
			{cO > 0 ? (
				<div style={{position: 'absolute', left: 540 - 300, top: 470, opacity: cO, transform: `scale(${popAt(frame, IRM - 4)})`}}>
					<ScanMonitor label="IRM" scan={lin(frame, IRM, IRM + 50)} width={600} height={600}>
						<div style={{position: 'absolute', left: 60, top: 30}}>
							<Pelvis width={480} body={false} tumor={1} glow={fadeIn(frame, IRM + 20, 8)} />
						</div>
					</ScanMonitor>
				</div>
			) : null}
			{/* 4. la biopsie */}
			{dO > 0 ? (
				<AbsoluteFill style={{opacity: dO}}>
					<Big from={BIOPSIE} text={'La *biopsie*'} size={110} y={150} center />
					<PelvisAt flow={1} tumor={1} needle={lin(frame, BIOPSIE + 4, PRELEV + 6)} glow={fadeIn(frame, CONFIRME - 2, 6)} />
					<Note at={PRELEV - 2} y={1390} size={44} tone={LPI.paper}>
						un petit prélèvement
					</Note>
					<Stamp at={CONFIRME + 2} x={560} y={1530} text="CONFIRMÉ" size={66} />
				</AbsoluteFill>
			) : null}
			<Sfx name="whoosh" at={TOUCHER} volume={0.05} />
			<Sfx name="pop" at={PRISE - 2} volume={0.08} />
			<Sfx name="pop" at={PSA - 2} volume={0.08} />
			<Sfx name="whoosh" at={IRM - 4} volume={0.06} />
			<Sfx name="pop" at={PRELEV - 2} volume={0.06} />
			<Sfx name="stamp" at={CONFIRME + 2} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES RISQUES ═══════════════════════════════ */
export const Risques: React.FC = () => {
	const AGE = at('risques', "l'âge");
	const PERE = at('risques', 'père');
	const FRERE = at('risques', 'frère');
	const FAMILLE = at('risques', 'famille');
	const AFRIQUE = at('risques', "d'afrique");
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'Le risque *augmente*'} size={96} y={150} center />
			<RowCard at={AGE - 6} y={420} h={270} art={180} badge={1} title="Avec l'âge" sub="surtout après 50 ans" subAt={AGE + 10} size={60}>
				<AgeIcon size={160} />
			</RowCard>
			<RowCard at={PERE - 6} y={730} h={270} art={180} badge={2} title="Un père ou un frère touché" subAt={FRERE} size={56} from="left">
				<FamilyIcon size={160} />
			</RowCard>
			<RowCard at={FAMILLE - 6} y={1040} h={270} art={180} badge={3} title="Une famille venue d'Afrique" sub="ou des Antilles" subAt={AFRIQUE + 8} size={56}>
				<GlobeIcon size={160} />
			</RowCard>
			{[AGE - 6, PERE - 6, FAMILLE - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES TRAITEMENTS ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const PETIT = at('traitement', 'petit');
	const SURV = at('traitement', 'surveille');
	const SINON = at('traitement', 'sinon');
	const CHIR = at('traitement', 'chirurgie');
	const RADIO = at('traitement', 'radiothérapie');
	const HORM = at('traitement', 'hormonal');
	const PARFOIS = at('traitement', 'parfois');
	const FUITES = at('traitement', 'fuites');
	const TROUBLES = at('traitement', 'troubles');
	const fade = 1 - lin(frame, PARFOIS - 6, PARFOIS + 4);
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} to={SINON - 6} text={'Petit et *lent* ?'} size={110} y={150} center />
			<Big from={SINON} to={PARFOIS - 6} text={'Sinon…'} size={110} y={150} center />
			<Big from={PARFOIS} text={'Après, *parfois*…'} size={110} y={150} center />
			{fade > 0 ? (
				<AbsoluteFill style={{opacity: fade}}>
					<RowCard at={PETIT + 6} y={360} h={200} art={160} title="On le surveille" sub="sans traiter tout de suite" subAt={SURV + 14} size={50}>
						<WatchIcon size={140} />
					</RowCard>
					<RowCard at={CHIR - 6} y={590} h={200} art={160} title="La chirurgie" sub="on retire la prostate" subAt={CHIR + 12} size={50} from="left">
						<ScalpelIcon size={140} />
					</RowCard>
					<RowCard at={RADIO - 6} y={820} h={200} art={160} title="La radiothérapie" sub="des rayons sur la tumeur" subAt={RADIO + 16} size={50}>
						<RayIcon size={140} />
					</RowCard>
					<RowCard at={HORM - 8} y={1050} h={200} art={160} title="Un traitement hormonal" size={50} from="left">
						<PillIcon size={140} />
					</RowCard>
				</AbsoluteFill>
			) : null}
			{frame >= PARFOIS + 4 ? (
				<div style={{position: 'absolute', left: 540 - 70, top: 520, transform: `scale(${popAt(frame, PARFOIS + 4)})`}}>
					<Drop size={140} tone={LPI.sky} />
				</div>
			) : null}
			<Pill at={FUITES - 2} x={540} y={900} tone={LPI.sky} size={54}>
				des fuites urinaires
			</Pill>
			<Pill at={TROUBLES - 2} x={540} y={1040} tone={LPI.pink} size={54}>
				des troubles de l'érection
			</Pill>
			{[PETIT + 6, CHIR - 6, RADIO - 6, HORM - 8, FUITES - 2, TROUBLES - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : DÈS 50 ANS, ON EN PARLE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const CINQ = at('fin', 'cinquante');
	const PARLE = at('fin', 'parle');
	const MEDECIN = at('fin', 'médecin');
	const MEME = at('fin', 'même');
	const BIEN = at('fin', 'bien');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={MEME - 6} text={'Dès *50* *ans*…'} size={130} y={170} center />
			<Big from={MEME} text={'…même quand *tout* *va* *bien* !'} size={92} y={170} center />
			{frame >= CINQ - 4 ? (
				<div style={{position: 'absolute', left: 540 - 150, top: 480, transform: `scale(${popAt(frame, CINQ - 4)})`}}>
					<AgeIcon size={300} />
				</div>
			) : null}
			{frame >= PARLE - 2 ? (
				<div style={{position: 'absolute', left: 540 - 150, top: 840, transform: `scale(${popAt(frame, PARLE - 2)})`}}>
					<Stetho size={300} />
				</div>
			) : null}
			<Pill at={MEDECIN - 2} x={540} y={1250} tone={LPI.paper} size={54}>
				on en parle à son médecin
			</Pill>
			<Burst at={BIEN} x={540} y={700} r={300} n={12} />
			<Sfx name="pop" at={CINQ - 4} volume={0.08} />
			<Sfx name="pop" at={PARLE - 2} volume={0.08} />
			<Sfx name="ding" at={BIEN} volume={0.08} />
		</AbsoluteFill>
	);
};
