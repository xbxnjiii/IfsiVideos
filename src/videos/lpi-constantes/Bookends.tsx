import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sign} from '../../brand/learn';
import {Mascot} from '../../brand/Mascot';
import {GaugePicto, HeartPicto, LungsPicto, O2Picto, PictoBadge, ThermoPicto} from '../../brand/pictos';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {Background, Box, Card, Chip, Enter, Kicker, Title} from '../../brand/ui';
import {Sfx} from '../../components/Sfx';
import {at} from './timeline';

const Sub2: React.FC = () => <sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>;

export const CONSTANTES = [
	{abbr: 'T°', Picto: ThermoPicto, terms: ['Fébrile', 'Apyrétique', 'Hypothermie']},
	{abbr: 'FC', Picto: HeartPicto, terms: ['Tachycardie', 'Bradycardie', 'Arythmie']},
	{abbr: 'FR', Picto: LungsPicto, terms: ['Tachypnée', 'Bradypnée', 'Dyspnée']},
	{abbr: 'PA', Picto: GaugePicto, terms: ['Systolique', 'Diastolique', 'HTA', 'Hypotension']},
	{abbr: 'SpO2', Picto: O2Picto, terms: ['Désaturation', 'Hypoxémie']},
] as const;

const Abbr: React.FC<{i: number}> = ({i}) =>
	i === 4 ? (
		<span>
			SpO
			<Sub2 />
		</span>
	) : (
		<>{CONSTANTES[i].abbr}</>
	);

