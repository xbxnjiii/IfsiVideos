// Planche de contrôle : toutes les expressions en cartes-réactions (vérifier qu'aucune coupe ne se voit).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import manifest from '../../public/brand/mascotte/manifest.json';
import {FreeBust, MascotKey, ReactionCard} from './MascotActor';
import {LPI} from './theme';

export const MascotCardsTest: React.FC<{cat: string; mode?: 'card' | 'free' | 'flat'}> = ({cat, mode = 'card'}) => {
	const keys = (Object.keys(manifest) as MascotKey[]).filter((k) => k.startsWith(cat + '/'));
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: 36, padding: '120px 50px'}}>
			{keys.map((k, i) => (
				<div key={k} style={{width: 300, height: 380, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
					{mode === 'card' ? (
						<ReactionCard k={k} w={280} mood={(['pos', 'alert', 'calm'] as const)[i % 3]} />
					) : (
						<div style={{position: 'relative', width: 0, height: 190}}>
							<FreeBust k={k} size={270} fade={mode === 'free'} />
						</div>
					)}
				</div>
			))}
		</AbsoluteFill>
	);
};
