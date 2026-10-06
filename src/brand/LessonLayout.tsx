import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {NumberBadge} from './learn';
import {Mascot, MascotName} from './Mascot';
import {FONT, LPI} from './theme';
import {Background, Card, Enter, Subtitle, Title} from './ui';

/** Largeur de la colonne des termes (la mascotte occupe le reste). */
export const TERMS_W = 650;

/**
 * Gabarit « fiche » d'une partie : numéro + sur-titre, titre, définition courte,
 * carte d'illustration, puis les termes avec la mascotte à côté qui réagit.
 * Toutes les vidéos « notions » de La Petite IDE réutilisent ce gabarit.
 */
export const LessonLayout: React.FC<{
	n: number;
	total: number;
	nAt: number;
	title: string;
	titleAt: number;
	titleSize?: number;
	definition: React.ReactNode;
	defAt: number;
	cardHeight: number;
	cardAt?: number;
	card: React.ReactNode;
	mascot?: [number, MascotName][];
	/** frames où un nouveau terme arrive (petit rebond de l'illustration) */
	bumps?: number[];
	children: React.ReactNode;
}> = ({
	n,
	total,
	nAt,
	title,
	titleAt,
	titleSize = 84,
	definition,
	defAt,
	cardHeight,
	cardAt = 8,
	card,
	mascot,
	bumps = [],
	children,
}) => {
	const frame = useCurrentFrame();
	// la carte d'illustration « rebondit » légèrement à chaque nouveau terme
	const last = Math.max(-999, ...bumps.filter((b) => b <= frame));
	const bump = 1 + 0.018 * Math.exp(-(frame - last) / 5);
	return (
		<AbsoluteFill>
			<Background />
			<div
				style={{
					position: 'absolute',
					left: 72,
					top: 236,
					width: 936,
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<NumberBadge n={n} at={nAt} size={84} />
					<Enter at={nAt + 3} from="left" distance={20}>
						<div
							style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 28, letterSpacing: '0.16em', color: LPI.blue}}
						>
							CONSTANTE {n}/{total}
						</div>
					</Enter>
				</div>
				<Title at={titleAt} text={title} size={titleSize} stagger={2} />
				<Subtitle at={defAt} size={34}>
					{definition}
				</Subtitle>
				<div style={{marginTop: 10, transform: `scale(${bump})`}}>
					<Enter at={cardAt}>
						<Card style={{height: cardHeight, overflow: 'hidden'}}>{card}</Card>
					</Enter>
				</div>
				<div style={{position: 'relative', marginTop: 8}}>
					<div style={{width: TERMS_W, display: 'flex', flexDirection: 'column', gap: 12}}>{children}</div>
					{mascot ? (
						// la mascotte se tient à droite des termes et réagit à chacun
						<div style={{position: 'absolute', left: 0, bottom: -6, width: '100%', height: 0}}>
							<Mascot poses={mascot} x={TERMS_W + (936 - TERMS_W) / 2 + 6} y={0} height={300} from="right" />
						</div>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};
