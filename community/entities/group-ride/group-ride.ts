export type ParticipantStatus = 'pripravljen' | 'na-poti' | 'odmor' | 'konec';

export type PlainGroupRideMeetingPoint = {
  /**
   * Latitude of the meeting point.
   */
  lat: number;

  /**
   * Longitude of the meeting point.
   */
  lng: number;

  /**
   * Human-readable label for the meeting point.
   */
  label: string;
};

export type PlainGroupRideHost = {
  /**
   * Unique identifier of the host.
   */
  id: string;

  /**
   * Display name of the host.
   */
  displayName: string;
};

export type PlainGroupRideParticipant = {
  /**
   * Unique identifier of the participant.
   */
  id: string;

  /**
   * Display name of the participant.
   */
  displayName: string;

  /**
   * Current status of the participant.
   */
  status: ParticipantStatus;
};

export type PlainGroupRide = {
  /**
   * Unique identifier of the group ride.
   */
  id: string;

  /**
   * Name of the group ride.
   */
  name: string;

  /**
   * Host of the group ride.
   */
  host: PlainGroupRideHost;

  /**
   * Unix timestamp (ms) when the ride starts.
   */
  startAt: number;

  /**
   * Meeting point for the group ride.
   */
  meetingPoint: PlainGroupRideMeetingPoint;

  /**
   * List of participants in the group ride.
   */
  participants: PlainGroupRideParticipant[];

  /**
   * Optional route ID associated with the ride.
   */
  routeId?: string;
};

export class GroupRideMeetingPoint {
  constructor(
    /**
     * Latitude of the meeting point.
     */
    readonly lat: number,

    /**
     * Longitude of the meeting point.
     */
    readonly lng: number,

    /**
     * Human-readable label for the meeting point.
     */
    readonly label: string,
  ) {}

  toObject(): PlainGroupRideMeetingPoint {
    return {
      lat: this.lat,
      lng: this.lng,
      label: this.label,
    };
  }

  static from(plain: PlainGroupRideMeetingPoint): GroupRideMeetingPoint {
    return new GroupRideMeetingPoint(plain.lat, plain.lng, plain.label);
  }
}

export class GroupRideHost {
  constructor(
    /**
     * Unique identifier of the host.
     */
    readonly id: string,

    /**
     * Display name of the host.
     */
    readonly displayName: string,
  ) {}

  toObject(): PlainGroupRideHost {
    return {
      id: this.id,
      displayName: this.displayName,
    };
  }

  static from(plain: PlainGroupRideHost): GroupRideHost {
    return new GroupRideHost(plain.id, plain.displayName);
  }
}

export class GroupRideParticipant {
  constructor(
    /**
     * Unique identifier of the participant.
     */
    readonly id: string,

    /**
     * Display name of the participant.
     */
    readonly displayName: string,

    /**
     * Current status of the participant.
     */
    readonly status: ParticipantStatus,
  ) {}

  toObject(): PlainGroupRideParticipant {
    return {
      id: this.id,
      displayName: this.displayName,
      status: this.status,
    };
  }

  static from(plain: PlainGroupRideParticipant): GroupRideParticipant {
    return new GroupRideParticipant(plain.id, plain.displayName, plain.status);
  }
}

export class GroupRide {
  constructor(
    /**
     * Unique identifier of the group ride.
     */
    readonly id: string,

    /**
     * Name of the group ride.
     */
    readonly name: string,

    /**
     * Host of the group ride.
     */
    readonly host: GroupRideHost,

    /**
     * Unix timestamp (ms) when the ride starts.
     */
    readonly startAt: number,

    /**
     * Meeting point for the group ride.
     */
    readonly meetingPoint: GroupRideMeetingPoint,

    /**
     * List of participants in the group ride.
     */
    readonly participants: GroupRideParticipant[],

    /**
     * Optional route ID associated with the ride.
     */
    readonly routeId?: string,
  ) {}

  /**
   * Serialize the GroupRide into a plain object.
   */
  toObject(): PlainGroupRide {
    return {
      id: this.id,
      name: this.name,
      host: this.host.toObject(),
      startAt: this.startAt,
      meetingPoint: this.meetingPoint.toObject(),
      participants: this.participants.map((p) => p.toObject()),
      routeId: this.routeId,
    };
  }

  /**
   * Create a GroupRide instance from a plain object.
   */
  static from(plain: PlainGroupRide): GroupRide {
    const {
      id = '',
      name = '',
      host,
      startAt = 0,
      meetingPoint,
      participants = [],
      routeId,
    } = plain;

    return new GroupRide(
      id,
      name,
      GroupRideHost.from(host),
      startAt,
      GroupRideMeetingPoint.from(meetingPoint),
      participants.map((p) => GroupRideParticipant.from(p)),
      routeId,
    );
  }
}
