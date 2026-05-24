import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { FeedItem } from '@markec/community.entities.feed-item';

const LIST_FEED_QUERY = gql`
  query ListFeed {
    listFeed {
      id
      kind
      actor {
        id
        displayName
        country
      }
      payload
      at
    }
  }
`;

export type UseFeedOptions = {
  /**
   * Optional mock data to bypass the GraphQL query during testing or previewing.
   */
  mockData?: FeedItem[];
};

export type UseFeedResult = {
  /**
   * The list of feed items for the current user.
   */
  feed: FeedItem[];

  /**
   * Whether the query is currently loading.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query.
   */
  error: Error | undefined;

  /**
   * Refetch the feed from the server.
   */
  refetch: () => void;
};

/**
 * A React hook that fetches and returns the activity feed for the current user.
 *
 * @param options - Optional configuration including mockData for testing.
 * @returns An object containing the feed items, loading state, error, and a refetch function.
 */
export function useFeed(options?: UseFeedOptions): UseFeedResult {
  const { data, loading, error, refetch } = useQuery<{ listFeed: FeedItem[] }>(
    LIST_FEED_QUERY,
    { skip: !!options?.mockData }
  );

  const feed = useMemo(() => {
    if (options?.mockData) return options.mockData;
    return data?.listFeed ?? [];
  }, [data, options?.mockData]);

  if (options?.mockData) {
    return {
      feed: options.mockData,
      loading: false,
      error: undefined,
      refetch: () => {},
    };
  }

  return {
    feed,
    loading,
    error,
    refetch,
  };
}
