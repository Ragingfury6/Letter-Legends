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
      letter.object.position[direction] <= positionOfStartingLetter &&
      letter.object.position[oppositeDirection] ===
        startingFrom[oppositeDirection]
    ) {
      positionOfStartingLetter = letter.object.position[direction];
      startingLetter=letter.object.name;
      startingLetterPos = {...letter.object.position};
    }
  }
  return { x: startingLetterPos.x, z:startingLetterPos.z, letter:startingLetter };
}
