const directions = {
  "<": [0, -1],
  ">": [0, 1],
  "^": [-1, 0],
  "v": [1, 0],
} as const;

const [map, moves, start, [rows, cols]] = parseInput(
  await Deno.readTextFile("./example"),
);

let current = start;
for (const [row, col] of moves) {
  console.clear();
  const nextCell = map.get(hash([current[0] + row, current[1] + col]));
  if (nextCell === ".") {
    current = moveBot(map, current, [row, col]);
  } else if (nextCell === "O") {
    const moved = moveBox(map, [current[0] + row, current[1] + col], [
      row,
      col,
    ]);
    if (moved) {
      current = moveBot(map, current, [row, col]);
    }
  }
  console.debug(logMap(map, [rows, cols]));
  await new Promise((r) => setTimeout(r, 100));
}

function moveBot(
  map: Map<string, string>,
  [row, col]: [number, number],
  [dr, dc]: [number, number],
) {
  map.set(hash(current), ".");
  const pos: [number, number] = [row + dr, col + dc] ;
  map.set(hash(pos), "@");
  return pos
}

function parseInput(input: string) {
  const [_map, moves] = input.split("\n\n");
  const map = new Map<string, string>();
  let start = null;
  for (const [ir, row] of _map.split("\n").slice(1, -1).entries()) {
    for (const [ic, col] of row.slice(1, -1).split("").entries()) {
      if (col === "@") start = [ir, ic];
      map.set(hash([ir, ic]), col);
    }
  }

  return [
    map,
    moves.slice(0, -1).split("").map((m) =>
      directions[m as keyof typeof directions]
    ),
    start as [number, number],
    dimensions(_map),
  ] as const;
}

function dimensions(map: string) {
  const m = map.split("\n").slice(1, -1);
  return [m.length, m[0].slice(1, -1).length];
}

function hash([row, col]: [number, number]) {
  return `${row}-${col}`;
}

function moveBox(
  map: Map<string, string>,
  start: [number, number],
  [row, col]: [number, number],
) {
  let current = map.get(hash(start));
  if (current && current === ".") return true;
  else if (current && current === "#") return false;
  else if (current && current === "O") {
    const ok = moveBox(
      map,
      [start[0] + row, start[1] + col],
      [row, col],
    );
    if (ok) {
      map.set(hash(start), ".");
      map.set(hash([start[0] + row, start[1] + col]), "O");
      return true;
    }
    return false;
  }
  return false;
}

function logMap(
  map: Map<string, string>,
  [rows, cols]: [number, number],
): string {
  const output = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      output.push(map.get(hash([row, col])));
    }
    output.push("\n");
  }
  return output.join("");
}
