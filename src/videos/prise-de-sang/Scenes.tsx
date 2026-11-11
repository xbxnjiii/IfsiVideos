// « Le matériel pour une prise de sang » v2 (format inventaire, look 2026, voix Laura) : même contenu que la v1 validée
// (corps de pompe, tri OPCT / DASRI), mais une idée par plan, en très grand. Aplat de couleur par famille (1 bleu clair,
// 2 rose, 3 bleu), objets plein cadre qui entrent et sortent avec un vrai flou de mouvement (src/brand/bold.tsx), carte
// « chiffre géant » au début de chaque famille, compteur MATÉRIEL n / 13 et pastille de famille en haut
// (PriseDeSang.tsx). Dessins : src/brand/sampling.tsx. La v1 reste dans l'historique git (commit 05ef5c9).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigNumber, Big, Blur, fadeIn, Flash, FlatBg, Fly, Live, moving, Note, PointTag as Tag, popAt, Posed, ease} from '../../brand/bold';
import {Sparkles} from '../../brand/hands';
import {ScalpelIcon} from '../../brand/icons';
import {Burst, Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {AntisepticBottle, Arm, BloodTube, Butterfly, DasriBag, Gauze, Hand, Holder, Plaster, ShaBottle, SharpsBox, TourniquetStrap, VacuNeedle} from '../../brand/sampling';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {abs, at} from './timeline';

const N = LPI.navy;
const CAPS = [LPI.blue, LPI.pink, LPI.sky, N, LPI.blue];
/** Aplat de chaque famille (0 = accroche / récap). */
export const FAMILY_TONE = [LPI.paper, LPI.sky, alpha(LPI.pink, 0.6), LPI.blue];
/** Titres sur le bleu de la famille 3 : blanc cassé, accent bleu nuit. */
const ON_BLUE = {color: LPI.paper, accent: N};

const Bg: React.FC<{fam: 0 | 1 | 2 | 3}> = ({fam}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<FlatBg tone={FAMILY_TONE[fam]} light={fam === 0 ? 0 : fam === 3 ? 0.1 : 0.22} />
	</>
);

/* ═══════════════════════════════ LE PLATEAU (accroche et récap) ═══════════════════════════════ */
type TrayItem = {label: string; w: number; node: React.ReactNode};
export const GROUPS: {n: number; title: string; items: TrayItem[]}[] = [
	{
		n: 1,
		title: 'Prélèvement',
		items: [
			{label: 'aiguille', w: 280, node: <VacuNeedle size={280} />},
			{label: 'corps de pompe', w: 200, node: <Holder size={200} />},
			{label: 'ailettes', w: 220, node: <Butterfly size={220} />},
			{
				label: 'tubes',
				w: 162,
				node: (
					<div style={{display: 'flex', gap: 8}}>
						{[LPI.blue, LPI.pink, N].map((c) => (
							<BloodTube key={c} size={46} cap={c} />
						))}
					</div>
				),
			},
		],
	},
	{
		n: 2,
		title: 'Hygiène et antisepsie',
		items: [
			{label: 'SHA', w: 104, node: <ShaBottle size={104} />},
			{label: 'antiseptique', w: 96, node: <AntisepticBottle size={96} />},
			{label: 'compresses', w: 140, node: <Gauze size={140} sterile />},
			{label: 'garrot', w: 240, node: <TourniquetStrap size={240} />},
			{label: 'gants', w: 126, node: <Hand size={126} gloved={1} />},
		],
	},
	{
		n: 3,
		title: 'Fin du soin',
		items: [
			{label: 'compresse', w: 140, node: <Gauze size={140} />},
			{label: 'pansement', w: 240, node: <Plaster size={240} />},
			{label: 'collecteur', w: 152, node: <SharpsBox size={152} />},
			{label: 'sac DASRI', w: 152, node: <DasriBag size={152} />},
		],
	},
];
const BAND = {x: 40, w: 1000, h: 330, y0: 470, gap: 26};
const BAND_TONE = [LPI.sky, alpha(LPI.pink, 0.75), LPI.blue];

/** Les 3 familles en bandes d'aplat ; chaque objet tombe à sa place (vrai flou de mouvement) avec son nom. */
const Tray: React.FC<{show: number[]; land: (g: number, k: number, i: number) => number; glow?: number[]; check?: number[]}> = ({show, land, glow = [], check = []}) => {
	const frame = useCurrentFrame();
	let i = 0;
	const items = GROUPS.flatMap((g, gi) => {
		const y = BAND.y0 + gi * (BAND.h + BAND.gap);
		const total = g.items.reduce((s, it) => s + it.w, 0);
		const gapX = (BAND.w - 80 - total) / (g.items.length - 1);
		let x = BAND.x + 40;
		return g.items.map((it, k) => {
			const cx = x + it.w / 2;
			x += it.w + gapX;
			return {it, gi, cx, cy: y + 196, ly: y + 296, t: land(gi, k, i++)};
		});
	});
	const falling = items.some((o) => frame >= o.t - 13 && frame <= o.t + 1);
	return (
		<>
			{GROUPS.map((g, gi) => {
				const t0 = show[gi] ?? -60;
				if (frame < t0) return null;
				const y = BAND.y0 + gi * (BAND.h + BAND.gap);
				const gl = glow[gi] === undefined ? 0 : interpolate(frame, [glow[gi], glow[gi] + 6, glow[gi] + 24], [0, 1, 0.3], clamp);
				const dark = gi === 2;
				const ck = check[gi] === undefined ? 0 : fadeIn(frame, check[gi], 6);
				return (
					<div
						key={g.n}
						style={{
							position: 'absolute',
							left: BAND.x,
							top: y,
							width: BAND.w,
							height: BAND.h,
							borderRadius: 48,
							background: BAND_TONE[gi],
							boxShadow: gl > 0 ? `0 0 0 ${8 * gl}px ${LPI.paper}, 0 0 0 ${14 * gl}px ${LPI.pink}` : `0 14px 0 ${alpha(N, 0.12)}`,
							transform: `scale(${popAt(frame, t0) * (1 + 0.035 * gl)})`,
						}}
					>
						<div style={{position: 'absolute', left: 26, top: 20, display: 'flex', alignItems: 'center', gap: 16}}>
							<div style={{width: 66, height: 66, borderRadius: 33, background: LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N}}>{g.n}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: dark ? LPI.paper : N}}>{g.title}</div>
						</div>
						{ck > 0 ? (
							<div style={{position: 'absolute', right: 26, top: 18, width: 70, height: 70, borderRadius: 35, background: LPI.pink, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${popAt(frame, check[gi])})`}}>
								<svg width={46} height={46} viewBox="0 0 100 100">
									<path d="M22 52 L42 72 L78 30" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${ck} 1`} />
								</svg>
							</div>
						) : null}
					</div>
				);
			})}
			{items.map((o) =>
				frame >= o.t + 3 && frame >= (show[o.gi] ?? -60) ? (
					<div key={o.it.label} style={{position: 'absolute', left: o.cx, top: o.ly, transform: 'translate(-50%, -50%)', fontFamily: FONT.body, fontWeight: 900, fontSize: 27, color: o.gi === 2 ? LPI.paper : alpha(N, 0.85), opacity: fadeIn(frame, o.t + 3, 6), whiteSpace: 'nowrap'}}>
						{o.it.label}
					</div>
				) : null,
			)}
			<Blur on={falling}>
				{items.map((o) => (
					<Posed
						key={o.it.label}
						pose={(f) => {
							const t = f - o.t;
							if (t < -12 || f < (show[o.gi] ?? -60)) return null;
							// chute qui accélère (12 images), puis petits rebonds à l'atterrissage
							const dy = t < 0 ? -640 * (t / 12) ** 2 : t < 14 ? -26 * Math.exp(-t / 2.5) * Math.abs(Math.sin(t * 0.9)) : 0;
							return {x: o.cx, y: o.cy + dy, rot: t < 0 ? 8 * (t / 12) : 0};
						}}
					>
						{o.it.node}
					</Posed>
				))}
			</Blur>
		</>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Prise de sang : le matériel » + le plateau en 3 bandes de couleur où les 13 objets tombent (flou de
// mouvement). « Ça fait beaucoup ? » : un 13 géant compte et claque au centre (« OBJETS ! »), flash et secousse ;
// « on reprend tout, un par un » : les bandes s'allument une à une.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SANG = at('intro', 'sang');
	const CA2 = at('intro', 'ça', 2);
	const BEAU = at('intro', 'beaucoup');
	const PANI = at('intro', 'panique');
	const REPR = at('intro', 'reprend');
	const PAR = at('intro', 'par');
	const UN2 = at('intro', 'un', 2);
	const lights = [REPR + 8, PAR - 2, UN2 + 4];
	const big = frame >= CA2 - 2 && frame <= PANI + 22;
	const n = Math.max(1, Math.min(13, Math.round(interpolate(frame, [CA2 - 2, BEAU], [1, 13], clamp))));
	const dim = interpolate(frame, [CA2 - 2, CA2 + 4, PANI + 4, PANI + 14], [0, 0.42, 0.42, 0], clamp);
	return (
		<AbsoluteFill>
			<Bg fam={0} />
			<Camera punches={[SANG + 1, BEAU + 1, ...lights.map((l) => l + 1)]} shakes={[BEAU + 2]} strength={0.04}>
				<Big from={-30} text={'Prise de sang :\nle *matériel*'} size={104} y={150} center />
				<Tray show={[-60, -60, -60]} land={(_, __, i) => -6 + i * 3} glow={lights} />
				<Burst at={SANG} x={540} y={300} r={360} n={16} />
				{dim > 0 ? <AbsoluteFill style={{background: alpha(N, dim)}} /> : null}
				{big ? (
					<>
						<Blur on={moving(frame, CA2 - 2, PANI + 8)}>
							<Posed pose={(f) => flyPose13(f, CA2 - 2, BEAU, PANI + 8)}>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 470, lineHeight: 1, color: LPI.pink, WebkitTextStroke: `14px ${N}`, paintOrder: 'stroke', textShadow: `0 22px 0 ${alpha(N, 0.25)}`, fontVariantNumeric: 'tabular-nums'}}>{n}</div>
							</Posed>
						</Blur>
						<Note at={BEAU} to={PANI + 6} y={1190} size={84} tone={LPI.paper}>
							objets !
						</Note>
					</>
				) : null}
			</Camera>
			<Flash at={BEAU} max={0.3} />
			{Array.from({length: 13}, (_, i) => (
				<Sfx key={i} name="pop" at={Math.max(0, -6 + i * 3)} volume={0.05} />
			))}
			<Sfx name="ding" at={SANG} volume={0.08} />
			<Sfx name="drumroll" at={CA2 - 2} volume={0.06} dur={BEAU - CA2 + 2} />
			<Sfx name="impact" at={BEAU} volume={0.12} />
			<Sfx name="whoosh" at={PANI + 6} volume={0.07} />
			{lights.map((l) => (
				<Sfx key={l} name="tick" at={l} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/** Le 13 géant : monte du bas pendant qu'il compte, claque à `slam`, part vers le haut à `out`. */
const flyPose13 = (f: number, t0: number, slam: number, out: number) => {
	const k = interpolate(f, [t0, slam], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const s = f < slam ? 0.55 + 0.35 * k : 0.9 + 0.1 * popAt(f, slam);
	const ko = interpolate(f, [out, out + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	return {x: 540, y: 900 + 260 * (1 - k) - 1500 * ko, s, rot: -6 + 6 * (1 - k)};
};

/* ═══════════════════════════════ 1 · PRÉLÈVEMENT : AIGUILLE, CORPS DE POMPE, AILETTES ═══════════════════════════════ */
export const Prelevement: React.FC = () => {
	const frame = useCurrentFrame();
	const PREL = at('prelevement', 'prélèvement.');
	const AIG = at('prelevement', "l'aiguille");
	const DEUX = at('prelevement', 'deux');
	const VEINE = at('prelevement', 'veine,');
	const TUBE = at('prelevement', 'tube.');
	const ELLE = at('prelevement', 'elle');
	const VISSE = at('prelevement', 'visse');
	const PORTE = at('prelevement', 'porte-tube.');
	const ET = at('prelevement', 'et');
	const FINE = at('prelevement', 'fine');
	const UNITE = at('prelevement', "l'unité");
	const AIL = at('prelevement', 'ailettes,');
	const DITE = at('prelevement', 'dite');
	const CARD_OUT = AIG - 6;
	const ASM_OUT = ET - 2;
	return (
		<AbsoluteFill>
			<Bg fam={1} />
			<Camera punches={[PREL + 1, AIG + 1, DEUX + 1, VISSE + 1, FINE + 1, UNITE + 1]} strength={0.03}>
				<BigNumber at={-2} out={CARD_OUT} n={1} title={'Le *prélèvement*'} />
				{/* ── l'aiguille Vacutainer ── */}
				<Big from={AIG - 2} to={ELLE - 4} text={"L'aiguille\n*Vacutainer*"} size={112} />
				<Big from={ELLE - 2} to={ASM_OUT} text={'Le *corps*\nde pompe'} size={112} />
				<Fly
					at={AIG - 4}
					out={ASM_OUT}
					x={540}
					y={800}
					move={[{at: ELLE - 2, x: 800, y: 820, s: 0.55, dur: 14}, {at: VISSE, x: 667, dur: 22}]}
				>
					<Live render={(f) => <div style={{transform: `rotate(${f >= VISSE && f < VISSE + 22 ? Math.sin(f * 1.6) * 3 : 0}deg)`}}><VacuNeedle size={980} glowVein={fadeIn(f, DEUX, 6) * (f < VEINE - 4 ? 1 : f < TUBE ? 1.4 : 0.7)} glowTube={fadeIn(f, DEUX, 6) * (f < TUBE - 4 ? 0.7 : 1.4)} /></div>} />
				</Fly>
				<Note at={DEUX} to={VEINE - 6} y={1080} size={64} tone={LPI.paper}>
					2 pointes
				</Note>
				<Tag at={VEINE - 2} to={ELLE - 4} x={860} y={560} px={1000} py={800}>
					côté veine
				</Tag>
				<Tag at={TUBE - 2} to={ELLE - 4} x={390} y={1020} px={150} py={800}>
					côté tube (sous le manchon)
				</Tag>
				{/* ── le corps de pompe (= le porte-tube) ── */}
				<Fly at={VISSE - 8} out={ASM_OUT} x={330} y={820} from="left" to="right">
					<Holder size={560} />
				</Fly>
				<Note at={PORTE - 2} to={ASM_OUT} y={1100} size={46}>
					= le porte-tube, qu&apos;on tient en main
				</Note>
				<Sparkles at={VISSE + 18} x={610} y={820} r={110} n={7} />
				{/* ── veine fine ou fragile → l'unité à ailettes ── */}
				<Big from={ET} to={UNITE - 4} text={'Veine *fine*\nou *fragile* ?'} size={112} />
				<Fly at={ET} out={UNITE - 6} x={540} y={820} from="bottom" to="left">
					<Arm width={1000} mark={fadeIn(frame, FINE, 6)} />
				</Fly>
				{frame >= FINE - 2 && frame < UNITE - 4 ? (
					<div style={{position: 'absolute', left: 740, top: 560, fontFamily: FONT.title, fontWeight: 900, fontSize: 200, color: LPI.pink, WebkitTextStroke: `7px ${N}`, transform: `scale(${popAt(frame, FINE - 2)}) rotate(${12 + Math.sin(frame / 4) * 6}deg)`}}>?</div>
				) : null}
				<Big from={UNITE - 2} text={"L'unité\nà *ailettes*"} size={112} />
				<Fly at={UNITE - 4} x={540} y={820} from="right">
					<Live render={(f) => <Butterfly size={900} flap={f >= AIL - 4 && f < AIL + 30 ? 1 : 0} />} />
				</Fly>
				<Note at={DITE - 2} y={1110} size={60}>
					dite « épicrânienne »
				</Note>
			</Camera>
			<Sfx name="whoosh" at={AIG - 4} volume={0.08} />
			<Sfx name="ding" at={DEUX} volume={0.07} />
			<Sfx name="pop" at={VEINE - 2} volume={0.07} />
			<Sfx name="pop" at={TUBE - 2} volume={0.07} />
			<Sfx name="whoosh" at={VISSE - 8} volume={0.07} />
			<Sfx name="tick" at={VISSE + 6} volume={0.07} />
			<Sfx name="tick" at={VISSE + 12} volume={0.07} />
			<Sfx name="ding" at={VISSE + 20} volume={0.07} />
			<Sfx name="whoosh" at={ASM_OUT} volume={0.07} />
			<Sfx name="whoosh" at={UNITE - 6} volume={0.08} />
			<Sfx name="pop" at={DITE - 2} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · PRÉLÈVEMENT : LES TUBES ═══════════════════════════════ */
/** Prescription (420 × 560) : 4 lignes, chaque analyse avec sa couleur de bouchon, cochées à `checks`. */
const Rx: React.FC<{checks: number[]}> = ({checks}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{width: 420, height: 560, boxSizing: 'border-box', borderRadius: 26, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, padding: '30px 30px'}}>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.12em', color: alpha(N, 0.7)}}>PRESCRIPTION</div>
			{checks.map((t, i) => {
				const k = fadeIn(frame, t, 5);
				return (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 34}}>
						<div style={{width: 48, height: 48, borderRadius: 12, border: `5px solid ${N}`, background: k > 0 ? LPI.pink : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
							{k > 0 ? (
								<svg width={34} height={34} viewBox="0 0 100 100">
									<path d="M22 52 L42 72 L78 30" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`} />
								</svg>
							) : null}
						</div>
						<div style={{width: 30, height: 30, borderRadius: 15, background: CAPS[i], border: `4px solid ${N}`, flexShrink: 0}} />
						<div style={{height: 18, borderRadius: 9, flex: 1, background: alpha(N, 0.18)}} />
					</div>
				);
			})}
		</div>
	);
};

export const Tubes: React.FC = () => {
	const frame = useCurrentFrame();
	const TUBES = at('tubes', 'tubes');
	const PRESC = at('tubes', 'prescription.');
	const CHAQUE = at('tubes', 'chaque');
	const COUL = at('tubes', 'couleur');
	const ANAL = at('tubes', 'analyse.');
	const ET = at('tubes', 'et');
	const VIDE = at('tubes', 'vide');
	const ASP = at('tubes', 'aspire');
	const SEUL = at('tubes', 'seul');
	const QUANT = at('tubes', 'quantité');
	const SANG = at('tubes', 'sang.');
	// rangée de 5 tubes ; avant « chaque couleur », 3 tubes à droite de la prescription
	const rowX = (i: number) => 540 + (i - 2) * 196;
	const startX = [600, 760, 920];
	const fill = interpolate(frame, [ASP, SEUL + 18], [0, 0.79], ease);
	return (
		<AbsoluteFill>
			<Bg fam={1} />
			<Camera punches={[TUBES + 1, PRESC + 1, COUL + 1, ANAL + 1, VIDE + 1, ASP + 1, QUANT + 1]} strength={0.03}>
				<Big from={-2} to={ET - 4} text={'Les *tubes*'} size={120} />
				<Fly at={PRESC - 8} out={CHAQUE - 4} x={270} y={800} from="left" to="left">
					<Rx checks={[PRESC + 2, PRESC + 7, PRESC + 12, PRESC + 17]} />
				</Fly>
				{CAPS.map((c, i) => {
					const first = i < 3;
					const t0 = first ? TUBES - 6 + i * 3 : COUL - 4 + (i - 3) * 3;
					const isHero = i === 2;
					return (
						<Fly
							key={i}
							at={t0}
							out={isHero ? 1e9 : ET - 2}
							x={first ? startX[i] : rowX(i)}
							y={820}
							from="top"
							to={i < 2 ? 'left' : 'right'}
							move={[
								...(first ? [{at: CHAQUE - 4, x: rowX(i), dur: 12}] : []),
								...(isHero ? [{at: ET, x: 800, y: 900, s: 1.3, dur: 14}] : []),
							]}
						>
							<Live
								render={(f) => (
									<div style={{transform: `translateY(${f >= COUL + i * 5 && f < COUL + i * 5 + 10 ? -30 * Math.sin(((f - COUL - i * 5) / 10) * Math.PI) : 0}px)`}}>
										<BloodTube size={172} cap={c} level={isHero ? fill : 0} vacuum={isHero ? fadeIn(f, VIDE - 4, 6) * (1 - fadeIn(f, ASP, 8)) : 0} mark={isHero ? fadeIn(f, QUANT - 6, 6) : 0} />
									</div>
								)}
							/>
						</Fly>
					);
				})}
				<Note at={ANAL - 4} to={ET - 4} y={1290} size={60} tone={LPI.paper}>
					1 couleur = 1 analyse
				</Note>
				{/* ── dedans : du vide ── */}
				<Big from={ET + 2} to={ASP - 4} text={'Dedans :\ndu *vide*'} size={120} />
				<Big from={ASP - 2} text={'Il aspire\n*tout* *seul*'} size={120} />
				{/* l'aiguille (côté tube) perce le bouchon */}
				<Fly at={ASP - 10} out={SANG + 10} x={800} y={300} from="top" to="top" rot={-90} move={[{at: ASP - 6, y: 380, dur: 8}]}>
					<VacuNeedle size={300} />
				</Fly>
				<Tag at={VIDE - 2} to={ASP - 4} x={360} y={760} px={800} py={760}>
					du vide !
				</Tag>
				<Tag at={ASP + 4} to={QUANT - 6} x={330} y={1060} px={760} py={1150}>
					le sang monte
				</Tag>
				<Tag at={QUANT - 4} x={330} y={1000} px={690} py={788}>
					la bonne quantité
				</Tag>
			</Camera>
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="pop" at={TUBES - 6 + i * 3} volume={0.06} />
			))}
			<Sfx name="whoosh" at={PRESC - 8} volume={0.07} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="tick" at={PRESC + 2 + i * 5} volume={0.06} />
			))}
			{CAPS.map((_, i) => (
				<Sfx key={i} name="pop" at={COUL + i * 5} volume={0.05} />
			))}
			<Sfx name="ding" at={ANAL - 4} volume={0.07} />
			<Sfx name="whoosh" at={ET - 2} volume={0.08} />
			<Sfx name="whoosh" at={ASP - 10} volume={0.06} />
			<Sfx name="tick" at={ASP - 2} volume={0.08} />
			<Sfx name="ding" at={QUANT} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · HYGIÈNE : SHA ET GANTS ═══════════════════════════════ */
const Drop: React.FC<{size?: number}> = ({size = 46}) => (
	<svg width={size} height={size * 1.3} viewBox="0 0 40 52" style={{overflow: 'visible'}}>
		<path d="M20 2 C26 16 36 26 36 36 A16 16 0 0 1 4 36 C4 26 14 16 20 2 Z" fill={LPI.pink} stroke={N} strokeWidth={4} strokeLinejoin="round" />
	</svg>
);

export const Mains: React.FC = () => {
	const frame = useCurrentFrame();
	const HYG = at('mains', "l'hygiène");
	const DAB = at('mains', "d'abord,");
	const SOL = at('mains', 'solution');
	const SHA = at('mains', 'sha,');
	const POUR = at('mains', 'pour');
	const MAINS = at('mains', 'mains.');
	const PUIS = at('mains', 'puis');
	const GANTS = at('mains', 'gants');
	const UNIQ = at('mains', 'unique,');
	const NON = at('mains', 'non');
	const PROT = at('mains', 'protègent');
	const SANG = at('mains', 'sang.');
	const CARD_OUT = DAB - 6;
	const press = interpolate(frame, [SOL + 6, SOL + 10, SOL + 16], [0, 1, 0], clamp);
	const rub = frame >= POUR && frame < GANTS - 6 ? Math.sin((frame - POUR) * 0.7) * 26 : 0;
	return (
		<AbsoluteFill>
			<Bg fam={2} />
			<Camera punches={[HYG + 1, SOL + 1, SHA + 1, MAINS + 1, GANTS + 1, PROT + 1]} strength={0.03}>
				<BigNumber at={-2} out={CARD_OUT} n={2} title={'Hygiène\net *antisepsie*'} tone={LPI.sky} />
				<Big from={DAB - 2} to={SHA - 6} text={"D'abord,\nles *mains*"} size={116} />
				<Big from={SHA - 4} to={PUIS - 4} text={'La *SHA*'} size={130} />
				<Big from={PUIS - 2} text={'Les *gants*'} size={130} />
				{/* le flacon : on appuie, une goutte tombe dans les mains */}
				<Fly at={SOL - 8} out={PUIS - 4} x={280} y={820} from="left" to="left">
					<ShaBottle size={300} press={press} />
				</Fly>
				{frame >= SOL + 10 && frame < SOL + 26 ? (
					<div style={{position: 'absolute', left: 470, top: interpolate(frame, [SOL + 10, SOL + 24], [600, 820], {...clamp, easing: Easing.in(Easing.quad)})}}>
						<Drop size={40} />
					</div>
				) : null}
				{/* les deux mains (elles se frottent, puis enfilent les gants) */}
				{[0, 1].map((k) => (
					<Fly key={k} at={DAB + 2 + k * 3} x={600 + k * 220} y={860} from="right" move={[{at: PUIS - 2, x: 390 + k * 300, dur: 12}]}>
						<div style={{transform: `translateX(${k ? -rub : rub}px) scaleX(${k ? -1 : 1}) scale(${frame >= GANTS ? 0.92 + 0.08 * popAt(frame, GANTS) : 1})`}}>
							<Hand size={250} gloved={frame >= GANTS ? 1 : 0} />
						</div>
					</Fly>
				))}
				<Sparkles at={MAINS - 2} x={700} y={820} r={260} n={9} />
				<Note at={SHA - 2} to={PUIS - 4} y={1240} size={52}>
					SHA = solution hydroalcoolique
				</Note>
				<Note at={UNIQ - 6} to={PROT - 6} y={1170} size={56}>
					à usage unique
				</Note>
				<Note at={NON - 2} to={PROT - 6} y={1280} size={56} tone={LPI.sky}>
					non stériles
				</Note>
				{/* « ils te protègent du sang » : les gouttes rebondissent sur les gants */}
				{frame >= PROT - 6
					? [0, 1, 2, 3].map((i) => {
							const t = frame - (PROT - 6 + i * 5);
							if (t < 0 || t > 30) return null;
							const fall = Math.min(1, t / 9);
							const x = 380 + i * 110;
							const y = t <= 9 ? 380 + 330 * fall * fall : 710 - 260 * Math.sin(((t - 9) / 21) * Math.PI * 0.8);
							const dx = t <= 9 ? 0 : (i < 2 ? -1 : 1) * (t - 9) * 12;
							return (
								<div key={i} style={{position: 'absolute', left: x + dx, top: y, opacity: interpolate(t, [22, 30], [1, 0], clamp), transform: `rotate(${dx * 0.4}deg)`}}>
									<Drop size={44} />
								</div>
							);
						})
					: null}
				<Note at={PROT - 2} y={1240} size={56}>
					ils te protègent du sang
				</Note>
			</Camera>
			<Sfx name="whoosh" at={SOL - 8} volume={0.07} />
			<Sfx name="tick" at={SOL + 8} volume={0.07} />
			<Sfx name="pop" at={SHA - 2} volume={0.07} />
			<Sfx name="ding" at={MAINS} volume={0.07} />
			<Sfx name="whoosh" at={PUIS - 4} volume={0.07} />
			<Sfx name="pop" at={GANTS} volume={0.09} />
			<Sfx name="pop" at={NON - 2} volume={0.06} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="hop" at={PROT + 3 + i * 5} volume={0.05} />
			))}
			<Sfx name="ding" at={SANG} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · ANTISEPSIE : GARROT, ANTISEPTIQUE, COMPRESSE STÉRILE ═══════════════════════════════ */
/** Le bras plein cadre : 1040 px, posé à y 560 ; le point de ponction tombe en (540, 736). */
const ARM = {x: 20, y: 560, w: 1040};
const PT = {x: ARM.x + (450 * ARM.w) / 900, y: ARM.y + (152 * ARM.w) / 900};
const TQ_X = ARM.x + (300 * ARM.w) / 900;

export const Bras: React.FC = () => {
	const frame = useCurrentFrame();
	const GARROT = at('bras', 'garrot');
	const SERRE = at('bras', 'serre');
	const DESSUS = at('bras', 'au-dessus');
	const POINT = at('bras', 'point');
	const LA = at('bras', 'là');
	const GONFLE = at('bras', 'gonfle,');
	const FACILE = at('bras', 'facile');
	const PUIS = at('bras', 'puis');
	const ANTI = at('bras', "l'antiseptique,");
	const COMP = at('bras', 'compresse');
	const STER = at('bras', 'stérile,');
	const DESINF = at('bras', 'désinfecte');
	const PEAU = at('bras', 'peau.');
	// la compresse vole du flacon jusqu'au point de ponction, puis tourne en cercles
	const GZ = {x: 520, y: 1170};
	const fly = interpolate(frame, [DESINF - 6, DESINF + 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const swirl = interpolate(frame, [DESINF + 4, PEAU + 14], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Bg fam={2} />
			<Camera punches={[GARROT + 1, SERRE + 1, POINT + 1, GONFLE + 1, ANTI + 1, DESINF + 1]} strength={0.03}>
				<Big from={-2} to={PUIS - 4} text={'Le *garrot*'} size={130} />
				<Big from={PUIS - 2} text={"*L'antiseptique*"} size={116} />
				<Fly at={-4} x={540} y={ARM.y + (150 * ARM.w) / 900} from="bottom" dist={1100}>
					<Live
						render={(f) => (
							<Arm
								width={ARM.w}
								tourniquet={interpolate(f, [GARROT - 4, GARROT + 8], [0, 1], ease)}
								tight={interpolate(f, [SERRE, SERRE + 6], [0, 1], ease)}
								swell={interpolate(f, [GONFLE - 6, GONFLE + 10], [0, 1], ease)}
								mark={fadeIn(f, POINT - 2, 6) * (1 - fadeIn(f, DESINF - 6, 6))}
								wipe={interpolate(f, [DESINF + 4, PEAU + 10], [0, 1], ease)}
							/>
						)}
					/>
				</Fly>
				{/* « au-dessus » : flèche du point de ponction vers le garrot */}
				{frame >= DESSUS - 2 && frame < PUIS - 4 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: fadeIn(frame, DESSUS - 2, 6) * (1 - fadeIn(frame, PUIS - 10, 6))}}>
						<path d={`M${PT.x} ${PT.y - 120} Q${(PT.x + TQ_X) / 2} ${PT.y - 250} ${TQ_X + 40} ${PT.y - 150}`} fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - interpolate(frame, [DESSUS - 2, DESSUS + 10], [0, 1], ease))} />
						<path d={`M${TQ_X + 40} ${PT.y - 150} l26 -6 M${TQ_X + 40} ${PT.y - 150} l12 24`} stroke={N} strokeWidth={8} strokeLinecap="round" opacity={fadeIn(frame, DESSUS + 8, 3)} />
					</svg>
				) : null}
				<Tag at={DESSUS + 2} to={PUIS - 4} x={(PT.x + TQ_X) / 2 + 20} y={PT.y - 270} px={(PT.x + TQ_X) / 2 + 20} py={PT.y - 200}>
					au-dessus
				</Tag>
				<Tag at={POINT - 2} to={PUIS - 4} x={PT.x + 170} y={PT.y + 250} px={PT.x} py={PT.y}>
					point de ponction
				</Tag>
				<Note at={LA - 2} to={PUIS - 4} y={1080} size={50}>
					= là où on va piquer
				</Note>
				<Note at={FACILE - 6} to={PUIS - 4} y={1200} size={44} tone={LPI.sky}>
					la veine gonfle : plus facile à trouver
				</Note>
				{/* l'antiseptique sur une compresse stérile */}
				<Fly at={ANTI - 6} x={240} y={1160} from="left" move={[{at: STER + 2, rot: 50, dur: 8}, {at: STER + 18, rot: 0, dur: 8}]}>
					<AntisepticBottle size={210} />
				</Fly>
				{frame >= STER + 8 && frame < STER + 22 ? (
					<div style={{position: 'absolute', left: 400, top: interpolate(frame, [STER + 8, STER + 20], [1050, 1140], {...clamp, easing: Easing.in(Easing.quad)})}}>
						<Drop size={34} />
					</div>
				) : null}
				<Blur on={moving(frame, COMP - 4, 1e9, [DESINF - 6])}>
					<Posed
						pose={(f) => {
							if (f < COMP - 4) return null;
							const fl = interpolate(f, [DESINF - 6, DESINF + 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
							const sw = interpolate(f, [DESINF + 4, PEAU + 14], [0, 1], clamp);
							const a = sw * Math.PI * 5;
							const r = 46 * Math.sin(Math.PI * sw);
							return {x: GZ.x + (PT.x - GZ.x) * fl + r * Math.cos(a), y: GZ.y + (PT.y - GZ.y) * fl + r * Math.sin(a), s: popAt(f, COMP - 4) * (1 - 0.3 * fl), rot: -8 + 30 * sw};
						}}
					>
						<Gauze size={220} sterile={fly < 0.5} />
					</Posed>
				</Blur>
				<Note at={STER - 4} to={DESINF - 6} y={1390} size={48}>
					sur une compresse stérile
				</Note>
				{swirl > 0.6 ? <Sparkles at={PEAU} x={PT.x} y={PT.y} r={170} n={8} /> : null}
				<Note at={DESINF} y={1390} size={52} tone={LPI.sky}>
					elle désinfecte la peau
				</Note>
			</Camera>
			<Sfx name="whoosh" at={GARROT - 4} volume={0.07} />
			<Sfx name="pop" at={SERRE} volume={0.08} />
			<Sfx name="tick" at={POINT} volume={0.07} />
			<Sfx name="pop" at={LA - 2} volume={0.06} />
			<Sfx name="hop" at={GONFLE} volume={0.06} />
			<Sfx name="whoosh" at={ANTI - 6} volume={0.07} />
			<Sfx name="pop" at={COMP - 4} volume={0.07} />
			<Sfx name="tick" at={STER + 18} volume={0.06} />
			<Sfx name="whoosh" at={DESINF - 6} volume={0.07} />
			<Sfx name="ding" at={PEAU} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · FIN DU SOIN : COMPRESSE, PANSEMENT ═══════════════════════════════ */
/** Rouleau de sparadrap (200 × 160). */
const TapeRoll: React.FC<{size?: number}> = ({size = 200}) => (
	<svg width={size} height={size * 0.8} viewBox="0 0 200 160" style={{overflow: 'visible'}}>
		<path d="M100 120 H190 V146 H100 Z" fill={LPI.paper} stroke={N} strokeWidth={5} strokeLinejoin="round" />
		<circle cx={80} cy={80} r={70} fill={LPI.sky} stroke={N} strokeWidth={6} />
		<circle cx={80} cy={80} r={40} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<circle cx={80} cy={80} r={56} fill="none" stroke={alpha(N, 0.25)} strokeWidth={4} />
	</svg>
);

export const Fin: React.FC = () => {
	const TERM = at('fin', 'terminer');
	const UNE = at('fin', 'une');
	const COMP = at('fin', 'compresse,');
	const APP = at('fin', 'appuyer');
	const QUAND = at('fin', 'quand');
	const RET = at('fin', 'retire');
	const PUIS = at('fin', 'puis');
	const PANS = at('fin', 'pansement,');
	const SPARA = at('fin', 'sparadrap.');
	const CARD_OUT = UNE - 6;
	return (
		<AbsoluteFill>
			<Bg fam={3} />
			<Camera punches={[TERM + 1, COMP + 1, APP + 1, RET + 1, PANS + 1, SPARA + 1]} strength={0.03}>
				<BigNumber at={-2} out={CARD_OUT} n={3} title={'Fin du *soin*'} {...ON_BLUE} tone={LPI.pink} />
				<Big from={UNE - 2} to={PUIS - 4} text={'La *compresse*'} size={116} {...ON_BLUE} />
				<Big from={PUIS - 2} text={'Le *pansement*'} size={116} {...ON_BLUE} />
				<Fly at={UNE - 6} x={540} y={ARM.y + (150 * ARM.w) / 900} from="bottom" dist={1100}>
					<Live
						render={(f) => (
							<Arm
								width={ARM.w}
								needle={interpolate(f, [RET, RET + 12], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)}) * (f < RET + 13 ? 1 : 0)}
								gauze={popAt(f, COMP - 2) * (f >= APP ? 1 - 0.1 * Math.sin(Math.min(1, (f - APP) / 8) * Math.PI) : 1) * (1 - fadeIn(f, PUIS, 6))}
								plaster={popAt(f, PANS - 2)}
							/>
						)}
					/>
				</Fly>
				<Note at={QUAND - 4} to={PUIS - 4} y={1070} size={52}>
					on appuie en retirant l&apos;aiguille
				</Note>
				<Fly at={SPARA - 6} x={540} y={1150} from="right" rot={-8}>
					<TapeRoll size={220} />
				</Fly>
				<Note at={SPARA - 2} y={1320} size={56}>
					ou du sparadrap
				</Note>
			</Camera>
			<Sfx name="whoosh" at={UNE - 6} volume={0.07} />
			<Sfx name="pop" at={COMP - 2} volume={0.08} />
			<Sfx name="hop" at={APP} volume={0.06} />
			<Sfx name="whoosh" at={RET} volume={0.08} />
			<Sfx name="impact" at={PANS - 2} volume={0.08} />
			<Sfx name="whoosh" at={SPARA - 6} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · FIN DU SOIN : LES DÉCHETS ═══════════════════════════════ */
// Deux colonnes qui ne se cachent jamais : à gauche le collecteur à OPCT ; à droite trois cartes P · C · T qui volent
// dans sa fente (flou de mouvement) ; « jamais recapuchonner » : le capuchon glisse vers l'aiguille et le panneau
// d'interdiction (centré sur le capuchon) l'arrête ; « les autres déchets souillés » : le sac DASRI se pose à droite, la
// compresse et le gant tombent dedans (dessinés avant le sac, donc derrière lui).
const BOX = {x: 50, y: 560, size: 400};
const SLOT = {x: BOX.x + BOX.size / 2, y: BOX.y + (78 * BOX.size) / 240};
const BAG = {x: 590, y: 560, size: 400};
const MOUTH = {x: BAG.x + BAG.size / 2, y: BAG.y + (70 * BAG.size) / 240};
const COL = {x: 500, w: 540, y: 520, h: 150, gap: 172};

/** Verre cassé (ampoule) : objet tranchant (100 × 100). */
const BrokenAmpoule: React.FC<{size?: number}> = ({size = 90}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
		<path d="M34 96 V54 Q34 40 44 34 V20 L38 12 L48 16 L52 6 L58 18 L64 12 V34 Q74 40 74 54 V96 Z" fill={alpha(LPI.sky, 0.7)} stroke={N} strokeWidth={6} strokeLinejoin="round" />
		<path d="M44 60 V86" stroke={LPI.paper} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

/** Panneau d'interdiction (rond + barre), centré sur (cx, cy). */
const NoSign: React.FC<{at: number; cx: number; cy: number; r: number}> = ({at: t0, cx, cy, r}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const d = r * 0.7;
	return (
		<svg width={2 * r + 40} height={2 * r + 40} viewBox={`${-r - 20} ${-r - 20} ${2 * r + 40} ${2 * r + 40}`} style={{position: 'absolute', left: cx - r - 20, top: cy - r - 20, overflow: 'visible', transform: `scale(${popAt(frame, t0)})`}}>
			<circle r={r} fill="none" stroke={N} strokeWidth={34} />
			<circle r={r} fill="none" stroke={LPI.pink} strokeWidth={24} />
			<path d={`M${-d} ${-d} L${d} ${d}`} stroke={N} strokeWidth={34} strokeLinecap="round" />
			<path d={`M${-d} ${-d} L${d} ${d}`} stroke={LPI.pink} strokeWidth={24} strokeLinecap="round" />
		</svg>
	);
};

export const Dechets: React.FC = () => {
	const frame = useCurrentFrame();
	const IMP = at('dechets', 'important');
	const COLL = at('dechets', 'collecteur');
	const OPCT = at('dechets', 'opct,');
	const PIQ = at('dechets', 'piquants,');
	const COUP = at('dechets', 'coupants,');
	const TRANCH = at('dechets', 'tranchants.');
	const AIG = at('dechets', "l'aiguille");
	const JAMAIS = at('dechets', 'jamais');
	const RECAP = at('dechets', 'recapuchonner');
	const LES = at('dechets', 'les', 2);
	const SOUIL = at('dechets', 'souillés');
	const VONT = at('dechets', 'vont');
	const SAC = at('dechets', 'sac');
	const RISQ = at('dechets', 'risque');
	const CARDS = [
		{letter: 'P', word: 'piquants', ex: 'aiguille', icon: <VacuNeedle size={150} />, at: PIQ - 2, fly: AIG - 2},
		{letter: 'C', word: 'coupants', ex: 'lame', icon: <ScalpelIcon size={92} />, at: COUP - 2, fly: AIG + 10},
		{letter: 'T', word: 'tranchants', ex: 'verre cassé', icon: <BrokenAmpoule size={92} />, at: TRANCH - 2, fly: AIG + 20},
	];
	const landed = CARDS.map((c) => c.fly + 16);
	const boxBump = landed.reduce((a, t) => a + (frame >= t ? 0.08 * Math.exp(-(frame - t) / 4) : 0), 0);
	const panelOn = interpolate(frame, [JAMAIS - 8, JAMAIS - 2, LES - 8, LES - 2], [0, 1, 1, 0], clamp);
	const capX = frame < RECAP ? interpolate(frame, [JAMAIS - 4, RECAP], [430, 250], ease) : interpolate(frame, [RECAP + 2, RECAP + 14], [250, 430], ease);
	const bagIn = LES - 2;
	const bagBump = [VONT + 14, VONT + 22].reduce((a, t) => a + (frame >= t ? 0.07 * Math.exp(-(frame - t) / 4) : 0), 0);
	const ITEMS = [
		{node: <Gauze size={130} />, x: 640, pop: LES + 4, fall: VONT - 2},
		{node: <Hand size={120} gloved={1} />, x: 840, pop: SOUIL - 2, fall: VONT + 6},
	];
	const flying = CARDS.some((c) => frame >= c.fly - 1 && frame <= c.fly + 17);
	return (
		<AbsoluteFill>
			<Bg fam={3} />
			<Camera punches={[IMP + 1, COLL + 1, PIQ + 1, COUP + 1, TRANCH + 1, AIG + 1, RECAP + 1, SAC + 1]} shakes={[RECAP + 2]} strength={0.03}>
				<Big from={-2} to={COLL - 6} text={'Le plus\n*important* :'} size={124} {...ON_BLUE} />
				<Big from={COLL - 4} to={LES - 4} text={'Le collecteur\nà *OPCT*'} size={116} {...ON_BLUE} />
				<Big from={LES - 2} text={'Le sac *DASRI*'} size={116} {...ON_BLUE} />
				{/* ── à gauche : le collecteur à OPCT ── */}
				<Fly at={IMP + 2} x={BOX.x + BOX.size / 2} y={BOX.y + (140 * BOX.size) / 240} from="left">
					<div style={{transform: `scale(${1 + boxBump})`, transformOrigin: '50% 100%'}}>
						<SharpsBox size={BOX.size} />
					</div>
				</Fly>
				{/* ── à droite : P · C · T, puis ils s'envolent dans la fente ── */}
				{CARDS.map((c, i) => {
					if (frame < c.at || frame >= c.fly) return null;
					return (
						<div
							key={c.letter}
							style={{
								position: 'absolute',
								left: COL.x,
								top: COL.y + i * COL.gap,
								width: COL.w,
								height: COL.h,
								borderRadius: 34,
								background: LPI.paper,
								border: `6px solid ${N}`,
								boxShadow: SHADOW,
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								padding: '0 20px',
								boxSizing: 'border-box',
								transform: `translateX(${(1 - Math.min(1, (frame - c.at) / 8)) * 300}px) scale(${popAt(frame, c.at)})`,
								transformOrigin: 'left center',
							}}
						>
							<div style={{width: 70, height: 70, borderRadius: 35, background: LPI.pink, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N, flexShrink: 0}}>{c.letter}</div>
							<div style={{width: 150, display: 'flex', justifyContent: 'center', flexShrink: 0}}>{c.icon}</div>
							<div>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N, lineHeight: 1}}>{c.word}</div>
								<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: alpha(N, 0.7)}}>{c.ex}</div>
							</div>
						</div>
					);
				})}
				<Blur on={flying}>
					{CARDS.map((c, i) => (
						<Posed
							key={c.letter}
							pose={(f) => {
								const p = interpolate(f, [c.fly, c.fly + 16], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
								if (f < c.fly || p >= 1) return null;
								const sx = COL.x + 20 + 70 + 14 + 75;
								const sy = COL.y + i * COL.gap + COL.h / 2;
								return {x: sx + (SLOT.x - sx) * p, y: sy + (SLOT.y - sy) * p - 200 * Math.sin(Math.PI * p), rot: -40 - 60 * p, s: 1.2 - 0.6 * p};
							}}
						>
							{c.icon}
						</Posed>
					))}
				</Blur>
				{/* ── « jamais recapuchonner » ── */}
				{panelOn > 0 ? (
					<div style={{position: 'absolute', left: COL.x, top: COL.y, width: COL.w, height: 480, borderRadius: 44, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, overflow: 'hidden', opacity: panelOn, transform: `scale(${0.9 + 0.1 * panelOn})`}}>
						<div style={{position: 'absolute', left: 30, top: 160}}>
							<VacuNeedle size={360} />
						</div>
						<svg width={190} height={44} viewBox="0 0 190 44" style={{position: 'absolute', left: capX + 40, top: 182}}>
							<path d="M4 6 H164 Q186 22 164 38 H4 Z" fill={alpha(LPI.pink, 0.9)} stroke={N} strokeWidth={5} strokeLinejoin="round" />
						</svg>
						<NoSign at={RECAP} cx={385} cy={204} r={150} />
					</div>
				) : null}
				<Note at={RECAP + 4} to={LES - 6} y={1040} x={COL.x + 20} size={46} tone={LPI.pink}>
					jamais recapuchonner !
				</Note>
				{/* ── le sac DASRI : les déchets souillés tombent dedans (dessinés derrière le sac) ── */}
				{ITEMS.map((it) => {
					if (frame < it.pop) return null;
					const fl = interpolate(frame, [it.fall, it.fall + 14], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
					if (fl >= 1) return null;
					const x = it.x + (MOUTH.x - 65 - it.x) * fl;
					const y = 400 + (MOUTH.y + 10 - 400) * fl;
					return (
						<div key={it.x} style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, it.pop) * (1 - 0.3 * fl)}) rotate(${fl * 40}deg)`}}>
							{it.node}
						</div>
					);
				})}
				{frame >= bagIn ? (
					<div style={{position: 'absolute', left: BAG.x, top: BAG.y, transform: `scale(${popAt(frame, bagIn) * (1 + bagBump)})`, transformOrigin: '50% 100%'}}>
						<DasriBag size={BAG.size} />
					</div>
				) : null}
				<Note at={OPCT - 2} to={LES - 6} y={1180} size={42}>
					OPCT = piquants, coupants, tranchants
				</Note>
				<Note at={RISQ - 4} y={1180} size={46}>
					DASRI = déchets à risque infectieux
				</Note>
			</Camera>
			<Sfx name="whoosh" at={IMP + 2} volume={0.08} />
			{[PIQ, COUP, TRANCH].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.07} />
			))}
			{CARDS.map((c) => (
				<Sfx key={c.letter} name="whoosh" at={c.fly} volume={0.06} />
			))}
			{landed.map((t) => (
				<Sfx key={t} name="impact" at={t} volume={0.06} />
			))}
			<Sfx name="whoosh" at={JAMAIS - 4} volume={0.05} />
			<Sfx name="buzz" at={RECAP} volume={0.06} dur={14} />
			<Sfx name="stamp" at={RECAP} volume={0.1} />
			<Sfx name="pop" at={bagIn} volume={0.08} />
			<Sfx name="pop" at={SOUIL - 2} volume={0.08} />
			<Sfx name="whoosh" at={VONT - 2} volume={0.06} />
			<Sfx name="pop" at={SAC} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP : LE PLATEAU EST PRÊT ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const PREL = at('outro', 'prélèvement,');
	const HYG = at('outro', 'hygiène,');
	const FIN = at('outro', 'fin');
	const FAM = at('outro', 'familles…');
	const PRET = at('outro', 'prêt');
	const show = [PREL - 4, HYG - 4, FIN - 4];
	return (
		<AbsoluteFill>
			<Bg fam={0} />
			<Camera punches={[PREL + 1, HYG + 1, FIN + 1, FAM + 1, PRET + 1]} strength={0.03}>
				<Big from={-2} text={'Ton *plateau*'} size={124} y={170} center />
				<Tray show={show} land={(g, k) => show[g] + 2 + k * 3} glow={[FAM, FAM + 4, FAM + 8]} check={show.map((t) => t + 18)} />
				<Burst at={PRET} x={540} y={980} r={520} n={18} />
				<Confetti at={PRET} x={540} y={900} n={70} />
			</Camera>
			{show.map((t, g) => (
				<Sfx key={g} name="whoosh" at={t} volume={0.06} />
			))}
			{show.map((t, g) => (
				<Sfx key={`c${g}`} name="ding" at={t + 18} volume={0.06} />
			))}
			<Sfx name="impact" at={PRET} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ COMPTEUR « MATÉRIEL n / 13 » ═══════════════════════════════ */
/** Images absolues où chaque objet est présenté (13 objets). */
export const itemMarks = () => [
	abs('prelevement', "l'aiguille"),
	abs('prelevement', 'corps'),
	abs('prelevement', "l'unité"),
	abs('tubes', 'tubes'),
	abs('mains', 'solution'),
	abs('mains', 'gants'),
	abs('bras', 'garrot'),
	abs('bras', "l'antiseptique,"),
	abs('bras', 'compresse'),
	abs('fin', 'compresse,'),
	abs('fin', 'pansement,'),
	abs('dechets', 'collecteur'),
	abs('dechets', 'sac'),
];
