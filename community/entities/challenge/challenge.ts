export type PlainChallenge = {
  /**
   * Unique identifier of the challenge.
   */
  id: string;

  /**
   * Display name of the challenge.
   */
  name: string;

  /**
   * Description of what the challenge involves.
   */
  description: string;

  /**
   * Icon identifier or URL representing the challenge.
   */
  icon: string;

  /**
   * Points awarded for completing the challenge.
   */
  points: number;

  /**
   * Status of the challenge, e.g. 'active', 'upcoming', 'completed'.
   */
  status: string;

  /**
   * Unix timestamp (ms) when the challenge ends.
   */
  endsAt: number;

  /**
   * Number of participants who have joined the challenge.
   */
  participants: number;

  /**
   * Whether the current user has joined the challenge.
   */
  joined?: boolean;

  /**
   * Progress percentage of the current user (0–100).
   */
  progressPct?: number;
};

export class Challenge {
  constructor(
    /**
     * Unique identifier of the challenge.
     */
    readonly id: string,

    /**
     * Display name of the challenge.
     */
    readonly name: string,

    /**
     * Description of what the challenge involves.
     */
    readonly description: string,

    /**
     * Icon identifier or URL representing the challenge.
     */
    readonly icon: string,

    /**
     * Points awarded for completing the challenge.
     */
    readonly points: number,

    /**
     * Status of the challenge, e.g. 'active', 'upcoming', 'completed'.
     */
    readonly status: string,

    /**
     * Unix timestamp (ms) when the challenge ends.
     */
    readonly endsAt: number,

    /**
     * Number of participants who have joined the challenge.
     */
    readonly participants: number,

    /**
     * Whether the current user has joined the challenge.
     */
    readonly joined: boolean = false,

    /**
     * Progress percentage of the current user (0–100).
     */
    readonly progressPct: number = 0,
  ) {}

  /**
   * Serialize a Challenge into a plain object.
   */
  toObject(): PlainChallenge {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      points: this.points,
      status: this.status,
      endsAt: this.endsAt,
      participants: this.participants,
      joined: this.joined,
      progressPct: this.progressPct,
    };
  }

  /**
   * Create a Challenge instance from a plain object.
   */
  static from(plain: PlainChallenge): Challenge {
    const {
      id = '',
      name = '',
      description = '',
      icon = '',
      points = 0,
      status = 'active',
      endsAt = 0,
      participants = 0,
      joined = false,
      progressPct = 0,
    } = plain;

    return new Challenge(
      id,
      name,
      description,
      icon,
      points,
      status,
      endsAt,
      participants,
      joined,
      progressPct,
    );
  }
}
