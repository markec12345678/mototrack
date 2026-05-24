import type { ReturnModelType } from '@typegoose/typegoose';
import { SpeedCameraModel } from './speed-camera.model.js';

export type ListSpeedCamerasOptions = {
  lat: number;
  lng: number;
  radiusKm?: number;
};

const KM_PER_DEGREE = 111;

export class SpeedCameraRepository {
  constructor(private speedCameraModel: ReturnModelType<typeof SpeedCameraModel>) {}

  async listNear({ lat, lng, radiusKm = 50 }: ListSpeedCamerasOptions): Promise<SpeedCameraModel[]> {
    const degreeRadius = radiusKm / KM_PER_DEGREE;
    const cameras = await this.speedCameraModel.find({
      lat: { $gte: lat - degreeRadius, $lte: lat + degreeRadius },
      lng: { $gte: lng - degreeRadius, $lte: lng + degreeRadius },
    });
    return cameras.map((c) => c.toObject());
  }

  async listAll(): Promise<SpeedCameraModel[]> {
    const cameras = await this.speedCameraModel.find({});
    return cameras.map((c) => c.toObject());
  }

  async seedMany(cameras: Array<Partial<SpeedCameraModel>>): Promise<void> {
    await this.speedCameraModel.insertMany(cameras);
  }

  async countAll(): Promise<number> {
    return this.speedCameraModel.countDocuments();
  }
}
