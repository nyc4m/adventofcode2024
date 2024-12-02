const day = Number(Deno.args[0]);

const aoc_session = Deno.env.get("AOC_TOKEN");
if (!aoc_session) {
  console.error(`No aoc session defined, define one with AOC_TOKEN env`);
  Deno.exit(1);
}

if (Number.isNaN(day)) {
  console.error(`${day} is not a valid number`);
  Deno.exit(2);
}

const response = await fetch(`https://adventofcode.com/2024/day/${day}/input`, {
  headers: {
    cookie: `session=${aoc_session}`,
  },
});

await Deno.writeTextFile("./input", await response.text());
