export type MaintenanceStatus = 'ok' | 'warn' | 'danger';

export type PlainMaintenanceHistoryItem = {
  /**
   * mileage at which the service was performed (km).
   */
  atKm: number;

  /**
   * timestamp (ms) when the service was performed.
   */
  atDate: number;

  /**
   * optional note about the service.
   */
  note?: string;
};

export type PlainMaintenanceItem = {
  /**
   * unique identifier.
   */
  id: string;

  /**
   * id of the bike this maintenance belongs to.
   */
  bikeId: string;

  /**
   * name / label of the maintenance task.
   */
  name: string;

  /**
   * service interval in kilometres.
   */
  intervalKm: number;

  /**
   * service interval in days.
   */
  intervalDays: number;

  /**
   * mileage at which the last service was performed (km).
   */
  lastServiceKm: number;

  /**
   * timestamp (ms) of the last service.
   */
  lastServiceAt: number;

  /**
   * service history entries.
   */
  history?: PlainMaintenanceHistoryItem[];
};

export class MaintenanceHistoryItem {
  constructor(
    /**
     * mileage at which the service was performed (km).
     */
    readonly atKm: number,

    /**
     * timestamp (ms) when the service was performed.
     */
    readonly atDate: number,

    /**
     * optional note about the service.
     */
    readonly note?: string,
  ) {}

  toObject(): PlainMaintenanceHistoryItem {
    return {
      atKm: this.atKm,
      atDate: this.atDate,
      ...(this.note !== undefined && { note: this.note }),
    };
  }

  static from(plain: PlainMaintenanceHistoryItem): MaintenanceHistoryItem {
    return new MaintenanceHistoryItem(plain.atKm, plain.atDate, plain.note);
  }
}

export class MaintenanceItem {
  constructor(
    /**
     * unique identifier.
     */
    readonly id: string,

    /**
     * id of the bike this maintenance belongs to.
     */
    readonly bikeId: string,

    /**
     * name / label of the maintenance task.
     */
    readonly name: string,

    /**
     * service interval in kilometres.
     */
    readonly intervalKm: number,

    /**
     * service interval in days.
     */
    readonly intervalDays: number,

    /**
     * mileage at which the last service was performed (km).
     */
    readonly lastServiceKm: number,

    /**
     * timestamp (ms) of the last service.
     */
    readonly lastServiceAt: number,

    /**
     * service history entries.
     */
    readonly history: MaintenanceHistoryItem[] = [],
  ) {}

  /**
   * kilometres driven since the last service.
   * Requires the current bike mileage to be passed in.
   */
  kmUsed(currentMileage: number): number {
    return currentMileage - this.lastServiceKm;
  }

  /**
   * days elapsed since the last service.
   */
  daysUsed(now: number = Date.now()): number {
    return (now - this.lastServiceAt) / 86_400_000;
  }

  /**
   * ratio of usage vs. interval (0 – ∞).
   * ratio = max(kmUsed / intervalKm, daysUsed / intervalDays)
   */
  ratio(currentMileage: number, now: number = Date.now()): number {
    const kmRatio = this.intervalKm > 0 ? this.kmUsed(currentMileage) / this.intervalKm : 0;
    const dayRatio = this.intervalDays > 0 ? this.daysUsed(now) / this.intervalDays : 0;
    return Math.max(kmRatio, dayRatio);
  }

  /**
   * derived status based on the usage ratio.
   * ratio < 0.5  → 'ok'
   * ratio < 1    → 'warn'
   * ratio >= 1   → 'danger'
   */
  status(currentMileage: number, now: number = Date.now()): MaintenanceStatus {
    const r = this.ratio(currentMileage, now);
    if (r < 0.5) return 'ok';
    if (r < 1) return 'warn';
    return 'danger';
  }

  /**
   * serialize the entity into a plain object.
   */
  toObject(): PlainMaintenanceItem {
    return {
      id: this.id,
      bikeId: this.bikeId,
      name: this.name,
      intervalKm: this.intervalKm,
      intervalDays: this.intervalDays,
      lastServiceKm: this.lastServiceKm,
      lastServiceAt: this.lastServiceAt,
      history: this.history.map((h) => h.toObject()),
    };
  }

  /**
   * create a MaintenanceItem from a plain object.
   */
  static from(plain: PlainMaintenanceItem): MaintenanceItem {
    const { history = [] } = plain;
    return new MaintenanceItem(
      plain.id,
      plain.bikeId,
      plain.name,
      plain.intervalKm,
      plain.intervalDays,
      plain.lastServiceKm,
      plain.lastServiceAt,
      history.map((h) => MaintenanceHistoryItem.from(h)),
    );
  }
}
