// « L'ordre des tubes » (n° 66, série « les tubes », directives Instagram) : refaite à la demande avec les tableaux du
// propriétaire (ordre de remplissage selon l'aiguille ; retournements). On ne dit pas à quoi sert chaque tube (demandé :
// « dis juste l'ordre », chaque tube a sa vidéo). Image 0 :
// pastille de série, titre, compteur 0/5, les 5 tubes mélangés ; le violet passe avant le jaune → le jaune est faussé ;
// les tubes se rangent. Puis l'ordre, une carte par tube (numéro + nom) et la frise qui se remplit (n/5) ; sans
// hémocultures : aiguille simple → bleu, ailettes → purge puis bleu ; les retournements ; « suis le protocole ».
// Sources : CLSI GP41 (7e éd., 2017) pour l'ordre et la purge ; tableau « bouchon / additif / analyses / retournements »
// fourni par le propriétaire (nombre de retournements selon le fabricant : à vérifier avec la notice de l'établissement).
// Le rouge (sec) et le vert (hépariné) ont été retirés à la demande : 5 tubes (hémocultures, bleu, jaune, violet, gris).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, FlatBg, Fly, Live, Note, popAt} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Butterfly, VacuNeedle} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, HEMO_CAP, HemoFlask, OrderRail, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const CAPS = [HEMO_CAP.aero, CAP.citrate, CAP.gel, CAP.sec, CAP.hepar, CAP.edta, CAP.fluor];
/** Les cases de `ORDER` gardées dans cette vidéo (sans le rouge ni le vert). */
const KEEP = [0, 1, 2, 5, 6];

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

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 40}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		{KEEP.map((k) => CAPS[k]).map((c) => (
			<div key={c} style={{width: 16, height: 22, borderRadius: 5, background: c, border: `3px solid ${N}`}} />
		))}
		<span style={{marginLeft: 8}}>LES TUBES · L'ORDRE</span>
	</div>
);

