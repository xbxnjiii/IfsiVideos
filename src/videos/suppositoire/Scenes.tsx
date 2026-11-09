// « Comment mettre un suppositoire ? » — 1er essai du format COURT (info + humour, ≈ 40 s), avec les nouveautés 2026 :
// gros texte plein cadre (une idée par plan), fonds en aplats francs (écran coupé en deux pour le « match »), flou de
// mouvement (`Blur` + `Live` de src/brand/bold.tsx : les positions sont calculées DANS le calque flou) sur ce qui
// bouge vite, voix ElevenLabs (Laura).
// Accroche « le match » : « Le suppositoire : côté pointu… ou côté plat ? Sur internet, c'est la guerre ! » (image 0 :
// ÉQUIPE POINTE vs ÉQUIPE PLAT) → l'idée reçue (une seule petite étude de 1991, jamais confirmée) → on suit la notice :
// la plupart disent « par la pointe » (le suppositoire = une fusée) → le bon geste en 5 cartes → « décollage réussi ! ».
// Faits vérifiés : Abd-el-Maeboud et al., The Lancet 1991 (côté plat), jamais confirmée ; fabricants : la pointe (seule
// méthode approuvée et utilisée dans les essais, revue Bradshaw & Price 2007) ; quelques notices disent l'inverse
// (d'où « on suit la notice » et « la plupart »). Briques : src/brand/suppo.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Blur, Live} from '../../brand/bold';
import {Pill} from '../../brand/episode';
import {Sparkles} from '../../brand/hands';
import {Stamp, Strike} from '../../brand/kit';
import {Burst, Camera, Confetti, LiveBackground} from '../../brand/motion3';
import {Hand} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {Comment, Notice, SideLying, Sphincter, Squeeze, Suppo} from '../../brand/suppo';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; max?: number; color?: string}> = ({at: t0, max = 0.4, color = LPI.pink}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 14], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: alpha(color, o)}} />;
};

