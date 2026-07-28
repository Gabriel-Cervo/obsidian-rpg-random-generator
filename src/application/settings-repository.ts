import type { RpgSettings } from "../settings";

export type SettingsWriter = (settings: RpgSettings) => Promise<void>;

/** Serializes persistence and exposes one shared settings snapshot. */
export class SettingsRepository {
  private queue: Promise<void> = Promise.resolve();

  constructor(
    readonly current: RpgSettings,
    private readonly write: SettingsWriter,
  ) {}

  save(settings: RpgSettings): Promise<void> {
    const next = { ...settings };
    const save = this.queue.catch(() => undefined).then(async () => {
      await this.write(next);
      this.current.outputFolder = next.outputFolder;
    });
    this.queue = save.catch(() => undefined);
    return save;
  }
}
