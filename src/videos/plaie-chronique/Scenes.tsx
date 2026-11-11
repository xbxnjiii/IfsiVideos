// Scènes de Plaie-Chronique (à écrire) : chaque animation part d'un mot, at(scène, mot) — voir `npm run cues -- plaie-chronique`.
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

export const Aigue: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="aigue" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Chronique: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="chronique" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Exemples: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="exemples" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);

export const Fin: React.FC = () => (
	<AbsoluteFill>
		<LiveBackground />
		<Head kicker="fin" kAt={0} title="À *faire*" tAt={4} />
	</AbsoluteFill>
);
