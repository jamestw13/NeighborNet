import { endpoint } from './utils.js';
import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';

export default class RoadExtension {
  constructor(startPoint, ordinal, width = 60, depth = 135) {
    this.startPoint = startPoint;
    this.intersection = endpoint(this.startPoint, (Math.PI / 4) * ordinal, width / 2);
    this.endPoint = endpoint(startPoint, (Math.PI / 4) * ordinal, width);
    this.connector = endpoint(this.intersection, (Math.PI / 4) * (ordinal + (2 % 7)), depth);
    this.ordinal = ordinal;
    this.angle = (Math.PI / 4) * ordinal;
    this.width = width;
    this.depth = depth;
    this.color = 'orange';

    this.roadSegment = this.#generateRoad();
    this.building = this.roadSegment;
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

  #generateRoad() {
    const material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });
    const roadGeometry = new THREE.BufferGeometry().setFromPoints([this.startPoint, this.endPoint]);

    const connectorGeometry = new THREE.BufferGeometry().setFromPoints([this.intersection, this.connector]);

    const group = new THREE.Group();
    group.add(new THREE.Line(roadGeometry, material));
    group.add(new THREE.Line(connectorGeometry, material));

    return group;
  }
}
