const input = await Deno.readTextFile("./input");

const right = [];
const left = [];

for (const line of input.split("\n").slice(0, -1)) {
  const [l, r] = line.split("   ").map(Number);
  right.push(r);
  left.push(l);
}

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

if (left.length != right.length) {
  console.error("The lists have not the same length");
  Deno.exit(-1);
}

let distance = 0;
for (let i = 0; i < left.length; i++) {
  const r = right[i];
  const l = left[i];

  distance += Math.abs(r - l);
}

console.debug(`Part 1: ${distance}`);

const elementCounFromLeft = new Map<number, number>();

for (const n of right) {
  const count = elementCounFromLeft.get(n);
  if (count !== undefined) {
    elementCounFromLeft.set(n, count + 1);
  } else {
    elementCounFromLeft.set(n, 1);
  }
}

let similarityScore = 0;
for (const n of left) {
  const count = elementCounFromLeft.get(n);
  if (count) {
    similarityScore += n * count;
  }
}

console.debug(`Part 2: ${similarityScore}`)
