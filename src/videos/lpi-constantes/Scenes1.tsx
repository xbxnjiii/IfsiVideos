import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Mascot} from '../../brand/Mascot';
import {
	fr1,
	GaugePicto,
	Heart,
	HeartPicto,
	Lungs,
	LungsPicto,
	O2Picto,
	PictoBadge,
	PulseLine,
	SnowPicto,
	ThermoPicto,
	Thermometer,
	FlamePicto,
} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {Background, Box, Card, Chip, clamp, Enter, Kicker, Readout, Title, useSoft} from '../../brand/ui';
import {Sfx} from '../../components/Sfx';
import {at, BEAT} from './timeline';

export const CONSTANTES = [
	{abbr: 'T°', name: 'Température', Picto: ThermoPicto},
	{abbr: 'FC', name: 'Fréquence cardiaque', Picto: HeartPicto},
	{abbr: 'FR', name: 'Fréquence respiratoire', Picto: LungsPicto},
	{abbr: 'PA', name: 'Pression artérielle', Picto: GaugePicto},
	{abbr: 'SpO2', name: 'Saturation en oxygène', Picto: O2Picto},
] as const;

export const Abbr: React.FC<{i: number}> = ({i}) =>
	i === 4 ? (
		<span>
			SpO<sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>
		</span>
	) : (
		<>{CONSTANTES[i].abbr}</>
	);

/** Centres des 5 badges de l'intro (origine de la transition vers la 1re constante). */
export const INTRO_BADGES = {y: 1138, xs: [0, 1, 2, 3, 4].map((k) => 72 + (936 * (k + 0.5)) / 5)};

