import { TurnStep } from './turn-step.js';
import type { PlainTurnStep, TurnModifier } from './turn-step.js';

/**
 * Returns a single mock TurnStep with optional property overrides.
 */
export function mockTurnStep(overrides: Partial<PlainTurnStep> = {}): TurnStep {
  return TurnStep.from({
    id: 'step-mock-001',
    instruction: 'Zavijte desno',
    distanceM: 320,
    durationSec: 42,
    location: { lat: 46.0569, lng: 14.5058 },
    modifier: 'turn-right' as TurnModifier,
    ...overrides,
  });
}

/**
 * Returns an array of mock TurnStep objects representing a short route
 * through Ljubljana, Slovenia.
 */
export function mockTurnSteps(): TurnStep[] {
  return [
    TurnStep.from({
      id: 'step-mock-001',
      instruction: 'Začnite pot na Slovenska cesta',
      distanceM: 0,
      durationSec: 0,
      location: { lat: 46.0569, lng: 14.5058 },
      modifier: 'depart',
    }),
    TurnStep.from({
      id: 'step-mock-002',
      instruction: 'Zavijte desno na Čopova ulica',
      distanceM: 180,
      durationSec: 24,
      location: { lat: 46.0512, lng: 14.5063 },
      modifier: 'turn-right',
    }),
    TurnStep.from({
      id: 'step-mock-003',
      instruction: 'Rahlo zavijte levo na Prešernov trg',
      distanceM: 95,
      durationSec: 12,
      location: { lat: 46.0514, lng: 14.5048 },
      modifier: 'turn-slight-left',
    }),
    TurnStep.from({
      id: 'step-mock-004',
      instruction: 'Vstopite v krožišče',
      distanceM: 210,
      durationSec: 28,
      location: { lat: 46.052, lng: 14.5035 },
      modifier: 'roundabout',
    }),
    TurnStep.from({
      id: 'step-mock-005',
      instruction: 'Nadaljujte naravnost na Cankarjeva cesta',
      distanceM: 450,
      durationSec: 58,
      location: { lat: 46.0531, lng: 14.5012 },
      modifier: 'straight',
    }),
    TurnStep.from({
      id: 'step-mock-006',
      instruction: 'Ostro zavijte desno na Šubičeva ulica',
      distanceM: 130,
      durationSec: 18,
      location: { lat: 46.0548, lng: 14.499 },
      modifier: 'turn-sharp-right',
    }),
    TurnStep.from({
      id: 'step-mock-007',
      instruction: 'Obrnite se',
      distanceM: 60,
      durationSec: 10,
      location: { lat: 46.0555, lng: 14.4985 },
      modifier: 'uturn',
    }),
    TurnStep.from({
      id: 'step-mock-008',
      instruction: 'Prispeli ste na cilj',
      distanceM: 0,
      durationSec: 0,
      location: { lat: 46.056, lng: 14.499 },
      modifier: 'arrive',
    }),
  ];
}
