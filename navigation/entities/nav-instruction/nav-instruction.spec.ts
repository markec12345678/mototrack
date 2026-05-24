import { describe, it, expect } from 'vitest';
import { NavInstruction } from './nav-instruction.js';
import { mockNavInstruction, mockNavInstructions } from './nav-instruction.mock.js';

describe('NavInstruction', () => {
  describe('NavInstruction.from()', () => {
    it('should create a NavInstruction from a plain object', () => {
      const plain = {
        id: 'test-1',
        text: 'Zavijte levo',
        distanceM: 300,
        modifier: 'turn-left' as const,
        announceAt: 150,
      };

      const instruction = NavInstruction.from(plain);

      expect(instruction).toBeInstanceOf(NavInstruction);
      expect(instruction.id).toBe('test-1');
      expect(instruction.text).toBe('Zavijte levo');
      expect(instruction.distanceM).toBe(300);
      expect(instruction.modifier).toBe('turn-left');
      expect(instruction.announceAt).toBe(150);
    });

    it('should apply safe defaults for missing fields', () => {
      const instruction = NavInstruction.from({} as any);

      expect(instruction.id).toBe('');
      expect(instruction.text).toBe('');
      expect(instruction.distanceM).toBe(0);
      expect(instruction.modifier).toBe('continue');
      expect(instruction.announceAt).toBe(150);
    });
  });

  describe('NavInstruction.fromTurnStep()', () => {
    it('should compute announceAt as max(150, speed * 4) when speed is high', () => {
      const step = {
        id: 'step-1',
        text: 'Zavijte desno',
        distanceM: 500,
        modifier: 'turn-right' as const,
      };

      const instruction = NavInstruction.fromTurnStep(step, 60);

      expect(instruction.announceAt).toBe(240); // 60 * 4 = 240 > 150
    });

    it('should use 150 as minimum announceAt when speed is low', () => {
      const step = {
        id: 'step-2',
        text: 'Nadaljujte naravnost',
        distanceM: 200,
        modifier: 'continue' as const,
      };

      const instruction = NavInstruction.fromTurnStep(step, 20);

      expect(instruction.announceAt).toBe(150); // 20 * 4 = 80 < 150, so 150
    });

    it('should use 150 as minimum announceAt when speed is zero', () => {
      const step = {
        id: 'step-3',
        text: 'Naredite obrat',
        distanceM: 50,
        modifier: 'uturn' as const,
      };

      const instruction = NavInstruction.fromTurnStep(step, 0);

      expect(instruction.announceAt).toBe(150);
    });

    it('should use exactly 150 when speed * 4 equals 150 (37.5 km/h)', () => {
      const step = {
        id: 'step-4',
        text: 'Zavijte levo',
        distanceM: 300,
        modifier: 'turn-left' as const,
      };

      const instruction = NavInstruction.fromTurnStep(step, 37.5);

      expect(instruction.announceAt).toBe(150); // 37.5 * 4 = 150
    });

    it('should carry over step properties correctly', () => {
      const step = {
        id: 'step-5',
        text: 'Prispeli ste na cilj',
        distanceM: 0,
        modifier: 'arrive' as const,
      };

      const instruction = NavInstruction.fromTurnStep(step, 50);

      expect(instruction.id).toBe('step-5');
      expect(instruction.text).toBe('Prispeli ste na cilj');
      expect(instruction.distanceM).toBe(0);
      expect(instruction.modifier).toBe('arrive');
    });

    it('should apply safe defaults for missing step fields', () => {
      const instruction = NavInstruction.fromTurnStep({}, 80);

      expect(instruction.id).toBe('');
      expect(instruction.text).toBe('');
      expect(instruction.distanceM).toBe(0);
      expect(instruction.modifier).toBe('continue');
      expect(instruction.announceAt).toBe(320); // 80 * 4 = 320
    });
  });

  describe('NavInstruction.toObject()', () => {
    it('should serialize to a plain object with all fields', () => {
      const instruction = NavInstruction.from({
        id: 'obj-1',
        text: 'Zavijte levo',
        distanceM: 400,
        modifier: 'turn-left',
        announceAt: 200,
      });

      const obj = instruction.toObject();

      expect(obj).toEqual({
        id: 'obj-1',
        text: 'Zavijte levo',
        distanceM: 400,
        modifier: 'turn-left',
        announceAt: 200,
      });
    });

    it('should return a plain object, not a NavInstruction instance', () => {
      const instruction = NavInstruction.from({
        id: 'obj-2',
        text: 'Nadaljujte naravnost',
        distanceM: 1000,
        modifier: 'continue',
        announceAt: 150,
      });

      const obj = instruction.toObject();

      expect(obj).not.toBeInstanceOf(NavInstruction);
    });
  });

  describe('mock helpers', () => {
    it('mockNavInstruction() should return a NavInstruction', () => {
      const instruction = mockNavInstruction();
      expect(instruction).toBeInstanceOf(NavInstruction);
    });

    it('mockNavInstruction() should allow partial overrides', () => {
      const instruction = mockNavInstruction({ text: 'Zavijte desno', modifier: 'turn-right' });
      expect(instruction.text).toBe('Zavijte desno');
      expect(instruction.modifier).toBe('turn-right');
    });

    it('mockNavInstructions() should return an array of NavInstruction', () => {
      const instructions = mockNavInstructions();
      expect(instructions).toHaveLength(5);
      instructions.forEach((i) => expect(i).toBeInstanceOf(NavInstruction));
    });

    it('mockNavInstructions() should allow per-item overrides', () => {
      const instructions = mockNavInstructions([{ text: 'Prilagojeno besedilo' }]);
      expect(instructions[0].text).toBe('Prilagojeno besedilo');
    });
  });
});
