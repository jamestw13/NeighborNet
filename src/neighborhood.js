import * as THREE from 'three';

export default class Nhood {
  constructor(neighbors = [1, 2, 3, 4, 5]) {
    this.neighbors = neighbors;

    this.W_WIDTH = window.innerWidth - 20;
    this.W_HEIGHT = window.innerHeight - 50;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.W_WIDTH / this.W_HEIGHT, 0.1, 1000);
    this.renderer = this.#createRenderer();
  }

  #createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 50);
    document.querySelector('#three-canvas').appendChild(renderer.domElement);
    return renderer;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
