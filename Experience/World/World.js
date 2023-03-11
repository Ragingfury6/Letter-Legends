import Experience from '../Base/Experience';
import Environment from './Environment';
import Tiles from './Tiles';
import GameBoard from './GameBoard';
import Types from '../Constants/Types';
import Raycaster from '../Utils/Raycaster';
import TilesHolder from './TilesHolder';
import Player from '../Player/Player';
import UserInterface from './UserInterface';
import Socket from '../Base/Socket';
import Table from './Table';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.round = 1;

    this.resources = this.experience.resources;
    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.tiles = new Tiles();
      this.gameBoard = new GameBoard(50);
      this.table = new Table();
      this.playerTilesHolder = new TilesHolder(Types.Player);
      this.opponentTilesHolder = new TilesHolder(Types.Opponent);
      // this.player = new Player(Types.Player);
      // this.opponent = new Player(Types.Opponent);
      this.socket = new Socket();
      this.raycaster = new Raycaster();
      this.userInterface = new UserInterface();
    });
  }

  createPlayers(playerTiles, opponentTiles){
    this.player = new Player(Types.Player, playerTiles);
    this.opponent = new Player(Types.Opponent, opponentTiles);
  }

  incrementRound() {
    // One round = Both players play
    this.round+=0.5;
  }

  resize() {}

  update() {
    if(this.raycaster){
      this.raycaster.update();
    }
    if(this.gameBoard){
      this.gameBoard.update();
    }
  }
}
