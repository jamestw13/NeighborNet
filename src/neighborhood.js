import * as THREE from 'three';
import Home from './home';

export default class Nhood {
  constructor(neighbors = [1, 2, 3, 4, 5]) {
    this.neighbors = neighbors;

    this.W_WIDTH = window.innerWidth;
    this.W_HEIGHT = window.innerHeight;

    this.scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(5);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true })
    );
    plane.rotation.x = Math.PI / 2;

    this.scene.add(axesHelper, plane);

    this.camera = new THREE.PerspectiveCamera(90, this.W_WIDTH / this.W_HEIGHT, 0.1, 2000);
    this.camera.position.set(0, 200, 200);
    this.camera.rotation.x = -Math.PI / 4;
    this.renderer = this.#createRenderer();

    this.homes = [new Home(0, new THREE.Vector3(0, 0, 0), 0)];
    this.#generateHomes();
  }

  #generateHomes() {
    for (let i = 1; i < this.neighbors.length; i++) {
      this.homes.push(new Home(i, this.homes[i - 1].endPoint, Math.PI / 4));
    }
    this.#checkCollisions();
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
  #checkCollisions() {
    const boxes = this.homes.map(home => {
      const box = new THREE.Box3().setFromObject(home.plot);
      console.log(box);
      return { plot: home, box };
    });

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        if (boxes[i].box.intersectsBox(boxes[j].box) && !boxes[i].box.equals(boxes[j].box)) {
          console.log('Collision detected between plot ' + i + ' and plot ' + j);
        }
      }
    }
  }
}
