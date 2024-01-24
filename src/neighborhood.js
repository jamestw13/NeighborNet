import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Home from './home';
import { rand, randNumber } from '@ngneat/falso';

export default class Nhood {
  constructor(numNeighbors = 1000) {
    this.numNeighbors = numNeighbors;
    this.neighbors = [];
    while (this.numNeighbors > 0) {
      const max = Math.floor(this.numNeighbors / 10) > 1 ? Math.floor(this.numNeighbors / 10) : 1;
      const flatmates = randNumber({ min: 1, max: Math.floor(this.numNeighbors / 10) || 1 });
      this.numNeighbors -= flatmates;
      this.neighbors.push(flatmates);
    }
    console.log(this.neighbors, this.neighbors.length);

    this.W_WIDTH = window.innerWidth;
    this.W_HEIGHT = window.innerHeight;

    this.scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(1000);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshBasicMaterial({ color: '#8BFF88', side: THREE.DoubleSide })
    );
    ground.rotation.x = Math.PI / 2;

    this.scene.add(axesHelper, ground);
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

    this.homes = [];

    this.#generateHomes();
  }

  #generateHomes() {
    while (this.homes.length < this.neighbors.length) {
      for (let i = 0; i < this.neighbors.length; i++) {
        // set up starter home
        if (i === 0) {
          const home = new Home(i, new THREE.Vector3(0, 5, 0), 0, this.neighbors[i]);
          this.homes.push(home);
          continue;
        }

        let startPoints = [this.homes[0].startPoint, ...this.homes.map(h => h.endPoint)];

        let angleArray = [0, 1, 2, 3, 4, 5, 6, 7];
        while (startPoints.length > 0) {
          const startPoint = rand(startPoints);
          const angleChoice = rand(angleArray);
          const angle = (Math.PI / 4) * angleChoice;

          const newHome = new Home(i, startPoint, angle, this.neighbors[i]);

          if (!this.#plotCollides(newHome)) {
            this.homes.push(newHome);

            break;
          } else if (angleArray.length > 1) {
            angleArray = angleArray.filter(a => a !== angleChoice);

            continue;
          } else {
            angleArray = [0, 1, 2, 3, 4, 5, 6, 7];
            startPoints = startPoints.filter(p => p !== startPoint);

            continue;
          }
        }
        if (startPoints.length === 0) {
          this.homes = [];
          break;
        }
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
    this.scene.add(...this.homes.map(h => h.roadSegment));
    this.scene.add(...this.homes.map(h => h.building));

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  #plotCollides(newHome) {
    const collisionList = this.homes.filter(h => {
      const h1Box = new THREE.Box3().setFromObject(h.plot);
      // const rotationMatrix1 = new THREE.Matrix4().extractRotation(h.plot.matrixWorld); // Extract the rotation matrix from the object
      // h1Box.applyMatrix4(rotationMatrix1); // Apply the rotation matrix to the AABB

      const h2Box = new THREE.Box3().setFromObject(newHome.plot);
      // const rotationMatrix2 = new THREE.Matrix4().extractRotation(newHome.plot.matrixWorld); // Extract the rotation matrix from the object
      // h2Box.applyMatrix4(rotationMatrix2); // Apply the rotation matrix to the AABB

      //   `plot ${h.id} ${h1Box.intersectsBox(h2Box) ? 'collides' : 'does not collide'} with plot ${newHome.id}`
      // );

      return h1Box.intersectsBox(h2Box);
    });

    return collisionList.length > 0;
  }
}
