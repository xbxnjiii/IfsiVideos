// Scènes de Pied-Diabetique (à écrire) : chaque animation part d'un mot, at(scène, mot) — voir `npm run cues -- pied-diabetique`.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Head} from '../../brand/episode';
import {LiveBackground} from '../../brand/motion3';

export const Hook: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="intro" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Pied: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="pied" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Ulcere: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="ulcere" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Fin: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="fin" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);
