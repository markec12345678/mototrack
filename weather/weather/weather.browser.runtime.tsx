import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { WeatherPanel } from '@markec/weather.ui.weather-panel';
import { CrosswindAlert } from '@markec/weather.ui.crosswind-alert';
import type { WeatherConfig } from './weather-config.js';

/**
 * Default GPS location used for the floating weather panel when no
 * track / rider position is provided. Centered on Ljubljana, SI.
 */
const DEFAULT_LOCATION = { lat: 46.0569, lng: 14.5058 };

/**
 * Default rider heading used for the safety alert when no real
 * heading is available yet.
 */
const DEFAULT_HEADING_DEG = 0;

function WeatherMapOverlay() {
  return <WeatherPanel variant="compact" location={DEFAULT_LOCATION} />;
}

function CrosswindSafetyAlert() {
  return <CrosswindAlert headingDeg={DEFAULT_HEADING_DEG} />;
}

export class WeatherBrowser {
  constructor(private config: WeatherConfig) {}

  /**
   * read the runtime config of the weather aspect.
   */
  getConfig(): WeatherConfig {
    return this.config;
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: WeatherConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: WeatherConfig
  ) {
    const weather = new WeatherBrowser(config);

    /**
     * register the floating weather panel as a top-right map overlay.
     */
    mototrackPlatform.registerMapOverlay([
      {
        key: 'weather-panel',
        position: 'top-right',
        component: WeatherMapOverlay,
      },
    ]);

    /**
     * register the crosswind alert as a safety overlay.
     */
    mototrackPlatform.registerSafetyAlert([
      {
        key: 'crosswind-alert',
        component: CrosswindSafetyAlert,
      },
    ]);

    return weather;
  }
}

export default WeatherBrowser;
