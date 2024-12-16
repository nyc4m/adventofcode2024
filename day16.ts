class Maze {
  constructor(
    private grid: Map<string, string>,
    public readonly dimensions: [number, number],
    public readonly start: Point,
  ) {}
  static parseInput(input: string) {
    const map = new Map<string, string>();
    let width = 0;
    let height = 0;
    let start: Point | null = null;
    for (const [irow, row] of input.split("\n").slice(0, -1).entries()) {
      height = irow;
      for (const [icol, col] of row.split("").entries()) {
        width = icol;
        if (col === "S") start = new Point(irow, icol);
        map.set(`${irow}-${icol}`, col);
      }
    }
    return new Maze(map, [height + 1, width + 1], start!);
  }

  get(p: Point) {
    return this.grid.get(p.hash);
  }

  set(p: Point, value: string) {
    this.grid.set(p.hash, value);
  }

  toString() {
    const output = [];
    for (let row = 0; row < this.dimensions[0]; row++) {
      for (let col = 0; col < this.dimensions[1]; col++) {
        output.push(this.grid.get(`${row}-${col}`));
      }
      output.push("\n");
    }
    return output.join("");
  }
}

class Point {
  constructor(private readonly row: number, private readonly col: number) {}

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

const maze = Maze.parseInput(await Deno.readTextFile("./input"));
const seen: [Point, number, Point, Point[]][] = [[maze.start, 0, new Point(0, -1), []]];
const visited = new Set<string>();
let minimumSteps = 0;
while (seen.length && !minimumSteps) {
  //console.clear();
  const [current, distance, direction, path] = seen.shift()!;
  if (maze.get(current) === "E") {
    minimumSteps = distance;
    continue;
  }
  maze.set(current, "O");
  visited.add(current.hash);
  for (const [cost, d] of moves(direction)) {
    const toVisit = d.plus(current);
    if (![".", "E"].includes(maze.get(toVisit)!)) continue;
    if (visited.has(toVisit.hash)) continue;
    seen.push([toVisit, distance + cost, d, path.concat(current)]);

    seen.sort((t1, t2) => t1[1] - t2[1]);
  }
  //console.debug(`${maze}`);
  //await new Promise((r) => setTimeout(r, 100));
}

function* moves(p: Point) {
  yield [1, p] as const;
  yield [1001, p.clockWise] as const;
  yield [1001, p.antiClockWise] as const;
}

console.debug(`Part1: ${minimumSteps}`);
