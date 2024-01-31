import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';

import { randNumber } from '@ngneat/falso';
import { endpoint, testVectors } from './utils';

/**
 * @class Plot
 * @classdesc A plot is a single line that is drawn on the canvas. It is defined by a starting point, an ordinal, and a width.
 * @property {Vector3} startPoint - The starting point of the plot.
 * @property {number} ordinal - The ordinal direction angle of the plot. 0 is west, 1 is southwest, etc.
 * @property {number} width - The width of the plot along the street. Default is 60
 */
export default class Plot {
  constructor(startPoint, ordinal, width = 60, depth = 135) {
    this.startPoint = startPoint;
    this.endPoint = endpoint(startPoint, (Math.PI / 4) * ordinal, width);
    this.ordinal = ordinal;
    this.angle = (Math.PI / 4) * ordinal;
    this.width = width;
    this.depth = depth;
    this.color = 'orange';

    // this.obb = this.derivedObb();

    this.plotArea = this.#generatePlot();
  }

  #generatePlot() {
    const size = new THREE.Vector3(this.width, 5, this.depth);
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

    const material = new THREE.MeshBasicMaterial({ color: this.color, wireframe: true, side: THREE.DoubleSide });
    const plotArea = new THREE.Mesh(geometry, material);

    const offsetX = (this.endPoint.x - this.startPoint.x) / 2;
    const offsetZ = (this.endPoint.z - this.startPoint.z) / 2;

    const otherx = (this.depth / 2) * -Math.sin(this.angle);
    const otherz = (this.depth / 2) * Math.cos(this.angle);

    const newX = this.startPoint.x + offsetX + otherx;
    const newZ = this.startPoint.z + offsetZ + otherz;

    plotArea.position.set(newX, 2, newZ);
    plotArea.rotation.set(0, -this.angle, 0);

    plotArea.userData.obb = new OBB();

    plotArea.updateMatrix();
    plotArea.updateMatrixWorld();

    plotArea.userData.obb.halfSize.copy(size).multiplyScalar(0.5);
    plotArea.userData.obb.applyMatrix4(plotArea.matrixWorld);

    return plotArea;
  }

  // derivedObb() {
  //   const offsetX = (this.endPoint.x - this.startPoint.x) / 2;
  //   const offsetZ = (this.endPoint.z - this.startPoint.z) / 2;

  //   const otherx = (this.depth / 2) * -Math.sin(this.angle);
  //   const otherz = (this.depth / 2) * Math.cos(this.angle);

  //   const newX = this.startPoint.x + offsetX + otherx;
  //   const newZ = this.startPoint.z + offsetZ + otherz;

  //   const euler = new THREE.Euler(Math.PI / 2, 0, this.angle, 'XYZ');
  //   const rotationMatrix4 = new THREE.Matrix4().makeRotationFromEuler(euler);
  //   const rotationMatrix3 = new THREE.Matrix3().setFromMatrix4(rotationMatrix4);

  //   return new OBB(
  //     new THREE.Vector3(newX, 2, newZ),
  //     new THREE.Vector3(this.width / 2, 2, this.depth / 2),
  //     rotationMatrix3
  //   );
  // }
}
