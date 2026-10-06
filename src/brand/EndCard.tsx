import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Background, Dashes, Enter} from './ui';

/** Carte de fin : logo principal (variante officielle), entrée douce. */
export const EndCard: React.FC = () => (
	<AbsoluteFill>
		<Background variant={2} />
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
			<Enter at={4} from="up" distance={30} bounce>
				<Img src={staticFile('brand/logo/logo-principal.webp')} style={{width: 800, height: 'auto'}} />
			</Enter>
		</AbsoluteFill>
		<div style={{position: 'absolute', left: 150, top: 560}}>
			<Dashes at={18} size={60} />
		</div>
	</AbsoluteFill>
);
