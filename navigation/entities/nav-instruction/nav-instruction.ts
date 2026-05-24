export type NavModifier =
  | 'turn-left'
  | 'turn-right'
  | 'uturn'
  | 'continue'
  | 'slight-left'
  | 'slight-right'
  | 'sharp-left'
  | 'sharp-right'
  | 'roundabout'
  | 'arrive'
  | 'depart';

export type PlainNavInstruction = {
  /**
   * Unique identifier of the instruction.
   */
  id: string;

  /**
   * Navigation instruction text in Slovenian.
   */
  text: string;

  /**
   * Distance in meters to the maneuver point.
   */
  distanceM: number;

  /**
   * Maneuver modifier describing the type of turn or action.
   */
  modifier: NavModifier;

  /**
   * Distance in meters before the maneuver at which the instruction should be announced.
   */
  announceAt: number;
};

/**
 * Represents a single navigation instruction with Slovenian text,
 * distance, maneuver modifier, and dynamic announcement distance.
 */
export class NavInstruction {
  constructor(
    /**
     * Unique identifier of the instruction.
     */
    readonly id: string,

    /**
     * Navigation instruction text in Slovenian.
     */
    readonly text: string,

    /**
     * Distance in meters to the maneuver point.
     */
    readonly distanceM: number,

    /**
     * Maneuver modifier describing the type of turn or action.
     */
    readonly modifier: NavModifier,

    /**
     * Distance in meters before the maneuver at which the instruction should be announced.
     */
    readonly announceAt: number,
  ) {}

  /**
   * Serialize the NavInstruction into a plain object.
   */
  toObject(): PlainNavInstruction {
    return {
      id: this.id,
      text: this.text,
      distanceM: this.distanceM,
      modifier: this.modifier,
      announceAt: this.announceAt,
    };
  }

  /**
   * Create a NavInstruction from a plain object.
   */
  static from(plain: PlainNavInstruction): NavInstruction {
    const {
      id = '',
      text = '',
      distanceM = 0,
      modifier = 'continue',
      announceAt = 150,
    } = plain;

    return new NavInstruction(id, text, distanceM, modifier as NavModifier, announceAt);
  }

  /**
   * Create a NavInstruction from a routing turn step.
   * Computes `announceAt` dynamically as max(150, currentSpeedKmh * 4).
   *
   * @param step - A plain turn step object containing navigation data.
   * @param currentSpeedKmh - The current vehicle speed in km/h.
   */
  static fromTurnStep(
    step: {
      id?: string;
      text?: string;
      distanceM?: number;
      modifier?: NavModifier;
    },
    currentSpeedKmh: number,
  ): NavInstruction {
    const {
      id = '',
      text = '',
      distanceM = 0,
      modifier = 'continue',
    } = step;

    const announceAt = Math.max(150, currentSpeedKmh * 4);

    return new NavInstruction(id, text, distanceM, modifier as NavModifier, announceAt);
  }
}
