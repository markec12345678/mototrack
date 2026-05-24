/**
 * Plain object representation of a Hazard.
 */
export type PlainHazard = {
  /**
   * Unique identifier of the hazard.
   */
  id: string;

  /**
   * Type of hazard (e.g. 'accident', 'roadblock', 'flood', 'fire').
   */
  type: string;

  /**
   * Latitude of the hazard location.
   */
  lat: number;

  /**
   * Longitude of the hazard location.
   */
  lng: number;

  /**
   * Unix timestamp (ms) when the hazard was reported.
   */
  reportedAt: number;

  /**
   * Username or ID of the reporter (optional).
   */
  reportedBy?: string;

  /**
   * Number of users who confirmed this hazard.
   */
  confirmedCount: number;
};

/**
 * Supported hazard type values.
 */
export type HazardType =
  | 'accident'
  | 'roadblock'
  | 'flood'
  | 'fire'
  | 'landslide'
  | 'fog'
  | 'ice'
  | 'debris';

/**
 * Hazard entity — usable on both frontend and backend.
 */
export class Hazard {
  constructor(
    /**
     * Unique identifier of the hazard.
     */
    readonly id: string,

    /**
     * Type of hazard.
     */
    readonly type: HazardType | string,

    /**
     * Latitude of the hazard location.
     */
    readonly lat: number,

    /**
     * Longitude of the hazard location.
     */
    readonly lng: number,

    /**
     * Unix timestamp (ms) when the hazard was reported.
     */
    readonly reportedAt: number,

    /**
     * Username or ID of the reporter (optional).
     */
    readonly reportedBy: string | undefined,

    /**
     * Number of users who confirmed this hazard.
     */
    readonly confirmedCount: number,
  ) {}

  /**
   * Serialize the Hazard into a plain object.
   */
  toObject(): PlainHazard {
    return {
      id: this.id,
      type: this.type,
      lat: this.lat,
      lng: this.lng,
      reportedAt: this.reportedAt,
      reportedBy: this.reportedBy,
      confirmedCount: this.confirmedCount,
    };
  }

  /**
   * Create a Hazard entity from a plain object.
   */
  static from(plain: PlainHazard): Hazard {
    const {
      id = '',
      type = '',
      lat = 0,
      lng = 0,
      reportedAt = 0,
      reportedBy,
      confirmedCount = 0,
    } = plain;

    return new Hazard(id, type, lat, lng, reportedAt, reportedBy, confirmedCount);
  }
}
