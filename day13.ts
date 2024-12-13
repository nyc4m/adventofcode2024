import { lusolve } from "npm:mathjs";

const equations = parseInput(await Deno.readTextFile("./input"));

function parseInput(input: string) {
  const aRegex = /Button (?:A|B): X\+(\d+), Y\+(\d+)/;
  const solutionRegex = /Prize: X=(\d+), Y=(\d+)/;
  const groups = input.split("\n\n");
  const equations: [[number, number], [number, number], [number, number]][] =
    [];
  for (const group of groups) {
    const splitted = group.split("\n");
    const a = splitted[0].match(aRegex);
    const b = splitted[1].match(aRegex);
    const c = splitted[2].match(solutionRegex);
    equations.push([
      [Number(a[1]), Number(a[2])],
      [Number(b[1]), Number(b[2])],
      [Number(c[1]), Number(c[2])],
    ]);
  }
  return equations;
}

function solve(
  a: [number, number],
  b: [number, number],
  c: [number, number],
): [number, number] {
  const solution = lusolve([[a[0], b[0]], [a[1], b[1]]], c);
  return [solution[0][0], solution[1][0]];
}

function part1(equations: ReturnType<typeof parseInput>) {
  let tokens = 0;
  for (const e of equations) {
    const [a, b] = solve(e[0], e[1], e[2]);
    if (a > 100 || b > 100 || a < 0 || b < 0) {
      continue;
    }
    if (
      Math.abs(Math.round(a) - a) < 0.1 && Math.abs(Math.round(b) - b) < 0.0001
    ) {
      tokens += a * 3 + b;
    }
  }
  return tokens;
}
function part2(equations: ReturnType<typeof parseInput>) {
  let tokens = 0;
  for (const e of equations) {
    const [a, b] = solve(e[0], e[1], e[2].map((i) => i + 10000000000000));
    if (a < 0 || b < 0) {
      continue;
    }
    if (
      Math.abs(Math.round(a) - a) < 0.1 && Math.abs(Math.round(b) - b) < 0.0001
    ) {
      tokens += a * 3 + b;
    }
  }
  return tokens;
}

console.debug(part1(equations));
console.debug(part2(equations));
