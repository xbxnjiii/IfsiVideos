// Planche de contrôle : toutes les expressions en cartes-réactions (vérifier qu'aucune coupe ne se voit).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import manifest from '../../public/brand/mascotte-v2/manifest.json';
import {Mascot2Key} from './Mascot2';
import {ReactionCard} from './MascotActor';
import {LPI} from './theme';

export const MascotCardsTest: React.FC<{cat: string}> = ({cat}) => {
	const keys = (Object.keys(manifest) as Mascot2Key[]).filter((k) => k.startsWith(cat + '/'));
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: 36, padding: '120px 50px'}}>
			{keys.map((k, i) => (
				<div key={k} style={{width: 300, height: 380, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
					<ReactionCard k={k} w={280} mood={(['pos', 'alert', 'calm'] as const)[i % 3]} />
				</div>
			))}
		</AbsoluteFill>
	);
};
