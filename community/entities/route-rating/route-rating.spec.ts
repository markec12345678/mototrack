import { describe, it, expect } from 'vitest';
import { RouteRating } from './route-rating.js';
import { mockRouteRating, mockRouteRatings } from './route-rating.mock.js';

describe('RouteRating', () => {
  it('should have a static from() method', () => {
    expect(RouteRating.from).toBeTruthy();
  });

  it('should create a RouteRating instance from a plain object', () => {
    const rating = RouteRating.from({
      id: 'rating-1',
      routeId: 'route-1',
      userId: 'user-1',
      quality: 5,
      scenery: 4,
      twistiness: 3,
      difficulty: 2,
      comment: 'Great ride!',
      createdAt: 1700000000000,
    });

    expect(rating).toBeInstanceOf(RouteRating);
    expect(rating.id).toBe('rating-1');
    expect(rating.routeId).toBe('route-1');
    expect(rating.userId).toBe('user-1');
    expect(rating.quality).toBe(5);
    expect(rating.scenery).toBe(4);
    expect(rating.twistiness).toBe(3);
    expect(rating.difficulty).toBe(2);
    expect(rating.comment).toBe('Great ride!');
    expect(rating.createdAt).toBe(1700000000000);
  });

  it('should handle an undefined comment gracefully', () => {
    const rating = RouteRating.from({
      id: 'rating-2',
      routeId: 'route-2',
      userId: 'user-2',
      quality: 3,
      scenery: 3,
      twistiness: 3,
      difficulty: 3,
      comment: undefined,
      createdAt: 1700000000000,
    });

    expect(rating.comment).toBeUndefined();
  });

  it('should serialize to a plain object via toObject()', () => {
    const plain = {
      id: 'rating-3',
      routeId: 'route-3',
      userId: 'user-3',
      quality: 4,
      scenery: 5,
      twistiness: 5,
      difficulty: 4,
      comment: 'Loved the scenery.',
      createdAt: 1700000000000,
    };

    const rating = RouteRating.from(plain);
    const result = rating.toObject();

    expect(result).toEqual(plain);
  });

  it('toObject() should always include an id property', () => {
    const rating = RouteRating.from({
      id: 'rating-4',
      routeId: 'route-4',
      userId: 'user-4',
      quality: 2,
      scenery: 2,
      twistiness: 2,
      difficulty: 2,
      createdAt: 1700000000000,
    });

    expect(rating.toObject()).toHaveProperty('id', 'rating-4');
  });

  it('should use safe defaults when properties are missing', () => {
    const rating = RouteRating.from({} as any);

    expect(rating.id).toBe('');
    expect(rating.routeId).toBe('');
    expect(rating.userId).toBe('');
    expect(rating.quality).toBe(0);
    expect(rating.scenery).toBe(0);
    expect(rating.twistiness).toBe(0);
    expect(rating.difficulty).toBe(0);
    expect(rating.createdAt).toBe(0);
  });
});

describe('mockRouteRating', () => {
  it('should return a RouteRating instance', () => {
    const rating = mockRouteRating();
    expect(rating).toBeInstanceOf(RouteRating);
  });

  it('should support partial overrides', () => {
    const rating = mockRouteRating({ quality: 1, comment: 'Overridden' });
    expect(rating.quality).toBe(1);
    expect(rating.comment).toBe('Overridden');
  });
});

describe('mockRouteRatings', () => {
  it('should return an array of RouteRating instances', () => {
    const ratings = mockRouteRatings();
    expect(ratings).toHaveLength(3);
    ratings.forEach((r) => expect(r).toBeInstanceOf(RouteRating));
  });

  it('should apply overrides to all mock entries', () => {
    const ratings = mockRouteRatings({ difficulty: 5 });
    ratings.forEach((r) => expect(r.difficulty).toBe(5));
  });
});
