import { useMemo } from 'react';
import { BALKAN_COUNTRIES } from './balkan-bounding-boxes.js';
import { EMERGENCY_NUMBERS, EmergencyNumbers } from './emergency-numbers-data.js';

/**
 * A lat/lng coordinate pair.
 */
export type LatLng = {
  /** Latitude in decimal degrees */
  lat: number;
  /** Longitude in decimal degrees */
  lng: number;
};

/**
 * The result returned by useCountryFromLocation.
 */
export type CountryFromLocationResult = {
  /**
   * ISO 3166-1 alpha-2 country code (e.g. "HR", "SI", "RS"),
   * or null if the coordinates do not fall within any supported Balkan country.
   */
  country: string | null;

  /**
   * Unicode emoji flag for the detected country (e.g. "🇭🇷"),
   * or null if no country was detected.
   */
  flag: string | null;

  /**
   * Emergency contact numbers for the detected country,
   * or null if no country was detected.
   */
  emergencyNumbers: EmergencyNumbers | null;
};

/**
 * Options accepted by useCountryFromLocation.
 */
export type UseCountryFromLocationOptions = {
  /**
   * Optional mock result to bypass the bounding-box lookup entirely.
   * Useful for testing and Storybook compositions.
   */
  mockData?: CountryFromLocationResult;
};

/**
 * Performs a lightweight bounding-box reverse geocode lookup (no API call).
 * Maps a lat/lng coordinate pair to an ISO country code for one of the
 * 10 supported Balkan countries: SI, HR, BA, RS, ME, MK, AL, BG, RO, GR.
 *
 * @param location - The lat/lng coordinate to look up, or null/undefined to skip.
 * @param options - Optional configuration, including mockData for testing.
 * @returns An object containing the ISO country code, emoji flag, and emergency numbers.
 *
 * @example
 * const { country, flag, emergencyNumbers } = useCountryFromLocation({ lat: 45.81, lng: 15.98 });
 * // country → "HR", flag → "🇭🇷", emergencyNumbers → { police: "192", ... }
 */
export function useCountryFromLocation(
  location: LatLng | null | undefined,
  options?: UseCountryFromLocationOptions
): CountryFromLocationResult {
  const mockData = options?.mockData;

  const result = useMemo<CountryFromLocationResult>(() => {
    if (mockData) {
      return mockData;
    }

    if (!location) {
      return { country: null, flag: null, emergencyNumbers: null };
    }

    const { lat, lng } = location;

    const match = BALKAN_COUNTRIES.find(
      (entry) =>
        lat >= entry.bbox.minLat &&
        lat <= entry.bbox.maxLat &&
        lng >= entry.bbox.minLng &&
        lng <= entry.bbox.maxLng
    );

    if (!match) {
      return { country: null, flag: null, emergencyNumbers: null };
    }

    const emergencyNumbers = EMERGENCY_NUMBERS[match.code] ?? null;

    return {
      country: match.code,
      flag: match.flag,
      emergencyNumbers,
    };
  }, [location, mockData]);

  return result;
}
