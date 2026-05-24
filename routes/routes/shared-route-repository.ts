import { ReturnModelType } from '@typegoose/typegoose';
import { SharedRouteModel } from './shared-route.model.js';
class NotFound extends Error { constructor(msg = 'Not found') { super(msg); this.name = 'NotFound'; } }

export type CreateSharedRouteOptions = {
  code: string;
  routeId: string;
  qrUrl?: string;
  expiresAt: number;
};

export class SharedRouteRepository {
  constructor(private sharedRouteModel: ReturnModelType<typeof SharedRouteModel>) {}

  /**
   * Creates a new shared route entry in the database.
   * @param options - Options for creating the shared route.
   * @returns The created shared route model.
   */
  async createSharedRoute(options: CreateSharedRouteOptions): Promise<SharedRouteModel> {
    const res = await this.sharedRouteModel.create(options);
    return res.toObject();
  }

  /**
   * Retrieves a shared route by its unique code.
   * @param code - The 6-digit code for the shared route.
   * @returns The shared route model, or null if not found or expired.
   */
  async getSharedRouteByCode(code: string): Promise<SharedRouteModel | null> {
    const route = await this.sharedRouteModel.findOne({ code }).lean();
    return route ? route : null;
  }

  /**
   * Deletes a shared route by its code.
   * @param code - The code of the shared route to delete.
   * @returns True if the route was deleted, false otherwise.
   */
  async deleteSharedRoute(code: string): Promise<boolean> {
    const result = await this.sharedRouteModel.deleteOne({ code });
    return result.deletedCount === 1;
  }
}