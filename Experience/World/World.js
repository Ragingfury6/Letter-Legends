import Experience from '../Base/Experience';
import Environment from './Environment';
import Tiles from './Tiles';
import GameBoard from './GameBoard';
import Types from '../Constants/Types';

import * as THREE from 'three';
import TilesHolder from './TilesHolder';
import Player from '../Player/Player';
export default class World {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;

    this.resources = this.experience.resources;
    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.tiles = new Tiles();
      this.gameBoard = new GameBoard(50);
      this.playerTilesHolder = new TilesHolder(Types.Player);
      this.opponentTilesHolder = new TilesHolder(Types.Opponent);
      this.player = new Player(Types.Player);
      this.opponent = new Player(Types.Opponent);
    });
  }

  resize() {}

  update() {
    if(this.gameBoard){
      this.gameBoard.update();
    }
  }
}
