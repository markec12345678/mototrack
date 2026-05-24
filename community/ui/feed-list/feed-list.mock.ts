import { FeedItem } from '@markec/community.entities.feed-item';

const now = Date.now();
const min = 60 * 1000;
const hour = 60 * min;

export const MOCK_FEED_ITEMS: FeedItem[] = [
  FeedItem.from({
    id: `feed-1`,
    kind: `ride`,
    actor: { id: `u1`, displayName: `Luka Horvat`, country: `SI` },
    payload: JSON.stringify({ km: 142, durationMin: 98, title: `Vršič Pass Loop` }),
    at: now - 4 * min,
  }),
  FeedItem.from({
    id: `feed-2`,
    kind: `achievement`,
    actor: { id: `u2`, displayName: `Marko Petrović`, country: `RS` },
    payload: JSON.stringify({ name: `Vršič Conqueror`, icon: `🏔️`, description: `Completed the legendary Vršič pass route` }),
    at: now - 22 * min,
  }),
  FeedItem.from({
    id: `feed-3`,
    kind: `route`,
    actor: { id: `u3`, displayName: `Ivan Kovač`, country: `HR` },
    payload: JSON.stringify({ name: `Plitvička Jezera Loop`, distanceKm: 87, difficulty: `medium` }),
    at: now - 1 * hour,
  }),
  FeedItem.from({
    id: `feed-4`,
    kind: `comment`,
    actor: { id: `u4`, displayName: `Nikola Dimitrov`, country: `MK` },
    payload: JSON.stringify({ text: `Amazing roads through the Durmitor canyon, highly recommend going early morning!` }),
    at: now - 2 * hour,
  }),
  FeedItem.from({
    id: `feed-5`,
    kind: `ride`,
    actor: { id: `u5`, displayName: `Aris Papadopoulos`, country: `GR` },
    payload: JSON.stringify({ km: 310, durationMin: 240, title: `Peloponnese Coastal Run` }),
    at: now - 3 * hour,
  }),
  FeedItem.from({
    id: `feed-6`,
    kind: `achievement`,
    actor: { id: `u6`, displayName: `Bogdan Ionescu`, country: `RO` },
    payload: JSON.stringify({ name: `Transfăgărășan`, icon: `🛣️`, description: `Conquered the Transfăgărășan highway` }),
    at: now - 5 * hour,
  }),
  FeedItem.from({
    id: `feed-7`,
    kind: `route`,
    actor: { id: `u7`, displayName: `Emir Begić`, country: `BA` },
    payload: JSON.stringify({ name: `Durmitor Zanka`, distanceKm: 124, difficulty: `hard` }),
    at: now - 8 * hour,
  }),
  FeedItem.from({
    id: `feed-8`,
    kind: `comment`,
    actor: { id: `u8`, displayName: `Stefan Georgiev`, country: `BG` },
    payload: JSON.stringify({ text: `Just got back from Pirin — the roads are in perfect condition this time of year. 10/10 would ride again.` }),
    at: now - 12 * hour,
  }),
];
