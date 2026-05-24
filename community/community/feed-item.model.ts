import { prop, modelOptions } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Defines the actor in a feed item.
 */
@modelOptions({ schemaOptions: { _id: false } })
export class FeedActorModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public displayName!: string;

  @prop({ required: true, type: String })
  public country!: string;
}

/**
 * Defines the structure for a community feed item.
 */
export class FeedItemModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public kind!: 'ride' | 'route' | 'achievement' | 'comment';

  @prop({ required: true })
  public actor!: FeedActorModel;

  @prop({ required: true, type: String })
  public payload!: string; // Stringified JSON for flexible payload

  @prop({ required: true, type: Number })
  public at!: number;
}

/**
 * Mock data for FeedItemModel.
 */
export const feedItemModelMock: FeedItemModel[] = [
  {
    id: '1',
    kind: 'ride',
    actor: { id: 'user1', displayName: 'Elite Rider', country: 'DE' },
    payload: JSON.stringify({ rideId: 'ride123', distance: 150, duration: 7200 }),
    at: Date.now() - 86400000 * 0.5,
  },
  {
    id: '2',
    kind: 'achievement',
    actor: { id: 'user2', displayName: 'Speed Demon', country: 'US' },
    payload: JSON.stringify({ achievementId: 'achieve456', achievementName: 'Road Trip Veteran' }),
    at: Date.now() - 86400000 * 1,
  },
  {
    id: '3',
    kind: 'route',
    actor: { id: 'user3', displayName: 'Trail Blazer', country: 'CA' },
    payload: JSON.stringify({ routeId: 'route789', routeName: 'Scenic Highway', rating: 5 }),
    at: Date.now() - 86400000 * 1.5,
  },
  {
    id: '4',
    kind: 'comment',
    actor: { id: 'user4', displayName: 'Road Warrior', country: 'GB' },
    payload: JSON.stringify({ routeId: 'route789', comment: 'Loved this route, amazing views!', parentCommentId: null }),
    at: Date.now() - 86400000 * 2,
  },
  {
    id: '5',
    kind: 'ride',
    actor: { id: 'demoUser', displayName: 'Demo Rider', country: 'ES' },
    payload: JSON.stringify({ rideId: 'rideDemo', distance: 80, duration: 3600 }),
    at: Date.now() - 86400000 * 2.5,
  },
];