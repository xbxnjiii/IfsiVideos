// « Le test du doigt » (n° 106, série « Les plaies » en pixel 8-bit, 2/10). Même format que la n° 105 : dehors aux
// couleurs claires de la marque (la peau du bas du dos vue de dessus, doigt ganté), dedans en thème sombre (la coupe
// au sacrum), passage par le cercle du scanner ; jauges et étiquettes au mot ; boucle sur l'image 0.
// Déroulé : accroche (rougeur au sacrum : escarre ou pas ? un seul doigt, trois secondes) · 1 le geste (appuyer 3 s,
// relâcher, regarder) · 2 elle blanchit (le sang circule encore : pas encore une escarre, on soulage et on surveille)
// · 3 elle reste rouge (le sang est sorti des petits vaisseaux, le doigt ne le chasse plus : stade 1, peau intacte)
// · peau foncée (zone plus foncée, plus chaude, plus dure) · fin : les 4 stades, prochaine vidéo.
// Sources : NPIAP 2016 et EPUAP-NPIAP-PPPIA 2019 (stade 1 = érythème non blanchissable d'une peau intacte ; méthode
// du doigt ou du disque transparent ; peaux foncées : changement de couleur, chaleur, œdème, induration) ; International
// Guideline (internationalguideline.com, « Skin and Tissue Assessment ») : appuyer le doigt 3 secondes sur l'érythème
// puis relâcher ; classification de la Belgique (Belrai) et recommandations du CHUV : « rougeur qui ne blanchit pas à la
// vitropression ». Aucun autre chiffre à l'écran.
import React from 'react';
import {AbsoluteFill, Freeze, interpolate, useCurrentFrame} from 'remotion';
import {ease, Note} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {flowPhase, PixelFull, Px, PX, pxBubble, pxCounter, pxLabel, pxTag, pxTimer, typedAt} from '../../brand/pixel';
import {pxReveal, pxSacrumSection, pxSkinTop, SEC, SEC_D, SECTION_DEFAULT, SectionState, secY, SkinTopState, TOP_SPOT} from '../../brand/pixelplaies';
import {NextCard} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const TOTAL = 3;
const NOTE_Y = 1792;

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(a + 1, b)], [0, 1], clamp);
const during = (f: number, a: number, b = 1e9) => f >= a && f < b;
const label = (g: Px, f: number, t0: number, t1: number, text: string, tx: number, ty: number, ax: number, ay: number, tone?: string) => {
	if (during(f, t0, t1)) pxLabel(g, text, tx, ty, ax, ay, typedAt(f, t0, 1.2), tone);
};
const TOP: SkinTopState = {tone: 'light', redness: 1, finger: 0, white: 0, f: 0};

/** Grand bandeau pixel centré (police 16). */
const banner = (g: Px, text: string, y: number, tone: string = PX.pink) => {
	const w = text.length * 16 + 16;
	const x = Math.round(90 - w / 2);
	g.rect(x, y, w, 26, PX.panel);
	g.box(x, y, w, 26, tone);
	g.box(x + 2, y + 2, w - 4, 22, PX.line);
	g.textS(text, x + 8, y + 5, tone, 16);
};

/** Coupe dessinée à part, pour le cercle du scanner. */
const sectionLayer = (st: SectionState) => {
	const o = new Px(180, 320);
	o.fill(PX.bg);
	pxSacrumSection(o, st);
	return o;
};

/** Le doigt appuie (de dessous, dans la coupe) puis relâche, en boucle : `period` images. */
const pressLoop = (f: number, t0: number, period = 40) => {
	if (f < t0) return {finger: 0.25, press: 0};
	const p = ((f - t0) % period) / period;
	const press = p < 0.5 ? ramp(p, 0, 0.12) : 1 - ramp(p, 0.5, 0.62);
	return {finger: 0.25 + 0.75 * press, press};
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const DOIGT = at('intro', 'doigt');
	const SEUL = at('intro', 'seul');
	const TROIS = at('intro', 'trois');
	return (
		<AbsoluteFill>
			<PixelFull
				scan={false}
				hud={(g, f) => {
					pxBubble(g, 'ROUGEUR AU SACRUM', 'ESCARRE OU PAS ?', Infinity, 30, 13);
					pxCounter(g, 0, TOTAL);
					if (f >= TROIS) pxTimer(g, 3, 0, 130, 70);
				}}
				draw={(g, f) => {
					pxSkinTop(g, {...TOP, f, finger: 0.5 * ramp(f, SEUL - 4, DOIGT + 6)});
				}}
			/>
			<Note at={SEUL - 2} y={NOTE_Y} size={50}>
				un seul doigt, trois secondes
			</Note>
		</AbsoluteFill>
	);
};

