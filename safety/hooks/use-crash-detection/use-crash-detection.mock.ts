import { CrashEvent } from './use-crash-detection.js';

/**
 * Mock crash events for testing and composition previews.
 */
export const crashEventMock = {
  /**
   * A crash event with an active 15-second SOS countdown.
   */
  active: {
    id: 'crash-1700000000000-abc123',
    detectedAt: '2024-11-14T10:30:00.000Z',
    gForce: 6.2,
    speedDrop: 87.5,
    dismissed: false,
    sosDispatched: false,
    countdown: 15,
    location: { lat: 46.0569, lng: 14.5058 },
  } satisfies CrashEvent,

  /**
   * A crash event mid-countdown (8 seconds remaining).
   */
  midCountdown: {
    id: 'crash-1700000001000-def456',
    detectedAt: '2024-11-14T11:00:00.000Z',
    gForce: 4.8,
    speedDrop: 62.3,
    dismissed: false,
    sosDispatched: false,
    countdown: 8,
    location: { lat: 45.8131, lng: 15.9772 },
  } satisfies CrashEvent,

  /**
   * A crash event that was dismissed by the rider before SOS dispatch.
   */
  dismissed: {
    id: 'crash-1700000002000-ghi789',
    detectedAt: '2024-11-14T09:15:00.000Z',
    gForce: 5.1,
    speedDrop: 55.0,
    dismissed: true,
    sosDispatched: false,
    countdown: null,
    location: { lat: 43.8563, lng: 18.4131 },
  } satisfies CrashEvent,

  /**
   * A crash event where SOS was successfully dispatched.
   */
  dispatched: {
    id: 'crash-1700000003000-jkl012',
    detectedAt: '2024-11-14T08:45:00.000Z',
    gForce: 7.4,
    speedDrop: 110.2,
    dismissed: false,
    sosDispatched: true,
    countdown: null,
    location: { lat: 44.8048, lng: 20.4781 },
  } satisfies CrashEvent,

  /**
   * A crash event with no GPS location available.
   */
  noLocation: {
    id: 'crash-1700000004000-mno345',
    detectedAt: '2024-11-14T07:00:00.000Z',
    gForce: 4.3,
    speedDrop: 43.7,
    dismissed: false,
    sosDispatched: false,
    countdown: 12,
    location: null,
  } satisfies CrashEvent,
};
