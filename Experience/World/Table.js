import Experience from '../Base/Experience';
import * as THREE from 'three';
export default class Table {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.resources = this.experience.resources;
    this.table = this.resources.items.table.scene;
    this.initializeTable();
  }
  initializeTable() {
    console.log(this.resources.items.table);
    // const material = new THREE.MeshPhysicalMaterial({
    //     roughness: 0.7,
    //     transmission: 1,
    //     thickness: 1
    //   });
    // this.table.children.find(c=>c.name==="GlassTop").material = material;
    this.table.children.splice(
      this.table.children.findIndex((c) => c.name === 'Cube'),
      1
    );
    this.table.children.splice(
      this.table.children.findIndex((c) => c.name === 'Plane.001'),
      1
    );
    this.table.scale.set(110, 110, 110);
    this.table.position.z = 30;
    this.table.position.y = -31.5;
    this.table.position.x = 60;
    this.scene.add(this.table);
  }
}
