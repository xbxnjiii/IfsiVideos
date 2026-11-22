// « La charge virale » (n° 71, série « le tube violet », directives Instagram du 20/11/2026) : sujet + enjeu dès l'image 0
// (« La charge virale », compteur 0/4, l'écran du résultat qui descend jusqu'à INDÉTECTABLE). 1 · c'est quoi (quantité de
// virus dans le sang, copies/mL ≠ sérologie = anticorps) ; 2 · VIH (efficacité du traitement, but : indétectable < 50
// copies/mL, I = I) ; 3 · hépatite B (décider de traiter, vérifier le traitement) ; 4 · hépatite C (sérologie + → le virus
// est-il encore là ? après traitement : guérison). Fin + « prochaine vidéo : les médicaments anti-rejet ».
// Sources : CNS / ANRS-MIE, recommandations de prise en charge du VIH (charge virale indétectable < 50 copies/mL ; « I = I »,
// avis du CNS 2015 sur l'absence de transmission sexuelle sous traitement efficace) ; AFEF, recommandations hépatites B et C
// (ADN du VHB pour décider du traitement ; ARN du VHC pour confirmer une hépatite C active et la guérison virologique).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, FlatBg, Live, Note, popAt, RowCard, ease} from '../../brand/bold';
import {PillIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {LiverShape, VirusIcon} from '../../brand/liver';
import {Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const VIOLET = CAP.edta;

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

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue || tone === LPI.navy ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 18, height: 24, borderRadius: 5, background: VIOLET, border: `3px solid ${N}`}} />
		LE TUBE VIOLET · CHARGE VIRALE
	</div>
);

const Counter: React.FC<{steps: [number, number][]; done?: boolean}> = ({steps, done}) => {
	const frame = useCurrentFrame();
	let n = 0;
	let bump = -100;
	for (const [t, v] of steps) if (frame >= t) [n, bump] = [v, t];
	const s = frame >= bump && frame < bump + 20 ? 1 + 0.15 * Math.sin(((frame - bump) / 20) * Math.PI) : 1;
	return (
		<div style={{position: 'absolute', left: 900, top: 250, transform: `translate(-50%, -50%) scale(${s})`, padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{n} / 4
		</div>
	);
};

const fmt = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Écran du résultat : « CHARGE VIRALE » + valeur en copies/mL, ou INDÉTECTABLE. */
const ViralScreen: React.FC<{value: number; undetect?: number; width?: number}> = ({value, undetect = 0, width = 760}) => (
	<div style={{width, boxSizing: 'border-box', borderRadius: 36, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '22px 30px'}}>
		<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.14em', color: LPI.sky}}>CHARGE VIRALE</div>
		<div style={{position: 'relative', height: 110}}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'baseline', gap: 14, opacity: 1 - undetect}}>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 92, color: LPI.pink, fontVariantNumeric: 'tabular-nums'}}>{fmt(value)}</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: LPI.paper}}>copies/mL</div>
			</div>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: undetect, transform: `scale(${0.8 + 0.2 * undetect})`, transformOrigin: 'left center'}}>
				<div style={{padding: '6px 24px', borderRadius: 999, background: LPI.blue, border: `5px solid ${LPI.paper}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.paper}}>INDÉTECTABLE</div>
			</div>
		</div>
	</div>
);

/** Anticorps en Y. */
const Antibody: React.FC<{size?: number; tone?: string; rot?: number}> = ({size = 70, tone = LPI.blue, rot = 0}) => (
	<svg width={size} height={size} viewBox="-30 -30 60 60" style={{overflow: 'visible', transform: `rotate(${rot}deg)`}}>
		<path d="M0 24 V2 M0 2 L-16 -20 M0 2 L16 -20" stroke={N} strokeWidth={11} strokeLinecap="round" fill="none" />
		<path d="M0 24 V2 M0 2 L-16 -20 M0 2 L16 -20" stroke={tone} strokeWidth={6} strokeLinecap="round" fill="none" />
	</svg>
);

/** Essaim de virus dans une zone ; `n` = nombre visible. */
const Swarm: React.FC<{n: number; w: number; h: number; label?: string; size?: number}> = ({n, w, h, label = '', size = 90}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'relative', width: w, height: h}}>
			{[...Array(Math.max(0, Math.round(n)))].map((_, i) => (
				<div key={i} style={{position: 'absolute', left: ((i * 173 + i * i * 41) % (w - size)) + 8 * Math.sin(frame / 7 + i), top: ((i * 97 + i * i * 23) % (h - size)) + 8 * Math.cos(frame / 6 + i), transform: `rotate(${frame * 1.5 + i * 40}deg)`}}>
					<VirusIcon size={size} label={label} />
				</div>
			))}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const IND = at('intro', 'indétectable');
	const VIH = at('intro', 'vih');
	const TRANS = at('intro', 'transmet');
	const SEX = at('intro', 'sexuellement');
	const TUBE = at('intro', 'tube');
	const k = interpolate(frame, [0, IND + 4], [0, 1], {...clamp, easing: (t) => t * t});
	const value = 120000 * Math.pow(1 - k, 3) + 40;
	const undetect = interpolate(frame, [IND, IND + 10], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[]} />
			<Camera punches={[IND + 1, VIH + 1, SEX + 1, TUBE + 1]} strength={0.03}>
				<Big from={-60} text={'La charge\n*virale*'} size={110} y={190} />
				<div style={{position: 'absolute', left: 540, top: 640, transform: 'translate(-50%, -50%)'}}>
					<ViralScreen value={value} undetect={undetect} />
				</div>
				<div style={{position: 'absolute', left: 80, top: 800, opacity: 1 - undetect}}>
					<Swarm n={8 * (1 - k) + 1} w={920} h={360} label="" size={90} />
				</div>
				<Chip at={VIH - 2} x={250} y={900} tone={LPI.pink} size={52}>
					VIH
				</Chip>
				<Pop at={TRANS - 2} x={620} y={950}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 32px', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, lineHeight: 1.1}}>
							ne se transmet plus
							<br />
							<span style={{color: LPI.blue}}>sexuellement</span>
						</div>
					</div>
				</Pop>
				<Stamp at={SEX + 6} x={560} y={1150} text="I = I" size={96} />
				<Pop at={TUBE - 4} x={540} y={1430}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 6) * 6}deg)`}}><Tube size={110} cap={VIOLET} label="EDTA" level={0.72} /></div>} />
				</Pop>
			</Camera>
			<Sfx name="ding" at={IND} volume={0.25} />
			<Sfx name="pop" at={VIH} volume={0.18} />
			<Sfx name="stamp" at={SEX + 6} volume={0.4} />
			<Sfx name="pop" at={TUBE - 4} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · C'EST QUOI ═══════════════════════════════ */
