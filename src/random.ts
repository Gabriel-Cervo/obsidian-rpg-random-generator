export type RandomSource = () => number;

/** Small injectable random helper. Production uses Math.random; tests can provide a fixed source. */
export class Random {
  constructor(private readonly source: RandomSource = Math.random) {}

  next(): number {
    return this.source();
  }

  int(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("maxExclusive must be a positive integer");
    }
    return Math.min(maxExclusive - 1, Math.floor(this.next() * maxExclusive));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) {
      throw new Error("Cannot pick from an empty table");
    }
    return values[this.int(values.length)] as T;
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

