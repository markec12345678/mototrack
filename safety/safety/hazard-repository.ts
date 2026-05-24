import type { ReturnModelType } from '@typegoose/typegoose';
import { HazardModel } from './hazard.model.js';

export type ListHazardsOptions = {
  lat: number;
  lng: number;
  radiusKm?: number;
};

export type ReportHazardOptions = {
  type: string;
  lat: number;
  lng: number;
  reportedBy?: string;
};

const KM_PER_DEGREE = 111;

export class HazardRepository {
  constructor(private hazardModel: ReturnModelType<typeof HazardModel>) {}

  async listNear({ lat, lng, radiusKm = 50 }: ListHazardsOptions): Promise<HazardModel[]> {
    const degreeRadius = radiusKm / KM_PER_DEGREE;
    const hazards = await this.hazardModel.find({
      lat: { $gte: lat - degreeRadius, $lte: lat + degreeRadius },
      lng: { $gte: lng - degreeRadius, $lte: lng + degreeRadius },
    }).sort({ reportedAt: -1 });
    return hazards.map((h) => h.toObject());
  }

  async report(options: ReportHazardOptions): Promise<HazardModel> {
    const id = crypto.randomUUID();
    const created = await this.hazardModel.create({
      id,
      type: options.type,
      lat: options.lat,
      lng: options.lng,
      reportedAt: Date.now(),
      reportedBy: options.reportedBy,
      confirmedCount: 0,
    });
    return created.toObject();
  }

  async confirm(id: string): Promise<HazardModel | null> {
    const updated = await this.hazardModel.findOneAndUpdate(
      { id },
      { $inc: { confirmedCount: 1 } },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  async seedMany(hazards: Array<Partial<HazardModel>>): Promise<void> {
    await this.hazardModel.insertMany(hazards);
  }

  async countAll(): Promise<number> {
    return this.hazardModel.countDocuments();
  }
}
