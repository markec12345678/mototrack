import { describe, it, expect } from 'vitest';
import { FeedItem } from './feed-item.js';
import { mockFeedItem, mockFeedItems } from './feed-item.mock.js';

describe('FeedItem', () => {
  it('should have a static from() method', () => {
    expect(FeedItem.from).toBeTruthy();
  });

  it('should create a FeedItem from a plain object', () => {
    const plain = {
      id: 'item-1',
      kind: 'ride',
      actor: { id: 'user-1', displayName: 'Sam Rider', country: 'DE' },
      payload: JSON.stringify({ distanceKm: 100 }),
      at: 1700000000000,
    };

    const item = FeedItem.from(plain);

    expect(item).toBeInstanceOf(FeedItem);
    expect(item.id).toBe('item-1');
    expect(item.kind).toBe('ride');
    expect(item.actor.displayName).toBe('Sam Rider');
    expect(item.actor.country).toBe('DE');
    expect(item.at).toBe(1700000000000);
  });

  it('should serialize to a plain object via toObject()', () => {
    const plain = {
      id: 'item-2',
      kind: 'achievement',
      actor: { id: 'user-2', displayName: 'Maria Cruz', country: 'ES' },
      payload: JSON.stringify({ achievementName: 'Iron Rider' }),
      at: 1700001000000,
    };

    const item = FeedItem.from(plain);
    const obj = item.toObject();

    expect(obj.id).toBe('item-2');
    expect(obj.kind).toBe('achievement');
    expect(obj.actor.id).toBe('user-2');
    expect(obj.payload).toBe(plain.payload);
    expect(obj.at).toBe(1700001000000);
  });

  it('should parse payload JSON via parsedPayload getter', () => {
    const item = FeedItem.from({
      id: 'item-3',
      kind: 'ride',
      actor: { id: 'user-3', displayName: 'Luca', country: 'IT' },
      payload: JSON.stringify({ distanceKm: 200, routeName: 'Dolomites' }),
      at: Date.now(),
    });

    const parsed = item.parsedPayload;
    expect(parsed['distanceKm']).toBe(200);
    expect(parsed['routeName']).toBe('Dolomites');
  });

  it('should return an empty object for invalid payload JSON', () => {
    const item = FeedItem.from({
      id: 'item-4',
      kind: 'ride',
      actor: { id: 'user-4', displayName: 'Anna', country: 'AT' },
      payload: 'not-valid-json',
      at: Date.now(),
    });

    expect(item.parsedPayload).toEqual({});
  });

  it('should handle missing fields gracefully with safe defaults', () => {
    const item = FeedItem.from({} as any);

    expect(item.id).toBe('');
    expect(item.kind).toBe('');
    expect(item.payload).toBe('{}');
    expect(item.at).toBe(0);
    expect(item.actor.displayName).toBe('');
  });

  it('should support partial override in mockFeedItem()', () => {
    const item = mockFeedItem({ kind: 'challenge' });
    expect(item.kind).toBe('challenge');
    expect(item).toBeInstanceOf(FeedItem);
  });

  it('should return multiple feed items sorted by at descending in mockFeedItems()', () => {
    const items = mockFeedItems();
    expect(items.length).toBeGreaterThan(1);

    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1].at).toBeGreaterThanOrEqual(items[i].at);
    }
  });

  it('toObject() should include the id field', () => {
    const item = mockFeedItem({ id: 'explicit-id' });
    expect(item.toObject().id).toBe('explicit-id');
  });
});
