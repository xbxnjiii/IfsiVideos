// « Plaie aiguë ou chronique ? » — série courte « Les plaies » (≈ 37 s, voix Laura).
// Accroche « papi et son petit-fils » (choisie par le propriétaire ; SANS texte au début) : ils traversent le jardin,
// une branche d'épines du rosier dépasse au ras des tibias : le petit, puis papi, s'y griffent la jambe au mot (sursaut,
// éclats) ; les jours défilent jusqu'à J + 42 (tic-tac), la plaie du petit s'efface (✓), celle
// de papi reste et grandit (!, cercle rose). La v1 (« deux plaies, le même jour ») reste dans l'historique git. Puis la plaie aiguë (frise des semaines : le curseur avance, la plaie guérit avant 4 semaines ;
// exemples : coupure, cicatrice d'opération), la plaie chronique (le curseur ralentit, se bloque (cadenas), dépasse
// 4 à 6 semaines), les 3 grands exemples (ulcère de jambe, escarre, pied diabétique), chute : une plaie qui traîne
// n'est jamais normale, la loupe cherche pourquoi (circulation, appui, diabète, infection).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, popAt, Posed} from '../../brand/bold';
import {DayChip, Walker, WeeksBar, WoundTop} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Finger, LowerLeg, Squeeze} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/** Carte blanche, étiquette dessous. */
const Tile: React.FC<{label: string; w?: number; h?: number; hl?: number; children: React.ReactNode}> = ({label, w = 320, h = 420, hl = 0, children}) => (
	<div style={{width: w, height: h, borderRadius: 40, background: LPI.paper, border: `${6 + 4 * hl}px solid ${hl > 0.5 ? LPI.pink : N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, boxSizing: 'border-box', padding: 14}}>
		<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: N, textAlign: 'center', whiteSpace: 'pre-line'}}>{label}</div>
	</div>
);

/* ═══════════════════════════════ ACCROCHE : PAPI ET SON PETIT-FILS ═══════════════════════════════ */
const GROUND = 1360;
/** Un personnage (repère 300 × 600) affiché à w px, centré en x, pieds au sol. */
const person = (x: number, w: number) => {
	const s = w / 300;
	const top = GROUND - 590 * s;
	return {left: x - w / 2, top, s, wound: {x: x + 6 * s, y: top + 525 * s}, head: {x: x + 22 * s, y: top + 100 * s}};
};
/** Rosier au milieu du jardin, une branche d'épines de chaque côté au ras des tibias. */
const BUSH_X = 600;
const TIP_L = 400;
const TIP_R = 790;
const BRANCH_Y = GROUND - 120;
/** Papi arrive par la gauche (s'arrête juste avant la branche), le petit par la droite (dessiné retourné). */
const PAPI_W = 470;
const KID_W = 330;
const PAPI_END = TIP_L - 165;
const KID_END = TIP_R + 120;
const PAPI = person(PAPI_END, PAPI_W);
const KID = {...person(KID_END, KID_W), wound: {x: KID_END - 6 * (KID_W / 300), y: person(KID_END, KID_W).wound.y}, head: {x: KID_END - 22 * (KID_W / 300), y: person(KID_END, KID_W).head.y}};

/** Branche d'épines (repère écran) de la base (x0) à la pointe (tip), qui fouette quand on la heurte (`shake`). */
const ThornBranch: React.FC<{x0: number; tip: number; shake: number}> = ({x0, tip, shake}) => (
	<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
		<g transform={`rotate(${shake * 6 * Math.sign(tip - x0)} ${x0} ${BRANCH_Y + 20})`}>
			<path d={`M${x0} ${BRANCH_Y + 20} Q${(x0 + tip) / 2} ${BRANCH_Y - 30} ${tip} ${BRANCH_Y}`} fill="none" stroke={N} strokeWidth={20} strokeLinecap="round" />
			{Array.from({length: 6}, (_, i) => {
				const t = (i + 1) / 7;
				const x = x0 + (tip - x0) * t;
				const y = BRANCH_Y + 20 - 50 * t * (1 - t) * 2 - 20 * t;
				const d = i % 2 ? 1 : -1;
				return <path key={i} d={`M${x} ${y} l${10 * Math.sign(tip - x0)} ${d * 30}`} stroke={N} strokeWidth={8} strokeLinecap="round" />;
			})}
			<ellipse cx={x0 + (tip - x0) * 0.45} cy={BRANCH_Y - 22} rx={28} ry={15} fill={LPI.sky} stroke={N} strokeWidth={5} />
		</g>
	</svg>
);

/** Rosier (repère 260 × 300) : feuillage bleuté, roses roses, épines. */
const RoseBush: React.FC<{shake?: number}> = ({shake = 0}) => (
	<svg width={260} height={300} viewBox="0 0 260 300" style={{overflow: 'visible', display: 'block', transform: `rotate(${shake * 4}deg)`, transformOrigin: '130px 300px'}}>
		<path d="M130 300 V170 M130 220 L80 150 M130 200 L190 130" stroke={N} strokeWidth={10} strokeLinecap="round" />
		{[
			[70, 140, 58],
			[180, 120, 60],
			[125, 80, 66],
			[130, 170, 54],
		].map(([x, y, r], i) => (
			<circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? LPI.sky : alpha(LPI.blue, 0.75)} stroke={N} strokeWidth={6} />
		))}
		{[
			[78, 112],
			[176, 98],
			[132, 56],
			[150, 160],
		].map(([x, y], i) => (
			<g key={i} transform={`translate(${x} ${y})`}>
				<circle r={20} fill={LPI.pink} stroke={N} strokeWidth={5} />
				<path d="M-8 0 Q0 -10 8 0 Q0 8 -8 0" fill="none" stroke={N} strokeWidth={3} />
			</g>
		))}
	</svg>
);

/** Pastille ronde (✓ guéri, ! toujours là) qui saute au-dessus d'un personnage. */
const Badge: React.FC<{at: number; x: number; y: number; text: string; tone: string}> = ({at: t0, x, y, text, tone}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * (1 + 0.05 * Math.sin(frame / 4))})`}}>
			<div style={{width: 150, height: 150, borderRadius: 75, background: tone, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: N}}>{text}</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const BLESSENT = at('intro', 'blessent');
	const JAMBE = at('intro', 'jambe,');
	const SIX = at('intro', 'six');
	const TARD = at('intro', 'tard,');
	const GUERI = at('intro', 'guéri');
	const LONGTEMPS = at('intro', 'longtemps…');
	const TOUJOURS = at('intro', 'toujours');
	const KHIT = BLESSENT - 2; // le petit se griffe sur la branche de droite…
	const PHIT = JAMBE - 2; // … puis papi sur celle de gauche
	const day = Math.round(interpolate(frame, [SIX - 4, TARD + 12], [0, 42], clamp));
	/** Marche jusqu'à la branche (contact à `hit`), puis petit recul après la griffure. */
	const walk = (f: number, x0: number, contact: number, hit: number, back: number) =>
		f < hit ? x0 + ((contact - x0) * f) / hit : contact + back * Math.min(1, (f - hit) / 8);
	const papiX = (f: number) => walk(f, -120, PAPI_END + 30, PHIT, -30);
	const kidX = (f: number) => walk(f, 1180, KID_END - 30, KHIT, 30);
	/** Petit coup de zoom sur la branche à chaque griffure. */
	const punchK = Math.max(0, 1 - Math.abs(frame - KHIT - 2) / 12);
	const punchP = Math.max(0, 1 - Math.abs(frame - PHIT - 2) / 12);
	const punch = punchK + punchP;
	const zx = punchK > punchP ? TIP_R : TIP_L;
	const hop = (f: number, t0: number) => (f >= t0 && f < t0 + 10 ? -34 * Math.sin(((f - t0) / 10) * Math.PI) : 0);
	const shakeK = (f: number) => Math.sin(f * 1.6) * Math.max(0, 1 - Math.abs(f - KHIT) / 8);
	const shakeP = (f: number) => Math.sin(f * 1.6) * Math.max(0, 1 - Math.abs(f - PHIT) / 8);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[KHIT + 1, PHIT + 1, SIX + 1, GUERI + 1, TOUJOURS + 1]} shakes={[KHIT + 2, PHIT + 2, TOUJOURS + 2]} strength={0.035}>
				<AbsoluteFill style={{transform: `scale(${1 + 0.22 * punch})`, transformOrigin: `${zx}px ${BRANCH_Y}px`}}>
				{/* le jardin */}
				<div style={{position: 'absolute', left: -20, right: -20, top: GROUND, height: 600, background: alpha(LPI.sky, 0.55), borderTop: `8px solid ${N}`}} />
				{Array.from({length: 14}, (_, i) => (
					<div key={i} style={{position: 'absolute', left: 30 + i * 76, top: GROUND - 18, width: 8, height: 26, borderRadius: 4, background: LPI.blue, transform: `rotate(${(i % 3) * 12 - 12}deg)`}} />
				))}
				<div style={{position: 'absolute', left: BUSH_X - 130, top: GROUND - 300, transform: 'scale(1.1)', transformOrigin: '130px 300px'}}>
					<Live render={(f) => <RoseBush shake={shakeK(f) + shakeP(f)} />} />
				</div>
				{/* papi arrive par la gauche, le petit par la droite… et chacun se griffe le tibia sur une branche */}
				<Live
					render={(f) => {
						const x = papiX(f);
						return (
							<div style={{position: 'absolute', left: x - PAPI_W / 2, top: PAPI.top + hop(f, PHIT)}}>
								<Walker width={PAPI_W} pose="walk" phase={f < PHIT ? x / 60 : 0} hair="old" shirt={LPI.sky} cry={fadeIn(f, PHIT, 3) * (1 - fadeIn(f, PHIT + 26, 8))} legWound={popAt(f, PHIT) * (1 + 0.5 * fadeIn(f, SIX, 60))} />
							</div>
						);
					}}
				/>
				<Live
					render={(f) => {
						const x = kidX(f);
						return (
							<div style={{position: 'absolute', left: x - KID_W / 2, top: KID.top + hop(f, KHIT), transform: 'scaleX(-1)'}}>
								<Walker width={KID_W} pose="walk" phase={f < KHIT ? -x / 45 : 0} hair="kid" shirt={LPI.pink} cry={fadeIn(f, KHIT, 3) * (1 - fadeIn(f, KHIT + 26, 8))} legWound={popAt(f, KHIT) * (1 - interpolate(f, [SIX, GUERI], [0, 1], clamp))} />
							</div>
						);
					}}
				/>
				<Live render={(f) => <ThornBranch x0={BUSH_X - 20} tip={TIP_L} shake={shakeP(f)} />} />
				<Live render={(f) => <ThornBranch x0={BUSH_X + 20} tip={TIP_R} shake={shakeK(f)} />} />
				<Burst at={KHIT} x={TIP_R} y={BRANCH_Y} r={150} n={10} />
				<Burst at={PHIT} x={TIP_L} y={BRANCH_Y} r={170} n={12} />
				</AbsoluteFill>
				{/* les semaines passent */}
				<Fly at={SIX - 6} x={690} y={430} from="top">
					<DayChip text={`J + ${day}`} size={230} />
				</Fly>
				<Badge at={GUERI} x={KID.head.x + 60} y={KID.head.y - 120} text="✓" tone={LPI.sky} />
				<Badge at={TOUJOURS} x={PAPI.head.x + 150} y={PAPI.head.y - 120} text="!" tone={LPI.pink} />
				<Live
					render={(f) =>
						f >= LONGTEMPS ? (
							<div style={{position: 'absolute', left: PAPI.wound.x - 70, top: PAPI.wound.y - 70, width: 140, height: 140, borderRadius: 70, border: `9px solid ${LPI.pink}`, transform: `scale(${popAt(f, LONGTEMPS) * (1 + 0.06 * Math.sin(f / 4))})`}} />
						) : null
					}
				/>
			</Camera>
			<Flash at={KHIT} max={0.2} />
			<Flash at={PHIT} max={0.25} />
			<Flash at={TOUJOURS} max={0.25} />
			<Sfx name="stairs" at={0} volume={0.18} dur={PHIT + 8} />
			<Sfx name="skid" at={KHIT - 2} volume={0.2} dur={12} />
			<Sfx name="impact" at={KHIT} volume={0.08} />
			<Sfx name="skid" at={PHIT - 2} volume={0.22} dur={12} />
			<Sfx name="impact" at={PHIT} volume={0.1} />
			{Array.from({length: 9}, (_, i) => (
				<Sfx key={i} name="tick" at={SIX - 2 + i * 4} volume={0.07} />
			))}
			<Sfx name="ding" at={GUERI} volume={0.08} />
			<Sfx name="buzz" at={TOUJOURS} volume={0.06} dur={12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE AIGUË ═══════════════════════════════ */
export const Aigue: React.FC = () => {
	const AIGUE = at('aigue', 'aiguë');
	const GUERIT = at('aigue', 'guérit');
	const MOINS = at('aigue', 'moins');
	const QUATRE = at('aigue', 'quatre');
	const SEMAINES = at('aigue', 'semaines.');
	const COMME = at('aigue', 'comme');
	const COUPURE = at('aigue', 'coupure,');
	const CICAT = at('aigue', 'cicatrice');
	const OPERATION = at('aigue', 'opération.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[AIGUE + 1, GUERIT + 1, QUATRE + 1, COUPURE + 1, OPERATION + 1]} strength={0.03}>
				<Big from={-2} to={COMME - 6} text={'Plaie *aiguë*'} size={140} />
				<Big from={COMME - 4} text={'Par *exemple*…'} size={140} />
				<Fly at={-4} x={540} y={520} from="right">
					<Live render={(f) => <WeeksBar pos={interpolate(f, [GUERIT - 4, SEMAINES + 8], [0, 3.3], ease)} zone={[0, 4, alpha(LPI.blue, 0.45)]} />} />
				</Fly>
				<Fly at={-4} out={COMME - 6} x={540} y={930} from="bottom" to="bottom">
					<Live render={(f) => <WoundTop width={780} kind="clean" heal={interpolate(f, [MOINS - 10, SEMAINES + 10], [0, 1], ease)} />} />
				</Fly>
				<Note at={QUATRE} to={COMME - 6} y={1250} size={50}>
					guérie en moins de 4 semaines
				</Note>
				<Fly at={COUPURE - 6} x={290} y={1010} from="left">
					<Tile label="une coupure" w={460} h={440}>
						<Live render={(f) => <Finger width={380} cut={1} heal={interpolate(f, [COUPURE + 6, CICAT], [0, 0.8], ease)} />} />
					</Tile>
				</Fly>
				<Fly at={CICAT - 6} x={790} y={1010} from="right">
					<Tile label="après une opération" w={460} h={440}>
						<WoundTop width={380} kind="clean" open={0.35} sutures={1} />
					</Tile>
				</Fly>
			</Camera>
			<Sfx name="pop" at={GUERIT - 4} volume={0.07} />
			<Sfx name="ding" at={SEMAINES + 6} volume={0.08} />
			<Sfx name="whoosh" at={COUPURE - 6} volume={0.07} />
			<Sfx name="whoosh" at={CICAT - 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE CHRONIQUE ═══════════════════════════════ */
export const Chronique: React.FC = () => {
	const CHRONIQUE = at('chronique', 'chronique');
	const CICAT = at('chronique', 'cicatrisation');
	const RALENTIE = at('chronique', 'ralentie,');
	const BLOQUEE = at('chronique', 'bloquée,');
	const SOUVENT = at('chronique', 'souvent');
	const AUDELA = at('chronique', 'au-delà');
	const QUATRE = at('chronique', 'quatre');
	const SIX = at('chronique', 'six');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.55)}} />
			<Camera punches={[CHRONIQUE + 1, RALENTIE + 1, BLOQUEE + 1, QUATRE + 1, SIX + 1]} shakes={[BLOQUEE + 2]} strength={0.03}>
				<Big from={-2} to={RALENTIE - 6} text={'Plaie\n*chronique*'} size={132} />
				<Big from={RALENTIE - 4} to={SOUVENT - 6} text={'Ralentie…\nou *bloquée*'} size={132} />
				<Big from={SOUVENT - 4} text={'Au-delà de\n*4* à *6* semaines'} size={116} />
				<Fly at={-4} x={540} y={600} from="left">
					<Live
						render={(f) => (
							<WeeksBar
								pos={interpolate(f, [CICAT - 4, RALENTIE - 4, RALENTIE + 16, BLOQUEE, AUDELA, SIX + 12], [0, 2.4, 3.1, 3.4, 3.4, 7], ease)}
								zone={[4, 8, alpha(LPI.pink, 0.8)]}
								lock={fadeIn(f, BLOQUEE - 2, 6) * (1 - fadeIn(f, AUDELA, 6))}
							/>
						)}
					/>
				</Fly>
				<Fly at={-4} x={540} y={1010} from="bottom">
					<Live render={(f) => <WoundTop width={780} kind="ragged" bruise={0.5} necrosis={0.3 + 0.4 * fadeIn(f, SOUVENT, 30)} />} />
				</Fly>
				<Stamp at={BLOQUEE} x={540} y={1320} text="BLOQUÉE" size={90} rot={-6} out={SOUVENT - 6} />
				<Note at={SIX + 6} y={1320} size={48}>
					elle traîne, encore et encore
				</Note>
			</Camera>
			<Sfx name="pop" at={CICAT - 4} volume={0.07} />
			<Sfx name="buzz" at={BLOQUEE} volume={0.06} dur={12} />
			<Sfx name="stamp" at={BLOQUEE} volume={0.1} />
			<Sfx name="tick" at={QUATRE} volume={0.08} />
			<Sfx name="tick" at={SIX} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES 3 GRANDS EXEMPLES ═══════════════════════════════ */
export const Exemples: React.FC = () => {
	const EXEMPLES = at('exemples', 'exemples');
	const ULCERE = at('exemples', "l'ulcère");
	const ESCARRE = at('exemples', "l'escarre…");
	const PIED = at('exemples', 'pied');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[EXEMPLES + 1, ULCERE + 1, ESCARRE + 1, PIED + 1]} strength={0.035}>
				<Big from={-2} text={'*3* grands\nexemples'} size={132} />
				<Fly at={ULCERE - 4} x={200} y={880} from="bottom">
					<Tile label={'ulcère\nde jambe'} w={320} h={480}>
						<LowerLeg width={200} ulcer={1} veins={1} />
					</Tile>
				</Fly>
				<Fly at={ESCARRE - 4} x={540} y={880} from="bottom">
					<Tile label="escarre" w={320} h={480}>
						<Live render={(f) => <Squeeze width={280} press={1} dead={fadeIn(f, ESCARRE, 12)} />} />
					</Tile>
				</Fly>
				<Fly at={PIED - 4} x={880} y={880} from="bottom">
					<Tile label={'pied\ndiabétique'} w={320} h={480}>
						<LowerLeg width={200} footSore={1} grow={0.6} silent={0.6} />
					</Tile>
				</Fly>
			</Camera>
			<Sfx name="pop" at={ULCERE - 4} volume={0.08} />
			<Sfx name="pop" at={ESCARRE - 4} volume={0.08} />
			<Sfx name="pop" at={PIED - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CHERCHE POURQUOI ═══════════════════════════════ */
const WHY = ['circulation ?', 'appui ?', 'diabète ?', 'infection ?'];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const TRAINE = at('fin', 'traîne,');
	const NORMAL = at('fin', 'normal');
	const CHERCHE = at('fin', 'cherche');
	const POURQUOI = at('fin', 'pourquoi');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[TRAINE + 1, NORMAL + 1, CHERCHE + 1, POURQUOI + 1]} shakes={[NORMAL + 2]} strength={0.035}>
				<Big from={-2} to={CHERCHE - 6} text={'Une plaie\nqui *traîne*…'} size={128} {...ON_BLUE} />
				<Big from={CHERCHE - 4} text={'On cherche\n*pourquoi* !'} size={128} {...ON_BLUE} />
				<Fly at={-4} x={540} y={900} from="bottom">
					<WoundTop width={760} kind="ragged" bruise={0.5} necrosis={0.6} />
				</Fly>
				<Stamp at={NORMAL} x={540} y={1240} text="PAS NORMAL !" size={86} rot={-6} out={CHERCHE - 4} />
				{/* la loupe cherche la cause */}
				<Blur on={frame >= CHERCHE - 4 && frame <= POURQUOI + 40}>
					<Posed
						pose={(f) => {
							if (f < CHERCHE - 4) return null;
							const t = (f - (CHERCHE - 4)) / 14;
							return {x: 540 + 220 * Math.cos(t), y: 900 + 90 * Math.sin(t * 1.3), s: popAt(f, CHERCHE - 4)};
						}}
					>
						<svg width={300} height={300} viewBox="-150 -150 300 300" style={{overflow: 'visible'}}>
							<circle r={90} fill={alpha(LPI.paper, 0.3)} stroke={N} strokeWidth={16} />
							<circle r={74} fill="none" stroke={LPI.sky} strokeWidth={6} />
							<path d="M64 64 L130 130" stroke={N} strokeWidth={30} strokeLinecap="round" />
							<path d="M70 70 L126 126" stroke={LPI.pink} strokeWidth={14} strokeLinecap="round" />
						</svg>
					</Posed>
				</Blur>
				{WHY.map((w, i) => {
					const t0 = CHERCHE + 4 + i * 7;
					const pos = [
						[230, 1250],
						[760, 1250],
						[250, 1370],
						[770, 1370],
					][i];
					return frame >= t0 ? (
						<div key={w} style={{position: 'absolute', left: pos[0], top: pos[1], transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, padding: '10px 26px', borderRadius: 999, background: i % 2 ? LPI.pink : LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>
							{w}
						</div>
					) : null;
				})}
			</Camera>
			<Flash at={NORMAL} max={0.25} color={LPI.paper} />
			<Sfx name="stamp" at={NORMAL} volume={0.12} />
			<Sfx name="whoosh" at={CHERCHE - 4} volume={0.07} />
			{WHY.map((w, i) => (
				<Sfx key={w} name="pop" at={CHERCHE + 4 + i * 7} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};
