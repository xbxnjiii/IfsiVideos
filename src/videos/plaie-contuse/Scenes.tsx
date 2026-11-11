// « Plaie franche ou contuse ? » — série courte « Les plaies » (≈ 34 s, voix Laura, vrais bruitages).
// Accroche « la chute sur le trottoir » (choisie par le propriétaire ; SANS texte au début) : un monsieur marche, se
// prend le pied dans une dalle, trébuche et tombe sur le menton (vrai bruit de chute) ; la caméra plonge sur son
// menton ; sa plaie (bords déchirés) ≠ la coupure du couteau ; « ? ». Puis la plaie franche vue de dessus (le couteau
// trace une fente, bords nets surlignés, ça se recolle, points de suture), la plaie contuse (le trottoir écrase la
// peau : bords déchiquetés, tissus écrasés bleutés, îlots de nécrose + tampon), chute : « écraser, c'est pire ».
// La v1 (« couteau ou portière ? ») reste dans l'historique git.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, Posed, RowCard} from '../../brand/bold';
import {WoundTop, Walker} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {WoundTool} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/* ═══════════════════════════════ ACCROCHE : LA CHUTE SUR LE TROTTOIR ═══════════════════════════════ */
/** Le marcheur (repère 300 × 600) affiché à WW px, sol à y GROUND ; il pivote autour de ses pieds (FOOT) en tombant. */
const WW = 340;
const WS = WW / 300;
const GROUND = 1240;
const WY = GROUND - (590 - 300) * WS;
const FOOT = {x: 120, y: 585};
const FALL_ROT = 84;
/** Position à l'écran d'un point (px, py) du repère, quand le marcheur centré en x pivote de `rot` degrés. */
const rotPt = (x: number, px: number, py: number, rot: number) => {
	const ox = x - WW / 2 + FOOT.x * WS;
	const oy = WY - WW + FOOT.y * WS;
	const dx = (px - FOOT.x) * WS;
	const dy = (py - FOOT.y) * WS;
	const r = (rot * Math.PI) / 180;
	return {x: ox + dx * Math.cos(r) - dy * Math.sin(r), y: oy + dx * Math.sin(r) + dy * Math.cos(r)};
};
const CHIN_LOCAL = {x: 172 + 39, y: 100 + 50};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TREBUCHE = at('intro', 'trébuche');
	const BOUM = at('intro', 'boum,');
	const MENTON = at('intro', 'menton');
	const TERRE = at('intro', 'terre');
	const PLAIE = at('intro', 'plaie');
	const COUTEAU = at('intro', 'couteau.');
	const POURQUOI = at('intro', 'pourquoi');
	const TRIP = TREBUCHE + 14;
	const FALL = BOUM - 12;
	const xAt = (f: number) => (f < TRIP ? 110 + 4.5 * f : f < FALL ? 110 + 4.5 * TRIP + 3 * (f - TRIP) : 110 + 4.5 * TRIP + 3 * (FALL - TRIP));
	const rotAt = (f: number) => (f < TRIP ? 0 : f < FALL ? 10 + 8 * Math.sin((f - TRIP) / 3) : interpolate(f, [FALL, BOUM], [14, FALL_ROT], {...clamp, easing: Easing.in(Easing.quad)}));
	const xLand = xAt(BOUM);
	const chin = rotPt(xLand, CHIN_LOCAL.x, CHIN_LOCAL.y, FALL_ROT);
	const bump = 110 + 4.5 * TRIP + (288 - 150) * WS;
	const zoom = interpolate(frame, [MENTON - 6, TERRE + 4], [1, 3], {...clamp, easing: Easing.in(Easing.cubic)});
	const sceneOut = fadeIn(frame, PLAIE - 10, 6);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[TRIP + 1, BOUM + 1, MENTON + 1, PLAIE + 1, COUTEAU + 1, POURQUOI + 1]} shakes={[BOUM + 2, POURQUOI + 2]} strength={0.045}>
				{/* le trottoir, la dalle qui dépasse, le monsieur qui trébuche et tombe sur le menton */}
				{sceneOut < 1 ? (
					<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${chin.x}px ${chin.y}px`, opacity: 1 - sceneOut}}>
						<div style={{position: 'absolute', left: -20, right: -20, top: GROUND, height: 240, background: alpha(LPI.sky, 0.6), borderTop: `8px solid ${N}`}} />
						{Array.from({length: 7}, (_, i) => (
							<div key={i} style={{position: 'absolute', left: i * 180 - 20, top: GROUND, width: 6, height: 240, background: alpha(N, 0.25)}} />
						))}
						<div style={{position: 'absolute', left: bump - 40, top: GROUND - 22, width: 170, height: 30, borderRadius: 6, background: LPI.sky, border: `6px solid ${N}`}} />
						<Blur on={frame >= FALL - 2 && frame <= BOUM + 4}>
							<Live
								render={(f) => {
									const x = xAt(f);
									const rot = rotAt(f);
									const ph = Math.PI / 2 + ((Math.min(f, TRIP) - TRIP) * 2 * Math.PI) / 30;
									return (
										<div style={{position: 'absolute', left: x - WW / 2, top: WY - WW, width: WW, height: WW * 2, transform: `rotate(${rot}deg)`, transformOrigin: `${FOOT.x * WS}px ${FOOT.y * WS}px`}}>
											<Walker width={WW} pose={f < TRIP ? 'walk' : 'fall'} phase={ph} cry={fadeIn(f, BOUM, 3)} chin={fadeIn(f, BOUM + 2, 6)} />
										</div>
									);
								}}
							/>
						</Blur>
					</AbsoluteFill>
				) : null}
				<Burst at={BOUM} x={chin.x} y={chin.y} r={260} n={16} />
				{/* sa plaie : bords déchirés… rien à voir avec une coupure de couteau */}
				<Posed
					pose={(f) => {
						if (f < PLAIE - 8) return null;
						const inK = interpolate(f, [PLAIE - 8, PLAIE], [0, 1], ease);
						const mv = interpolate(f, [COUTEAU - 22, COUTEAU - 10], [0, 1], ease);
						return {x: 540, y: 880 - 220 * mv, s: (0.5 + 0.5 * inK) * (1 - 0.3 * mv), o: inK};
					}}
				>
					<WoundTop width={800} kind="ragged" bruise={0.6} />
				</Posed>
				<Posed
					pose={(f) => {
						if (f < COUTEAU - 12) return null;
						const inK = interpolate(f, [COUTEAU - 12, COUTEAU - 2], [0, 1], ease);
						return {x: 540 + 600 * (1 - inK), y: 1180, s: 0.7};
					}}
				>
					<div style={{position: 'relative'}}>
						<WoundTop width={800} kind="clean" />
						<div style={{position: 'absolute', left: 520, top: -150, transform: 'rotate(20deg)'}}>
							<WoundTool kind="knife" size={300} />
						</div>
					</div>
				</Posed>
				<Live
					render={(f) =>
						f >= COUTEAU - 4 ? (
							<div style={{position: 'absolute', left: 540, top: 930, transform: `translate(-50%, -50%) scale(${popAt(f, COUTEAU - 4)})`, fontFamily: FONT.title, fontWeight: 900, fontSize: 160, color: LPI.pink, WebkitTextStroke: `8px ${N}`, paintOrder: 'stroke'}}>
								≠
							</div>
						) : null
					}
				/>
				<Live
					render={(f) =>
						f >= POURQUOI - 2 ? (
							<div style={{position: 'absolute', left: 900, top: 930, transform: `translate(-50%, -50%) scale(${popAt(f, POURQUOI - 2) * (1 + 0.06 * Math.sin(f / 4))})`}}>
								<div style={{width: 170, height: 170, borderRadius: 85, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: N}}>?</div>
							</div>
						) : null
					}
				/>
			</Camera>
			<Flash at={BOUM} max={0.35} />
			<Sfx name="stairs" at={0} volume={0.22} dur={TRIP} />
			<Sfx name="skid" at={TRIP - 2} volume={0.18} dur={20} />
			<Sfx name="fall" at={BOUM - 2} volume={0.55} />
			<Sfx name="whoosh" at={MENTON - 6} volume={0.07} />
			<Sfx name="pop" at={PLAIE - 8} volume={0.08} />
			<Sfx name="chop" at={COUTEAU - 6} volume={0.3} />
			<Sfx name="ding" at={POURQUOI - 2} volume={0.08} />
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
	const PORTIERE = at('contuse', 'trottoir,');
	const ECRASE = at('contuse', 'écrase');
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
				<Big from={-2} to={CONTUSE - 6} text={'Le *trottoir*\nécrase'} size={136} />
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
				{/* le trottoir s'abat sur la peau */}
				<Blur on={frame >= PORTIERE && frame <= SLAM + 22}>
					<Posed
						pose={(f) => {
							if (f < PORTIERE + 2 || f > SLAM + 22) return null;
							const down = interpolate(f, [SLAM - 10, SLAM], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							const up = interpolate(f, [SLAM + 6, SLAM + 20], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							return {x: WT.x, y: 330 + (WT.y - 330) * down - 1200 * up, rot: 0};
						}}
					>
						<div style={{position: 'relative', width: 1000, height: 170, borderRadius: 18, background: LPI.sky, border: `7px solid ${N}`, boxShadow: SHADOW, overflow: 'hidden'}}>
							{Array.from({length: 26}, (_, i) => (
								<div key={i} style={{position: 'absolute', left: (i * 137) % 980, top: 20 + ((i * 53) % 120), width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6, borderRadius: '50%', background: alpha(N, 0.25)}} />
							))}
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
			<Sfx name="fall" at={SLAM - 2} volume={0.4} />
			<Sfx name="pop" at={IRREG - 2} volume={0.07} />
			<Sfx name="pop" at={ECRASES - 2} volume={0.07} />
			<Sfx name="stamp" at={NECROSE} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ÉCRASER, C'EST PIRE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const ECRASE = at('fin', 'écrase');
	const GRAVE = at('fin', 'grave');
	const COUPE = at('fin', 'coupe');
	const CICAT = at('fin', 'cicatrise');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[ECRASE + 1, GRAVE + 1, COUPE + 1, CICAT + 1]} shakes={[GRAVE + 2]} strength={0.035}>
				<Big from={-2} text={'*Écraser*,\nc’est pire'} size={128} {...ON_BLUE} />
				<RowCard at={ECRASE - 4} y={520} h={360} art={340} title="Une plaie qui écrase" sub="souvent plus grave, cicatrise moins bien" subAt={GRAVE - 4} badge="+" badgeTone={LPI.pink} size={56}>
					<Live render={(f) => <WoundTop width={320} kind="ragged" bruise={1} necrosis={fadeIn(f, CICAT, 12)} />} />
				</RowCard>
				<RowCard at={COUPE - 4} y={920} h={360} art={340} title="Une plaie qui coupe" sub="se recolle mieux" subAt={COUPE + 4} badge="−" badgeTone={LPI.sky} from="left" size={56}>
					<WoundTop width={320} kind="clean" sutures={1} open={0.4} />
				</RowCard>
			</Camera>
			<Flash at={GRAVE} max={0.2} color={LPI.paper} />
			<Sfx name="pop" at={ECRASE - 4} volume={0.08} />
			<Sfx name="buzz" at={GRAVE} volume={0.05} dur={10} />
			<Sfx name="pop" at={COUPE - 4} volume={0.08} />
		</AbsoluteFill>
	);
};
