import Experience from '../Base/Experience';
import Types from '../Constants/Types';
import calculateWorldPositionFromInventorySlot from '../Helpers/calculateWorldPositionFromInventorySlot';
import * as THREE from 'three';
export default class TilesHolder {
  constructor(type) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.size = new THREE.Vector3(this.world.gameBoard.size, 2, 20);
    this.position = new THREE.Vector3(
      0,
      -2 / 2,
      (this.world.gameBoard.size - 20 + 10) * (type === Types.Player ? 1 : -1)
    );
    this.inventoryArrangement = { x: 10, z: 5 };
    this.inventory = new Array(
      this.inventoryArrangement.x * this.inventoryArrangement.z
    ).fill(null);
    this.nextOpenInventorySlot = 0;
    this.initializeHolder();
  }
  initializeHolder() {
    this.tileHolderGeometry = new THREE.BoxGeometry(
      this.size.x,
      this.size.y,
      this.size.z
    );
    this.tileHolderMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ddd'),
    });
    this.tileHolder = new THREE.Mesh(
      this.tileHolderGeometry,
      this.tileHolderMaterial
    );
    this.tileHolder.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.scene.add(this.tileHolder);
  }

  addToInventory(tile) {
    const tilePosition = calculateWorldPositionFromInventorySlot(
      this.nextOpenInventorySlot,
      // Subtract by size / 2 to start at the top left corner
      this.position.x - this.size.x / 2,
      this.position.z - this.size.z / 2,
      this.size.x,
      this.size.z,
      this.inventoryArrangement
    );
    tile.position.set(tilePosition.x, tilePosition.y, tilePosition.z);
    console.log(tile.position);
    this.scene.add(tile.clone());
    this.inventory[this.nextOpenInventorySlot] = tile;
    this.nextOpenInventorySlot++;
  }

  displayTilesInInventory() {}

  resize() {}

  update() {}
}
