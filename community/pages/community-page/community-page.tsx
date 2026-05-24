import React, { useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { LeaderboardTable } from '@markec/community.ui.leaderboard-table';
import { AchievementsGrid } from '@markec/community.ui.achievements-grid';
import { ChallengesList } from '@markec/community.ui.challenges-list';
import { FeedList } from '@markec/community.ui.feed-list';
import { CommunityRoutesGrid } from '@markec/community.ui.community-routes-grid';
import { FuelPricesBoard } from '@markec/community.ui.fuel-prices-board';
import { GroupRideChat } from '@markec/community.ui.group-ride-chat';
import styles from './community-page.module.scss';

export type CommunityTab =
  | `lestvica`
  | `dosezki`
  | `izzivi`
  | `feed`
  | `skupnostne-rute`
  | `cene-goriva`
  | `grupne-voznje`;

export type CommunityPageProps = {
  /**
   * Initially active tab key.
   */
  defaultTab?: CommunityTab;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const TAB_META: Record<CommunityTab, { eyebrow: string; title: string; subtitle: string }> = {
  lestvica: {
    eyebrow: `Skupnost`,
    title: `Lestvica`,
    subtitle: `Najboljši vozniki skupnosti po točkah, kilometrih in vožnjah.`,
  },
  dosezki: {
    eyebrow: `Tvoj napredek`,
    title: `Dosežki`,
    subtitle: `Odkleni dosežke z vožnjo in aktivnostjo v skupnosti.`,
  },
  izzivi: {
    eyebrow: `Aktivni izzivi`,
    title: `Izzivi`,
    subtitle: `Pridruži se izzivom, zberi XP in se povzpni na lestvici.`,
  },
  feed: {
    eyebrow: `Skupnost`,
    title: `Feed`,
    subtitle: `Zadnje aktivnosti voznikov — vožnje, poti, dosežki in komentarji.`,
  },
  'skupnostne-rute': {
    eyebrow: `Odkrivaj`,
    title: `Skupnostne rute`,
    subtitle: `Najboljše motociklistične poti Balkana, ki jih delijo vozniki.`,
  },
  'cene-goriva': {
    eyebrow: `Skupnostni podatki`,
    title: `Cene goriva`,
    subtitle: `Aktualne cene goriva po državah — poroča skupnost voznikov.`,
  },
  'grupne-voznje': {
    eyebrow: `Skupaj na pot`,
    title: `Grupne vožnje`,
    subtitle: `Pridruži se skupinski vožnji ali organiziraj svojo avanturo.`,
  },
};

function HeroStrip({ tab }: { tab: CommunityTab }) {
  const meta = TAB_META[tab];
  return (
    <div className={styles.heroStrip}>
      <p className={styles.eyebrow}>{meta.eyebrow}</p>
      <Heading level={1} size="2xl" className={styles.heroTitle}>
        {meta.title}
      </Heading>
      <p className={styles.heroSubtitle}>{meta.subtitle}</p>
    </div>
  );
}

function TabContent({ tab }: { tab: CommunityTab }) {
  if (tab === `lestvica`) {
    return (
      <div className={styles.tabContent}>
        <LeaderboardTable defaultPeriod="week" defaultSortBy="points" />
      </div>
    );
  }

  if (tab === `dosezki`) {
    return (
      <div className={styles.tabContent}>
        <AchievementsGrid />
      </div>
    );
  }

  if (tab === `izzivi`) {
    return (
      <div className={styles.tabContent}>
        <ChallengesList
          title="Aktivni izzivi"
          subtitle="Dokončaj izzive za XP točke in vzpni se na lestvici."
        />
      </div>
    );
  }

  if (tab === `feed`) {
    return (
      <div className={classNames(styles.tabContent, styles.tabContentNarrow)}>
        <FeedList />
      </div>
    );
  }

  if (tab === `skupnostne-rute`) {
    return (
      <div className={classNames(styles.tabContent, styles.tabContentFluid)}>
        <CommunityRoutesGrid />
      </div>
    );
  }

  if (tab === `cene-goriva`) {
    return (
      <div className={styles.tabContent}>
        <FuelPricesBoard />
      </div>
    );
  }

  if (tab === `grupne-voznje`) {
    return (
      <div className={classNames(styles.tabContent, styles.tabContentChat)}>
        <div className={styles.chatIntro}>
          <div className={styles.chatIntroIcon}>🏍️</div>
          <div className={styles.chatIntroText}>
            <h2 className={styles.chatIntroTitle}>Grupne vožnje v živo</h2>
            <p className={styles.chatIntroSub}>
              Koordiniraj skupinsko vožnjo, deli lokacijo in komuniciraj z vozniki v realnem času.
            </p>
          </div>
        </div>
        <div className={styles.chatPanel}>
          <GroupRideChat
            rideId="ride-community-1"
            rideName="Vršič Adventure Ride"
            currentUserId="me"
          />
        </div>
      </div>
    );
  }

  return null;
}

/**
 * CommunityPage — the /community page with seven tabs:
 * Lestvica, Dosežki, Izzivi, Feed, Skupnostne rute, Cene goriva, Grupne vožnje.
 */
export function CommunityPage({
  defaultTab = `lestvica`,
  className,
  style,
}: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState<CommunityTab>(defaultTab);

  const tabItems = [
    { key: `lestvica`, label: `Lestvica`, icon: <span>🏆</span> },
    { key: `dosezki`, label: `Dosežki`, icon: <span>🎖️</span> },
    { key: `izzivi`, label: `Izzivi`, icon: <span>⚡</span> },
    { key: `feed`, label: `Feed`, icon: <span>📡</span> },
    { key: `skupnostne-rute`, label: `Skupnostne rute`, icon: <span>🗺️</span> },
    { key: `cene-goriva`, label: `Cene goriva`, icon: <span>⛽</span> },
    { key: `grupne-voznje`, label: `Grupne vožnje`, icon: <span>🏍️</span> },
  ];

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          <Tabs
            items={tabItems}
            activeKey={activeTab}
            onTabChange={(key) => setActiveTab(key as CommunityTab)}
          />
        </div>
      </div>

      <PageLayout
        maxWidth="1280px"
        padding="var(--spacing-xl) var(--layout-gutter)"
        gap="var(--spacing-xl)"
      >
        <HeroStrip tab={activeTab} />
        <TabContent tab={activeTab} />
      </PageLayout>
    </div>
  );
}
