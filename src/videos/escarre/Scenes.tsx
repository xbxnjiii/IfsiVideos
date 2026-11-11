// Scènes de Escarre (à écrire) : chaque animation part d'un mot, at(scène, mot) — voir `npm run cues -- escarre`.
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

export const Pression: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="pression" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Ou: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="ou" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Geste: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="geste" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Fin: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="fin" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);
