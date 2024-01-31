import * as THREE from 'three';

export function endpoint(start, angle, distance) {
  const x = parseFloat((start.x + distance * Math.cos(angle)).toFixed(10));
  const y = parseFloat(start.y.toFixed(10));
  const z = parseFloat((start.z + distance * Math.sin(angle)).toFixed(10));

  return new THREE.Vector3(x, y, z);
}

export const testVectors = [
  { vector: new THREE.Vector3(1, 0, 0), ordinal: 0 },
  { vector: new THREE.Vector3(1, 0, 1), ordinal: 1 },
  { vector: new THREE.Vector3(0, 0, 1), ordinal: 2 },
  { vector: new THREE.Vector3(-1, 0, 1), ordinal: 3 },
  { vector: new THREE.Vector3(-1, 0, 0), ordinal: 4 },
  { vector: new THREE.Vector3(-1, 0, -1), ordinal: 5 },
  { vector: new THREE.Vector3(0, 0, -1), ordinal: 6 },
  { vector: new THREE.Vector3(1, 0, -1), ordinal: 7 },
];
