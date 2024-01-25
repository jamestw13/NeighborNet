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
    this.angle = (Math.PI / 4) * ordinal;
    this.endPoint = endpoint(startPoint, this.angle, this.width);

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

  derivedArea() {
    const p1 = this.startPoint;
    const p2 = endpoint(this.startPoint, this.angle, this.width);
    const p3 = endpoint(p2, (Math.PI / 4) * (this.ordinal % 7) + 2, this.depth);
    const p4 = endpoint(p1, (Math.PI / 4) * (this.ordinal + 2), this.depth);
    const p5 = new THREE.Vector3(p1.x, p1.y + 8, p1.z);
    const p6 = endpoint(p5, this.angle, this.width);
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
