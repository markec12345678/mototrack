export type PlainLeaderboardEntry = {
  /**
   * rank position on the leaderboard.
   */
  rank: number;

  /**
   * unique identifier of the user.
   */
  userId: string;

  /**
   * display name of the user.
   */
  displayName: string;

  /**
   * country of the user.
   */
  country: string;

  /**
   * total kilometres ridden.
   */
  km: number;

  /**
   * total number of rides.
   */
  rides: number;

  /**
   * total points accumulated.
   */
  points: number;

  /**
   * whether this entry belongs to the currently authenticated user.
   */
  me?: boolean;
};

export class LeaderboardEntry {
  constructor(
    /**
     * rank position on the leaderboard.
     */
    readonly rank: number,

    /**
     * unique identifier of the user.
     */
    readonly userId: string,

    /**
     * display name of the user.
     */
    readonly displayName: string,

    /**
     * country of the user.
     */
    readonly country: string,

    /**
     * total kilometres ridden.
     */
    readonly km: number,

    /**
     * total number of rides.
     */
    readonly rides: number,

    /**
     * total points accumulated.
     */
    readonly points: number,

    /**
     * whether this entry belongs to the currently authenticated user.
     */
    readonly me: boolean = false,
  ) {}

  /**
   * virtual id property returning the unique identifier of this entry.
   */
  get id(): string {
    return this.userId;
  }

  /**
   * serialize a LeaderboardEntry into a plain object.
   */
  toObject(): PlainLeaderboardEntry & { id: string } {
    return {
      id: this.id,
      rank: this.rank,
      userId: this.userId,
      displayName: this.displayName,
      country: this.country,
      km: this.km,
      rides: this.rides,
      points: this.points,
      me: this.me,
    };
  }

  /**
   * create a LeaderboardEntry from a plain object.
   */
  static from(plain: PlainLeaderboardEntry): LeaderboardEntry {
    const {
      rank = 0,
      userId = '',
      displayName = '',
      country = '',
      km = 0,
      rides = 0,
      points = 0,
      me = false,
    } = plain;

    return new LeaderboardEntry(
      rank,
      userId,
      displayName,
      country,
      km,
      rides,
      points,
      me,
    );
  }
}
