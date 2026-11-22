// « Le tube bleu : TCA, fibrinogène, D-dimères » (n° 76, série « les tubes », directives Instagram du 20/11/2026) : sujet +
// enjeu dès l'image 0 (titre, compteur 0/3, la seringue d'héparine et le ratio du TCA, un caillot caché).
// 1 · le TCA (temps de céphaline activée, comparé à un témoin : rapport < 1,2 ; sous héparine non fractionnée, cible souvent
// 1,5 – 2,5 selon le protocole ; HBPM : on dose l'anti-Xa, à l'écran) ; 2 · le fibrinogène (la protéine qui forme le filet du
// caillot, 2 – 4 g/L ; bas : hémorragie ; haut : inflammation) ; 3 · les D-dimères (morceaux de caillot qui se dissout ;
// < 500 µg/L : phlébite / embolie très peu probable ; au-dessus : d'autres examens ; seuil = âge × 10 après 50 ans, à
// l'écran). Fin : le tube bleu terminé. Pas d'appel à l'action.
// Sources : référentiels de biologie médicale (TCA rapport < 1,2 ; fibrinogène 2 – 4 g/L) ; HAS / ANSM (héparines : TCA
// 1,5 – 2,5 × témoin ou anti-Xa selon le protocole) ; ESC 2019 embolie pulmonaire (D-dimères < 500 µg/L, seuil ajusté à l'âge).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note, RowCard, ease} from '../../brand/bold';
import {FeverIcon, LegIcon, SyringeIcon} from '../../brand/icons';
import {Camera, Confetti} from '../../brand/motion3';
import {BloodDrop} from '../../brand/nose';
import {Chip, Counter, PINK_BG, Pop, SeriesPill, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, RedCell, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const BLEU = CAP.citrate;
const Pill = () => <SeriesPill cap={BLEU} label="LE TUBE BLEU · TCA · D-DIMÈRES" />;
const fr = (t: number, d = 1) => t.toFixed(d).replace('.', ',');

const Drop: React.FC<{r: number}> = ({r}) => (
	<svg width={r * 2.4} height={r * 2.8} viewBox={`${-r * 1.2} ${-r * 1.6} ${r * 2.4} ${r * 2.8}`} style={{overflow: 'visible'}}>
		<BloodDrop r={r} />
	</svg>
);

const IconDot: React.FC<{children: React.ReactNode; label: string}> = ({children, label}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div style={{width: 170, height: 170, borderRadius: 85, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, whiteSpace: 'nowrap'}}>{label}</div>
	</div>
);

/** Caillot : globules rouges pris dans le filet de fibrine ; `net` 0 → 1 le filet se tisse, `split` 0 → 1 il se défait en morceaux. */
const Clot: React.FC<{size?: number; net?: number; split?: number}> = ({size = 420, net = 1, split = 0}) => {
	const frame = useCurrentFrame();
	const cells = [
		[0.18, 0.22],
		[0.52, 0.12],
		[0.7, 0.42],
		[0.3, 0.52],
		[0.55, 0.66],
		[0.12, 0.62],
	];
	const threads = ['M5 20 L95 80', 'M10 85 L90 15', 'M50 2 L45 98', 'M2 50 L98 45', 'M20 5 L80 95', 'M2 70 L70 2'];
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			{cells.map(([x, y], i) => {
				const a = (i / cells.length) * Math.PI * 2;
				const d = split * size * 0.32;
				return (
					<div key={i} style={{position: 'absolute', left: x * size + Math.cos(a) * d, top: y * size + Math.sin(a) * d + 4 * Math.sin(frame / 7 + i), transform: `rotate(${i * 40 + split * 90}deg)`}}>
						<RedCell size={size * 0.3} />
					</div>
				);
			})}
			<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{threads.map((d, i) => {
					const len = 130;
					const shown = Math.max(0, Math.min(1, net * threads.length - i));
					return (
						<path
							key={d}
							d={d}
							stroke={LPI.paper}
							strokeWidth={2.6}
							strokeLinecap="round"
							strokeDasharray={split > 0 ? '9 7' : `${len * shown} ${len}`}
							opacity={0.95 * (1 - split * 0.85)}
							filter="drop-shadow(0 0 1px rgba(45,58,90,0.6))"
						/>
					);
				})}
			</svg>
		</div>
	);
};

