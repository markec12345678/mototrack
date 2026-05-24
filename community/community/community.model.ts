import { prop } from '@typegoose/typegoose';

/**
 * ── Leaderboard ──────────────────────────────────────────────────────────
 */
export class LeaderboardEntryModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: Number })
  public rank!: number;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public displayName!: string;

  @prop({ required: true, type: String })
  public country!: string;

  @prop({ required: true, type: Number })
  public km!: number;

  @prop({ required: true, type: Number })
  public rides!: number;

  @prop({ required: true, type: Number })
  public points!: number;

  @prop({ required: true, type: String, default: 'weekly' })
  public period!: string;

  @prop({ type: Boolean, default: false })
  public me?: boolean;
}

/**
 * ── Achievements ─────────────────────────────────────────────────────────
 */
export class AchievementProgressModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({ required: true, type: String })
  public icon!: string;

  @prop({ required: true, type: Boolean, default: false })
  public unlocked!: boolean;

  @prop({ required: true, type: Number, default: 0 })
  public progressPct!: number;

  @prop({ type: Number })
  public unlockedAt?: number;
}

/**
 * ── Challenges ───────────────────────────────────────────────────────────
 */
export class ChallengeModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({ required: true, type: String })
  public icon!: string;

  @prop({ required: true, type: Number })
  public points!: number;

  @prop({ required: true, type: String, default: 'active' })
  public status!: string;

  @prop({ required: true, type: Number })
  public endsAt!: number;

  @prop({ required: true, type: Number, default: 0 })
  public participants!: number;

  @prop({ type: Boolean, default: false })
  public joined?: boolean;

  @prop({ type: Number, default: 0 })
  public progressPct?: number;
}

/**
 * ── Feed items ───────────────────────────────────────────────────────────
 */
export class FeedActorModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public displayName!: string;

  @prop({ required: true, type: String })
  public country!: string;
}

export class FeedItemModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public kind!: string;

  @prop({ required: true, type: () => FeedActorModel, _id: false })
  public actor!: FeedActorModel;

  @prop({ required: true, type: String })
  public payload!: string;

  @prop({ required: true, type: Number })
  public at!: number;
}

/**
 * ── Community routes + ratings ───────────────────────────────────────────
 */
export class LatLngModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;
}

export class CommunityRouteModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public author!: string;

  @prop({ required: true, type: String, index: true })
  public country!: string;

  @prop({ required: true, type: Number })
  public distanceKm!: number;

  @prop({ required: true, type: Number })
  public durationSec!: number;

  @prop({ required: true, type: String, index: true })
  public difficulty!: string;

  @prop({ required: true, type: Number, index: true })
  public rating!: number;

  @prop({ required: true, type: Number, default: 0 })
  public likes!: number;

  @prop({ required: true, type: () => [LatLngModel], _id: false, default: [] })
  public geometry!: LatLngModel[];
}

export class RouteRatingModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String, index: true })
  public routeId!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: Number })
  public quality!: number;

  @prop({ required: true, type: Number })
  public scenery!: number;

  @prop({ required: true, type: Number })
  public twistiness!: number;

  @prop({ required: true, type: Number })
  public difficulty!: number;

  @prop({ type: String })
  public comment?: string;

  @prop({ required: true, type: Number })
  public createdAt!: number;
}

/**
 * ── Fuel reports ─────────────────────────────────────────────────────────
 */
export class FuelPriceReportModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String, index: true })
  public country!: string;

  @prop({ required: true, type: String })
  public brand!: string;

  @prop({ required: true, type: Number })
  public petrolEur!: number;

  @prop({ required: true, type: Number })
  public dieselEur!: number;

  @prop({ required: true, type: String })
  public location!: string;

  @prop({ required: true, type: Number })
  public reportedAt!: number;

  @prop({ required: true, type: Number, default: 0 })
  public confirms!: number;
}

/**
 * ── Group rides ──────────────────────────────────────────────────────────
 */
export class GroupRideHostModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public displayName!: string;
}

export class GroupRideMeetingPointModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;

  @prop({ required: true, type: String })
  public label!: string;
}

export class GroupRideParticipantModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public displayName!: string;

  @prop({ required: true, type: String, default: 'pripravljen' })
  public status!: string;
}

export class GroupRideModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: () => GroupRideHostModel, _id: false })
  public host!: GroupRideHostModel;

  @prop({ required: true, type: Number })
  public startAt!: number;

  @prop({ required: true, type: () => GroupRideMeetingPointModel, _id: false })
  public meetingPoint!: GroupRideMeetingPointModel;

  @prop({
    required: true,
    type: () => [GroupRideParticipantModel],
    _id: false,
    default: [],
  })
  public participants!: GroupRideParticipantModel[];

  @prop({ type: String })
  public routeId?: string;
}
