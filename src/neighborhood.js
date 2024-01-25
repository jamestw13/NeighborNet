import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Home from './home';
import Plot from './plot';
import { rand, randNumber, seed } from '@ngneat/falso';
import { endpoint } from './utils';

seed('neighbornet');

export default class Nhood {
  constructor() {
    this.homes = [];
    this.openPlots = [];
    for (let i = 0; i < 8; i++) {
      this.openPlots.push(new Plot(new THREE.Vector3(0, 5, 0), i));
    }

    this.numNeighbors = 10;

    this.graph = [];

    this.#generateGraph();

    this.#buildHomes();

    // THREEJS SETUP
    this.W_WIDTH = window.innerWidth;
    this.W_HEIGHT = window.innerHeight;

    this.scene = new THREE.Scene();

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshBasicMaterial({ color: '#8BFF88', side: THREE.DoubleSide })
    );
    ground.rotation.x = Math.PI / 2;

    this.scene.add(ground);
    this.scene.background = new THREE.Color(0x11aaff);

    this.camera = new THREE.PerspectiveCamera(90, this.W_WIDTH / this.W_HEIGHT, 0.1, 2000);
    this.camera.position.set(0, 400, 400);
    this.camera.rotation.x = -Math.PI / 3;

    this.renderer = this.#createRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  #generateGraph() {
    for (let i = 0; i < this.numNeighbors; i++) {
      // select an open plot
      let plot = rand(this.openPlots);

      // add it to the graph
      this.graph.push(plot);

      // add new open plots based on new endpoint
      for (let j = 0; j < 8; j++) {
        this.openPlots.push(new Plot(endpoint(plot.startPoint, (Math.PI / 4) * plot.ordinal, 60), i));
      }

      // remove invalid plots from openPlots
      for (let j = 0; j < this.graph.length; j++) {
        for (let k = 0; k < this.openPlots.length; k++) {
          if (this.graph[j].plotsIntersect(this.openPlots[k])) {
            this.openPlots.splice(k, 1);
          }
        }
      }
      console.log({ openPlots: this.openPlots, graph: this.graph });
    }
  }

  #buildHomes() {
    for (let i = 0; i < this.graph.length; i++) {
      const home = new Home(i, this.graph[i].startPoint, this.graph[i].ordinal, 1, this.graph[i].width);
      this.homes.push(home);
    }
  }

  #createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const parentDiv = document.querySelector('#three-canvas');
    document.querySelector('#three-canvas').appendChild(renderer.domElement);

    renderer.setSize(parentDiv.clientWidth, parentDiv.clientHeight);
    return renderer;
  }

  render() {
    this.scene.add(...this.homes.map(h => h.roadSegment));
    this.scene.add(...this.homes.map(h => h.building));

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
