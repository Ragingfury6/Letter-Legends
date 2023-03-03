import Experience from '../Base/Experience';
import * as THREE from 'three';
import Types from '../Constants/Types';
import Letters from '../Constants/Letters';
export default class Player {
  constructor(type, startingTiles) {
    this.experience = new Experience();
    this.world = this.experience.world;
    this.allTiles = this.world.tiles;
    this.scene = this.experience.scene;
    this.type = type;
    this.tiles = [];
    startingTiles.forEach((t, idx) => {
      this.allTiles.fillInventoryWithTileByLetterName(t, this.type, idx / 4);
    });
  }

  createTile(letter) {}

  resize() {}

  update() {}
}
