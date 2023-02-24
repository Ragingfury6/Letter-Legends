import Experience from '../Base/Experience';
import * as THREE from 'three';
import Types from '../Constants/Types';
import Letters from '../Constants/Letters';
export default class Player {
  constructor(type) {
    this.experience = new Experience();
    this.world = this.experience.world;
    this.allTiles = this.world.tiles;
    this.scene = this.experience.scene;
    this.type = type;
    this.tiles = [];
    Letters.generateTiles(10).forEach((t) => {
      this.allTiles.fillInventoryWithTileByLetterName(t, this.type);
    });
  }

  createTile(letter) {}

  resize() {}

  update() {}
}
