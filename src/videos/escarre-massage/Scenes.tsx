// « Escarre : tu masses ? » (n° 105, série « Les plaies » en fenêtre pixel 8-bit, 1/10, pilote du format).
// Accroche (image 0 = tout est déjà en place) : la rougeur au sacrum, la loupe montre la peau intacte mais la lésion
// qui commence près de l'os. Info clé avant 10 s : « on ne masse jamais : on supprime l'appui ». Puis 1 · ça part de
// l'os (le poids écrase les tissus entre l'os et le matelas, le sang ne passe plus), 2 · masser écrase encore plus
// (massages, frictions, glaçons, air chaud : à proscrire), 3 · on soulage (changer de position, matelas adapté, le
// sang revient). Fin : « le test du doigt » (prochaine vidéo), puis la dernière image rejoint la première (boucle).
// Sources : conférence de consensus « Prévention et traitement des escarres de l'adulte et du sujet âgé » (ANAES / HAS,
// 15-16 novembre 2001) : massages et frictions de la zone à risque à proscrire, glaçons et air chaud interdits,
// changements de position et supports adaptés ; NPIAP 2016 / EPUAP-NPIAP-PPPIA 2019 : la lésion des tissus profonds
// naît de la pression et du cisaillement à l'interface os-muscle. Aucun chiffre non sourcé à l'écran.
import React from 'react';
import {AbsoluteFill, Freeze, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, Note} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {flowPhase, PixelScreen, Px, PX, pxBubble, pxCross, pxGauge, typedAt} from '../../brand/pixel';
import {LOUPE, pxPatientBed, pxSacrumLoupe, SACRUM_DEFAULT, SacrumState} from '../../brand/pixelplaies';
import {Counter, NextCard, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {FONT, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const TOTAL = 3;

/** 0 → 1 entre a et b (images quantifiées à 12 i/s). */
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(a + 1, b)], [0, 1], clamp);

/** Pastille de série en haut à gauche, visible dès l'image 0. */
const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 60, top: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 24px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 20, height: 20, background: LPI.pink, border: `3px solid ${N}`, imageRendering: 'pixelated'}} />
		LES PLAIES · 1/10
	</div>
);

/** Cadre commun : fond, pastille, compteur, titre (style habituel du compte). */
const Frame: React.FC<{title: string; counter: [number, number][]; done?: boolean; tone?: string; from?: number; children: React.ReactNode}> = ({title, counter, done, tone, from = -12, children}) => (
	<AbsoluteFill>
		<ShortBg tone={tone} />
		<SeriesPill />
		<Counter steps={counter} total={TOTAL} done={done} />
		<Big from={from} text={title} size={92} y={128} />
		{children}
	</AbsoluteFill>
);

/** HUD de droite : les trois jauges (appui, sang, oxygène). */
const hud = (g: Px, appui: number, sang: number, o2: number, f: number) => {
	pxGauge(g, 'APPUI', 100, 70, 54, appui, 'high', f, true);
	pxGauge(g, 'SANG', 100, 94, 54, sang, 'low', f, true);
	pxGauge(g, 'O2', 100, 118, 40, o2, 'low', f, true);
};

/** Scène complète : patient + loupe + jauges + bulle. */
const drawSacrum = (g: Px, s: SacrumState, gauges: [number, number, number], bubble: [string, string, number]) => {
	const p = pxPatientBed(g, s);
	pxSacrumLoupe(g, s, p);
	hud(g, ...gauges, s.f);
	pxBubble(g, ...bubble);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const OS = at('intro', "l'os");
	const ESC = at('intro', 'escarre');
	const MASSES = at('intro', 'masses');
	const INTACTE = at('intro', 'intacte');
	return (
		<Frame title={'Escarre :\ntu *masses* ?'} counter={[[0, 0]]} from={-40}>
			<PixelScreen
				draw={(g, f) => {
					const hand = f >= MASSES ? Math.round(Math.sin((f - MASSES) / 2.5) * 6) : null;
					drawSacrum(g, {...SACRUM_DEFAULT, f, pulse: f >= OS, phase: flowPhase(() => 0.2, f), hand, comp: hand === null ? 1 : 0.85, lift: hand === null ? 0 : 1}, [hand === null ? 0.85 : 0.75, 0.2, 0.3], ['ROUGEUR AU SACRUM', 'TU MASSES ?', Infinity]);
				}}
			/>
			<Note at={INTACTE - 2} to={OS - 4} y={1408} size={44}>
				la peau a l'air intacte…
			</Note>
			<Note at={OS - 2} y={1408} size={44} tone={LPI.pink}>
				…mais ça commence près de l'os
			</Note>
			<Sfx name="blip" at={INTACTE} />
			<Sfx name="blip-down" at={OS} />
			<Sfx name="blip" at={ESC} />
			<Sfx name="blip" at={MASSES} />
		</Frame>
	);
};

