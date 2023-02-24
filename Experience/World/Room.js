import Experience from '../Experience';
import * as THREE from 'three';
export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.roomScene = this.room.scene;
    this.setModel();
  }
  setModel() {
    this.roomScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // console.log(child);
        child.castShadow = true;
        child.receiveShadow = true;

        // if (child.name === 'TV_bottom001') {
        //   const glassMaterial = new THREE.MeshPhysicalMaterial({
        //     roughness: 0.2,
        //     color: 0xffffff,
        //     ior: 3,
        //     transmission: 1,
        //     opacity: 1,
        //   });
        //   child.material = glassMaterial;
        // }
      }
    });
    this.scene.add(this.roomScene);
  }

  resize() {}

  update() {}
}
