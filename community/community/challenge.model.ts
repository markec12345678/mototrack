import { prop } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Defines the structure for a challenge.
 */
export class ChallengeModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({ required: true, type: String })
  public icon!: string;

  @prop({ required: true, type: Number })
  public points!: number;

  @prop({ required: true, type: String })
  public status!: 'active' | 'past';

  @prop({ required: true, type: Number })
  public endsAt!: number;

  @prop({ required: true, type: Number })
  public participants!: number; // Total participants
}

/**
 * Defines the structure for a user's participation in a challenge.
 */
export class UserChallengeProgressModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public challengeId!: string;

  @prop({ required: true, type: Boolean })
  public joined!: boolean;

  @prop({ required: true, type: Number })
  public progressPct!: number; // User's specific progress in this challenge
}

/**
 * Mock data for ChallengeModel.
 */
export const challengeModelMock: ChallengeModel[] = [
  {
    id: '1',
    name: 'Winter Explorer',
    description: 'Ride 500km during winter months.',
    icon: 'winter_icon',
    points: 100,
    status: 'active',
    endsAt: Date.now() + 86400000 * 30, // Ends in 30 days
    participants: 120,
  },
  {
    id: '2',
    name: 'Cross-Country Conqueror',
    description: 'Visit 3 different countries in one month.',
    icon: 'country_icon',
    points: 250,
    status: 'active',
    endsAt: Date.now() + 86400000 * 15, // Ends in 15 days
    participants: 80,
  },
  {
    id: '3',
    name: 'Summer Summit',
    description: 'Reach an altitude of 5000m combined over a week.',
    icon: 'mountain_icon',
    points: 150,
    status: 'past',
    endsAt: Date.now() - 86400000 * 10, // Ended 10 days ago
    participants: 200,
  },
  {
    id: '4',
    name: 'Daily Commuter',
    description: 'Ride to work for 20 consecutive days.',
    icon: 'commute_icon',
    points: 80,
    status: 'active',
    endsAt: Date.now() + 86400000 * 5, // Ends in 5 days
    participants: 150,
  },
];

/**
 * Mock data for UserChallengeProgressModel, specifically for a 'demoUser'.
 */
export const userChallengeProgressModelMock: UserChallengeProgressModel[] = [
  { id: 'ucp1', userId: 'demoUser', challengeId: '1', joined: true, progressPct: 60 },
  { id: 'ucp2', userId: 'demoUser', challengeId: '2', joined: false, progressPct: 0 },
  { id: 'ucp3', userId: 'demoUser', challengeId: '3', joined: true, progressPct: 100 },
];