/** Dernière image = première image (la vidéo boucle). */
export const Loop: React.FC = () => (
	<Freeze frame={0}>
		<Hook />
	</Freeze>
);

/* ═══════════════════════════════ 1 · LE GESTE ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const BOUT = at('geste', 'bout');
	const APPUIES = at('geste', 'appuies');
	const RELACHES = at('geste', 'relaches');
	const REGARDES = at('geste', 'regardes');
	const step = (RELACHES - APPUIES) / 3;
	return (
		<AbsoluteFill>
			<PixelFull
				scan={false}
				hud={(g, f) => {
					pxTag(g, 'LE GESTE');
					pxCounter(g, 1, TOTAL, f < 6);
					if (during(f, APPUIES, RELACHES)) {
						const k = Math.min(2, Math.floor((f - APPUIES) / step));
						pxTimer(g, 3 - k, (f - APPUIES - k * step) / step, 130, 32);
					}
				}}
				draw={(g, f) => {
					const press = ramp(f, APPUIES - 2, APPUIES + 4) * (1 - ramp(f, RELACHES, RELACHES + 6));
					const finger = f < RELACHES ? 0.5 + 0.5 * press : 0.5 * (1 - ramp(f, RELACHES + 6, REGARDES));
					pxSkinTop(g, {...TOP, f, finger});
					label(g, f, BOUT, APPUIES, 'LE BOUT\nDU DOIGT', 112, 70, TOP_SPOT.x + 4, TOP_SPOT.y + 2);
					if (f >= REGARDES && Math.floor(f / 5) % 2 === 0) g.textS('?', TOP_SPOT.x - 4, TOP_SPOT.y - 40, PX.pink, 16);
				}}
			/>
			<Note at={APPUIES - 2} to={RELACHES - 4} y={NOTE_Y} size={50}>
				on appuie 3 secondes
			</Note>
			<Note at={RELACHES - 2} y={NOTE_Y} size={50} tone={LPI.blue}>
				on relâche… et on regarde
			</Note>
			<Sfx name="tick" at={APPUIES} />
			<Sfx name="tick" at={Math.round(APPUIES + step)} />
			<Sfx name="tick" at={Math.round(APPUIES + 2 * step)} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · ELLE BLANCHIT ═══════════════════════════════ */
