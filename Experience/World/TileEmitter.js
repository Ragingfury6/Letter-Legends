import Experience from '../Base/Experience';
import * as THREE from 'three';
export default class TileEmitter {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.resources = this.experience.resources;
    this.tileEmitter = this.resources.items.tileEmitter;
    this.tileEmitterScene = this.resources.items.tileEmitter.scene;
    this.time = this.experience.time;
    // this.initializeEmitter();
    // this.initializeAnimations();
    // document.addEventListener('keydown', () => this.play());
  }
  initializeEmitter() {
    this.tileEmitter = this.resources.items.tileEmitter;
    this.scene.add(this.tileEmitterScene);
    this.tileEmitterScene.position.x = 32;
    this.tileEmitterScene.position.y = -2;
    this.tileEmitterScene.scale.set(2, 2, 2);
    this.tileEmitterScene.rotation.y = Math.PI;
  }
  initializeAnimations() {
    this.mixer = new THREE.AnimationMixer(
      this.tileEmitterScene.getObjectByName('Cube002')
    );
    this.clips = this.tileEmitter.animations;
    this.action = this.mixer.clipAction(this.clips[0]);
    this.action.loop = THREE.LoopPingPong;
    this.action.repetitions = 2;
    this.action.timeScale = 0.01;
  }

  play() {
    this.action.reset();
    this.action.play();
  }
  update() {
    // this.mixer.update(this.time.delta);
  }
}
