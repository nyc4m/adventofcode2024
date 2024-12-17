class Computer {
  instructionPointer = 0;
  output: number[] = [];
  constructor(
    private register: Record<"A" | "B" | "C", number>,
    private program: number[],
  ) {
  }

  static parseInput(input: string) {
    const lines = input.split("\n");
    const A = lines[0].split(": ").map(Number).at(-1);
    const B = lines[1].split(": ").map(Number).at(-1);
    const C = lines[2].split(": ").map(Number).at(-1);

    const program = JSON.parse(`[${lines[4].split(": ").at(-1)}]`);

    return { A, B, C, program };
  }

  readonly combo = [
    () => 0,
    () => 1,
    () => 3,
    () => this.register.A,
    () => this.register.B,
    () => this.register.C,
  ];

  readonly operations = [
    (b: number) => {
      this.register.A = Math.trunc(this.register.A / Math.pow(2, b)),
        this.instructionPointer += 2;
    },
    (b: number) => {
      this.register.B = this.register.B ^ b;
      this.instructionPointer += 2;
    },
    (b: number) => {
      this.register.B = b % 8;
      this.instructionPointer += 2;
    },
    (b: number) => {
      if (this.register.A === 0) {
        return;
      }
      return this.instructionPointer = b;
    },
    (_: number) => {
      this.register.B = this.register.B ^ this.register.C;
      this.instructionPointer += 2;
    },
    (b: number) => {
      this.output.push(b % 8);
      this.instructionPointer += 2;
    },
    (b: number) => {
      this.register.B = Math.trunc(this.register.A / Math.pow(2, b));
      this.instructionPointer += 2;
    },
    (b: number) => {
      this.register.C = Math.trunc(this.register.A / Math.pow(2, b));
      this.instructionPointer += 2;
    },
  ] as const;

  compute() {
    for (; this.instructionPointer < this.program.length;) {
      const operator = this.program[this.instructionPointer];
      const comboOperand = this.program[this.instructionPointer + 1];
    }
  }
}
console.debug(Computer.parseInput(await Deno.readTextFile("./example")));
