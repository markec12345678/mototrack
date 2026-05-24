/**
 * WMO weather interpretation code → Slovenian label + emoji icon.
 * Mirrors the mapping used in WeatherSnapshot for consistency.
 */
function wmoToLabelAndIcon(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Jasno', icon: '☀️' };
  if (code <= 2) return { label: 'Delno oblačno', icon: '⛅' };
  if (code === 3) return { label: 'Oblačno', icon: '☁️' };
  if (code <= 49) return { label: 'Megla', icon: '🌫️' };
  if (code <= 59) return { label: 'Rosenje', icon: '🌦️' };
  if (code <= 69) return { label: 'Dež', icon: '🌧️' };
  if (code <= 79) return { label: 'Sneg', icon: '❄️' };
  if (code <= 84) return { label: 'Plohe', icon: '🌧️' };
  if (code <= 95) return { label: 'Nevihta', icon: '⛈️' };
  return { label: 'Nevihta s točo', icon: '⛈️' };
}

export type PlainForecastDay = {
  /**
   * ISO date string, e.g. "2024-06-01".
   */
  date: string;

  /**
   * Minimum temperature in Celsius.
   */
  tempMinC: number;

  /**
   * Maximum temperature in Celsius.
   */
  tempMaxC: number;

  /**
   * Total precipitation in millimetres.
   */
  precipMm: number;

  /**
   * Maximum wind speed in km/h.
   */
  windKmh: number;

  /**
   * WMO weather interpretation code.
   */
  wmoCode: number;

  /**
   * Human-readable weather label (Slovenian).
   */
  label: string;

  /**
   * Emoji icon representing the weather condition.
   */
  icon: string;
};

export class ForecastDay {
  constructor(
    /**
     * ISO date string, e.g. "2024-06-01".
     */
    readonly date: string,

    /**
     * Minimum temperature in Celsius.
     */
    readonly tempMinC: number,

    /**
     * Maximum temperature in Celsius.
     */
    readonly tempMaxC: number,

    /**
     * Total precipitation in millimetres.
     */
    readonly precipMm: number,

    /**
     * Maximum wind speed in km/h.
     */
    readonly windKmh: number,

    /**
     * WMO weather interpretation code.
     */
    readonly wmoCode: number,

    /**
     * Human-readable weather label (Slovenian).
     */
    readonly label: string,

    /**
     * Emoji icon representing the weather condition.
     */
    readonly icon: string,
  ) {}

  /**
   * Virtual `id` property — returns the date string as the unique identifier.
   */
  get id(): string {
    return this.date;
  }

  /**
   * Serialize the ForecastDay into a plain object.
   */
  toObject(): PlainForecastDay & { id: string } {
    return {
      id: this.id,
      date: this.date,
      tempMinC: this.tempMinC,
      tempMaxC: this.tempMaxC,
      precipMm: this.precipMm,
      windKmh: this.windKmh,
      wmoCode: this.wmoCode,
      label: this.label,
      icon: this.icon,
    };
  }

  /**
   * Create a ForecastDay from a plain object.
   */
  static from(plain: PlainForecastDay): ForecastDay {
    const { label, icon } = wmoToLabelAndIcon(plain.wmoCode ?? 0);
    return new ForecastDay(
      plain.date ?? '',
      plain.tempMinC ?? 0,
      plain.tempMaxC ?? 0,
      plain.precipMm ?? 0,
      plain.windKmh ?? 0,
      plain.wmoCode ?? 0,
      plain.label ?? label,
      plain.icon ?? icon,
    );
  }

  /**
   * Parse an Open-Meteo daily forecast response into an array of ForecastDay instances.
   *
   * Expects the `daily` block from the Open-Meteo `/v1/forecast` response:
   * ```json
   * {
   *   "daily": {
   *     "time": ["2024-06-01", ...],
   *     "temperature_2m_min": [10.5, ...],
   *     "temperature_2m_max": [22.3, ...],
   *     "precipitation_sum": [0.0, ...],
   *     "windspeed_10m_max": [15.2, ...],
   *     "weathercode": [1, ...]
   *   }
   * }
   * ```
   */
  static fromOpenMeteoDaily(json: Record<string, unknown>): ForecastDay[] {
    const daily = (json['daily'] ?? {}) as Record<string, unknown[]>;

    const times: string[] = (daily['time'] as string[] | undefined) ?? [];
    const tempMins: number[] = (daily['temperature_2m_min'] as number[] | undefined) ?? [];
    const tempMaxs: number[] = (daily['temperature_2m_max'] as number[] | undefined) ?? [];
    const precips: number[] = (daily['precipitation_sum'] as number[] | undefined) ?? [];
    const winds: number[] = (daily['windspeed_10m_max'] as number[] | undefined) ?? [];
    const wmoCodes: number[] = (daily['weathercode'] as number[] | undefined) ?? [];

    return times.map((date, i) => {
      const wmoCode = wmoCodes[i] ?? 0;
      const { label, icon } = wmoToLabelAndIcon(wmoCode);
      return new ForecastDay(
        date ?? '',
        tempMins[i] ?? 0,
        tempMaxs[i] ?? 0,
        precips[i] ?? 0,
        winds[i] ?? 0,
        wmoCode,
        label,
        icon,
      );
    });
  }
}
