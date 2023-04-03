import Experience from '../Base/Experience';
import calculateDirectionOfPlay from '../Helpers/WordValidation/calculateDirectionOfPlay';
import calculatePositionOfStartingLetter from '../Helpers/WordValidation/calculatePositionOfStartingLetter';
import words from '../Constants/Words';
import calculateWordMoney from '../Helpers/MoneyCalculation/calculateWordMoney';
import Letters from '../Constants/Letters';
import Player from '../Player/Player';
import Types from '../Constants/Types';
import Curves from '../Constants/Curves';
import gsap from 'gsap';
import { SlowMo } from 'gsap/all';

export default class UserInterface {
  constructor() {
    this.experience = new Experience();
    this.audioController = this.experience.audioController;
    this.controls = this.experience.controls;
    this.world = this.experience.world;
    this.allTiles = this.world.tiles;
    this.socket = this.world.socket;
    this.money = document.querySelector('.money');
    this.yourMoney = document.querySelector('.money-self');
    this.opponentMoney = document.querySelector('.money-opponent');

    this.startScreen = document.querySelector('.start-screen');
    this.startScreenContent = document.querySelector('.start-screen-content');
    this.startScreenInstructions = document.querySelector(
      '.start-screen-instructions'
    );
    this.backButton = document.querySelector('.back');

    this.lettersUpgradeCost = 20;

    document
      .querySelector('.endTurn')
      .addEventListener('click', () => this.handleEndTurn());
    document
      .querySelector('.upgrade-letters')
      .addEventListener('click', () => this.handleLettersUpgrade());
    document
      .querySelector('.socketStart')
      .addEventListener('click', () => this.handleSocketConnection());
    document
      .querySelector('.instructions')
      .addEventListener('click', () => this.handleInstructions());
    this.backButton.addEventListener('click', () => this.handleBackButton());
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
            newPosition.letter =
              this.world.gameBoard.inventory[newNextLetterIdx].name;
            indexesFromGameboard.push(newNextLetterIdx);
          }
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
        positionOfStartingLetter.letter =
          this.world.gameBoard.inventory[nextLetterIdx].name;
        indexesFromGameboard.push(nextLetterIdx);
      }
    } while (nextLetterIdx !== -1);
    crossAxisWords.push(mainAxisWord.join(''));
    const allWords = [...crossAxisWords];
    console.log(allWords);
    //w.length===1 bc of playing 1 tile glitches into two words
    if (allWords.every((w) => words.includes(w) || w.length === 1)) {
      const moneyEarned = allWords.reduce(
        (a, e) => a + calculateWordMoney(e),
        0
      );
      const totalMoney =
        Number(this.money.getAttribute('data-value')) + moneyEarned;
      this.yourMoney.textContent = `You - $${totalMoney}`;
      this.money.setAttribute('data-value', totalMoney);
      this.world.gameBoard.tilesPlayedOnThisTurn = [];
      // Emit a switch turn event
      this.world.raycaster.updatesEnabled = false;
      this.socket.emitSwitchTurn(totalMoney);
      // Add new tiles to inventory
      const generatedTiles = Letters.generateTiles(
        this.world.gameBoard.newLettersPerTurn
      );
      generatedTiles.forEach((t, idx) =>
        this.allTiles.fillInventoryWithTileByLetterName(
          t,
          Types.Player,
          idx / 4
        )
      );
      this.world.gameBoard.applyShaderAfterEndTurn(indexesFromGameboard, true);
      this.controls.beginAnimationFromCamera(Curves.DefaultPosition, true);
      this.audioController.playSound("Money");
      this.world.incrementRound();
      this.displayTurnOverlay(Types.Opponent, this.world.round);
      this.socket.emitFillTiles(generatedTiles);
    } else {
      this.world.gameBoard.applyShaderAfterEndTurn(indexesFromGameboard, false);
    }
  }
  updateMoneyValueForOpponent(totalMoney){
    this.money.setAttribute("opponent-value", totalMoney);
    this.opponentMoney.textContent = `Opponent - $${totalMoney}`;
  }
  handleLettersUpgrade() {
    const totalMoney =
      Number(this.money.getAttribute('data-value')) - this.lettersUpgradeCost;
      console.log(totalMoney)
    if (totalMoney >= 0) {
      this.yourMoney.textContent = `You - $${totalMoney}`;
      this.money.setAttribute('data-value', totalMoney);
      this.lettersUpgradeCost = Math.ceil(
        this.lettersUpgradeCost * Math.sqrt(2)
      );
      document.querySelector(".upgrade-letters-cost").textContent = `New Letters Per Turn · $${this.lettersUpgradeCost}`;
      this.world.gameBoard.newLettersPerTurn++;
    }
  }
  handleSocketConnection() {
    this.removeStartScreen(() => {
      const playerTiles = Letters.generateTiles(10);
      const opponentTiles = Letters.generateTiles(10);
      this.world.createPlayers(playerTiles, opponentTiles);
      this.socket.emitGameStart(opponentTiles, playerTiles);
      this.displayTurnOverlay(Types.Player, 1);
    });
  }
  displayTurnOverlay(turn, round) {
    document.querySelector(
      '.turn-overlay > h2'
    ).textContent = `Round ${Math.floor(round)} / 10`;
    document.querySelector('.turn-overlay > p').textContent = `${
      turn === Types.Player ? 'Your' : "Opponent's"
    } Turn`;
    gsap.fromTo(
      '.turn-overlay',
      { xPercent: 0 },
      {
        xPercent: 200,
        duration: 4,
        ease: SlowMo.ease.config(0.1, 0.9),
        delay: 2,
      }
    );
  }
  removeStartScreen(afterTransition) {
    this.startScreen.classList.add('opacity-0');
    this.startScreen.addEventListener('transitionend', () => {
      this.startScreen.classList.add('hidden');
      afterTransition();
    });
  }
  handleInstructions() {
    this.startScreen.classList.add('zoomed');
    this.startScreenContent.classList.add('shift-right');
    const shiftLeft = () => {
      this.startScreenInstructions.classList.remove('shift-left');
      this.startScreenContent.removeEventListener('transitionend', shiftLeft);
    };
    this.startScreenContent.addEventListener('transitionend', shiftLeft);
  }
  handleBackButton() {
    this.startScreenInstructions.classList.add('shift-left');
    const shiftLeft = () => {
      this.startScreenContent.classList.remove('shift-right');
      this.startScreenInstructions.removeEventListener(
        'transitionend',
        shiftLeft
      );
      this.startScreen.classList.remove('zoomed');
    };
    this.startScreenInstructions.addEventListener('transitionend', shiftLeft);
  }
}