/** Dernière image = première image (la vidéo boucle). */
export const Loop: React.FC = () => (
	<Freeze frame={0}>
		<Hook />
	</Freeze>
);

/* ═══════════════════════════════ LA RÈGLE (avant 10 s) ═══════════════════════════════ */
export const Regle: React.FC = () => {
	const PAS = at('regle', 'pas');
	const SUPP = at('regle', 'supprime');
	const APPUI = at('regle', "l'appui");
	const L1 = 'SURTOUT PAS !';
	const L2 = "SUPPRIME L'APPUI";
	return (
		<Frame title={'Surtout *pas* !'} counter={[[0, 0]]} tone={LPI.sky}>
			<PixelScreen
				draw={(g, f) => {
					const off = ramp(f, SUPP, SUPP + 20);
					const hand = f < SUPP ? Math.round(Math.sin(f / 2.5) * 6) : null;
					drawSacrum(
						g,
						{...SACRUM_DEFAULT, f, hand, lift: 1, comp: hand !== null ? 0.85 : 1 - off, sang: 0.2 + 0.6 * off, phase: flowPhase((k) => 0.2 + 0.6 * ramp(k, SUPP, SUPP + 20), f), arrows: hand !== null ? 1 : 1 - off, blink: false},
						[hand !== null ? 0.75 : 0.85 * (1 - off), 0.2 + 0.6 * off, 0.3 + 0.5 * off],
						[L1, L2, f < SUPP ? Math.min(L1.length, typedAt(f, 0)) : L1.length + typedAt(f, SUPP)],
					);
					if (f >= PAS && f < SUPP) pxCross(g, LOUPE.cx - 26, LOUPE.cy - 26, LOUPE.cx + 26, LOUPE.cy + 26, ramp(f, PAS, PAS + 6));
				}}
			/>
			<Stamp at={PAS} x={760} y={1250} text="SURTOUT PAS !" size={62} out={SUPP - 4} />
			<Note at={SUPP - 2} y={1408} size={46} tone={LPI.blue}>
				on supprime l'appui
			</Note>
			<Sfx name="stamp" at={PAS} volume={0.4} />
			<Sfx name="blip-down" at={PAS + 2} />
			<Sfx name="blip-up" at={APPUI} />
		</Frame>
	);
};

/* ═══════════════════════════════ 1 · ÇA PART DE L'OS ═══════════════════════════════ */
export const Pression: React.FC = () => {
	const SOUS = at('pression', 'sous');
	const DOS = at('pression', 'dos');
	const POIDS = at('pression', 'poids');
	const ECRASE = at('pression', 'ecrase');
	const SANG = at('pression', 'sang');
	const PLUS = at('pression', 'plus');
	const OXY = at('pression', "d'oxygene");
	const PRES = at('pression', 'pres');
	const PREMIER = at('pression', 'premier');
	const PEAU2 = at('pression', 'peau', 2);
	const DERNIER = at('pression', 'dernier');
	const L1 = 'SOUS LA PEAU...';
	const L2 = "ÇA PART DE L'OS";
	const sangAt = (f: number) => 1 - 0.8 * ramp(f, SANG, PLUS + 8);
	return (
		<Frame title={"1 · Ça part\nde *l'os*"} counter={[[0, 1]]}>
			<PixelScreen
				draw={(g, f) => {
					const comp = ramp(f, ECRASE - 2, ECRASE + 14);
					drawSacrum(
						g,
						{
							...SACRUM_DEFAULT,
							f,
							loupe: ramp(f, SOUS - 4, SOUS + 8),
							comp,
							arrows: f >= POIDS ? 1 : 0,
							sang: sangAt(f),
							phase: flowPhase(sangAt, f),
							lesion: 0.35 * ramp(f, PRES, PREMIER + 10),
							pulse: f >= PRES,
							rougeur: ramp(f, PEAU2, DERNIER + 6),
							blink: f >= DOS,
						},
						[comp * 0.85, sangAt(f), 1 - 0.7 * ramp(f, OXY - 4, OXY + 14)],
						[L1, L2, f < PRES ? Math.min(L1.length, typedAt(f, 0)) : L1.length + typedAt(f, PRES)],
					);
				}}
			/>
			<Note at={ECRASE - 2} to={SANG - 6} y={1408} size={44}>
				le poids écrase les tissus
			</Note>
			<Note at={SANG - 2} to={PRES - 6} y={1408} size={44}>
				le sang ne passe plus
			</Note>
			<Note at={PRES - 2} to={PEAU2 - 6} y={1408} size={44} tone={LPI.pink}>
				ça s'abîme d'abord près de l'os
			</Note>
			<Note at={PEAU2 - 2} y={1408} size={44}>
				la peau le montre en dernier
			</Note>
			<Sfx name="blip" at={0} />
			<Sfx name="blip" at={POIDS} />
			<Sfx name="blip-down" at={SANG} />
			<Sfx name="blip-down" at={PRES} />
			<Sfx name="blip" at={PEAU2} />
		</Frame>
	);
};

