import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { Card } from '@markec/mototrack-design.content.card';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Button } from '@markec/mototrack-design.actions.button';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import { useCommunityRoutes } from '@markec/community.hooks.use-community-routes';
import type { CommunityRoute } from '@markec/community.entities.community-route';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import styles from './community-routes-grid.module.scss';

export type SortOption = 'popularity' | 'recent' | 'distance';
export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard' | 'expert';
export type CountryFilter = 'all' | string;

export type CommunityRoutesGridProps = {
  /**
   * Initial country filter value.
   */
  initialCountry?: CountryFilter;

  /**
   * Initial difficulty filter value.
   */
  initialDifficulty?: DifficultyFilter;

  /**
   * Initial sort option.
   */
  initialSort?: SortOption;

  /**
   * Callback fired when the user clicks 'Naloži v Načrtuj' for a route.
   */
  onLoadRoute?: (route: CommunityRoute) => void;

  /**
   * Optional mock routes for testing/compositions.
   */
  routes?: CommunityRoute[];

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

const COUNTRY_OPTIONS: Array<{ value: CountryFilter; label: string }> = [
  { value: 'all', label: 'Vse države' },
  { value: 'SI', label: 'Slovenija' },
  { value: 'HR', label: 'Hrvaška' },
  { value: 'BA', label: 'BiH' },
  { value: 'ME', label: 'Črna Gora' },
  { value: 'RS', label: 'Srbija' },
  { value: 'MK', label: 'Makedonija' },
  { value: 'AL', label: 'Albanija' },
  { value: 'BG', label: 'Bolgarija' },
  { value: 'RO', label: 'Romunija' },
  { value: 'GR', label: 'Grčija' },
];

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyFilter; label: string }> = [
  { value: 'all', label: 'Vse težavnosti' },
  { value: 'easy', label: 'Lahka' },
  { value: 'medium', label: 'Srednja' },
  { value: 'hard', label: 'Težka' },
  { value: 'expert', label: 'Expert' },
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popularity', label: 'Priljubljenost' },
  { value: 'recent', label: 'Najnovejše' },
  { value: 'distance', label: 'Razdalja' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.starRating} aria-label={`Ocena: ${rating.toFixed(1)}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={classNames(styles.star, {
            [styles.starFull]: star <= Math.floor(rating),
            [styles.starHalf]: star === Math.ceil(rating) && rating % 1 >= 0.5,
          })}
        >
          ★
        </span>
      ))}
      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
    </span>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M7 12.25C7 12.25 1.25 8.75 1.25 4.75C1.25 3.09315 2.59315 1.75 4.25 1.75C5.19 1.75 6.03 2.19 6.57 2.88L7 3.43L7.43 2.88C7.97 2.19 8.81 1.75 9.75 1.75C11.4069 1.75 12.75 3.09315 12.75 4.75C12.75 8.75 7 12.25 7 12.25Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7.25 6 11 6 11C6 11 9.5 7.25 9.5 4.5C9.5 2.567 7.933 1 6 1ZM6 6C5.172 6 4.5 5.328 4.5 4.5C4.5 3.672 5.172 3 6 3C6.828 3 7.5 3.672 7.5 4.5C7.5 5.328 6.828 6 6 6Z" />
    </svg>
  );
}

function RoadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12L5 2M9 2L12 12M5 2H9M4 7H10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="5" />
      <path d="M6 3.5V6L7.5 7.5" />
    </svg>
  );
}

function NavigateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L8.5 11.5L6.5 7.5L2.5 5.5L12 2Z" />
    </svg>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function getDifficultyVariant(difficulty: string): 'success' | 'warning' | 'danger' | 'accent' | 'neutral' {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'success';
    case 'medium': return 'warning';
    case 'hard': return 'danger';
    case 'expert': return 'accent';
    default: return 'neutral';
  }
}

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'Lahka';
    case 'medium': return 'Srednja';
    case 'hard': return 'Težka';
    case 'expert': return 'Expert';
    default: return difficulty;
  }
}

function RouteCard({
  route,
  onLoadRoute,
}: {
  route: CommunityRoute;
  onLoadRoute?: (route: CommunityRoute) => void;
}) {
  const countryCode = route.country as CountryCode;

  return (
    <Card variant="elevated" padding="none" hoverLift className={styles.routeCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderTop}>
          <CountryFlag code={countryCode} size="sm" showLabel={false} className={styles.flagEmoji} />
          <Badge
            variant={getDifficultyVariant(route.difficulty)}
            label={getDifficultyLabel(route.difficulty)}
            size="sm"
          />
        </div>
        <div className={styles.routeMapDecoration}>
          <svg viewBox="0 0 200 80" className={styles.routeSvg} aria-hidden="true">
            <path
              d="M10,60 C30,20 50,70 80,30 C110,-10 130,60 160,25 C180,5 190,40 195,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <circle cx="10" cy="60" r="4" fill="currentColor" />
            <circle cx="195" cy="20" r="4" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.routeName}>{route.name}</h3>

        <div className={styles.authorRow}>
          <MapPinIcon />
          <span className={styles.authorText}>{route.author}</span>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statIcon}><RoadIcon /></span>
            <span className={styles.statValue}>{route.distanceKm.toFixed(0)} km</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}><ClockIcon /></span>
            <span className={styles.statValue}>{formatDuration(route.durationSec)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}><HeartIcon /></span>
            <span className={styles.statValue}>{route.likes}</span>
          </div>
        </div>

        <div className={styles.ratingRow}>
          <StarRating rating={route.rating} />
        </div>

        <div className={styles.cardFooter}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<NavigateIcon />}
            onClick={() => onLoadRoute?.(route)}
            fullWidth
          >
            Naloži v Načrtuj
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>🏍️</div>
      <h3 className={styles.emptyTitle}>Ni najdenih poti</h3>
      <p className={styles.emptyText}>
        Poskusite spremeniti filtre ali izberite drugo kombinacijo.
      </p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className={styles.grid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonHeader} />
          <div className={styles.skeletonBody}>
            <div className={styles.skeletonLine} />
            <div className={classNames(styles.skeletonLine, styles.skeletonLineShort)} />
            <div className={styles.skeletonStats} />
            <div className={styles.skeletonButton} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommunityRoutesGrid({
  initialCountry = `all`,
  initialDifficulty = `all`,
  initialSort = `popularity`,
  onLoadRoute,
  routes: routesProp,
  className,
  style,
}: CommunityRoutesGridProps) {
  const [country, setCountry] = useState<CountryFilter>(initialCountry);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>(initialDifficulty);
  const [sort, setSort] = useState<SortOption>(initialSort);

  const filter = useMemo(() => ({
    country: country !== 'all' ? country : undefined,
    difficulty: difficulty !== 'all' ? difficulty : undefined,
  }), [country, difficulty]);

  const { routes: fetchedRoutes, loading, error } = useCommunityRoutes({ filter });

  const routes = routesProp ?? fetchedRoutes ?? [];

  const sortedRoutes = useMemo(() => {
    const list = [...routes];
    if (sort === 'popularity') return list.sort((a, b) => b.likes - a.likes);
    if (sort === 'distance') return list.sort((a, b) => a.distanceKm - b.distanceKm);
    return list;
  }, [routes, sort]);

  return (
    <div className={classNames(styles.container, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Skupnostne poti</h2>
          <p className={styles.subtitle}>
            Odkrijte najboljše motociklistične poti Balkana
          </p>
        </div>
        <div className={styles.routeCount}>
          <span className={styles.countNumber}>{sortedRoutes.length}</span>
          <span className={styles.countLabel}>poti</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="country-filter">
              Država
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="country-filter"
                className={styles.select}
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryFilter)}
              >
                {COUNTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="difficulty-filter">
              Težavnost
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="difficulty-filter"
                className={styles.select}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </div>
        </div>

        <div className={styles.sortGroup}>
          <span className={styles.filterLabel}>Razvrsti po</span>
          <div className={styles.sortTabs}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={classNames(styles.sortTab, {
                  [styles.sortTabActive]: sort === opt.value,
                })}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ Napaka pri nalaganju poti. Prosimo, poskusite znova.</span>
        </div>
      )}

      {loading && !routesProp ? (
        <LoadingGrid />
      ) : sortedRoutes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.grid}>
          {sortedRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              onLoadRoute={onLoadRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
}
