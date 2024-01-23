import * as THREE from 'three';
import Home from './home';
import { rand, randNumber } from '@ngneat/falso';

export default class Nhood {
  constructor(numNeighbors = 3) {
    this.neighbors = new Array(numNeighbors).fill();

    this.W_WIDTH = window.innerWidth;
    this.W_HEIGHT = window.innerHeight;

    this.scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(120);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true })
    );
    plane.rotation.x = Math.PI / 2;

    this.scene.add(axesHelper, plane);

    this.camera = new THREE.PerspectiveCamera(90, this.W_WIDTH / this.W_HEIGHT, 0.1, 2000);
    this.camera.position.set(0, 400, 400);
    this.camera.rotation.x = -Math.PI / 3;
    this.renderer = this.#createRenderer();

    this.homes = [new Home(0, new THREE.Vector3(0, 0, 0), 0)];

    this.#generateHomes();
  }

  #generateHomes() {
    let startPoints = [this.homes[0].startPoint, ...this.homes.map(h => h.endPoint)];
    for (let i = 1; i < this.neighbors.length; i++) {
      let invalid = true;
      let newHome;
      // while (invalid) {
      const startPoint = rand(startPoints);

      const angle = (Math.PI / 4) * randNumber({ min: 0, max: 7 });
      newHome = new Home(i, startPoint, angle);

      if (!this.#checkPlotCollision()) {
        invalid = false;
      }
      // }
      this.homes.push(newHome);
      startPoints.push(newHome.endPoint);
      // this.homes.forEach(h => console.log(h.startPoint, h.angle / 180));
    }
  }

  #createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 50);
    document.querySelector('#three-canvas').appendChild(renderer.domElement);
    return renderer;
  }

  render() {
    this.scene.add(...this.homes.map(h => h.roadSegment));
    this.scene.add(...this.homes.map(h => h.plot));
    this.renderer.render(this.scene, this.camera);
  }
  #checkPlotCollision() {
    const boxes = this.homes.map(home => {
      const box = new THREE.Box3().setFromObject(home.plot);

      return { plot: home, box };
    });

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        console.log(
          this.homes[i].startPoint,
          this.homes[i].angle / 180,
          this.homes[j].startPoint,
          this.homes[j].angle / 180
        );
        if (boxes[i].box.intersectsBox(boxes[j].box) && !boxes[i].box.equals(boxes[j].box)) {
          console.log('Collision detected between plot ' + i + ' and plot ' + j);
          return true;
        }
      }
    }
    console.log('No collision detected');
    return false;
  }
}
