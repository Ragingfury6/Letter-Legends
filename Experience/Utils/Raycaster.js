import * as THREE from 'three';
import Experience from '../Base/Experience';
import Curves from '../Constants/Curves';
import RaycastingState from '../Constants/RaycastingState';
import calculateFinalCameraPositionForTilePlayAnimation from '../Helpers/CameraAnimation/calculateFinalCameraPositionForTilePlayAnimation';
import Types from '../Constants/Types';
import PulsatingShader from '../Shaders/PulsatingShader';
export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.controls = this.experience.controls;
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
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('mousedown', () => this.onMouseDown());
    window.addEventListener('contextmenu', (e) => this.onRightClick(e));

    this.validShader = new PulsatingShader(0.0, 1.0, 0.0);
    this.invalidShader = new PulsatingShader(1.0, 0.0, 0.0);
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
      } else if (this.raycastingState === RaycastingState.GameBoardHover) {
        const isValid = this.world.gameBoard.validateNewTilePosition(
          this.intersectingTile.object.position
        );
        if (isValid && this.hasMovedMouseToValidPosition) {
          // Tile has been successfully played
          this.raycastingState = RaycastingState.TileClick;
          this.world.gameBoard.addToInventory(
            this.intersectingTile.object,
            false
          );
          this.hasMovedMouseToValidPosition = false;
          this.intersectingTile.object.material =
            this.intersectingTile.object.originalMaterial;
          this.intersectingTile.object.hasBeenPlayed = true;
          this.world.playerTilesHolder.addSlotAndSort(
            this.intersectingTile.object.positionInInventory
          );
          this.world.playerTilesHolder.removeFromInventory(
            this.intersectingTile.object.positionInInventory
          );
          this.controls.beginAnimationFromCamera(Curves.DefaultPosition, true);
          // emit to opponent
          // this.socket.emitTilePlayed(this.intersectingTile);
          const tile = {
            position: new THREE.Vector3(
              this.intersectingTile.object.position.x,
              this.intersectingTile.object.position.y,
              this.intersectingTile.object.position.z
            ),
            positionInInventory:
              this.intersectingTile.object.positionInInventory,
          };
          this.socket.emitTilePlayed(tile);
        }
      }
    }
  }

  onRightClick() {
    if (this.updatesEnabled) {
      this.raycastingState = RaycastingState.TileClick;
      this.updateRaycast();
      if (this.intersectingTile) {
        const playedThisTurn = this.world.gameBoard.tilesPlayedOnThisTurn.some(t=>t.position.equals(this.intersectingTile.object.position));
        if (this.intersectingTile.object.hasBeenPlayed === true && playedThisTurn) {
          this.intersectingTile.object.hasBeenPlayed = false;
          // remove from gameboard
          const removedPosition = this.intersectingTile.object.position;
          this.world.gameBoard.removeFromInventory(removedPosition);
          // // add back to inventory
          this.socket.emitTileRemoved(
            new THREE.Vector3(
              removedPosition.x,
              removedPosition.y,
              removedPosition.z
            )
          );
          this.world.playerTilesHolder.addToInventory(
            this.intersectingTile.object,
            true,
            false,
            0
          );
        }
      }
    }
  }

  updateRaycast(isRemovingTileFromGameBoard = false) {
    if (this.world.gameBoard) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersect = this.raycaster.intersectObject(this.scene);
      if (this.raycastingState === RaycastingState.GameBoardHover) {
        this.handleGameBoardIntersection(intersect);
      } else if (this.raycastingState === RaycastingState.TileClick) {
        this.handleTileClickIntersection(
          intersect,
          isRemovingTileFromGameBoard
        );
      }
    }
  }
  handleGameBoardIntersection(intersect) {
    if (intersect.length > 0) {
      const boardIntersect = intersect.find(
        (i) => i.object.name === 'GameBoard'
      );
      if (boardIntersect) {
        this.hasMovedMouseToValidPosition = true;
        this.currentIntersectionPoint = boardIntersect.point;
        this.world.playerTilesHolder.updateTilePosition(
          this.tileIndex,
          this.currentIntersectionPoint
        );
        const isValid = this.world.gameBoard.validateNewTilePosition(
          this.intersectingTile.object.position
        );
        if (isValid) {
          this.intersectingTile.object.material = this.validShader.shader;
        } else {
          this.intersectingTile.object.material = this.invalidShader.shader;
        }
      }
    } else {
      this.currentIntersectionPoint = null;
    }
  }
  handleTileClickIntersection(intersect, isRemovingTileFromGameBoard = false) {
    if (intersect.length > 0) {
      const regex = /^[A-Z]$/gi;
      this.intersectingTile = intersect.find((i) => i.object.name.match(regex));
      if (this.intersectingTile) {
        if (this.intersectingTile.object.playerType === Types.Player) {
          // fix bc isremoving doesn't guarantee you have played it
          if (
            isRemovingTileFromGameBoard ||
            !this.intersectingTile.object.hasBeenPlayed
          ) {
            this.tileIndex = this.intersectingTile.object.positionInInventory;
            this.raycastingState = isRemovingTileFromGameBoard
              ? RaycastingState.TileClick
              : RaycastingState.GameBoardHover;
            const animateTo = calculateFinalCameraPositionForTilePlayAnimation(this.world.gameBoard.getLastPlayedTile());
            this.controls.beginAnimationFromCamera(animateTo);
          }
        }
      }
    }
  }

  update() {
    this.validShader.update();
    this.invalidShader.update();
  }
}
