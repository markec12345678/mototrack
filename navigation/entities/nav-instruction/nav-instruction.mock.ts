import { NavInstruction } from './nav-instruction.js';
import type { PlainNavInstruction, NavModifier } from './nav-instruction.js';

let _mockIdCounter = 1;

function mockId(): string {
  return `nav-instruction-mock-${_mockIdCounter++}`;
}

export function mockNavInstruction(
  overrides: Partial<PlainNavInstruction> = {},
): NavInstruction {
  return NavInstruction.from({
    id: mockId(),
    text: 'Zavijte levo',
    distanceM: 300,
    modifier: 'turn-left' as NavModifier,
    announceAt: 150,
    ...overrides,
  });
}

export function mockNavInstructions(
  overrides: Partial<PlainNavInstruction>[] = [],
): NavInstruction[] {
  const defaults: PlainNavInstruction[] = [
    {
      id: mockId(),
      text: 'Zapeljite na cesto',
      distanceM: 0,
      modifier: 'depart',
      announceAt: 150,
    },
    {
      id: mockId(),
      text: 'Nadaljujte naravnost',
      distanceM: 1200,
      modifier: 'continue',
      announceAt: 150,
    },
    {
      id: mockId(),
      text: 'Zavijte desno',
      distanceM: 450,
      modifier: 'turn-right',
      announceAt: 200,
    },
    {
      id: mockId(),
      text: 'Naredite obrat',
      distanceM: 80,
      modifier: 'uturn',
      announceAt: 150,
    },
    {
      id: mockId(),
      text: 'Prispeli ste na cilj',
      distanceM: 0,
      modifier: 'arrive',
      announceAt: 150,
    },
  ];

  return defaults.map((def, i) =>
    NavInstruction.from({ ...def, ...(overrides[i] ?? {}) }),
  );
}
