import * as THREE from 'three';

export function endpoint(start, angle, distance) {
  const x = parseFloat((start.x + distance * Math.cos(angle)).toFixed(10));
  const y = parseFloat(start.y.toFixed(10));
  const z = parseFloat((start.z + distance * Math.sin(angle)).toFixed(10));

  return new THREE.Vector3(x, y, z);
}
