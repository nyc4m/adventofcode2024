import { partition, slidingWindows } from "jsr:@std/collections";
const content = await Deno.readTextFile("./input");

const reports = content.split("\n").slice(0, -1).map((line) =>
  line.split(" ").map(Number)
);

const [valid, invalid] = partition(
  reports,
  (distances) => isValid(distances),
);
console.info(`Part1: ${valid.length}`);

const fixed = invalid.filter((report) => {
  for (let i = 0; i < report.length; i++) {
    const test = report.toSpliced(i, 1);
    if (isValid(test)) {
      return true;
    }
  }
  return false;
});

console.info(
  `Part2: ${fixed.length + valid.length}`,
);

function isValid(report: number[]) {
  const distances = slidingWindows(report, 2).flatMap(([x, y]) => x - y);
  return distances.every((d) => d >= 1 && d <= 3) ||
    distances.every((d) => d <= -1 && d >= -3);
}