/** Chronomètre : `sec` affichés, l'aiguille tourne. */
const Timer: React.FC<{sec: number; label: string; tone?: string; size?: number}> = ({sec, label, tone = LPI.blue, size = 260}) => {
	const a = (sec / 60) * 360;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
			<svg width={size} height={size * 1.1} viewBox="0 0 100 110">
				<rect x={44} y={0} width={12} height={10} rx={3} fill={N} />
				<circle cx={50} cy={60} r={44} fill={LPI.paper} stroke={N} strokeWidth={5} />
				<path d={`M50 60 L50 20 A40 40 0 ${a > 180 ? 1 : 0} 1 ${50 + 40 * Math.sin((a * Math.PI) / 180)} ${60 - 40 * Math.cos((a * Math.PI) / 180)} Z`} fill={alpha(tone, 0.45)} />
				<line x1={50} y1={60} x2={50 + 34 * Math.sin((a * Math.PI) / 180)} y2={60 - 34 * Math.cos((a * Math.PI) / 180)} stroke={N} strokeWidth={4} strokeLinecap="round" />
				<circle cx={50} cy={60} r={4} fill={N} />
			</svg>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, fontVariantNumeric: 'tabular-nums'}}>{Math.round(sec)} s</div>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: alpha(N, 0.8)}}>{label}</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const HEP = at('intro', 'héparine,');
	const CHIFFRE = at('intro', 'chiffre');
	const BONNE = at('intro', 'bonne');
	const TCA = at('intro', 'tca.');
	const TUBE = at('intro', 'tube');
	const CAILLOT = at('intro', 'caillot');
	const CONN = at('intro', 'connais');
	const ratio = frame < CHIFFRE ? 1.0 : interpolate(frame, [CHIFFRE, BONNE + 6], [1.0, 1.9], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[]} total={3} />
			<Camera punches={[HEP + 1, TCA + 1, CAILLOT + 1]} shakes={[CAILLOT + 3]} strength={0.03}>
				<Big from={-60} text={'Le *TCA*\net le tube *bleu*'} size={100} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 230, top: 760, transform: `translate(-50%, -50%) rotate(${-20 + Math.sin(f / 9) * 4}deg)`}}>
							<SyringeIcon size={230} />
						</div>
					)}
				/>
				<Chip at={-12} x={230} y={940} tone={LPI.paper} size={34}>
					héparine
				</Chip>
				<Pop at={-12} x={700} y={760}>
					<div style={{padding: '20px 34px', borderRadius: 36, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.12em', color: LPI.sky}}>TCA · RAPPORT</div>
						<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: f >= BONNE ? LPI.sky : LPI.paper, fontVariantNumeric: 'tabular-nums'}}>{fr(ratio)}</div>} />
					</div>
				</Pop>
				<Chip at={BONNE} to={TUBE - 4} x={700} y={940} tone={LPI.blue} size={36}>
					dose bonne ?
				</Chip>
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 280, top: 1250, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 9) * 3}deg)`}}>
							<Tube size={110} cap={BLEU} level={0.72} />
						</div>
					)}
				/>
				<Pop at={CAILLOT - 4} x={700} y={1250}>
					<div style={{position: 'relative'}}>
						<Clot size={300} />
						<div style={{position: 'absolute', right: -30, top: -40, fontFamily: FONT.title, fontWeight: 900, fontSize: 110, color: LPI.pink, WebkitTextStroke: `4px ${N}`}}>?</div>
					</div>
				</Pop>
				<Note at={CONN - 6} y={1520} size={44}>
					tu les connais ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={TCA} volume={0.18} />
			<Sfx name="buzz" at={CAILLOT} volume={0.2} />
			<Sfx name="ding" at={CONN} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE TCA ═══════════════════════════════ */
export const Tca: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('tca', 'un');
	const CEPH = at('tca', 'céphaline');
	const COMP = at('tca', 'compare');
	const TEMOIN = at('tca', 'témoin.');
	const NORMAL = at('tca', 'normal');
	const DEUX = at('tca', 'deux.');
	const HEP = at('tca', 'héparine,');
	const VISE = at('tca', 'vise');
	const PROTO = at('tca', 'protocole');
	const pat = interpolate(frame, [COMP, TEMOIN + 10], [0, 33], clamp) + (frame >= HEP ? interpolate(frame, [HEP, VISE + 20], [0, 30], ease) : 0);
	const tem = interpolate(frame, [COMP + 6, TEMOIN + 10], [0, 32], clamp);
	const ratio = tem > 0 ? pat / Math.max(tem, 1) : 0;
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[UN, 1]]} total={3} />
			<Camera punches={[CEPH + 1, TEMOIN + 1, DEUX + 1, VISE + 1]} strength={0.03}>
				<Big from={UN - 2} text={'Le *TCA*'} size={130} y={330} />
				<Chip at={CEPH - 4} x={540} y={540} tone={LPI.paper} size={38}>
					temps de céphaline activée
				</Chip>
				<Pop at={COMP - 4} x={300} y={830}>
					<Live render={() => <Timer sec={pat} label="patient" tone={LPI.pink} />} />
				</Pop>
				<Pop at={TEMOIN - 6} x={780} y={830}>
					<Live render={() => <Timer sec={tem} label="témoin" />} />
				</Pop>
				<Pop at={NORMAL - 4} x={540} y={1150}>
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'baseline', gap: 16, padding: '14px 34px', borderRadius: 32, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
								<span style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: LPI.sky}}>RAPPORT</span>
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 76, color: f >= HEP ? LPI.pink : LPI.paper, fontVariantNumeric: 'tabular-nums'}}>{fr(Math.max(1, ratio))}</span>
							</div>
						)}
					/>
				</Pop>
				<Pop at={DEUX - 4} x={540} y={1310}>
					<NormCard rows={[['normal', '< 1,2'], ['héparine', '1,5 – 2,5 (souvent)']]} />
				</Pop>
				<Note at={PROTO - 4} y={1490} size={30}>
					selon le protocole · HBPM : on dose l'anti-Xa
				</Note>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="tick" at={COMP} volume={0.12} />
			<Sfx name="ding" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={VISE} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE FIBRINOGÈNE ═══════════════════════════════ */
export const Fibrinogene: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('fibrinogene', 'deux');
	const FIB = at('fibrinogene', 'fibrinogène,');
	const FILET = at('fibrinogene', 'filet');
	const LITRE = at('fibrinogene', 'litre.');
	const BAS = at('fibrinogene', 'bas');
	const HAUT = at('fibrinogene', 'haut');
	const INFL = at('fibrinogene', 'inflammation.');
	const net = interpolate(frame, [FILET - 4, FILET + 30], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 1], [DEUX, 2]]} total={3} />
			<Camera punches={[FIB + 1, FILET + 1, LITRE + 1, BAS + 1, HAUT + 1]} strength={0.03}>
				<Big from={FIB - 4} text={'Le *fibrinogène*'} size={104} y={330} />
				<Pop at={FIB} x={540} y={760}>
					<Live render={() => <Clot size={380} net={net} />} />
				</Pop>
				<Chip at={FILET} x={540} y={980} tone={LPI.paper} size={38}>
					le filet du caillot
				</Chip>
				<Pop at={LITRE - 6} x={540} y={1110}>
					<NormCard rows={[['', '2 – 4 g/L']]} />
				</Pop>
				<Pop at={BAS - 2} x={320} y={1340}>
					<IconDot label="trop bas">
						<Drop r={40} />
					</IconDot>
				</Pop>
				<Pop at={INFL - 4} x={760} y={1340}>
					<IconDot label="trop haut">
						<FeverIcon size={110} />
					</IconDot>
				</Pop>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="ding" at={LITRE} volume={0.18} />
			<Sfx name="buzz" at={BAS} volume={0.15} />
			<Sfx name="pop" at={HAUT} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LES D-DIMÈRES ═══════════════════════════════ */
export const Ddimeres: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('ddimeres', 'trois');
	const DD = at('ddimeres', 'd-dimères,');
	const MORC = at('ddimeres', 'morceaux');
	const DISS = at('ddimeres', 'dissoudre.');
	const SOUS = at('ddimeres', 'sous');
	const LITRE = at('ddimeres', 'litre,');
	const PHLEB = at('ddimeres', 'phlébite');
	const PROB = at('ddimeres', 'probable.');
	const AUD = at('ddimeres', 'au-dessus,');
	const EXAM = at('ddimeres', 'examens.');
	const split = interpolate(frame, [MORC - 4, DISS + 16], [0, 1], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 2], [TROIS, 3]]} total={3} />
			<Camera punches={[DD + 1, DISS + 1, LITRE + 1, PROB + 1, AUD + 1]} strength={0.03}>
				<Big from={DD - 4} text={'Les *D-dimères*'} size={110} y={330} />
				<Pop at={DD} x={540} y={720}>
					<Live render={() => <Clot size={330} split={split} />} />
				</Pop>
				<Chip at={MORC} x={540} y={930} tone={LPI.paper} size={36}>
					des morceaux de caillot qui se dissout
				</Chip>
				<Pop at={LITRE - 6} x={540} y={1070}>
					<NormCard rows={[['', '< 500 µg/L']]} />
				</Pop>
				<Pop at={PHLEB - 4} x={540} y={1230}>
					<div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 28px', borderRadius: 30, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<LegIcon size={80} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N, whiteSpace: 'nowrap'}}>phlébite / embolie : très peu probable</div>
					</div>
				</Pop>
				<Chip at={AUD - 2} x={540} y={1380} tone={LPI.pink} size={38}>
					au-dessus : ça ne prouve rien
				</Chip>
				<Note at={EXAM - 4} y={1490} size={32}>
					d'autres examens · après 50 ans : seuil = âge × 10
				</Note>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="whoosh" at={MORC} volume={0.15} />
			<Sfx name="ding" at={LITRE} volume={0.18} />
			<Sfx name="pop" at={PHLEB} volume={0.15} />
			<Sfx name="buzz" at={AUD} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const TCA = at('fin', 'tca,');
	const FIB = at('fin', 'fibrinogène,');
	const DD = at('fin', 'd-dimères');
	const VOILA = at('fin', 'voilà,');
	const SECRET = at('fin', 'secret');
	const rows = [
		{t: TCA, title: 'TCA', sub: '< 1,2 · héparine : 1,5 – 2,5'},
		{t: FIB, title: 'fibrinogène', sub: '2 – 4 g/L'},
		{t: DD, title: 'D-dimères', sub: '< 500 µg/L'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 3]]} total={3} done />
			<Camera punches={[...rows.map((r) => r.t + 1), VOILA + 1]} strength={0.025}>
				<Big from={-2} text={'Le tube *bleu*'} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={440 + i * 190} h={170} badge={String(i + 1)} badgeTone={i ? LPI.pink : LPI.sky} title={r.title} sub={r.sub} subAt={r.t + 4} check={VOILA} size={50} />
				))}
				<Pop at={SECRET - 6} x={540} y={1180}>
					<div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 36px', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<Tube size={60} cap={BLEU} level={0.72} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.paper, whiteSpace: 'nowrap'}}>
							tube bleu : <span style={{color: LPI.pink}}>✓</span>
						</div>
					</div>
				</Pop>
				<Confetti at={SECRET} />
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={VOILA} volume={0.22} />
		</AbsoluteFill>
	);
};
