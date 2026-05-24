export type SpeedCameraType = 'fixed' | 'mobile' | 'average' | 'red-light' | 'section';

export type PlainSpeedCamera = {
  /**
   * Unique identifier of the speed camera.
   */
  id: string;

  /**
   * Latitude coordinate of the speed camera.
   */
  lat: number;

  /**
   * Longitude coordinate of the speed camera.
   */
  lng: number;

  /**
   * Speed limit enforced by the camera (km/h).
   */
  speedLimit: number;

  /**
   * Type of the speed camera.
   */
  type: SpeedCameraType;

  /**
   * Country where the speed camera is located.
   */
  country: string;
};

export class SpeedCamera {
  constructor(
    /**
     * Unique identifier of the speed camera.
     */
    readonly id: string,

    /**
     * Latitude coordinate of the speed camera.
     */
    readonly lat: number,

    /**
     * Longitude coordinate of the speed camera.
     */
    readonly lng: number,

    /**
     * Speed limit enforced by the camera (km/h).
     */
    readonly speedLimit: number,

    /**
     * Type of the speed camera.
     */
    readonly type: SpeedCameraType,

    /**
     * Country where the speed camera is located.
     */
    readonly country: string,
  ) {}

  /**
   * Serialize a SpeedCamera into a plain object.
   */
  toObject(): PlainSpeedCamera {
    return {
      id: this.id,
      lat: this.lat,
      lng: this.lng,
      speedLimit: this.speedLimit,
      type: this.type,
      country: this.country,
    };
  }

  /**
   * Create a SpeedCamera instance from a plain object.
   */
  static from(plain: PlainSpeedCamera): SpeedCamera {
    const {
      id = '',
      lat = 0,
      lng = 0,
      speedLimit = 50,
      type = 'fixed',
      country = '',
    } = plain;

    return new SpeedCamera(id, lat, lng, speedLimit, type, country);
  }
}
