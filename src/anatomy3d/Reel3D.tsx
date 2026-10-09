// Court extrait animé (12 s) pour valider le rendu 3D en mouvement : corps → cœur → poumons → bras.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {LPI} from '../brand/theme';
import {Body3D, Look3D} from './Body3D';
import {CameraRig} from './Lab3D';
import {useAnatomy} from './useAnatomy';

const ease = Easing.inOut(Easing.cubic);
type Key = [number, THREE.Vector3, THREE.Vector3];

/** caméra interpolée entre des plans clés [frame, position, cible] */
export const cam3At = (frame: number, keys: Key[]) => {
	if (frame <= keys[0][0]) return {pos: keys[0][1], target: keys[0][2]};
	for (let i = 0; i < keys.length - 1; i++) {
		const [f0, p0, t0] = keys[i];
		const [f1, p1, t1] = keys[i + 1];
		if (frame <= f1) {
			const k = ease((frame - f0) / Math.max(1, f1 - f0));
			return {pos: p0.clone().lerp(p1, k), target: t0.clone().lerp(t1, k)};
		}
	}
	const last = keys[keys.length - 1];
	return {pos: last[1], target: last[2]};
};

const BEAT = 25;
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const Reel3D: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const a = useAnatomy();
	if (!a) return <AbsoluteFill style={{backgroundColor: LPI.navy}} />;
	const hc = a.box.heart.getCenter(new THREE.Vector3());
	const lc = a.box.lungs.getCenter(new THREE.Vector3());
	const cam = cam3At(frame, [
		[0, v(-1.3, 1.15, 4.4), v(0, 0.9, 0)],
		[75, v(0.2, 1.05, 3.4), v(0, 0.95, 0)],
		[108, hc.clone().add(v(0.16, 0.04, 0.55)), hc],
		[195, hc.clone().add(v(-0.14, 0.02, 0.5)), hc],
		[228, lc.clone().add(v(0.05, 0.03, 1.0)), lc],
		[300, lc.clone().add(v(-0.08, 0.0, 0.9)), lc],
		[332, v(-0.42, 1.2, 0.85), v(-0.2, 1.12, 0)],
		[360, v(-0.3, 1.18, 0.8), v(-0.2, 1.1, 0)],
	]);
	const k = (inp: number[], out: number[]) => interpolate(frame, inp, out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const t = frame % BEAT;
	const beats = Array.from({length: Math.floor(frame / BEAT) + 1}, (_, i) => i * BEAT);
	const look: Look3D = {
		skin: k([70, 100, 200, 225, 300, 325], [1, 0, 0, 0.35, 0.35, 1]),
		bones: k([70, 100, 200, 225, 300, 325], [0.6, 0, 0, 0.25, 0.25, 0.5]),
		vessels: k([195, 225, 300, 325], [1, 0, 0, 1]),
		heart: k([300, 325], [1, 0]),
		lungs: k([70, 95, 195, 225, 300, 320], [0.4, 0, 0, 1, 1, 0]),
		bronchi: k([70, 95, 195, 225, 300, 320], [0.2, 0, 0, 1, 1, 0]),
		breath: 0.5 - 0.5 * Math.cos((frame / 84) * Math.PI * 2),
		beat: t < 3 ? t / 3 : Math.exp(-(t - 3) / 5),
		waves: beats
			.slice(-4)
			.map((b) => ((frame - b) / fps) * 1.4)
			.reverse(),
		thermal: 0,
		time: frame / fps,
	};
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse 75% 60% at 50% 45%, #43598a 0%, ${LPI.navy} 75%)`}}>
			<ThreeCanvas width={width} height={height} gl={{antialias: true, alpha: true}} flat>
				<CameraRig pos={cam.pos} target={cam.target} />
				<ambientLight intensity={0.35} />
				<hemisphereLight args={['#C5D8F4', '#2D3A5A', 0.8]} />
				<directionalLight position={[1.5, 3, 3]} intensity={2.4} />
				<directionalLight position={[-3, 2, -2]} intensity={2.2} color="#EAA7C1" />
				<directionalLight position={[3, 1, -3]} intensity={2.2} color="#4E7AC7" />
				<Body3D a={a} look={look} />
			</ThreeCanvas>
		</AbsoluteFill>
	);
};
