const map = await Deno.readTextFile("./input").then((input) =>
  input.split("\n").slice(0, -1)
);

class Point {
  constructor(
    public readonly row: number,
    public readonly col: number,
  ) {}

  apply(v: Vector): Point {
    return new Point(this.row + v.row, this.col + v.col);
  }
}

class Vector {
  constructor(public readonly row: number, public readonly col: number) {}

  static from(p1: Point, p2: Point) {
    return new Vector(p1.row - p2.row, p1.col - p2.col);
  }
}

const antennas = new Map<string, Point[]>();
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    const char = map[row][col];
    if (char === ".") continue;
    const antenna = antennas.get(char);
    if (antenna) {
      antenna.push(new Point(row, col));
    } else {
      antennas.set(char, [new Point(row, col)]);
    }
  }
}

function findUniqueAntinodes(
  map: string[],
  antennas: Map<string, Point[]>,
  countingStrat: (
    antenna: Point,
    vector: Vector,
    map: string[],
    antinodes: Set<string>,
  ) => void,
) {
  const antinodes = new Set<string>();
  for (const key of antennas.keys()) {
    const values = antennas.get(key)!;
    for (let i = 0; i < values?.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (i === j) continue;

        const antenna = values[i];
        const vector = Vector.from(values[i], values[j]);
        countingStrat(antenna, vector, map, antinodes);
      }
    }
  }
  return antinodes;
}

function generateResonantHarmonics(
  start: Point,
  vector: Vector,
  map: string[],
): Point[] {
  if (outofBounds(start, map)) {
    return [];
  }
  return [
    start,
    ...generateResonantHarmonics(start.apply(vector), vector, map),
  ];
}

function outofBounds(point: Point, map: string[]) {
  return point.row >= map.length || point.col >= map[0].length ||
    point.col < 0 || point.row < 0;
}
console.debug(
  `Part1: ${
    findUniqueAntinodes(map, antennas, (antenna, vector, map, antinodes) => {
      const antinode = antenna.apply(vector);
      if (!outofBounds(antinode, map)) {
        antinodes.add(`${antinode.row}-${antinode.col}`);
      }
    }).size
  }`,
);
console.debug(
  `Part2: ${
    findUniqueAntinodes(map, antennas, (antenna, vector, map, antinodes) => {
      generateResonantHarmonics(antenna, vector, map).forEach((antinode) => {
        antinodes.add(`${antinode.row}-${antinode.col}`);
      });
    }).size
  }`,
);

function logMap(map: string[], antinodes: Set<string>) {
  const log = [];
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (antinodes.has(`${r}-${c}`) && map[r][c] === ".") {
        log.push("#");
      } else {
        log.push(map[r][c]);
      }
    }
    log.push("\n");
  }
  return log.join("");
}
