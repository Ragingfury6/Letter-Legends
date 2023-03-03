export default function calculatePositionOfStartingLetter(
  startingFrom,
  gameBoard,
  direction,
  oppositeDirection
) {
  let positionOfStartingLetter = startingFrom[direction];
  let startingLetter;
  let startingLetterPos;
  for (const letter of gameBoard.inventory) {
    if (
      letter.position[direction] <= positionOfStartingLetter &&
      letter.position[oppositeDirection] ===
        startingFrom[oppositeDirection]
    ) {
      positionOfStartingLetter = letter.position[direction];
      startingLetter=letter.name;
      startingLetterPos = {...letter.position};
    }
  }
  return { x: startingLetterPos.x, z:startingLetterPos.z, letter:startingLetter };
}
