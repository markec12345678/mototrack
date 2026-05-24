import { ReturnModelType } from '@typegoose/typegoose';
import { SavedRouteModel } from './saved-route.model.js';
import { LatLngModel } from './lat-lng.model.js';
import { WaypointModel } from './waypoint.model.js';
class NotFound extends Error { constructor(msg = 'Not found') { super(msg); this.name = 'NotFound'; } }

export type CreateSavedRouteOptions = {
  id: string;
  userId?: string;
  name: string;
  waypoints: WaypointModel[];
  mode: string;
  geometry: LatLngModel[];
  distanceKm: number;
  durationSec: number;
  notes?: string;
  createdAt: number;
};

export class SavedRouteRepository {
  constructor(private savedRouteModel: ReturnModelType<typeof SavedRouteModel>) {}

  /**
   * Creates a new saved route in the database.
   * @param options - Options for creating the saved route.
   * @returns The created saved route model.
   */
  async createSavedRoute(options: CreateSavedRouteOptions): Promise<SavedRouteModel> {
    const res = await this.savedRouteModel.create(options);
    return res.toObject();
  }

  /**
   * Retrieves a saved route by its ID.
   * @param id - The ID of the saved route.
   * @returns The saved route model, or null if not found.
   */
  async getSavedRouteById(id: string): Promise<SavedRouteModel | null> {
    const route = await this.savedRouteModel.findOne({ id }).lean();
    return route ? route : null;
  }

  /**
   * Lists all saved routes for a given user ID.
   * @param userId - The ID of the user.
   * @returns An array of saved route models.
   */
  async listSavedRoutesByUserId(userId: string): Promise<SavedRouteModel[]> {
    const routes = await this.savedRouteModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return routes;
  }

  /**
   * Deletes a saved route by its ID.
   * @param id - The ID of the saved route.
   * @returns True if the route was deleted, false otherwise.
   */
  async deleteSavedRoute(id: string): Promise<boolean> {
    const result = await this.savedRouteModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}