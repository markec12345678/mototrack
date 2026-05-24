export type LatLng = {
  /**
   * Latitude coordinate.
   */
  lat: number;

  /**
   * Longitude coordinate.
   */
  lng: number;
};

export type PlainCommunityRoute = {
  /**
   * Unique identifier for the route.
   */
  id: string;

  /**
   * Display name of the route.
   */
  name: string;

  /**
   * Author / creator of the route.
   */
  author: string;

  /**
   * Country where the route is located.
   */
  country: string;

  /**
   * Total distance in kilometres.
   */
  distanceKm: number;

  /**
   * Estimated duration in seconds.
   */
  durationSec: number;

  /**
   * Difficulty level: 'easy' | 'moderate' | 'hard' | 'expert'.
   */
  difficulty: string;

  /**
   * Average community rating (0–5).
   */
  rating: number;

  /**
   * Number of likes the route has received.
   */
  likes: number;

  /**
   * Array of GPS coordinates that form the route geometry.
   */
  geometry: LatLng[];
};

export class CommunityRoute {
  constructor(
    /**
     * Unique identifier for the route.
     */
    readonly id: string,

    /**
     * Display name of the route.
     */
    readonly name: string,

    /**
     * Author / creator of the route.
     */
    readonly author: string,

    /**
     * Country where the route is located.
     */
    readonly country: string,

    /**
     * Total distance in kilometres.
     */
    readonly distanceKm: number,

    /**
     * Estimated duration in seconds.
     */
    readonly durationSec: number,

    /**
     * Difficulty level: 'easy' | 'moderate' | 'hard' | 'expert'.
     */
    readonly difficulty: string,

    /**
     * Average community rating (0–5).
     */
    readonly rating: number,

    /**
     * Number of likes the route has received.
     */
    readonly likes: number,

    /**
     * Array of GPS coordinates that form the route geometry.
     */
    readonly geometry: LatLng[],
  ) {}

  /**
   * Serialize the CommunityRoute into a plain object.
   */
  toObject(): PlainCommunityRoute {
    return {
      id: this.id,
      name: this.name,
      author: this.author,
      country: this.country,
      distanceKm: this.distanceKm,
      durationSec: this.durationSec,
      difficulty: this.difficulty,
      rating: this.rating,
      likes: this.likes,
      geometry: this.geometry,
    };
  }

  /**
   * Create a CommunityRoute instance from a plain object.
   */
  static from(plain: PlainCommunityRoute): CommunityRoute {
    const {
      id = '',
      name = '',
      author = '',
      country = '',
      distanceKm = 0,
      durationSec = 0,
      difficulty = 'moderate',
      rating = 0,
      likes = 0,
      geometry = [],
    } = plain;

    return new CommunityRoute(
      id,
      name,
      author,
      country,
      distanceKm,
      durationSec,
      difficulty,
      rating,
      likes,
      geometry,
    );
  }
}
