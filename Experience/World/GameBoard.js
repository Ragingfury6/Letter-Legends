import Experience from "../Base/Experience";

import * as THREE from "three";
import Types from "../Constants/Types";
import PulsatingShader from "../Shaders/PulsatingShader";
export default class GameBoard {
  constructor(size) {
    this.experience = new Experience();
    this.world = this.experience.world;
    this.allTiles = this.world.tiles;
    this.scene = this.experience.scene;
    this.size = size;
    this.inventory = [];
    this.tilesPlayedOnThisTurn = [];
    this.initializeBoard();

    this.validShader = new PulsatingShader(0.0, 1.0, 0.0);
    this.invalidShader = new PulsatingShader(1.0, 0.0, 0.0);
  }
  initializeBoard() {
    this.gameBoardPlane = new THREE.BoxGeometry(this.size, 0.1, this.size);
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

  getLastPlayedTile(){
    return this.inventory[this.inventory.length - 1];
  }

  addToInventory(tile) {
    this.inventory.push(tile);
    this.tilesPlayedOnThisTurn.push(tile);
  }

  findTileByPosition(position){
    return this.inventory.find(t=>t.position.equals(position));
  }

  removeFromInventory(position){
    this.inventory = this.inventory.filter(t=>!(t.position.equals(position)));
    this.tilesPlayedOnThisTurn = this.tilesPlayedOnThisTurn.filter(t=>!(t.position.equals(position)));
  }

  validateNewTilePosition(position) {
    if (this.inventory.length === 0) return true;
    return this.inventory.every(
      (item) => !item.position.equals(position)
    );
  }

  applyShaderAfterEndTurn(positions, valid){
    positions.forEach(index=>{
      this.inventory[index].material = (valid ? this.validShader.shader : this.invalidShader.shader);
    });
    setTimeout(()=>{
      positions.forEach(index=>{
        this.inventory[index].material = this.inventory[index].originalMaterial;
      });
    },1000);
  }

  resize() {}

  update() {
    this.validShader.update();
    this.invalidShader.update();
  }
}
