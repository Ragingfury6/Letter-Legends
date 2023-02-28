import Experience from "../Base/Experience";
import * as THREE from "three";
import Types from "../Constants/Types";
export default class Tiles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.resources = this.experience.resources;
    this.resourceTiles = this.resources.items.tiles.scene;
    this.tiles = [];
    this.initializeTiles();
  }
  initializeTiles() {
    this.resourceTiles.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.position.set(0, 0.2, 0);
        this.tiles.push(child);
      }
    });
  }

  retreiveTileByLetterName(letter) {
    return this.tiles.find((tile) => tile.name === letter);
  }
  fillInventoryWithTileByLetterName(letter, player) {
    const currentTile = this.tiles.find((tile) => tile.name === letter);
    if (player === Types.Player) {
      this.world.playerTilesHolder.addToInventory(currentTile);
    } else if (player === Types.Opponent) {
      this.world.opponentTilesHolder.addToInventory(currentTile);
    }
  }

  resize() {}

  update() {}
}
