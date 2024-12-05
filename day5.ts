const input = await Deno.readTextFile("./input");

const [_rules, _pages] = input.split("\n\n");

const rules: [number, number][] = _rules.split("\n").map((line) =>
  line.split("|")
).map((
  [a, b],
) => [Number(a), Number(b)]);
const pages = _pages.split("\n").slice(0, -1).map((line) =>
  line.split(",").map(Number)
);

let middles = 0;
const incorrect = [];
for (const page of pages) {
  const pass = isSorted(page, rules);
  if (pass) {
    middles += page[Math.ceil(page.length - 1) / 2];
  } else {
    incorrect.push(page);
  }
}

console.debug(`Part1: ${middles}`);

function isSorted(page: number[], rules: [number, number][]) {
  const subrules = rules.filter(([low, up]) =>
    page.includes(low) && page.includes(up)
  );
  for (const [low, up] of subrules) {
    for (let i = 0; i < page.length; i++) {
      if (page[i] === low) {
        const found = page.indexOf(up);
        if (found < i) {
          return false;
        }
      }
    }
  }
  return true;
}

console.debug(`part2: ${
  incorrect.map((i) =>
    i.toSorted((a, b) => {
      for (const [low, up] of rules) {
        if (low === a && up === b) return -1;
        if (low === b && up === a) return 1;
      }
      return 0;
    })
  ).reduce((prev, next) => next[Math.ceil(next.length / 2) - 1] + prev, 0)
}`);
