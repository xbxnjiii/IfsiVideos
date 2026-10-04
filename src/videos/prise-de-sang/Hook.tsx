import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Background} from '../../components/Background';
import {Drop} from '../../components/icons';
import {At, Camera, Chip, clamp, Pop, useShake, Words} from '../../components/motion';
import {Sfx} from '../../components/Sfx';
import {BODY, C} from '../../theme';

const IMPACT = 16;

const Splash: React.FC = () => {
	const frame = useCurrentFrame();
	const k = frame - IMPACT;
	if (k < 0) return null;
	const ring = interpolate(k, [0, 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const droplets = Array.from({length: 12}, (_, i) => {
		const angle = (i / 12) * Math.PI * 2 + 0.3;
		const speed = 14 + (i % 4) * 5;
		const x = Math.cos(angle) * speed * k;
		const y = Math.sin(angle) * speed * k * 0.7 + 0.9 * k * k;
		const r = 14 - (i % 3) * 4;
		const o = interpolate(k, [0, 24], [1, 0], clamp);
		return <circle key={i} cx={540 + x} cy={400 + y} r={r} fill={C.red} opacity={o} />;
	});
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<circle
				cx={540}
				cy={400}
				r={40 + ring * 640}
				fill="none"
				stroke={C.red}
				strokeWidth={30 * (1 - ring)}
				opacity={1 - ring}
			/>
			{droplets}
		</svg>
	);
};

export const Hook: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const shake = useShake(IMPACT, 26, 12);
	const fall = interpolate(frame, [0, IMPACT], [-500, 0], {...clamp, easing: Easing.in(Easing.quad)});
	const k = frame - IMPACT;
	const squash = k < 0 ? 1 : 1 - 0.35 * Math.exp(-k * 0.25) * Math.cos(k * 0.6);
	const float = k > 20 ? Math.sin((k - 20) / 9) * 8 : 0;

	return (
		<AbsoluteFill>
			<Background accent={C.red} accent2={C.violet} />
			<Camera duration={duration} from={1.06} to={1}>
				<AbsoluteFill style={{transform: shake}}>
					<Splash />
					<At top={300}>
						<div
							style={{
								transform: `translateY(${fall + float}px) scale(${2 - squash}, ${squash})`,
								transformOrigin: 'bottom center',
								filter: 'drop-shadow(0 20px 60px rgba(255,46,77,0.6))',
							}}
						>
							<Drop size={150} />
						</div>
					</At>
					<At top={540}>
						<Words text={'TU RATES\nTES PRISES\nDE *SANG* ?'} delay={IMPACT + 2} stagger={4} size={146} />
					</At>
					<At top={1070}>
						<Pop delay={62}>
							<Words
								text={'8 tips pour ne plus\n_JAMAIS_ te louper'}
								delay={62}
								stagger={2}
								size={62}
								weight={800}
								accent={C.yellow}
								lineHeight={1.3}
							/>
						</Pop>
					</At>
					<At top={1290}>
						<Pop delay={92} from="scale">
							<Chip color={C.cyan} size={38}>
								Reste jusqu'au <span style={{color: C.cyan, fontFamily: BODY, fontWeight: 800}}>n°5</span> : il sauve
								tes résultats
							</Chip>
						</Pop>
					</At>
				</AbsoluteFill>
			</Camera>
			<Sfx name="whoosh" at={0} volume={0.25} />
			<Sfx name="impact" at={IMPACT} />
			<Sfx name="pop" at={62} />
			<Sfx name="pop" at={92} />
		</AbsoluteFill>
	);
};
