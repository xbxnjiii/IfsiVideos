// Banc d'essai 3D : `npx remotion still Anatomie3D-Lab out.png --gl=angle --props='{"shot":"heart"}'`
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {LPI} from '../brand/theme';
import {Body3D, Look3D} from './Body3D';
import {Anatomy, useAnatomy} from './useAnatomy';

export type Shot = 'full' | 'heart' | 'lungs' | 'arm' | 'hand';
export type Lab3DProps = {shot: Shot};

/** caméra : position + cible (m) */
export const CameraRig: React.FC<{pos: THREE.Vector3; target: THREE.Vector3; fov?: number}> = ({pos, target, fov = 30}) => {
	const {camera} = useThree();
	camera.position.copy(pos);
	(camera as THREE.PerspectiveCamera).fov = fov;
	(camera as THREE.PerspectiveCamera).near = 0.01;
	(camera as THREE.PerspectiveCamera).far = 50;
	camera.lookAt(target);
	(camera as THREE.PerspectiveCamera).updateProjectionMatrix();
	return null;
};

const shotFor = (a: Anatomy, shot: Shot) => {
	const hc = a.box.heart.getCenter(new THREE.Vector3());
	const lc = a.box.lungs.getCenter(new THREE.Vector3());
	switch (shot) {
		case 'heart':
			return {target: hc, pos: hc.clone().add(new THREE.Vector3(0.05, 0.02, 0.55))};
		case 'lungs':
			return {target: lc, pos: lc.clone().add(new THREE.Vector3(0, 0.02, 1.0))};
		case 'arm':
			return {target: new THREE.Vector3(-0.2, 1.15, 0), pos: new THREE.Vector3(-0.35, 1.18, 0.9)};
		case 'hand':
			return {target: new THREE.Vector3(0.28, 0.82, 0.02), pos: new THREE.Vector3(0.38, 0.86, 0.5)};
		default:
			return {target: new THREE.Vector3(0, 0.86, 0), pos: new THREE.Vector3(0, 0.95, 4.6)};
	}
};

export const Anatomy3DLab: React.FC<Lab3DProps> = ({shot}) => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const a = useAnatomy();
	const t = frame % 25;
	const beat = t < 3 ? t / 3 : Math.exp(-(t - 3) / 5);
	const iso = {
		full: {skin: 1, bones: 0.6, vessels: 1, heart: 1, lungs: 0.5, bronchi: 0.3},
		heart: {skin: 0, bones: 0, vessels: 1, heart: 1, lungs: 0, bronchi: 0},
		lungs: {skin: 0.4, bones: 0.25, vessels: 0, heart: 0.9, lungs: 1, bronchi: 1},
		arm: {skin: 1, bones: 0.5, vessels: 1, heart: 0, lungs: 0, bronchi: 0},
		hand: {skin: 1, bones: 0.5, vessels: 1, heart: 0, lungs: 0, bronchi: 0},
	}[shot];
	const look: Look3D = {
		...iso,
		breath: 0.5 - 0.5 * Math.cos((frame / 84) * Math.PI * 2),
		beat,
		waves: [((frame % 25) / fps) * 1.4, ((frame % 25) / fps + 25 / fps) * 1.4],
		thermal: 0,
		time: frame / fps,
	};
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse 75% 60% at 50% 45%, #43598a 0%, ${LPI.navy} 75%)`}}>
			{a ? (
				<ThreeCanvas width={width} height={height} gl={{antialias: true, alpha: true}} flat>
					<CameraRig {...shotFor(a, shot)} />
					<ambientLight intensity={0.35} />
					<hemisphereLight args={['#C5D8F4', '#2D3A5A', 0.8]} />
					<directionalLight position={[1.5, 3, 3]} intensity={2.4} />
					<directionalLight position={[-3, 2, -2]} intensity={2.2} color="#EAA7C1" />
					<directionalLight position={[3, 1, -3]} intensity={2.2} color="#4E7AC7" />
					<Body3D a={a} look={look} />
				</ThreeCanvas>
			) : null}
		</AbsoluteFill>
	);
};
