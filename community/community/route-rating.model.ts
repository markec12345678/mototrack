import { prop } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Defines the structure for a user's rating of a community route.
 */
export class RouteRatingModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public routeId!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: Number, min: 1, max: 5 })
  public quality!: number;

  @prop({ required: true, type: Number, min: 1, max: 5 })
  public scenery!: number;

  @prop({ required: true, type: Number, min: 1, max: 5 })
  public twistiness!: number;

  @prop({ required: true, type: Number, min: 1, max: 5 })
  public difficulty!: number;

  @prop({ type: String })
  public comment?: string;

  @prop({ required: true, type: Number, default: () => Date.now() })
  public createdAt!: number;
}

/**
 * Mock data for RouteRatingModel.
 */
export const routeRatingModelMock: RouteRatingModel[] = [
  { id: '1', routeId: '1', userId: 'user1', quality: 5, scenery: 5, twistiness: 4, difficulty: 2, comment: 'Fantastic coastal views!', createdAt: Date.now() - 86400000 * 3 },
  { id: '2', routeId: '1', userId: 'user2', quality: 4, scenery: 5, twistiness: 3, difficulty: 2, comment: 'Smooth ride, enjoyable.', createdAt: Date.now() - 86400000 * 2 },
  { id: '3', routeId: '2', userId: 'user3', quality: 5, scenery: 5, twistiness: 5, difficulty: 5, comment: 'Challenging but rewarding mountain pass.', createdAt: Date.now() - 86400000 * 4 },
  { id: '4', routeId: '3', userId: 'demoUser', quality: 4, scenery: 3, twistiness: 3, difficulty: 3, comment: 'Nice forest ride, good for a quick escape.', createdAt: Date.now() - 86400000 * 1 },
];