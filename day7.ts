const experiments = await Deno.readTextFile("./input").then((content) => {
  return content.split("\n").slice(0, -1).map((line) => {
    const [calibration, equation] = line.split(":");
    return [
      Number(calibration),
      equation.trim().split(" ").map(Number),
    ] as const;
  });
});

const total = new Set<number>();
for (const [calibration, equation] of experiments) {
  for (
    const perm of generate(
      ["+", "*", "||"],
      equation.length - 1,
    )
  ) {
    let sum = equation[0];
    for (let i = 1; i < equation.length; i++) {
      if (perm[i - 1] == "*") {
        sum *= equation[i];
      } else if (perm[i - 1] === "+") {
        sum += equation[i];
      } else if (perm[i - 1] === "||") {
        sum = Number(`${sum}${equation[i]}`);
      }
    }

    if (sum === calibration) {
      total.add(calibration);
      break;
    }
  }
}

function generate<T>(tokens: T[], size: number): T[][] {
  if (size === 1) return tokens.map((t) => [t]);
  const output = [];
  const generated = generate(tokens, size - 1);
  for (const t of tokens) {
    for (const g of generated) {
      output.push([t, ...g]);
    }
  }
  return output;
}

console.debug(`total: ${[...total].reduce((prev, next) => prev + next)}`);
