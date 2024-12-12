const input = await Deno.readTextFile("./example").then((content) =>
  content.split("\n").map((line) => line.split("")).slice(0, -1)
);

class Direction {
  constructor(public readonly row: number, public readonly col: number) {}

  toString() {
    return `${this.row},${this.col}`;
  }
}

class Compass {
  private readonly directions = [
    new Direction(-1, 0),
    new Direction(0, 1),
    new Direction(1, 0),
    new Direction(0, -1),
  ] as const;

  constructor(private i = 0) {
  }

  get current() {
    return this.directions[this.i];
  }

  clone() {
    return new Compass(this.i);
  }

  lookNext() {
    return this.directions[(this.i + 1) % this.directions.length];
  }

  next() {
    this.i = (this.i + 1) % this.directions.length;
  }
}

class Guard {
  constructor(public row: number, public col: number, public uniqueSteps = 1) {}

  move(move: Direction) {
    this.row += move.row;
    this.col += move.col;
  }

  clone() {
    return new Guard(this.row, this.col, this.uniqueSteps);
  }
}

let guard!: Guard;
const map: number[][] = [];
for (let row = 0; row < input.length; row++) {
  const line = [];
  for (let col = 0; col < input[row].length; col++) {
    switch (input[row][col]) {
      case ".":
        line.push(1);
        break;
      case "#":
        line.push(-1);
        break;
      case "^":
        line.push(0);
        guard = new Guard(row, col);
        break;
    }
  }
  map.push(line);
}

let LOOPS: number[][][] = [];

async function explore(
  guard: Guard,
  compass: Compass,
  map: number[][],
  log: (map: number[][]) => Promise<void>,
  readonly: boolean,
  detectLoop = false,
) {
  while (
    guard.row > 0 && guard.col > 0 && guard.row < map.length - 1 &&
    guard.col < map[0].length - 1
  ) {
    let lastValue = [mapValue(map)];
    const direction = compass.current;
    if (
      map[guard.row + direction.row][guard.col + direction.col] === 1 ||
      map[guard.row + direction.row][guard.col + direction.col] === 0
    ) {
      guard.move(direction);

      guard.uniqueSteps += map[guard.row][guard.col];
      map[guard.row][guard.col] = 0;
      if (detectLoop) {
        const newValue = mapValue(map);
        if (lastValue.slice(-3).every((v) => v === newValue)) {
          LOOPS.push(map);
          console.debug("loop detected");
          return;
        }
        lastValue.push(newValue);
      }
    } else if (
      map[guard.row + direction.row][guard.col + direction.col] === -1
    ) {
      compass.next();
    }

    await log(map);
    const [orow, ocol] = [guard.row + direction.row, guard.col + direction.col];

    if (map[orow]?.[ocol] && map[orow][ocol] !== -1 && !readonly) {
      const backup = map[orow][ocol];
      map[orow][ocol] = -1;
      await explore(
        guard.clone(),
        compass.clone(),
        structuredClone(map),
        async (map) => {
          await displayMap(map);
        },
        true,
        true,
      );
      map[orow][ocol] = backup;
    }
  }
}

function mapValue(map: number[][]) {
  return map.map(
    (prev) => prev.reduce((prev, next) => prev + next),
  ).reduce((prev, next) => prev + next);
}

await explore(guard, new Compass(), map, async () => {}, false);

console.debug(`Part1: ${guard.uniqueSteps}`);
console.debug(`${LOOPS.map((i) => logMap(i).join("")).join("\n\n")}`);
console.debug(`${LOOPS.length}`)

function logMap(map: number[][]) {
  const outputs = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      switch (map[row][col]) {
        case 0:
          outputs.push("^");
          break;
        case -1:
          outputs.push("#");
          break;
        case 1:
          outputs.push(".");
          break;
        case 2:
          outputs.push("O");
          break;
      }
    }
    outputs.push("\n");
  }
  return outputs;
}
async function displayMap(map: number[][]) {
  console.clear();

  console.log(logMap(map).join(""));
  await new Promise((r) => setTimeout(r, 1));
}
