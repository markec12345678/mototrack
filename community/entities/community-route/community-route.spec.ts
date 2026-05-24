import { describe, it, expect } from 'vitest';
import { CommunityRoute } from './community-route.js';
import { mockCommunityRoute, mockCommunityRoutes } from './community-route.mock.js';

describe('CommunityRoute', () => {
  it('has a CommunityRoute.from() static method', () => {
    expect(CommunityRoute.from).toBeTruthy();
  });

  it('creates a CommunityRoute instance from a plain object', () => {
    const route = CommunityRoute.from({
      id: 'test-id-001',
      name: 'Test Route',
      author: 'Tester',
      country: 'SI',
      distanceKm: 50,
      durationSec: 5400,
      difficulty: 'moderate',
      rating: 4.2,
      likes: 10,
      geometry: [{ lat: 46.0, lng: 14.5 }],
    });

    expect(route).toBeInstanceOf(CommunityRoute);
    expect(route.id).toBe('test-id-001');
    expect(route.name).toBe('Test Route');
    expect(route.author).toBe('Tester');
    expect(route.country).toBe('SI');
    expect(route.distanceKm).toBe(50);
    expect(route.durationSec).toBe(5400);
    expect(route.difficulty).toBe('moderate');
    expect(route.rating).toBe(4.2);
    expect(route.likes).toBe(10);
    expect(route.geometry).toHaveLength(1);
  });

  it('serializes to a plain object via toObject()', () => {
    const plain = {
      id: 'test-id-002',
      name: 'Serialization Route',
      author: 'AuthorX',
      country: 'HR',
      distanceKm: 75.3,
      durationSec: 8100,
      difficulty: 'hard',
      rating: 4.5,
      likes: 99,
      geometry: [
        { lat: 44.8, lng: 15.5 },
        { lat: 44.9, lng: 15.6 },
      ],
    };

    const route = CommunityRoute.from(plain);
    const obj = route.toObject();

    expect(obj).toEqual(plain);
    expect(obj.id).toBe('test-id-002');
    expect(obj.geometry).toHaveLength(2);
  });

  it('toObject() returns an id property', () => {
    const route = CommunityRoute.from({
      id: 'id-check-003',
      name: 'ID Check Route',
      author: 'AuthorY',
      country: 'BG',
      distanceKm: 100,
      durationSec: 10800,
      difficulty: 'expert',
      rating: 5.0,
      likes: 500,
      geometry: [],
    });

    expect(route.toObject().id).toBe('id-check-003');
  });

  it('handles missing optional fields with safe defaults', () => {
    const route = CommunityRoute.from({
      id: '',
      name: '',
      author: '',
      country: '',
      distanceKm: 0,
      durationSec: 0,
      difficulty: '',
      rating: 0,
      likes: 0,
      geometry: [],
    });

    expect(route.geometry).toEqual([]);
    expect(route.likes).toBe(0);
    expect(route.rating).toBe(0);
  });

  it('mockCommunityRoute() returns a single CommunityRoute', () => {
    const route = mockCommunityRoute();
    expect(route).toBeInstanceOf(CommunityRoute);
    expect(route.name).toBe('Skrita Logarska');
    expect(route.country).toBe('SI');
  });

  it('mockCommunityRoute() accepts partial overrides', () => {
    const route = mockCommunityRoute({ name: 'Custom Route', difficulty: 'easy' });
    expect(route.name).toBe('Custom Route');
    expect(route.difficulty).toBe('easy');
    expect(route.country).toBe('SI');
  });

  it('mockCommunityRoutes() returns all 4 seeded routes', () => {
    const routes = mockCommunityRoutes();
    expect(routes).toHaveLength(4);
    expect(routes[0].name).toBe('Skrita Logarska');
    expect(routes[1].name).toBe('Durmitor Zanka');
    expect(routes[2].name).toBe('Plitvička Jezera');
    expect(routes[3].name).toBe('Pirin Enduro');
  });

  it('mockCommunityRoutes() applies per-index overrides', () => {
    const routes = mockCommunityRoutes([{ rating: 1.0 }, {}, { likes: 999 }]);
    expect(routes[0].rating).toBe(1.0);
    expect(routes[1].name).toBe('Durmitor Zanka');
    expect(routes[2].likes).toBe(999);
  });

  it('each seeded route has a non-empty geometry', () => {
    const routes = mockCommunityRoutes();
    routes.forEach((route) => {
      expect(route.geometry.length).toBeGreaterThan(0);
    });
  });

  it('seeded routes are indexed by country correctly', () => {
    const routes = mockCommunityRoutes();
    const countries = routes.map((r) => r.country);
    expect(countries).toContain('SI');
    expect(countries).toContain('ME');
    expect(countries).toContain('HR');
    expect(countries).toContain('BG');
  });

  it('seeded routes cover expected difficulty levels', () => {
    const routes = mockCommunityRoutes();
    const difficulties = routes.map((r) => r.difficulty);
    expect(difficulties).toContain('hard');
    expect(difficulties).toContain('expert');
    expect(difficulties).toContain('moderate');
  });

  it('all seeded routes have a rating above 4', () => {
    const routes = mockCommunityRoutes();
    routes.forEach((route) => {
      expect(route.rating).toBeGreaterThan(4);
    });
  });
});
