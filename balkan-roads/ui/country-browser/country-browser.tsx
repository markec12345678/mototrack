import React, { useState } from 'react';
import classNames from 'classnames';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import { RoadCard } from '@markec/balkan-roads.ui.road-card';
import { useBalkanRoads } from '@markec/balkan-roads.hooks.use-balkan-roads';
import type { CountryBrowserRoad } from './country-browser-road-type.js';
import styles from './country-browser.module.scss';

export type CountryBrowserProps = {
  /**
   * Override roads data (useful for testing / SSR).
   * When omitted, data is fetched via the useBalkanRoads hook.
   */
  roads?: CountryBrowserRoad[];

  /**
   * Title displayed above the accordion list.
   */
  title?: string;

  /**
   * Subtitle / description shown below the title.
   */
  subtitle?: string;

  /**
   * Country codes that are expanded by default.
   */
  defaultOpenCountries?: string[];

  /**
   * Called when a road card is clicked.
   */
  onRoadClick?: (id: string) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

type CountryGroup = {
  code: string;
  name: string;
  roads: CountryBrowserRoad[];
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 5L7 9.5L11.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  SI: `Slovenia`,
  HR: `Croatia`,
  BA: `Bosnia & Herzegovina`,
  ME: `Montenegro`,
  RS: `Serbia`,
  MK: `North Macedonia`,
  AL: `Albania`,
  BG: `Bulgaria`,
  RO: `Romania`,
  GR: `Greece`,
};

function groupByCountry(roads: CountryBrowserRoad[]): CountryGroup[] {
  const map = new Map<string, CountryBrowserRoad[]>();
  for (const road of roads) {
    const existing = map.get(road.country) ?? [];
    map.set(road.country, [...existing, road]);
  }
  const groups: CountryGroup[] = [];
  for (const [code, countryRoads] of map.entries()) {
    groups.push({
      code,
      name: COUNTRY_NAMES[code] ?? code,
      roads: countryRoads,
    });
  }
  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

function SkeletonItem() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonTrigger}>
        <div className={styles.skeletonCircle} />
        <div className={classNames(styles.skeletonBar, styles.skeletonBarWide)} />
        <div className={classNames(styles.skeletonBar, styles.skeletonBarNarrow)} />
      </div>
    </div>
  );
}

function AccordionItem({
  group,
  isOpen,
  onToggle,
  onRoadClick,
}: {
  group: CountryGroup;
  isOpen: boolean;
  onToggle: () => void;
  onRoadClick?: (id: string) => void;
}) {
  const countryCode = group.code as CountryCode;
  const roadCount = group.roads.length;
  const label = roadCount === 1 ? `1 road` : `${roadCount} roads`;

  return (
    <div
      className={classNames(styles.accordionItem, { [styles.accordionItemOpen]: isOpen })}
    >
      <button
        type="button"
        className={classNames(styles.accordionTrigger, { [styles.accordionTriggerOpen]: isOpen })}
        onClick={() => onToggle()}
        aria-expanded={isOpen}
      >
        <div className={styles.triggerLeft}>
          <CountryFlag code={countryCode} size="md" showLabel={false} />
          <span className={styles.countryName}>{group.name}</span>
          <span className={styles.roadCount}>{roadCount}</span>
        </div>
        <div className={styles.triggerRight}>
          <span className={styles.roadCountLabel}>{label}</span>
          <span className={classNames(styles.chevron, { [styles.chevronOpen]: isOpen })}>
            <ChevronIcon />
          </span>
        </div>
      </button>

      <div
        className={classNames(styles.accordionPanel, { [styles.accordionPanelOpen]: isOpen })}
        aria-hidden={!isOpen}
      >
        <div className={styles.panelDivider} />
        <div className={styles.panelContent}>
          {group.roads.map((road) => (
            <RoadCard
              key={road.id}
              id={road.id}
              name={road.name}
              country={road.country}
              type={road.type}
              lengthKm={road.lengthKm}
              rating={road.rating}
              difficulty={road.difficulty}
              onClick={onRoadClick ? (id) => onRoadClick(id) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CountryBrowser({
  roads: roadsProp,
  title = `Browse by Country`,
  subtitle = `Explore the best motorcycle roads across the Balkans, grouped by country.`,
  defaultOpenCountries = [],
  onRoadClick,
  className,
  style,
}: CountryBrowserProps) {
  const { roads: fetchedRoads, loading } = useBalkanRoads();
  const roads = roadsProp ?? (fetchedRoads as CountryBrowserRoad[]) ?? [];

  const [openCountries, setOpenCountries] = useState<Set<string>>(
    new Set(defaultOpenCountries)
  );

  const groups = groupByCountry(roads);

  const handleToggle = (code: string) => {
    setOpenCountries((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  return (
    <div className={classNames(styles.countryBrowser, className)} style={style}>
      <div className={styles.browserHeader}>
        <h2 className={styles.browserTitle}>{title}</h2>
        <p className={styles.browserSubtitle}>{subtitle}</p>
      </div>

      {loading && !roadsProp && (
        <>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </>
      )}

      {!loading && groups.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏍️</div>
          <p className={styles.emptyTitle}>No roads found</p>
          <p className={styles.emptySubtitle}>Try adjusting your filters or check back later.</p>
        </div>
      )}

      {groups.map((group) => (
        <AccordionItem
          key={group.code}
          group={group}
          isOpen={openCountries.has(group.code)}
          onToggle={() => handleToggle(group.code)}
          onRoadClick={onRoadClick}
        />
      ))}
    </div>
  );
}
