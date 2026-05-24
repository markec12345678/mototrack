import React from 'react';
import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { CommunityPage } from '@markec/community.pages.community-page';
import { LeaderboardDashboardPanel } from '@markec/community.ui.leaderboard-dashboard-panel';
import type { CommunityConfig } from './community-config.js';

export class CommunityBrowser {
  constructor(private config: CommunityConfig) {}

  /**
   * Configuration applied to the browser runtime — exposed for downstream
   * aspects that want to introspect the active community settings.
   */
  getConfig(): CommunityConfig {
    return this.config;
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: CommunityConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: CommunityConfig
  ) {
    const community = new CommunityBrowser(config);

    /**
     * register the /community route. CommunityPage renders the
     * 7 community tabs (Lestvica, Dosežki, Izzivi, Feed, Skupnostne rute,
     * Cene goriva, Grupne vožnje).
     */
    mototrackPlatform.registerRoute([
      {
        path: '/community',
        component: () => <CommunityPage />,
      },
    ]);

    /**
     * register the 'Skupnost' navigation item — primary item displayed in
     * the sidebar and bottom-nav with the 👥 icon.
     */
    mototrackPlatform.registerNavigationItem([
      {
        key: 'community',
        label: 'Skupnost',
        icon: '👥',
        path: '/community',
        order: 5,
        primary: true,
      },
    ]);

    /**
     * register the leaderboard dashboard panel — top 5 weekly riders.
     */
    mototrackPlatform.registerDashboardPanel([
      {
        key: 'community-leaderboard',
        title: 'Lestvica',
        component: () => (
          <LeaderboardDashboardPanel fullLeaderboardHref="/community" />
        ),
      },
    ]);

    return community;
  }
}

export default CommunityBrowser;
