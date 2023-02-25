import Experience from '../Base/Experience';
import Raycaster from '../Utils/Raycaster';

import * as THREE from 'three';
export default class GameBoard {
  constructor(size) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.size = size;
    this.initializeBoard();

  }
  initializeBoard() {
    this.gameBoardPlane = new THREE.BoxGeometry(this.size, 0.1,this.size);
    this.gameBoardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
    });
    this.gameBoard = new THREE.Mesh(
      this.gameBoardPlane,
      this.gameBoardMaterial
      );
      // this.gameBoard.rotation.x = -Math.PI / 2;
      this.scene.add(this.gameBoard);

      this.raycaster = new Raycaster(this.gameBoard);
      // this.raycaster.updatesEnabled = false;
  }


  resize() {}

  update() {
    // if(this.raycaster){
    //   this.raycaster.update();
    // }
  }
}
