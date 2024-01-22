import * as THREE from 'three';

export default class Home {
  constructor(id, startingPoint, angle) {
    this.id = id;
    this.startingPoint = startingPoint;
    this.width = 60;
    this.depth = 120;
    this.endPoint = endpoint(startingPoint, angle, this.width);
    this.angle = angle;

    this.roadSegment = this.#generateRoadSegment();
    this.plot = this.#generatePlot();
    // this.footprint = this.#generateFootprint();
  }

  #generateRoadSegment() {
    const material = new THREE.LineBasicMaterial({
      color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )})`,
    });
    const geometry = new THREE.BufferGeometry().setFromPoints([
      this.startingPoint,
      endpoint(this.startingPoint, this.angle, this.width),
    ]);

    const line = new THREE.Line(geometry, material);

    return line;
  }
  #generatePlot() {
    const material = new THREE.MeshBasicMaterial({
      color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )})`,
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    const geometry = new THREE.BufferGeometry();

    const verticies = new Float32Array([
      this.startingPoint.x,
      this.startingPoint.y,
      this.startingPoint.z,
      this.endPoint.x,
      this.endPoint.y,
      this.endPoint.z,

      endpoint(this.endPoint, this.angle + Math.PI / 2, this.depth).x,
      endpoint(this.endPoint, this.angle + Math.PI / 2, this.depth).y,
      endpoint(this.endPoint, this.angle + Math.PI / 2, this.depth).z,

      endpoint(this.startingPoint, this.angle + Math.PI / 2, this.depth).x,
      endpoint(this.startingPoint, this.angle + Math.PI / 2, this.depth).y,
      endpoint(this.startingPoint, this.angle + Math.PI / 2, this.depth).z,
    ]);
    const indices = [0, 1, 2, 2, 3, 0];

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(verticies, 3));

    const plot = new THREE.Mesh(geometry, material);

    console.log(plot.geometry);

    return plot;
  }
}

function endpoint(start, angle, distance) {
  const x = parseFloat((start.x + distance * Math.cos(angle)).toFixed(10));
  const y = parseFloat(start.y.toFixed(10));
  const z = parseFloat((start.z + distance * Math.sin(angle)).toFixed(10));

  return new THREE.Vector3(x, y, z);
}
