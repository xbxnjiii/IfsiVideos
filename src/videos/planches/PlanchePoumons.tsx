// Planches de contrôle des poumons « La Petite IDE » (src/brand/chest.tsx + lungs.tsx), en image fixe :
// `npx remotion still Planche-Poumons out/planche.png --frame=50 --props='{"page":1}'`
// page 1 : les étapes une par une (patient → côtes → poumons → intérieur → alvéoles → une alvéole) ;
// page 2 : les mêmes étapes avec la BPCO ; page 3 : la radio qui enlève les couches sur le patient.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ChestPeel, ChestStep} from '../../brand/chest';
import {AlveolusExchange} from '../../brand/chest';
import {AirwayCross, AlveoliZoom} from '../../brand/lungs';
import {Patient} from '../../brand/patient';
import {FONT, LPI, SHADOW} from '../../brand/theme';
import {Title} from '../../brand/ui';

const N = LPI.navy;

const Panel: React.FC<{x: number; y: number; n: number; label: string; tone?: string; children: React.ReactNode; w?: number; h?: number; round?: boolean}> = ({x, y, n, label, tone = LPI.sky, children, w = 440, h = 500, round = false}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w}}>
		<div style={{width: w, height: h, borderRadius: round ? w / 2 : 36, border: `6px solid ${N}`, boxSizing: 'border-box', background: LPI.paper, overflow: 'hidden', boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center'}}>
			<div style={{flexShrink: 0, width: 48, height: 48, borderRadius: 24, background: N, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
			<div style={{padding: '6px 20px', borderRadius: 999, background: tone, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, whiteSpace: 'nowrap'}}>{label}</div>
		</div>
	</div>
);

export const PlanchePoumons: React.FC<{page: number}> = ({page}) => {
	const frame = useCurrentFrame();
	const copd = page === 2 ? 1 : 0;
	const tone = page === 2 ? LPI.pink : LPI.sky;
	if (page === 3)
		return (
			<AbsoluteFill style={{background: LPI.paper}}>
				<div style={{position: 'absolute', left: 72, top: 70}}>
					<Title at={-60} text="La radio enlève les *couches*" size={80} />
				</div>
				{[0.45, 1.5, 2.55].map((p, i) => (
					<div key={p} style={{position: 'absolute', left: 30 + i * 345, top: 330}}>
						<div style={{position: 'absolute'}}>
							<Patient size={330} />
						</div>
						<div style={{position: 'absolute'}}>
							<ChestPeel size={330} peel={p} air={frame} />
						</div>
					</div>
				))}
				{['côtes', 'poumons', 'bronches'].map((t, i) => (
					<div key={t} style={{position: 'absolute', left: 30 + i * 345 + 165, top: 830, transform: 'translateX(-50%)', padding: '8px 22px', borderRadius: 999, background: LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>
						{t}
					</div>
				))}
				<div style={{position: 'absolute', left: 140, top: 960}}>
					<AirwayCross size={330} />
				</div>
				<div style={{position: 'absolute', left: 610, top: 960}}>
					<AirwayCross size={330} inflame={1} squeeze={1} mucus={1} />
				</div>
				{['bronche saine', 'BPCO'].map((t, i) => (
					<div key={t} style={{position: 'absolute', left: 305 + i * 470, top: 1420, transform: 'translateX(-50%)', padding: '8px 22px', borderRadius: 999, background: i ? LPI.pink : LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>
						{t}
					</div>
				))}
			</AbsoluteFill>
		);
	return (
		<AbsoluteFill style={{background: LPI.paper}}>
			<div style={{position: 'absolute', left: 72, top: 50}}>
				<Title at={-60} text={page === 2 ? 'Avec la *BPCO*' : 'Les poumons, *étape* par *étape*'} size={62} />
			</div>
			<Panel x={80} y={170} n={1} label="le patient" tone={tone} h={460}>
				<ChestStep step={1} width={368} />
			</Panel>
			<Panel x={560} y={170} n={2} label="la cage thoracique" tone={tone} h={460}>
				<ChestStep step={2} width={368} copd={copd} />
			</Panel>
			<Panel x={80} y={720} n={3} label="les poumons" tone={tone} h={460}>
				<ChestStep step={3} width={368} copd={copd} />
			</Panel>
			<Panel x={560} y={720} n={4} label="à l'intérieur" tone={tone} h={460}>
				<ChestStep step={4} width={368} copd={copd} air={frame} trapped={copd} />
			</Panel>
			<Panel x={110} y={1270} n={5} label="les alvéoles" tone={tone} w={380} h={380} round>
				<AlveoliZoom size={340} o2={copd ? null : frame} emph={copd} trapped={copd} />
			</Panel>
			<Panel x={590} y={1270} n={6} label="l'O₂ passe dans le sang" tone={tone} w={380} h={380} round>
				<AlveolusExchange size={340} phase={frame * 3} emph={copd} />
			</Panel>
		</AbsoluteFill>
	);
};
