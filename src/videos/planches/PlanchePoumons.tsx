// Planche de contrôle des poumons dessinés « La Petite IDE » (src/brand/lungs.tsx) : à rendre en image fixe
// (`npx remotion still Planche-Poumons out/planche.png --frame=50 --props='{"page":1}'`).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AirwayCross, AlveoliZoom, ChestXRay, Lungs, ZoomBubble} from '../../brand/lungs';
import {Patient} from '../../brand/patient';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {Title} from '../../brand/ui';

const N = LPI.navy;

const Tag: React.FC<{x: number; y: number; text: string; tone?: string}> = ({x, y, text, tone = LPI.sky}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', padding: '10px 26px', borderRadius: 999, background: tone, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N, whiteSpace: 'nowrap'}}>{text}</div>
);

const Round: React.FC<{x: number; y: number; r: number; children: React.ReactNode}> = ({x, y, r, children}) => (
	<div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `8px solid ${N}`, boxSizing: 'border-box', background: LPI.paper, overflow: 'hidden', boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);

export const PlanchePoumons: React.FC<{page: number}> = ({page}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: LPI.paper}}>
			{page === 1 ? (
				<>
					<div style={{position: 'absolute', left: 72, top: 70}}>
						<Title at={-60} text="Les *poumons*" size={96} />
					</div>
					<div style={{position: 'absolute', left: 40, top: 200}}>
						<Lungs width={1000} tree={1} lobes={1} pleura={1} diaphragm={1} air={frame} labels={{trachee: -20, bronche: -20, bronchiole: -20, alveoles: -20, plevre: -20, diaphragme: -20}} />
					</div>
					<div style={{position: 'absolute', left: 30, top: 930}}>
						<Lungs width={500} tree={1} diaphragm={1} />
					</div>
					<div style={{position: 'absolute', left: 550, top: 930}}>
						<Lungs width={500} tree={1} diaphragm={1} copd={1} trapped={1} />
					</div>
					<Tag x={280} y={1480} text="poumon sain" />
					<Tag x={800} y={1480} text="BPCO" tone={LPI.pink} />
					<Round x={280} y={1740} r={150}>
						<AlveoliZoom size={300} o2={frame} />
					</Round>
					<Round x={800} y={1740} r={150}>
						<AlveoliZoom size={300} emph={1} trapped={1} />
					</Round>
				</>
			) : (
				<>
					<div style={{position: 'absolute', left: 72, top: 70}}>
						<Title at={-60} text="Bronche · *radio*" size={96} />
					</div>
					<div style={{position: 'absolute', left: 120, top: 210}}>
						<AirwayCross size={340} />
					</div>
					<div style={{position: 'absolute', left: 620, top: 210}}>
						<AirwayCross size={340} inflame={1} squeeze={1} mucus={1} />
					</div>
					<Tag x={290} y={660} text="bronche saine" />
					<Tag x={790} y={660} text="BPCO" tone={LPI.pink} />
					{/* radio : en cours de balayage / poumons découverts */}
					{[0, 1].map((k) => (
						<div key={k} style={{position: 'absolute', left: 40 + k * 520, top: 780}}>
							<div style={{position: 'absolute', left: 0, top: 0}}>
								<Patient size={480} mood="calme" />
							</div>
							<div style={{position: 'absolute', left: 0, top: 0}}>
								<ChestXRay size={480} scan={k === 0 ? 0.62 : 1} xray={k === 0 ? 1 : 0.35} reveal={k} copd={0} tree={1} />
							</div>
						</div>
					))}
					<Tag x={280} y={1480} text="la radio passe" />
					<Tag x={800} y={1480} text="les poumons se découvrent" />
					{/* loupe reliée à un point */}
					<div style={{position: 'absolute', left: 60, top: 1560}}>
						<Lungs width={330} tree={1} copd={1} />
					</div>
					<ZoomBubble at={-30} ax={330} ay={1700} cx={760} cy={1720} r={170}>
						<AlveoliZoom size={320} emph={1} trapped={1} />
					</ZoomBubble>
					<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, border: `0 solid ${alpha(N, 0.1)}`}} />
				</>
			)}
		</AbsoluteFill>
	);
};
