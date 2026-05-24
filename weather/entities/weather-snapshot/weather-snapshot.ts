/**
 * WMO Weather Interpretation Code mapping to Slovenian label and emoji icon.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
export type WmoEntry = {
  label: string;
  icon: string;
};

const WMO_MAP: Record<number, WmoEntry> = {
  0:  { label: 'Jasno',                    icon: '☀️'  },
  1:  { label: 'Pretežno jasno',           icon: '🌤️' },
  2:  { label: 'Delno oblačno',            icon: '⛅'  },
  3:  { label: 'Oblačno',                  icon: '☁️'  },
  45: { label: 'Megla',                    icon: '🌫️' },
  48: { label: 'Ivjasta megla',            icon: '🌫️' },
  51: { label: 'Rahla rosica',             icon: '🌦️' },
  53: { label: 'Zmerna rosica',            icon: '🌦️' },
  55: { label: 'Gosta rosica',             icon: '🌧️' },
  56: { label: 'Ledena rosica (rahla)',     icon: '🌨️' },
  57: { label: 'Ledena rosica (gosta)',     icon: '🌨️' },
  61: { label: 'Rahel dež',                icon: '🌧️' },
  63: { label: 'Zmeren dež',               icon: '🌧️' },
  65: { label: 'Močan dež',                icon: '🌧️' },
  66: { label: 'Ledeni dež (rahel)',        icon: '🌨️' },
  67: { label: 'Ledeni dež (močan)',        icon: '🌨️' },
  71: { label: 'Rahel sneg',               icon: '❄️'  },
  73: { label: 'Zmeren sneg',              icon: '❄️'  },
  75: { label: 'Močan sneg',               icon: '❄️'  },
  77: { label: 'Snežna zrna',              icon: '❄️'  },
  80: { label: 'Rahli plohi',              icon: '🌦️' },
  81: { label: 'Zmerni plohi',             icon: '🌧️' },
  82: { label: 'Močni plohi',              icon: '🌧️' },
  85: { label: 'Snežni plohi (rahli)',      icon: '🌨️' },
  86: { label: 'Snežni plohi (močni)',      icon: '🌨️' },
  95: { label: 'Nevihta',                  icon: '⛈️'  },
  96: { label: 'Nevihta s točo (rahla)',    icon: '⛈️'  },
  99: { label: 'Nevihta s točo (močna)',    icon: '⛈️'  },
};

const FALLBACK_WMO: WmoEntry = { label: 'Neznano', icon: '🌡️' };

/**
 * Resolves a WMO code to its Slovenian label and emoji icon.
 */
export function resolveWmo(code: number): WmoEntry {
  return WMO_MAP[code] ?? FALLBACK_WMO;
}

// ---------------------------------------------------------------------------
// Plain object type (matches GraphQL WeatherSnapshot type)
// ---------------------------------------------------------------------------

export type PlainWeatherSnapshot = {
  /** Unique snapshot identifier (ISO timestamp string). */
  id: string;
  /** Air temperature in °C. */
  tempC: number;
  /** Feels-like temperature in °C. */
  feelsLikeC: number;
  /** Wind speed in km/h. */
  windKmh: number;
  /** Wind direction in degrees. */
  windDirDeg: number;
  /** Wind gust speed in km/h (optional). */
  gustKmh?: number;
  /** Relative humidity in %. */
  humidity: number;
  /** Visibility in km. */
  visibilityKm: number;
  /** Precipitation rate in mm/h. */
  precipMmH: number;
  /** WMO weather interpretation code. */
  wmoCode: number;
  /** Slovenian weather label derived from WMO code. */
  label: string;
  /** Emoji icon derived from WMO code. */
  icon: string;
  /** Unix timestamp (seconds). */
  ts: number;
};

// ---------------------------------------------------------------------------
// Open-Meteo API response shape (partial — only fields we consume)
// ---------------------------------------------------------------------------

