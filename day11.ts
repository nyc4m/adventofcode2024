const stones = await Deno.readTextFile("./input").then((input) =>
  input.split("\n").slice(0, -1)
).then((input) => input[0].split(" ")).then((input) => input.map(Number));

const state = [stones];

for (let i = 0; i < 25; i++) {
  const lastStones = state.at(-1)!;
  const newStones = [];
  for (const stone of lastStones) {
    const strStone = String(stone);
    if (stone === 0) {
      newStones.push(1);
    } else if (strStone.length % 2 === 0) {
      const a = strStone.slice(0, strStone.length / 2);
      const b = strStone.slice(strStone.length / 2);
      newStones.push(Number(a), Number(b));
    } else {
      newStones.push(stone * 2024);
    }
  }
  state.push(newStones);
}

function blink(
  stone: number,
  steps: number,
  cache: Map<string, number>,
): number {
  const strStone = String(stone);
  const cached = cache.get(`${stone}-${steps}`);
  if (cached) {
    return cached;
  }
  let output = null;
  if (steps === 0) {
    output = 1;
  } else if (stone === 0) {
    output = blink(1, steps - 1, cache);
  } else if (strStone.length % 2 === 0) {
    const [a, b] = [
      Number(strStone.slice(0, strStone.length / 2)),
      Number(strStone.slice(strStone.length / 2)),
    ];
    output = blink(a, steps - 1, cache) + blink(b, steps - 1, cache);
  } else {
    output = blink(2024 * stone, steps - 1, cache);
  }
  cache.set(`${stone}-${steps}`, output);
  return output;
}

console.debug(`Part1: ${state.at(-1)?.length}`);
const cache = new Map();
console.debug(
  `Part1: ${
    stones.map((s) => blink(s, 75, cache)).reduce(
      (prev, next) => prev + next,
      0,
    )
  }`,
);
