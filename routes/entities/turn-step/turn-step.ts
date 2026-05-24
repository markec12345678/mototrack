/**
 * Supported OSRM maneuver types.
 */
export type OsrmManeuverType =
  | 'turn'
  | 'new name'
  | 'depart'
  | 'arrive'
  | 'merge'
  | 'ramp'
  | 'on ramp'
  | 'off ramp'
  | 'fork'
  | 'end of road'
  | 'use lane'
  | 'continue'
  | 'roundabout'
  | 'rotary'
  | 'roundabout turn'
  | 'notification'
  | 'exit roundabout'
  | 'exit rotary'
  | string;

/**
 * Supported OSRM maneuver modifiers.
 */
export type OsrmModifier =
  | 'uturn'
  | 'sharp right'
  | 'right'
  | 'slight right'
  | 'straight'
  | 'slight left'
  | 'left'
  | 'sharp left'
  | string;

/**
 * Raw OSRM maneuver object inside a step.
 */
export type OsrmManeuver = {
  type: OsrmManeuverType;
  modifier?: OsrmModifier;
  bearing_after?: number;
  bearing_before?: number;
  location?: [number, number];
};

/**
 * Raw OSRM step object as returned by the routing API.
 */
export type OsrmStep = {
  maneuver: OsrmManeuver;
  distance?: number;
  duration?: number;
  name?: string;
  intersections?: Array<{ location?: [number, number] }>;
};

/**
 * TurnStep modifier type — normalized from OSRM modifier strings.
 */
export type TurnModifier =
  | 'turn-left'
  | 'turn-right'
  | 'turn-sharp-left'
  | 'turn-sharp-right'
  | 'turn-slight-left'
  | 'turn-slight-right'
  | 'uturn'
  | 'straight'
  | 'roundabout'
  | 'depart'
  | 'arrive'
  | 'unknown';

/**
 * Plain object representation of a TurnStep.
 */
export type PlainTurnStep = {
  /**
   * Unique identifier for the step.
   */
  id: string;

  /**
   * Slovenian-localized navigation instruction.
   */
  instruction: string;

  /**
   * Distance in metres for this step.
   */
  distanceM: number;

  /**
   * Duration in seconds for this step.
   */
  durationSec: number;

  /**
   * Geographic location (lat/lng) at the start of this step.
   */
  location: { lat: number; lng: number };

  /**
   * Normalized turn modifier string.
   */
  modifier?: TurnModifier;
};

// ---------------------------------------------------------------------------
// Slovenian instruction helpers
// ---------------------------------------------------------------------------

const MODIFIER_LABELS_SL: Record<string, string> = {
  uturn: 'Obrnite se',
  'sharp right': 'Ostro zavijte desno',
  right: 'Zavijte desno',
  'slight right': 'Rahlo zavijte desno',
  straight: 'Nadaljujte naravnost',
  'slight left': 'Rahlo zavijte levo',
  left: 'Zavijte levo',
  'sharp left': 'Ostro zavijte levo',
};

const MODIFIER_NORMALIZED: Record<string, TurnModifier> = {
  uturn: 'uturn',
  'sharp right': 'turn-sharp-right',
  right: 'turn-right',
  'slight right': 'turn-slight-right',
  straight: 'straight',
  'slight left': 'turn-slight-left',
  left: 'turn-left',
  'sharp left': 'turn-sharp-left',
};

/**
 * Translates an OSRM maneuver into a Slovenian instruction string.
 */
