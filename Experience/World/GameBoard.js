import Experience from '../Base/Experience';

import * as THREE from 'three';
export default class GameBoard {
  constructor(size) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.size = size;
    this.inventory = [];
    this.tilesPlayedOnThisTurn = [];
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
      this.gameBoard.name = "GameBoard";
      // this.gameBoard.rotation.x = -Math.PI / 2;
      this.scene.add(this.gameBoard);
  }

  addToInventory(tile){
    this.inventory.push(tile);
    this.tilesPlayedOnThisTurn.push(tile);
  }

  validateNewTilePosition(position){
    if(this.inventory.length === 0) return true;
    return this.inventory.every(item=>!item.object.position.equals(position));
  }


  resize() {}

  update() {}
}
