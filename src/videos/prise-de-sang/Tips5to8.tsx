import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../../components/Background';
import {
	ArrowUp,
	ArrowDown,
	Bottle,
	Check,
	Collector,
	Cross,
	Ion,
	Needle,
	NeedleCap,
	Tube,
	Warning,
} from '../../components/icons';
import {At, Camera, Card, Chip, clamp, Pop, Stamp, useShake, Words} from '../../components/motion';
import {Sfx} from '../../components/Sfx';
import {TipHeader} from '../../components/TipHeader';
import {BODY, C, TITLE} from '../../theme';

/* ------------------------------------------------------------------ */
/* TIP 5 — Ordre des tubes                                              */
/* ------------------------------------------------------------------ */
type TubeItem = {name: string; color: string; cap: string; band?: string; bottle?: boolean};

const TUBES: TubeItem[] = [
	{name: 'Hémoc.', color: 'flacons', cap: '#8FA3C8', bottle: true},
	{name: 'Citrate', color: 'bleu', cap: '#6EC6FF'},
	{name: 'Sec', color: 'rouge/jaune', cap: '#E63946', band: '#F4C430'},
	{name: 'Héparine', color: 'vert', cap: '#2EB872'},
	{name: 'EDTA', color: 'violet', cap: '#9B5DE5'},
	{name: 'Fluorure', color: 'gris', cap: '#9AA0A6'},
];

const DROP_START = 32;
const DROP_GAP = 18;
const FOCUS_EDTA = 168;
const FOCUS_CITRATE = 272;

const TubeRow: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const focus = frame >= FOCUS_CITRATE ? 1 : frame >= FOCUS_EDTA ? 4 : -1;
	const focusT = interpolate(frame, [FOCUS_EDTA, FOCUS_EDTA + 10], [0, 1], clamp);
	const line = interpolate(frame, [DROP_START, DROP_START + DROP_GAP * 5 + 10], [0, 1], clamp);
	return (
		<div style={{position: 'relative', display: 'flex', gap: 6}}>
			<div
				style={{
					position: 'absolute',
					top: 26,
					left: 75,
					height: 6,
					width: 750 * line,
					background: `linear-gradient(90deg, ${C.red}, ${C.violet})`,
					borderRadius: 3,
				}}
			/>
			{TUBES.map((t, i) => {
				const s = spring({
					frame: frame - DROP_START - i * DROP_GAP,
					fps,
					config: {damping: 10, stiffness: 160, mass: 0.8},
				});
				const isFocus = focus === i;
				const dim = focus >= 0 && !isFocus ? 0.3 : 1;
				const scale = isFocus ? 1 + 0.12 * focusT : 1;
				return (
					<div
						key={t.name}
						style={{
							width: 145,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 14,
							transform: `translateY(${(1 - s) * -700}px) scale(${scale})`,
							opacity: Math.min(1, s * 2) * (focus >= 0 ? interpolate(focusT, [0, 1], [1, dim]) : 1),
						}}
					>
						<div
							style={{
								width: 58,
								height: 58,
								borderRadius: 999,
								background: isFocus ? C.yellow : C.white,
								color: C.dark,
								fontFamily: TITLE,
								fontWeight: 900,
								fontSize: 34,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
							}}
						>
							{i + 1}
						</div>
						<div style={{height: 300, display: 'flex', alignItems: 'flex-end'}}>
							{t.bottle ? (
								<Bottle cap={t.cap} width={92} />
							) : (
								<Tube cap={t.cap} capBand={t.band} width={76} glow={isFocus ? focusT : 0} />
							)}
						</div>
						<div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.white}}>{t.name}</div>
						<div style={{fontFamily: BODY, fontWeight: 600, fontSize: 24, color: C.muted, marginTop: -10}}>
							{t.color}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const Tip5: React.FC<{duration: number}> = ({duration}) => {
	const shake = useShake(FOCUS_EDTA, 12, 10);
	return (
		<AbsoluteFill>
			<Background accent={C.red} accent2={C.violet} />
			<Camera duration={duration} to={1.03}>
				<AbsoluteFill style={{transform: shake}}>
					<TipHeader n={5} label="LE PLUS IMPORTANT" accent={C.red} />
					<At top={440}>
						<Words text={"L'ORDRE\nDES *TUBES*"} delay={6} size={108} accent={C.red} />
					</At>
					<At top={700}>
						<TubeRow />
					</At>
					<At top={1200}>
						<Pop delay={FOCUS_EDTA + 4} from="scale" out={FOCUS_CITRATE - 10}>
							<Card color={C.yellow} style={{width: 860, display: 'flex', alignItems: 'center', gap: 30}}>
								<Warning size={110} />
								<div>
									<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 52, color: C.white}}>EDTA trop tôt ?</div>
									<div
										style={{
											fontFamily: BODY,
											fontWeight: 800,
											fontSize: 46,
											color: C.yellow,
											display: 'flex',
											alignItems: 'center',
											gap: 10,
										}}
									>
										<Ion base="K" sup="+" /> <ArrowUp size={42} color={C.red} /> et <Ion base="Ca" sup="2+" />{' '}
										<ArrowDown size={42} color={C.blue} />
									</div>
									<div style={{fontFamily: BODY, fontWeight: 600, fontSize: 30, color: C.muted, marginTop: 6}}>
										il contient du potassium et piège le calcium
									</div>
								</div>
							</Card>
						</Pop>
					</At>
					<At top={1220}>
						<Pop delay={FOCUS_CITRATE + 4} from="scale">
							<Card color={C.cyan} style={{width: 860}}>
								<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 50, color: C.white, textAlign: 'center'}}>
									Épicrânienne ?
								</div>
								<div
									style={{
										fontFamily: BODY,
										fontWeight: 700,
										fontSize: 40,
										color: C.cyan,
										textAlign: 'center',
										marginTop: 8,
									}}
								>
									1 tube de purge avant le bleu
								</div>
							</Card>
						</Pop>
					</At>
				</AbsoluteFill>
			</Camera>
			{TUBES.map((t, i) => (
				<Sfx key={t.name} name="pop" at={DROP_START + i * DROP_GAP + 6} />
			))}
			<Sfx name="impact" at={FOCUS_EDTA} volume={0.55} />
			<Sfx name="whoosh" at={FOCUS_CITRATE} />
			<Sfx name="ding" at={FOCUS_CITRATE + 8} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* TIP 6 — Homogénéiser                                                 */
/* ------------------------------------------------------------------ */
const FlipTube: React.FC = () => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - 24);
	const period = 44;
	const rot = 90 * (1 - Math.cos((t / period) * Math.PI * 2)) * (frame > 24 ? 1 : 0);
	const count = Math.min(9, Math.floor((t + period / 2) / period));
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{transform: `rotate(${rot}deg)`}}>
					<Tube cap="#9B5DE5" width={76} />
				</div>
			</div>
			<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 50, color: C.violet}}>×{count}</div>
		</div>
	);
};

