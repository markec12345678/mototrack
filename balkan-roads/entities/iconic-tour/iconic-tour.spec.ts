import { describe, it, expect } from 'vitest';
import { IconicTour } from './iconic-tour.js';
import { mockIconicTour, mockIconicTours } from './iconic-tour.mock.js';

describe('IconicTour', () => {
  describe('IconicTour.from()', () => {
    it('creates an instance from a plain object', () => {
      const tour = IconicTour.from({
        id: 'tour-test-1',
        name: 'Test Pass',
        country: 'Slovenia',
        flag: '🇸🇮',
        distanceKm: 98,
        rating: 4.9,
        difficulty: 'hard',
        description: 'A scenic mountain pass.',
        waypoints: [
          { lat: 46.4833, lng: 13.7833, name: 'Start' },
          { lat: 46.4167, lng: 13.7333, name: 'Summit' },
        ],
      });

      expect(tour).toBeInstanceOf(IconicTour);
      expect(tour.id).toBe('tour-test-1');
      expect(tour.name).toBe('Test Pass');
      expect(tour.country).toBe('Slovenia');
      expect(tour.flag).toBe('🇸🇮');
      expect(tour.distanceKm).toBe(98);
      expect(tour.rating).toBe(4.9);
      expect(tour.difficulty).toBe('hard');
      expect(tour.description).toBe('A scenic mountain pass.');
      expect(tour.waypoints).toHaveLength(2);
    });

    it('applies safe defaults when optional fields are missing', () => {
      const tour = IconicTour.from({
        id: '',
        name: '',
        country: '',
        flag: '',
        distanceKm: 0,
        rating: 0,
        difficulty: '',
        description: '',
        waypoints: [],
      });

      expect(tour.id).toBe('');
      expect(tour.waypoints).toEqual([]);
    });
  });

  describe('toObject()', () => {
    it('serializes the entity back to a plain object', () => {
      const plain = {
        id: 'tour-test-2',
        name: 'Kotor Loop',
        country: 'Montenegro',
        flag: '🇲🇪',
        distanceKm: 122,
        rating: 4.8,
        difficulty: 'hard',
        description: 'Bay of Kotor to Lovcen.',
        waypoints: [
          { lat: 42.4247, lng: 18.7714, name: 'Kotor' },
          { lat: 42.3917, lng: 18.8333, name: 'Lovcen Summit' },
        ],
      };

      const tour = IconicTour.from(plain);
      const result = tour.toObject();

      expect(result).toEqual(plain);
    });

    it('includes the id field in the serialized object', () => {
      const tour = IconicTour.from({
        id: 'tour-test-3',
        name: 'Transfagarasan',
        country: 'Romania',
        flag: '🇷🇴',
        distanceKm: 151,
        rating: 5.0,
        difficulty: 'hard',
        description: "Romania's most dramatic road.",
        waypoints: [],
      });

      expect(tour.toObject()).toHaveProperty('id', 'tour-test-3');
    });

    it('preserves waypoints with optional name field', () => {
      const tour = IconicTour.from({
        id: 'tour-test-4',
        name: 'Unnamed Waypoints Tour',
        country: 'Greece',
        flag: '🇬🇷',
        distanceKm: 90,
        rating: 4.5,
        difficulty: 'easy',
        description: 'Tour with unnamed waypoints.',
        waypoints: [
          { lat: 39.7217, lng: 21.6306 },
          { lat: 39.9833, lng: 20.7667, name: 'Papigo' },
        ],
      });

      const obj = tour.toObject();
      expect(obj.waypoints[0]).not.toHaveProperty('name');
      expect(obj.waypoints[1].name).toBe('Papigo');
    });
  });

  describe('mockIconicTour()', () => {
    it('returns a single IconicTour instance', () => {
      const tour = mockIconicTour();
      expect(tour).toBeInstanceOf(IconicTour);
    });

    it('applies partial overrides to the mock', () => {
      const tour = mockIconicTour({ name: 'Custom Tour', distanceKm: 999 });
      expect(tour.name).toBe('Custom Tour');
      expect(tour.distanceKm).toBe(999);
    });
  });

  describe('mockIconicTours()', () => {
    it('returns exactly 20 seeded tours', () => {
      const tours = mockIconicTours();
      expect(tours).toHaveLength(20);
    });

    it('all entries are IconicTour instances', () => {
      const tours = mockIconicTours();
      tours.forEach((t) => expect(t).toBeInstanceOf(IconicTour));
    });

    it('includes the 10 prototype GPS tours by id', () => {
      const tours = mockIconicTours();
      const ids = tours.map((t) => t.id);

      expect(ids).toContain('tour-011');
      expect(ids).toContain('tour-012');
      expect(ids).toContain('tour-013');
      expect(ids).toContain('tour-014');
      expect(ids).toContain('tour-015');
      expect(ids).toContain('tour-016');
      expect(ids).toContain('tour-017');
      expect(ids).toContain('tour-018');
      expect(ids).toContain('tour-019');
      expect(ids).toContain('tour-020');
    });

    it('applies per-index overrides', () => {
      const tours = mockIconicTours([{ name: 'Overridden Tour' }]);
      expect(tours[0].name).toBe('Overridden Tour');
      expect(tours[1].name).not.toBe('Overridden Tour');
    });

    it('all tours have valid GPS waypoints', () => {
      const tours = mockIconicTours();
      tours.forEach((tour) => {
        expect(tour.waypoints.length).toBeGreaterThan(0);
        tour.waypoints.forEach((wp) => {
          expect(wp.lat).toBeGreaterThan(-90);
          expect(wp.lat).toBeLessThan(90);
          expect(wp.lng).toBeGreaterThan(-180);
          expect(wp.lng).toBeLessThan(180);
        });
      });
    });

    it('all tours have a positive distanceKm', () => {
      const tours = mockIconicTours();
      tours.forEach((tour) => {
        expect(tour.distanceKm).toBeGreaterThan(0);
      });
    });

    it('all tours have a rating between 0 and 5', () => {
      const tours = mockIconicTours();
      tours.forEach((tour) => {
        expect(tour.rating).toBeGreaterThanOrEqual(0);
        expect(tour.rating).toBeLessThanOrEqual(5);
      });
    });
  });
});
