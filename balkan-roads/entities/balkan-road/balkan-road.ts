export type RoadDifficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert';

export type RoadType =
  | 'Serpentine'
  | 'Coastal'
  | 'Pass'
  | 'Forest'
  | 'Canyon'
  | 'Plateau'
  | 'Valley'
  | 'Mountain'
  | 'Lakeside'
  | 'Scenic';

export type PlainBalkanRoad = {
  /**
   * Unique identifier of the road.
   */
  id: string;

  /**
   * Name of the road.
   */
  name: string;

  /**
   * ISO 3166-1 alpha-2 country code.
   */
  country: string;

  /**
   * Country flag emoji.
   */
  flag: string;

  /**
   * Total length of the road in kilometres.
   */
  lengthKm: number;

  /**
   * Rating from 0 to 10.
   */
  rating: number;

  /**
   * Difficulty level of the road.
   */
  difficulty: RoadDifficulty;

  /**
   * Type / character of the road.
   */
  type: RoadType;

  /**
   * Short description of the road.
   */
  description: string;
};

export class BalkanRoad {
  constructor(
    /**
     * Unique identifier of the road.
     */
    readonly id: string,

    /**
     * Name of the road.
     */
    readonly name: string,

    /**
     * ISO 3166-1 alpha-2 country code.
     */
    readonly country: string,

    /**
     * Country flag emoji.
     */
    readonly flag: string,

    /**
     * Total length of the road in kilometres.
     */
    readonly lengthKm: number,

    /**
     * Rating from 0 to 10.
     */
    readonly rating: number,

    /**
     * Difficulty level of the road.
     */
    readonly difficulty: RoadDifficulty,

    /**
     * Type / character of the road.
     */
    readonly type: RoadType,

    /**
     * Short description of the road.
     */
    readonly description: string,
  ) {}

  /**
   * Serialize the BalkanRoad into a plain object.
   */
  toObject(): PlainBalkanRoad {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      flag: this.flag,
      lengthKm: this.lengthKm,
      rating: this.rating,
      difficulty: this.difficulty,
      type: this.type,
      description: this.description,
    };
  }

  /**
   * Create a BalkanRoad instance from a plain object.
   */
  static from(plain: PlainBalkanRoad): BalkanRoad {
    const {
      id = '',
      name = '',
      country = '',
      flag = '',
      lengthKm = 0,
      rating = 0,
      difficulty = 'Moderate',
      type = 'Scenic',
      description = '',
    } = plain;

    return new BalkanRoad(id, name, country, flag, lengthKm, rating, difficulty, type, description);
  }
}
