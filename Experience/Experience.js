import * as THREE from 'three';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';

import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import assets from './Utils/assets';

export default class Experience {
  static instance;
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.time = new Time();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.world = new World();

    this.time.on('update', () => {
      this.update();
    });

    this.sizes.on('resize', () => {
      this.resize();
    });
  }
  update() {
    this.camera.update();
    this.renderer.update();
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
}
