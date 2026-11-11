// « Plaie franche ou contuse ? » — série courte « Les plaies » (≈ 34 s, voix Laura, vrais bruitages).
// Accroche « couteau ou portière ? » (situation vécue) : image 0 = les deux cartes + « Couteau ou portière : laquelle
// est la pire ? » ; le couteau tranche le doigt au mot (bruit de planche), la portière claque sur les doigts (vraie
// portière) ; « ? » rose entre les deux. Puis la plaie franche vue de dessus (le couteau trace une fente, bords nets
// surlignés, ça se recolle, points de suture), la plaie contuse (la portière écrase la peau : bords déchiquetés,
// tissus écrasés bleutés, îlots de nécrose + tampon), chute : la portière gagne, « écraser > couper ».
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, Posed, RowCard} from '../../brand/bold';
import {CarDoor, WoundTop} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Finger, WoundTool} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/** Carte blanche avec une étiquette en haut à gauche ; `hl` 0 → 1 : bordure rose (mise en avant), `dim` : s'efface. */
const Panel: React.FC<{w: number; h: number; label: string; hl?: number; dim?: number; children: React.ReactNode}> = ({w, h, label, hl = 0, dim = 0, children}) => (
	<div style={{position: 'relative', width: w, height: h, borderRadius: 44, background: LPI.paper, border: `${6 + 6 * hl}px solid ${hl > 0.5 ? LPI.pink : N}`, boxShadow: SHADOW, overflow: 'hidden', opacity: 1 - 0.55 * dim, boxSizing: 'border-box'}}>
		<div style={{position: 'absolute', left: 22, top: 18, padding: '6px 20px', borderRadius: 999, background: LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, letterSpacing: '0.04em', zIndex: 2}}>{label}</div>
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
	</div>
);

