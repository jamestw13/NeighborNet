import * as THREE from 'three';
import { randRgb, seed } from '@ngneat/falso';
import { endpoint } from './utils';

seed('neighbornet');

export default class Home {
  constructor(id, startPoint, ordinal, floors = 1, width) {
    this.id = id;
    this.startPoint = startPoint;
    this.width = width;
    this.depth = 120;
    this.endPoint = endpoint(startPoint, ordinal, this.width);

    this.angle = (Math.PI / 4) * ordinal;
    this.color = randRgb();

    this.roadSegment = this.#generateRoadSegment();
    this.plot = this.#generatePlot();
    this.floors = floors;
    this.building = this.#generateBuilding();
  }

  #generateRoadSegment() {
    const material = new THREE.LineBasicMaterial({
      color: `rgba(${this.color}, 1)`,
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

    plot.position.set(newX, 3, newZ);
    plot.scale.set(0.9, 0.9, 0.9);

    return plot;
  }

  #generateBuilding() {
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      // wireframe: true,
    });
    const height = 10 * this.floors;
    const geometry = new THREE.BoxGeometry(this.width, this.depth, height);

    const building = new THREE.Mesh(geometry, material);

    // building.rotation.set(Math.PI / 2, 0, this.angle);
    building.rotation.set(Math.PI / 2, 0, this.angle);

    const offsetX = (this.endPoint.x - this.startPoint.x) / 2;
    const offsetZ = (this.endPoint.z - this.startPoint.z) / 2;

    const otherx = (this.depth / 2) * -Math.sin(this.angle);
    const otherz = (this.depth / 2) * Math.cos(this.angle);

    const newX = this.startPoint.x + offsetX + otherx;
    const newZ = this.startPoint.z + offsetZ + otherz;

    building.position.set(newX, height / 2, newZ);
    building.scale.set(0.4, 0.6, 1);

    return building;
  }
}
