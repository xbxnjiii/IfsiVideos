// « AVC — l'histoire de Michel » (format histoire, mystérieux) : fond nuit, cadre de scanner, une phrase clé à la
// fois. Accroche : la moitié de son sourire a disparu ; retour en arrière (le rasoir glisse), les mots en désordre,
// « ça va passer » ; révélation (une artère bouchée, 2 millions de neurones par minute) ; on regarde le corps :
// VITE ; pourquoi un seul côté ; fin. Fond, cadre, lueur : src/brand/night.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Brain, BRAIN_CLOT} from '../../brand/brain';
import {Phone, WallClock} from '../../brand/devices';
import {CamKey, ZoomCam} from '../../brand/episode';
import {Burst, Camera} from '../../brand/motion3';
import {Glow, NightBg, NightFlash, ScanFrame, Scramble} from '../../brand/night';
import {Patient, PatientProps} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/* ───────────── mise en page commune ───────────── */
const FR = {y: 640, h: 820, w: 936};
const P = {size: 420, x: 258, y: 104};
const pPt = (x: number, y: number) => ({x: P.x + (x * P.size) / 400, y: P.y + (y * P.size) / 400});
const FACE = pPt(200, 120);

/** Une phrase clé (blanc, mots accentués en rose), visible de `at` à `until`. */
const Line: React.FC<{at: number; until?: number; y?: number; text: string; size?: number}> = ({at: t0, until = 1e9, y = 250, text, size = 82}) => {
	const frame = useCurrentFrame();
	if (frame < t0 - 1 || frame > until + 8) return null;
	return (
		<div style={{position: 'absolute', left: 48, top: y, width: 984, opacity: interpolate(frame, [until, until + 6], [1, 0], clamp)}}>
			<Title at={t0} text={text} size={size} align="center" color={LPI.paper} accent={LPI.pink} brush={false} stagger={2} />
		</div>
	);
};

