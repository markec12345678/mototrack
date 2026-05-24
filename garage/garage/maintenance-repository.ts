import type { ReturnModelType } from '@typegoose/typegoose';
import { MaintenanceItemModel, MaintenanceHistoryEntry } from './maintenance-item.model.js';

export type SaveMaintenanceOptions = {
  id?: string;
  bikeId: string;
  name: string;
  intervalKm: number;
  intervalDays: number;
  lastServiceKm: number;
  lastServiceAt: number;
  history?: MaintenanceHistoryEntry[];
};

export class MaintenanceRepository {
  constructor(private maintenanceModel: ReturnModelType<typeof MaintenanceItemModel>) {}

  async listByBike(bikeId: string): Promise<MaintenanceItemModel[]> {
    const docs = await this.maintenanceModel.find({ bikeId }).sort({ _id: 1 });
    return docs.map((doc) => doc.toObject());
  }

  async saveItem(options: SaveMaintenanceOptions): Promise<MaintenanceItemModel> {
    const { id, ...rest } = options;
    if (id) {
      const updated = await this.maintenanceModel.findOneAndUpdate(
        { id },
        { $set: rest },
        { new: true }
      );
      if (updated) return updated.toObject();
    }
    const newId = id ?? crypto.randomUUID();
    const created = await this.maintenanceModel.create({
      id: newId,
      ...rest,
      history: rest.history ?? [],
    });
    return created.toObject();
  }

  async insertMany(items: Partial<MaintenanceItemModel>[]): Promise<void> {
    await this.maintenanceModel.insertMany(items);
  }

  async countAll(): Promise<number> {
    return this.maintenanceModel.estimatedDocumentCount();
  }
}