/** Grand titre plein cadre (fondu de sortie à `to`). */
const Big: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; center?: boolean}> = ({from, to = 1e9, text, size = 120, y = 200, center = false}) => {
	const frame = useCurrentFrame();
	if (frame < from - 2 || frame >= to + 8) return null;
	return (
		<div style={{position: 'absolute', left: 60, top: y, width: 960, opacity: interpolate(frame, [to, to + 8], [1, 0], clamp), textAlign: center ? 'center' : 'left', display: 'flex', justifyContent: center ? 'center' : 'flex-start'}}>
			<Title at={from} text={text} size={size} stagger={3} />
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE « LE MATCH » ═══════════════════════════════ */
// Image 0 : écran coupé en diagonale, ÉQUIPE POINTE (bleu clair) contre ÉQUIPE PLAT (rose), « VS », le suppositoire au
// centre et « Côté pointu… ou côté plat ? ». Il se tourne vers chaque équipe au mot (flou de mouvement), puis les
// commentaires d'internet pleuvent ; « c'est la guerre ! » : flash, secousse.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const POINTU = at('intro', 'pointu…');
	const PLAT = at('intro', 'plat');
	const INTER = at('intro', 'internet');
	const GUERRE = at('intro', 'guerre');
	// le suppositoire regarde d'abord la pointe (à droite = équipe pointe), puis se retourne vers l'équipe plat
	const comments = [
		{name: 'infirmiere_2a', text: 'C’EST LA POINTE, point.', tone: LPI.sky, x: 60, y: 470, rot: -3},
		{name: 'tonton_bricolo', text: 'Côté plat, évidemment\u00a0!', tone: LPI.pink, x: 160, y: 660, rot: 2},
		{name: 'etudiant_ifsi', text: 'J’ai jamais su…', tone: LPI.paper, x: 60, y: 850, rot: -2},
		{name: 'mamie_josette', text: 'De mon temps, c’était le plat\u00a0!', tone: LPI.pink, x: 160, y: 1040, rot: 3},
		{name: 'pharma_du_coin', text: 'Lisez la notice, bon sang\u00a0!', tone: LPI.sky, x: 60, y: 1230, rot: -2},
	];
	const matchOut = 1 - fadeIn(frame, INTER - 6, 8);
	return (
		<AbsoluteFill>
			{/* l'écran coupé en deux */}
			<AbsoluteFill style={{background: LPI.pink}} />
			<AbsoluteFill style={{background: LPI.sky, clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 62%)'}} />
			<Camera punches={[POINTU + 1, PLAT + 1, INTER + 1]} shakes={[GUERRE + 1]} strength={0.04}>
				{/* étiquettes des équipes (lisibles dès l'image 0) */}
				<div style={{position: 'absolute', left: 60, top: 520, opacity: matchOut, transform: `scale(${1 + 0.12 * Math.exp(-Math.max(0, frame - POINTU) / 4) * (frame >= POINTU ? 1 : 0)})`, transformOrigin: 'left center'}}>
					<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 34, letterSpacing: '0.16em', color: alpha(N, 0.75)}}>ÉQUIPE</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 104, color: N, lineHeight: 0.95}}>POINTE</div>
				</div>
				<div style={{position: 'absolute', right: 60, top: 1290, textAlign: 'right', opacity: matchOut, transform: `scale(${1 + 0.12 * Math.exp(-Math.max(0, frame - PLAT) / 4) * (frame >= PLAT ? 1 : 0)})`, transformOrigin: 'right center'}}>
					<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 34, letterSpacing: '0.16em', color: alpha(N, 0.75)}}>ÉQUIPE</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 104, color: N, lineHeight: 0.95}}>PLAT</div>
				</div>
				{/* VS */}
				<div style={{position: 'absolute', left: 540 - 85, top: 820 - 85, width: 170, height: 170, borderRadius: 85, opacity: matchOut, background: N, border: `8px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.paper, transform: `rotate(${-8 + Math.sin(frame / 7) * 3}deg) scale(${1 + 0.15 * Math.exp(-Math.max(0, frame - PLAT) / 4) * (frame >= PLAT ? 1 : 0)})`}}>VS</div>
				{/* le suppositoire, qui se retourne (flou de mouvement) */}
				<Blur on={frame >= PLAT - 8 && frame <= PLAT + 4} shutter={200}>
					<Live
						render={(f) => (
							<div style={{position: 'absolute', left: 540 - 350, top: 1060 - 175, opacity: 1 - fadeIn(f, INTER - 6, 8)}}>
								<div style={{transform: `scaleX(${interpolate(f, [PLAT - 6, PLAT + 2], [1, -1], ease)}) rotate(${Math.sin(f / 5) * 4}deg)`, transformOrigin: '350px 175px', width: 700}}>
									<Suppo width={700} mood={f >= PLAT ? 'inquiet' : 'content'} />
								</div>
							</div>
						)}
					/>
				</Blur>
				{/* internet s'enflamme */}
				{comments.map((c, i) => {
					const t0 = INTER - 4 + i * 5;
					if (frame < t0) return null;
					const s = popAt(frame, t0);
					return (
						<div key={c.name} style={{position: 'absolute', left: c.x, top: c.y, transform: `translateY(${(1 - Math.min(1, (frame - t0) / 8)) * 120}px) scale(${s}) rotate(${c.rot}deg)`, transformOrigin: 'left center'}}>
							<Comment name={c.name} text={c.text} tone={c.tone} width={860} font={46} />
						</div>
					);
				})}
				{/* titre */}
				<Big from={-60} to={INTER - 6} text={'Côté *pointu*…\nou côté *plat* ?'} size={112} y={140} />
				<Big from={INTER - 2} text={"C'est la *guerre* !"} size={124} y={170} />
				<Burst at={GUERRE} x={540} y={300} r={420} n={18} />
			</Camera>
			<Flash at={GUERRE} max={0.35} />
			<Sfx name="whoosh" at={POINTU - 2} volume={0.07} />
			<Sfx name="whoosh" at={PLAT - 6} volume={0.08} />
			<Sfx name="impact" at={PLAT} volume={0.09} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={i} name="pop" at={INTER - 4 + i * 5} volume={0.08} />
			))}
			<Sfx name="impact" at={GUERRE} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'IDÉE REÇUE ═══════════════════════════════ */
// Fond rose (l'équipe plat) : « il remonte tout seul ! » (bulle + éclats « magiques ») ; « Sauf que » : arrêt net ;
// une toute petite étude « 1991 » sous la loupe, « 1 seule petite étude », tampon « JAMAIS CONFIRMÉE » ; « idée reçue » :
// grand tampon plein écran.
export const Mythe: React.FC = () => {
	const frame = useCurrentFrame();
	const JURE = at('mythe', 'jure');
	const REMONTE = at('mythe', 'remonte');
	const SAUF = at('mythe', 'sauf');
	const VIENT = at('mythe', 'vient');
	const PETITE = at('mythe', 'petite');
	const Y1991 = at('mythe', '1991');
	const JAMAIS = at('mythe', 'jamais');
	const IDEE = at('mythe', 'idée');
	const part1 = 1 - fadeIn(frame, SAUF - 2, 6);
	// le suppositoire part « côté plat devant » (vers la gauche)… et remonte tout seul, comme par magie
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.55)}} />
			<LiveBackground deco={false} />
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.35)}} />
			<Camera punches={[JURE + 1, SAUF + 1, Y1991 + 1, JAMAIS + 1]} shakes={[IDEE + 2]} strength={0.04}>
				{part1 > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: part1}}>
						<Big from={2} to={SAUF - 4} text={"L'équipe *plat* :"} size={110} y={180} />
						{frame >= JURE - 4 ? (
							<div style={{position: 'absolute', left: 80, top: 430, transform: `scale(${popAt(frame, JURE - 4)}) rotate(-3deg)`, transformOrigin: 'left bottom'}}>
								<div style={{padding: '30px 44px', borderRadius: 48, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 86, color: N, lineHeight: 1.05}}>
									« Il remonte
									<br />
									<span style={{color: LPI.pink, WebkitTextStroke: `2px ${N}`}}>tout seul</span> ! »
								</div>
							</div>
						) : null}
						<Blur on={frame >= REMONTE - 5 && frame <= SAUF + 1} shutter={220}>
							<Live
								render={(f) => {
									const d = interpolate(f, [REMONTE - 4, SAUF], [0, -1], ease);
									return (
										<div style={{position: 'absolute', left: 240 + d * 120, top: 980 - d * 160}}>
											<div style={{transform: `scaleX(-1) rotate(${-20 * d}deg)`, transformOrigin: '300px 150px', width: 600}}>
												<Suppo width={600} mood="fier" />
											</div>
										</div>
									);
								}}
							/>
						</Blur>
						<Sparkles at={REMONTE} x={540} y={1060} r={300} n={9} />
					</div>
				) : null}
				{/* une seule petite étude de 1991 */}
				{frame >= SAUF - 4 ? (
					<>
						<Big from={SAUF - 2} to={IDEE - 6} text={'*1* seule petite *étude*'} size={100} y={200} />
						{frame >= VIENT - 4 ? (
							<div style={{position: 'absolute', left: 540 - 220, top: 470, transform: `scale(${popAt(frame, VIENT - 4) * interpolate(frame, [PETITE - 2, PETITE + 8], [1, 0.8], ease)}) rotate(-4deg)`, opacity: 1 - fadeIn(frame, IDEE - 6, 6)}}>
								<div style={{width: 440, height: 580, boxSizing: 'border-box', borderRadius: 22, background: LPI.paper, border: `8px solid ${N}`, boxShadow: SHADOW, padding: 38}}>
									<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 34, letterSpacing: '0.14em', color: alpha(N, 0.6)}}>ÉTUDE</div>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N, lineHeight: 1, opacity: fadeIn(frame, Y1991 - 2, 4)}}>1991</div>
									{[0, 1, 2, 3, 4, 5].map((i) => (
										<div key={i} style={{marginTop: 24, height: 18, borderRadius: 7, width: i % 2 ? '70%' : '100%', background: alpha(N, 0.15)}} />
									))}
								</div>
							</div>
						) : null}
						<Stamp at={JAMAIS} x={540} y={960} text="JAMAIS CONFIRMÉE" size={72} rot={-8} out={IDEE - 6} />
					</>
				) : null}
				{/* idée reçue */}
				{frame >= IDEE - 4 ? (
					<>
						<div style={{position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center', opacity: fadeIn(frame, IDEE, 6)}}>
							<div style={{position: 'relative', fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: alpha(N, 0.75)}}>
								« côté plat d'abord »
								<Strike at={IDEE + 8} width={760} rot={-6} />
							</div>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
							<Stamp at={IDEE - 2} x={540} y={170} text="IDÉE REÇUE !" size={120} rot={-6} />
						</div>
					</>
				) : null}
			</Camera>
			<Flash at={IDEE - 2} max={0.3} />
			<Sfx name="pop" at={JURE - 4} volume={0.08} />
			<Sfx name="hop" at={REMONTE} volume={0.08} />
			<Sfx name="buzz" at={SAUF} volume={0.06} dur={12} />
			<Sfx name="pop" at={VIENT - 4} volume={0.08} />
			<Sfx name="stamp" at={JAMAIS} volume={0.1} />
			<Sfx name="stamp" at={IDEE - 2} volume={0.13} />
			<Sfx name="whoosh" at={IDEE + 6} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA VÉRITÉ : ON SUIT LA NOTICE ═══════════════════════════════ */
// « Alors, on fait quoi ? » ; la notice se déplie, « par la pointe » se surligne ; « comme une fusée » : le
// suppositoire se redresse, ailerons + flamme, et décolle (flou de mouvement) ; « LA POINTE DEVANT ! ».
export const Verite: React.FC = () => {
	const frame = useCurrentFrame();
	const QUOI = at('verite', 'quoi');
	const SUIT = at('verite', 'suit');
	const NOTICE = at('verite', 'notice');
	const PLUPART = at('verite', 'plupart');
	const POINTE = at('verite', 'pointe');
	const SUPPO = at('verite', 'suppositoire');
	const FUSEE = at('verite', 'fusée');
	const POINTE2 = at('verite', 'pointe', 2);
	const DEVANT = at('verite', 'devant');
	const noticeOut = fadeIn(frame, SUPPO - 6, 8);
	const rocket = fadeIn(frame, FUSEE - 4, 10);
	const rise = interpolate(frame, [POINTE2 - 4, DEVANT + 16], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.sky, 0.55)}} />
			<LiveBackground deco={false} />
			<AbsoluteFill style={{background: alpha(LPI.sky, 0.35)}} />
			<Camera punches={[QUOI + 1, NOTICE + 1, POINTE + 1, FUSEE + 1]} shakes={[POINTE2 + 2]} strength={0.04}>
				<Big from={2} to={SUIT - 4} text={'Alors, on fait *quoi*\u00a0?'} size={110} y={200} />
				{/* le suppositoire hésite : il se tourne d'un côté, de l'autre… */}
				{frame < SUIT + 4 ? (
					<Blur shutter={200}>
						<Live
							render={(f) => (
								<div style={{position: 'absolute', left: 540 - 300, top: 860 - 150, opacity: 1 - fadeIn(f, SUIT - 4, 6)}}>
									<div style={{transform: `scaleX(${Math.cos(f * 0.22)}) scale(${popAt(f, 0)})`, transformOrigin: '300px 150px', width: 600}}>
										<Suppo width={600} mood="inquiet" />
									</div>
								</div>
							)}
						/>
					</Blur>
				) : null}
				{frame >= QUOI - 2 && frame < SUIT + 4 ? (
					<div style={{position: 'absolute', left: 780, top: 520, fontFamily: FONT.title, fontWeight: 900, fontSize: 200, color: LPI.pink, WebkitTextStroke: `6px ${N}`, transform: `scale(${popAt(frame, QUOI - 2)}) rotate(${12 + Math.sin(frame / 4) * 6}deg)`, opacity: 1 - fadeIn(frame, SUIT - 4, 6)}}>?</div>
				) : null}
				<Big from={SUIT - 2} to={SUPPO - 6} text={'On suit la *notice*'} size={110} y={200} />
				{frame >= SUIT - 4 && noticeOut < 1 ? (
					<div style={{position: 'absolute', left: 540 - 280, top: 440, transform: `scale(${popAt(frame, SUIT - 4)}) rotate(${-3 + 3 * fadeIn(frame, NOTICE, 10)}deg)`, opacity: 1 - noticeOut}}>
						<Notice width={560} highlight={interpolate(frame, [POINTE - 6, POINTE + 6], [0, 1], ease)} line="insérer par la pointe" />
					</div>
				) : null}
				{frame >= PLUPART - 2 && noticeOut < 1 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1190, display: 'flex', justifyContent: 'center', opacity: 1 - noticeOut}}>
						<Pill at={PLUPART - 2} size={52} color={LPI.paper}>
							la plupart disent :
						</Pill>
					</div>
				) : null}
				{frame >= POINTE - 4 && noticeOut < 1 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center', opacity: 1 - noticeOut}}>
						<Pill at={POINTE - 4} size={72} color={LPI.blue}>
							par la pointe !
						</Pill>
					</div>
				) : null}
				{/* la fusée */}
				{frame >= SUPPO - 6 ? (
					<>
						<Big from={SUPPO - 4} to={POINTE2 - 6} text={'Comme une *fusée*'} size={120} y={200} />
						<Big from={POINTE2 - 2} text={'La *pointe* devant !'} size={124} y={200} />
						<Blur on={(frame >= SUPPO - 6 && frame <= FUSEE + 6) || rise > 0} shutter={240} samples={8}>
							<Live
								render={(f) => {
									const r = interpolate(f, [POINTE2 - 4, DEVANT + 16], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
									const k = fadeIn(f, FUSEE - 4, 10);
									return (
										<div style={{position: 'absolute', left: 800 - 300, top: 1000 - r * 1300, opacity: fadeIn(f, SUPPO - 6, 8)}}>
											<div style={{transform: `rotate(${interpolate(f, [SUPPO - 4, FUSEE + 4], [0, -90], ease) + Math.sin(f * 1.4) * 1.5 * k}deg) scale(${popAt(f, SUPPO - 6)})`, transformOrigin: '300px 150px', width: 600}}>
												<Suppo width={600} rocket={k} mood={r > 0.05 ? 'fier' : 'content'} />
											</div>
										</div>
									);
								}}
							/>
						</Blur>
						{/* fumée au décollage */}
						{rise > 0
							? Array.from({length: 7}, (_, i) => {
									const t = Math.min(1, Math.max(0, (frame - (POINTE2 - 4) - i * 2) / 24));
									return <div key={i} style={{position: 'absolute', left: 800 - 50 + (i - 3) * 70 * t, top: 1460 + 20 * t, width: 100 + 60 * t, height: 100 + 60 * t, borderRadius: '50%', background: alpha(LPI.paper, 0.85 * (1 - t)), border: `5px solid ${alpha(N, 0.25 * (1 - t))}`}} />;
								})
							: null}
					</>
				) : null}
			</Camera>
			<Sfx name="pop" at={SUIT - 4} volume={0.08} />
			<Sfx name="tick" at={POINTE - 6} volume={0.08} />
			<Sfx name="ding" at={POINTE} volume={0.09} />
			<Sfx name="pop" at={SUPPO - 6} volume={0.08} />
			<Sfx name="puff" at={FUSEE} volume={0.25} />
			<Sfx name="whoosh" at={POINTE2 - 4} volume={0.12} />
			<Sfx name="impact" at={POINTE2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON GESTE ═══════════════════════════════ */
// 5 cartes qui s'empilent au mot (numéro, dessin, texte court) : mains + gants · côté gauche, jambe du dessus pliée ·
// un peu d'eau sur la pointe · on pousse doucement, juste après le sphincter (= le muscle qui ferme l'anus) · on serre
// les fesses quelques minutes.
const StepCard: React.FC<{at: number; n: number; y: number; title: React.ReactNode; sub?: React.ReactNode; subAt?: number; children: React.ReactNode; dim?: number}> = ({at: t0, n, y, title, sub, subAt = 1e9, children, dim = 0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = Math.min(1, (frame - t0) / 9);
	return (
		<div style={{position: 'absolute', left: 50, top: y, width: 980, height: 204, boxSizing: 'border-box', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', transform: `translateX(${(1 - Easing.out(Easing.cubic)(k)) * 400}px) scale(${popAt(frame, t0)})`, opacity: (0.4 + 0.6 * k) * (1 - 0.35 * dim)}}>
			<div style={{width: 76, height: 76, flexShrink: 0, borderRadius: 38, background: LPI.pink, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N}}>{n}</div>
			<div style={{width: 240, height: 184, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
			<div style={{flex: 1}}>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N, lineHeight: 1.04}}>{title}</div>
				{sub && frame >= subAt ? <div style={{marginTop: 6, fontFamily: FONT.body, fontWeight: 800, fontSize: 32, lineHeight: 1.12, color: alpha(N, 0.78), opacity: fadeIn(frame, subAt, 6)}}>{sub}</div> : null}
			</div>
		</div>
	);
};

export const Geste: React.FC = () => {
	const frame = useCurrentFrame();
	const MAINS = at('geste', 'mains');
	const GANTS = at('geste', 'gants');
	const PATIENT = at('geste', 'patient');
	const GAUCHE = at('geste', 'gauche');
	const PLIEE = at('geste', 'pliée');
	const EAU = at('geste', "d'eau");
	const POUSSE = at('geste', 'pousse');
	const SPH = at('geste', 'sphincter…');
	const SERRE = at('geste', 'serre');
	const FESSES = at('geste', 'fesses');
	const MIN = at('geste', 'minutes');
	const step = frame < PATIENT - 4 ? 0 : frame < EAU - 4 ? 1 : frame < POUSSE - 4 ? 2 : frame < SERRE - 4 ? 3 : 4;
	const dimFor = (i: number) => (step > i ? 1 : 0);
	const pass = interpolate(frame, [POUSSE - 2, SPH + 6], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[MAINS + 1, PATIENT + 1, EAU + 1, POUSSE + 1, FESSES + 1]} strength={0.03}>
				<Big from={-4} text={'Le bon *geste*'} size={110} y={150} />
				<StepCard at={MAINS - 4} n={1} y={330} title="Mains lavées + gants" dim={dimFor(0)}>
					<div style={{display: 'flex', gap: 4}}>
						<Hand size={150} gloved={fadeIn(frame, GANTS - 2, 6)} />
					</div>
				</StepCard>
				<StepCard at={PATIENT - 4} n={2} y={546} title="Sur le côté gauche" sub="jambe du dessus pliée" subAt={PLIEE - 6} dim={dimFor(1)}>
					<SideLying width={240} bend={interpolate(frame, [GAUCHE, PLIEE + 4], [0, 1], ease)} />
				</StepCard>
				<StepCard at={EAU - 4} n={3} y={762} title="Un peu d'eau sur la pointe" dim={dimFor(2)}>
					<Suppo width={240} drop={fadeIn(frame, EAU, 8)} face={false} />
				</StepCard>
				<StepCard at={POUSSE - 4} n={4} y={978} title="On pousse doucement" sub="juste après le sphincter (le muscle qui ferme l’anus)" subAt={SPH - 4} dim={dimFor(3)}>
					<div style={{position: 'relative', width: 240, height: 184}}>
						<div style={{position: 'absolute', left: 90, top: 2}}>
							<Sphincter width={150} open={Math.sin(Math.min(1, pass) * Math.PI) * 0.6} />
						</div>
						<div style={{position: 'absolute', left: -60 + 175 * pass, top: 62}}>
							<Suppo width={150} face={false} />
						</div>
					</div>
				</StepCard>
				<StepCard at={SERRE - 4} n={5} y={1194} title="On serre les fesses" sub="quelques minutes" subAt={MIN - 4}>
					<Squeeze width={220} squeeze={fadeIn(frame, FESSES - 4, 8)} />
				</StepCard>
			</Camera>
			{[MAINS, PATIENT, EAU, POUSSE, SERRE].map((t) => (
				<Sfx key={t} name="pop" at={t - 4} volume={0.08} />
			))}
			<Sfx name="tick" at={SPH} volume={0.08} />
			<Sfx name="hop" at={FESSES} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN : DÉCOLLAGE RÉUSSI ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const VOILA = at('fin', 'voilà');
	const DECO = at('fin', 'décollage');
	const REUSSI = at('fin', 'réussi');
	const fly = interpolate(frame, [VOILA - 4, REUSSI + 20], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.sky, 0.6)}} />
			<LiveBackground deco={false} />
			<Camera punches={[DECO + 1]} shakes={[REUSSI + 2]} strength={0.04}>
				<Blur on={fly > 0 && fly < 1} shutter={260} samples={8}>
					<Live
						render={(f) => {
							const k = interpolate(f, [VOILA - 4, REUSSI + 20], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
							return (
								<div style={{position: 'absolute', left: -300 + k * 1500, top: 1100 - k * 900}}>
									<div style={{transform: 'rotate(-34deg)', transformOrigin: '300px 150px', width: 600}}>
										<Suppo width={600} rocket={1} mood="fier" />
									</div>
								</div>
							);
						}}
					/>
				</Blur>
				<Big from={VOILA - 2} text={'Et *voilà* !'} size={140} y={220} center />
				<Stamp at={REUSSI - 2} x={540} y={820} text="DÉCOLLAGE RÉUSSI !" size={88} rot={-6} />
				<Confetti at={REUSSI} x={540} y={820} n={60} />
			</Camera>
			<Sfx name="whoosh" at={VOILA - 4} volume={0.12} />
			<Sfx name="stamp" at={REUSSI - 2} volume={0.12} />
			<Sfx name="ding" at={REUSSI + 4} volume={0.09} />
		</AbsoluteFill>
	);
};