/* ═══════════════════════════════ 2 · MASSER ÉCRASE ═══════════════════════════════ */
/** Glaçon et sèche-cheveux en pixels, barrés (bas du HUD, hors de la colonne des boutons de l'appli). */
const drawNoNo = (g: Px, ice: number, dryer: number) => {
	if (ice > 0) {
		// glaçon : cube bleu clair, reflets
		g.rect(100, 133, 20, 20, PX.sky);
		g.box(100, 133, 20, 20, PX.text);
		g.rect(102, 135, 6, 3, PX.text);
		g.rect(102, 139, 2, 5, PX.text);
		g.rect(112, 145, 5, 5, PX.blue);
		pxCross(g, 97, 130, 123, 156, ice);
	}
	if (dryer > 0) {
		// sèche-cheveux : corps, embout, poignée, air chaud
		g.rect(126, 134, 18, 11, PX.line);
		g.box(126, 134, 18, 11, PX.text);
		g.rect(144, 136, 4, 7, PX.text);
		g.rect(129, 145, 6, 10, PX.line);
		g.box(129, 145, 6, 10, PX.text);
		for (const [dx, dy] of [[150, 135], [152, 139], [150, 143]]) g.rect(dx, dy, 3, 1, PX.pink);
		pxCross(g, 123, 130, 155, 157, dryer);
	}
};

export const Massage: React.FC = () => {
	const MASSES = at('massage', 'masses');
	const ECRASES = at('massage', 'ecrases');
	const VAISS = at('massage', 'vaisseaux');
	const ABIMES = at('massage', 'abimes');
	const PROSC = at('massage', 'proscrire');
	const GLACONS = at('massage', 'glacons');
	const CHAUD = at('massage', 'chaud');
	const L1 = 'TU MASSES ?';
	const L2 = 'ÇA ÉCRASE ENCORE';
	const sangAt = (f: number) => 0.35 - 0.27 * ramp(f, ECRASES, ECRASES + 16);
	return (
		<Frame title={'2 · Masser\n*écrase*'} counter={[[0, 2]]} tone={LPI.sky}>
			<PixelScreen
				draw={(g, f) => {
					const rubbing = f >= MASSES && f < PROSC + 4;
					const hand = rubbing ? Math.round(Math.sin((f - MASSES) / 2.5) * 7) : f >= PROSC + 4 ? 0 : null;
					drawSacrum(
						g,
						{...SACRUM_DEFAULT, f, lift: 1, hand, comp: hand === null ? 0.4 : 0.9, sang: sangAt(f), phase: flowPhase(sangAt, f), broken: ramp(f, VAISS, ABIMES + 8), lesion: 0.35 + 0.15 * ramp(f, ABIMES, ABIMES + 14), pulse: f >= ECRASES, blink: false},
						[hand === null ? 0.3 : 0.9, sangAt(f), 0.3 - 0.15 * ramp(f, ECRASES, ECRASES + 16)],
						[L1, L2, f < ECRASES ? Math.min(L1.length, typedAt(f, 0)) : L1.length + typedAt(f, ECRASES)],
					);
					if (f >= PROSC) pxCross(g, LOUPE.cx - 28, LOUPE.cy - 28, LOUPE.cx + 28, LOUPE.cy + 28, ramp(f, PROSC, PROSC + 6));
					drawNoNo(g, f >= GLACONS ? Math.max(0.001, ramp(f, GLACONS + 4, GLACONS + 10)) : 0, f >= CHAUD ? Math.max(0.001, ramp(f, CHAUD + 4, CHAUD + 10)) : 0);
				}}
			/>
			<Note at={ECRASES - 2} to={PROSC - 6} y={1408} size={42}>
				tu écrases encore plus les vaisseaux
			</Note>
			<Note at={PROSC - 2} to={GLACONS - 6} y={1408} size={42} tone={LPI.pink}>
				massages et frictions : à proscrire
			</Note>
			<Note at={GLACONS - 2} y={1408} size={44}>
				ni glaçons, ni air chaud
			</Note>
			<Sfx name="blip" at={0} />
			<Sfx name="blip-down" at={ECRASES} />
			<Sfx name="stamp" at={PROSC} volume={0.3} />
			<Sfx name="blip-down" at={PROSC + 2} />
			<Sfx name="blip" at={GLACONS + 4} />
			<Sfx name="blip" at={CHAUD + 4} />
		</Frame>
	);
};

