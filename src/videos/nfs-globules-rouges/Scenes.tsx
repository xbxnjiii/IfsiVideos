// « La NFS 1/2 : les globules rouges » (n° 67, série « le tube violet », directives Instagram du 20/11/2026) : le sujet
// et l'enjeu dès l'image 0 (« La NFS : les globules rouges », compteur 0/4, le tube violet, la fiche de 4 lignes), ≈ 50 s,
// 1re info clé avant 15 s. Les 4 lignes : hématies, hémoglobine, hématocrite, VGM, chacune avec sa carte de normes
// adultes (tableau fourni par le propriétaire). Ajout : un VGM bas (petits globules) fait d'abord penser à un manque de
// fer. Fin : récap + annonce de la partie 2 (globules blancs, plaquettes). Pas d'appel à l'action (retiré à la demande).
// Sources : tableau de normes du propriétaire (adulte) ; HAS, « Choix des examens du métabolisme du fer en cas de
// suspicion de carence en fer » (2011) pour la microcytose ; OMS, seuils d'anémie (Hb < 13 g/dL H, < 12 g/dL F).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, ease} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {Sparkles} from '../../brand/hands';
import {Camera, Confetti} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, Platelet, RedCell, Tube, WhiteCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const VIOLET = CAP.edta;
const NORM_Y = 1390;

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

const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number}> = ({at: t0, to, up = true, x, y, size = 110}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: `translateY(${(up ? -1 : 1) * 10 * Math.sin(f / 3)}px)`}}>{up ? '↑' : '↓'}</div>} />
	</Pop>
);

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const Norms: React.FC<{at: number; to?: number; rows: string[][]; note?: string; y?: number}> = ({at: t0, to, rows, note, y = NORM_Y}) => (
	<Pop at={t0} to={to} x={540} y={y}>
		<NormCard rows={rows} note={note} />
	</Pop>
);

/** Pastille de série en haut (dès l'image 0). */
const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 18, height: 24, borderRadius: 5, background: VIOLET, border: `3px solid ${N}`}} />
		LE TUBE VIOLET · NFS 1/2
	</div>
);

