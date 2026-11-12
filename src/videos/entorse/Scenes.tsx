// Scènes de « Entorse de la cheville » (format court). Accroche sans texte, réaliste : footing au parc, le pied se tord
// sur une racine, gros plan sur la cheville qui gonfle. Puis l'idée reçue (« je bouge le pied, donc pas cassé » : vue
// radio, os fêlé), le bon geste en 4 mots (glace, repos, élévation, contention), quand il faut une radio, chute.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {ANKLE, AnkleSide, LegRest, RootG, StepsIcon, XrayIcon} from '../../brand/ankle';
import {Big, fadeIn, Flash, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {ForestBg} from '../../brand/forest';
import {Walker} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const SKIN = '#F0C2A0';
const SHIRT = '#2F6FD6';

/** Cheville en gros plan : `AnkleSide` (repère 1000) posée en (left, top) sur `W` pixels. */
const Ankle: React.FC<{left?: number; top?: number; W?: number} & React.ComponentProps<typeof AnkleSide>> = ({left = -60, top = 520, W = 1160, ...p}) => (
	<svg width={W} height={W} viewBox="0 0 1000 1000" style={{position: 'absolute', left, top, overflow: 'visible'}}>
		<AnkleSide {...p} />
	</svg>
);
const ap = (x: number, y: number, left = -60, top = 520, W = 1160) => ({x: left + (x * W) / 1000, y: top + (y * W) / 1000});

/** Fond du parc flouté (derrière les gros plans). */
const ParkBlur: React.FC = () => (
	<AbsoluteFill style={{filter: 'blur(14px)', transform: 'scale(1.4)'}}>
		<ForestBg ground={1500} branch={{x: 4000, y: 700}} drift={0.6} />
	</AbsoluteFill>
);

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Les 4 mots du bon geste : pastilles qui s'allument une à une (`lit` : images où chacune s'allume). */
const FourWords: React.FC<{lit: number[]; y?: number}> = ({lit, y = 300}) => {
	const frame = useCurrentFrame();
	const words = ['Glace', 'Repos', 'Élévation', 'Contention'];
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', gap: 14}}>
			{words.map((w, i) => {
				const on = frame >= lit[i];
				return (
					<div key={w} style={{padding: '12px 20px', borderRadius: 999, border: `5px solid ${N}`, background: on ? (i % 2 ? LPI.pink : LPI.sky) : alpha(LPI.paper, 0.85), boxShadow: on ? SHADOW : 'none', fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: on ? N : alpha(N, 0.35), transform: `scale(${on ? popAt(frame, lit[i]) : 0.92})`}}>
						{w}
					</div>
				);
			})}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE FOOTING, LA RACINE, LA CHEVILLE ═══════════════════════════════ */
const MAN = {W: 420, ground: 1500, x: 250};
const MAN_K = MAN.W / 300;
const MAN_TOP = MAN.ground - 590 * MAN_K;

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TORD = at('intro', 'tord');
	const AIE = at('intro', 'aïe !');
	const GONFLE = at('intro', 'gonfle');
	const OEIL = at('intro', "d'œil.");
	// il court (le décor défile), la racine arrive sous son pied au mot « tord »
	const run = Math.min(frame, TORD);
	const drift = interpolate(run, [0, TORD], [0, 1]);
	const footX = MAN.x + 190 * MAN_K;
	const rootX = interpolate(run, [0, TORD], [footX + 1400, footX + 30]);
	// au mot « tord » : on plonge sur la cheville
	const dive = lin(frame, TORD - 6, TORD + 4);
	const close = frame >= TORD + 2;
	const roll = interpolate(frame, [TORD + 2, TORD + 8, TORD + 30], [0, 1, 0.55], clamp);
	const shake = frame >= TORD + 2 && frame < TORD + 14 ? Math.sin((frame - TORD) * 2.2) * 14 * (1 - (frame - TORD) / 14) : 0;
	const swell = lin(frame, GONFLE - 4, OEIL + 16);
	return (
		<AbsoluteFill>
			{!close ? (
				<AbsoluteFill style={{transform: `scale(${1 + 3 * dive * dive})`, transformOrigin: `${footX}px ${MAN.ground - 20}px`}}>
					<ForestBg ground={MAN.ground} branch={{x: 4000, y: 700}} drift={drift} />
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<RootG x={rootX} y={MAN.ground + 20} s={0.5} />
					</svg>
					<div style={{position: 'absolute', left: MAN.x, top: MAN_TOP - Math.abs(Math.sin(run * 0.38)) * 16}}>
						<Walker width={MAN.W} pose="walk" phase={run * 0.38} hair="man" shirt={SHIRT} tee skin={SKIN} />
					</div>
				</AbsoluteFill>
			) : (
				<AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
					<ParkBlur />
					<Ankle shoe ground roll={roll} swell={swell} bruise={swell * 0.5}>
						<RootG x={760} y={ANKLE.ground + 4} s={1} />
					</Ankle>
				</AbsoluteFill>
			)}
			{frame >= AIE - 2 && frame < AIE + 26 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{[0, 1, 2, 3, 4].map((i) => {
						const a = -1.4 + i * 0.55;
						const c = ap(ANKLE.malleolus.x, ANKLE.malleolus.y);
						const k = (frame - AIE + 2) / 28;
						return <line key={i} x1={c.x + Math.cos(a) * (130 + k * 60)} y1={c.y + Math.sin(a) * (130 + k * 60)} x2={c.x + Math.cos(a) * (200 + k * 80)} y2={c.y + Math.sin(a) * (200 + k * 80)} stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" opacity={1 - k} />;
					})}
				</svg>
			) : null}
			<Flash at={TORD + 2} max={0.4} />
			<Sfx name="run" at={0} volume={0.06} />
			<Sfx name="skid" at={TORD} volume={0.12} />
			<Sfx name="fall" at={TORD + 2} volume={0.1} />
			<Sfx name="pop" at={GONFLE} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ IDÉE REÇUE : « JE BOUGE LE PIED, DONC PAS CASSÉ » ═══════════════════════════════ */
export const Idees: React.FC = () => {
	const frame = useCurrentFrame();
	const BOUGER = at('idees', 'bouger');
	const CASSE = at('idees', 'cassé ?');
	const FAUX = at('idees', 'faux !');
	const PEUT = at('idees', 'peut');
	const BOUGER2 = at('idees', 'bouger', 2);
	const FELE = at('idees', 'fêlé.');
	const wiggle = (a: number, b: number) => (frame >= a && frame < b ? Math.sin((frame - a) / 4) * 14 * Math.min(1, (frame - a) / 6) * Math.min(1, (b - frame) / 6) : 0);
	const flex = wiggle(BOUGER - 4, CASSE + 10) + wiggle(BOUGER2 - 4, FELE - 2);
	const xray = lin(frame, PEUT - 6, PEUT + 10);
	const crack = fadeIn(frame, FELE - 4, 8);
	const c = ap(510, 566);
	return (
		<AbsoluteFill>
			<ParkBlur />
			<Ankle ground swell={1} bruise={0.6} flex={flex} xray={xray} crack={crack} />
			<Big from={CASSE - 6} to={FAUX - 2} text={'Donc pas *cassé* ?'} size={100} y={170} center />
			<Stamp at={FAUX} x={540} y={250} text="FAUX !" size={92} />
			<PointTag at={FELE - 2} x={290} y={460} px={c.x} py={c.y} size={46} tone={LPI.pink}>
				os fêlé
			</PointTag>
			<Flash at={FAUX} max={0.3} />
			<Sfx name="stamp" at={FAUX} volume={0.12} />
			<Sfx name="whoosh" at={PEUT - 6} volume={0.06} />
			<Sfx name="pop" at={FELE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON GESTE (1) : LA GLACE, LE REPOS ═══════════════════════════════ */
export const Methode: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('methode', 'quatre');
	const GLACE = at('methode', 'glace :');
	const QUINZE = at('methode', 'quinze');
	const LINGE = at('methode', 'linge.');
	const REPOS = at('methode', 'repos :');
	const FORCES = at('methode', 'forces');
	const ice = lin(frame, GLACE - 4, GLACE + 12);
	const m = ap(560, 600);
	return (
		<AbsoluteFill>
			<ParkBlur />
			<AbsoluteFill style={{background: alpha(LPI.paper, 0.35)}} />
			<Ankle ground swell={1 - 0.2 * ice} bruise={0.6} ice={ice} />
			<Big from={QUATRE - 6} text={'*4* mots'} size={100} y={150} center />
			<FourWords lit={[GLACE - 2, REPOS - 2, 1e9, 1e9]} />
			{frame >= QUINZE - 4 ? (
				<div style={{position: 'absolute', left: 720, top: 520, transform: `scale(${popAt(frame, QUINZE - 4)})`, padding: '14px 26px', borderRadius: 30, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>
					15 – 20 min
				</div>
			) : null}
			<PointTag at={LINGE - 4} to={REPOS - 4} x={260} y={520} px={m.x} py={m.y - 60} size={44} tone={LPI.sky}>
				dans un linge
			</PointTag>
			{frame >= FORCES - 4 ? (
				<Note at={FORCES - 4} y={1480} size={46} tone={LPI.pink}>
					on ne force pas dessus
				</Note>
			) : null}
			<Sfx name="pop" at={GLACE - 2} volume={0.08} />
			<Sfx name="pop" at={REPOS - 2} volume={0.08} />
			<Sfx name="tick" at={QUINZE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON GESTE (2) : ÉLÉVATION, CONTENTION ═══════════════════════════════ */
export const Suite: React.FC = () => {
	const frame = useCurrentFrame();
	const PIED = at('suite', 'pied');
	const HANCHE = at('suite', 'hanche.');
	const CONTENTION = at('suite', 'contention :');
	const BANDE = at('suite', 'bande');
	const SANS = at('suite', 'sans');
	const SERRER = at('suite', 'serrer.');
	const e = lin(frame, 6, HANCHE + 6);
	const swap = lin(frame, CONTENTION - 10, CONTENTION + 4);
	const wrap = lin(frame, BANDE - 4, SERRER + 10);
	return (
		<AbsoluteFill>
			<Bg />
			<FourWords lit={[-1e9, -1e9, 0, CONTENTION - 2]} />
			{swap < 1 ? (
				<div style={{position: 'absolute', left: 40, top: 720, opacity: 1 - swap}}>
					<LegRest e={e} />
				</div>
			) : null}
			{swap > 0 ? (
				<AbsoluteFill style={{opacity: swap}}>
					<Ankle ground swell={0.7} bruise={0.6} wrap={wrap} top={560} />
				</AbsoluteFill>
			) : null}
			<Big from={0} to={CONTENTION - 6} text={'Le pied *en* *haut*'} size={100} y={150} center />
			<Big from={CONTENTION} text={'Une *bande*'} size={100} y={150} center />
			<PointTag at={PIED - 2} to={CONTENTION - 10} x={760} y={560} px={40 + 860} py={720 + 290} size={44} tone={LPI.pink}>
				plus haut que la hanche
			</PointTag>
			{frame >= SANS - 4 ? (
				<Note at={SANS - 4} y={1480} size={46} tone={LPI.sky}>
					sans trop serrer
				</Note>
			) : null}
			<Sfx name="whoosh" at={6} volume={0.05} />
			<Sfx name="pop" at={CONTENTION - 2} volume={0.08} />
			<Sfx name="ding" at={SERRER + 10} volume={0.08} />
		</AbsoluteFill>
	);
};

/** Petite cheville (pour une carte) : `press` (doigt sur l'os) ou `roll` (déformée). */
const MiniAnkle: React.FC<{press?: number; roll?: number}> = ({press = 0, roll = 0}) => (
	<svg width={150} height={150} viewBox="300 300 650 650">
		<AnkleSide swell={0.8} press={press} roll={roll} />
	</svg>
);

/* ═══════════════════════════════ QUAND FAIRE UNE RADIO ═══════════════════════════════ */
export const Consulter: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('consulter', 'quatre');
	const APPUIE = at('consulter', 'appuie');
	const DEFORMEE = at('consulter', 'déformée :');
	const RADIO = at('consulter', 'radio.');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={RADIO - 6} text={'Mais *si*…'} size={110} y={190} center />
			<Big from={RADIO - 2} text={'Il faut une *radio*'} size={100} y={190} center />
			<RowCard at={QUATRE - 4} y={420} h={190} art={170} badge="!" title="Impossible de faire 4 pas" size={46}>
				<StepsIcon size={130} />
			</RowCard>
			<RowCard at={APPUIE - 6} y={630} h={190} art={170} badge="!" title="Mal quand on appuie sur l'os" from="left" size={46}>
				<MiniAnkle press={fadeIn(frame, APPUIE, 8)} />
			</RowCard>
			<RowCard at={DEFORMEE - 4} y={840} h={190} art={170} badge="!" title="La cheville est déformée" size={46}>
				<MiniAnkle roll={0.8} />
			</RowCard>
			{frame >= RADIO - 4 ? (
				<div style={{position: 'absolute', left: 540 - 140, top: 1110, transform: `scale(${popAt(frame, RADIO - 4)})`}}>
					<XrayIcon size={280} />
				</div>
			) : null}
			{[QUATRE - 4, APPUIE - 6, DEFORMEE - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="stamp" at={RADIO} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : IL SAUTE LA RACINE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const REGARDE = at('fin', 'regarde');
	const PIEDS = at('fin', 'pieds !');
	const footX = MAN.x + 190 * MAN_K;
	const rootX = interpolate(frame, [0, REGARDE + 10, PIEDS + 30], [footX + 900, footX, footX - 600]);
	const jump = interpolate(frame, [REGARDE - 4, REGARDE + 8, REGARDE + 20], [0, 1, 0], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<AbsoluteFill>
			<ForestBg ground={MAN.ground} branch={{x: 4000, y: 700}} drift={0.3 + frame / 400} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<RootG x={rootX} y={MAN.ground + 20} s={0.5} />
			</svg>
			<div style={{position: 'absolute', left: MAN.x, top: MAN_TOP - Math.abs(Math.sin(frame * 0.38)) * 16 - jump * 170}}>
				<Walker width={MAN.W} pose="walk" phase={frame * 0.38} hair="man" shirt={SHIRT} tee skin={SKIN} />
			</div>
			<Big from={REGARDE - 4} text={'Regarde *où* tu *mets* les *pieds*\u00a0!'} size={84} y={180} center />
			<Burst at={REGARDE + 8} x={footX} y={MAN.ground - 40} r={200} n={10} />
			<Sfx name="hop" at={REGARDE - 2} volume={0.1} />
			<Sfx name="ding" at={PIEDS} volume={0.08} />
		</AbsoluteFill>
	);
};
