/**
 * WMO Weather interpretation codes (WW)
 * https://www.meteomatics.com/en/api/weather-api/wmo-weather-interpretation-codes/
 */
export const WMO_CODES: { [key: number]: { label: string; icon: string } } = {
  0: { label: 'Jasno', icon: 'clear-sky' },
  1: { label: 'Pretežno jasno', icon: 'mainly-clear' },
  2: { label: 'Delno oblačno', icon: 'partly-cloudy' },
  3: { label: 'Oblačno', icon: 'overcast' },
  45: { label: 'Megla', icon: 'fog' },
  48: { label: 'Še vedno megla', icon: 'depositing-rime-fog' },
  51: { label: 'Rošenje, rahlo', icon: 'drizzle-light' },
  53: { label: 'Rošenje, zmerno', icon: 'drizzle-moderate' },
  55: { label: 'Rošenje, močno', icon: 'drizzle-dense' },
  56: { label: 'Zamrzujoče rošenje, rahlo', icon: 'freezing-drizzle-light' },
  57: { label: 'Zamrzujoče rošenje, močno', icon: 'freezing-drizzle-dense' },
  61: { label: 'Dež, rahlo', icon: 'rain-light' },
  63: { label: 'Dež, zmerno', icon: 'rain-moderate' },
  65: { label: 'Dež, močno', icon: 'rain-heavy' },
  66: { label: 'Zamrzujoč dež, rahlo', icon: 'freezing-rain-light' },
  67: { label: 'Zamrzujoč dež, močno', icon: 'freezing-rain-heavy' },
  71: { label: 'Sneženje, rahlo', icon: 'snow-light' },
  73: { label: 'Sneženje, zmerno', icon: 'snow-moderate' },
  75: { label: 'Sneženje, močno', icon: 'snow-heavy' },
  77: { label: 'Snežna zrna', icon: 'snow-grains' },
  80: { label: 'Plohe, rahlo', icon: 'rain-showers-light' },
  81: { label: 'Plohe, zmerno', icon: 'rain-showers-moderate' },
  82: { label: 'Plohe, močno', icon: 'rain-showers-violent' },
  85: { label: 'Snežne plohe, rahlo', icon: 'snow-showers-light' },
  86: { label: 'Snežne plohe, močno', icon: 'snow-showers-heavy' },
  95: { label: 'Nevihta, rahlo ali zmerno', icon: 'thunderstorm-light' },
  96: { label: 'Nevihta z rahlo točo', icon: 'thunderstorm-with-slight-hail' },
  99: { label: 'Nevihta z močno točo', icon: 'thunderstorm-with-heavy-hail' },
};

export const UNKNOWN_WMO_CODE = { label: 'Neznano', icon: 'unknown' };

/**
 * Returns the label and icon for a given WMO weather code.
 * @param wmoCode - The WMO weather code.
 * @returns An object containing the label and icon for the WMO code.
 */
export function getWmoDescription(wmoCode: number): { label: string; icon: string } {
  return WMO_CODES[wmoCode] || UNKNOWN_WMO_CODE;
}