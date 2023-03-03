import Experience from '../Base/Experience';
import Types from '../Constants/Types';
import calculateWorldPositionFromInventorySlot from '../Helpers/calculateWorldPositionFromInventorySlot';
import * as THREE from 'three';
import gsap from 'gsap';
import { Vector3 } from 'three';
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
    this.type = type;
    this.inventoryArrangement = { x: 10, z: 5 };
    this.inventory = [];
    this.nextOpenInventorySlot = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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

  calculateTilePositionFromInventory() {
    return calculateWorldPositionFromInventorySlot(
      this.nextOpenInventorySlot[0],
      // Subtract by size / 2 to start at the top left corner
      this.position.x - this.size.x / 2,
      this.position.z - this.size.z / 2,
      this.size.x,
      this.size.z,
      this.inventoryArrangement
    );
  }

  findNextOpenSlot() {
    if (this.nextOpenInventorySlot[0] === undefined) {
      this.nextOpenInventorySlot[0] = this.inventory.length;
    }
    return this.nextOpenInventorySlot[0];
  }

  addToInventory(tile, existing, animated, delay = 0.5) {
    this.findNextOpenSlot();
    const tilePosition = this.calculateTilePositionFromInventory();
    const clonedTile = existing ? tile : tile.clone();
    // temp for animation testing
    if (animated) clonedTile.position.copy(new Vector3(0, 0, 0));
    if (existing || animated) {
      gsap.to(clonedTile.position, {
        x: tilePosition.x,
        y: tilePosition.y,
        z: tilePosition.z,
        duration: 1.5,
        delay: delay,
      });
    } else {
      clonedTile.position.set(tilePosition.x, tilePosition.y, tilePosition.z);
    }
    clonedTile.positionInInventory = this.nextOpenInventorySlot[0];
    clonedTile.originalMaterial = clonedTile.material.clone();
    clonedTile.playerType = this.type;
    this.inventory[this.nextOpenInventorySlot[0]] = clonedTile;
    if (!existing) this.scene.add(clonedTile);
    this.nextOpenInventorySlot.shift();
  }

  removeFromInventory(positionInInventory) {
    this.inventory[positionInInventory] = null;
  }

  addSlotAndSort(position) {
    this.nextOpenInventorySlot.push(position);
    this.nextOpenInventorySlot.sort((a, b) => {
      if (a - b < 0) return -1;
      if (a - b > 0) return 1;
      return 0;
    });
  }

  updateTilePosition(index, intersectionPoint, animate = false) {
    const newPosition = new THREE.Vector3(
      2 * Math.round(intersectionPoint.x / 2),
      2 * Math.round(intersectionPoint.y / 2),
      2 * Math.round(intersectionPoint.z / 2)
    );
    if (animate) {
      gsap.to(this.inventory[index].position, {
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
        duration: 1,
      });
    } else {
      this.inventory[index].position.x = newPosition.x;
      this.inventory[index].position.y = newPosition.y;
      this.inventory[index].position.z = newPosition.z;
    }
  }

  resize() {}

  update() {}
}