function buildInstruction(maneuver: OsrmManeuver, streetName?: string): string {
  const { type = '', modifier = '' } = maneuver;
  const street = streetName && streetName.trim() ? ` na ${streetName}` : '';

  switch (type) {
    case 'depart':
      return `Začnite pot${street}`;

    case 'arrive':
      return `Prispeli ste na cilj${street}`;

    case 'roundabout':
    case 'rotary':
      return `Vstopite v krožišče${street}`;

    case 'exit roundabout':
    case 'exit rotary':
      return `Zapustite krožišče${street}`;

    case 'fork':
      if (modifier.includes('right')) return `Na razcepu zavijte desno${street}`;
      if (modifier.includes('left')) return `Na razcepu zavijte levo${street}`;
      return `Na razcepu nadaljujte naravnost${street}`;

    case 'on ramp':
      if (modifier.includes('right')) return `Zavijte desno na uvozno rampo${street}`;
      if (modifier.includes('left')) return `Zavijte levo na uvozno rampo${street}`;
      return `Vstopite na uvozno rampo${street}`;

    case 'off ramp':
      if (modifier.includes('right')) return `Zavijte desno na izvozno rampo${street}`;
      if (modifier.includes('left')) return `Zavijte levo na izvozno rampo${street}`;
      return `Zapustite avtocesto${street}`;

    case 'merge':
      return `Vključite se v promet${street}`;

    case 'end of road':
      if (modifier.includes('right')) return `Na koncu ceste zavijte desno${street}`;
      if (modifier.includes('left')) return `Na koncu ceste zavijte levo${street}`;
      return `Na koncu ceste nadaljujte${street}`;

    case 'new name':
    case 'continue':
      if (modifier && MODIFIER_LABELS_SL[modifier]) {
        return `${MODIFIER_LABELS_SL[modifier]}${street}`;
      }
      return `Nadaljujte${street}`;

    case 'turn':
    default:
      if (modifier && MODIFIER_LABELS_SL[modifier]) {
        return `${MODIFIER_LABELS_SL[modifier]}${street}`;
      }
      return `Nadaljujte${street}`;
  }
}

/**
 * Normalizes an OSRM maneuver type + modifier into a TurnModifier.
 */
function buildModifier(maneuver: OsrmManeuver): TurnModifier {
  const { type = '', modifier = '' } = maneuver;

  if (type === 'depart') return 'depart';
  if (type === 'arrive') return 'arrive';
  if (type === 'roundabout' || type === 'rotary' || type === 'exit roundabout' || type === 'exit rotary') {
    return 'roundabout';
  }

  if (modifier && MODIFIER_NORMALIZED[modifier]) {
    return MODIFIER_NORMALIZED[modifier];
  }

  return 'unknown';
}

// ---------------------------------------------------------------------------
// Entity
// ---------------------------------------------------------------------------

export class TurnStep {
  constructor(
    /**
     * Unique identifier for the step.
     */
    readonly id: string,

    /**
     * Slovenian-localized navigation instruction.
     */
    readonly instruction: string,

    /**
     * Distance in metres for this step.
     */
    readonly distanceM: number,

    /**
     * Duration in seconds for this step.
     */
    readonly durationSec: number,

    /**
     * Geographic location (lat/lng) at the start of this step.
     */
    readonly location: { lat: number; lng: number },

    /**
     * Normalized turn modifier string.
     */
    readonly modifier?: TurnModifier,
  ) {}

  /**
   * Serialize the TurnStep into a plain object.
   */
  toObject(): PlainTurnStep {
    return {
      id: this.id,
      instruction: this.instruction,
      distanceM: this.distanceM,
      durationSec: this.durationSec,
      location: { ...this.location },
      modifier: this.modifier,
    };
  }

  /**
   * Create a TurnStep from a plain object.
   */
  static from(plain: PlainTurnStep): TurnStep {
    const {
      id = '',
      instruction = '',
      distanceM = 0,
      durationSec = 0,
      location = { lat: 0, lng: 0 },
      modifier,
    } = plain;

    return new TurnStep(id, instruction, distanceM, durationSec, location, modifier);
  }

  /**
   * Create a TurnStep from a raw OSRM step object.
   * Translates the OSRM maneuver into a Slovenian instruction string.
   *
   * @param step - Raw OSRM step JSON object.
   * @param id   - Optional explicit ID; defaults to a timestamp-based fallback.
   */
  static fromOsrmStep(step: OsrmStep, id?: string): TurnStep {
    const {
      maneuver = { type: 'turn' },
      distance = 0,
      duration = 0,
      name = '',
      intersections = [],
    } = step;

    // Derive location: prefer maneuver.location, fall back to first intersection
    const rawLoc =
      maneuver.location ??
      (intersections[0]?.location as [number, number] | undefined);

    const location =
      rawLoc && rawLoc.length >= 2
        ? { lat: rawLoc[1], lng: rawLoc[0] }
        : { lat: 0, lng: 0 };

    const instruction = buildInstruction(maneuver, name);
    const modifier = buildModifier(maneuver);

    // Generate a simple unique id when none is provided
    const stepId =
      id ??
      `step-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    return new TurnStep(
      stepId,
      instruction,
      distance,
      Math.round(duration),
      location,
      modifier,
    );
  }
}
