import Experience from "../Base/Experience";
import calculateDirectionOfPlay from "../Helpers/WordValidation/calculateDirectionOfPlay";
import calculatePositionOfStartingLetter from "../Helpers/WordValidation/calculatePositionOfStartingLetter";
import words from "../Constants/Words";
import calculateWordMoney from "../Helpers/MoneyCalculation/calculateWordMoney";

export default class UserInterface {
  constructor() {
    this.experience = new Experience();
    this.world = this.experience.world;
    this.money = document.querySelector(".money");

    document
      .querySelector(".endTurn")
      .addEventListener("click", () => this.handleEndTurn());
    // document
    //   .querySelector(".socketStart")
    //   .addEventListener("click", () => this.handleSocketConnection());
  }
  handleEndTurn() {
    const directionOfPlay = calculateDirectionOfPlay(
      this.world.gameBoard.tilesPlayedOnThisTurn
    );
    const oppositeDirection = directionOfPlay === "x" ? "z" : "x";
    let positionOfStartingLetter = calculatePositionOfStartingLetter(
      this.world.gameBoard.tilesPlayedOnThisTurn[0].object.position,
      this.world.gameBoard,
      directionOfPlay,
      oppositeDirection
    );
    let nextLetter;
    let mainAxisWord = [];
    let crossAxisWords = [];
    do {
      mainAxisWord.push(positionOfStartingLetter.letter);

      if (
        this.world.gameBoard.inventory.find(
          (t) =>
            t.object.position[directionOfPlay] ===
              positionOfStartingLetter[directionOfPlay] &&
            Math.abs(
              positionOfStartingLetter[oppositeDirection] -
                t.object.position[oppositeDirection]
            ) === 2
        ) &&
        this.world.gameBoard.tilesPlayedOnThisTurn.find(
          (t) =>
            t.object.position.x === positionOfStartingLetter.x &&
            t.object.position.z === positionOfStartingLetter.z
        )
      ) {
        let newPosition = calculatePositionOfStartingLetter(
          positionOfStartingLetter,
          this.world.gameBoard,
          oppositeDirection,
          directionOfPlay
        );
        let newNextLetter;
        const newWord = [];
        do {
          newWord.push(newPosition.letter);
          newPosition[oppositeDirection] += 2;
          newNextLetter = this.world.gameBoard.inventory.find(
            (t) =>
              t.object.position[oppositeDirection] ===
                newPosition[oppositeDirection] &&
              t.object.position[directionOfPlay] ===
                newPosition[directionOfPlay]
          );
          if (newNextLetter) newPosition.letter = newNextLetter.object.name;
        } while (newNextLetter);
        crossAxisWords.push(newWord.join(""));
      }

      positionOfStartingLetter[directionOfPlay] += 2;
      nextLetter = this.world.gameBoard.inventory.find(
        (t) =>
          t.object.position[directionOfPlay] ===
            positionOfStartingLetter[directionOfPlay] &&
          t.object.position[oppositeDirection] ===
            positionOfStartingLetter[oppositeDirection]
      );
      if (nextLetter) positionOfStartingLetter.letter = nextLetter.object.name;
    } while (nextLetter);
    crossAxisWords.push(mainAxisWord.join(""));
    const allWords = [...crossAxisWords];
    console.log(allWords);
    if (allWords.every((w) => words.includes(w))) {
      const moneyEarned = allWords.reduce(
        (a, e) => a + calculateWordMoney(e),
        0
      );
      const totalMoney =
        Number(this.money.getAttribute("data-value")) + moneyEarned;
      this.money.textContent = `$${totalMoney}`;
      this.money.setAttribute("data-value", totalMoney);
      this.world.gameBoard.tilesPlayedOnThisTurn = [];
    }
  }
  // handleSocketConnection(){
  //   this.socket = 
  // }
}
