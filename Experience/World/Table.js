import Experience from '../Base/Experience';
import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
export default class Table {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.resources = this.experience.resources;
    this.room = this.resources.items.Room.scene;
    // this.gui = new GUI();
    this.initializeRoom();
    this.initializeLights();
    this.initializeShadows();

    this.room.position.set(-100.35, -39.2, -26.2);
  }
  initializeShadows() {
    this.room.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.castShadow = true;
        console.log(c);
        c.receiveShadow = true;
      }
    });
  }
  initializeLights() {
    const rectLight = new THREE.RectAreaLight(0xffffff, 15, 150, 100);
    const rectLightBackwards = new THREE.RectAreaLight(
      new THREE.Color('#fff5b6'),
      15,
      150,
      75
    );
    rectLight.rotation.x = Math.PI;
    rectLight.position.set(-83.96, 34.77, -163.36);
    rectLightBackwards.position.set(-83.96, 46.57, -163.36);
    // const rectLightHelper = new RectAreaLightHelper(rectLight);
    this.scene.add(rectLight, rectLightBackwards);
  }
  initializeRoom() {
    this.room.scale.set(20, 20, 20);
    this.scene.add(this.room);
  }
}
