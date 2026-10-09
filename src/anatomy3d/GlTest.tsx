// Test de faisabilité : rendu WebGL (Three.js) dans Remotion, sans GPU.
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';

export const GlTest: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const beat = 1 + 0.08 * Math.max(0, Math.sin((frame / 25) * Math.PI * 2));
	return (
		<ThreeCanvas width={width} height={height} style={{backgroundColor: '#2D3A5A'}} camera={{fov: 35, position: [0, 0, 6]}}>
			<ambientLight intensity={0.4} />
			<directionalLight position={[3, 4, 5]} intensity={2.2} />
			<directionalLight position={[-4, -1, -3]} intensity={1.2} color="#C5D8F4" />
			<mesh rotation={[0.4, frame / 40, 0]} scale={beat}>
				<torusKnotGeometry args={[1, 0.32, 400, 64]} />
				<meshPhysicalMaterial color="#b3122e" roughness={0.35} clearcoat={1} clearcoatRoughness={0.2} sheen={0.6} />
			</mesh>
		</ThreeCanvas>
	);
};
