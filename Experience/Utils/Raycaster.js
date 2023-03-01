import * as THREE from "three";
import Experience from "../Base/Experience";
import RaycastingState from "../Constants/RaycastingState";
import Types from "../Constants/Types";
import PulsatingShader from "../Shaders/PulsatingShader";
export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.sizes = this.experience.sizes;
    this.socket = this.world.socket;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 1;
    this.raycaster.params.Points.threshold = 1;
    this.camera = this.experience.camera.perspectiveCamera;
    this.pointer = new THREE.Vector2();
    this.currentIntersectionPoint = null;
    this.tileIndex = 0;
    this.raycastingState = RaycastingState.TileClick;
    this.hasMovedMouseToValidPosition = false;
    this.updatesEnabled = true;
    window.addEventListener("pointermove", (e) => this.onPointerMove(e));
    window.addEventListener("mousedown", () => this.onMouseDown());
    
    this.validShader = new PulsatingShader(0.0,1.0,0.0);
    this.invalidShader = new PulsatingShader(1.0,0.0,0.0);
  }
  onPointerMove(e) {
    this.pointer.x = (e.clientX / this.sizes.width) * 2 - 1;
    this.pointer.y = -(e.clientY / this.sizes.height) * 2 + 1;
    this.updatesEnabled &&
      this.raycastingState === RaycastingState.GameBoardHover &&
      this.updateRaycast();
  }

  onMouseDown() {
    if (this.updatesEnabled) {
      if (this.raycastingState === RaycastingState.TileClick) {
        this.updateRaycast();
      }else if(this.raycastingState === RaycastingState.GameBoardHover){
        const isValid = this.world.gameBoard.validateNewTilePosition(this.intersectingTile.object.position);
        if(isValid && this.hasMovedMouseToValidPosition){
          // Tile has been successfully played
          this.raycastingState = RaycastingState.TileClick;
          this.world.gameBoard.addToInventory(this.intersectingTile);
          this.hasMovedMouseToValidPosition = false;
          this.intersectingTile.object.material = this.intersectingTile.object.originalMaterial;
          this.intersectingTile.object.hasBeenPlayed = true;
          this.world.playerTilesHolder.nextOpenInventorySlot = Math.min(this.world.playerTilesHolder.nextOpenInventorySlot,this.intersectingTile.object.positionInInventory);
          // emit to opponent
          this.socket.emitTilePlayed(this.intersectingTile);
        }
      }
    }
  }

  updateRaycast() {
    if (this.world.gameBoard) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersect = this.raycaster.intersectObject(this.scene);
      if (this.raycastingState === RaycastingState.GameBoardHover) {
        this.handleGameBoardIntersection(intersect);
      } else if (this.raycastingState === RaycastingState.TileClick) {
        this.handleTileClickIntersection(intersect);
      }
    }
  }
  handleGameBoardIntersection(intersect) {
    if (intersect.length > 0) {
      const boardIntersect = intersect.find(
        (i) => i.object.name === "GameBoard"
      );
      if (boardIntersect) {
        this.hasMovedMouseToValidPosition = true;
        this.currentIntersectionPoint = boardIntersect.point;
        this.world.playerTilesHolder.updateTilePosition(
          this.tileIndex,
          this.currentIntersectionPoint
        );
        const isValid = this.world.gameBoard.validateNewTilePosition(this.intersectingTile.object.position);
        if(isValid){
          this.intersectingTile.object.material = this.validShader.shader;
        }else{
          this.intersectingTile.object.material = this.invalidShader.shader;
        }
      }
    } else {
      this.currentIntersectionPoint = null;
    }
  }
  handleTileClickIntersection(intersect) {
    if (intersect.length > 0) {
      const regex = /^[A-Z]$/gi;
      this.intersectingTile = intersect.find((i) =>
        i.object.name.match(regex)
      );
      if (this.intersectingTile) {
          if(this.intersectingTile.object.playerType === Types.Player && !this.intersectingTile.object.hasBeenPlayed){
            this.tileIndex = this.intersectingTile.object.positionInInventory;
            this.raycastingState = RaycastingState.GameBoardHover;
          }
      }
    }
  }

  update(){
    this.validShader.update();
    this.invalidShader.update();
  }
}