/* ═══════════════════════════════ ACCROCHE : COUTEAU OU PORTIÈRE ? ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const COUTEAU = at('intro', 'couteau');
	const PORTIERE = at('intro', 'portière');
	const DOIGTS = at('intro', 'doigts.');
	const LAQUELLE = at('intro', 'laquelle');
	const PIRE = at('intro', 'pire');
	const SLAM = PORTIERE + 4;
	const CHOP = COUTEAU + 6;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[CHOP + 1, SLAM + 1, LAQUELLE + 1, PIRE + 1]} shakes={[SLAM + 2, PIRE + 2]} strength={0.04}>
				<Big from={-60} text={'Couteau ou portière :\n*laquelle* est la *pire* ?'} size={88} y={140} />
				{/* carte 1 : le couteau */}
				<Fly at={-60} x={540} y={680} from="left" move={[{at: LAQUELLE, s: 1.05, dur: 6}, {at: LAQUELLE + 8, s: 1, dur: 6}]}>
					<Panel w={960} h={430} label="COUTEAU" hl={fadeIn(frame, LAQUELLE, 3) * (1 - fadeIn(frame, LAQUELLE + 10, 3))}>
						<div style={{position: 'relative', width: 560, height: 300, marginTop: 60}}>
							<div style={{position: 'absolute', left: 20, top: 30}}>
								<Live render={(f) => <Finger width={520} cut={fadeIn(f, CHOP, 6)} />} />
							</div>
							<Blur on={frame >= CHOP - 10 && frame <= CHOP + 10}>
								<Posed pose={(f) => ({x: 380, y: interpolate(f, [CHOP - 8, CHOP, CHOP + 10, CHOP + 24], [-120, 70, 70, -60], {...clamp, easing: Easing.inOut(Easing.quad)}), rot: -40, s: 1.2})}>
									<WoundTool kind="knife" size={220} />
								</Posed>
							</Blur>
						</div>
					</Panel>
				</Fly>
				{/* carte 2 : la portière */}
				<Fly at={-60} x={540} y={1170} from="right" move={[{at: LAQUELLE + 10, s: 1.05, dur: 6}, {at: LAQUELLE + 18, s: 1, dur: 6}]}>
					<Panel w={960} h={500} label="PORTIÈRE" hl={fadeIn(frame, LAQUELLE + 10, 3) * (1 - fadeIn(frame, LAQUELLE + 20, 3))}>
						<div style={{marginTop: 40}}>
							<Live render={(f) => <CarDoor width={460} close={interpolate(f, [SLAM - 8, SLAM], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)})} crush={fadeIn(f, SLAM, 6)} />} />
						</div>
					</Panel>
				</Fly>
				{/* « ? » entre les deux */}
				<Live
					render={(f) =>
						f >= PIRE - 2 ? (
							<div style={{position: 'absolute', left: 540, top: 925, transform: `translate(-50%, -50%) scale(${popAt(f, PIRE - 2) * (1 + 0.06 * Math.sin(f / 4))})`}}>
								<div style={{width: 170, height: 170, borderRadius: 85, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: N}}>?</div>
							</div>
						) : null
					}
				/>
				<Burst at={CHOP} x={760} y={700} r={180} n={10} />
				<Burst at={SLAM} x={700} y={1180} r={260} n={14} />
			</Camera>
			<Flash at={SLAM} max={0.3} />
			<Sfx name="whoosh" at={CHOP - 8} volume={0.06} />
			<Sfx name="chop" at={CHOP - 1} volume={0.5} />
			<Sfx name="car-door" at={SLAM - 1} volume={0.55} />
			<Sfx name="pop" at={LAQUELLE} volume={0.07} />
			<Sfx name="pop" at={LAQUELLE + 10} volume={0.07} />
			<Sfx name="ding" at={PIRE - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE FRANCHE ═══════════════════════════════ */
const WT = {x: 540, y: 820, w: 940};
const wk = WT.w / 700;
const wpt = (x: number, y: number) => ({x: WT.x - WT.w / 2 + x * wk, y: WT.y - (420 * wk) / 2 + y * wk});

export const Franche: React.FC = () => {
	const frame = useCurrentFrame();
	const COUTEAU = at('franche', 'couteau');
	const FRANCHE = at('franche', 'franche');
	const BORDS = at('franche', 'bords');
	const NETS = at('franche', 'nets,');
	const REGUL = at('franche', 'réguliers.');
	const RECOL = at('franche', 'recollent');
	const FACIL = at('franche', 'facilement');
	const POINTS = at('franche', 'points');
	const SUTURE = at('franche', 'suture');
	const edge = wpt(470, 176);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[COUTEAU + 1, FRANCHE + 1, NETS + 1, RECOL + 1, POINTS + 1]} strength={0.03}>
				<Big from={-2} to={FRANCHE - 6} text={'Le *couteau*…'} size={136} />
				<Big from={FRANCHE - 4} to={RECOL - 6} text={'Plaie *franche*'} size={136} />
				<Big from={RECOL - 4} to={POINTS - 8} text={'Ça se *recolle*'} size={136} />
				<Big from={POINTS - 6} text={'Quelques\n*points* !'} size={136} />
				<Fly at={-4} x={WT.x} y={WT.y} from="bottom">
					<Live
						render={(f) => (
							<WoundTop
								width={WT.w}
								kind="clean"
								open={interpolate(f, [COUTEAU - 2, COUTEAU + 12, RECOL - 2, FACIL + 8], [0, 1, 1, 0.3], ease)}
								edges={fadeIn(f, BORDS - 2, 6) * (1 - fadeIn(f, RECOL, 8))}
								sutures={interpolate(f, [POINTS - 4, SUTURE + 14], [0, 1], clamp)}
							/>
						)}
					/>
				</Fly>
				{/* le couteau trace la fente */}
				<Blur on={frame >= COUTEAU - 6 && frame <= COUTEAU + 16}>
					<Posed pose={(f) => (f < COUTEAU - 4 || f > COUTEAU + 16 ? null : {x: interpolate(f, [COUTEAU - 4, COUTEAU + 14], [wpt(80, 0).x, wpt(640, 0).x], clamp), y: WT.y - 40, rot: 20, s: 1.3, o: 1 - fadeIn(f, COUTEAU + 10, 6)})}>
						<WoundTool kind="knife" size={240} />
					</Posed>
				</Blur>
				<PointTag at={NETS - 2} to={RECOL - 6} x={720} y={1220} px={edge.x} py={edge.y} size={46}>
					bords nets
				</PointTag>
				<Note at={REGUL - 2} to={RECOL - 6} y={1330} size={44}>
					bien réguliers, comme une ligne droite
				</Note>
				<Stamp at={FACIL} x={540} y={1250} text="FACILE !" size={80} rot={-6} out={POINTS - 8} />
			</Camera>
			<Sfx name="chop" at={COUTEAU} volume={0.35} />
			<Sfx name="pop" at={NETS - 2} volume={0.07} />
			<Sfx name="pop" at={REGUL - 2} volume={0.07} />
			<Sfx name="stamp" at={FACIL} volume={0.1} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={i} name="tick" at={POINTS - 4 + i * 5} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE CONTUSE ═══════════════════════════════ */
export const Contuse: React.FC = () => {
	const frame = useCurrentFrame();
	const PORTIERE = at('contuse', 'portière,');
	const ECRASE = at('contuse', 'écrase.');
	const CONTUSE = at('contuse', 'contuse');
	const BORDS = at('contuse', 'bords');
	const IRREG = at('contuse', 'irréguliers,');
	const TISSUS = at('contuse', 'tissus');
	const ECRASES = at('contuse', 'écrasés…');
	const MOURIR = at('contuse', 'mourir.');
	const NECROSE = at('contuse', 'nécrose.');
	const SLAM = ECRASE;
	const edge = wpt(350, 168);
	const bruise = wpt(150, 120);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.6)}} />
			<Camera punches={[SLAM + 1, CONTUSE + 1, IRREG + 1, ECRASES + 1, MOURIR + 1, NECROSE + 1]} shakes={[SLAM + 2, NECROSE + 2]} strength={0.04}>
				<Big from={-2} to={CONTUSE - 6} text={'La *portière*\nécrase'} size={136} />
				<Big from={CONTUSE - 4} to={MOURIR - 6} text={'Plaie *contuse*'} size={136} />
				<Big from={MOURIR - 4} text={'Des tissus\nqui *meurent*'} size={128} />
				<Fly at={-4} x={WT.x} y={WT.y} from="right">
					<Live
						render={(f) => (
							<WoundTop
								width={WT.w}
								kind="ragged"
								open={interpolate(f, [SLAM + 1, SLAM + 10], [0, 1], ease)}
								edges={fadeIn(f, BORDS - 2, 6) * (1 - fadeIn(f, TISSUS - 4, 8))}
								bruise={interpolate(f, [SLAM + 1, SLAM + 8, TISSUS - 2, ECRASES + 8], [0, 0.35, 0.35, 1], clamp)}
								necrosis={interpolate(f, [MOURIR - 4, NECROSE + 10], [0, 1], ease)}
							/>
						)}
					/>
				</Fly>
				{/* le bord de la portière s'abat sur la peau */}
				<Blur on={frame >= PORTIERE && frame <= SLAM + 22}>
					<Posed
						pose={(f) => {
							if (f < PORTIERE + 2 || f > SLAM + 22) return null;
							const down = interpolate(f, [SLAM - 10, SLAM], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							const up = interpolate(f, [SLAM + 6, SLAM + 20], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							return {x: WT.x, y: 330 + (WT.y - 330) * down - 1200 * up, rot: 0};
						}}
					>
						<div style={{width: 1000, height: 150, borderRadius: 30, background: LPI.blue, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 60, boxSizing: 'border-box'}}>
							<div style={{width: 120, height: 34, borderRadius: 17, background: LPI.paper, border: `5px solid ${N}`}} />
						</div>
					</Posed>
				</Blur>
				<PointTag at={IRREG - 2} to={TISSUS - 6} x={720} y={1230} px={edge.x} py={edge.y} size={46}>
					bords irréguliers
				</PointTag>
				<PointTag at={ECRASES - 2} to={MOURIR - 6} x={360} y={1230} px={bruise.x} py={bruise.y} size={46}>
					tissus écrasés
				</PointTag>
				<Stamp at={NECROSE} x={540} y={1250} text="NÉCROSE" size={86} rot={-6} />
				<Note at={NECROSE + 10} y={1360} size={42}>
					nécrose = des tissus morts
				</Note>
			</Camera>
			<Flash at={SLAM} max={0.35} />
			<Sfx name="whoosh" at={SLAM - 10} volume={0.07} />
			<Sfx name="car-door" at={SLAM - 1} volume={0.5} />
			<Sfx name="pop" at={IRREG - 2} volume={0.07} />
			<Sfx name="pop" at={ECRASES - 2} volume={0.07} />
			<Sfx name="stamp" at={NECROSE} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : LA PORTIÈRE GAGNE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const PORTIERE = at('fin', 'portière');
	const PLAIE = at('fin', 'plaie');
	const ECRASE = at('fin', 'écrase');
	const GRAVE = at('fin', 'grave');
	const COUPE = at('fin', 'coupe.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[PORTIERE + 1, ECRASE + 1, GRAVE + 1, COUPE + 1]} shakes={[PORTIERE + 2]} strength={0.035}>
				<Big from={-2} to={PLAIE - 6} text={'La pire ?\nLa *portière* !'} size={124} {...ON_BLUE} />
				<Big from={PLAIE - 4} text={'*Écraser*,\nc’est pire'} size={124} {...ON_BLUE} />
				<Fly at={-2} out={PLAIE - 6} x={280} y={820} from="left" to="left" move={[{at: PORTIERE, s: 0.85, dur: 8}]}>
					<Panel w={480} h={420} label="COUTEAU" dim={fadeIn(frame, PORTIERE, 8)}>
						<div style={{marginTop: 50}}>
							<WoundTop width={400} kind="clean" />
						</div>
					</Panel>
				</Fly>
				<Fly at={2} out={PLAIE - 6} x={800} y={820} from="right" to="right" move={[{at: PORTIERE, s: 1.1, dur: 8}]}>
					<Panel w={480} h={420} label="PORTIÈRE" hl={fadeIn(frame, PORTIERE, 4)}>
						<div style={{marginTop: 50}}>
							<WoundTop width={400} kind="ragged" bruise={1} necrosis={1} />
						</div>
					</Panel>
				</Fly>
				<Stamp at={PORTIERE + 2} x={800} y={1080} text="LA PIRE !" size={84} rot={-8} out={PLAIE - 6} />
				<RowCard at={ECRASE - 4} y={600} h={330} art={330} title="Une plaie qui écrase" sub="souvent plus grave" subAt={GRAVE - 4} badge="+" badgeTone={LPI.pink} size={56}>
					<WoundTop width={310} kind="ragged" bruise={1} necrosis={0.8} />
				</RowCard>
				<RowCard at={COUPE - 4} y={970} h={330} art={330} title="Une plaie qui coupe" sub="se recolle mieux" subAt={COUPE + 4} badge="−" badgeTone={LPI.sky} from="left" size={56}>
					<WoundTop width={310} kind="clean" sutures={1} open={0.4} />
				</RowCard>
			</Camera>
			<Flash at={PORTIERE} max={0.25} color={LPI.paper} />
			<Sfx name="stamp" at={PORTIERE + 2} volume={0.12} />
			<Sfx name="whoosh" at={PLAIE - 6} volume={0.07} />
			<Sfx name="pop" at={ECRASE - 4} volume={0.08} />
			<Sfx name="pop" at={COUPE - 4} volume={0.08} />
		</AbsoluteFill>
	);
};