export const Blanchit: React.FC = () => {
	const DEVIENT = at('blanchit', 'devient');
	const ROUGE = at('blanchit', 'rouge');
	const NOUVEAU = at('blanchit', 'nouveau');
	const SANG = at('blanchit', 'sang');
	const CIRCULE = at('blanchit', 'circule');
	const PAS = at('blanchit', 'pas');
	const SOULAGE = at('blanchit', 'soulage');
	const IN = SANG + 4;
	return (
		<AbsoluteFill>
			<PixelFull
				scan={false}
				hud={(g, f) => {
					pxTag(g, f < SANG - 6 ? 'BLANCHIT ?' : 'SOUS LA PEAU', f >= SANG - 6);
					pxCounter(g, 2, TOTAL, f < 6);
				}}
				draw={(g, f) => {
					const top = {...TOP, f, white: 1 - ramp(f, ROUGE - 2, NOUVEAU + 14)};
					const pl = pressLoop(f, CIRCULE);
					const st: SectionState = {...SECTION_DEFAULT, f, comp: 0, mattress: false, lesion: 0, rougeur: 0.8, o2: 1, phase: flowPhase(() => 1, f), finger: pl.finger, blanch: pl.press ?? 0};
					if (f < SANG - 6) {
						pxSkinTop(g, top);
						label(g, f, DEVIENT, ROUGE, 'BLANCHE...', 112, 120, TOP_SPOT.x + 6, TOP_SPOT.y - 6);
						label(g, f, ROUGE, SANG, '...PUIS\nROUGE', 112, 120, TOP_SPOT.x + 6, TOP_SPOT.y - 6, PX.pink);
						return;
					}
					if (f < IN + 8) {
						pxSkinTop(g, top);
						pxReveal(g, sectionLayer(st), ramp(f, SANG - 6, IN + 8), TOP_SPOT.x, TOP_SPOT.y);
						return;
					}
					pxSacrumSection(g, st);
					label(g, f, CIRCULE, 1e9, 'LE SANG\nCIRCULE\nENCORE', 6, 168, SEC.cx - 26, secY(SEC.cx - 26, SEC_D.art, st));
				}}
			/>
			<Note at={DEVIENT - 2} to={SANG - 6} y={NOTE_Y} size={48}>
				blanche… puis rouge à nouveau
			</Note>
			<Note at={SANG - 2} to={PAS - 6} y={NOTE_Y} size={46}>
				le sang circule encore
			</Note>
			<Note at={PAS - 2} to={SOULAGE - 4} y={NOTE_Y} size={46} tone={LPI.blue}>
				pas encore une escarre
			</Note>
			<Note at={SOULAGE - 2} y={NOTE_Y} size={44}>
				on soulage l'appui et on surveille
			</Note>
			<Sfx name="whoosh" at={SANG - 6} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · ELLE RESTE ROUGE ═══════════════════════════════ */
export const Rouge: React.FC = () => {
	const RESTE = at('rouge', 'reste');
	const SANG = at('rouge', 'sang');
	const SORTI = at('rouge', 'sorti');
	const CHASSER = at('rouge', 'chasser');
	const STADE = at('rouge', 'de');
	const INTACTE = at('rouge', 'intacte');
	const TOUCHES = at('rouge', 'touches');
	const IN = SANG + 4;
	return (
		<AbsoluteFill>
			<PixelFull
				scan={false}
				hud={(g, f) => {
					pxTag(g, f < SANG - 6 ? 'RESTE ROUGE' : 'SOUS LA PEAU', f >= SANG - 6);
					pxCounter(g, 3, TOTAL, f < 6);
					if (f >= STADE) banner(g, 'STADE 1', 120);
				}}
				draw={(g, f) => {
					const top = {...TOP, f, finger: f < 8 ? 1 : 0.5 * (1 - ramp(f, 10, RESTE + 16))};
					const pl = pressLoop(f, SORTI + 10);
					const st: SectionState = {...SECTION_DEFAULT, f, comp: 0, mattress: false, lesion: 0.28, lesionK: 0.7, rougeur: 0.9, o2: 0.6, phase: flowPhase(() => 0.6, f), leak: 1, leakD: 0.86, leakR: 0.45, finger: pl.finger, blanch: pl.press ?? 0, pulse: f >= TOUCHES};
					if (f < SANG - 6) {
						pxSkinTop(g, top);
						label(g, f, RESTE + 4, SANG, 'ELLE RESTE\nROUGE', 104, 120, TOP_SPOT.x + 6, TOP_SPOT.y - 6, PX.pink);
						return;
					}
					if (f < IN + 8) {
						pxSkinTop(g, top);
						pxReveal(g, sectionLayer(st), ramp(f, SANG - 6, IN + 8), TOP_SPOT.x, TOP_SPOT.y);
						return;
					}
					pxSacrumSection(g, st);
					label(g, f, SORTI, CHASSER, 'LE SANG EST\nSORTI DES\nVAISSEAUX', 6, 176, SEC.cx - 18, secY(SEC.cx - 18, 0.86, st), PX.pink);
					label(g, f, CHASSER, STADE, 'LE DOIGT NE\nLE CHASSE\nPAS', 6, 176, SEC.cx - 6, secY(SEC.cx - 6, 0.95, st));
					label(g, f, INTACTE, 1e9, 'PEAU\nINTACTE', 112, 260, SEC.cx + 30, secY(SEC.cx + 30, 0.98, st));
					label(g, f, TOUCHES, 1e9, 'TISSUS\nTOUCHÉS', 6, 176, 66, secY(66, 0.12, st), PX.pink);
				}}
			/>
			<Stamp at={RESTE + 2} x={540} y={1240} text="RESTE ROUGE" size={66} out={SANG - 8} />
			<Note at={SANG - 2} to={STADE - 6} y={NOTE_Y} size={44}>
				le sang est sorti des vaisseaux
			</Note>
			<Note at={STADE - 2} y={NOTE_Y} size={42} tone={LPI.pink}>
				stade 1 : peau intacte, tissus touchés
			</Note>
			<Sfx name="stamp" at={RESTE + 2} volume={0.35} />
			<Sfx name="whoosh" at={SANG - 6} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PEAU FONCÉE ═══════════════════════════════ */
export const Foncee: React.FC = () => {
	const MAL = at('foncee', 'mal');
	const FONCEE2 = at('foncee', 'foncee', 2);
	const CHAUDE = at('foncee', 'chaude');
	const DURE = at('foncee', 'dure');
	return (
		<AbsoluteFill>
			<PixelFull
				scan={false}
				hud={(g, f) => {
					pxTag(g, 'PEAU FONCÉE');
					pxCounter(g, 3, TOTAL);
				}}
				draw={(g, f) => {
					pxSkinTop(g, {tone: 'dark', f, redness: 0.25 + 0.75 * ramp(f, FONCEE2 - 2, FONCEE2 + 10), finger: 0, white: 0, heat: ramp(f, CHAUDE - 2, CHAUDE + 12), hard: ramp(f, DURE - 2, DURE + 12)});
					label(g, f, FONCEE2, 1e9, 'PLUS\nFONCÉE', 6, 250, TOP_SPOT.x - 20, TOP_SPOT.y + 8);
					label(g, f, CHAUDE, 1e9, 'PLUS\nCHAUDE', 112, 70, TOP_SPOT.x + 14, TOP_SPOT.y - 40, PX.pink);
					label(g, f, DURE, 1e9, 'PLUS\nDURE', 124, 250, TOP_SPOT.x + 32, TOP_SPOT.y + 18);
				}}
			/>
			<Note at={MAL - 4} to={FONCEE2 - 6} y={NOTE_Y} size={46}>
				la rougeur se voit mal
			</Note>
			<Note at={FONCEE2 - 2} y={NOTE_Y} size={44} tone={LPI.blue}>
				plus foncée, plus chaude, plus dure
			</Note>
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN : LES 4 STADES ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const AGGRAVE = at('fin', "s'aggrave");
	const QUATRE = at('fin', 'quatre');
	const STADES = at('fin', 'stades');
	const PROCH = at('fin', 'prochaine');
	const VIDEO = at('fin', 'video');
	const OUT = VIDEO + 6;
	const BACK = OUT + 10;
	const stage = (f: number) => (f < AGGRAVE ? 1 : f < QUATRE ? 2 : f < STADES ? 3 : 4);
	return (
		<AbsoluteFill>
			<PixelFull
				scan={frame < BACK}
				hud={(g, f) => {
					if (f >= BACK) {
						pxBubble(g, 'ROUGEUR AU SACRUM', 'ESCARRE OU PAS ?', Infinity, 30, 13);
						pxCounter(g, 0, TOTAL);
						return;
					}
					pxTag(g, 'SI ON ATTEND', true);
					pxCounter(g, 3, TOTAL);
					banner(g, `STADE ${stage(f)}`, 120);
				}}
				draw={(g, f) => {
					const k = ramp(f, AGGRAVE - 6, STADES + 10);
					const st: SectionState = {...SECTION_DEFAULT, f, comp: 0.6, lesion: 0.3 + 0.7 * k, lesionK: 1, rougeur: 1, pulse: true, o2: 0.2, phase: flowPhase(() => 0.3, f), leak: 0.4 + 0.6 * k, leakD: 0.86, leakR: 0.5 + 0.5 * k};
					if (f < OUT) {
						pxSacrumSection(g, st);
						return;
					}
					pxSkinTop(g, {...TOP, f});
					if (f < BACK) pxReveal(g, sectionLayer(st), 1 - ramp(f, OUT, BACK), TOP_SPOT.x, TOP_SPOT.y);
				}}
			/>
			<div style={{position: 'absolute', left: 90, top: 1740, opacity: interpolate(frame, [PROCH - 4, PROCH + 4, OUT - 2, OUT + 4], [0, 1, 1, 0], clamp), transform: `translateY(${interpolate(frame, [PROCH - 4, PROCH + 6], [30, 0], ease)}px)`}}>
				<NextCard>Les 4 stades de l'escarre</NextCard>
			</div>
			<Sfx name="whoosh" at={OUT} volume={0.2} />
		</AbsoluteFill>
	);
};
