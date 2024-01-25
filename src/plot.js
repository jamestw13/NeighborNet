import * as THREE from 'three';

import { randNumber } from '@ngneat/falso';
import { endpoint } from './utils';

/**
 * @class Plot
 * @classdesc A plot is a single line that is drawn on the canvas. It is defined by a starting point, an ordinal, and a width.
 * @property {Vector3} startPoint - The starting point of the plot.
 * @property {number} ordinal - The ordinal direction angle of the plot. 0 is west, 1 is southwest, etc.
 * @property {number} width - The width of the plot along the street. Default is 60
 */
export default class Plot {
  constructor(startPoint, ordinal, width = 60) {
    this.startPoint = startPoint;
    this.ordinal = ordinal;
    this.width = width;
    this.depth = 120;
  }

  derivedArea() {
    const p1 = this.startPoint;
    const p2 = endpoint(this.startPoint, (Math.PI / 4) * this.ordinal, this.width);
    const p3 = endpoint(p2, (Math.PI / 4) * (this.ordinal + 2), this.depth);
    const p4 = endpoint(p1, (Math.PI / 4) * (this.ordinal + 2), this.depth);
    const p5 = new THREE.Vector3(p1.x, p1.y + 8, p1.z);
    const p6 = endpoint(p5, (Math.PI / 4) * this.ordinal, this.width);
    const p7 = endpoint(p6, (Math.PI / 4) * (this.ordinal + 2), this.depth);
    const p8 = endpoint(p5, (Math.PI / 4) * (this.ordinal + 2), this.depth);

    const verticies = new Float32Array([
      p1.x,
      p1.y,
      p1.z,

      p2.x,
      p2.y,
      p2.z,

      p3.x,
      p3.y,
      p3.z,

      p4.x,
      p4.y,
      p4.z,

      p5.x,
      p5.y,
      p5.z,

      p6.x,
      p6.y,
      p6.z,

      p7.x,
      p7.y,
      p7.z,

      p8.x,
      p8.y,
      p8.z,
    ]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(verticies, 3));
    geometry.setIndex([0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7]);

    return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }));
  }
}
