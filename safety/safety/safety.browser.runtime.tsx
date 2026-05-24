import React from 'react';
import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { SafetyPage } from '@markec/safety.pages.safety-page';
import { HazardReportButton } from '@markec/safety.ui.hazard-report-button';
import { CrashCountdownAlert } from '@markec/safety.ui.crash-countdown-alert';
import { HazardMarkersLayer } from '@markec/safety.ui.hazard-markers-layer';
import { SpeedCameraLayer } from '@markec/safety.ui.speed-camera-layer';
import type { SafetyConfig } from './safety-config.js';

export class SafetyBrowser {
  constructor(private config: SafetyConfig) {}

  /**
   * read the active safety browser config.
   */
  getConfig(): SafetyConfig {
    return this.config;
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: SafetyConfig = {
    defaultRadiusKm: 50,
  };

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: SafetyConfig
  ) {
    const safety = new SafetyBrowser(config);

    /**
     * /safety route — the multi-tab Safety center page.
     */
    mototrackPlatform.registerRoute([
      {
        path: '/safety',
        component: () => <SafetyPage />,
        requiresAuth: true,
      },
    ]);

    /**
     * 'Varnost' secondary navigation item.
     */
    mototrackPlatform.registerNavigationItem([
      {
        key: 'safety',
        label: 'Varnost',
        icon: '🆘',
        path: '/safety',
        order: 13,
        primary: false,
      },
    ]);

    /**
     * Hazard report button — anchored overlay on the map.
     */
    mototrackPlatform.registerMapOverlay([
      {
        key: 'hazard-report-button',
        component: () => <HazardReportButton />,
      },
    ]);

    /**
     * Crash countdown alert — a system-level safety alert displayed when
     * the crash-detection hook reports a fresh event.
     */
    mototrackPlatform.registerSafetyAlert([
      {
        key: 'crash-countdown-alert',
        component: () => <CrashCountdownAlert />,
      },
    ]);

    /**
     * Hazard markers layer — on by default. Renders all live hazards on top
     * of the map.
     */
    mototrackPlatform.registerMapLayer([
      {
        key: 'hazard-markers',
        label: 'Nevarnosti',
        icon: '⚠️',
        defaultOn: true,
        component: () => <HazardMarkersLayer />,
      },
      {
        key: 'speed-cameras',
        label: 'Radarji',
        icon: '📷',
        defaultOn: true,
        component: () => <SpeedCameraLayer />,
      },
    ]);

    return safety;
  }
}

export default SafetyBrowser;
