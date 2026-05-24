export type MockCrashEvent = {
  id: string;
  detectedAt: number;
  gForce: number;
  speedDropKmh: number;
  lat: number;
  lng: number;
};

export const mockCrashEvent: MockCrashEvent = {
  id: `crash-event-001`,
  detectedAt: Date.now(),
  gForce: 5.2,
  speedDropKmh: 68,
  lat: 46.0569,
  lng: 14.5058,
};

export const mockCrashEventHighImpact: MockCrashEvent = {
  id: `crash-event-002`,
  detectedAt: Date.now(),
  gForce: 8.7,
  speedDropKmh: 120,
  lat: 45.8131,
  lng: 15.9772,
};
