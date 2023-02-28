import calculatePositionOfStartingLetter from "./calculatePositionOfStartingLetter";

export default function calculateWordOnAxisFromPosition(mainAxis,gameBoard,startingPosition, direction, currentLetter){
    const mainAxisWord = [];
    const crossAxisWords = [];
    const oppositeDirection = direction === "x" ? "z" : "x";
    while(currentLetter){
        mainAxisWord.push(currentLetter.object.name);
        if(mainAxis){
            const crossAxisLetter = gameBoard.inventory.find(t=>t.object.position[direction] === currentLetter.object.position[direction] && t.object.position[oppositeDirection] !== currentLetter.object.position[oppositeDirection]);
            if(crossAxisLetter){
                const crossStartingPosition = calculatePositionOfStartingLetter(crossAxisLetter.object.position, gameBoard, oppositeDirection);
                const newCurrentLetter = gameBoard.inventory.find(t=>t.object.position[direction] === startingPosition && t.object.position[oppositeDirection] !== currentLetter.object.position[oppositeDirection]);
                console.log(newCurrentLetter)
                const newWord = calculateWordOnAxisFromPosition(false, gameBoard, crossStartingPosition, oppositeDirection, newCurrentLetter);
                if(newWord) crossAxisWords.push(newWord);
            }
        }
        startingPosition+=2;
        currentLetter = gameBoard.inventory.find(t=>t.object.position[direction] === startingPosition && t.object.position[oppositeDirection] === currentLetter.object.position[oppositeDirection])
    };
    console.log(mainAxisWord,crossAxisWords);
    if(mainAxis){
        crossAxisWords.push(mainAxisWord.join(""));
        return crossAxisWords;
    }else{
        return mainAxisWord.join("")
    }
  }