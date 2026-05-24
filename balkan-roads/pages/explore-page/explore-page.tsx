import React, { useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { TourCard } from '@markec/balkan-roads.ui.tour-card';
import { CountryBrowser } from '@markec/balkan-roads.ui.country-browser';
import { useIconicTours } from '@markec/balkan-roads.hooks.use-iconic-tours';
import type { TabItem } from '@markec/mototrack-design.navigation.tabs';
import type { TourCardTour } from '@markec/balkan-roads.ui.tour-card';
import styles from './explore-page.module.scss';

const HERO_IMAGE_URL = `https://storage.googleapis.com/bit-generated-images/images/image_aerial_panoramic_view_of_drama_0_1779627115630.png`;

const BALKAN_COUNTRIES = [
  { code: `SI`, label: `Slovenija` },
  { code: `HR`, label: `Hrvaška` },
  { code: `BA`, label: `Bosna` },
  { code: `ME`, label: `Črna gora` },
  { code: `RS`, label: `Srbija` },
  { code: `MK`, label: `Makedonija` },
  { code: `AL`, label: `Albanija` },
  { code: `BG`, label: `Bolgarija` },
  { code: `RO`, label: `Romunija` },
  { code: `GR`, label: `Grčija` },
];

const DIFFICULTIES = [`Easy`, `Moderate`, `Hard`, `Expert`];

const TAB_ITEMS: TabItem[] = [
  {
    key: `tours`,
    label: `Ikonične ture`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    key: `roads`,
    label: `Balkanske ceste`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l3-10 3 5 3-8 3 5 3-8 3 10" />
      </svg>
    ),
  },
  {
    key: `community`,
    label: `Skupnostne rute`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export type ExplorePageProps = {
  /**
   * Optional mock tours data for testing/SSR.
   */
  mockTours?: TourCardTour[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={classNames(styles.filterChip, { [styles.filterChipActive]: active })}
      onClick={() => onClick()}
    >
      {label}
    </button>
  );
}

function ToursTab({ mockTours }: { mockTours?: TourCardTour[] }) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const { tours: fetchedTours, loading } = useIconicTours({
    country: selectedCountry ?? undefined,
    difficulty: selectedDifficulty ?? undefined,
  });

  const tours: TourCardTour[] = mockTours ?? (fetchedTours as TourCardTour[]) ?? [];

  const filteredTours = mockTours
    ? tours.filter((t) => {
        const countryMatch = !selectedCountry || t.country === selectedCountry;
        const difficultyMatch = !selectedDifficulty || t.difficulty === selectedDifficulty;
        return countryMatch && difficultyMatch;
      })
    : tours;

  return (
    <div className={styles.toursTab}>
      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Država</span>
          <div className={styles.filterChips}>
            {BALKAN_COUNTRIES.map((c) => (
              <FilterChip
                key={c.code}
                label={c.label}
                active={selectedCountry === c.code}
                onClick={() => setSelectedCountry(selectedCountry === c.code ? null : c.code)}
              />
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Težavnost</span>
          <div className={styles.filterChips}>
            {DIFFICULTIES.map((d) => (
              <FilterChip
                key={d}
                label={d}
                active={selectedDifficulty === d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading && !mockTours && (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      )}

      {!loading && filteredTours.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏍️</div>
          <p className={styles.emptyTitle}>Ni najdenih tur</p>
          <p className={styles.emptySubtitle}>Poskusite spremeniti filtre ali preverite pozneje.</p>
        </div>
      )}

      {filteredTours.length > 0 && (
        <div className={styles.toursGrid}>
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}

function RoadsTab() {
  return (
    <div className={styles.roadsTab}>
      <CountryBrowser
        title="Balkanske ceste"
        subtitle="Raziščite najboljše motociklistične ceste na Balkanu, razvrščene po državah."
      />
    </div>
  );
}

function CommunityTab() {
  return (
    <div className={styles.communityTab}>
      <div className={styles.communityCard}>
        <div className={styles.communityBadge}>
          <span className={styles.communityBadgeDot} />
          <span className={styles.communityBadgeLabel}>Kmalu na voljo</span>
        </div>
        <div className={styles.communityIcon}>🤝</div>
        <Heading level={2} size="xl" color="primary" className={styles.communityTitle}>
          Skupnostne rute
        </Heading>
        <p className={styles.communityDescription}>
          Delite svoje najljubše poti z motociklistično skupnostjo. Ustvarite, ocenite in odkrijte rute, ki so jih sestavili vozniki kot vi.
        </p>
        <div className={styles.communityFeatures}>
          {[
            { icon: `🗺️`, title: `Ustvari ruto`, desc: `Nariši svojo pot na interaktivnem zemljevidu` },
            { icon: `⭐`, title: `Oceni in komentiraj`, desc: `Deli izkušnje z drugimi motoristi` },
            { icon: `📍`, title: `Odkrivaj lokalno`, desc: `Najdi skrite dragulje v svoji okolici` },
          ].map((feature) => (
            <div key={feature.title} className={styles.communityFeatureCard}>
              <span className={styles.communityFeatureIcon}>{feature.icon}</span>
              <div>
                <p className={styles.communityFeatureTitle}>{feature.title}</p>
                <p className={styles.communityFeatureDesc}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className={styles.communityRegisterBtn}>
          Registriraj interes
        </button>
      </div>
    </div>
  );
}

export function ExplorePage({ mockTours, className, style }: ExplorePageProps) {
  const [activeTab, setActiveTab] = useState(`tours`);

  return (
    <div className={classNames(styles.explorePage, className)} style={style}>
      {/* Hero */}
      <div className={styles.hero}>
        <img
          src={HERO_IMAGE_URL}
          alt="Balkanske ceste"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Balkanske ceste</span>
          <h1 className={styles.heroTitle}>Razišči Balkan</h1>
          <p className={styles.heroSubtitle}>
            Ikonične ture, legendarne ceste in skupnostne rute za vsakega motorista.
          </p>
        </div>
      </div>

      {/* Tabs + Content */}
      <PageLayout padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-xl)">
        <div className={styles.tabsWrapper}>
          <Tabs
            items={TAB_ITEMS}
            activeKey={activeTab}
            onTabChange={(key) => setActiveTab(key)}
          />
        </div>

        <div className={styles.tabContent}>
          {activeTab === `tours` && <ToursTab mockTours={mockTours} />}
          {activeTab === `roads` && <RoadsTab />}
          {activeTab === `community` && <CommunityTab />}
        </div>
      </PageLayout>
    </div>
  );
}
