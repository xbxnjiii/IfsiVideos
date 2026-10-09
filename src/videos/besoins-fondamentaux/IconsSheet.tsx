// Planche de contrôle : les 14 illustrations (grande et petite taille) et les gags.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LPI} from '../../brand/theme';
import {Blankets, CandyPill, Ceiling, Clock, Drum, HeartBeat, Mini, NEED_ICONS, NotePad, Pyjama, RetireSign, SadBubble, WifiOff, WindowSnow} from './icons';

export const IconsSheet: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: LPI.paper, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: 20, padding: 30}}>
		{NEED_ICONS.map((Icon, i) => (
			<div key={i} style={{width: 240, height: 240, background: '#e6eef9', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Icon size={220} />
			</div>
		))}
		{NEED_ICONS.map((Icon, i) => (
			<div key={`m${i}`} style={{width: 110, height: 110, background: LPI.sky, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Mini size={76}>
					<Icon size={76} />
				</Mini>
			</div>
		))}
		<WifiOff />
		<NotePad write={1} />
		<RetireSign />
		<Clock spin={1} />
		<Blankets />
		<WindowSnow />
		<Pyjama />
		<Ceiling />
		<Drum speed={1} />
		<CandyPill />
		<SadBubble />
		<HeartBeat />
	</AbsoluteFill>
);
