import * as React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FeedList } from './feed-list.js';
import { MOCK_FEED_ITEMS } from './feed-list.mock.js';
import type { FeedItem } from '@markec/community.entities.feed-item';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders actor display names`, () => {
  const { getByText } = renderWithProvider(<FeedList items={MOCK_FEED_ITEMS} />);
  expect(getByText(`Luka Horvat`)).toBeTruthy();
  expect(getByText(`Marko Petrović`)).toBeTruthy();
});

it(`renders ride payload title`, () => {
  const rideItem: FeedItem[] = [MOCK_FEED_ITEMS[0]];
  const { getByText } = renderWithProvider(<FeedList items={rideItem} />);
  expect(getByText(`Vršič Pass Loop`)).toBeTruthy();
});

it(`renders ride distance stat`, () => {
  const rideItem: FeedItem[] = [MOCK_FEED_ITEMS[0]];
  const { getByText } = renderWithProvider(<FeedList items={rideItem} />);
  expect(getByText(`142 km`)).toBeTruthy();
});

it(`renders achievement payload name`, () => {
  const achievementItem: FeedItem[] = [MOCK_FEED_ITEMS[1]];
  const { getByText } = renderWithProvider(<FeedList items={achievementItem} />);
  expect(getByText(`Vršič Conqueror`)).toBeTruthy();
});

it(`renders route payload name`, () => {
  const routeItem: FeedItem[] = [MOCK_FEED_ITEMS[2]];
  const { getByText } = renderWithProvider(<FeedList items={routeItem} />);
  expect(getByText(`Plitvička Jezera Loop`)).toBeTruthy();
});

it(`renders kind action label for ride`, () => {
  const { getByText } = renderWithProvider(<FeedList items={[MOCK_FEED_ITEMS[0]]} />);
  expect(getByText(`completed a ride`)).toBeTruthy();
});

it(`renders kind action label for achievement`, () => {
  const { getByText } = renderWithProvider(<FeedList items={[MOCK_FEED_ITEMS[1]]} />);
  expect(getByText(`unlocked an achievement`)).toBeTruthy();
});

it(`renders kind action label for route`, () => {
  const { getByText } = renderWithProvider(<FeedList items={[MOCK_FEED_ITEMS[2]]} />);
  expect(getByText(`shared a route`)).toBeTruthy();
});

it(`renders kind action label for comment`, () => {
  const { getByText } = renderWithProvider(<FeedList items={[MOCK_FEED_ITEMS[3]]} />);
  expect(getByText(`left a comment`)).toBeTruthy();
});

it(`renders empty state when no items provided`, () => {
  const { getByText } = renderWithProvider(<FeedList items={[]} />);
  expect(getByText(`No activity yet`)).toBeTruthy();
});

it(`renders empty state subtitle`, () => {
  const { getByText } = renderWithProvider(<FeedList items={[]} />);
  expect(getByText(`Be the first to log a ride or share a route!`)).toBeTruthy();
});

it(`renders the correct number of feed items`, () => {
  const { container } = renderWithProvider(<FeedList items={MOCK_FEED_ITEMS} />);
  const articles = container.querySelectorAll(`article`);
  expect(articles.length).toBe(MOCK_FEED_ITEMS.length);
});

it(`renders time elements for each item`, () => {
  const { container } = renderWithProvider(<FeedList items={MOCK_FEED_ITEMS} />);
  const timeElements = container.querySelectorAll(`time`);
  expect(timeElements.length).toBe(MOCK_FEED_ITEMS.length);
});

it(`applies custom className to the root element`, () => {
  const { container } = renderWithProvider(
    <FeedList items={MOCK_FEED_ITEMS} className="custom-feed" />
  );
  const root = container.querySelector(`.custom-feed`);
  expect(root).toBeTruthy();
});

it(`renders difficulty badge for route items`, () => {
  const routeItem: FeedItem[] = [MOCK_FEED_ITEMS[2]];
  const { getByText } = renderWithProvider(<FeedList items={routeItem} />);
  expect(getByText(`medium`)).toBeTruthy();
});