/** Compteur « n / 4 » en haut à droite ; il rebondit sur le mot du numéro. */
const Counter: React.FC<{n: number; bump?: number; done?: boolean}> = ({n, bump = -100, done}) => {
	const frame = useCurrentFrame();
	const k = frame >= bump ? popAt(frame, bump) : 1;
	const s = frame >= bump && frame < bump + 20 ? 0.85 + 0.15 * k + 0.12 * Math.sin(((frame - bump) / 20) * Math.PI) : 1;
	return (
		<div style={{position: 'absolute', left: 900, top: 250, transform: `translate(-50%, -50%) scale(${s})`, padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{n} / 4
		</div>
	);
};

/** Fiche « NFS · globules rouges » : 4 lignes ; `hl` = ligne surlignée, `checked` = lignes cochées. */
const ROWS = ['Hématies', 'Hémoglobine', 'Hématocrite', 'VGM'];
const RedSheet: React.FC<{hl?: number; checked?: number; width?: number; big?: boolean}> = ({hl = -1, checked = 0, width = 500, big = false}) => (
	<div style={{width, boxSizing: 'border-box', borderRadius: 30, background: '#fff', border: `6px solid ${N}`, boxShadow: SHADOW, padding: '18px 20px'}}>
		<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: big ? 30 : 24, letterSpacing: '0.12em', color: alpha(N, 0.7)}}>NFS · GLOBULES ROUGES</div>
		{ROWS.map((r, i) => (
			<div key={r} style={{marginTop: big ? 14 : 10, height: big ? 86 : 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderRadius: 14, background: i === hl ? alpha(LPI.pink, 0.85) : alpha(LPI.sky, i % 2 ? 0.25 : 0.5)}}>
				<div style={{flex: 1, fontFamily: FONT.body, fontWeight: 900, fontSize: big ? 46 : 34, color: N}}>{r}</div>
				{i < checked ? (
					<div style={{width: big ? 56 : 44, height: big ? 56 : 44, borderRadius: 30, background: LPI.blue, border: `4px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: big ? 34 : 26}}>✓</div>
				) : (
					<div style={{width: big ? 120 : 90, height: 12, borderRadius: 6, background: alpha(N, 0.25)}} />
				)}
			</div>
		))}
	</div>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const NFS = at('intro', 'nfs');
	const QUATRE = at('intro', 'quatre');
	const ROUGES = at('intro', 'rouges…');
	const ANEM = at('intro', 'anémie');
	const CACHER = at('intro', 'cacher');
	const LIRE = at('intro', 'lire');
	const cells = [0, 1, 2, 3, 4];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter n={0} />
			<Camera punches={[NFS + 1, QUATRE + 1, ROUGES + 1, ANEM + 1, LIRE + 1]} shakes={[ANEM + 3]} strength={0.03}>
				<Big from={-60} text={'La *NFS* :\nles globules\n*rouges*'} size={100} y={190} />
				<Live
					render={(f) => {
						const shake = f >= ROUGES - 4 && f < ROUGES + 20 ? Math.sin(f * 2.2) * 7 : Math.sin(f / 9) * 2;
						return (
							<div style={{position: 'absolute', left: 230, top: 1000, transform: `translate(-50%, -50%) rotate(${shake}deg)`}}>
								<Tube size={170} cap={VIOLET} label="EDTA" level={0.74} />
							</div>
						);
					}}
				/>
				{/* les globules rouges sortent du tube */}
				{cells.map((i) => (
					<Live
						key={i}
						render={(f) => {
							const t0 = ROUGES - 6 + i * 3;
							if (f < t0) return null;
							const k = interpolate(f, [t0, t0 + 14], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
							const tx = [120, 330, 220, 380, 90][i];
							const ty = [1380, 1380, 1520, 1560, 1560][i];
							const pale = f >= ANEM && i === 2 ? interpolate(f, [ANEM, ANEM + 12], [0, 1], clamp) : 0;
							return (
								<div style={{position: 'absolute', left: 230 + (tx - 230) * k, top: 860 + (ty - 860) * k, transform: `translate(-50%, -50%) scale(${0.3 + 0.7 * k}) rotate(${f * 1.5 + i * 40}deg)`, filter: `saturate(${1 - 0.8 * pale}) brightness(${1 + 0.4 * pale})`}}>
									<RedCell size={i === 2 ? 150 : 110} />
								</div>
							);
						}}
					/>
				))}
				<Sparkles at={4} x={230} y={860} r={150} />
				<Live
					render={(f) => {
						const hl = f >= LIRE - 4 ? Math.floor(interpolate(f, [LIRE - 4, LIRE + 26], [0, 3.99], clamp)) : f >= QUATRE ? Math.floor(interpolate(f, [QUATRE, QUATRE + 20], [0, 3.99], clamp)) : -1;
						return (
							<div style={{position: 'absolute', left: 700, top: 1000, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 14) * 1}deg)`}}>
								<RedSheet hl={f >= QUATRE + 22 && f < LIRE - 4 ? -1 : hl} />
							</div>
						);
					}}
				/>
				<Chip at={QUATRE - 2} to={ANEM - 6} x={700} y={1330} tone={LPI.pink} size={46}>
					4 lignes
				</Chip>
				<Stamp at={ANEM} x={700} y={1360} text="ANÉMIE ?" size={78} />
				<Note at={CACHER + 6} to={1e9} y={1520} x={480} size={36}>
					tu sais les lire ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="pop" at={ROUGES - 4} volume={0.2} />
			<Sfx name="stamp" at={ANEM} volume={0.4} />
			<Sfx name="ding" at={LIRE} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · HÉMATIES ═══════════════════════════════ */
export const Hematies: React.FC = () => {
	const UN = at('hematies', 'un');
	const HEM = at('hematies', 'hématies');
	const GR = at('hematies', 'globules');
	const TRANS = at('hematies', 'transportent');
	const POUM = at('hematies', 'poumons');
	const CORPS = at('hematies', 'corps');
	const VIVENT = at('hematies', 'vivent');
	const JOURS = at('hematies', 'jours');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter n={1} bump={UN} />
			<Camera punches={[HEM + 1, GR + 1, TRANS + 1, VIVENT + 1]} strength={0.03}>
				<Big from={HEM - 4} text={'Les *hématies*'} size={108} y={330} />
				<Pop at={HEM} to={TRANS - 6} x={540} y={800}>
					<Live render={(f) => <div style={{transform: `rotate(${f * 0.8}deg)`}}><RedCell size={300} /></div>} />
				</Pop>
				<Chip at={GR} x={330} y={530} tone={LPI.pink}>
					= globules rouges
				</Chip>
				<Chip at={GR + 12} x={820} y={530} size={34}>
					= érythrocytes
				</Chip>
				{/* elles transportent l'oxygène des poumons vers le corps */}
				<Live
					render={(f) => {
						if (f < TRANS - 4) return null;
						const o = fadeIn(f, TRANS - 4, 8);
						return (
							<div style={{position: 'absolute', left: 0, top: 620, width: 1080, height: 300, opacity: o}}>
								<div style={{position: 'absolute', left: 120, right: 120, top: 70, height: 160, background: alpha('#F3C3C8', 0.9), borderTop: `7px solid ${N}`, borderBottom: `7px solid ${N}`}} />
								{[0, 1, 2, 3].map((k) => {
									const t = (f / 70 + k / 4) % 1;
									return (
										<div key={k} style={{position: 'absolute', left: 150 + t * 680, top: 90}}>
											<RedCell size={110} />
											<div style={{position: 'absolute', right: -22, top: -18, width: 54, height: 54, borderRadius: 27, background: '#fff', border: `4px solid ${LPI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 22, color: LPI.blue, opacity: 1 - t * 0.85}}>O₂</div>
										</div>
									);
								})}
							</div>
						);
					}}
				/>
				<Chip at={POUM} x={190} y={970} size={38}>
					poumons
				</Chip>
				<Chip at={CORPS - 4} x={860} y={970} size={38}>
					tout le corps →
				</Chip>
				<Chip at={VIVENT} x={540} y={1140} tone={LPI.pink} size={56}>
					≈ 120 jours de vie
				</Chip>
				<Norms at={JOURS + 2} rows={[['Homme', '4,2 – 5,7 millions / mm³'], ['Femme', '4,0 – 5,3 millions / mm³']]} />
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={GR} volume={0.15} />
			<Sfx name="whoosh" at={TRANS} volume={0.12} />
			<Sfx name="ding" at={VIVENT} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · HÉMOGLOBINE ═══════════════════════════════ */
export const Hemoglobine: React.FC = () => {
	const DEUX = at('hemoglobine', 'deux');
	const HB = at('hemoglobine', "l'hémoglobine");
	const PROT = at('hemoglobine', 'protéine');
	const OXY = at('hemoglobine', "l'oxygène");
	const BASSE = at('hemoglobine', 'basse');
	const ANEM = at('hemoglobine', 'anémie');
	const dots: number[][] = [];
	for (let i = 0; i < 18; i++) dots.push([60 + ((i * 37) % 280), 70 + ((i * 53) % 260)]);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter n={2} bump={DEUX} />
			<Camera punches={[HB + 1, OXY + 1, BASSE + 1, ANEM + 1]} strength={0.03}>
				<Big from={HB - 4} text={"*L'hémoglobine*"} size={104} y={330} />
				<Live
					render={(f) => {
						const low = interpolate(f, [BASSE, BASSE + 20], [0, 1], ease);
						return (
							<div style={{position: 'absolute', left: 540 - 200, top: 500, width: 400, height: 400}}>
								<div style={{filter: `saturate(${1 - 0.6 * low}) brightness(${1 + 0.25 * low})`}}>
									<RedCell size={400} />
								</div>
								<svg width={400} height={400} viewBox="0 0 400 400" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
									{dots.map(([x, y], i) => {
										const show = f >= HB + i && i < 18 - 12 * low;
										if (!show) return null;
										return (
											<g key={i} transform={`translate(${x} ${y})`}>
												<circle r={13} fill="#7A1426" stroke={N} strokeWidth={2.5} />
												{f >= OXY + (i % 6) * 2 ? <circle cx={13} cy={-12} r={8} fill="#fff" stroke={LPI.blue} strokeWidth={3} /> : null}
											</g>
										);
									})}
								</svg>
							</div>
						);
					}}
				/>
				<PTag at={PROT} to={BASSE - 4} x={830} y={1010} px={600} py={760}>
					une protéine
				</PTag>
				<Chip at={OXY} to={BASSE - 4} x={290} y={1010} size={40}>
					porte l'O₂
				</Chip>
				<Arrow at={BASSE} up={false} x={860} y={700} />
				<Chip at={ANEM - 2} x={540} y={1060} tone={LPI.pink} size={64}>
					= une anémie
				</Chip>
				<Fly at={ANEM + 2} x={160} y={1170} from="left" to="left">
					<Patient size={200} mood="mal" pale={1} />
				</Fly>
				<Norms at={BASSE + 4} rows={[['Homme', '14 – 18 g/dL'], ['Femme', '12 – 15 g/dL']]} />
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={OXY} volume={0.15} />
			<Sfx name="buzz" at={BASSE + 8} volume={0.18} />
			<Sfx name="impact" at={ANEM} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · HÉMATOCRITE ═══════════════════════════════ */
export const Hematocrite: React.FC = () => {
	const TROIS = at('hematocrite', 'trois');
	const HT = at('hematocrite', "l'hématocrite");
	const PLACE = at('hematocrite', 'place');
	const GR = at('hematocrite', 'globules');
	const VOL = at('hematocrite', 'volume');
	const HAUT = at('hematocrite', 'haut');
	const POLY = at('hematocrite', 'polyglobulie');
	const TROP2 = at('hematocrite', 'trop', 2);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter n={3} bump={TROIS} />
			<Camera punches={[HT + 1, PLACE + 1, HAUT + 1, POLY + 1]} strength={0.03}>
				<Big from={HT - 4} text={"*L'hématocrite*"} size={104} y={330} />
				{/* tube tassé : globules en bas, plasma au-dessus */}
				<Fly at={PLACE - 6} x={260} y={860} from="left" to="left">
					<Live render={(f) => <Tube size={140} cap={VIOLET} level={0.86} serum={interpolate(f, [PLACE, PLACE + 24], [0, 1], ease)} split={0.55} />} />
				</Fly>
				<PTag at={GR} to={HAUT - 4} x={690} y={1010} px={300} py={1000}>
					globules rouges ≈ 45 %
				</PTag>
				<PTag at={VOL} to={HAUT - 4} x={690} y={680} px={300} py={700}>
					le reste du sang
				</PTag>
				{/* trop haut : polyglobulie */}
				<Fly at={HAUT - 4} x={790} y={860} from="right" to="right">
					<Live render={(f) => <Tube size={130} cap={VIOLET} level={0.86} serum={1} split={interpolate(f, [HAUT, HAUT + 20], [0.55, 0.3], ease)} />} />
				</Fly>
				<Arrow at={HAUT + 4} x={950} y={700} />
				<Chip at={POLY} x={540} y={1170} tone={LPI.pink} size={50}>
					polyglobulie
				</Chip>
				<Note at={TROP2} y={1240} size={34}>
					trop de globules rouges
				</Note>
				<Norms at={HAUT - 6} rows={[['Homme', '40 – 52 %'], ['Femme', '37 – 46 %']]} y={NORM_Y + 70} />
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="whoosh" at={PLACE} volume={0.12} />
			<Sfx name="pop" at={HAUT} volume={0.15} />
			<Sfx name="ding" at={POLY} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · VGM ═══════════════════════════════ */
export const Vgm: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('vgm', 'quatre');
	const VGM = at('vgm', 'vgm');
	const VOL = at('vgm', 'volume');
	const TAILLE = at('vgm', 'taille');
	const PETITS = at('vgm', 'petits');
	const FER = at('vgm', 'fer');
	const focus = interpolate(frame, [PETITS - 2, PETITS + 10], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter n={4} bump={QUATRE} />
			<Camera punches={[VGM + 1, TAILLE + 1, PETITS + 1, FER + 1]} strength={0.03}>
				<Big from={VGM - 4} text={'Le *VGM*'} size={120} y={330} />
				<Note at={VOL} y={500} size={44}>
					volume globulaire moyen
				</Note>
				{[0.6, 1, 1.4].map((s, i) => (
					<Pop key={i} at={VOL + i * 5} x={230 + i * 310} y={790}>
						<div style={{width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 0 ? 1 : 1 - 0.6 * focus, transform: `scale(${i === 0 ? 1 + 0.25 * focus : 1})`}}>
							<RedCell size={160 * s} />
						</div>
					</Pop>
				))}
				{['petits', 'normaux', 'gros'].map((w, i) => (
					<Pop key={w} at={TAILLE + 6 + i * 4} x={230 + i * 310} y={960}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, opacity: i === 0 ? 1 : 1 - 0.6 * focus}}>{w}</div>
					</Pop>
				))}
				<Chip at={FER - 6} x={540} y={1110} tone={LPI.pink} size={48}>
					→ souvent un manque de fer
				</Chip>
				<Norms at={TAILLE + 16} rows={[['', '80 – 100 fL']]} note="fL (femtolitre) : un volume minuscule" y={NORM_Y + 40} />
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="pop" at={TAILLE} volume={0.15} />
			<Sfx name="whoosh" at={PETITS} volume={0.12} />
			<Sfx name="ding" at={FER - 6} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN : RÉCAP + PARTIE 2 ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const W = [at('fin', 'hématies'), at('fin', 'hémoglobine'), at('fin', 'hématocrite'), at('fin', 'vgm')];
	const LIGNES = at('fin', 'lignes');
	const PARTIE = at('fin', 'partie');
	const BLANCS = at('fin', 'blancs');
	const PLAQ = at('fin', 'plaquettes');
	const checked = W.filter((t) => frame >= t).length;
	const out = interpolate(frame, [PARTIE - 8, PARTIE + 4], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter n={4} done bump={LIGNES} />
			<Camera punches={[...W.map((t) => t + 1), PARTIE + 1]} strength={0.025}>
				<Big from={-2} text={'Les globules\n*rouges*'} size={104} y={190} />
				<div style={{position: 'absolute', left: 540, top: 820 - out * 140, transform: `translate(-50%, -50%) scale(${1 - out * 0.3})`}}>
					<RedSheet big width={800} checked={checked} hl={checked > 0 && checked < 4 ? checked - 1 : -1} />
				</div>
				<Confetti at={LIGNES} />
				{/* partie 2 */}
				<Pop at={PARTIE - 2} x={540} y={1230}>
					<div style={{width: 900, boxSizing: 'border-box', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: LPI.sky}}>À SUIVRE · NFS 2/2</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.paper, lineHeight: 1.1}}>
								globules <span style={{color: LPI.pink}}>blancs</span>
								<br />+ plaquettes
							</div>
						</div>
						<Live render={(f) => (f >= BLANCS - 4 ? <div style={{transform: `scale(${popAt(f, BLANCS - 4)})`}}><WhiteCell size={130} /></div> : <div style={{width: 130}} />)} />
						<Live render={(f) => (f >= PLAQ - 4 ? <div style={{transform: `scale(${popAt(f, PLAQ - 4)})`}}><Platelet size={100} /></div> : <div style={{width: 100}} />)} />
					</div>
				</Pop>
			</Camera>
			{W.map((t, i) => (
				<Sfx key={i} name="pop" at={t} volume={0.18} />
			))}
			<Sfx name="ding" at={LIGNES} volume={0.25} />
			<Sfx name="whoosh" at={PARTIE - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
