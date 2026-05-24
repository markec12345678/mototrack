import { ReturnModelType } from '@typegoose/typegoose';
import { CommunityRouteModel } from './community-route.model.js';
import { CommunityRoute } from '@markec/community.entities.community-route';

/**
 * Options for listing community routes.
 */
export type ListCommunityRoutesOptions = {
  country?: string;
  difficulty?: string;
};

/**
 * Repository for managing community-shared routes.
 */
export class CommunityRouteRepository {
  constructor(private communityRouteModel: ReturnModelType<typeof CommunityRouteModel>) {}

  /**
   * Retrieves a list of public community-shared routes, with optional filters.
   * @param filter - Optional filters for country and difficulty.
   * @returns A promise that resolves to an array of CommunityRoute entities.
   */
  async listCommunityRoutes(filter?: ListCommunityRoutesOptions): Promise<CommunityRoute[]> {
    const query: any = {};
    if (filter?.country) {
      query.country = filter.country;
    }
    if (filter?.difficulty) {
      query.difficulty = filter.difficulty;
    }

    const routes = await this.communityRouteModel.find(query).exec();

    return routes.map((routeDoc) => {
      const routeObject = routeDoc.toObject();
      return new CommunityRoute(
        routeObject.id,
        routeObject.name,
        routeObject.author,
        routeObject.country,
        routeObject.distanceKm,
        routeObject.durationSec,
        routeObject.difficulty,
        routeObject.rating,
        routeObject.likes,
        routeObject.geometry.map((geo) => ({ lat: geo.lat, lng: geo.lng }))
      );
    });
  }
}