import { prop } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Defines the structure for an achievement.
 */
export class AchievementModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({ required: true, type: String })
  public icon!: string;
}

/**
 * Defines the structure for a user's progress on an achievement.
 */
export class AchievementProgressModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public achievementId!: string; // Link to the base AchievementModel

  @prop({ required: true, type: Boolean })
  public unlocked!: boolean;

  @prop({ required: true, type: Number })
  public progressPct!: number;

  @prop({ type: Number })
  public unlockedAt?: number;
}

/**
 * Mock data for AchievementModel.
 */
export const achievementModelMock: AchievementModel[] = [
  { id: '1', name: 'First Ride', description: 'Complete your very first ride.', icon: 'ride_icon' },
  { id: '2', name: 'Road Trip Veteran', description: 'Complete 1000km.', icon: 'road_icon' },
  { id: '3', name: 'Social Butterfly', description: 'Join 5 group rides.', icon: 'group_icon' },
  { id: '4', name: 'Route Master', description: 'Rate 10 community routes.', icon: 'star_icon' },
  { id: '5', name: 'Fuel Saver', description: 'Report 5 fuel prices.', icon: 'fuel_icon' },
  { id: '6', name: 'Challenge Champion', description: 'Complete 3 challenges.', icon: 'trophy_icon' },
  { id: '7', name: 'Early Bird', description: 'Start 10 rides before 8 AM.', icon: 'sun_icon' },
  { id: '8', name: 'Night Rider', description: 'Complete 5 rides after 9 PM.', icon: 'moon_icon' },
  { id: '9', name: 'Explorer', description: 'Discover 20 new locations.', icon: 'map_icon' },
  { id: '10', name: 'Commentator', description: 'Leave 10 comments on routes.', icon: 'comment_icon' },
  { id: '11', name: 'Long Haul', description: 'Complete a single ride over 500km.', icon: 'long_ride_icon' },
  { id: '12', name: 'Local Hero', description: 'Report fuel price in 3 different cities in your country.', icon: 'local_icon' },
];

/**
 * Mock data for AchievementProgressModel, specifically for a 'demoUser'.
 */
export const achievementProgressModelMock: AchievementProgressModel[] = [
  { id: 'ap1', userId: 'demoUser', achievementId: '1', unlocked: true, progressPct: 100, unlockedAt: Date.now() - 86400000 * 5 },
  { id: 'ap2', userId: 'demoUser', achievementId: '2', unlocked: false, progressPct: 80, unlockedAt: undefined },
  { id: 'ap3', userId: 'demoUser', achievementId: '3', unlocked: true, progressPct: 100, unlockedAt: Date.now() - 86400000 * 2 },
  { id: 'ap4', userId: 'demoUser', achievementId: '4', unlocked: false, progressPct: 30, unlockedAt: undefined },
  { id: 'ap5', userId: 'demoUser', achievementId: '5', unlocked: false, progressPct: 0, unlockedAt: undefined },
  { id: 'ap6', userId: 'demoUser', achievementId: '6', unlocked: true, progressPct: 100, unlockedAt: Date.now() - 86400000 },
];