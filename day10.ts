const input = await Deno.readTextFile("./input").then((input) =>
  input.slice(0, -1)
);

class Point {
  constructor(public readonly row: number, public readonly col: number) {}

  add(p: Point) {
    return new Point(this.row + p.row, this.col + p.col);
  }

  get hash() {
    return `${this.row}-${this.col}`;
  }
}

class HikeMap {
  constructor(readonly map: number[][]) {
  }

  static fromInput(input: string) {
    const map = input.split("\n").map((line) => line.split("").map(Number));
    return new HikeMap(map);
  }

  inBound(p: Point) {
    return p.row < this.map.length && p.row >= 0 &&
      p.col < this.map[0].length && p.col >= 0;
  }

  get(p: Point) {
    if (
      !this.inBound(p)
    ) return null;
    return this.map[p.row][p.col];
  }

  get dimensions(): [row: number, col: number] {
    return [this.map.length, this.map[0].length] as const;
  }

  *[Symbol.iterator]() {
    const [rowLenth, colLength] = this.dimensions;
    for (let row = 0; row < rowLenth; row++) {
      for (let col = 0; col < colLength; col++) {
        const point = new Point(row, col);
        yield [point, this.get(point)] as const;
      }
    }
  }

  toString() {
    const { dimensions: [row, col] } = this;
    const output = [];
    for (let r = 0; r < row; r++) {
      for (let c = 0; c < col; c++) {
        if (Number.isNaN(this.map[r][c])) {
          output.push(".");
        } else if (this.map[r][c] === -1) {
          output.push("#");
        } else {
          output.push(this.map[r][c]);
        }
      }
      output.push("\n");
    }
    return output.join("");
  }

  clone() {
    return new HikeMap(structuredClone(this.map));
  }

  mark(p: Point) {
    if (this.inBound(p)) {
      this.map[p.row][p.col] = -1;
    }
  }
}

const directions = [
  new Point(0, 1),
  new Point(0, -1),
  new Point(-1, 0),
  new Point(1, 0),
] as const;

const hikeMap = HikeMap.fromInput(input);

const states: HikeMap[] = [hikeMap.clone()];

function explore(
  start: Point,
  hikeMap: HikeMap,
  seenTop?: Set<string>,
  currentHeight = 0,
) {
  let score = 0;
  const clone = states.at(-1)!.clone();
  clone.mark(start);
  states.push(clone);
  if (currentHeight === 9) {
    if(!seenTop) return 1;
    if (seenTop.has(start.hash)) return 0;
    else {
      seenTop.add(start.hash);
      return 1;
    }
  }
  for (const d of directions) {
    const nextStop = start.add(d);
    if (hikeMap.inBound(nextStop)) {
      const nextValue = hikeMap.get(nextStop);
      if (nextValue && nextValue - currentHeight === 1) {
        score += explore(nextStop, hikeMap, seenTop, currentHeight + 1);
      }
    }
  }
  return score;
}

let totalScore = 0;
for (const [point, value] of hikeMap) {
  if (value === 0) {
    totalScore += explore(point, hikeMap, new Set());
  }
}
console.debug(`Part1: ${totalScore}`)

totalScore = 0;
for (const [point, value] of hikeMap) {
  if (value === 0) {
    totalScore += explore(point, hikeMap);
  }
}

//for (const s of states) {
//  console.clear();
//  console.debug(s.toString());
//  await new Promise((r) => setTimeout(r, 100));
//  console.clear();
//}

console.debug(`Part2: ${totalScore}`)
