import type { ReturnModelType } from '@typegoose/typegoose';
import { RideModel, type TrackPointModel } from './ride.model.js';

export type CreateRideOptions = {
  userId: string;
  startedAt: number;
  endedAt: number;
  track: TrackPointModel[];
  name?: string;
  notes?: string;
};

export type ListRidesOptions = {
  userId?: string;
  limit?: number;
  offset?: number;
  from?: number;
  to?: number;
};

export class RideRepository {
  constructor(private rideModel: ReturnModelType<typeof RideModel>) {}

  async createRide(options: CreateRideOptions): Promise<RideModel> {
    const id = crypto.randomUUID();
    const doc = await this.rideModel.create({
      id,
      userId: options.userId,
      startedAt: options.startedAt,
      endedAt: options.endedAt,
      track: options.track,
      name: options.name,
      notes: options.notes,
    });
    return doc.toObject();
  }

  async listRides(options: ListRidesOptions = {}): Promise<RideModel[]> {
    const query: Record<string, unknown> = {};
    if (options.userId) query.userId = options.userId;
    if (options.from || options.to) {
      const range: Record<string, number> = {};
      if (options.from) range.$gte = options.from;
      if (options.to) range.$lte = options.to;
      query.startedAt = range;
    }

    let cursor = this.rideModel.find(query).sort({ startedAt: -1 });
    if (options.offset) cursor = cursor.skip(options.offset);
    if (options.limit) cursor = cursor.limit(options.limit);
    const docs = await cursor.exec();
    return docs.map((doc) => doc.toObject());
  }

  async getRide(id: string): Promise<RideModel | null> {
    const doc = await this.rideModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  async deleteRide(id: string, userId: string): Promise<boolean> {
    const res = await this.rideModel.deleteOne({ id, userId });
    return (res.deletedCount ?? 0) > 0;
  }
}