export const Quoi: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('quoi', 'un');
	const QUANT = at('quoi', 'quantité');
	const VIRUS = at('quoi', 'virus');
	const COPIES = at('quoi', 'copies');
	const CONF = at('quoi', 'confondre');
	const SERO = at('quoi', 'sérologie');
	const ANTIC = at('quoi', 'anticorps');
	const out = interpolate(frame, [CONF - 6, CONF + 6], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[UN, 1]]} />
			<Camera punches={[QUANT + 1, COPIES + 1, SERO + 1, ANTIC + 1]} strength={0.03}>
				<Big from={UN - 2} text={"C'est *quoi* ?"} size={110} y={330} />
				{/* une goutte de sang grossie : on compte les virus */}
				<Live
					render={(f) => {
						if (f < QUANT - 6) return null;
						const n = interpolate(f, [VIRUS - 4, COPIES + 10], [0, 9], clamp);
						return (
							<div style={{position: 'absolute', left: 540, top: 820 - out * 60, transform: `translate(-50%, -50%) scale(${popAt(f, QUANT - 6) * (1 - 0.35 * out)})`}}>
								<div style={{width: 560, height: 440, borderRadius: '50%', background: alpha('#F3C3C8', 0.95), border: `8px solid ${N}`, overflow: 'hidden', position: 'relative'}}>
									<div style={{position: 'absolute', left: 70, top: 50}}>
										<Swarm n={n} w={420} h={340} size={80} />
									</div>
								</div>
							</div>
						);
					}}
				/>
				<Chip at={COPIES - 2} to={CONF - 6} x={540} y={1130} tone={LPI.blue} size={46}>
					en copies / mL
				</Chip>
				{/* charge virale (le virus) ≠ sérologie (les anticorps) */}
				<Pop at={CONF - 2} x={290} y={1150}>
					<div style={{width: 420, boxSizing: 'border-box', borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
						<VirusIcon size={120} label="" />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N}}>charge virale</div>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: LPI.blue}}>→ le virus</div>
					</div>
				</Pop>
				<Pop at={SERO - 2} x={790} y={1150}>
					<div style={{width: 420, boxSizing: 'border-box', borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
						<div style={{display: 'flex', gap: 6, height: 120, alignItems: 'center'}}>
							{[0, 1, 2].map((i) => (
								<Antibody key={i} size={80} rot={(i - 1) * 20} />
							))}
						</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N}}>sérologie</div>
						<Live render={(f) => <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: LPI.blue, opacity: f >= ANTIC - 4 ? 1 : 0}}>→ les anticorps</div>} />
					</div>
				</Pop>
				<Pop at={SERO + 2} x={540} y={1150}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.pink}}>≠</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={VIRUS} volume={0.15} />
			<Sfx name="ding" at={COPIES} volume={0.15} />
			<Sfx name="whoosh" at={CONF - 2} volume={0.15} />
			<Sfx name="pop" at={SERO} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE VIH ═══════════════════════════════ */
