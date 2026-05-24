import type { ReturnModelType } from '@typegoose/typegoose';
import { BalkanRoadModel } from './balkan-road.model.js';

export type ListRoadsOptions = {
  country?: string;
  difficulty?: string;
};

export class BalkanRoadRepository {
  constructor(private balkanRoadModel: ReturnModelType<typeof BalkanRoadModel>) {}

  /**
   * list balkan roads with optional filters.
   */
  async listRoads(options: ListRoadsOptions = {}): Promise<BalkanRoadModel[]> {
    const filter: Record<string, string> = {};
    if (options.country) filter.country = options.country;
    if (options.difficulty) filter.difficulty = options.difficulty;
    const roads = await this.balkanRoadModel.find(filter).sort({ rating: -1 });
    return roads.map((road) => road.toObject());
  }

  /**
   * seed the collection with the provided roads if empty.
   */
  async seedIfEmpty(roads: BalkanRoadModel[]): Promise<void> {
    const existing = await this.balkanRoadModel.find().limit(1);
    if (existing.length > 0) return;
    await this.balkanRoadModel.insertMany(roads);
  }
}
