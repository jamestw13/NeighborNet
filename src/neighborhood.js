import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Home from './home';
import { rand, randNumber, seed } from '@ngneat/falso';

seed('neighbornet');

export default class Nhood {
  constructor() {
    this.homes = [];
    this.openPlots = this.#setOpenPlots();
    console.log('openPlots', this.openPlots);
    // const savedData = null;
    const savedData = JSON.parse(localStorage.getItem('homeData'));
    console.log({ savedData });
    this.numNeighbors = savedData ? savedData.numNeighbors : 2000;

    let unhousedNeighbors = this.numNeighbors;
    this.neighbors = [];
    while (unhousedNeighbors > 0) {
      const max = Math.floor(unhousedNeighbors / 10) > 1 ? Math.floor(unhousedNeighbors / 10) : 1;
      const flatmates = randNumber({ min: 1, max: max });
      unhousedNeighbors -= flatmates;
      this.neighbors.push(flatmates);
    }

    if (savedData?.homes) {
      for (const home of savedData.homes) {
        const homeObj = new Home(
          home.id,
          new THREE.Vector3(home.startPoint.x, home.startPoint.y, home.startPoint.z),
          home.angle,
          home.floors
        );
        this.homes.push(homeObj);
      }
    } else {
      this.#generateHomes();
    }

    this.#testCollide();

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

  #setOpenPlots(chosenPlot) {
    if (!chosenPlot) {
      console.log('no chosen plot');
      return [{ startPoint: new THREE.Vector3(0, 5, 0), angles: [0, 1, 2, 3, 4, 5, 6, 7] }];
    } else {
      const indicesToRemove = [(index - 1 + length) % length, index, (index + 1) % length];
      console.log('chosenPlot', chosenPlot);
    }
  }

  #testCollide() {}

  #generateHomes() {
    console.time('generate homes');
    while (this.homes.length < this.neighbors.length) {
      for (let i = 0; i < this.neighbors.length; i++) {
        // set up starter home
        if (i === 0) {
          const plot = rand(this.openPlots);
          const home = new Home(i, plot.startPoint, (Math.PI / 4) * plot.angle, this.neighbors[i]);
          this.homes.push(home);
          // this.#setOpenPlots(plot);
          continue;
        }

        let startPoints = [this.homes[0].startPoint, ...this.homes.map(h => h.endPoint)];
        // .filter(
        //   point => !this.invalidStartPoints.includes(point)
        // );
        // console.log('startPoints', startPoints);
        let angleArray = [0, 1, 2, 3, 4, 5, 6, 7];
        while (startPoints.length > 0) {
          const startPoint = rand(startPoints);
          const angleChoice = rand(angleArray);
          const angle = (Math.PI / 4) * angleChoice;

          const newHome = new Home(i, startPoint, angle, this.neighbors[i]);

          if (!this.#plotCollides(newHome)) {
            this.homes.push(newHome);
            console.log('home', i, 'created');

            break;
          } else if (angleArray.length > 1) {
            angleArray = angleArray.filter(a => a !== angleChoice);
            console.log('angleArray empty');
            continue;
          } else {
            angleArray = [0, 1, 2, 3, 4, 5, 6, 7];
            startPoints = startPoints.filter(p => p !== startPoint);
            // this.invalidStartPoints.push(startPoint);

            continue;
          }
        }
        if (startPoints.length === 0) {
          this.homes = [];
          break;
        }
      }
    }
    console.timeEnd('generate homes');
    console.log('numNeighbors', this.numNeighbors);
    localStorage.setItem(
      'homeData',
      JSON.stringify({
        numNeighbors: this.numNeighbors,
        homes: this.homes.map(h => ({ id: h.id, startPoint: h.startPoint, angle: h.angle, floors: h.floors })),
      })
      // this.homes.map(h => ({ id: h.id, startPointx: h.startPoint.x, startPointz: h.startPoint.z, angle: h.angle }))
    );
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