/* ═══════════════════════════════ INTRO ═══════════════════════════════ */
export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const tQ = at('intro', 'tu');
	const tVoici = at('intro', 'voici');
	const t5 = at('intro', '5');
	const tAbs = at('intro', 'absolument');
	const qOut = interpolate(frame, [tVoici - 4, tVoici + 4], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<Background variant={0} />
			<Mascot poses={[[4, 'conseil']]} x={812} y={1004} height={660} from="right" />
			{qOut > 0 ? (
				<Box x={72} y={330} w={540} style={{opacity: qOut}}>
					<Title at={tQ} text={'Tu es\n*étudiant*\ninfirmier ?'} size={88} />
				</Box>
			) : null}
			<Box x={72} y={330} w={560}>
				<Title at={tVoici + 2} text={'Les *5*\nconstantes'} size={96} />
			</Box>
			<Box x={72} y={600}>
				<Enter at={tAbs}>
					<Chip kind="pink" size={38}>
						à connaître en IFSI
					</Chip>
				</Enter>
			</Box>
			<Box x={72} y={1010} w={936}>
				<Enter at={t5 - 6}>
					<Card style={{height: 250, display: 'flex', alignItems: 'center'}}>
						{CONSTANTES.map((c, k) => (
							<div
								key={c.abbr}
								style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}
							>
								<Enter at={t5 + k * 5} from="up" distance={24} bounce>
									<PictoBadge size={124}>
										<c.Picto size={72} color={LPI.navy} />
									</PictoBadge>
								</Enter>
								<Enter at={t5 + k * 5 + 4} distance={10}>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: LPI.navy}}>
										<Abbr i={k} />
									</div>
								</Enter>
							</div>
						))}
					</Card>
				</Enter>
			</Box>
			{CONSTANTES.map((_, k) => (
				<Sfx key={k} name="pop" at={t5 + k * 5} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════ 1 — TEMPÉRATURE ═══════════════════════════ */
export const Temperature: React.FC = () => {
	const frame = useCurrentFrame();
	const L = at('temp', 'première');
	const T = at('temp', 'température');
	const E = at('temp', 'elle');
	const ETAT = at('temp', "l'état");
	const R = at('temp', 'rechercher');
	const F = at('temp', 'fièvre');
	const OU = at('temp', 'ou');
	const H = at('temp', 'hypothermie');
	const ease = Easing.inOut(Easing.cubic);
	const value = interpolate(frame, [14, 46, R, F, OU, H + 22], [34.6, 36.7, 36.7, 39.2, 39.2, 35.0], {
		...clamp,
		easing: ease,
	});
	const hot = interpolate(value, [37.8, 39.0], [0, 1], clamp);
	const cold = interpolate(value, [35.2, 36.0], [1, 0], clamp);
	const iconHot = useSoft(F, true);
	const iconCold = useSoft(H + 10, true);
	return (
		<AbsoluteFill>
			<Background variant={1} />
			<Box x={72} y={300}>
				<Kicker at={L}>Constante 1/5</Kicker>
			</Box>
			<Box x={72} y={346} w={700}>
				<Title at={T} text="*Température*" size={100} />
			</Box>
			<Mascot
				poses={[
					[E, 'reflechit'],
					[F, 'surprise'],
				]}
				x={872}
				y={622}
				height={320}
				from="right"
			/>
			<Box x={72} y={560} w={936}>
				<Enter at={12}>
					<Card style={{height: 560}}>
						<div style={{position: 'absolute', left: 84, top: 44}}>
							<Thermometer value={value} height={470} />
						</div>
						<div style={{position: 'absolute', left: 330, top: 150}}>
							<Readout value={fr1(value)} unit="°C" size={150} />
						</div>
						<div style={{position: 'absolute', left: 344, top: 330, display: 'flex', gap: 18}}>
							{hot > 0.01 ? (
								<div style={{opacity: iconHot * hot, transform: `scale(${0.6 + 0.4 * iconHot})`}}>
									<FlamePicto size={96} />
								</div>
							) : null}
							{cold > 0.01 ? (
								<div style={{opacity: iconCold * cold, transform: `scale(${0.6 + 0.4 * iconCold})`}}>
									<SnowPicto size={96} />
								</div>
							) : null}
						</div>
					</Card>
				</Enter>
			</Box>
			<Box x={72} y={1170} w={936} style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
				<Enter at={ETAT}>
					<Chip on={interpolate(frame, [ETAT, ETAT + 6, F - 2, F + 4], [0, 1, 1, 0], clamp)}>État thermique</Chip>
				</Enter>
				<Enter at={F}>
					<Chip kind={hot > 0.5 ? 'pink' : 'outline'}>Fièvre</Chip>
				</Enter>
				<Enter at={H}>
					<Chip on={cold}>Hypothermie</Chip>
				</Enter>
			</Box>
			<Sfx name="pop" at={ETAT} volume={0.08} />
			<Sfx name="pop" at={F} volume={0.08} />
			<Sfx name="pop" at={H} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════ 2 — FRÉQUENCE CARDIAQUE ═══════════════════════ */
const BEAT_START = 14;
const beatAt = (frame: number) => (frame < BEAT_START ? 0 : Math.exp(-((frame - BEAT_START) % BEAT) / 4));

export const Cardiaque: React.FC = () => {
	const frame = useCurrentFrame();
	const L = at('fc', 'deuxième');
	const T = at('fc', 'fréquence');
	const E = at('fc', 'elle');
	const N = at('fc', 'nombre');
	const B = at('fc', 'battements');
	const beat = beatAt(frame);
	const beatsSince = frame < N ? 0 : Math.floor((frame - BEAT_START) / BEAT) - Math.floor((N - BEAT_START) / BEAT);
	const bpm = Math.min(72, 70 + Math.max(0, beatsSince));
	const counter = useSoft(N, true);
	const beats = Array.from({length: 10}, (_, k) => BEAT_START + k * BEAT);
	return (
		<AbsoluteFill>
			<Background variant={2} />
			<Box x={72} y={300}>
				<Kicker at={L}>Constante 2/5</Kicker>
			</Box>
			<Box x={72} y={346} w={900}>
				<Title at={T} text={'Fréquence\n*cardiaque*'} size={92} />
			</Box>
			<Box x={72} y={590} w={936}>
				<Enter at={10}>
					<Card style={{height: 420, overflow: 'hidden'}}>
						<div style={{position: 'absolute', left: 70, top: 14}}>
							<Heart size={300} beat={beat} />
						</div>
						<div style={{position: 'absolute', left: 0, top: 296, opacity: 0.9}}>
							<PulseLine width={936} beatFrames={BEAT} startAt={BEAT_START} y={70} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 470,
								top: 62,
								opacity: counter,
								transform: `translateY(${(1 - counter) * 20}px) scale(${1 + 0.03 * beat})`,
								transformOrigin: 'left center',
							}}
						>
							<Readout value={bpm} unit="bpm" size={140} />
						</div>
						<div style={{position: 'absolute', left: 474, top: 222}}>
							<Enter at={B}>
								<Chip on={interpolate(frame, [B, B + 6], [0, 1], clamp)} size={34}>
									Battements / minute
								</Chip>
							</Enter>
						</div>
					</Card>
				</Enter>
			</Box>
			<Mascot poses={[[E, 'explique']]} x={220} y={1392} height={450} from="left" />
			{beats.map((f) => (
				<Sfx key={f} name="heartbeat" at={f} volume={0.13} />
			))}
			<Sfx name="pop" at={N} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════ 3 — FRÉQUENCE RESPIRATOIRE ═══════════════════════ */
const BREATH = 90;
const BREATH_START = 12;

export const Respiratoire: React.FC = () => {
	const frame = useCurrentFrame();
	const L = at('fr', 'troisième');
	const T = at('fr', 'fréquence');
	const E = at('fr', 'elle');
	const N = at('fr', 'nombre');
	const R = at('fr', 'respirations');
	const local = Math.max(0, frame - BREATH_START);
	const phase = (local % BREATH) / BREATH;
	const breath = frame < BREATH_START ? 0 : 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
	const inspiring = phase < 0.5;
	const q = inspiring ? phase / 0.5 : (phase - 0.5) / 0.5;
	const counter = useSoft(N, true);
	return (
		<AbsoluteFill>
			<Background variant={0} />
			<Box x={72} y={300}>
				<Kicker at={L}>Constante 3/5</Kicker>
			</Box>
			<Box x={72} y={346} w={900}>
				<Title at={T} text={'Fréquence\n*respiratoire*'} size={92} />
			</Box>
			<Box x={72} y={590} w={936}>
				<Enter at={10}>
					<Card style={{height: 540}}>
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 30,
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<div style={{display: 'flex', padding: 6, borderRadius: 999, background: alpha(LPI.sky, 0.6)}}>
								{['Inspiration', 'Expiration'].map((label, i) => {
									const active = frame >= BREATH_START && (i === 0) === inspiring;
									return (
										<div
											key={label}
											style={{
												fontFamily: FONT.body,
												fontWeight: 700,
												fontSize: 30,
												padding: '10px 28px',
												borderRadius: 999,
												color: active ? LPI.paper : LPI.navy,
												background: active ? LPI.blue : 'transparent',
											}}
										>
											{label}
										</div>
									);
								})}
							</div>
						</div>
						<div style={{position: 'absolute', left: 268, top: 120}}>
							<Lungs breath={breath} inspiring={inspiring} q={q} size={400} />
						</div>
					</Card>
				</Enter>
			</Box>
			<Box x={72} y={1160}>
				<div style={{opacity: counter, transform: `translateY(${(1 - counter) * 20}px)`}}>
					<Readout value={16} unit="/ min" size={132} />
				</div>
			</Box>
			<Box x={72} y={1302}>
				<Enter at={R}>
					<Chip on={interpolate(frame, [R, R + 6], [0, 1], clamp)} size={34}>
						Respirations / minute
					</Chip>
				</Enter>
			</Box>
			<Mascot poses={[[E, 'notes']]} x={872} y={1392} height={470} from="right" />
			<Sfx name="pop" at={N} volume={0.08} />
		</AbsoluteFill>
	);
};
