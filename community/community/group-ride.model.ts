import { prop, modelOptions } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Defines the host of a group ride.
 */
@modelOptions({ schemaOptions: { _id: false } })
export class GroupRideHostModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public displayName!: string;
}

/**
 * Defines the meeting point for a group ride.
 */
@modelOptions({ schemaOptions: { _id: false } })
export class GroupRideMeetingPointModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;

  @prop({ required: true, type: String })
  public label!: string;
}

/**
 * Defines a participant in a group ride.
 */
@modelOptions({ schemaOptions: { _id: false } })
export class GroupRideParticipantModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public displayName!: string;

  @prop({ required: true, type: String })
  public status!: string; // e.g., 'joined', 'maybe', 'declined'
}

/**
 * Defines the structure for a group ride session.
 */
export class GroupRideModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true })
  public host!: GroupRideHostModel;

  @prop({ required: true, type: Number })
  public startAt!: number;

  @prop({ required: true })
  public meetingPoint!: GroupRideMeetingPointModel;

  @prop({ type: () => [GroupRideParticipantModel], required: true, default: [] })
  public participants!: GroupRideParticipantModel[];

  @prop({ type: String })
  public routeId?: string; // Optional reference to a CommunityRoute
}

/**
 * Mock data for GroupRideModel.
 */
export const groupRideModelMock: GroupRideModel[] = [
  {
    id: '1',
    name: 'Sunday Morning Cruise',
    host: { id: 'user1', displayName: 'Elite Rider' },
    startAt: Date.now() + 86400000 * 2, // 2 days from now
    meetingPoint: { lat: 38.7223, lng: -9.1393, label: 'Lisbon Waterfront' },
    participants: [
      { id: 'user1', displayName: 'Elite Rider', status: 'joined' },
      { id: 'user2', displayName: 'Speed Demon', status: 'joined' },
      { id: 'demoUser', displayName: 'Demo Rider', status: 'joined' },
    ],
    routeId: '1', // Coastal Cruise
  },
];