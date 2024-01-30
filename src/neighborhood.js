import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Home from './home';
import Plot from './plot';
import RoadExtension from './roadExtension';
import { rand, randNumber, seed } from '@ngneat/falso';
import { endpoint, testVectors } from './utils';

seed('jimmy');

export default class Nhood {
  constructor() {
    this.homes = [];
    this.openPlots = [];
    for (let i = 0; i < 8; i++) {
      this.openPlots.push(new Plot(new THREE.Vector3(0, 2, 0), i));
    }
    // this.openPlots.forEach(p => console.log(p.derivedArea().geometry.attributes.position.array));

    this.numNeighbors = 2000;

    this.graph = [];
    this.scene = new THREE.Scene();

    this.#generateGraph();

    this.#buildHomes();

    // THREEJS SETUP
    this.W_WIDTH = window.innerWidth;
    this.W_HEIGHT = window.innerHeight;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshBasicMaterial({ color: '#8BFF88', side: THREE.DoubleSide })
    );
    ground.rotation.x = Math.PI / 2;

    this.scene.add(ground);
    this.scene.background = new THREE.Color(0x11aaff);

    this.camera = new THREE.PerspectiveCamera(90, this.W_WIDTH / this.W_HEIGHT, 0.1, 4000);
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
      // console.log({ i });
      if (this.openPlots.length === 0) {
        // console.log('no open plots');
        // remove a and put in a road
        const index = randNumber({ min: 0, max: this.graph.length });
        const replacement = this.graph[index];
        // console.log({ index, replacement });

        const newRoad = new RoadExtension(
          replacement.startPoint,
          replacement.ordinal,
          replacement.width,
          replacement.depth
        );
        this.graph.splice(index, 1, newRoad);

        for (let l = 0; l < 8; l++) {
          this.openPlots.push(new Plot(newRoad.connector, l));
        }
      } else {
        // select an open plot
        let plot = rand(this.openPlots);

        // add it to the graph
        this.graph.push(plot);

        // add new endpoint plots to openPlots
        let plotOrdinal = plot.ordinal;
        const newStart = endpoint(plot.startPoint, (Math.PI / 4) * plotOrdinal, 60);

        for (let l = 0; l < 8; l++) {
          this.openPlots.push(new Plot(newStart, l));
        }
      }
      // remove openPlots that conflict with graph plots
      let collidedPlots = [];
      for (let i = 0, il = this.openPlots.length; i < il; i++) {
        const object = this.openPlots[i];

        const obb = this.openPlots[i].plotArea.userData.obb;

        for (let j = 0, jl = this.graph.length; j < jl; j++) {
          if (this.graph[j] instanceof RoadExtension) continue;
          const objectToTest = this.graph[j];

          const obbToTest = objectToTest.plotArea.userData.obb;

          // now perform intersection test

          if (obb.intersectsOBB(obbToTest) === true) {
            collidedPlots.push(i);
          }
        }
      }

      // console.log(new Set(collidedPlots));
      this.openPlots = this.openPlots.filter((_, index) => !new Set(collidedPlots).has(index));
    }
    console.log(this.graph);
  }

  #buildHomes() {
    for (let i = 0; i < this.graph.length; i++) {
      if (this.graph[i] instanceof RoadExtension) {
        this.homes.push(this.graph[i]);
      } else {
        const home = new Home(i, this.graph[i].startPoint, this.graph[i].ordinal, 1, this.graph[i].width);
        this.homes.push(home);
      }
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
    console.log(this.homes);
    this.scene.add(...this.homes.map(h => h.roadSegment));
    this.scene.add(...this.homes.map(h => h.building));

    if (this.openPlots.length > 0) {
      this.scene.add(...this.openPlots.map(p => p.plotArea));
    }

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
