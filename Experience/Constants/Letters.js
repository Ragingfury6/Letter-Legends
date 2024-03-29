export default class Letters {
  static LetterFrequencies = [
    { letter: 'A', value: 9 },
    { letter: 'B', value: 2 },
    { letter: 'C', value: 2 },
    { letter: 'D', value: 4 },
    { letter: 'E', value: 12 },
    { letter: 'F', value: 2 },
    { letter: 'G', value: 3 },
    { letter: 'H', value: 2 },
    { letter: 'I', value: 9 },
    { letter: 'J', value: 1 },
    { letter: 'K', value: 1 },
    { letter: 'L', value: 4 },
    { letter: 'M', value: 2 },
    { letter: 'N', value: 6 },
    { letter: 'O', value: 8 },
    { letter: 'P', value: 2 },
    { letter: 'Q', value: 1 },
    { letter: 'R', value: 6 },
    { letter: 'S', value: 4 },
    { letter: 'T', value: 6 },
    { letter: 'U', value: 4 },
    { letter: 'V', value: 2 },
    { letter: 'W', value: 2 },
    { letter: 'X', value: 1 },
    { letter: 'Y', value: 2 },
    { letter: 'Z', value: 1 },
  ];
  static LetterFrequenciesRandomized = Letters.LetterFrequencies.reduce(
    (a, e) => {
      return a.concat(new Array(e.value).fill(e.letter));
    },
    []
  );

  static LetterValues = [
    { letter: 'A', value: 1 },
    { letter: 'B', value: 3 },
    { letter: 'C', value: 3 },
    { letter: 'D', value: 2 },
    { letter: 'E', value: 1 },
    { letter: 'F', value: 4 },
    { letter: 'G', value: 2 },
    { letter: 'H', value: 4 },
    { letter: 'I', value: 1 },
    { letter: 'J', value: 8 },
    { letter: 'K', value: 5 },
    { letter: 'L', value: 1 },
    { letter: 'M', value: 3 },
    { letter: 'N', value: 1 },
    { letter: 'O', value: 1 },
    { letter: 'P', value: 3 },
    { letter: 'Q', value: 10 },
    { letter: 'R', value: 1 },
    { letter: 'S', value: 1 },
    { letter: 'T', value: 1 },
    { letter: 'U', value: 1 },
    { letter: 'V', value: 4 },
    { letter: 'W', value: 4 },
    { letter: 'X', value: 8 },
    { letter: 'Y', value: 4 },
    { letter: 'Z', value: 10 },
  ];
  static generateTiles = (count) => {
    const tiles = [];
    for (let i = 0; i < count; i++) {
      const randomLetter =
        Letters.LetterFrequenciesRandomized[
          Math.floor(Math.random() * Letters.LetterFrequenciesRandomized.length)
        ];
      tiles.push(randomLetter);
    }
    return tiles;
  };
}