/** Compteur « n / 5 » en haut à droite. */
const Counter: React.FC<{n: number | string; done?: boolean}> = ({n, done}) => (
	<div style={{position: 'absolute', left: 880, top: 250, transform: 'translate(-50%, -50%)', padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
		{n} / 5
	</div>
);

/** Un tube (ou le flacon d'hémoculture) de l'ordre `k`, à la taille `size`. */
const Art: React.FC<{k: number; size?: number; taint?: number; bad?: number}> = ({k, size = 80, taint = 0, bad = 0}) =>
	k === 0 ? <HemoFlask size={size * 0.95} label="" cap={HEMO_CAP.aero} /> : <Tube size={size} cap={CAPS[k]} gel={k === 2} taint={taint} bad={bad} />;

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
/** Positions dans `KEEP`, mélangées (le violet juste avant le jaune). */
const SHUFFLE = [4, 3, 2, 0, 1];

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TROMPES = at('intro', 'trompes');
	const ADD = at('intro', "l'additif");
	const FAUSS = at('intro', 'fausser');
	const CONN = at('intro', 'connais');
	const sortK = interpolate(frame, [CONN - 2, CONN + 18], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<SeriesPill />
			<Camera punches={[TROMPES + 1, FAUSS + 1, CONN + 1]} shakes={[FAUSS + 3]} strength={0.03}>
				<Big from={-12} text={"L'ordre\ndes *tubes*"} size={130} y={190} />
				<Counter n={frame >= CONN + 18 ? '?' : 0} />
				{/* les 5 tubes : mélangés, qui s'échangent, puis rangés */}
				{SHUFFLE.map((j, slot) => (
					<Live
						key={j}
						render={(f) => {
							const swap = Math.floor(f / 26) % 2 === 1 && f < TROMPES ? (slot % 2 ? -1 : 1) : 0;
							const mixSlot = slot + swap * interpolate(f % 26, [0, 10], [0, 1], clamp);
							const k = KEEP[j];
							const xs = 540 + (mixSlot - 2) * 170;
							const xo = 540 + (j - 2) * 170;
							const x = xs + (xo - xs) * sortK;
							const bob = Math.sin(f / 7 + j) * 10 * (1 - sortK);
							const violetBeforeYellow = k === 2 && f >= FAUSS - 2 && f < CONN;
							return (
								<div style={{position: 'absolute', left: x, top: 900 + bob, transform: 'translate(-50%, -50%)'}}>
									<Art k={k} size={100} taint={violetBeforeYellow ? interpolate(f, [FAUSS - 2, FAUSS + 8], [0, 1], clamp) : 0} bad={violetBeforeYellow ? popAt(f, FAUSS + 4) : 0} />
									{sortK > 0.5 ? (
										<div style={{position: 'absolute', left: '50%', top: -70, transform: `translateX(-50%) scale(${popAt(f, CONN + 12 + j * 2)})`, width: 54, height: 54, borderRadius: 27, background: LPI.pink, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>{j + 1}</div>
									) : null}
								</div>
							);
						}}
					/>
				))}
				<Note at={TROMPES} to={CONN - 4} y={1220} size={40} tone={LPI.pink}>
					si tu te trompes…
				</Note>
				<Chip at={ADD} to={CONN - 4} x={540} y={1340} size={38}>
					l'additif d'un tube fausse le suivant
				</Chip>
				<Stamp at={FAUSS + 4} out={CONN - 4} x={760} y={1150} text="FAUSSÉ !" size={70} />
			</Camera>
			<Sfx name="whoosh" at={6} volume={0.15} />
			<Sfx name="buzz" at={FAUSS + 4} volume={0.25} />
			<Sfx name="stamp" at={FAUSS + 4} volume={0.35} />
			<Sfx name="whoosh" at={CONN} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ORDRE, TUBE PAR TUBE ═══════════════════════════════ */
const CARDS = [
	{num: 'un', name: 'Hémocultures'},
	{num: 'deux', name: 'Bleu'},
	{num: 'trois', name: 'Jaune'},
	{num: 'quatre', name: 'Violet'},
	{num: 'cinq', name: 'Gris'},
];

export const Ordre: React.FC = () => {
	const frame = useCurrentFrame();
	const T = CARDS.map((c) => at('ordre', c.num));
	const cur = T.reduce((acc, t, i) => (frame >= t - 4 ? i : acc), -1);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Camera punches={T.map((t) => t + 1)} strength={0.025}>
				<Big from={-2} text={"*L'ordre*"} size={130} y={190} />
				<Counter n={cur + 1} done={cur === 4} />
				{CARDS.map((c, i) => {
					const t0 = T[i] - 4;
					const out = i < 4 ? T[i + 1] - 6 : 1e9;
					return (
						<Fly key={c.name} at={t0} out={out} x={540} y={760} from="right" to="left">
							<div style={{width: 860, height: 520, boxSizing: 'border-box', borderRadius: 48, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px'}}>
								<div style={{width: 230, display: 'flex', justifyContent: 'center'}}>
									{i === 0 ? (
										<div style={{display: 'flex', gap: 10, alignItems: 'flex-end'}}>
											<HemoFlask size={100} label="" cap={HEMO_CAP.aero} />
											<HemoFlask size={100} label="" cap={HEMO_CAP.anaero} />
										</div>
									) : (
										<Tube size={150} cap={CAPS[KEEP[i]]} gel={i === 2} level={0.74} serum={i === 2 ? 1 : 0} />
									)}
								</div>
								<div style={{flex: 1}}>
									<div style={{width: 84, height: 84, borderRadius: 42, background: LPI.pink, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>{i + 1}</div>
									<div style={{marginTop: 14, fontFamily: FONT.title, fontWeight: 900, fontSize: i === 0 ? 70 : 110, color: N, lineHeight: 1}}>{c.name}</div>
								</div>
							</div>
						</Fly>
					);
				})}
				<OrderRail y={1330} at={0} only={KEEP} fill={T.map((t) => t)} cur={cur} check={T.map((t, i) => (i < 4 ? T[i + 1] : T[4] + 24))} scale={1.15} />
			</Camera>
			{T.map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.15} />
			))}
			<Sfx name="ding" at={T[4] + 24} volume={0.25} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SANS HÉMOCULTURES : L'AIGUILLE ═══════════════════════════════ */
const Lane: React.FC<{at: number; y: number; icon: React.ReactNode; label: string; tubes: number[]; purge?: boolean}> = ({at: t0, y, icon, label, tubes, purge}) => (
	<Pop at={t0} x={540} y={y}>
		<div style={{width: 900, height: 290, boxSizing: 'border-box', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px'}}>
			<div style={{width: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
				{icon}
				<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, color: N, textAlign: 'center'}}>{label}</div>
			</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>→</div>
			<div style={{display: 'flex', gap: 22, alignItems: 'flex-end'}}>
				{purge ? (
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Tube size={54} cap={CAP.purge} />
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, color: N}}>purge</div>
					</div>
				) : null}
				{tubes.map((k) => (
					<div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Tube size={54} cap={CAPS[k]} gel={k === 2} />
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, color: N}}>{k === 1 ? 'bleu' : k === 2 ? 'jaune' : '…'}</div>
					</div>
				))}
			</div>
		</div>
	</Pop>
);

export const Aiguille: React.FC = () => {
	const SANS = at('aiguille', 'sans');
	const SIMPLE = at('aiguille', 'simple');
	const AIL = at('aiguille', 'ailettes');
	const PURGE = at('aiguille', 'purge');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Camera punches={[SANS + 1, SIMPLE + 1, AIL + 1, PURGE + 1]} strength={0.03}>
				<Big from={-2} text={'Sans\n*hémocultures* ?'} size={110} y={190} />
				<Lane at={SIMPLE - 4} y={620} icon={<VacuNeedle size={250} />} label="aiguille simple" tubes={[1, 2]} />
				<Lane at={AIL - 4} y={970} icon={<Butterfly size={250} />} label="aiguille à ailettes" tubes={[1, 2]} purge />
				<Note at={PURGE} y={1220} size={36} tone={LPI.pink}>
					le tube de purge : jeté, jamais analysé
				</Note>
			</Camera>
			<Sfx name="pop" at={SIMPLE} volume={0.15} />
			<Sfx name="pop" at={AIL} volume={0.15} />
			<Sfx name="ding" at={PURGE} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RETOURNER LES TUBES ═══════════════════════════════ */
const FlipRow: React.FC<{at: number; y: number; tubes: number[]; times: string}> = ({at: t0, y, tubes, times}) => (
	<Pop at={t0} x={540} y={y}>
		<div style={{width: 800, height: 150, boxSizing: 'border-box', borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 18, padding: '0 30px'}}>
			<div style={{display: 'flex', gap: 10, width: 260}}>
				{tubes.map((k) => (
					<Tube key={k} size={30} cap={CAPS[k]} gel={k === 2} />
				))}
			</div>
			<div style={{flex: 1, textAlign: 'right', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N}}>{times}</div>
		</div>
	</Pop>
);

export const Retourner: React.FC = () => {
	const frame = useCurrentFrame();
	const RET = at('retourner', 'retourne');
	const SEC = at('retourner', 'secouer');
	const TROIS = at('retourner', 'trois');
	const CINQ = at('retourner', 'cinq');
	const HUIT = at('retourner', 'huit');
	const GRIS = at('retourner', 'gris');
	const flip = Math.max(0, frame - RET);
	const angle = 180 * (0.5 - 0.5 * Math.cos((flip / 18) * Math.PI));
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Camera punches={[RET + 1, TROIS + 1, CINQ + 1, HUIT + 1]} strength={0.03}>
				<Big from={-2} text={'On *retourne*'} size={120} y={190} />
				<Pop at={RET - 4} x={540} y={540}>
					<div style={{transform: `rotate(${frame >= RET ? angle : 0}deg)`}}>
						<Tube size={80} cap={CAP.citrate} level={0.74} />
					</div>
				</Pop>
				<Chip at={RET + 4} to={TROIS - 6} x={540} y={820} tone={LPI.sky} size={40}>
					doucement, de haut en bas
				</Chip>
				<Chip at={SEC - 2} to={TROIS - 6} x={540} y={940} tone={LPI.pink} size={40}>
					sans secouer ✕
				</Chip>
				<FlipRow at={TROIS - 2} y={830} tubes={[1]} times="3 – 4 ×" />
				<FlipRow at={CINQ - 2} y={1000} tubes={[2]} times="5 ×" />
				<FlipRow at={HUIT - 2} y={1170} tubes={[5, 6]} times="8 – 10 ×" />
				<Note at={GRIS + 6} y={1330} x={540} size={32}>
					hémocultures : selon la notice
				</Note>
			</Camera>
			<Sfx name="whoosh" at={RET} volume={0.15} />
			<Sfx name="pop" at={TROIS} volume={0.15} />
			<Sfx name="pop" at={CINQ} volume={0.15} />
			<Sfx name="pop" at={HUIT} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const COUL = at('fin', 'couleurs');
	const PROT = at('fin', 'protocole');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Camera punches={[COUL + 1, PROT + 1]} strength={0.03}>
				<Big from={-2} text={"L'ordre\ndes *tubes*"} size={120} y={190} />
				<Counter n={5} done />
				<OrderRail y={760} at={-2} only={KEEP} fill={[0, 2, 4, 6, 8]} check={[16, 18, 20, 22, 24]} labels={[4, 6, 8, 10, 12]} scale={1.3} />
				<Note at={COUL - 2} y={1100} size={36} tone={LPI.pink}>
					les couleurs peuvent changer selon les marques
				</Note>
				<Chip at={PROT - 2} x={540} y={1240} tone={LPI.blue} size={42}>
					suis le protocole de ton établissement
				</Chip>
			</Camera>
			<Confetti at={PROT + 6} />
			<Sfx name="pop" at={COUL} volume={0.15} />
			<Sfx name="ding" at={PROT} volume={0.2} />
		</AbsoluteFill>
	);
};
