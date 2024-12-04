const input = await Deno.readTextFile("./input")
  .then((input) => input.split("\n"))
  .then((input) => input.slice(0, -1));

let xmas = 0;
for (let row = 0; row < input.length; row++) {
  for (let col = 0; col < input[row].length; col++) {
    xmas +=
      contains("XMAS", input, [row, col], [0, 1]) +
      contains("XMAS", input, [row, col], [1, 0]) +
      contains("XMAS", input, [row, col], [1, 1]) +
      contains("XMAS", input, [row, col], [1, -1]) +
      contains("SAMX", input, [row, col], [0, 1]) +
      contains("SAMX", input, [row, col], [1, 0]) +
      contains("SAMX", input, [row, col], [1, 1]) +
      contains("SAMX", input, [row, col], [1, -1]);
  }
}
console.debug(`Part 1: ${xmas}`);

xmas = 0;
for (let row = 0; row < input.length; row++) {
  for (let col = 0; col < input[row].length; col++) {
    xmas +=
      findTheRealXmas(input, [row, col], generateCoords("MSAMS")) +
      findTheRealXmas(input, [row, col], generateCoords("SSAMM")) +
      findTheRealXmas(input, [row, col], generateCoords("SMASM")) +
      findTheRealXmas(input, [row, col], generateCoords("MMASS"));
  }
}
console.debug(`Part2: ${xmas}`);

function contains(
  word: string,
  input: string[],
  startingPoint: [row: number, col: number],
  direction: [row: number, col: number],
) {
  for (let i = 0; i < word.length; i++) {
    const row = startingPoint[0] + direction[0] * i;
    const col = startingPoint[1] + direction[1] * i;
    if (row >= input.length || col > input[0].length) return 0;
    if (row < 0 || col < 0) return 0;
    if (word[i] !== input[row][col]) {
      return 0;
    }
  }
  return 1;
}

function generateCoords(word: string): [y: number, x: number, c: string][] {
  const coords = [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ] as const;
  return [...word].map((c, index) => [...coords[index], c] as const);
}

function findTheRealXmas(
  input: string[],
  startingPoint: [row: number, col: number],
  coords: [number, number, string][],
) {
  for (const [y, x, char] of coords) {
    const row = y + startingPoint[0];
    const col = x + startingPoint[1];
    if (row < 0 || col < 0 || row >= input.length || col >= input[0].length) {
      return 0;
    }
    if (char !== input[row][col]) {
      return 0;
    }
  }
  return 1;
}