/** Le patient au trait, avec sa lueur, dans l'espace du cadre. */
const Michel: React.FC<PatientProps & {children?: React.ReactNode; tilt?: number}> = ({children, tilt = 0, ...p}) => (
	<div style={{position: 'absolute', left: P.x, top: P.y, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 90%'}}>
		<Glow>
			<Patient size={P.size} {...p} />
		</Glow>
		{children ? (
			<svg width={P.size} height={P.size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{children}
			</svg>
		) : null}
	</div>
);

/** Bulle de parole (fond clair). */
const Bubble: React.FC<{at: number; x: number; y: number; children: React.ReactNode; tail?: 'left' | 'right'}> = ({at: t0, x, y, children, tail = 'left'}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, padding: '18px 30px', borderRadius: 36, background: LPI.paper, border: `6px solid ${LPI.sky}`, boxShadow: SHADOW, transform: `scale(${popAt(frame, t0)})`, transformOrigin: tail === 'left' ? 'left bottom' : 'right bottom', fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>
			{children}
			<div style={{position: 'absolute', [tail]: 30, bottom: -24, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `24px solid ${LPI.sky}`}} />
		</div>
	);
};

const LETTERS = ['V', 'I', 'T', 'E'];
/** Les 4 lettres VITE : celle en cours en rose, les suivantes en retrait. */
const LetterRow: React.FC<{at: number; active?: number; y?: number; size?: number; stagger?: number; lit?: number}> = ({at: t0, active = -1, y = 236, size = 116, stagger = 3, lit = 0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', gap: size * 0.2}}>
			{LETTERS.map((l, i) => {
				const p = popAt(frame, t0 + i * stagger);
				const on = i === active || lit > 0;
				return (
					<div
						key={l}
						style={{
							width: size,
							height: size,
							borderRadius: size * 0.24,
							boxSizing: 'border-box',
							background: on ? LPI.pink : alpha(LPI.sky, active >= 0 && i < active ? 0.35 : 0.12),
							border: `5px solid ${on ? LPI.paper : alpha(LPI.sky, 0.4)}`,
							boxShadow: on ? `0 0 ${36 * (lit || 1)}px ${alpha(LPI.pink, 0.7)}` : 'none',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: size * 0.66,
							color: on ? N : LPI.paper,
							transform: `scale(${p * (i === active ? 1.08 : 1)})`,
						}}
					>
						{l}
					</div>
				);
			})}
		</div>
	);
};

/** Petite ligne « méthode FAST » (vue en cours, à l'écran seulement). */
const FastHint: React.FC<{at: number; active: number}> = ({at: t0, active}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const words = ['Face', 'Arm', 'Speech', 'Time'];
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', fontFamily: FONT.body, fontWeight: 800, fontSize: 28, letterSpacing: '0.08em', color: alpha(LPI.sky, 0.75), opacity: fadeIn(frame, t0)}}>
			EN COURS : VITE = FAST ·{' '}
			{words.map((w, i) => (
				<span key={w} style={{color: i === active ? LPI.pink : alpha(LPI.sky, 0.75)}}>
					{w}
					{i < 3 ? ' · ' : ''}
				</span>
			))}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « La moitié de son sourire vient de disparaître », gros plan du visage dans le miroir. Retour en arrière :
// il se rase, le rasoir glisse, le sourire retombe.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const CE = at('intro', 'ce');
	const MICHEL = at('intro', 'michel');
	const MIROIR = at('intro', 'miroir');
	const RASOIR = at('intro', 'rasoir');
	const GLISSE = at('intro', 'glissé');
	const keys: CamKey[] = [
		{at: -1, s: 2.3, x: FACE.x, y: FACE.y + 30, dur: 1},
		{at: CE - 2, s: 1.35, x: 468, y: 330, dur: 18},
		{at: GLISSE + 6, s: 2.2, x: FACE.x, y: FACE.y + 40, dur: 16},
	];
	const droop = frame < CE - 2 ? 1 : interpolate(frame, [GLISSE + 6, GLISSE + 22], [0, 1], ease);
	const fall = frame < GLISSE ? 0 : (frame - GLISSE) / 14;
	const razorY = fall * fall * 260;
	const handDrop = interpolate(frame, [GLISSE + 8, GLISSE + 24], [0, 1], ease);
	const shaving = frame >= CE - 2 && frame < GLISSE ? Math.sin(frame / 4) * 10 : 0;
	return (
		<AbsoluteFill>
			<NightBg />
			<Camera punches={[3, MICHEL + 1, GLISSE + 1]} shakes={[GLISSE + 8]} strength={0.03}>
				<Line at={-20} until={CE - 4} text={'La moitié de son *sourire*\nvient de *disparaître*.'} size={84} />
				<Line at={MICHEL - 2} text={'Ce matin, *Michel*, 64 ans.'} size={76} y={300} />
				<ScanFrame y={FR.y} h={FR.h} label={frame < CE - 2 || frame >= GLISSE ? '07 H 42 · SALLE DE BAINS' : '07 H 41 · UNE MINUTE AVANT'}>
					<ZoomCam keys={keys} w={FR.w} h={FR.h} radius={0}>
						{/* le miroir */}
						<svg width={FR.w} height={FR.h} style={{position: 'absolute', inset: 0}}>
							<ellipse cx={468} cy={360} rx={330} ry={420} fill={alpha(LPI.sky, 0.1)} stroke={alpha(LPI.paper, 0.55)} strokeWidth={12} />
							<path d="M250 120 L330 60 M230 210 L370 100" stroke={alpha(LPI.paper, 0.18)} strokeWidth={14} strokeLinecap="round" />
						</svg>
						<Michel breath={idle(frame)} droop={droop} mood={frame >= GLISSE + 6 ? 'mal' : 'calme'}>
							{frame >= CE - 2 ? (
								<g transform={`translate(0 ${handDrop * 220})`} opacity={1 - handDrop}>
									{/* bras qui vient d'en bas à droite : manche, avant-bras, main qui tient le rasoir */}
									<path d={`M430 560 L${356 + shaving * 0.15} ${380 + shaving * 0.5} L${282 + shaving * 0.3} ${196 + shaving}`} fill="none" stroke={N} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
									<path d={`M${356 + shaving * 0.15} ${380 + shaving * 0.5} L${282 + shaving * 0.3} ${196 + shaving}`} stroke={LPI.paper} strokeWidth={32} strokeLinecap="round" />
									<path d={`M${356 + shaving * 0.15} ${380 + shaving * 0.5} L${282 + shaving * 0.3} ${196 + shaving}`} stroke={alpha(LPI.pink, 0.3)} strokeWidth={32} strokeLinecap="round" />
									<path d={`M430 560 L${360 + shaving * 0.15} ${392 + shaving * 0.5}`} stroke={LPI.blue} strokeWidth={34} strokeLinecap="round" />
									<ellipse cx={278 + shaving * 0.3} cy={184 + shaving} rx={24} ry={28} fill={LPI.paper} stroke={N} strokeWidth={6} />
									<ellipse cx={278 + shaving * 0.3} cy={184 + shaving} rx={21} ry={25} fill={alpha(LPI.pink, 0.3)} />
								</g>
							) : null}
							{frame >= CE - 2 && frame < GLISSE + 40 ? (
								<g transform={`translate(${262 + shaving * 0.3} ${150 + shaving + razorY}) rotate(${-20 + fall * 160})`}>
									<rect x={-7} y={-6} width={14} height={66} rx={7} fill={LPI.blue} stroke={N} strokeWidth={4} />
									<rect x={-26} y={-20} width={52} height={18} rx={6} fill={LPI.sky} stroke={N} strokeWidth={4} />
								</g>
							) : null}
						</Michel>
					</ZoomCam>
				</ScanFrame>
				<Burst at={GLISSE + 8} x={540} y={1100} r={260} n={12} />
			</Camera>
			<NightFlash at={CE - 4} color={LPI.sky} max={0.35} />
			<Sfx name="heartbeat" at={0} volume={0.1} />
			<Sfx name="whoosh" at={CE - 4} volume={0.06} />
			<Sfx name="tick" at={MIROIR} volume={0.05} />
			<Sfx name="whoosh" at={RASOIR} volume={0.04} />
			<Sfx name="impact" at={GLISSE + 10} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · L'HISTOIRE ═══════════════════════════════ */
export const Histoire: React.FC = () => {
	const frame = useCurrentFrame();
	const APPELLE = at('histoire', "l'appelle");
	const REPOND = at('histoire', 'répondre');
	const MOTS = at('histoire', 'mots');
	const DESORDRE = at('histoire', 'désordre');
	const FATIGUE = at('histoire', 'fatigue');
	const ALLONGER = at('histoire', "s'allonger");
	const PASSER = at('histoire', 'passer');
	const keys: CamKey[] = [
		{at: -1, s: 1.25, x: 468, y: 330, dur: 1},
		{at: REPOND - 2, s: 1.6, x: 520, y: 260, dur: 16},
		{at: FATIGUE - 4, s: 1.15, x: 468, y: 380, dur: 18},
	];
	const lie = interpolate(frame, [ALLONGER, ALLONGER + 30], [0, 1], ease);
	return (
		<AbsoluteFill>
			<NightBg />
			<Camera punches={[APPELLE + 1, DESORDRE + 1, FATIGUE + 1, PASSER + 1]} shakes={[DESORDRE + 2]} strength={0.03}>
				<Line at={MOTS - 2} until={FATIGUE - 4} text={'Les mots sortent\n*dans* *le* *désordre*.'} />
				<Line at={FATIGUE - 2} until={PASSER - 4} text={'« Juste la *fatigue*. »'} y={300} />
				<Line at={PASSER - 2} text={'« Ça va *passer*. »'} y={300} />
				<ScanFrame y={FR.y} h={FR.h} label="07 H 43 · CUISINE">
					<ZoomCam keys={keys} w={FR.w} h={FR.h} radius={0}>
						<Michel breath={idle(frame)} droop={1} mood="mal" eyesClosed={0.85 * lie} tilt={-10 * lie} />
						{frame >= PASSER - 6 ? (
							<div style={{position: 'absolute', left: 660, top: 40, opacity: fadeIn(frame, PASSER - 6), transform: `scale(${0.8 + 0.2 * fadeIn(frame, PASSER - 6)})`}}>
								<Glow>
									<WallClock h={7} m={43} size={220} spin={interpolate(frame, [PASSER - 6, PASSER + 40], [0, 0.6], clamp)} />
								</Glow>
							</div>
						) : null}
					</ZoomCam>
					{frame < FATIGUE - 4 ? (
						<>
							<Bubble at={APPELLE} x={40} y={50}>
								Michel ? Ça va ?
							</Bubble>
							{frame >= REPOND ? (
								<Bubble at={REPOND} x={420} y={168}>
									<Scramble text="Oui… je vais bien" at={REPOND} mix={interpolate(frame, [MOTS, DESORDRE + 6], [0, 0.7], clamp)} size={40} color={N} />
								</Bubble>
							) : null}
						</>
					) : null}
				</ScanFrame>
			</Camera>
			<Sfx name="pop" at={APPELLE} volume={0.07} />
			<Sfx name="pop" at={REPOND} volume={0.07} />
			<Sfx name="buzz" at={DESORDRE} volume={0.05} dur={18} />
			{Array.from({length: 6}, (_, i) => (
				<Sfx key={i} name="tick" at={PASSER - 4 + i * 8} volume={0.05} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LA RÉVÉLATION ═══════════════════════════════ */
const BR = {size: 700, x: 118, y: 96};
const brPt = (x: number, y: number) => ({x: BR.x + (x * BR.size) / 500, y: BR.y + (y * BR.size) / 500});

/** Compteur qui roule (« − 1 900 000 »). */
const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ | |,/g, ' ');

export const Revele: React.FC = () => {
	const frame = useCurrentFrame();
	const SAUF = at('revele', 'sauf');
	const DANS = at('revele', 'dans');
	const CERVEAU = at('revele', 'cerveau');
	const ARTERE = at('revele', 'artère');
	const BOUCHER = at('revele', 'boucher');
	const AVC = at('revele', 'avc');
	const ACC = at('revele', 'accident');
	const VASC = at('revele', 'vasculaire');
	const CERE = at('revele', 'cérébral');
	const CHAQUE = at('revele', 'chaque');
	const DEUX = at('revele', 'deux');
	const NEURONES = at('revele', 'neurones');
	const clot = brPt(BRAIN_CLOT.x, BRAIN_CLOT.y);
	const head: CamKey[] = [
		{at: -1, s: 1.15, x: 468, y: 380, dur: 1},
		{at: DANS - 2, s: 3.2, x: FACE.x, y: FACE.y - 40, dur: 12},
	];
	const brain: CamKey[] = [
		{at: -1, s: 1.25, dur: 1},
		{at: CERVEAU, s: 1, dur: 14},
		{at: ARTERE - 2, s: 1.7, x: clot.x, y: clot.y, dur: 14},
		{at: CHAQUE - 4, s: 1, dur: 16},
	];
	const brainO = fadeIn(frame, CERVEAU - 4, 8);
	const count = interpolate(frame, [DEUX - 2, NEURONES + 14], [0, 1900000], ease);
	return (
		<AbsoluteFill>
			<NightBg glow={frame >= SAUF && frame < SAUF + 30 ? LPI.pink : LPI.blue} />
			<Camera punches={[SAUF + 1, BOUCHER + 1, AVC + 1, CHAQUE + 1, NEURONES + 1]} shakes={[SAUF + 2, BOUCHER + 2]} strength={0.04}>
				<Line at={SAUF} until={ARTERE - 4} text={'Sauf que ce n\'est *pas*\nla fatigue.'} />
				<Line at={ARTERE - 2} until={AVC - 4} text={'Une artère vient\nde se *boucher*.'} />
				<Line at={AVC - 2} until={CHAQUE - 4} text="C'est un *AVC*." size={110} y={232} />
				{frame >= ACC - 2 && frame < CHAQUE ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', gap: 22, opacity: interpolate(frame, [CHAQUE - 4, CHAQUE], [1, 0], clamp)}}>
						{[
							['A', 'ccident', ACC],
							['V', 'asculaire', VASC],
							['C', 'érébral', CERE],
						].map(([l, rest, t]) => (
							<span key={l as string} style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.paper, transform: `scale(${popAt(frame, t as number)})`, display: 'inline-block'}}>
								<span style={{color: LPI.pink}}>{l}</span>
								{rest}
							</span>
						))}
					</div>
				) : null}
				{frame >= CHAQUE - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center'}}>
						<Title at={CHAQUE - 2} text="Chaque *minute* :" size={72} align="center" color={LPI.paper} accent={LPI.pink} brush={false} stagger={2} />
						{frame >= DEUX - 2 ? (
							<div style={{marginTop: 6, fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: LPI.pink, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 30px ${alpha(LPI.pink, 0.5)}`}}>
								− {fmt(count)}
							</div>
						) : null}
						{frame >= NEURONES - 2 ? <div style={{marginTop: 8, fontFamily: FONT.body, fontWeight: 800, fontSize: 34, letterSpacing: '0.14em', color: LPI.sky}}>NEURONES QUI S'ÉTEIGNENT</div> : null}
					</div>
				) : null}
				<ScanFrame y={FR.y} h={FR.h} label={frame < CERVEAU ? '07 H 43 · CUISINE' : 'CERVEAU · VUE DE PROFIL'}>
					{brainO < 1 ? (
						<div style={{position: 'absolute', inset: 0, opacity: 1 - brainO}}>
							<ZoomCam keys={head} w={FR.w} h={FR.h} radius={0}>
								<Michel breath={idle(frame)} droop={1} mood="mal" eyesClosed={0.6} />
							</ZoomCam>
						</div>
					) : null}
					{brainO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: brainO}}>
							<ZoomCam keys={brain} w={FR.w} h={FR.h} radius={0}>
								<div style={{position: 'absolute', left: BR.x, top: BR.y}}>
									<Glow strength={0.8}>
										<Brain
											size={BR.size}
											clot={interpolate(frame, [BOUCHER - 4, BOUCHER + 6], [0, 1], clamp)}
											ischemia={interpolate(frame, [BOUCHER, BOUCHER + 30], [0, 1], ease)}
											dead={interpolate(frame, [CHAQUE, NEURONES + 30], [0, 0.75], ease)}
											alert={frame >= BOUCHER ? 0.6 : 0}
										/>
									</Glow>
								</div>
							</ZoomCam>
						</div>
					) : null}
				</ScanFrame>
				<Burst at={BOUCHER} x={540} y={1050} r={300} n={14} />
			</Camera>
			<NightFlash at={SAUF} />
			<NightFlash at={BOUCHER} max={0.3} />
			<Sfx name="impact" at={SAUF} volume={0.12} />
			<Sfx name="whoosh" at={DANS - 2} volume={0.07} />
			<Sfx name="impact" at={BOUCHER} volume={0.1} />
			<Sfx name="buzz" at={BOUCHER + 2} volume={0.05} dur={20} />
			<Sfx name="pop" at={ACC} volume={0.07} />
			<Sfx name="pop" at={VASC} volume={0.07} />
			<Sfx name="pop" at={CERE} volume={0.07} />
			<Sfx name="drumroll" at={DEUX - 2} volume={0.05} dur={28} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · ON REGARDE LE CORPS ═══════════════════════════════ */
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const PROB = at('signes', 'problème');
	const VOIT = at('signes', 'voit');
	const ALORS = at('signes', 'alors');
	const CORPS = at('signes', 'corps');
	const QUATRE = at('signes', 'quatre');
	const VITE = at('signes', 'vite');
	const hide = fadeIn(frame, VOIT - 4, 10);
	const bodyO = fadeIn(frame, ALORS - 2, 10);
	return (
		<AbsoluteFill>
			<NightBg />
			<Camera punches={[VOIT + 1, CORPS + 1, QUATRE + 1, VITE + 1]} shakes={[VITE + 2]} strength={0.04}>
				<Line at={PROB} until={ALORS - 4} text={'Le cerveau,\non ne le *voit* pas.'} />
				<Line at={ALORS - 2} until={QUATRE - 4} text={'Alors on regarde\nle *corps*.'} />
				<Line at={QUATRE - 2} text="Tout tient en *4* lettres :" size={64} y={250} />
				<LetterRow at={QUATRE + 4} stagger={5} y={360} lit={frame >= VITE ? 1 : 0} />
				<ScanFrame y={FR.y} h={FR.h} label={frame < ALORS ? 'CERVEAU · INVISIBLE' : 'OBSERVER LE CORPS'}>
					{bodyO < 1 ? (
						<div style={{position: 'absolute', inset: 0, opacity: 1 - bodyO}}>
							<div style={{position: 'absolute', left: BR.x, top: BR.y, opacity: 1 - 0.85 * hide, filter: `blur(${hide * 8}px)`}}>
								<Glow strength={0.8}>
									<Brain size={BR.size} clot={1} ischemia={1} dead={0.75} />
								</Glow>
							</div>
							{hide > 0 ? (
								<div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 300, color: LPI.sky, opacity: hide, transform: `scale(${popAt(frame, VOIT - 4)})`, textShadow: `0 0 40px ${alpha(LPI.blue, 0.8)}`}}>?</div>
							) : null}
						</div>
					) : null}
					{bodyO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: bodyO}}>
							<Michel breath={idle(frame)} droop={1} mood="mal" />
						</div>
					) : null}
				</ScanFrame>
				<Burst at={VITE} x={540} y={420} r={360} n={16} />
			</Camera>
			<NightFlash at={VITE} color={LPI.pink} max={0.3} />
			<Sfx name="whoosh" at={ALORS - 2} volume={0.06} />
			{LETTERS.map((l, i) => (
				<Sfx key={l} name="pop" at={QUATRE + 4 + i * 5} volume={0.08} />
			))}
			<Sfx name="impact" at={VITE} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · V, I, T ═══════════════════════════════ */
export const Vite: React.FC = () => {
	const frame = useCurrentFrame();
	const V = at('vite', 'v');
	const VIS = at('vite', 'visage');
	const SOUR = at('vite', 'sourire');
	const COTE = at('vite', 'côté');
	const TOMBE = at('vite', 'tombe');
	const I = at('vite', 'i');
	const INER = at('vite', 'inertie');
	const LEVEZ = at('vite', 'levez');
	const RETOMBE = at('vite', 'retombe');
	const T = at('vite', 't');
	const PAROLE = at('vite', 'parole');
	const REPETER = at('vite', 'répéter');
	const MELANG = at('vite', 'mélangent');
	const idx = frame >= T - 4 ? 2 : frame >= I - 4 ? 1 : 0;
	const keys: CamKey[] = [
		{at: VIS - 2, s: 2.2, x: FACE.x, y: FACE.y + 30, dur: 14},
		{at: I - 4, s: 1, dur: 14},
		{at: T - 4, s: 1.9, x: FACE.x + 60, y: FACE.y + 40, dur: 14},
	];
	const up = interpolate(frame, [LEVEZ, LEVEZ + 12, T - 6, T], [0, 85, 85, 0], ease);
	const drop = interpolate(frame, [RETOMBE, RETOMBE + 16, T - 6, T], [0, 65, 65, 0], ease);
	const shakeArm = frame >= RETOMBE && frame < RETOMBE + 16 ? Math.sin(frame * 2) * 3 : 0;
	const label = idx === 0 ? (frame >= TOMBE ? 'SOURIRE : UN CÔTÉ TOMBE' : 'VISAGE') : idx === 1 ? (frame >= RETOMBE ? "BRAS : L'UN RETOMBE" : 'BRAS') : frame >= MELANG ? 'PAROLE : LES MOTS SE MÉLANGENT' : 'PAROLE';
	return (
		<AbsoluteFill>
			<NightBg />
			<Camera punches={[V + 1, TOMBE + 1, I + 1, RETOMBE + 1, T + 1, MELANG + 1]} shakes={[TOMBE + 2, RETOMBE + 2]} strength={0.035}>
				<LetterRow at={-10} active={idx} y={226} size={104} stagger={0} />
				<Line at={V - 2} until={I - 6} text="*V*isage" size={96} y={360} />
				<Line at={I - 2} until={T - 6} text="*I*nertie" size={96} y={360} />
				<Line at={T - 2} text="*T*rouble de la parole" size={84} y={366} />
				{frame >= INER && frame < T - 6 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 476, textAlign: 'center', fontFamily: FONT.body, fontWeight: 800, fontSize: 36, color: LPI.sky, opacity: fadeIn(frame, INER) * interpolate(frame, [T - 10, T - 6], [1, 0], clamp)}}>
						(un bras ou une jambe ne répond plus)
					</div>
				) : null}
				<FastHint at={V + 6} active={idx} />
				<ScanFrame y={FR.y} h={FR.h} label={label}>
					<ZoomCam keys={keys} w={FR.w} h={FR.h} radius={0}>
						<Michel
							breath={idle(frame)}
							mood={frame >= SOUR && frame < I ? 'content' : 'calme'}
							droop={frame < I ? interpolate(frame, [COTE, TOMBE + 8], [0, 1], ease) : 1}
							armL={up}
							armR={up - drop + shakeArm}
						/>
					</ZoomCam>
					{frame >= REPETER - 2 ? (
						<Bubble at={REPETER - 2} x={300} y={56}>
							<Scramble text="Il fait beau aujourd'hui" at={REPETER - 2} mix={interpolate(frame, [PAROLE + 30, MELANG + 4], [0, 0.7], clamp)} size={40} color={N} />
						</Bubble>
					) : null}
				</ScanFrame>
			</Camera>
			<Sfx name="pop" at={V} volume={0.09} />
			<Sfx name="buzz" at={TOMBE} volume={0.05} dur={12} />
			<Sfx name="pop" at={I} volume={0.09} />
			<Sfx name="whoosh" at={LEVEZ} volume={0.05} />
			<Sfx name="buzz" at={RETOMBE} volume={0.05} dur={12} />
			<Sfx name="pop" at={T} volume={0.09} />
			<Sfx name="buzz" at={MELANG} volume={0.05} dur={16} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · E COMME EN URGENCE ═══════════════════════════════ */
export const Urgence: React.FC = () => {
	const frame = useCurrentFrame();
	const E = at('urgence', 'e');
	const URG = at('urgence', 'urgence');
	const APP = at('urgence', 'appelez');
	const Q15 = at('urgence', '15');
	const MEME = at('urgence', 'même');
	const NOTEZ = at('urgence', 'notez');
	const HEURE = at('urgence', "l'heure");
	const DECIDE = at('urgence', 'décidera');
	const keys: CamKey[] = [
		{at: APP - 4, s: 1.45, x: 270, y: 380, dur: 14},
		{at: NOTEZ - 4, s: 1.45, x: 660, y: 340, dur: 16},
		{at: DECIDE + 14, s: 1, dur: 16},
	];
	return (
		<AbsoluteFill>
			<NightBg glow={frame >= URG && frame < URG + 24 ? LPI.pink : LPI.blue} />
			<Camera punches={[E + 1, URG + 1, Q15 + 1, MEME + 1, HEURE + 1]} shakes={[URG + 2]} strength={0.04}>
				<LetterRow at={-10} active={3} y={226} size={104} stagger={0} />
				<Line at={E - 2} text="*E*n urgence" size={96} y={360} />
				<FastHint at={E + 6} active={3} />
				{frame >= MEME - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 476, textAlign: 'center', fontFamily: FONT.body, fontWeight: 800, fontSize: 36, color: LPI.sky, opacity: fadeIn(frame, MEME - 2)}}>
						même si les signes disparaissent
					</div>
				) : null}
				<ScanFrame y={FR.y} h={FR.h} label={frame >= HEURE ? "NOTEZ L'HEURE : 07 H 42" : frame >= Q15 ? 'APPELEZ LE 15' : 'APPELER'}>
					<ZoomCam keys={keys} w={FR.w} h={FR.h} radius={0}>
						<div style={{position: 'absolute', left: 140, top: 150}}>
							<Glow>
								<Phone digits={frame >= Q15 ? '15' : frame >= Q15 - 5 ? '1' : ''} ring={interpolate(frame, [Q15 + 6, Q15 + 12], [0, 1], clamp)} size={250} />
							</Glow>
						</div>
						<div style={{position: 'absolute', left: 540, top: 200, opacity: fadeIn(frame, NOTEZ - 6), transform: `scale(${0.8 + 0.2 * fadeIn(frame, NOTEZ - 6)})`}}>
							<Glow color={frame >= HEURE ? LPI.pink : LPI.sky}>
								<WallClock h={7} m={42} size={260} />
							</Glow>
						</div>
					</ZoomCam>
					{frame >= DECIDE - 2 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
							<div style={{transform: `scale(${popAt(frame, DECIDE - 2)})`, padding: '10px 28px', borderRadius: 999, background: LPI.pink, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, whiteSpace: 'nowrap'}}>
								l'heure guide le traitement
							</div>
						</div>
					) : null}
				</ScanFrame>
			</Camera>
			<NightFlash at={URG} max={0.3} />
			<Sfx name="impact" at={URG} volume={0.09} />
			<Sfx name="tick" at={Q15 - 5} volume={0.08} />
			<Sfx name="tick" at={Q15} volume={0.08} />
			<Sfx name="ding" at={Q15 + 8} volume={0.07} />
			<Sfx name="tick" at={HEURE} volume={0.08} />
			<Sfx name="pop" at={DECIDE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · POURQUOI D'UN SEUL CÔTÉ ═══════════════════════════════ */
// Chaque moitié du cerveau commande l'autre moitié du corps : flèches croisées ; une zone s'éteint, la moitié
// opposée du corps la suit (visage qui tombe du même côté que dans l'histoire).
export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const POURQ = at('pourquoi', 'pourquoi');
	const CHAQUE = at('pourquoi', 'chaque');
	const MOITIE = at('pourquoi', 'moitié');
	const COMMANDE = at('pourquoi', 'commande');
	const AUTRE = at('pourquoi', "l'autre");
	const UNE = at('pourquoi', 'une');
	const ETEINT = at('pourquoi', "s'éteint");
	const TOUTE = at('pourquoi', 'toute');
	const keys: CamKey[] = [
		{at: -1, s: 2.4, x: pPt(200, 70).x, y: pPt(200, 70).y + 40, dur: 1},
		{at: COMMANDE - 4, s: 1.7, x: 468, y: 310, dur: 18},
	];
	const halves = fadeIn(frame, MOITIE - 2, 10);
	const cross = interpolate(frame, [AUTRE - 4, AUTRE + 14], [0, 1], ease);
	const off = fadeIn(frame, ETEINT - 2, 12);
	const follow = fadeIn(frame, TOUTE - 2, 16);
	const pulse = 0.6 + 0.4 * Math.sin(frame / 4);
	return (
		<AbsoluteFill>
			<NightBg />
			<Camera punches={[POURQ + 1, MOITIE + 1, AUTRE + 1, ETEINT + 1, TOUTE + 1]} shakes={[ETEINT + 2]} strength={0.035}>
				<Line at={POURQ - 2} until={CHAQUE - 4} text={'Pourquoi\nd\'un *seul* côté ?'} />
				<Line at={CHAQUE - 2} until={UNE - 4} text={'Chaque moitié du cerveau\ncommande *l\'autre* moitié.'} size={68} />
				<Line at={UNE - 2} text={'Une zone s\'éteint…\nune *moitié* du corps suit.'} size={68} />
				<ScanFrame y={FR.y} h={FR.h} label={frame >= COMMANDE ? 'COMMANDES CROISÉES' : 'CERVEAU · VUE DE FACE'}>
					<ZoomCam keys={keys} w={FR.w} h={FR.h} radius={0}>
						<Michel breath={idle(frame)} brain={1} droop={follow} mood={follow > 0.5 ? 'mal' : 'calme'} pale={0.2 * follow}>
							{/* moitiés du corps (chacune de la couleur de l'hémisphère qui la commande) */}
							<rect x={0} y={170} width={200} height={400} fill={alpha(LPI.pink, 0.16 * cross)} />
							<rect x={200} y={170} width={200} height={400} fill={alpha(LPI.sky, 0.16 * cross * (1 - follow))} />
							<rect x={200} y={0} width={200} height={570} fill={alpha(N, 0.38 * follow)} />
							{/* hémisphères */}
							<ellipse cx={172} cy={66} rx={30} ry={34} fill={alpha(LPI.sky, 0.55 * halves)} />
							<ellipse cx={228} cy={66} rx={30} ry={34} fill={alpha(LPI.pink, 0.55 * halves)} />
							<ellipse cx={172} cy={66} rx={30} ry={34} fill={alpha(N, 0.7 * off)} stroke={LPI.pink} strokeWidth={5 * off} strokeDasharray="8 6" opacity={off ? 1 : 0} />
							{off > 0 ? <circle cx={172} cy={66} r={46 + 6 * pulse} fill="none" stroke={LPI.pink} strokeWidth={4} opacity={off * pulse} /> : null}
							{/* flèches croisées */}
							<path d="M172 96 C180 190 300 220 312 330" fill="none" stroke={LPI.sky} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${cross} 1`} />
							<path d="M228 96 C220 190 100 220 88 330" fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${cross} 1`} />
							{cross > 0.95 ? (
								<>
									<path d="M296 316 L312 338 L326 314" fill="none" stroke={LPI.sky} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
									<path d="M74 314 L88 338 L104 316" fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
								</>
							) : null}
						</Michel>
					</ZoomCam>
				</ScanFrame>
			</Camera>
			<NightFlash at={ETEINT} max={0.25} />
			<Sfx name="whoosh" at={COMMANDE - 4} volume={0.06} />
			<Sfx name="whoosh" at={AUTRE} volume={0.06} />
			<Sfx name="buzz" at={ETEINT} volume={0.05} dur={18} />
			<Sfx name="impact" at={TOUTE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const MICHEL = at('fin', 'michel');
	const SOIGNE = at('fin', 'soigné');
	const QUATRE = at('fin', 'quatre');
	// la caméra s'approche lentement du sourire retrouvé, puis recule quand VITE s'allume
	const keys: CamKey[] = [
		{at: SOIGNE - 4, s: 1.9, x: FACE.x, y: FACE.y + 50, dur: 60},
		{at: QUATRE - 4, s: 1.2, x: 468, y: 360, dur: 18},
	];
	return (
		<AbsoluteFill>
			<NightBg />
			<Camera punches={[SOIGNE + 1, QUATRE + 1]} strength={0.03}>
				<Line at={MICHEL - 2} until={QUATRE - 6} text={'Michel a été\n*soigné* à temps.'} />
				<Line at={QUATRE - 4} text={'Grâce à *4* lettres.'} y={250} />
				<LetterRow at={QUATRE} stagger={4} y={380} size={120} lit={1} />
				<ScanFrame y={FR.y} h={FR.h} label="MICHEL · SOIGNÉ À TEMPS" tone={LPI.pink}>
					<ZoomCam keys={keys} w={FR.w} h={FR.h} radius={0}>
						<Michel breath={idle(frame)} mood="content" />
					</ZoomCam>
				</ScanFrame>
				<Burst at={QUATRE + 12} x={540} y={440} r={380} n={18} />
			</Camera>
			<Sfx name="ding" at={SOIGNE} volume={0.08} />
			{LETTERS.map((l, i) => (
				<Sfx key={l} name="pop" at={QUATRE + i * 4} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};
