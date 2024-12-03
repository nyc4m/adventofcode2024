const input = await Deno.readTextFile("./input");
const lines = input.replaceAll("\n", "");
const multiplicationRegex = /mul\((\d+,\d+)\)/g;
const enabledInstructionsRegex = /do\(\)(.*?)don't\(\)/g;
console.debug(`Part 1: ${checkScore(lines)}`);
console.debug(
  `Part 2: ${checkScore(
    [...`do()${lines}don't()`.matchAll(enabledInstructionsRegex)]
      .map((m) => {
        return m[1];
      })
      .join(""),
  )}`,
);
function checkScore(input: string) {
  const foo = [...input.matchAll(multiplicationRegex)]
    .map(([_, match, ..._rest]) => match)
    .map((match) => match.split(","))
    .map(([a, b]) => [Number(a), Number(b)]);

  return foo.flatMap(([a, b]) => a * b).reduce((prev, next) => prev + next);
}
