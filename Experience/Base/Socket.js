import { io } from 'socket.io-client';
import Types from '../Constants/Types';
import Experience from './Experience';
export default class Socket {
  constructor() {
    this.experience = new Experience();
    this.world = this.experience.world;
    this.allTiles = this.world.tiles;
    this.gameBoard = this.world.gameBoard;
    this.opponentTilesHolder = this.world.opponentTilesHolder;
    this.socket = io('http://localhost:3002', { withCredentials: true });
    this.onEvents();
  }
  onEvents() {
    this.socket.on('hello from server', () => {
      console.log('Got hello from server');
    });
    // Opponent Has Played a Letter
    this.socket.on('Letter Played', (tile) => {
      // remove from opponentTilesHolder
      this.opponentTilesHolder.addSlotAndSort(tile.positionInInventory);
      this.opponentTilesHolder.updateTilePosition(
        tile.positionInInventory,
        tile.position,
        true
      );
      this.gameBoard.inventory.push(
        this.opponentTilesHolder.inventory[tile.positionInInventory]
      );
      this.opponentTilesHolder.removeFromInventory(tile.positionInInventory);
    });

    // Opponent Has Removed a Letter
    this.socket.on('Letter Removed', ({ position }) => {
      const removedTile = this.world.gameBoard.findTileByPosition(position);
      if (removedTile) {
        this.world.gameBoard.removeFromInventory(position);
        this.world.opponentTilesHolder.addToInventory(removedTile, true, false,0);
      }
    });

    // Opponents turn has ended and new tiles are added to his inventory
    this.socket.on('Fill Tiles', (letters) => {
      letters.forEach((t, idx) =>
        this.allTiles.fillInventoryWithTileByLetterName(
          t,
          Types.Opponent,
          idx / 4
        )
      );
    });

    // Opponent has hit start game button
    this.socket.on('Game Start', ({ playerTiles, opponentTiles }) => {
      this.world.createPlayers(playerTiles, opponentTiles);
      // Disable Raycaster (so opponent can't play - not his turn)
      this.world.raycaster.updatesEnabled = false;
      // Remove his start screen
      this.world.userInterface.removeStartScreen(()=>{});
      // Show the Overlay
      this.world.userInterface.displayTurnOverlay(Types.Opponent, 1);
    });
    // Opponent has ended his turn
    this.socket.on('Switch Turn', (totalMoney) => {
      this.world.raycaster.updatesEnabled = true;
      this.world.incrementRound();
      this.world.userInterface.displayTurnOverlay(Types.Player, this.world.round);
      this.world.userInterface.updateMoneyValueForOpponent(totalMoney);
    });
  }
  emitFillTiles(letters) {
    this.socket.emit('Fill Tiles', letters);
  }
  emitTilePlayed(tile) {
    this.socket.emit('Letter Played', tile);
  }
  emitTileRemoved(position) {
    this.socket.emit('Letter Removed', { position });
  }
  emitGameStart(playerTiles, opponentTiles) {
    this.socket.emit('Game Start', { playerTiles, opponentTiles });
  }
  emitSwitchTurn(totalMoney) {
    this.socket.emit('Switch Turn', totalMoney);
  }
}