export const Vih: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('vih', 'deux');
	const VIH = at('vih', 'vih');
	const TRAIT = at('vih', 'traitement');
	const MARCHE = at('vih', 'marche');
	const IND = at('vih', 'indétectable');
	const CINQ = at('vih', 'cinquante');
	const IND2 = at('vih', 'indétectable', 2);
	const INTR = at('vih', 'intransmissible');
	// courbe : la charge virale chute sous traitement (échelle log simplifiée)
	const p = interpolate(frame, [TRAIT, IND + 10], [0, 1], ease);
	const W = 860;
	const H = 380;
	const pts: string[] = [];
	for (let i = 0; i <= 40; i++) {
		const t = i / 40;
		if (t > p) break;
		const y = 40 + (H - 90) * (1 - Math.exp(-4 * t)) * 1.02;
		pts.push(`${40 + t * (W - 80)},${Math.min(H - 40, y)}`);
	}
	const thrY = H - 70;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 1], [DEUX, 2]]} />
			<Camera punches={[VIH + 1, TRAIT + 1, IND + 1, CINQ + 1, INTR + 1]} strength={0.03}>
				<Big from={VIH - 4} text={'Le *VIH*'} size={120} y={330} />
				<Pop at={VIH} to={TRAIT - 6} x={540} y={800}>
					<Live render={(f) => <div style={{transform: `rotate(${f * 1.2}deg)`}}><VirusIcon size={260} label="VIH" /></div>} />
				</Pop>
				<Live
					render={(f) => {
						if (f < TRAIT - 4) return null;
						return (
							<div style={{position: 'absolute', left: 540, top: 800, transform: `translate(-50%, -50%) scale(${popAt(f, TRAIT - 4)})`}}>
								<svg width={W} height={H} style={{overflow: 'visible'}}>
									<rect x={0} y={0} width={W} height={H} rx={30} fill={LPI.paper} stroke={N} strokeWidth={6} />
									{f >= CINQ - 6 ? (
										<>
											<line x1={30} x2={W - 30} y1={thrY} y2={thrY} stroke={LPI.pink} strokeWidth={6} strokeDasharray="16 12" />
											<text x={W - 40} y={thrY - 14} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={N}>
												50 copies/mL
											</text>
										</>
									) : null}
									<polyline points={pts.join(' ')} fill="none" stroke={LPI.blue} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
									<text x={40} y={H + 46} fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={N}>
										début du traitement →
									</text>
								</svg>
							</div>
						);
					}}
				/>
				<Pop at={TRAIT - 2} x={170} y={1120}>
					<div style={{width: 150, height: 150, borderRadius: 75, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<PillIcon size={100} />
					</div>
				</Pop>
				<Chip at={MARCHE - 2} to={IND - 4} x={600} y={1120} tone={LPI.blue} size={42}>
					le traitement marche ?
				</Chip>
				<Chip at={IND - 2} x={600} y={1120} tone={LPI.blue} size={46}>
					indétectable : &lt; 50
				</Chip>
				<Pop at={IND2 - 4} x={540} y={1340}>
					<div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 36px', borderRadius: 40, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: LPI.pink, whiteSpace: 'nowrap'}}>I = I</div>
						<Live
							render={(f) => (
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: LPI.paper, lineHeight: 1.15}}>
									indétectable
									<br />
									<span style={{opacity: f >= INTR - 4 ? 1 : 0.2, whiteSpace: 'nowrap'}}>= intransmissible</span>
								</div>
							)}
						/>
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="whoosh" at={TRAIT} volume={0.15} />
			<Sfx name="ding" at={IND} volume={0.2} />
			<Sfx name="pop" at={IND2 - 4} volume={0.18} />
			<Sfx name="ding" at={INTR} volume={0.22} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · L'HÉPATITE B ═══════════════════════════════ */
const Liver: React.FC<{virus?: number; label?: string; size?: number}> = ({virus = 0, label = 'B', size = 520}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'relative', width: size, height: size * 0.75}}>
			<svg width={size} height={size * 0.75} viewBox="0 0 100 75" style={{overflow: 'visible'}}>
				<LiverShape x={50} y={40} s={1.05} fill={LPI.pink} />
			</svg>
			{[0, 1, 2, 3, 4].map((i) =>
				i < virus * 5 ? (
					<div key={i} style={{position: 'absolute', left: size * (0.18 + ((i * 0.17) % 0.6)), top: size * (0.12 + ((i * 0.11) % 0.3)) + 6 * Math.sin(frame / 6 + i), transform: `rotate(${frame + i * 50}deg)`}}>
						<VirusIcon size={size * 0.15} label={label} />
					</div>
				) : null,
			)}
		</div>
	);
};

