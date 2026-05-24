import { describe, it, expect } from 'vitest';
import { TurnStep } from './turn-step.js';
import type { OsrmStep } from './turn-step.js';
import { mockTurnStep, mockTurnSteps } from './turn-step.mock.js';

describe('TurnStep', () => {
  describe('TurnStep.from()', () => {
    it('creates a TurnStep from a plain object', () => {
      const step = TurnStep.from({
        id: 'abc-123',
        instruction: 'Zavijte desno',
        distanceM: 200,
        durationSec: 30,
        location: { lat: 46.05, lng: 14.5 },
        modifier: 'turn-right',
      });

      expect(step).toBeInstanceOf(TurnStep);
      expect(step.id).toBe('abc-123');
      expect(step.instruction).toBe('Zavijte desno');
      expect(step.distanceM).toBe(200);
      expect(step.durationSec).toBe(30);
      expect(step.location).toEqual({ lat: 46.05, lng: 14.5 });
      expect(step.modifier).toBe('turn-right');
    });

    it('uses safe defaults for missing fields', () => {
      const step = TurnStep.from({} as any);
      expect(step.id).toBe('');
      expect(step.instruction).toBe('');
      expect(step.distanceM).toBe(0);
      expect(step.durationSec).toBe(0);
      expect(step.location).toEqual({ lat: 0, lng: 0 });
    });
  });

  describe('TurnStep.toObject()', () => {
    it('serializes to a plain object with all fields', () => {
      const step = TurnStep.from({
        id: 'xyz-789',
        instruction: 'Začnite pot',
        distanceM: 0,
        durationSec: 0,
        location: { lat: 46.0569, lng: 14.5058 },
        modifier: 'depart',
      });

      const plain = step.toObject();
      expect(plain.id).toBe('xyz-789');
      expect(plain.instruction).toBe('Začnite pot');
      expect(plain.distanceM).toBe(0);
      expect(plain.durationSec).toBe(0);
      expect(plain.location).toEqual({ lat: 46.0569, lng: 14.5058 });
      expect(plain.modifier).toBe('depart');
    });

    it('round-trips through from() and toObject()', () => {
      const original = {
        id: 'rt-001',
        instruction: 'Ostro zavijte levo',
        distanceM: 150,
        durationSec: 20,
        location: { lat: 46.1, lng: 14.6 },
        modifier: 'turn-sharp-left' as const,
      };
      const plain = TurnStep.from(original).toObject();
      expect(plain).toEqual(original);
    });
  });

  describe('TurnStep.fromOsrmStep()', () => {
    it('parses a depart maneuver into Slovenian', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'depart', location: [14.5058, 46.0569] },
        distance: 0,
        duration: 0,
        name: 'Slovenska cesta',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-depart');
      expect(step.instruction).toBe('Začnite pot na Slovenska cesta');
      expect(step.modifier).toBe('depart');
      expect(step.location).toEqual({ lat: 46.0569, lng: 14.5058 });
    });

    it('parses an arrive maneuver into Slovenian', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'arrive', location: [14.51, 46.06] },
        distance: 0,
        duration: 0,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-arrive');
      expect(step.instruction).toBe('Prispeli ste na cilj');
      expect(step.modifier).toBe('arrive');
    });

    it('parses a right turn maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'turn', modifier: 'right', location: [14.506, 46.051] },
        distance: 320,
        duration: 42,
        name: 'Čopova ulica',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-right');
      expect(step.instruction).toBe('Zavijte desno na Čopova ulica');
      expect(step.modifier).toBe('turn-right');
      expect(step.distanceM).toBe(320);
      expect(step.durationSec).toBe(42);
    });

    it('parses a left turn maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'turn', modifier: 'left', location: [14.503, 46.053] },
        distance: 100,
        duration: 15,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-left');
      expect(step.instruction).toBe('Zavijte levo');
      expect(step.modifier).toBe('turn-left');
    });

    it('parses a uturn maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'turn', modifier: 'uturn', location: [14.5, 46.05] },
        distance: 0,
        duration: 5,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-uturn');
      expect(step.instruction).toBe('Obrnite se');
      expect(step.modifier).toBe('uturn');
    });

    it('parses a roundabout maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'roundabout', location: [14.502, 46.052] },
        distance: 80,
        duration: 10,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-roundabout');
      expect(step.instruction).toBe('Vstopite v krožišče');
      expect(step.modifier).toBe('roundabout');
    });

    it('parses a fork-right maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'fork', modifier: 'right', location: [14.51, 46.06] },
        distance: 200,
        duration: 25,
        name: 'Dunajska cesta',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-fork');
      expect(step.instruction).toBe('Na razcepu zavijte desno na Dunajska cesta');
    });

    it('parses an on-ramp maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'on ramp', modifier: 'right', location: [14.52, 46.07] },
        distance: 400,
        duration: 30,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-onramp');
      expect(step.instruction).toBe('Zavijte desno na uvozno rampo');
    });

    it('parses an off-ramp maneuver', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'off ramp', modifier: 'left', location: [14.53, 46.08] },
        distance: 300,
        duration: 22,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-offramp');
      expect(step.instruction).toBe('Zavijte levo na izvozno rampo');
    });

    it('falls back to intersection location when maneuver.location is absent', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'turn', modifier: 'right' },
        distance: 100,
        duration: 12,
        name: '',
        intersections: [{ location: [14.509, 46.055] }],
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-fallback');
      expect(step.location).toEqual({ lat: 46.055, lng: 14.509 });
    });

    it('falls back to zero location when no location data is available', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'turn', modifier: 'straight' },
        distance: 50,
        duration: 6,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-noloc');
      expect(step.location).toEqual({ lat: 0, lng: 0 });
    });

    it('generates an id when none is provided', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'depart', location: [14.5, 46.05] },
        distance: 0,
        duration: 0,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep);
      expect(step.id).toBeTruthy();
      expect(step.id.startsWith('step-')).toBe(true);
    });

    it('rounds duration to the nearest integer', () => {
      const osrmStep: OsrmStep = {
        maneuver: { type: 'turn', modifier: 'left', location: [14.5, 46.05] },
        distance: 100,
        duration: 14.7,
        name: '',
      };
      const step = TurnStep.fromOsrmStep(osrmStep, 'step-round');
      expect(step.durationSec).toBe(15);
    });
  });

  describe('mock helpers', () => {
    it('mockTurnStep() returns a TurnStep instance', () => {
      const step = mockTurnStep();
      expect(step).toBeInstanceOf(TurnStep);
      expect(step.modifier).toBe('turn-right');
    });

    it('mockTurnStep() accepts partial overrides', () => {
      const step = mockTurnStep({ instruction: 'Zavijte levo', modifier: 'turn-left' });
      expect(step.instruction).toBe('Zavijte levo');
      expect(step.modifier).toBe('turn-left');
    });

    it('mockTurnSteps() returns an array of 8 steps', () => {
      const steps = mockTurnSteps();
      expect(steps).toHaveLength(8);
      expect(steps[0].modifier).toBe('depart');
      expect(steps[steps.length - 1].modifier).toBe('arrive');
    });
  });
});
