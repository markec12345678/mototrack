export type PlainRouteRating = {
  /**
   * unique identifier of the rating.
   */
  id: string;

  /**
   * identifier of the rated route.
   */
  routeId: string;

  /**
   * identifier of the user who submitted the rating.
   */
  userId: string;

  /**
   * overall quality score (1–5).
   */
  quality: number;

  /**
   * scenery score (1–5).
   */
  scenery: number;

  /**
   * twistiness / fun-factor score (1–5).
   */
  twistiness: number;

  /**
   * difficulty score (1–5).
   */
  difficulty: number;

  /**
   * optional free-text comment left by the user.
   */
  comment?: string;

  /**
   * unix timestamp (ms) when the rating was created.
   */
  createdAt: number;
};

export class RouteRating {
  constructor(
    /**
     * unique identifier of the rating.
     */
    readonly id: string,

    /**
     * identifier of the rated route.
     */
    readonly routeId: string,

    /**
     * identifier of the user who submitted the rating.
     */
    readonly userId: string,

    /**
     * overall quality score (1–5).
     */
    readonly quality: number,

    /**
     * scenery score (1–5).
     */
    readonly scenery: number,

    /**
     * twistiness / fun-factor score (1–5).
     */
    readonly twistiness: number,

    /**
     * difficulty score (1–5).
     */
    readonly difficulty: number,

    /**
     * optional free-text comment left by the user.
     */
    readonly comment: string | undefined,

    /**
     * unix timestamp (ms) when the rating was created.
     */
    readonly createdAt: number,
  ) {}

  /**
   * serialize a RouteRating into a plain object.
   */
  toObject(): PlainRouteRating {
    return {
      id: this.id,
      routeId: this.routeId,
      userId: this.userId,
      quality: this.quality,
      scenery: this.scenery,
      twistiness: this.twistiness,
      difficulty: this.difficulty,
      comment: this.comment,
      createdAt: this.createdAt,
    };
  }

  /**
   * create a RouteRating instance from a plain object.
   */
  static from(plain: PlainRouteRating): RouteRating {
    const {
      id = '',
      routeId = '',
      userId = '',
      quality = 0,
      scenery = 0,
      twistiness = 0,
      difficulty = 0,
      comment,
      createdAt = 0,
    } = plain;

    return new RouteRating(
      id,
      routeId,
      userId,
      quality,
      scenery,
      twistiness,
      difficulty,
      comment,
      createdAt,
    );
  }
}
