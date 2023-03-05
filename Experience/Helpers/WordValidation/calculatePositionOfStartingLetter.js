export default function calculatePositionOfStartingLetter(
  startingFrom,
  gameBoard,
  direction,
  oppositeDirection
) {
  let positionOfStartingLetter = startingFrom[direction];
  let startingLetter;
  let startingLetterPos;
  let startingLetterIdx;
  let possibleStartingLetters = [];
  gameBoard.inventory.forEach((letter,idx) => {
    if (
      letter.position[direction] <= positionOfStartingLetter &&
      letter.position[oppositeDirection] ===
        startingFrom[oppositeDirection]
    ) {
      possibleStartingLetters.push({letter, idx});
    }
  });
  if(possibleStartingLetters.length === 1) return { x: possibleStartingLetters[0].letter.position.x, z:possibleStartingLetters[0].letter.position.z, letter:possibleStartingLetters[0].letter.name, idx:possibleStartingLetters[0].idx }
  while(possibleStartingLetters.length > 0){
    const nextLetterOverOrSameLetterIndex = possibleStartingLetters.findIndex(({letter})=>positionOfStartingLetter-2 === letter.position[direction]);
    if(nextLetterOverOrSameLetterIndex !== -1){
      positionOfStartingLetter = possibleStartingLetters[nextLetterOverOrSameLetterIndex].letter.position[direction];
      startingLetter=possibleStartingLetters[nextLetterOverOrSameLetterIndex].letter.name;
      startingLetterPos = {...possibleStartingLetters[nextLetterOverOrSameLetterIndex].letter.position};
      startingLetterIdx = possibleStartingLetters[nextLetterOverOrSameLetterIndex].idx;
    }
    possibleStartingLetters.splice(nextLetterOverOrSameLetterIndex, 1);
  }
  return { x: startingLetterPos.x, z:startingLetterPos.z, letter:startingLetter, idx:startingLetterIdx };
}
/*
 positionOfStartingLetter = letter.position[direction];
      startingLetter=letter.name;
      startingLetterPos = {...letter.position};
      startingLetterIdx = idx;
*/