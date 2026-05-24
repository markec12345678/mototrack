import type { ReturnModelType } from '@typegoose/typegoose';
import { SavedRouteModel } from './saved-route.model.js';
import { SharedRouteModel } from './shared-route.model.js';

export type WaypointInput = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

export type LatLngInput = {
  lat: number;
  lng: number;
};

export type SaveRouteOptions = {
  userId?: string;
  name: string;
  waypoints: WaypointInput[];
  mode: string;
  geometry: LatLngInput[];
  distanceKm: number;
  durationSec: number;
  notes?: string;
};

export type ShareRouteOptions = SaveRouteOptions & {
  ttlSeconds: number;
};

export class RoutesRepository {
  constructor(
    private savedRouteModel: ReturnModelType<typeof SavedRouteModel>,
    private sharedRouteModel: ReturnModelType<typeof SharedRouteModel>
  ) {}

  async listByUser(userId?: string): Promise<SavedRouteModel[]> {
    const query = userId ? { userId } : {};
    const docs = await this.savedRouteModel.find(query).sort({ createdAt: -1 });
    return docs.map((doc) => doc.toObject());
  }

  async createSavedRoute(options: SaveRouteOptions): Promise<SavedRouteModel> {
    const id = crypto.randomUUID();
    const doc = await this.savedRouteModel.create({
      id,
      userId: options.userId,
      name: options.name,
      waypoints: options.waypoints,
      mode: options.mode,
      geometry: options.geometry,
      distanceKm: options.distanceKm,
      durationSec: options.durationSec,
      notes: options.notes,
      createdAt: Math.floor(Date.now() / 1000),
    });
    return doc.toObject();
  }

  async deleteSavedRoute(id: string, userId?: string): Promise<boolean> {
    const query: Record<string, unknown> = { id };
    if (userId) query.userId = userId;
    const res = await this.savedRouteModel.deleteOne(query);
    return (res.deletedCount ?? 0) > 0;
  }

  async createSharedRoute(options: ShareRouteOptions): Promise<SharedRouteModel> {
    const id = crypto.randomUUID();
    const code = this.generateUniqueCode();
    const now = Date.now();
    const expiresAt = new Date(now + options.ttlSeconds * 1000);

    const doc = await this.sharedRouteModel.create({
      id,
      code,
      name: options.name,
      waypoints: options.waypoints,
      mode: options.mode,
      geometry: options.geometry,
      distanceKm: options.distanceKm,
      durationSec: options.durationSec,
      notes: options.notes,
      createdAt: Math.floor(now / 1000),
      expiresAt,
    });
    return doc.toObject();
  }

  async findSharedRouteByCode(code: string): Promise<SharedRouteModel | null> {
    const doc = await this.sharedRouteModel.findOne({ code: code.toUpperCase() });
    return doc ? doc.toObject() : null;
  }

  async countSavedRoutes(): Promise<number> {
    return this.savedRouteModel.estimatedDocumentCount();
  }

  async seedSavedRoutes(routes: SaveRouteOptions[]): Promise<void> {
    const docs = routes.map((route) => ({
      id: crypto.randomUUID(),
      userId: route.userId,
      name: route.name,
      waypoints: route.waypoints,
      mode: route.mode,
      geometry: route.geometry,
      distanceKm: route.distanceKm,
      durationSec: route.durationSec,
      notes: route.notes,
      createdAt: Math.floor(Date.now() / 1000),
    }));
    await this.savedRouteModel.insertMany(docs);
  }

  private generateUniqueCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i += 1) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
