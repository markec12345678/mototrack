import type { ReturnModelType } from '@typegoose/typegoose';
import { BikeModel } from './bike.model.js';

export type SaveBikeOptions = {
  id?: string;
  userId: string;
  name: string;
  model: string;
  year: number;
  mileageKm: number;
  tankL: number;
  consumptionLPer100: number;
  currentFuelL: number;
  color: string;
  primary?: boolean;
};

export class BikeRepository {
  constructor(private bikeModel: ReturnModelType<typeof BikeModel>) {}

  async listByUser(userId: string): Promise<BikeModel[]> {
    const docs = await this.bikeModel.find({ userId }).sort({ primary: -1, _id: 1 });
    return docs.map((doc) => doc.toObject());
  }

  async findById(id: string): Promise<BikeModel | null> {
    const doc = await this.bikeModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  async getPrimary(userId: string): Promise<BikeModel | null> {
    const doc = await this.bikeModel.findOne({ userId, primary: true });
    if (doc) return doc.toObject();
    const fallback = await this.bikeModel.findOne({ userId });
    return fallback ? fallback.toObject() : null;
  }

  async saveBike(options: SaveBikeOptions): Promise<BikeModel> {
    const { id, userId, primary, ...rest } = options;

    if (primary) {
      await this.bikeModel.updateMany({ userId, primary: true }, { $set: { primary: false } });
    }

    if (id) {
      const existing = await this.bikeModel.findOne({ id });
      if (existing) {
        const updated = await this.bikeModel.findOneAndUpdate(
          { id },
          { $set: { ...rest, primary: primary ?? existing.primary } },
          { new: true }
        );
        if (updated) return updated.toObject();
      }
    }

    const newId = id ?? crypto.randomUUID();
    const created = await this.bikeModel.create({
      id: newId,
      userId,
      ...rest,
      primary: primary ?? false,
    });
    return created.toObject();
  }

  async deleteBike(id: string, userId: string): Promise<boolean> {
    const res = await this.bikeModel.deleteOne({ id, userId });
    return res.deletedCount === 1;
  }

  async insertMany(bikes: Partial<BikeModel>[]): Promise<void> {
    await this.bikeModel.insertMany(bikes);
  }

  async countAll(): Promise<number> {
    return this.bikeModel.estimatedDocumentCount();
  }
}
