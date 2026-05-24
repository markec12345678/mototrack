export type FeedActor = {
  /**
   * unique identifier of the actor.
   */
  id: string;

  /**
   * display name of the actor.
   */
  displayName: string;

  /**
   * country of the actor.
   */
  country: string;
};

export type PlainFeedItem = {
  /**
   * unique identifier of the feed item.
   */
  id: string;

  /**
   * the type/kind of the feed item (e.g. 'ride', 'achievement', 'challenge').
   */
  kind: string;

  /**
   * the actor who triggered this feed item.
   */
  actor: FeedActor;

  /**
   * JSON-serialized payload specific to the feed item kind.
   */
  payload: string;

  /**
   * timestamp (epoch ms) when the feed item was created.
   * Indexed descending for chronological feed ordering.
   */
  at: number;
};

export class FeedItem {
  constructor(
    /**
     * unique identifier of the feed item.
     */
    readonly id: string,

    /**
     * the type/kind of the feed item (e.g. 'ride', 'achievement', 'challenge').
     */
    readonly kind: string,

    /**
     * the actor who triggered this feed item.
     */
    readonly actor: FeedActor,

    /**
     * JSON-serialized payload specific to the feed item kind.
     */
    readonly payload: string,

    /**
     * timestamp (epoch ms) when the feed item was created.
     * Indexed descending for chronological feed ordering.
     */
    readonly at: number,
  ) {}

  /**
   * deserialize the payload string into a typed object.
   */
  get parsedPayload(): Record<string, unknown> {
    try {
      return JSON.parse(this.payload) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  /**
   * serialize the FeedItem into a plain object.
   */
  toObject(): PlainFeedItem {
    return {
      id: this.id,
      kind: this.kind,
      actor: { ...this.actor },
      payload: this.payload,
      at: this.at,
    };
  }

  /**
   * create a FeedItem from a plain object.
   */
  static from(plain: PlainFeedItem): FeedItem {
    const {
      id = '',
      kind = '',
      actor = { id: '', displayName: '', country: '' },
      payload = '{}',
      at = 0,
    } = plain;

    return new FeedItem(id, kind, actor, payload, at);
  }
}
