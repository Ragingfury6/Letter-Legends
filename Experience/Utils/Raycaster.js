import * as THREE from "three";
import Experience from "../Base/Experience";
export default class Raycaster {
  constructor(gameBoard) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.gameBoard = gameBoard;
    this.sizes = this.experience.sizes;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 1;
    this.raycaster.params.Points.threshold = 1;
    this.camera = this.experience.camera.perspectiveCamera;
    this.pointer = new THREE.Vector2();
    this.currentIntersectionPoint = null;
    this.updatesEnabled = true;
    window.addEventListener("pointermove", (e) => this.onPointerMove(e));
  }
  onPointerMove(e) {
    this.pointer.x = (e.clientX / this.sizes.width) * 2 - 1;
    this.pointer.y = -(e.clientY / this.sizes.height) * 2 + 1;
    this.updatesEnabled && this.update();
  }

  update() {
      if (this.gameBoard) {
          this.raycaster.setFromCamera(this.pointer, this.camera);
          const intersect = this.raycaster.intersectObject(
              this.gameBoard
              );
              if (intersect.length > 0) {
                  this.currentIntersectionPoint = intersect[0].point;
        this.world.playerTilesHolder.inventory[0].position.x = 2 * Math.ceil(this.currentIntersectionPoint.x / 2);
        this.world.playerTilesHolder.inventory[0].position.y = 2 * Math.ceil(this.currentIntersectionPoint.y / 2);
        this.world.playerTilesHolder.inventory[0].position.z = 2 * Math.ceil(this.currentIntersectionPoint.z / 2);
      } else {
        this.currentIntersectionPoint = null;
      }
    }
  }
}
