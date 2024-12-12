class Point {
  constructor(public readonly row: number, public readonly col: number) {}

  add(p: Point) {
    return new Point(this.row + p.row, this.col + p.col);
  }

  equal(p: Point) {
    return p.col === this.col && p.row === this.row;
  }

  get hash() {
    return `${this.row}-${this.col}`;
  }
}
function parseInput(input: string) {
  const lines = input.split("\n");
  const locations = new Map<string, Point[]>();
  for (const [ir, row] of lines.entries()) {
    for (const [ic, col] of [...row].entries()) {
      const p = new Point(ir, ic);
      const cached = locations.get(col);
      if (cached) {
        cached.push(p);
      } else {
        locations.set(col, [p]);
      }
    }
  }
  return locations;
}

const directions = [
  new Point(0, -1),
  new Point(0, 1),
  new Point(-1, 0),
  new Point(1, 0),
] as const;

function findSeparatedParcels(_coords: Point[]): Point[][] {
  const parcels = [];
  const coords = _coords.slice();
  while (coords.length > 0) {
    const queue = [coords.shift()!];
    const parcel = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      parcel.push(current);
      for (const d of directions) {
        const check = current.add(d);
        const found = coords.findIndex((c) => c.equal(check));
        if (found !== -1) {
          queue.push(coords[found]);
          coords.splice(found, 1);
        }
      }
    }
    parcels.push(parcel);
  }
  return parcels;
}

function computePerimeter(area: Point[]): number {
  let adjacentPoints = 0;
  for (const current of area) {
    adjacentPoints += 4;
    for (const d of directions) {
      const check = current.add(d);
      if (area.findIndex((c) => c.equal(check)) > -1) {
        adjacentPoints--;
      }
    }
  }
  return adjacentPoints;
}

function computeFaces(area: Point[]): number {
  let perimeter = 0;
  for (const current of area) {
    perimeter += 4;
    for (const d of directions) {
      const check = current.add(d);
      if (area.findIndex((c) => c.equal(check)) > -1) {
        perimeter--;
      }
    }
  }
  return perimeter;
}


const gardenToLocation = parseInput(
  await Deno.readTextFile("./input"),
);

console.debug(
  [...gardenToLocation.values()].map((coords) => {
    const parcels = findSeparatedParcels(coords);
    return parcels.map((p) => p.length * computePerimeter(p));
  }).flat().reduce((prev, next) => prev + next, 0),
);
