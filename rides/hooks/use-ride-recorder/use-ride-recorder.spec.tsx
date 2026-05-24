import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useRideRecorder } from './use-ride-recorder.js';
import { mockRideSnapshot } from './use-ride-recorder.mock.js';

// ─── Geolocation mock ─────────────────────────────────────────────────────────

function makeCoords(overrides: Partial<GeolocationCoordinates> = {}): GeolocationCoordinates {
  return {
    latitude: 43.8563,
    longitude: 18.4131,
    accuracy: 8,
    altitude: 520,
    altitudeAccuracy: 5,
    heading: 45,
    speed: 15,
    ...overrides,
  } as GeolocationCoordinates;
}

function makePosition(
  coords: GeolocationCoordinates,
  timestamp = Date.now()
): GeolocationPosition {
  return { coords, timestamp } as GeolocationPosition;
}

function buildGeoMock() {
  let watchCallback: PositionCallback | null = null;

  const watchPosition = vi.fn((success: PositionCallback) => {
    watchCallback = success;
    return 1;
  });

  const clearWatch = vi.fn();

  const getCurrentPosition = vi.fn((success: PositionCallback) => {
    success(makePosition(makeCoords()));
  });

  const firePosition = (pos: GeolocationPosition) => {
    watchCallback?.(pos);
  };

  return { watchPosition, clearWatch, getCurrentPosition, firePosition };
}

// ─── localStorage mock ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: () => { store = {}; },
  };
})();

// ─── WakeLock mock ────────────────────────────────────────────────────────────

const wakeLockMock = {
  request: vi.fn().mockResolvedValue({ release: vi.fn() }),
};

// ─── Setup ────────────────────────────────────────────────────────────────────

function setup() {
  const geo = buildGeoMock();

  Object.defineProperty(globalThis, 'navigator', {
    value: {
      geolocation: geo,
      wakeLock: wakeLockMock,
    },
    writable: true,
    configurable: true,
  });

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  localStorageMock.clear();
  vi.clearAllMocks();

  return geo;
}

const wrapper = ({ children }: { children?: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

// ─── Tests ────────────────────────────────────────────────────────────────────

it('should start in idle status', () => {
  setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });
  expect(result.current.status).toBe('idle');
});

it('should transition to recording after start()', async () => {
  setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  expect(result.current.status).toBe('recording');
});

it('should accept a valid GPS fix and append a point', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ accuracy: 8 })));
  });

  expect(result.current.points.length).toBeGreaterThan(0);
});

it('should reject a fix with accuracy > 200m', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ accuracy: 250 })));
  });

  const gpsPoints = result.current.points.filter(
    (p) => !('gap' in p && (p as { gap: boolean }).gap)
  );
  expect(gpsPoints.length).toBe(0);
});

it('should reject an impossible position jump', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  // First valid fix at low speed
  act(() => {
    geo.firePosition(makePosition(makeCoords({ latitude: 43.8563, longitude: 18.4131, accuracy: 8, speed: 5 })));
  });

  // Jump ~73km away at low speed — should be rejected (>500m threshold)
  act(() => {
    geo.firePosition(makePosition(makeCoords({ latitude: 44.5000, longitude: 19.0000, accuracy: 8, speed: 5 })));
  });

  const gpsPoints = result.current.points.filter(
    (p) => !('gap' in p && (p as { gap: boolean }).gap)
  );
  expect(gpsPoints.length).toBe(1);
});

it('should transition to paused after pause()', async () => {
  setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    result.current.pause();
  });

  expect(result.current.status).toBe('paused');
});

it('should transition back to recording after resume()', async () => {
  setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    result.current.pause();
  });

  act(() => {
    result.current.resume();
  });

  expect(result.current.status).toBe('recording');
});

it('should insert a gap marker on resume', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords()));
  });

  act(() => {
    result.current.pause();
  });

  act(() => {
    result.current.resume();
  });

  const hasGap = result.current.points.some(
    (p) => 'gap' in p && (p as { gap: boolean }).gap === true
  );
  expect(hasGap).toBe(true);
});

it('should transition to stopped after stop()', async () => {
  setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    result.current.stop();
  });

  expect(result.current.status).toBe('stopped');
});

it('should clear localStorage snapshot on stop()', async () => {
  setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    result.current.stop();
  });

  expect(localStorageMock.removeItem).toHaveBeenCalledWith('mototrack:active-ride');
});

it('should restore points from a snapshot', () => {
  setup();
  // Use mockReturnValue (not Once) so both the mount-effect auto-restore and
  // the explicit restore() call in the test each receive the snapshot.
  localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRideSnapshot));

  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  act(() => {
    result.current.restore();
  });

  expect(result.current.points.length).toBe(mockRideSnapshot.points.length);
});

it('should return false from restore() when no snapshot exists', () => {
  setup();
  localStorageMock.getItem.mockReturnValue(null);

  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  let restored = false;
  act(() => {
    restored = result.current.restore();
  });

  expect(restored).toBe(false);
});

it('should compute distanceKm > 0 after multiple valid fixes', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  // Two fixes ~200m apart — well within the 500m sanity-check threshold
  act(() => {
    geo.firePosition(makePosition(makeCoords({ latitude: 43.8563, longitude: 18.4131, accuracy: 8, speed: 10 }), Date.now()));
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ latitude: 43.8580, longitude: 18.4148, accuracy: 8, speed: 10 }), Date.now() + 5000));
  });

  expect(result.current.distanceKm).toBeGreaterThan(0);
});

it('should report gpsQuality as excellent for accuracy <= 10m', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ accuracy: 6 })));
  });

  expect(result.current.gpsQuality).toBe('excellent');
});

it('should report gpsQuality as good for accuracy between 11-50m', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ accuracy: 35 })));
  });

  expect(result.current.gpsQuality).toBe('good');
});

it('should compute climbM > 0 when elevation increases', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  // Two fixes ~100m apart with rising elevation — within the 500m threshold
  act(() => {
    geo.firePosition(makePosition(makeCoords({ altitude: 500, accuracy: 8, speed: 10 }), Date.now()));
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ latitude: 43.8570, longitude: 18.4140, altitude: 550, accuracy: 8, speed: 10 }), Date.now() + 5000));
  });

  expect(result.current.climbM).toBeGreaterThan(0);
});

it('should track currentSpeedKmh from the latest fix', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    // speed in m/s — 20 m/s = 72 km/h
    geo.firePosition(makePosition(makeCoords({ speed: 20, accuracy: 8 })));
  });

  expect(result.current.currentSpeedKmh).toBeCloseTo(72, 0);
});

it('should not record points while paused', async () => {
  const geo = setup();
  const { result } = renderHook(() => useRideRecorder(), { wrapper });

  await act(async () => {
    await result.current.start();
  });

  act(() => {
    result.current.pause();
  });

  act(() => {
    geo.firePosition(makePosition(makeCoords({ accuracy: 8 })));
  });

  const gpsPoints = result.current.points.filter(
    (p) => !('gap' in p && (p as { gap: boolean }).gap)
  );
  expect(gpsPoints.length).toBe(0);
});
