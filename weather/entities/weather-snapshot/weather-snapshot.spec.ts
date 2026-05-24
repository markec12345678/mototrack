import { describe, it, expect } from 'vitest';
import { WeatherSnapshot, resolveWmo } from './weather-snapshot.js';
import { mockWeatherSnapshot, mockWeatherSnapshots } from './weather-snapshot.mock.js';
import type { OpenMeteoCurrent } from './weather-snapshot.js';

// ---------------------------------------------------------------------------
// resolveWmo
// ---------------------------------------------------------------------------

describe('resolveWmo', () => {
  it('returns ☀️ and Slovenian label for WMO code 0 (clear sky)', () => {
    const { label, icon } = resolveWmo(0);
    expect(label).toBe('Jasno');
    expect(icon).toBe('☀️');
  });

  it('returns ⛅ for WMO code 2 (partly cloudy)', () => {
    const { icon } = resolveWmo(2);
    expect(icon).toBe('⛅');
  });

  it('returns 🌧️ for WMO code 63 (moderate rain)', () => {
    const { icon } = resolveWmo(63);
    expect(icon).toBe('🌧️');
  });

  it('returns ⛈️ for WMO code 95 (thunderstorm)', () => {
    const { icon } = resolveWmo(95);
    expect(icon).toBe('⛈️');
  });

  it('returns ❄️ for WMO code 73 (moderate snow)', () => {
    const { icon } = resolveWmo(73);
    expect(icon).toBe('❄️');
  });

  it('returns 🌫️ for WMO code 45 (fog)', () => {
    const { icon } = resolveWmo(45);
    expect(icon).toBe('🌫️');
  });

  it('returns fallback entry for unknown WMO code', () => {
    const { label, icon } = resolveWmo(999);
    expect(label).toBe('Neznano');
    expect(icon).toBe('🌡️');
  });
});

// ---------------------------------------------------------------------------
// WeatherSnapshot.from
// ---------------------------------------------------------------------------

describe('WeatherSnapshot.from', () => {
  it('creates an instance from a plain object', () => {
    const snapshot = mockWeatherSnapshot();
    expect(snapshot).toBeInstanceOf(WeatherSnapshot);
  });

  it('exposes all expected properties', () => {
    const snapshot = mockWeatherSnapshot({ tempC: 25, wmoCode: 0 });
    expect(snapshot.tempC).toBe(25);
    expect(snapshot.wmoCode).toBe(0);
    expect(snapshot.label).toBeTruthy();
    expect(snapshot.icon).toBeTruthy();
  });

  it('toObject() round-trips correctly', () => {
    const snapshot = mockWeatherSnapshot();
    const plain = snapshot.toObject();
    const restored = WeatherSnapshot.from(plain);
    expect(restored.toObject()).toEqual(plain);
  });

  it('toObject() includes an id field', () => {
    const snapshot = mockWeatherSnapshot();
    const plain = snapshot.toObject();
    expect(plain.id).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// WeatherSnapshot.fromOpenMeteoCurrent
// ---------------------------------------------------------------------------

describe('WeatherSnapshot.fromOpenMeteoCurrent', () => {
  const sampleResponse: OpenMeteoCurrent = {
    current: {
      time: '2024-06-10T12:00',
      temperature_2m: 18.5,
      apparent_temperature: 17.0,
      wind_speed_10m: 20,
      wind_direction_10m: 180,
      wind_gusts_10m: 35,
      relative_humidity_2m: 70,
      visibility: 15000,
      precipitation: 0.5,
      weather_code: 61,
    },
  };

  it('parses temperature correctly', () => {
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(sampleResponse);
    expect(snapshot.tempC).toBe(18.5);
    expect(snapshot.feelsLikeC).toBe(17.0);
  });

  it('converts visibility from metres to km', () => {
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(sampleResponse);
    expect(snapshot.visibilityKm).toBe(15);
  });

  it('maps WMO code 61 to rain label and icon', () => {
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(sampleResponse);
    expect(snapshot.wmoCode).toBe(61);
    expect(snapshot.label).toBe('Rahel dež');
    expect(snapshot.icon).toBe('🌧️');
  });

  it('derives unix timestamp from time string', () => {
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(sampleResponse);
    expect(snapshot.ts).toBeGreaterThan(0);
  });

  it('uses time string as id', () => {
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(sampleResponse);
    expect(snapshot.id).toBe('2024-06-10T12:00');
  });

  it('handles missing optional fields gracefully', () => {
    const minimal: OpenMeteoCurrent = {
      current: { time: '2024-06-10T12:00' },
    };
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(minimal);
    expect(snapshot.tempC).toBe(0);
    expect(snapshot.gustKmh).toBeUndefined();
    expect(snapshot.wmoCode).toBe(0);
  });

  it('handles completely empty current object gracefully', () => {
    const empty = { current: {} } as OpenMeteoCurrent;
    const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(empty);
    expect(snapshot).toBeInstanceOf(WeatherSnapshot);
  });
});

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

describe('mockWeatherSnapshots', () => {
  it('returns an array of WeatherSnapshot instances', () => {
    const snapshots = mockWeatherSnapshots();
    expect(snapshots.length).toBeGreaterThan(0);
    snapshots.forEach((s) => expect(s).toBeInstanceOf(WeatherSnapshot));
  });

  it('covers multiple weather conditions', () => {
    const snapshots = mockWeatherSnapshots();
    const codes = snapshots.map((s) => s.wmoCode);
    expect(codes).toContain(0);   // clear
    expect(codes).toContain(63);  // rain
    expect(codes).toContain(95);  // thunder
    expect(codes).toContain(73);  // snow
    expect(codes).toContain(45);  // fog
  });
});