export const Vhb: React.FC = () => {
	const TROIS = at('vhb', 'trois');
	const HEP = at('vhb', "l'hépatite");
	const DEC = at('vhb', 'décider');
	const TRAITER = at('vhb', 'traiter');
	const VERIF = at('vhb', 'vérifier');
	const MARCHE = at('vhb', 'marche');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 2], [TROIS, 3]]} />
			<Camera punches={[HEP + 1, DEC + 1, VERIF + 1]} strength={0.03}>
				<Big from={HEP - 4} text={"L'hépatite *B*"} size={110} y={330} />
				<Pop at={HEP} x={540} y={720}>
					<Liver virus={1} label="B" size={560} />
				</Pop>
				<RowCard at={DEC - 4} y={1000} h={170} badge="?" badgeTone={LPI.sky} title="faut-il traiter ?" sub="selon la charge virale" subAt={TRAITER} size={48} />
				<RowCard at={VERIF - 4} y={1200} h={170} badge="✓" badgeTone={LPI.sky} title="le traitement marche ?" sub="elle doit baisser" subAt={MARCHE} size={48} />
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="whoosh" at={DEC - 4} volume={0.15} />
			<Sfx name="whoosh" at={VERIF - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · L'HÉPATITE C ═══════════════════════════════ */
export const Vhc: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('vhc', 'quatre');
	const HEP = at('vhc', "l'hépatite");
	const SERO = at('vhc', 'sérologie');
	const POS = at('vhc', 'positive');
	const CV = at('vhc', 'charge');
	const LA = at('vhc', 'là');
	const APRES = at('vhc', 'après');
	const GUER = at('vhc', 'guérison');
	const virus = frame >= APRES ? interpolate(frame, [APRES, GUER], [1, 0], clamp) : 1;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} />
			<Camera punches={[HEP + 1, POS + 1, LA + 1, GUER + 1]} strength={0.03}>
				<Big from={HEP - 4} text={"L'hépatite *C*"} size={110} y={330} />
				<Pop at={HEP} x={540} y={700}>
					<Liver virus={virus} label="C" size={520} />
				</Pop>
				<RowCard at={SERO - 4} y={960} h={150} badge="1" badgeTone={LPI.sky} title="sérologie positive" sub="il y a eu contact" subAt={POS} size={44} />
				<RowCard at={CV - 4} y={1130} h={150} badge="2" badgeTone={LPI.sky} title="le virus est encore là ?" sub="la charge virale répond" subAt={LA} size={44} />
				<RowCard at={APRES - 2} y={1300} h={150} badge="3" badgeTone={LPI.sky} title="après le traitement" sub="indétectable = guéri" subAt={GUER - 4} size={44} check={GUER} />
				<Stamp at={GUER + 4} x={760} y={620} text="GUÉRI" size={80} />
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={SERO - 4} volume={0.15} />
			<Sfx name="whoosh" at={CV - 4} volume={0.15} />
			<Sfx name="whoosh" at={APRES - 2} volume={0.15} />
			<Sfx name="stamp" at={GUER + 4} volume={0.35} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const Q1 = at('fin', 'virus');
	const Q2 = at('fin', 'traitement');
	const Q3 = at('fin', 'guéri');
	const REP = at('fin', 'répond');
	const PROCH = at('fin', 'prochaine');
	const MED = at('fin', 'médicaments');
	const rows = [
		{t: Q1, title: 'le virus est-il là ?'},
		{t: Q2, title: 'le traitement marche ?'},
		{t: Q3, title: 'est-ce guéri ?'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 4]]} done />
			<Camera punches={[...rows.map((r) => r.t + 1), REP + 1, PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'La charge\n*virale*'} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={480 + i * 170} h={150} badge="?" badgeTone={LPI.sky} title={r.title} check={REP} size={46} />
				))}
				<Confetti at={REP} />
				<Pop at={PROCH - 2} x={540} y={1180}>
					<div style={{width: 900, boxSizing: 'border-box', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: LPI.sky}}>PROCHAINE VIDÉO</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: LPI.paper, lineHeight: 1.1}}>
								les <span style={{color: LPI.pink}}>anti-rejet</span>
							</div>
						</div>
						<Live render={(f) => <div style={{transform: `scale(${f >= MED - 4 ? popAt(f, MED - 4) : 0.0001})`, background: LPI.paper, borderRadius: 60, padding: 10}}><PillIcon size={100} /></div>} />
					</div>
				</Pop>
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={REP} volume={0.25} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
