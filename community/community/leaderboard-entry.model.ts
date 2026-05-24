import { prop } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Represents a leaderboard entry in the database.
 */
export class LeaderboardEntryModel {
  @prop({ unique: true, required: true, default: () => uuid() })
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
}

/**
 * Mock data for LeaderboardEntryModel.
 */
export const leaderboardEntryModelMock: LeaderboardEntryModel[] = [
  { id: '1', rank: 1, userId: 'user1', displayName: 'Elite Rider', country: 'DE', km: 15000, rides: 250, points: 5000 },
  { id: '2', rank: 2, userId: 'user2', displayName: 'Speed Demon', country: 'US', km: 14500, rides: 240, points: 4800 },
  { id: '3', rank: 3, userId: 'user3', displayName: 'Trail Blazer', country: 'CA', km: 13000, rides: 200, points: 4000 },
  { id: '4', rank: 4, userId: 'user4', displayName: 'Road Warrior', country: 'GB', km: 12500, rides: 190, points: 3800 },
  { id: '5', rank: 5, userId: 'user5', displayName: 'Urban Explorer', country: 'AU', km: 11000, rides: 170, points: 3500 },
  { id: '6', rank: 6, userId: 'demoUser', displayName: 'Demo Rider', country: 'ES', km: 10500, rides: 160, points: 3200 },
  { id: '7', rank: 7, userId: 'user7', displayName: 'Mountain Goat', country: 'FR', km: 9800, rides: 150, points: 3000 },
  { id: '8', rank: 8, userId: 'user8', displayName: 'Desert Wanderer', country: 'IT', km: 9000, rides: 140, points: 2800 },
];