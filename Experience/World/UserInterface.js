import Experience from '../Base/Experience';
import calculateDirectionOfPlay from '../Helpers/WordValidation/calculateDirectionOfPlay';
import calculatePositionOfStartingLetter from '../Helpers/WordValidation/calculatePositionOfStartingLetter';
import words from '../Constants/Words';
import calculateWordMoney from '../Helpers/MoneyCalculation/calculateWordMoney';
import Letters from '../Constants/Letters';
import Player from '../Player/Player';
import Types from '../Constants/Types';
import Curves from '../Constants/Curves';

export default class UserInterface {
  constructor() {
    this.experience = new Experience();
    this.controls = this.experience.controls;
    this.world = this.experience.world;
    this.allTiles = this.world.tiles;
    this.socket = this.world.socket;
    this.money = document.querySelector('.money');

    document
      .querySelector('.endTurn')
      .addEventListener('click', () => this.handleEndTurn());
    document
      .querySelector('.socketStart')
      .addEventListener('click', () => this.handleSocketConnection());
  }
  handleEndTurn() {
    console.log(this.world.playerTilesHolder.nextOpenInventorySlot);
    const directionOfPlay = calculateDirectionOfPlay(
      this.world.gameBoard.tilesPlayedOnThisTurn
    );
    const oppositeDirection = directionOfPlay === 'x' ? 'z' : 'x';
    let positionOfStartingLetter = calculatePositionOfStartingLetter(
      this.world.gameBoard.tilesPlayedOnThisTurn[0].position,
      this.world.gameBoard,
      directionOfPlay,
      oppositeDirection
    );
    let nextLetterIdx = -1;
    let mainAxisWord = [];
    let crossAxisWords = [];
    let indexesFromGameboard = [];
    indexesFromGameboard.push(positionOfStartingLetter.idx);
    do {
      mainAxisWord.push(positionOfStartingLetter.letter);

      if (
        this.world.gameBoard.inventory.find(
          (t) =>
            t.position[directionOfPlay] ===
              positionOfStartingLetter[directionOfPlay] &&
            Math.abs(
              positionOfStartingLetter[oppositeDirection] -
                t.position[oppositeDirection]
            ) === 2
        ) &&
        this.world.gameBoard.tilesPlayedOnThisTurn.find(
          (t) =>
            t.position.x === positionOfStartingLetter.x &&
            t.position.z === positionOfStartingLetter.z
        )
      ) {
        let newPosition = calculatePositionOfStartingLetter(
          positionOfStartingLetter,
          this.world.gameBoard,
          oppositeDirection,
          directionOfPlay
        );
        indexesFromGameboard.push(newPosition.idx);
        let newNextLetterIdx = -1;
        const newWord = [];
        do {
          newWord.push(newPosition.letter);
          newPosition[oppositeDirection] += 2;
          newNextLetterIdx = this.world.gameBoard.inventory.findIndex(
            (t) =>
              t.position[oppositeDirection] ===
                newPosition[oppositeDirection] &&
              t.position[directionOfPlay] === newPosition[directionOfPlay]
          );
          if (newNextLetterIdx !== -1) {
            console.log(newNextLetterIdx);
            newPosition.letter = this.world.gameBoard.inventory[newNextLetterIdx].name;
            indexesFromGameboard.push(newNextLetterIdx);
          };
        } while (newNextLetterIdx !== -1);
        crossAxisWords.push(newWord.join(''));
      }

      positionOfStartingLetter[directionOfPlay] += 2;
      nextLetterIdx = this.world.gameBoard.inventory.findIndex(
        (t) =>
          t.position[directionOfPlay] ===
            positionOfStartingLetter[directionOfPlay] &&
          t.position[oppositeDirection] ===
            positionOfStartingLetter[oppositeDirection]
      );
      if (nextLetterIdx !== -1) {
        positionOfStartingLetter.letter = this.world.gameBoard.inventory[nextLetterIdx].name;
        indexesFromGameboard.push(nextLetterIdx);
      };
    } while (nextLetterIdx !== -1);
    crossAxisWords.push(mainAxisWord.join(''));
    const allWords = [...crossAxisWords];
    console.log(allWords);
    if (allWords.every((w) => words.includes(w))) {
      const moneyEarned = allWords.reduce(
        (a, e) => a + calculateWordMoney(e),
        0
      );
      const totalMoney =
        Number(this.money.getAttribute('data-value')) + moneyEarned;
      this.money.textContent = `$${totalMoney}`;
      this.money.setAttribute('data-value', totalMoney);
      this.world.gameBoard.tilesPlayedOnThisTurn = [];
      // Emit a switch turn event
      this.world.raycaster.updatesEnabled = false;
      this.socket.emitSwitchTurn();
      // Add new tiles to inventory
      const generatedTiles = Letters.generateTiles(4);
      generatedTiles.forEach((t, idx) =>
        this.allTiles.fillInventoryWithTileByLetterName(
          t,
          Types.Player,
          idx / 4
        )
      );
      this.world.gameBoard.applyShaderAfterEndTurn(indexesFromGameboard, true);
      this.controls.beginAnimationFromCamera(Curves.DefaultPosition, true)
      this.socket.emitFillTiles(generatedTiles);
    }else{
      this.world.gameBoard.applyShaderAfterEndTurn(indexesFromGameboard, false);
    }
  }
  handleSocketConnection() {
    const playerTiles = Letters.generateTiles(10);
    const opponentTiles = Letters.generateTiles(10);
    this.world.createPlayers(playerTiles, opponentTiles);
    this.socket.emitGameStart(opponentTiles, playerTiles);
  }
}