/* ═══════════════════════════════ 3 · ON SOULAGE ═══════════════════════════════ */
export const Soulager: React.FC = () => {
	const CHANGE = at('soulager', 'change');
	const POSITION = at('soulager', 'position');
	const MATELAS = at('soulager', 'matelas');
	const DISP = at('soulager', 'disparait');
	const REVIENT = at('soulager', 'revient');
	const RESPIRENT = at('soulager', 'respirent');
	const NOUVEAU = at('soulager', 'nouveau');
	const L1 = 'BON RÉFLEXE :';
	const L2 = "SUPPRIMER L'APPUI";
	const sangAt = (f: number) => 0.2 + 0.8 * ramp(f, REVIENT - 6, REVIENT + 16);
	return (
		<Frame title={"3 · On *soulage*\nl'appui"} counter={[[0, 3]]} done>
			<PixelScreen
				draw={(g, f) => {
					const lift = ramp(f, CHANGE, POSITION + 10);
					drawSacrum(
						g,
						{
							...SACRUM_DEFAULT,
							f,
							lift,
							comp: 1 - lift,
							arrows: 1 - lift,
							air: f >= MATELAS,
							sang: sangAt(f),
							phase: flowPhase(sangAt, f),
							lesionK: 1 - 0.65 * ramp(f, RESPIRENT - 6, NOUVEAU + 16),
							rougeur: 1 - 0.8 * ramp(f, RESPIRENT - 6, NOUVEAU + 16),
							blink: lift < 0.5,
						},
						[0.85 * (1 - ramp(f, DISP - 6, DISP + 10)), sangAt(f), 0.3 + 0.65 * ramp(f, RESPIRENT - 6, RESPIRENT + 14)],
						[L1, L2, f < CHANGE ? Math.min(L1.length, typedAt(f, 0)) : L1.length + typedAt(f, CHANGE)],
					);
				}}
			/>
			<Note at={CHANGE - 2} to={MATELAS - 6} y={1408} size={46}>
				changer de position
			</Note>
			<Note at={MATELAS - 2} to={REVIENT - 6} y={1408} size={46}>
				matelas adapté
			</Note>
			<Note at={REVIENT - 2} y={1408} size={46} tone={LPI.blue}>
				le sang revient
			</Note>
			<Sfx name="blip" at={CHANGE} />
			<Sfx name="blip" at={MATELAS} />
			<Sfx name="blip-up" at={REVIENT} />
			<Sfx name="blip-up" at={RESPIRENT} />
		</Frame>
	);
};

/* ═══════════════════════════════ FIN : LE TEST DU DOIGT ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const ROUGEUR = at('fin', 'rougeur');
	const TEST = at('fin', 'test');
	const DOIGT = at('fin', 'doigt');
	const PROCH = at('fin', 'prochaine');
	const L1 = 'ESCARRE OU PAS ?';
	const L2 = 'LE TEST DU DOIGT';
	return (
		<Frame title={'Escarre\nou *pas* ?'} counter={[[0, 3]]} done>
			<PixelScreen
				draw={(g, f) => {
					drawSacrum(g, {...SACRUM_DEFAULT, f, lift: 1, comp: 0, arrows: 0, sang: 0.8, phase: flowPhase(() => 0.8, f), lesionK: 0.35, rougeur: 1, blink: false, finger: ramp(f, DOIGT - 4, DOIGT + 12)}, [0.1, 0.8, 0.9], [L1, L2, f < TEST ? Math.min(L1.length, typedAt(f, 0)) : L1.length + typedAt(f, TEST)]);
					// « ? » qui clignote sur la rougeur
					if (f >= ROUGEUR && f < DOIGT && Math.floor(f / 5) % 2 === 0) g.textS('?', LOUPE.cx + 12, LOUPE.cy + 14, PX.pink, 16);
				}}
			/>
			<div style={{position: 'absolute', left: 90, top: 1392, opacity: interpolate(frame, [PROCH - 4, PROCH + 4], [0, 1], clamp), transform: `translateY(${interpolate(frame, [PROCH - 4, PROCH + 6], [30, 0], ease)}px)`}}>
				<NextCard>Le test du doigt</NextCard>
			</div>
			<Sfx name="blip" at={ROUGEUR} />
			<Sfx name="blip" at={TEST} />
			<Sfx name="blip-up" at={PROCH} />
		</Frame>
	);
};