const ShakeTube: React.FC = () => {
	const frame = useCurrentFrame();
	const on = frame > 40 ? 1 : 0;
	const x = Math.sin(frame * 2.6) * 26 * on;
	const r = Math.sin(frame * 2.1) * 16 * on;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{transform: `translateX(${x}px) rotate(${r}deg)`}}>
					<Tube cap="#9B5DE5" width={76} />
				</div>
			</div>
			<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 50, color: C.red}}>hémolyse</div>
		</div>
	);
};

export const Tip6: React.FC<{duration: number}> = ({duration}) => (
	<AbsoluteFill>
		<Background accent={C.violet} accent2={C.cyan} />
		<Camera duration={duration}>
			<TipHeader n={6} label="LES TUBES" accent={C.violet} />
			<At top={450}>
				<Words text={'*RETOURNE*,\nne secoue pas'} delay={6} size={100} accent={C.violet} />
			</At>
			<At top={730}>
				<div style={{display: 'flex', gap: 24}}>
					<Pop delay={20} from="left" distance={260}>
						<div style={{position: 'relative'}}>
							<Card
								color={C.violet}
								style={{width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
							>
								<FlipTube />
								<div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted, marginTop: 6}}>
									retournements lents
								</div>
							</Card>
							<div style={{position: 'absolute', right: -16, top: -36}}>
								<Stamp at={64}>
									<Check size={100} />
								</Stamp>
							</div>
						</div>
					</Pop>
					<Pop delay={36} from="right" distance={260}>
						<div style={{position: 'relative'}}>
							<Card color={C.red} style={{width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<ShakeTube />
								<div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted, marginTop: 6}}>
									globules détruits
								</div>
							</Card>
							<div style={{position: 'absolute', right: -16, top: -36}}>
								<Stamp at={84}>
									<Cross size={100} />
								</Stamp>
							</div>
						</div>
					</Pop>
				</div>
			</At>
			<At top={1300}>
				<Pop delay={112} from="scale">
					<Chip color={C.orange} size={38}>
						Hémolyse = <Ion base="K" sup="+" /> faussement élevé (encore lui !)
					</Chip>
				</Pop>
			</At>
		</Camera>
		<Sfx name="whoosh" at={20} />
		<Sfx name="ding" at={64} />
		<Sfx name="stamp" at={84} />
		<Sfx name="buzz" at={86} />
		<Sfx name="pop" at={112} />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* TIP 7 — Ordre de fin                                                 */
/* ------------------------------------------------------------------ */
const Step: React.FC<{n: number; children: React.ReactNode; sub?: string; color: string}> = ({
	n,
	children,
	sub,
	color,
}) => (
	<Card color={color} style={{width: 840, display: 'flex', alignItems: 'center', gap: 34, padding: '28px 40px'}}>
		<div
			style={{
				minWidth: 96,
				height: 96,
				borderRadius: 999,
				background: color,
				color: C.dark,
				fontFamily: TITLE,
				fontWeight: 900,
				fontSize: 56,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{n}
		</div>
		<div>
			<div style={{fontFamily: TITLE, fontWeight: 800, fontSize: 52, color: C.white, lineHeight: 1.1}}>{children}</div>
			{sub ? (
				<div style={{fontFamily: BODY, fontWeight: 600, fontSize: 32, color: C.muted, marginTop: 6}}>{sub}</div>
			) : null}
		</div>
	</Card>
);

export const Tip7: React.FC<{duration: number}> = ({duration}) => (
	<AbsoluteFill>
		<Background accent={C.green} accent2={C.blue} />
		<Camera duration={duration}>
			<TipHeader n={7} label="LA FIN" accent={C.green} />
			<At top={450}>
				<Words text={"Garrot *AVANT*\nl'aiguille"} delay={6} size={104} accent={C.green} />
			</At>
			<At top={730}>
				<Pop delay={30} from="left" distance={300}>
					<Step n={1} color={C.green}>
						Desserre le garrot
					</Step>
				</Pop>
			</At>
			<At top={910}>
				<Pop delay={54} from="right" distance={300}>
					<Step n={2} color={C.green}>
						Retire l'aiguille
					</Step>
				</Pop>
			</At>
			<At top={1090}>
				<Pop delay={78} from="left" distance={300}>
					<Step n={3} color={C.green} sub="plier le bras favorise l'hématome">
						Comprime, bras <span style={{color: C.green}}>tendu</span>
					</Step>
				</Pop>
			</At>
			<At top={1320}>
				<Pop delay={118} from="scale">
					<Chip color={C.yellow} size={36} icon={<Warning size={46} />}>
						Garrot encore serré = hématome assuré
					</Chip>
				</Pop>
			</At>
		</Camera>
		<Sfx name="pop" at={30} />
		<Sfx name="pop" at={54} />
		<Sfx name="pop" at={78} />
		<Sfx name="stamp" at={118} />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* TIP 8 — Ne jamais recapuchonner                                      */
/* ------------------------------------------------------------------ */
const CLASH = 52;
const DISPOSE = 100;

const RecapScene: React.FC = () => {
	const frame = useCurrentFrame();
	const approach = interpolate(frame, [14, CLASH], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const leave = interpolate(frame, [DISPOSE - 14, DISPOSE], [0, 1], clamp);
	const shake = useShake(CLASH, 18, 12);
	return (
		<div style={{position: 'relative', width: 1080, height: 300, transform: shake}}>
			<div style={{position: 'absolute', top: 110, left: -440 + approach * 580, opacity: 1 - leave}}>
				<Needle length={440} hub={C.green} />
			</div>
			<div style={{position: 'absolute', top: 115, left: 1080 - approach * 500, opacity: 1 - leave}}>
				<NeedleCap width={320} color={C.green} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 30,
					display: 'flex',
					justifyContent: 'center',
					opacity: 1 - leave,
				}}
			>
				<Stamp at={CLASH} rotate={-14}>
					<Cross size={240} />
				</Stamp>
			</div>
		</div>
	);
};

const DisposeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const fall = interpolate(frame, [DISPOSE + 12, DISPOSE + 30], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const visible = frame >= DISPOSE + 8;
	const centerY = 790 + fall * 215;
	return (
		<AbsoluteFill>
			<At top={930}>
				<Pop delay={DISPOSE} from="scale">
					<Collector width={280} />
				</Pop>
			</At>
			{visible ? (
				<div
					style={{
						position: 'absolute',
						left: 540 - 150,
						top: centerY - 35,
						width: 300,
						height: 70,
						transform: 'rotate(90deg)',
						opacity: interpolate(fall, [0.8, 1], [1, 0], clamp),
					}}
				>
					<Needle length={300} hub={C.green} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

export const Tip8: React.FC<{duration: number}> = ({duration}) => (
	<AbsoluteFill>
		<Background accent={C.yellow} accent2={C.red} />
		<Camera duration={duration}>
			<TipHeader n={8} label="SÉCURITÉ" accent={C.yellow} />
			<At top={430}>
				<Words text={'On ne\n*RECAPUCHONNE*\njamais'} delay={6} size={84} accent={C.yellow} />
			</At>
			<At top={740}>
				<RecapScene />
			</At>
			<DisposeScene />
			<At top={1060}>
				<Pop delay={CLASH + 8} out={DISPOSE - 10}>
					<div style={{fontFamily: BODY, fontWeight: 800, fontSize: 46, color: C.red}}>= risque de piqûre (AES)</div>
				</Pop>
			</At>
			<At top={1270}>
				<Pop delay={DISPOSE + 34}>
					<Words
						text={'Collecteur *à* *portée* *de* *main*'}
						delay={DISPOSE + 34}
						size={58}
						weight={900}
						accent={C.yellow}
					/>
				</Pop>
			</At>
			<At top={1365}>
				<Pop delay={DISPOSE + 46}>
					<div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted}}>
						élimination immédiate, sans détour
					</div>
				</Pop>
			</At>
		</Camera>
		<Sfx name="whoosh" at={14} />
		<Sfx name="stamp" at={CLASH} />
		<Sfx name="buzz" at={CLASH + 2} />
		<Sfx name="pop" at={DISPOSE} />
		<Sfx name="impact" at={DISPOSE + 30} volume={0.35} />
		<Sfx name="ding" at={DISPOSE + 34} />
	</AbsoluteFill>
);
