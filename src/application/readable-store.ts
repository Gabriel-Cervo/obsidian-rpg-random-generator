export type StoreListener = () => void;

export interface ReadableStore<T> {
  get(): T;
  subscribe(listener: StoreListener): () => void;
}

/** Tiny synchronous store used to bridge Obsidian lifecycle events to views. */
export class MutableStore<T> implements ReadableStore<T> {
  private readonly listeners = new Set<StoreListener>();

  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
    this.notify();
  }

  notify(): void {
    for (const listener of this.listeners) listener();
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
