import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Background} from '../../components/Background';
import {Tube} from '../../components/icons';
import {At, Camera, Chip, Pop, usePop, Words} from '../../components/motion';
import {Sfx} from '../../components/Sfx';
import {BODY, C, TITLE} from '../../theme';

const Option: React.FC<{letter: string; label: string; cap: string; active: boolean}> = ({
	letter,
	label,
	cap,
	active,
}) => (
	<div
		style={{
			width: 400,
			padding: '30px 0 26px',
			borderRadius: 40,
			border: `4px solid ${active ? cap : 'rgba(255,255,255,0.18)'}`,
			background: active ? `${cap}26` : 'rgba(255,255,255,0.05)',
			boxShadow: active ? `0 0 60px ${cap}66` : 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 34,
			transform: `scale(${active ? 1.04 : 1})`,
		}}
	>
		<Tube cap={cap} width={56} />
		<div>
			<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 90, color: C.white, lineHeight: 1}}>{letter}</div>
			<div style={{fontFamily: BODY, fontWeight: 800, fontSize: 44, color: cap}}>{label}</div>
		</div>
	</div>
);

const CommentIcon: React.FC = () => (
	<svg width={46} height={46} viewBox="0 0 100 100">
		<path
			d="M14 18 H86 A10 10 0 0 1 96 28 V66 A10 10 0 0 1 86 76 H44 L22 94 V76 H14 A10 10 0 0 1 4 66 V28 A10 10 0 0 1 14 18 Z"
			fill={C.dark}
		/>
		<circle cx="30" cy="47" r="7" fill={C.white} />
		<circle cx="50" cy="47" r="7" fill={C.white} />
		<circle cx="70" cy="47" r="7" fill={C.white} />
	</svg>
);

export const Outro: React.FC<{duration: number; handle?: string}> = ({duration, handle}) => {
	const frame = useCurrentFrame();
	const quiz = usePop(0, 9, 220);
	const tick = frame > 44 ? Math.floor((frame - 44) / 16) % 2 : -1;
	return (
		<AbsoluteFill>
			<Background accent={C.red} accent2={C.cyan} />
			<Camera duration={duration}>
				<At top={270}>
					<div
						style={{
							transform: `scale(${0.3 + 0.7 * quiz}) rotate(${-4 * quiz}deg)`,
							opacity: Math.min(1, quiz * 2),
							background: C.red,
							borderRadius: 30,
							padding: '6px 46px',
							fontFamily: TITLE,
							fontWeight: 900,
							fontSize: 120,
							color: C.white,
							boxShadow: `0 20px 80px ${C.red}88`,
						}}
					>
						QUIZ
					</div>
				</At>
				<At top={480}>
					<Words text={'Quel tube passe\n*AVANT* le violet ?'} delay={8} size={86} accent={C.violet} />
				</At>
				<At top={720}>
					<div style={{display: 'flex', gap: 30}}>
						<Pop delay={30} from="left" distance={240}>
							<Option letter="A" label="Vert" cap="#2EB872" active={tick === 0} />
						</Pop>
						<Pop delay={38} from="right" distance={240}>
							<Option letter="B" label="Gris" cap="#B8BEC6" active={tick === 1} />
						</Pop>
					</div>
				</At>
				<At top={1100}>
					<Pop delay={60} from="scale">
						<Chip color={C.yellow} solid size={42} icon={<CommentIcon />}>
							Réponds en commentaire
						</Chip>
					</Pop>
				</At>
				<At top={1240}>
					<Pop delay={100}>
						<Words text={'*Abonne-toi* pour la suite'} delay={100} size={60} weight={900} accent={C.red} />
					</Pop>
				</At>
				<At top={1330}>
					<Pop delay={116}>
						<div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted, textAlign: 'center'}}>
							Prochain épisode : <span style={{color: C.white}}>les hémocultures</span>
							{handle ? <div style={{color: C.cyan, marginTop: 10}}>{handle}</div> : null}
						</div>
					</Pop>
				</At>
			</Camera>
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="pop" at={30} />
			<Sfx name="pop" at={38} />
			<Sfx name="pop" at={60} />
			<Sfx name="whoosh" at={100} />
		</AbsoluteFill>
	);
};
