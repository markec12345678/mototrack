import type { ReturnModelType } from '@typegoose/typegoose';
import { IconicTourModel } from './iconic-tour.model.js';

export type ListToursOptions = {
  country?: string;
  difficulty?: string;
};

export class IconicTourRepository {
  constructor(private iconicTourModel: ReturnModelType<typeof IconicTourModel>) {}

  /**
   * list iconic tours with optional filters.
   */
  async listTours(options: ListToursOptions = {}): Promise<IconicTourModel[]> {
    const filter: Record<string, string> = {};
    if (options.country) filter.country = options.country;
    if (options.difficulty) filter.difficulty = options.difficulty;
    const tours = await this.iconicTourModel.find(filter).sort({ rating: -1 });
    return tours.map((tour) => tour.toObject());
  }

  /**
   * find a single tour by id.
   */
  async getTour(id: string): Promise<IconicTourModel | null> {
    const tour = await this.iconicTourModel.findOne({ id });
    if (!tour) return null;
    return tour.toObject();
  }

  /**
   * seed the collection with the provided tours if empty.
   */
  async seedIfEmpty(tours: IconicTourModel[]): Promise<void> {
    const existing = await this.iconicTourModel.find().limit(1);
    if (existing.length > 0) return;
    await this.iconicTourModel.insertMany(tours);
  }
}
