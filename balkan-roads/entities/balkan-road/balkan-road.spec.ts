import { describe, it, expect } from 'vitest';
import { BalkanRoad } from './balkan-road.js';
import { mockBalkanRoad, mockBalkanRoads, SEEDED_ROADS } from './balkan-road.mock.js';

describe('BalkanRoad', () => {
  describe('BalkanRoad.from()', () => {
    it('creates a BalkanRoad instance from a plain object', () => {
      const plain = {
        id: 'ro-001',
        name: 'Transfăgărășan Highway',
        country: 'RO',
        flag: '🇷🇴',
        lengthKm: 90,
        rating: 9.8,
        difficulty: 'Hard' as const,
        type: 'Pass' as const,
        description: 'The greatest driving road in the world.',
      };

      const road = BalkanRoad.from(plain);

      expect(road).toBeInstanceOf(BalkanRoad);
      expect(road.id).toBe('ro-001');
      expect(road.name).toBe('Transfăgărășan Highway');
      expect(road.country).toBe('RO');
      expect(road.flag).toBe('🇷🇴');
      expect(road.lengthKm).toBe(90);
      expect(road.rating).toBe(9.8);
      expect(road.difficulty).toBe('Hard');
      expect(road.type).toBe('Pass');
      expect(road.description).toBe('The greatest driving road in the world.');
    });

    it('applies safe defaults for missing optional fields', () => {
      const road = BalkanRoad.from({} as any);

      expect(road.id).toBe('');
      expect(road.name).toBe('');
      expect(road.country).toBe('');
      expect(road.flag).toBe('');
      expect(road.lengthKm).toBe(0);
      expect(road.rating).toBe(0);
      expect(road.difficulty).toBe('Moderate');
      expect(road.type).toBe('Scenic');
      expect(road.description).toBe('');
    });
  });

  describe('toObject()', () => {
    it('serializes a BalkanRoad back to a plain object', () => {
      const plain = {
        id: 'me-001',
        name: 'Lovćen Serpentine Road',
        country: 'ME',
        flag: '🇲🇪',
        lengthKm: 18,
        rating: 9.0,
        difficulty: 'Hard' as const,
        type: 'Serpentine' as const,
        description: 'Legendary hairpin road above Kotor Bay.',
      };

      const road = BalkanRoad.from(plain);
      const obj = road.toObject();

      expect(obj).toEqual(plain);
    });

    it('includes the id field in the serialized object', () => {
      const road = BalkanRoad.from({
        id: 'si-001',
        name: 'Vršič Pass',
        country: 'SI',
        flag: '🇸🇮',
        lengthKm: 25,
        rating: 9.4,
        difficulty: 'Hard',
        type: 'Pass',
        description: 'Highest pass in Slovenia.',
      });

      expect(road.toObject()).toHaveProperty('id', 'si-001');
    });
  });

  describe('mockBalkanRoad()', () => {
    it('returns a BalkanRoad instance', () => {
      const road = mockBalkanRoad();
      expect(road).toBeInstanceOf(BalkanRoad);
    });

    it('applies overrides to the mock', () => {
      const road = mockBalkanRoad({ name: 'Custom Road', rating: 5.5 });
      expect(road.name).toBe('Custom Road');
      expect(road.rating).toBe(5.5);
    });
  });

  describe('mockBalkanRoads()', () => {
    it('returns exactly 63 roads', () => {
      const roads = mockBalkanRoads();
      expect(roads).toHaveLength(63);
    });

    it('every road is a BalkanRoad instance', () => {
      const roads = mockBalkanRoads();
      roads.forEach((road) => expect(road).toBeInstanceOf(BalkanRoad));
    });

    it('covers all 10 expected countries', () => {
      const roads = mockBalkanRoads();
      const countries = new Set(roads.map((r) => r.country));
      const expected = ['SI', 'HR', 'BA', 'ME', 'RS', 'MK', 'AL', 'BG', 'RO', 'GR'];
      expected.forEach((c) => expect(countries).toContain(c));
    });

    it('applies override to the first road only', () => {
      const roads = mockBalkanRoads({ rating: 1.0 });
      expect(roads[0].rating).toBe(1.0);
      expect(roads[1].rating).not.toBe(1.0);
    });

    it('all ratings are between 0 and 10', () => {
      const roads = mockBalkanRoads();
      roads.forEach((road) => {
        expect(road.rating).toBeGreaterThanOrEqual(0);
        expect(road.rating).toBeLessThanOrEqual(10);
      });
    });

    it('all roads have a non-empty id', () => {
      const roads = mockBalkanRoads();
      roads.forEach((road) => expect(road.id).toBeTruthy());
    });
  });

  describe('SEEDED_ROADS', () => {
    it('contains exactly 63 entries', () => {
      expect(SEEDED_ROADS).toHaveLength(63);
    });

    it('all entries have unique ids', () => {
      const ids = SEEDED_ROADS.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(SEEDED_ROADS.length);
    });
  });
});
