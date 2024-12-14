class Robot {
  static ID = 1;
  public id = Robot.ID++;
  constructor(
    public x: number,
    public y: number,
    public readonly vx: number,
    public readonly vy: number,
  ) {
  }
}

class Map {
  constructor(private width: number, private height: number) {}

  nextPos(r: Robot): [x: number, y: number] {
    let { x, y, vx, vy } = r;
    x += vx;
    y += vy;
    if (x >= this.width) {
      x = x - this.width;
    }
    if (x < 0) {
      x = this.width + x;
    }
    if (y < 0) {
      y = this.height + y;
    }
    if (y >= this.height) {
      y = y - this.height;
    }
    return [x, y];
  }

  findQuarter(r: Robot): number | null {
    const middleX = Math.ceil(this.width / 2) - 1;
    const middleY = Math.ceil(this.height / 2) - 1;
    if (r.x < middleX && r.y < middleY) {
      return 1;
    } else if (r.x > middleX && r.y < middleY) {
      return 2;
    } else if (r.x < middleX && r.y > middleY) {
      return 3;
    } else if (r.x > middleX && r.y > middleY) {
      return 4;
    }
    return null;
  }

  log(robots: Robot[]): string {
    const output: string[][] = [];
    for (let y = 0; y < this.height; y++) {
      const line: string[] = [];
      for (let x = 0; x < this.width; x++) {
        line.push(" ");
      }
      output.push(line);
    }

    for (const r of robots) {
      if (!Number.isNaN(Number(output[r.y][r.x]))) {
        output[r.y][r.x] = Number(output[r.y][r.x]) + 1;
      } else {
        output[r.y][r.x] = 1;
      }
    }
    return output.map((line) => line.join("")).join("\n");
  }
}

function parseInput(input: string) {
  const numbers = /(-?\d+)/g;
  const robots = input.split("\n").slice(0, -1).map((line) => {
    const [x, y, vx, vy] = line.match(numbers)!.map(Number);
    return new Robot(x, y, vx, vy);
  });
  return robots;
}

const robots = parseInput(await Deno.readTextFile("./input"));
const map = new Map(101, 103);

for (let i = 0; i < 100; i++) {
  for (const r of robots) {
    const [x, y] = map.nextPos(r);
    r.x = x;
    r.y = y;
  }
}
console.debug(map.log(robots));

console.debug(`part1 ${safetyFactor(robots, map)}`);
console.debug(`part2 obtained via visually checking for low safety factor`)

function safetyFactor(robots: Robot[], map: Map) {
  const quarters: [number, number, number, number] = [0, 0, 0, 0];
  for (const r of robots) {
    const q = map.findQuarter(r);
    if (q !== null) {
      quarters[q - 1]++;
    }
  }
  return quarters.reduce((prev, next) => prev * next, 1);
}
