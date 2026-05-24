import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { Ride } from '@markec/rides.entities.ride';
import { RideModel, type TrackPointModel } from './ride.model.js';
import { RideRepository } from './ride-repository.js';
import { createRidesGqlSchema } from './rides.graphql.js';
import { seedRides } from './ride.mock.js';
import type { RidesConfig } from './rides-config.js';

export type CreateRideInput = {
  startedAt: number;
  endedAt: number;
  track: TrackPointModel[];
  name?: string;
  notes?: string;
};

export type ListRidesGqlOptions = {
  limit?: number;
  offset?: number;
  from?: number;
  to?: number;
};

export type RideStats = {
  totalKm: number;
  totalRides: number;
  totalDurationSec: number;
  totalClimbM: number;
  maxSpeedKmh: number;
  longestRideKm: number;
  avgKmPerWeek: number;
  streakDays: number;
};

const DEMO_USERNAME = 'markec';

export class RidesNode {
  constructor(
    private config: RidesConfig,
    private rideRepository: RideRepository
  ) {}

  /**
   * list rides for the current user.
   */
  async listRides(
    userId: string,
    options: ListRidesGqlOptions = {}
  ): Promise<Ride[]> {
    const docs = await this.rideRepository.listRides({ userId, ...options });
    return docs.map((doc) => Ride.from(doc));
  }

  /**
   * get a single ride by id; throws if the ride belongs to another user.
   */
  async getRide(userId: string, id: string): Promise<Ride | null> {
    const doc = await this.rideRepository.getRide(id);
    if (!doc) return null;
    if (doc.userId !== userId) throw new AccessDenied();
    return Ride.from(doc);
  }

  /**
   * create a new ride for the current user.
   */
  async createRide(userId: string, input: CreateRideInput): Promise<Ride> {
    const doc = await this.rideRepository.createRide({
      userId,
      startedAt: input.startedAt,
      endedAt: input.endedAt,
      track: input.track,
      name: input.name,
      notes: input.notes,
    });
    return Ride.from(doc);
  }

  /**
   * delete a ride owned by the current user.
   */
  async deleteRide(userId: string, id: string): Promise<boolean> {
    return this.rideRepository.deleteRide(id, userId);
  }

  /**
   * aggregate stats for the current user over a period: 'week' | 'month' | 'year' | 'all'.
   */
  async getRideStats(userId: string, period: string): Promise<RideStats> {
    const from = periodStart(period);
    const rides = await this.rideRepository.listRides({ userId, from });

    if (rides.length === 0) {
      return {
        totalKm: 0,
        totalRides: 0,
        totalDurationSec: 0,
        totalClimbM: 0,
        maxSpeedKmh: 0,
        longestRideKm: 0,
        avgKmPerWeek: 0,
        streakDays: 0,
      };
    }

    const totalKm = rides.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalDurationSec = rides.reduce((sum, r) => sum + r.durationSec, 0);
    const totalClimbM = rides.reduce((sum, r) => sum + r.climbM, 0);
    const maxSpeedKmh = rides.reduce(
      (max, r) => (r.maxSpeedKmh > max ? r.maxSpeedKmh : max),
      0
    );
    const longestRideKm = rides.reduce(
      (max, r) => (r.distanceKm > max ? r.distanceKm : max),
      0
    );

    const firstStart = rides[rides.length - 1].startedAt;
    const lastStart = rides[0].startedAt;
    const weeks = Math.max(
      1,
      (lastStart - firstStart) / (7 * 24 * 60 * 60 * 1000)
    );
    const avgKmPerWeek = totalKm / weeks;

    return {
      totalKm,
      totalRides: rides.length,
      totalDurationSec,
      totalClimbM,
      maxSpeedKmh,
      longestRideKm,
      avgKmPerWeek,
      streakDays: computeStreakDays(rides.map((r) => r.startedAt)),
    };
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: RidesConfig = {
    mongoUrl: process.env.MONGO_URL,
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: RidesConfig
  ) {
    const rideModel = getModelForClass(RideModel);
    const rideRepository = new RideRepository(rideModel);
    const rides = new RidesNode(config, rideRepository);
    const gqlSchema = createRidesGqlSchema(rides);

    symphonyPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    symphonyPlatform.registerOnStart(async () => {
      if (config.mongoUrl && mongoose.connection.readyState === 0) {
        await mongoose.connect(config.mongoUrl);
      }

      const existing = await rideModel.find().limit(1);
      if (existing.length > 0) return;

      await Promise.all(
        seedRides.map((seed) =>
          rideModel.create({
            id: crypto.randomUUID(),
            userId: DEMO_USERNAME,
            startedAt: seed.startedAt,
            endedAt: seed.endedAt,
            track: seed.track,
            name: seed.name,
            notes: seed.notes,
          })
        )
      );
    });

    return rides;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function periodStart(period: string): number | undefined {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  if (period === 'week') return now - 7 * day;
  if (period === 'month') return now - 30 * day;
  if (period === 'year') return now - 365 * day;
  return undefined;
}

function computeStreakDays(startedAts: number[]): number {
  if (startedAts.length === 0) return 0;
  const days = new Set(
    startedAts.map((ts) => new Date(ts).toISOString().slice(0, 10))
  );

  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i += 1) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export default RidesNode;
