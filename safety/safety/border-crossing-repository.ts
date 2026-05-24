import type { ReturnModelType } from '@typegoose/typegoose';
import { BorderCrossingModel } from './border-crossing.model.js';

export class BorderCrossingRepository {
  constructor(private borderCrossingModel: ReturnModelType<typeof BorderCrossingModel>) {}

  async listAll(): Promise<BorderCrossingModel[]> {
    const crossings = await this.borderCrossingModel.find({}).sort({ name: 1 });
    return crossings.map((c) => c.toObject());
  }

  async seedMany(crossings: Array<Partial<BorderCrossingModel>>): Promise<void> {
    await this.borderCrossingModel.insertMany(crossings);
  }

  async countAll(): Promise<number> {
    return this.borderCrossingModel.countDocuments();
  }
}
