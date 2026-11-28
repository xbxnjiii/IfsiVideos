// « Escarre : tu masses ? » (n° 105, série « Les plaies » en pixel 8-bit, 1/10, pilote du format) — v2 plein cadre.
// Retour du propriétaire sur la v1 (fenêtre au centre d'un cadre) : s'inspirer d'un reel « 8bit » qui marche, zoomer
// davantage sur ce qui se passe au niveau de l'escarre, oublier tout ce qu'il y a autour, et n'afficher les jauges
// « appui », « sang »… qu'au moment où on en parle. Donc : tout l'écran est en pixel (180 × 320 × 6), plan large de
// la situation (patient au lit, réticule sur le sacrum) puis poussée de caméra jusqu'à la coupe au sacrum en très gros
// plan ; étiquettes à trait de rappel au mot ; pastille de mode en haut à gauche, compteur n/3 en haut à droite ; jauges
// qui apparaissent quand la voix les nomme ; phrase clé de la marque en bas ; mascotte (jamais pixelisée) en haut à
// gauche ; la vidéo finit en reculant sur le plan large de l'image 0 (boucle).
// Sources : conférence de consensus « Prévention et traitement des escarres de l'adulte et du sujet âgé » (ANAES / HAS,
// 15-16 novembre 2001) : massages et frictions de la zone à risque à proscrire, glaçons et air chaud interdits,
// changements de position et supports adaptés ; NPIAP 2016 / EPUAP-NPIAP-PPPIA 2019 : la lésion des tissus profonds
// naît de la pression et du cisaillement à l'interface os-muscle. Aucun chiffre non sourcé à l'écran.
import React from 'react';
import {AbsoluteFill, Freeze, interpolate, useCurrentFrame} from 'remotion';
import {ease, Note} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {flowPhase, PixelFull, Px, PX, pxBubble, pxCounter, pxCross, pxGauge, pxLabel, pxTag, typedAt} from '../../brand/pixel';
import {BED_SACRUM, pxBedScene, pxSacrumSection, SEC, SEC_D, SECTION_DEFAULT, SectionState, secY} from '../../brand/pixelplaies';
import {NextCard} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const TOTAL = 3;
const NOTE_Y = 1792;

/** 0 → 1 entre a et b (images quantifiées à 12 i/s). */
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(a + 1, b)], [0, 1], clamp);
/** visible de a (compris) à b (exclu) */
const during = (f: number, a: number, b = 1e9) => f >= a && f < b;

/** Jauges à droite, chacune n'apparaît qu'à partir du mot qui la nomme ([image du mot, valeur]). */
type GaugeSet = {appui?: [number, number]; sang?: [number, number]; o2?: [number, number]};
const gauges = (g: Px, f: number, set: GaugeSet) => {
	let y = 32;
	for (const [key, name, bad] of [
		['appui', 'APPUI', 'high'],
		['sang', 'SANG', 'low'],
		['o2', 'O2', 'low'],
	] as const) {
		const v = set[key];
		if (!v || f < v[0]) continue;
		const grow = ramp(f, v[0], v[0] + 5); // la barre se remplit en apparaissant
		g.rect(120, y - 3, 58, 27, PX.panel);
		pxGauge(g, name, 123, y, 52, v[1] * grow, bad, f, true);
		y += 28;
	}
};

/** Étiquette qui s'écrit au mot `t0` et disparaît à `t1`. */
const label = (g: Px, f: number, t0: number, t1: number, text: string, tx: number, ty: number, ax: number, ay: number, tone?: string) => {
	if (during(f, t0, t1)) pxLabel(g, text, tx, ty, ax, ay, typedAt(f, t0, 1.2), tone);
};

