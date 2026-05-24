export type UserRole = 'rider' | 'admin';
export type UserLanguage = 'sl' | 'en' | 'hr';

/**
 * Thresholds used to calculate a rider's level from their points.
 */
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];

/**
 * Calculate the level of a rider based on their points.
 */
export function calculateLevel(points: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export type PlainUser = {
  /**
   * Unique identifier of the user.
   */
  id: string;

  /**
   * Email address of the user.
   */
  email: string;

  /**
   * Unique username of the user.
   */
  username: string;

  /**
   * Display name shown in the UI.
   */
  displayName: string;

  /**
   * ISO 3166-1 alpha-2 country code (e.g. "SI", "HR", "DE").
   */
  country: string;

  /**
   * Preferred language of the user.
   */
  language: UserLanguage;

  /**
   * ID of the user's primary bike, if set.
   */
  primaryBikeId?: string;

  /**
   * Total points accumulated by the user.
   */
  points: number;

  /**
   * Role of the user in the platform.
   */
  role: UserRole;

  /**
   * Timestamp when the user account was created.
   */
  createdAt: Date;
};

export class User {
  constructor(
    /**
     * Unique identifier of the user.
     */
    readonly id: string,

    /**
     * Email address of the user.
     */
    readonly email: string,

    /**
     * Unique username of the user.
     */
    readonly username: string,

    /**
     * Display name shown in the UI.
     */
    readonly displayName: string,

    /**
     * ISO 3166-1 alpha-2 country code (e.g. "SI", "HR", "DE").
     */
    readonly country: string,

    /**
     * Preferred language of the user.
     */
    readonly language: UserLanguage,

    /**
     * Total points accumulated by the user.
     */
    readonly points: number,

    /**
     * Role of the user in the platform.
     */
    readonly role: UserRole,

    /**
     * Timestamp when the user account was created.
     */
    readonly createdAt: Date,

    /**
     * ID of the user's primary bike, if set.
     */
    readonly primaryBikeId?: string,
  ) {}

  /**
   * Level of the user, calculated from their points.
   */
  get level(): number {
    return calculateLevel(this.points);
  }

  /**
   * Serialize the User into a plain object.
   */
  toObject(): PlainUser {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      displayName: this.displayName,
      country: this.country,
      language: this.language,
      primaryBikeId: this.primaryBikeId,
      points: this.points,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  /**
   * Create a User instance from a plain object.
   */
  static from(plain: PlainUser): User {
    const {
      id = '',
      email = '',
      username = '',
      displayName = '',
      country = '',
      language = 'en',
      points = 0,
      role = 'rider',
      createdAt = new Date(),
      primaryBikeId,
    } = plain;

    return new User(
      id,
      email,
      username,
      displayName,
      country,
      language,
      points,
      role,
      createdAt,
      primaryBikeId,
    );
  }
}
