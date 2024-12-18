class Computer {
  constructor(
    private grid: Map<string, string>,
    public readonly dimensions: [number, number],
  ) {}

  inBound(p: Point) {
    return p.row < this.dimensions[0] && p.col < this.dimensions[1] &&
      p.row >= 0 && p.col >= 0;
  }

  static parseInput(input: string) {
    const map = new Map<string, string>();
    let width = 0;
    let height = 0;
    const points = [];
    for (const line of input.split("\n").slice(0, -1)) {
      const [x, y] = line.split(",").map(Number);
      width = Math.max(width, x);
      height = Math.max(height, y);
      points.push(new Point(y, x));
    }
    return [new Computer(map, [height + 1, width + 1]), points] as const;
  }

  get(p: Point) {
    return this.grid.get(p.hash);
  }

  set(p: Point, value: string) {
    this.grid.set(p.hash, value);
  }

  reset() {
    this.grid.clear();
  }

  toString() {
    const output = [];
    for (let row = 0; row < this.dimensions[0]; row++) {
      for (let col = 0; col < this.dimensions[1]; col++) {
        const cell = this.grid.get(`${row}-${col}`);
        if (cell) {
          output.push(cell);
        } else {
          output.push(".");
        }
      }
      output.push("\n");
    }
    return output.join("");
  }
}

class Point {
  constructor(public readonly row: number, public readonly col: number) {}

  equal(p: Point) {
    return this.col === p.col && this.row === p.row;
  }

  plus(p: Point) {
    return new Point(this.row + p.row, this.col + p.col);
  }

  get clockWise() {
    return new Point(this.col, -this.row);
  }

  get antiClockWise() {
    return new Point(-this.col, this.row);
  }

  get hash() {
    return `${this.row}-${this.col}`;
  }
}

const [computer, bytes] = Computer.parseInput(
  await Deno.readTextFile("./input"),
);

function computeShortestPath(computer: Computer, end: Point, bytes: Point[]) {
  for (const byte of bytes) {
    computer.set(byte, "#");
  }

  const queue: [Point, number][] = [[new Point(0, 0), 0]];
  const directions = [
    new Point(0, 1),
    new Point(0, -1),
    new Point(-1, 0),
    new Point(1, 0),
  ] as const;
  let shortestDistance = 0;
  const seen = new Set<string>();
  while (queue.length && shortestDistance === 0) {
    const [current, distance] = queue.shift()!;
    if (seen.has(current.hash)) continue;
    seen.add(current.hash);
    if (current.equal(end)) {
      shortestDistance = distance;
      break;
    }
    computer.set(current, "O");
    for (const d of directions) {
      const toVisit = current.plus(d);
      if (!computer.inBound(toVisit)) continue;
      if (computer.get(toVisit) === "#") continue;
      queue.push([toVisit, distance + 1]);
    }
    queue.sort((a, b) => a[1] - b[1]);
  }

  return shortestDistance;
}

const end = new Point(70, 70);
console.debug(
  `Part1: ${computeShortestPath(computer, end, bytes.slice(0, 1024))}`,
);

let bad = bytes.length - 1;
let good = 0;
while (bad - good !== 1) {
  computer.reset();

  const currentBad = good + Math.ceil((bad - good) / 2);
  const outcome = computeShortestPath(
    computer,
    new Point(70, 70),
    bytes.slice(0, currentBad),
  );
  if (outcome === 0) {
    bad = currentBad;
  } else {
    good = currentBad;
  }
}


console.debug(`Part2: ${bytes[bad-1].col},${bytes[bad-1].row} (${bad-1}th byte)`);

async function progressiveLog(callback: () => void, t = 100) {
  console.clear();
  callback();
  await new Promise((r) => setTimeout(r, t));
}
