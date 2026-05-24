export type PlainBorderCrossing = {
  /**
   * Unique identifier for the border crossing.
   */
  id: string;

  /**
   * Name of the border crossing location.
   */
  name: string;

  /**
   * Country code of the origin side (ISO 3166-1 alpha-2).
   */
  countryFrom: string;

  /**
   * Country code of the destination side (ISO 3166-1 alpha-2).
   */
  countryTo: string;

  /**
   * List of documents required to cross (e.g. passport, ID card, green card).
   */
  documents: string[];

  /**
   * Whether a road vignette is required on the destination side.
   */
  vignetteRequired: boolean;

  /**
   * Average wait time in minutes at this crossing.
   */
  avgWaitMin: number;

  /**
   * Practical tips for travellers at this crossing.
   */
  tips: string;
};

export class BorderCrossing {
  constructor(
    /**
     * Unique identifier for the border crossing.
     */
    readonly id: string,

    /**
     * Name of the border crossing location.
     */
    readonly name: string,

    /**
     * Country code of the origin side (ISO 3166-1 alpha-2).
     */
    readonly countryFrom: string,

    /**
     * Country code of the destination side (ISO 3166-1 alpha-2).
     */
    readonly countryTo: string,

    /**
     * List of documents required to cross (e.g. passport, ID card, green card).
     */
    readonly documents: string[],

    /**
     * Whether a road vignette is required on the destination side.
     */
    readonly vignetteRequired: boolean,

    /**
     * Average wait time in minutes at this crossing.
     */
    readonly avgWaitMin: number,

    /**
     * Practical tips for travellers at this crossing.
     */
    readonly tips: string,
  ) {}

  /**
   * Serialize a BorderCrossing into a plain object.
   */
  toObject(): PlainBorderCrossing {
    return {
      id: this.id,
      name: this.name,
      countryFrom: this.countryFrom,
      countryTo: this.countryTo,
      documents: this.documents,
      vignetteRequired: this.vignetteRequired,
      avgWaitMin: this.avgWaitMin,
      tips: this.tips,
    };
  }

  /**
   * Create a BorderCrossing instance from a plain object.
   */
  static from(plain: PlainBorderCrossing): BorderCrossing {
    const {
      id = '',
      name = '',
      countryFrom = '',
      countryTo = '',
      documents = [],
      vignetteRequired = false,
      avgWaitMin = 0,
      tips = '',
    } = plain;

    return new BorderCrossing(
      id,
      name,
      countryFrom,
      countryTo,
      documents,
      vignetteRequired,
      avgWaitMin,
      tips,
    );
  }
}
