export type TourWaypoint = {
  /**
   * Latitude coordinate.
   */
  lat: number;

  /**
   * Longitude coordinate.
   */
  lng: number;

  /**
   * Optional name/label for the waypoint.
   */
  name?: string;
};

export type PlainIconicTour = {
  /**
   * Unique identifier for the tour.
   */
  id: string;

  /**
   * Name of the iconic tour.
   */
  name: string;

  /**
   * Country where the tour is located.
   */
  country: string;

  /**
   * Country flag emoji.
   */
  flag: string;

  /**
   * Total distance of the tour in kilometres.
   */
  distanceKm: number;

  /**
   * Average user rating (0–5).
   */
  rating: number;

  /**
   * Difficulty level: 'easy' | 'moderate' | 'hard' | 'extreme'.
   */
  difficulty: string;

  /**
   * Short description of the tour.
   */
  description: string;

  /**
   * GPS waypoints defining the tour route.
   */
  waypoints: TourWaypoint[];
};

export class IconicTour {
  constructor(
    /**
     * Unique identifier for the tour.
     */
    readonly id: string,

    /**
     * Name of the iconic tour.
     */
    readonly name: string,

    /**
     * Country where the tour is located.
     */
    readonly country: string,

    /**
     * Country flag emoji.
     */
    readonly flag: string,

    /**
     * Total distance of the tour in kilometres.
     */
    readonly distanceKm: number,

    /**
     * Average user rating (0–5).
     */
    readonly rating: number,

    /**
     * Difficulty level: 'easy' | 'moderate' | 'hard' | 'extreme'.
     */
    readonly difficulty: string,

    /**
     * Short description of the tour.
     */
    readonly description: string,

    /**
     * GPS waypoints defining the tour route.
     */
    readonly waypoints: TourWaypoint[]
  ) {}

  /**
   * Serialize the IconicTour into a plain object.
   */
  toObject(): PlainIconicTour {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      flag: this.flag,
      distanceKm: this.distanceKm,
      rating: this.rating,
      difficulty: this.difficulty,
      description: this.description,
      waypoints: this.waypoints.map(({ lat, lng, name }) => ({
        lat,
        lng,
        ...(name !== undefined ? { name } : {}),
      })),
    };
  }

  /**
   * Create an IconicTour instance from a plain object.
   */
  static from(plain: PlainIconicTour): IconicTour {
    const {
      id = '',
      name = '',
      country = '',
      flag = '',
      distanceKm = 0,
      rating = 0,
      difficulty = 'moderate',
      description = '',
      waypoints = [],
    } = plain;

    return new IconicTour(
      id,
      name,
      country,
      flag,
      distanceKm,
      rating,
      difficulty,
      description,
      waypoints
    );
  }
}