export type OpenMeteoCurrent = {
  current: {
    time: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    wind_gusts_10m?: number;
    relative_humidity_2m?: number;
    visibility?: number;
    precipitation?: number;
    weather_code?: number;
  };
};

// ---------------------------------------------------------------------------
// Entity
// ---------------------------------------------------------------------------

export class WeatherSnapshot {
  constructor(
    /** Unique snapshot identifier (ISO timestamp string used as ID). */
    readonly id: string,
    /** Air temperature in °C. */
    readonly tempC: number,
    /** Feels-like temperature in °C. */
    readonly feelsLikeC: number,
    /** Wind speed in km/h. */
    readonly windKmh: number,
    /** Wind direction in degrees. */
    readonly windDirDeg: number,
    /** Wind gust speed in km/h. */
    readonly gustKmh: number | undefined,
    /** Relative humidity in %. */
    readonly humidity: number,
    /** Visibility in km. */
    readonly visibilityKm: number,
    /** Precipitation rate in mm/h. */
    readonly precipMmH: number,
    /** WMO weather interpretation code. */
    readonly wmoCode: number,
    /** Slovenian weather label derived from WMO code. */
    readonly label: string,
    /** Emoji icon derived from WMO code. */
    readonly icon: string,
    /** Unix timestamp (seconds). */
    readonly ts: number,
  ) {}

  /**
   * Serialize the entity into a plain object.
   */
  toObject(): PlainWeatherSnapshot {
    return {
      id: this.id,
      tempC: this.tempC,
      feelsLikeC: this.feelsLikeC,
      windKmh: this.windKmh,
      windDirDeg: this.windDirDeg,
      gustKmh: this.gustKmh,
      humidity: this.humidity,
      visibilityKm: this.visibilityKm,
      precipMmH: this.precipMmH,
      wmoCode: this.wmoCode,
      label: this.label,
      icon: this.icon,
      ts: this.ts,
    };
  }

  /**
   * Create a WeatherSnapshot from a plain object.
   */
  static from(plain: PlainWeatherSnapshot): WeatherSnapshot {
    const { label, icon } = resolveWmo(plain.wmoCode ?? 0);
    return new WeatherSnapshot(
      plain.id ?? new Date(plain.ts * 1000).toISOString(),
      plain.tempC ?? 0,
      plain.feelsLikeC ?? 0,
      plain.windKmh ?? 0,
      plain.windDirDeg ?? 0,
      plain.gustKmh,
      plain.humidity ?? 0,
      plain.visibilityKm ?? 0,
      plain.precipMmH ?? 0,
      plain.wmoCode ?? 0,
      plain.label ?? label,
      plain.icon ?? icon,
      plain.ts ?? 0,
    );
  }

  /**
   * Parse the JSON response from Open-Meteo
   * `/v1/forecast?current=temperature_2m,apparent_temperature,...`
   * and return a WeatherSnapshot entity.
   */
  static fromOpenMeteoCurrent(json: OpenMeteoCurrent): WeatherSnapshot {
    const {
      time = '',
      temperature_2m = 0,
      apparent_temperature = 0,
      wind_speed_10m = 0,
      wind_direction_10m = 0,
      wind_gusts_10m,
      relative_humidity_2m = 0,
      visibility = 0,
      precipitation = 0,
      weather_code = 0,
    } = json?.current ?? {};

    const ts = time ? Math.floor(new Date(time).getTime() / 1000) : 0;
    const id = time || new Date(ts * 1000).toISOString();
    const { label, icon } = resolveWmo(weather_code);

    return new WeatherSnapshot(
      id,
      temperature_2m,
      apparent_temperature,
      wind_speed_10m,
      wind_direction_10m,
      wind_gusts_10m,
      relative_humidity_2m,
      visibility / 1000, // Open-Meteo returns metres; convert to km
      precipitation,
      weather_code,
      label,
      icon,
      ts,
    );
  }
}
