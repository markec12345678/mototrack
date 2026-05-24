import { ReturnModelType } from '@typegoose/typegoose';
import { RouteRatingModel } from './route-rating.model.js';
import { RouteRating } from '@markec/community.entities.route-rating';
import { User } from './user.js';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import { CommunityRouteRepository } from './community-route-repository.js';

/**
 * Input type for rating a route.
 */
export type RateRouteInput = {
  routeId: string;
  quality: number;
  scenery: number;
  twistiness: number;
  difficulty: number;
  comment?: string;
};

/**
 * Repository for managing route ratings.
 */
export class RouteRatingRepository {
  constructor(
    private routeRatingModel: ReturnModelType<typeof RouteRatingModel>,
    private communityRouteRepository: CommunityRouteRepository
  ) {}

  /**
   * Rates a route with category stars (1-5) and an optional comment.
   * @param input - The rating details.
   * @param user - The user providing the rating.
   * @returns A promise that resolves to the created RouteRating entity.
   * @throws {Unauthorized} if no user is provided.
   */
  async rateRoute(input: RateRouteInput, user: User): Promise<RouteRating> {
    if (!user) throw new Unauthorized();

    const newRating = await this.routeRatingModel.create({
      routeId: input.routeId,
      userId: user.id,
      quality: input.quality,
      scenery: input.scenery,
      twistiness: input.twistiness,
      difficulty: input.difficulty,
      comment: input.comment,
      createdAt: Date.now(),
    });

    // Optionally, update the average rating and likes on the CommunityRoute
    // This is a simplified update and a real system might use aggregation pipelines or triggers
    const allRatingsForRoute = await this.routeRatingModel.find({ routeId: input.routeId }).exec();
    const totalRatings = allRatingsForRoute.length;
    const sumRatings = allRatingsForRoute.reduce((sum, r) => sum + (r.quality + r.scenery + r.twistiness + r.difficulty) / 4, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    
    // Update the parent route's rating
    await this.communityRouteRepository['communityRouteModel'].findOneAndUpdate(
      { id: input.routeId },
      { $set: { rating: averageRating, likes: totalRatings } } // Using likes as total ratings for simplicity
    );

    const ratingObject = newRating.toObject();
    return new RouteRating(
      ratingObject.id,
      ratingObject.routeId,
      ratingObject.userId,
      ratingObject.quality,
      ratingObject.scenery,
      ratingObject.twistiness,
      ratingObject.difficulty,
      ratingObject.comment,
      ratingObject.createdAt
    );
  }
}