/** Centres des 5 pictos de l'accroche (origine de la transition vers la 1re constante). */
export const HOOK_BADGES = {y: 744, xs: [0, 1, 2, 3, 4].map((k) => 72 + (936 * (k + 0.5)) / 5)};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t1 = at('intro', 'les');
	const tC = at('intro', 'constantes');
	const tS = at('intro', 'surtout');
	const tTech = at('intro', 'techniques');
	const teaser = ['Tachycardie', 'Apyrétique', 'Dyspnée'];
	return (
		<AbsoluteFill>
			<Background />
			<Box x={72} y={290} w={936}>
				<Title at={t1} text={'Les *5* constantes'} size={104} stagger={2} />
			</Box>
			<Box x={72} y={418} w={936}>
				<Title at={tS - 6} text={'à ne *surtout* pas oublier'} size={70} stagger={2} />
			</Box>
			<Box x={72} y={622} w={936}>
				<Enter at={tC - 4}>
					<Card style={{height: 244, display: 'flex', alignItems: 'center'}}>
						{CONSTANTES.map((c, k) => (
							<div
								key={c.abbr}
								style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}
							>
								<Enter at={tC + k * 3} distance={30} bounce>
									<PictoBadge size={122}>
										<c.Picto size={70} color={LPI.navy} />
									</PictoBadge>
								</Enter>
								<Enter at={tC + k * 3 + 3} distance={10}>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: LPI.navy}}>
										<Abbr i={k} />
									</div>
								</Enter>
							</div>
						))}
					</Card>
				</Enter>
			</Box>
			<Box x={72} y={920}>
				<Enter at={tTech - 2} bounce>
					<Chip kind="solid" size={42}>
						+ 16 termes techniques
					</Chip>
				</Enter>
			</Box>
			{teaser.map((t, i) => {
				const s = spring({frame: frame - tTech - 6 - i * 5, fps, config: {damping: 13, stiffness: 190}});
				return (
					<div
						key={t}
						style={{
							position: 'absolute',
							left: 72 + i * 34,
							top: 1036 + i * 112,
							opacity: Math.min(1, s * 1.6),
							transform: `translateX(${(1 - s) * -80}px) rotate(${[-2.5, 1.5, -1][i]}deg)`,
						}}
					>
						<div
							style={{
								padding: '22px 34px',
								borderRadius: 30,
								background: LPI.paper,
								border: `3px solid ${LPI.sky}`,
								boxShadow: SHADOW,
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 46,
								color: LPI.navy,
								display: 'flex',
								alignItems: 'center',
								gap: 18,
							}}
						>
							<Sign kind={(['up', 'check', 'alert'] as const)[i]} size={60} />
							{t}
						</div>
					</div>
				);
			})}
			<Mascot poses={[[t1 + 2, 'conseil']]} x={850} y={1420} height={500} from="right" />
			{CONSTANTES.map((_, k) => (
				<Sfx key={k} name="pop" at={tC + k * 3} volume={0.1} />
			))}
			<Sfx name="pop" at={tTech} volume={0.14} />
			{teaser.map((_, i) => (
				<Sfx key={i} name="tick" at={tTech + 6 + i * 5} volume={0.12} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + APPEL ═══════════════════════════════ */
const ROW_Y = 420;
const ROW_H = 116;
const ROW_GAP = 14;

const Bookmark: React.FC = () => (
	<svg width={46} height={46} viewBox="0 0 100 100">
		<path d="M28 12 H72 A6 6 0 0 1 78 18 V90 L50 70 L22 90 V18 A6 6 0 0 1 28 12 Z" fill={LPI.paper} />
	</svg>
);

const Bubble: React.FC = () => (
	<svg width={46} height={46} viewBox="0 0 100 100">
		<path
			d="M14 18 H86 A10 10 0 0 1 96 28 V66 A10 10 0 0 1 86 76 H44 L22 94 V76 H14 A10 10 0 0 1 4 66 V28 A10 10 0 0 1 14 18 Z"
			fill={LPI.navy}
		/>
		<circle cx="30" cy="47" r="7" fill={LPI.paper} />
		<circle cx="50" cy="47" r="7" fill={LPI.paper} />
		<circle cx="70" cy="47" r="7" fill={LPI.paper} />
	</svg>
);

export const Recap: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const R = at('outro', 'récap');
	const named = [
		at('outro', 'température'),
		at('outro', 'fréquence'),
		at('outro', 'fréquence', 2),
		at('outro', 'pression'),
		at('outro', 'spo2'),
	];
	const SAVE = at('outro', 'enregistre');
	const COM = at('outro', 'commentaire');
	return (
		<AbsoluteFill>
			<Background />
			<Box x={72} y={250}>
				<Kicker at={R}>Récap</Kicker>
			</Box>
			<Box x={72} y={296} w={936}>
				<Title at={R + 2} text={'Les *5* constantes'} size={84} stagger={2} />
			</Box>
			{CONSTANTES.map((c, k) => {
				const s = spring({frame: frame - named[k], fps, config: {damping: 15, stiffness: 190}});
				const current = frame >= named[k] && (k === 4 ? frame < SAVE : frame < named[k + 1]);
				return (
					<div
						key={c.abbr}
						style={{
							position: 'absolute',
							left: 72,
							top: ROW_Y + k * (ROW_H + ROW_GAP),
							width: 936,
							height: ROW_H,
							borderRadius: 30,
							background: LPI.paper,
							border: `3px solid ${current ? LPI.blue : LPI.sky}`,
							boxShadow: SHADOW,
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							padding: '0 22px',
							opacity: Math.min(1, s * 1.6),
							transform: `translateX(${(1 - s) * 70}px)`,
						}}
					>
						<PictoBadge size={78} on={current ? 1 : 0}>
							<c.Picto size={48} color={current ? LPI.paper : LPI.navy} />
						</PictoBadge>
						<div
							style={{
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 42,
								color: current ? LPI.blue : LPI.navy,
								minWidth: 96,
							}}
						>
							<Abbr i={k} />
						</div>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
							{c.terms.map((t, j) => {
								const ts = spring({frame: frame - named[k] - 4 - j * 3, fps, config: {damping: 15, stiffness: 200}});
								return (
									<div
										key={t}
										style={{
											opacity: ts,
											transform: `scale(${0.85 + 0.15 * ts})`,
											fontFamily: FONT.body,
											fontWeight: 700,
											fontSize: 25,
											color: LPI.navy,
											background: current ? alpha(LPI.sky, 0.9) : alpha(LPI.sky, 0.55),
											padding: '7px 14px',
											borderRadius: 999,
										}}
									>
										{t}
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
			<Box
				x={72}
				y={1100}
				w={680}
				style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16}}
			>
				<Enter at={SAVE} from="left" bounce>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 18,
							padding: '20px 30px',
							borderRadius: 30,
							background: LPI.blue,
							color: LPI.paper,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 32,
							whiteSpace: 'nowrap',
							boxShadow: `0 16px 40px ${alpha(LPI.blue, 0.3)}`,
						}}
					>
						<Bookmark />
						Enregistre pour tes révisions
					</div>
				</Enter>
				<Enter at={COM} from="left" bounce>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 18,
							padding: '20px 30px',
							borderRadius: 30,
							background: LPI.paper,
							border: `3px solid ${LPI.sky}`,
							boxShadow: SHADOW,
							color: LPI.navy,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 30,
							whiteSpace: 'nowrap',
						}}
					>
						<Bubble />
						Quel mot tu ne connaissais pas ?
					</div>
				</Enter>
			</Box>
			<Mascot
				poses={[
					[R + 4, 'joyeuse'],
					[SAVE, 'celebre'],
				]}
				x={872}
				y={1420}
				height={360}
				from="right"
			/>
			{named.map((t, k) => (
				<Sfx key={k} name="pop" at={t} volume={0.11} />
			))}
			<Sfx name="pop" at={SAVE} volume={0.14} />
			<Sfx name="pop" at={COM} volume={0.12} />
		</AbsoluteFill>
	);
};
