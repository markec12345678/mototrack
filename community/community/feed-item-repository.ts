import { ReturnModelType } from '@typegoose/typegoose';
import { FeedItemModel } from './feed-item.model.js';
import { FeedItem } from '@markec/community.entities.feed-item';
import { User } from './user.js';

/**
 * Repository for managing community feed items.
 */
export class FeedItemRepository {
  constructor(private feedItemModel: ReturnModelType<typeof FeedItemModel>) {}

  /**
   * Retrieves a list of feed items relevant to a user (e.g., friend/community activity).
   * @param user - The user for whom to fetch the feed.
   * @returns A promise that resolves to an array of FeedItem entities.
   */
  async listFeed(user: User): Promise<FeedItem[]> {
    // For simplicity, this example lists all feed items sorted by time.
    // In a real application, this would involve complex logic to filter by friends, groups, etc.
    const feedItems = await this.feedItemModel.find({}).sort({ at: -1 }).exec();

    return feedItems.map((feedItemDoc) => {
      const feedItemObject = feedItemDoc.toObject();
      return new FeedItem(
        feedItemObject.id,
        feedItemObject.kind,
        {
          id: feedItemObject.actor.id,
          displayName: feedItemObject.actor.displayName,
          country: feedItemObject.actor.country,
        },
        feedItemObject.payload,
        feedItemObject.at
      );
    });
  }
}