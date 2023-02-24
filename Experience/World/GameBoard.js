import Experience from '../Base/Experience';
import * as THREE from 'three';
export default class GameBoard {
  constructor(size) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.size = size;
    this.initializeBoard();
  }
  initializeBoard() {
    this.gameBoardPlane = new THREE.PlaneGeometry(this.size, this.size);
    this.gameBoardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
    });
    this.gameBoard = new THREE.Mesh(
      this.gameBoardPlane,
      this.gameBoardMaterial
    );
    this.gameBoard.rotation.x = -Math.PI / 2;
    this.scene.add(this.gameBoard);
  }

  resize() {}

  update() {}
}
