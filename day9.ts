const input = await Deno.readTextFile("./input");

const disk = new Int32Array(
  input.split("").slice(0, -1).map(Number).reduce((prev, next) => prev + next),
);

let cursor = 0;
for (let i = 0; i < input.length - 1; i += 2) {
  const block = Number(input[i]);
  const emptySpace = Number(input[i + 1]);
  for (let bi = cursor; bi < cursor + block; bi++) {
    disk[bi] = i / 2;
  }
  cursor += block;
  for (let esi = cursor; esi < cursor + emptySpace; esi++) {
    disk[esi] = -1;
  }
  cursor += emptySpace;
}

cursor = disk.length - 1;
const diskCopy = structuredClone(disk);
for (let i = 0; i < diskCopy.length; i++) {
  if (diskCopy[i] === -1) {
    while (diskCopy[cursor] === -1) {
      cursor--;
    }
    if (cursor < i) break;
    const tmp = diskCopy[cursor];
    diskCopy[cursor] = disk[i];
    diskCopy[i] = tmp;
  }
}

console.debug(`Part1: ${checksum(diskCopy)}`);

for (let i = disk.length - 1; i > 0; i--) {
  if (disk[i] === -1) continue;
  const id = disk[i];
  const blockEnd = i;
  while (disk[i - 1] === id) {
    i--;
  }
  const blockSize = blockEnd - i + 1;
  const blockStart = blockEnd - blockSize + 1;
  const startFreeSpace = findEmptySpace(disk, blockSize);
  if (startFreeSpace && startFreeSpace < i) {
    for (let j = 0; j < blockSize; j++) {
      disk[startFreeSpace + j] = disk[blockStart + j];
      disk[blockStart + j] = -1;
    }
  }
}

console.debug(`Part2: ${checksum(disk)}`);

function checksum(disk: Int32Array): number {
  let checksum = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === -1) continue;
    checksum += i * disk[i];
  }
  return checksum;
}

function findEmptySpace(disk: Int32Array, size: number): number | null {
  let startFreeSpace = null;
  let continuousFreeSpace = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== -1) {
      continuousFreeSpace = 0;
      startFreeSpace = null;
    } else {
      if (!startFreeSpace) startFreeSpace = i;
      continuousFreeSpace++;
    }
    if (continuousFreeSpace === size) return startFreeSpace;
  }
  return null;
}

function logMemory(disk: Int32Array) {
  const output = [];
  for (const i of disk) {
    if (i === -1) {
      output.push(".");
    } else {
      output.push(`${i}`);
    }
  }
  return output.join("");
}
