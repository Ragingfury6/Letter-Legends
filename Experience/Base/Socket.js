import { io } from "socket.io-client";
import Experience from "./Experience";
export default class Socket{
    constructor(){
        this.experience = new Experience();
        this.world = this.experience.world;
        this.allTiles = this.world.tiles;
        this.gameBoard = this.world.gameBoard;
        this.opponentTilesHolder = this.world.opponentTilesHolder;
        this.socket = io("http://localhost:3001",{withCredentials:true});
        this.onEvents();
    }
    onEvents(){
        this.socket.on("hello from server", () =>{
            console.log("Got hello from server");
        });
        // Opponent Has Played a Letter
        this.socket.on("Letter Played", (tile)=>{
            // this.gameBoard.createAndAddToInventory(tile);
            this.opponentTilesHolder.updateTilePosition(tile.positionInInventory,tile.position);
            this.gameBoard.inventory.push({object:this.opponentTilesHolder.inventory[tile.positionInInventory]});
        });
        // Opponent has hit start game button
        this.socket.on("Game Start", ({playerTiles, opponentTiles})=>{
            this.world.createPlayers(playerTiles, opponentTiles);
            // Disable Raycaster (so opponent can't play - not his turn)
            this.world.raycaster.updatesEnabled = false;
        });
        // Opponent has ended his turn
        this.socket.on("Switch Turn", ()=>{
            this.world.raycaster.updatesEnabled=true;
        })
    }
    emitTilePlayed(tile){
        this.socket.emit("Letter Played", {position:tile.object.position, positionInInventory:tile.object.positionInInventory})
    }
    emitGameStart(playerTiles, opponentTiles){
        this.socket.emit("Game Start", {playerTiles, opponentTiles})
    }
    emitSwitchTurn(){
        this.socket.emit("Switch Turn");
    }
}