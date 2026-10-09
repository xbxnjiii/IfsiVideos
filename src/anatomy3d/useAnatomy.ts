// Chargement des modèles anatomiques 3D (BodyParts3D, voir public/anatomy3d/manifest.json pour le crédit).
import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export const PARTS3D = [
	'skin',
	'skeleton',
	'heart',
	'heart_arteries',
	'heart_veins',
	'arteries',
	'veins',
	'pulmonary',
	'lungs',
	'bronchi',
	'diaphragm',
] as const;
export type Part3D = (typeof PARTS3D)[number];
export type Anatomy = Record<Part3D, THREE.BufferGeometry> & {box: Record<Part3D, THREE.Box3>};

let cache: Promise<Anatomy> | null = null;

const loadAll = () => {
	if (cache) return cache;
	const loader = new GLTFLoader();
	cache = Promise.all(
		PARTS3D.map(
			(p) =>
				new Promise<[Part3D, THREE.BufferGeometry]>((resolve, reject) => {
					loader.load(
						staticFile(`anatomy3d/${p}.glb`),
						(gltf) => {
							let geo: THREE.BufferGeometry | null = null;
							gltf.scene.traverse((o) => {
								if (!geo && (o as THREE.Mesh).isMesh) geo = (o as THREE.Mesh).geometry;
							});
							if (!geo) return reject(new Error(`pas de maillage dans ${p}.glb`));
							const g = geo as THREE.BufferGeometry;
							if (!g.attributes.normal) g.computeVertexNormals();
							g.computeBoundingBox();
							resolve([p, g]);
						},
						undefined,
						reject,
					);
				}),
		),
	).then((entries) => {
		const out = {box: {}} as Anatomy;
		for (const [p, g] of entries) {
			out[p] = g;
			out.box[p] = g.boundingBox!.clone();
		}
		return out;
	});
	return cache;
};

/** Charge (une fois) toutes les pièces ; le rendu attend qu'elles soient prêtes. */
export const useAnatomy = (): Anatomy | null => {
	const [data, setData] = useState<Anatomy | null>(null);
	const [handle] = useState(() => delayRender('Chargement des modèles anatomiques 3D', {timeoutInMilliseconds: 120000}));
	useEffect(() => {
		loadAll()
			.then((d) => {
				setData(d);
				continueRender(handle);
			})
			.catch((e) => {
				console.error(e);
				continueRender(handle);
			});
	}, [handle]);
	return data;
};
