class RaceTrack {
  constructor(
    private grid: Map<string, string>,
    public readonly dimensions: [number, number],
  ) {}

  inBound(p: Point) {
    return (
      p.row < this.dimensions[0] &&
      p.col < this.dimensions[1] &&
      p.row >= 0 &&
      p.col >= 0
    );
  }

  static parseInput(input: string) {
    const map = new Map<string, string>();
    let width = 0;
    let height = 0;
    let start = null;
    let end = null;
    for (const [irow, row] of input.split("\n").slice(0, -1).entries()) {
      for (const [icol, col] of row.split("").entries()) {
        width = Math.max(width, icol);
        height = Math.max(height, irow);
        if (col === "S") {
          start = new Point(irow, icol);
        } else if (col === "E") {
          end = new Point(irow, icol);
        }
        map.set(new Point(irow, icol).hash, col === "E" ? "." : col);
      }
    }
    return [
      new RaceTrack(map, [height + 1, width + 1]),
      start as Point,
      end as Point,
    ] as const;
  }

  get(p: Point) {
    return this.grid.get(p.hash);
  }

  set(p: Point, value: string) {
    this.grid.set(p.hash, value);
  }

  clone() {
    return new RaceTrack(new Map(this.grid), this.dimensions);
  }

  *[Symbol.iterator]() {
    for (let row = 0; row < this.dimensions[0]; row++) {
      for (let col = 0; col < this.dimensions[1]; col++) {
        yield new Point(row, col);
      }
    }
  }

  toString(points = new Set()) {
    const output = [];
    for (let row = 0; row < this.dimensions[0]; row++) {
      for (let col = 0; col < this.dimensions[1]; col++) {
        const p = new Point(row, col);
        const cell = this.grid.get(p.hash);

        if (points.has(p.hash)) {
          output.push("o");
        } else if (cell) {
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
  static readonly UP = new Point(-1, 0);
  static readonly DOWN = new Point(1, 0);
  static readonly LEFT = new Point(0, -1);
  static readonly RIGHT = new Point(0, 1);

  constructor(
    public readonly row: number,
    public readonly col: number,
  ) {}

  equal(p: Point) {
    return this.col === p.col && this.row === p.row;
  }

  plus(p: Point) {
    return new Point(this.row + p.row, this.col + p.col);
  }

  toString() {
    return `(${this.row},${this.col})`;
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

function race(
  raceTrack: RaceTrack,
  start: Point,
  end: Point,
): [number, Point[]] {
  const seen = new Set<string>();
  const queue: [Point, number, Point[]][] = [[start, 0, []]];
  while (queue.length) {
    const [current, d, path] = queue.shift()!;
    if (seen.has(current.hash)) continue;
    seen.add(current.hash);
    if (current.equal(end)) {
      return [d, [...path, current]] as const;
    }
    for (const direction of [Point.UP, Point.DOWN, Point.LEFT, Point.RIGHT]) {
      const next = current.plus(direction);
      if (raceTrack.inBound(next) && raceTrack.get(next) !== "#") {
        queue.push([next, d + 1, [...path, current]]);
      }
    }

    queue.sort((a, b) => a[1] - b[1]);
  }
  return [0, []] as const;
}

const [raceTrack, _start, _end] = RaceTrack.parseInput(
  await Deno.readTextFile("./input"),
);

const [base, path] = race(raceTrack, _start, _end);
const count = new Map();

const seen = new Set<string>();
for (const [i, p] of path.entries()) {
  seen.add(p.hash);
  for (const d of [Point.UP, Point.DOWN, Point.LEFT, Point.RIGHT]) {
    const closePoint = p.plus(d).plus(d);
    const closePointIndex = path.findIndex((o) => closePoint.equal(o));
    if (seen.has(closePoint.hash)) continue;
    if (raceTrack.get(p.plus(d)) === "#" && closePointIndex >= 0) {
      const time = Math.abs(i - closePointIndex) - 2;
      count.set(time, (count.get(time) || 0) + 1);
      //const newPath = path.slice(0, i + 1).concat(path.slice(closePointIndex));
      //console.debug(`With ${p}: ${path.length - newPath.length - 1}s`);
      //console.debug(
      //  raceTrack.toString(
      //    newPath.reduce((set, p) => set.add(p.hash), new Set()),
      //  ),
      //);
    }
  }
}

console.debug(
  "Part1: ",
  [...count.entries()]
    .filter(([key]) => key >= 100)
    .reduce((a, [_, b]) => a + b, 0),
);