/** Poussée de caméra : du plan large au sacrum avant `t`, puis la coupe se pose (léger zoom qui se relâche). */
const pushIn = (frame: number, t: number) => {
	if (frame < t) return {wide: true, zoom: {s: 1 + 5 * interpolate(frame, [t - 12, t], [0, 1], {...clamp, easing: (x: number) => x * x * x}), ...BED_SACRUM}};
	return {wide: false, zoom: {s: 1 + 0.8 * interpolate(frame, [t, t + 10], [1, 0], ease), x: SEC.cx, y: 190}};
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const INTACTE = at('intro', 'intacte');
	const OS = at('intro', "l'os");
	const ESC = at('intro', 'escarre');
	const MASSES = at('intro', 'masses');
	const cam = pushIn(frame, OS);
	return (
		<AbsoluteFill>
			<PixelFull
				zoom={cam.zoom}
				hud={(g, f) => {
					if (cam.wide) pxBubble(g, 'ROUGEUR AU SACRUM', 'TU MASSES ?', Infinity, 30, 13);
					else pxTag(g, 'SOUS LA PEAU');
					pxCounter(g, 0, TOTAL);
				}}
				draw={(g, f) => {
					if (cam.wide) {
						pxBedScene(g, f);
						label(g, f, INTACTE, OS - 12, 'LA PEAU ?\nJUSTE ROUGE', 70, 270, BED_SACRUM.x, BED_SACRUM.y + 2);
						return;
					}
					const hand = ramp(f, MASSES, MASSES + 8);
					const s: SectionState = {...SECTION_DEFAULT, f, pulse: true, mattress: hand === 0, hand, shear: hand > 0 ? Math.round(Math.sin((f - MASSES) / 2.5) * 8) : 0};
					pxSacrumSection(g, s);
					label(g, f, OS + 10, ESC, 'OS', 6, 26, 40, 70);
					label(g, f, ESC, MASSES, "L'ESCARRE\nCOMMENCE ICI", 6, 176, 62, secY(62, 0.12, s), PX.pink);
					if (hand > 0) g.textS('?', SEC.cx + 56, secY(SEC.cx, 1, s) + 8, PX.pink, 16);
				}}
			/>
			<Note at={INTACTE - 2} to={OS - 4} y={NOTE_Y} size={44}>
				la peau a l'air intacte…
			</Note>
			<Note at={OS - 2} to={MASSES - 4} y={NOTE_Y} size={44} tone={LPI.pink}>
				…mais ça commence près de l'os
			</Note>
			<Note at={MASSES - 2} y={NOTE_Y} size={50}>
				et toi, tu masses ?
			</Note>
			<Sfx name="blip" at={INTACTE} />
			<Sfx name="whoosh" at={OS - 10} volume={0.25} />
			<Sfx name="blip-down" at={ESC} />
			<Sfx name="blip" at={MASSES} />
		</AbsoluteFill>
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
	const ZONE = at('regle', "d'appui");
	const SUPP = at('regle', 'supprime');
	const APPUI = at('regle', "l'appui");
	return (
		<AbsoluteFill>
			<PixelFull
				draw={(g, f) => {
					const rub = f < SUPP;
					const off = ramp(f, SUPP, SUPP + 16);
					const s: SectionState = {
						...SECTION_DEFAULT,
						f,
						pulse: true,
						mattress: !rub,
						hand: rub ? 1 : 0,
						shear: rub ? Math.round(Math.sin(f / 2.5) * 8) : 0,
						comp: rub ? 1 : 1 - off,
						gap: Math.round(off * 16),
						o2: 0.15 + 0.6 * off,
						phase: flowPhase((k) => 0.8 * ramp(k, SUPP, SUPP + 16), f),
					};
					pxSacrumSection(g, s);
					if (during(f, PAS, SUPP)) pxCross(g, SEC.cx - 52, 150, SEC.cx + 52, 254, ramp(f, PAS, PAS + 6));
					pxTag(g, f < SUPP ? 'SURTOUT PAS !' : "STOP L'APPUI");
					pxCounter(g, 0, TOTAL);
					gauges(g, f, {appui: [ZONE, 0.85 * (1 - off)]});
				}}
			/>
			<Stamp at={PAS} x={540} y={1180} text="SURTOUT PAS !" size={84} out={SUPP - 4} />
			<Note at={ZONE - 2} to={SUPP - 4} y={NOTE_Y} size={44}>
				jamais sur une zone d'appui
			</Note>
			<Note at={SUPP - 2} y={NOTE_Y} size={50} tone={LPI.blue}>
				on supprime l'appui
			</Note>
			<Sfx name="stamp" at={PAS} volume={0.4} />
			<Sfx name="blip-down" at={PAS + 2} />
			<Sfx name="blip" at={ZONE} />
			<Sfx name="blip-up" at={APPUI} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · ÇA PART DE L'OS ═══════════════════════════════ */
export const Pression: React.FC = () => {
	const SOUS = at('pression', 'sous');
	const MATELAS = at('pression', 'matelas');
	const POIDS = at('pression', 'poids');
	const ECRASE = at('pression', 'ecrase');
	const SANG = at('pression', 'sang');
	const PLUS = at('pression', 'plus');
	const OXY = at('pression', "d'oxygene");
	const PRES = at('pression', 'pres');
	const PREMIER = at('pression', 'premier');
	const PEAU2 = at('pression', 'peau', 2);
	const DERNIER = at('pression', 'dernier');
	const flow = (f: number) => 1 - ramp(f, SANG, PLUS + 6);
	return (
		<AbsoluteFill>
			<PixelFull
				draw={(g, f) => {
					const comp = ramp(f, ECRASE - 2, ECRASE + 12);
					const s: SectionState = {
						...SECTION_DEFAULT,
						f,
						comp,
						arrows: f >= POIDS ? 1 : 0,
						phase: flowPhase(flow, f),
						o2: 1 - 0.85 * ramp(f, SANG, OXY + 10),
						lesion: 0.42 * ramp(f, PRES, PREMIER + 10),
						pulse: f >= PRES,
						rougeur: ramp(f, PEAU2, DERNIER + 6),
					};
					pxSacrumSection(g, s);
					pxTag(g, 'SUR LE DOS');
					pxCounter(g, 1, TOTAL, f < 6);
					gauges(g, f, {appui: [POIDS, 0.85 * comp], sang: [SANG, 0.15 + 0.85 * flow(f)], o2: [OXY, 1 - 0.85 * ramp(f, OXY - 2, OXY + 12)]});
					// les couches, présentées au début
					label(g, f, SOUS, POIDS, 'OS DU SACRUM', 6, 26, 44, 74);
					label(g, f, SOUS + 6, POIDS, 'PEAU', 6, 300, 40, secY(40, 0.96, s));
					label(g, f, MATELAS - 2, ECRASE + 30, 'MATELAS', 112, 304, 150, 300);
					label(g, f, SANG, PRES, 'VAISSEAUX\nÉCRASÉS', 6, 176, SEC.cx - 14, secY(SEC.cx - 14, SEC_D.art, s));
					label(g, f, PRES, PEAU2, "ÇA COMMENCE\nPRÈS DE L'OS", 6, 176, 60, secY(60, 0.1, s), PX.pink);
					label(g, f, PEAU2, 1e9, 'LA ROUGEUR\nEN DERNIER', 6, 186, SEC.cx - 20, secY(SEC.cx - 20, 0.95, s));
				}}
			/>
			<Note at={ECRASE - 2} to={SANG - 6} y={NOTE_Y} size={44}>
				le poids écrase les tissus
			</Note>
			<Note at={SANG - 2} to={PRES - 6} y={NOTE_Y} size={44}>
				le sang ne passe plus
			</Note>
			<Note at={PRES - 2} to={PEAU2 - 6} y={NOTE_Y} size={44} tone={LPI.pink}>
				ça s'abîme d'abord près de l'os
			</Note>
			<Note at={PEAU2 - 2} y={NOTE_Y} size={44}>
				la peau le montre en dernier
			</Note>
			<Sfx name="blip" at={0} />
			<Sfx name="blip" at={SOUS} />
			<Sfx name="blip" at={POIDS} />
			<Sfx name="blip-down" at={SANG} />
			<Sfx name="blip-down" at={OXY} />
			<Sfx name="blip-down" at={PRES} />
			<Sfx name="blip" at={PEAU2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MASSER ÉCRASE ═══════════════════════════════ */
/** Glaçon et sèche-cheveux en pixels (grands), barrés. */
const drawNoNo = (g: Px, ice: number, iceX: number, dryer: number, dryX: number) => {
	const y = 238;
	if (ice > 0) {
		g.rect(iceX, y, 32, 32, PX.sky);
		g.box(iceX, y, 32, 32, PX.text);
		g.rect(iceX + 3, y + 3, 10, 4, PX.text);
		g.rect(iceX + 3, y + 8, 3, 9, PX.text);
		g.rect(iceX + 20, y + 22, 8, 6, PX.blue);
		pxCross(g, iceX - 4, y - 4, iceX + 36, y + 36, ice);
	}
	if (dryer > 0) {
		const x = dryX;
		g.rect(x, y + 2, 30, 18, PX.line);
		g.box(x, y + 2, 30, 18, PX.text);
		g.rect(x + 30, y + 6, 6, 10, PX.text);
		g.rect(x + 5, y + 20, 10, 16, PX.line);
		g.box(x + 5, y + 20, 10, 16, PX.text);
		for (const [dx, dy] of [[40, 6], [43, 11], [40, 16]]) g.rect(x + dx, y + dy, 5, 1, PX.pink);
		pxCross(g, x - 4, y - 4, x + 48, y + 40, dryer);
	}
};

export const Massage: React.FC = () => {
	const MASSES = at('massage', 'masses');
	const FROTTES = at('massage', 'frottes');
	const ECRASES = at('massage', 'ecrases');
	const VAISS = at('massage', 'vaisseaux');
	const ABIMES = at('massage', 'abimes');
	const PROSC = at('massage', 'proscrire');
	const GLACONS = at('massage', 'glacons');
	const CHAUD = at('massage', 'chaud');
	const sangAt = (f: number) => 0.35 - 0.3 * ramp(f, ECRASES, ECRASES + 16);
	return (
		<AbsoluteFill>
			<PixelFull
				draw={(g, f) => {
					const handIn = ramp(f, MASSES - 4, MASSES + 8) * (1 - ramp(f, PROSC + 8, PROSC + 18));
					const rubbing = during(f, FROTTES - 6, PROSC + 8);
					const s: SectionState = {
						...SECTION_DEFAULT,
						f,
						mattress: false,
						comp: 0.35 + 0.65 * handIn,
						hand: handIn,
						shear: rubbing ? Math.round(Math.sin((f - FROTTES) / 2.5) * 10) : 0,
						phase: flowPhase(sangAt, f),
						o2: sangAt(f) * 0.6,
						leak: ramp(f, VAISS, ABIMES + 24),
						lesion: 0.42 + 0.18 * ramp(f, ABIMES, ABIMES + 16),
						pulse: f >= ECRASES,
					};
					pxSacrumSection(g, s);
					pxTag(g, f < PROSC ? 'TU MASSES ?' : 'À PROSCRIRE', true);
					pxCounter(g, 2, TOTAL, f < 6);
					gauges(g, f, {sang: [VAISS, sangAt(f)]});
					label(g, f, VAISS, PROSC, 'VAISSEAUX\nABÎMÉS : LE\nSANG FUIT', 6, 168, SEC.cx - 22, secY(SEC.cx - 22, SEC_D.art, s), PX.pink);
					if (f >= PROSC) pxCross(g, SEC.cx - 56, 112, SEC.cx + 56, 224, ramp(f, PROSC, PROSC + 6));
					drawNoNo(g, f >= GLACONS ? Math.max(0.001, ramp(f, GLACONS + 4, GLACONS + 10)) : 0, 18, f >= CHAUD ? Math.max(0.001, ramp(f, CHAUD + 4, CHAUD + 10)) : 0, 108);
				}}
			/>
			<Note at={ECRASES - 2} to={PROSC - 6} y={NOTE_Y} size={42}>
				tu écrases encore plus les vaisseaux
			</Note>
			<Note at={PROSC - 2} to={GLACONS - 6} y={NOTE_Y} size={42} tone={LPI.pink}>
				massages et frictions : à proscrire
			</Note>
			<Note at={GLACONS - 2} y={NOTE_Y} size={44}>
				ni glaçons, ni air chaud
			</Note>
			<Sfx name="blip" at={0} />
			<Sfx name="blip" at={MASSES} />
			<Sfx name="blip-down" at={VAISS} />
			<Sfx name="stamp" at={PROSC} volume={0.3} />
			<Sfx name="blip-down" at={PROSC + 2} />
			<Sfx name="blip" at={GLACONS + 4} />
			<Sfx name="blip" at={CHAUD + 4} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · ON SOULAGE ═══════════════════════════════ */
export const Soulager: React.FC = () => {
	const CHANGE = at('soulager', 'change');
	const POSITION = at('soulager', 'position');
	const MATELAS = at('soulager', 'matelas');
	const APPUI = at('soulager', "l'appui");
	const DISP = at('soulager', 'disparait');
	const SANG = at('soulager', 'sang');
	const REVIENT = at('soulager', 'revient');
	const RESPIRENT = at('soulager', 'respirent');
	const NOUVEAU = at('soulager', 'nouveau');
	const flow = (f: number) => ramp(f, REVIENT - 6, REVIENT + 14);
	return (
		<AbsoluteFill>
			<PixelFull
				draw={(g, f) => {
					const lift = ramp(f, CHANGE, POSITION + 8);
					const back = ramp(f, MATELAS, MATELAS + 10); // le matelas adapté revient porter, en douceur
					const s: SectionState = {
						...SECTION_DEFAULT,
						f,
						air: f >= MATELAS,
						comp: 1 - lift + back * 0.12,
						arrows: lift < 0.3 ? 1 : 0,
						gap: Math.round(lift * 18 * (1 - back) + back),
						phase: flowPhase(flow, f),
						o2: 0.15 + 0.85 * ramp(f, RESPIRENT - 4, RESPIRENT + 12),
						lesionK: 1 - 0.65 * ramp(f, RESPIRENT - 6, NOUVEAU + 16),
						rougeur: 1 - 0.8 * ramp(f, RESPIRENT - 6, NOUVEAU + 16),
					};
					pxSacrumSection(g, s);
					pxTag(g, f < MATELAS ? 'ON LE TOURNE' : 'BON MATELAS', true);
					pxCounter(g, 3, TOTAL, f < 6);
					gauges(g, f, {appui: [APPUI, 0.85 * (1 - ramp(f, DISP - 4, DISP + 10))], sang: [SANG, 0.15 + 0.85 * flow(f)], o2: [RESPIRENT, 0.15 + 0.85 * ramp(f, RESPIRENT - 2, RESPIRENT + 12)]});
					label(g, f, REVIENT, 1e9, 'LE SANG\nREVIENT', 6, 176, SEC.cx - 30, secY(SEC.cx - 30, SEC_D.art, s));
				}}
			/>
			<Note at={CHANGE - 2} to={MATELAS - 6} y={NOTE_Y} size={46}>
				on change de position
			</Note>
			<Note at={MATELAS - 2} to={REVIENT - 6} y={NOTE_Y} size={46}>
				matelas adapté
			</Note>
			<Note at={REVIENT - 2} y={NOTE_Y} size={46} tone={LPI.blue}>
				le sang revient
			</Note>
			<Sfx name="blip" at={0} />
			<Sfx name="blip" at={CHANGE} />
			<Sfx name="blip" at={MATELAS} />
			<Sfx name="blip-up" at={REVIENT} />
			<Sfx name="blip-up" at={RESPIRENT} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN : LE TEST DU DOIGT ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const ROUGEUR = at('fin', 'rougeur');
	const DOIGT = at('fin', 'doigt');
	const PROCH = at('fin', 'prochaine');
	const VIDEO = at('fin', 'video');
	// recul final jusqu'au plan large de l'image 0 (la vidéo boucle)
	const OUT = VIDEO + 14;
	const wide = frame >= OUT;
	const zoom = wide ? {s: 1 + 5 * interpolate(frame, [OUT, OUT + 10], [1, 0], {...clamp, easing: (x: number) => 1 - (1 - x) ** 3}), ...BED_SACRUM} : undefined;
	return (
		<AbsoluteFill>
			<PixelFull
				zoom={zoom}
				hud={(g, f) => {
					if (wide) {
						pxBubble(g, 'ROUGEUR AU SACRUM', 'TU MASSES ?', Infinity, 30, 13);
						pxCounter(g, 0, TOTAL);
						return;
					}
					pxTag(g, 'ESCARRE ?');
					pxCounter(g, 3, TOTAL);
				}}
				draw={(g, f) => {
					if (wide) {
						pxBedScene(g, f);
						return;
					}
					const s: SectionState = {...SECTION_DEFAULT, f, comp: 0.12, gap: 1, air: true, phase: flowPhase(() => 0.9, f), o2: 0.9, lesionK: 0.35, rougeur: 1, finger: ramp(f, DOIGT - 4, DOIGT + 10)};
					pxSacrumSection(g, s);
					if (during(f, ROUGEUR, DOIGT) && Math.floor(f / 5) % 2 === 0) g.textS('?', SEC.cx + 30, secY(SEC.cx + 30, 0.9, s) - 16, PX.pink, 16);
					label(g, f, DOIGT, 1e9, 'LE TEST\nDU DOIGT', 112, 200, SEC.cx + 8, secY(SEC.cx + 8, 0.97, s));
				}}
			/>
			<div style={{position: 'absolute', left: 90, top: 1740, opacity: interpolate(frame, [PROCH - 4, PROCH + 4, OUT - 2, OUT + 4], [0, 1, 1, 0], clamp), transform: `translateY(${interpolate(frame, [PROCH - 4, PROCH + 6], [30, 0], ease)}px)`}}>
				<NextCard>Le test du doigt</NextCard>
			</div>
			<Sfx name="blip" at={ROUGEUR} />
			<Sfx name="blip" at={DOIGT} />
			<Sfx name="blip-up" at={PROCH} />
			<Sfx name="whoosh" at={OUT} volume={0.25} />
		</AbsoluteFill>
	);
};
