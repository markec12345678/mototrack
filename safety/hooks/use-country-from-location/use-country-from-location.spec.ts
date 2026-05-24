import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCountryFromLocation } from './use-country-from-location.js';
import { mockLocations, mockResults } from './use-country-from-location.mock.js';

describe('useCountryFromLocation', () => {
  describe('bounding-box detection', () => {
    it('detects Slovenia (SI) from Ljubljana coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.SI)
      );

      expect(result.current.country).toBe('SI');
      expect(result.current.flag).toBe('🇸🇮');
      expect(result.current.emergencyNumbers).not.toBeNull();
    });

    it('detects Croatia (HR) from Zagreb coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.HR)
      );

      expect(result.current.country).toBe('HR');
      expect(result.current.flag).toBe('🇭🇷');
    });

    it('detects Bosnia and Herzegovina (BA) from Sarajevo coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.BA)
      );

      expect(result.current.country).toBe('BA');
      expect(result.current.flag).toBe('🇧🇦');
    });

    it('detects Serbia (RS) from Belgrade coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.RS)
      );

      expect(result.current.country).toBe('RS');
      expect(result.current.flag).toBe('🇷🇸');
    });

    it('detects Montenegro (ME) from Podgorica coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.ME)
      );

      expect(result.current.country).toBe('ME');
      expect(result.current.flag).toBe('🇲🇪');
    });

    it('detects North Macedonia (MK) from Skopje coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.MK)
      );

      expect(result.current.country).toBe('MK');
      expect(result.current.flag).toBe('🇲🇰');
    });

    it('detects Albania (AL) from Tirana coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.AL)
      );

      expect(result.current.country).toBe('AL');
      expect(result.current.flag).toBe('🇦🇱');
    });

    it('detects Bulgaria (BG) from Sofia coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.BG)
      );

      expect(result.current.country).toBe('BG');
      expect(result.current.flag).toBe('🇧🇬');
    });

    it('detects Romania (RO) from Bucharest coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.RO)
      );

      expect(result.current.country).toBe('RO');
      expect(result.current.flag).toBe('🇷🇴');
    });

    it('detects Greece (GR) from Athens coordinates', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.GR)
      );

      expect(result.current.country).toBe('GR');
      expect(result.current.flag).toBe('🇬🇷');
    });
  });

  describe('emergency numbers', () => {
    it('returns correct police number for Croatia', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.HR)
      );

      expect(result.current.emergencyNumbers?.police).toBe('192');
    });

    it('returns correct ambulance number for Slovenia', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.SI)
      );

      expect(result.current.emergencyNumbers?.ambulance).toBe('112');
    });

    it('always returns EU emergency number 112', () => {
      const countries = ['SI', 'HR', 'BA', 'RS', 'ME', 'MK', 'AL', 'BG', 'RO', 'GR'];

      for (const code of countries) {
        const { result } = renderHook(() =>
          useCountryFromLocation(mockLocations[code])
        );
        expect(result.current.emergencyNumbers?.eu).toBe('112');
      }
    });

    it('returns correct roadside assistance number for Greece', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.GR)
      );

      expect(result.current.emergencyNumbers?.assistance).toBe('10400');
    });
  });

  describe('null / unknown location handling', () => {
    it('returns all nulls when location is null', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(null)
      );

      expect(result.current.country).toBeNull();
      expect(result.current.flag).toBeNull();
      expect(result.current.emergencyNumbers).toBeNull();
    });

    it('returns all nulls when location is undefined', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(undefined)
      );

      expect(result.current.country).toBeNull();
      expect(result.current.flag).toBeNull();
      expect(result.current.emergencyNumbers).toBeNull();
    });

    it('returns all nulls for coordinates outside all Balkan bounding boxes', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(mockLocations.UNKNOWN)
      );

      expect(result.current.country).toBeNull();
      expect(result.current.flag).toBeNull();
      expect(result.current.emergencyNumbers).toBeNull();
    });
  });

  describe('mockData option', () => {
    it('returns mockData directly without performing a lookup', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(
          { lat: 0, lng: 0 },
          { mockData: mockResults.HR }
        )
      );

      expect(result.current.country).toBe('HR');
      expect(result.current.flag).toBe('🇭🇷');
      expect(result.current.emergencyNumbers?.police).toBe('192');
    });

    it('returns mockData even when location is null', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(null, { mockData: mockResults.SI })
      );

      expect(result.current.country).toBe('SI');
      expect(result.current.flag).toBe('🇸🇮');
    });

    it('returns null result when mockData explicitly contains nulls', () => {
      const { result } = renderHook(() =>
        useCountryFromLocation(
          mockLocations.HR,
          { mockData: mockResults.UNKNOWN }
        )
      );

      expect(result.current.country).toBeNull();
      expect(result.current.flag).toBeNull();
      expect(result.current.emergencyNumbers).toBeNull();
    });
  });
});
