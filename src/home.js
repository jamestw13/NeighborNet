import * as THREE from 'three';
import { randRgb } from '@ngneat/falso';

export default class Home {
  constructor(id, startPoint, angle) {
    this.id = id;
    this.startPoint = startPoint;
    this.width = 60;
    this.depth = 120;
    this.endPoint = endpoint(startPoint, angle, this.width);

    this.angle = angle;
    this.color = randRgb();

    this.roadSegment = this.#generateRoadSegment();
    this.plot = this.#generatePlot();
    // this.footprint = this.#generateFootprint();
  }

  #generateRoadSegment() {
    const material = new THREE.LineBasicMaterial({
      color: 'white',
      // color: `rgba(${this.color}, 1)`,
    });
    const geometry = new THREE.BufferGeometry().setFromPoints([
      this.startPoint,
      endpoint(this.startPoint, this.angle, this.width),
    ]);

    const line = new THREE.Line(geometry, material);

    return line;
  }
  #generatePlot() {
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    const geometry = new THREE.PlaneGeometry(this.width, this.depth);

    const plot = new THREE.Mesh(geometry, material);

    plot.rotation.set(Math.PI / 2, 0, this.angle);

    const offsetX = (this.endPoint.x - this.startPoint.x) / 2;
    const offsetZ = (this.endPoint.z - this.startPoint.z) / 2;

    const otherx = (this.depth / 2) * -Math.sin(this.angle);
    const otherz = (this.depth / 2) * Math.cos(this.angle);

    const newX = this.startPoint.x + offsetX + otherx;
    const newZ = this.startPoint.z + offsetZ + otherz;

    plot.position.set(newX, 0, newZ);
    plot.scale.set(0.9, 0.9, 0.9);

    return plot;
  }
}

function endpoint(start, angle, distance) {
  const x = parseFloat((start.x + distance * Math.cos(angle)).toFixed(10));
  const y = parseFloat(start.y.toFixed(10));
  const z = parseFloat((start.z + distance * Math.sin(angle)).toFixed(10));

  return new THREE.Vector3(x, y, z);
}
