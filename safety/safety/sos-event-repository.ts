import type { ReturnModelType } from '@typegoose/typegoose';
import { SosEventModel } from './sos-event.model.js';

export type CreateSosEventOptions = {
  userId: string;
  lat: number;
  lng: number;
  dispatchedTo: string[];
};

export class SosEventRepository {
  constructor(private sosEventModel: ReturnModelType<typeof SosEventModel>) {}

  async create(options: CreateSosEventOptions): Promise<SosEventModel> {
    const id = crypto.randomUUID();
    const created = await this.sosEventModel.create({
      id,
      userId: options.userId,
      lat: options.lat,
      lng: options.lng,
      triggeredAt: Date.now(),
      dispatchedTo: options.dispatchedTo,
    });
    return created.toObject();
  }

  async listByUser(userId: string): Promise<SosEventModel[]> {
    const events = await this.sosEventModel.find({ userId }).sort({ triggeredAt: -1 });
    return events.map((e) => e.toObject());
  }
}
