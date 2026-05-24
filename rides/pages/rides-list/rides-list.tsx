import * as React from 'react';
import { useState, useCallback } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { RideCard } from '@markec/rides.ui.ride-card';
import { RideCalendar } from '@markec/rides.ui.ride-calendar';
import { useRides } from '@markec/rides.hooks.use-rides';
import type { TabItem } from '@markec/mototrack-design.navigation.tabs';
import type { Ride } from './ride-type.js';
import styles from './rides-list.module.scss';

type ActiveTab = 'list' | 'calendar';

export type RidesListProps = {
  /**
   * Optional mock rides to bypass GraphQL (for testing/compositions).
   * When provided, the GraphQL hook is skipped entirely.
   */
  mockRides?: Ride[];

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TAB_ITEMS: TabItem[] = [
  { key: `list`, label: `List`, icon: <ListIcon /> },
  { key: `calendar`, label: `Calendar`, icon: <CalendarIcon /> },
];

// ── Inner component that calls useRides — only mounted when no mockRides ──────

type LiveRidesProps = {
  fromTs?: number;
  toTs?: number;
  onRender: (data: { rides: Ride[]; loading: boolean; error: unknown }) => React.ReactElement;
};

function LiveRides({ fromTs, toTs, onRender }: LiveRidesProps) {
  const { rides, loading, error } = useRides({ listOptions: { from: fromTs, to: toTs } });
  return onRender({ rides: (rides ?? []) as Ride[], loading, error });
}

// ── Shared content renderer ───────────────────────────────────────────────────

type ContentProps = {
  rides: Ride[];
  loading: boolean;
  error: unknown;
  activeTab: ActiveTab;
  hasActiveFilter: boolean;
  drillDay: { date: string; rides: Ride[] } | null;
  onDayClick: (dateKey: string, dayRides: Ride[]) => void;
  onDrillClose: () => void;
};

function RidesContent({
  rides,
  loading,
  error,
  activeTab,
  hasActiveFilter,
  drillDay,
  onDayClick,
  onDrillClose,
}: ContentProps) {
  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>Failed to load rides. Please try again.</p>
        </div>
      </div>
    );
  }

  if (activeTab === `list`) {
    if (rides.length === 0) {
      return (
        <div className={styles.stateContainer}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🏍️</span>
            <p className={styles.emptyTitle}>No rides yet</p>
            <p className={styles.emptySubtitle}>
              {hasActiveFilter
                ? `No rides match your date filter. Try adjusting the range.`
                : `Start your first ride to see it appear here.`}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.rideGrid}>
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    );
  }

  // Calendar tab
  return (
    <div className={styles.calendarSection} data-section="calendar">
      <RideCalendar
        rides={rides}
        onDayClick={(dateKey, dayRides) => onDayClick(dateKey, dayRides as Ride[])}
      />

      {drillDay && (
        <div className={styles.drillPanel}>
          <div className={styles.drillHeader}>
            <div className={styles.drillTitleGroup}>
              <span className={styles.drillEyebrow}>Day drill</span>
              <span className={styles.drillDate}>{drillDay.date}</span>
            </div>
            <button
              type="button"
              className={styles.drillClose}
              onClick={() => onDrillClose()}
              aria-label="Close day drill"
            >
              ✕
            </button>
          </div>
          <div className={styles.drillGrid}>
            {drillDay.rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export function RidesList({ mockRides, className, style }: RidesListProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(`list`);
  const [fromDate, setFromDate] = useState(``);
  const [toDate, setToDate] = useState(``);
  const [filterOpen, setFilterOpen] = useState(false);
  const [drillDay, setDrillDay] = useState<{ date: string; rides: Ride[] } | null>(null);

  const fromTs = fromDate ? new Date(fromDate).getTime() : undefined;
  const toTs = toDate ? new Date(toDate).getTime() : undefined;
  const hasActiveFilter = Boolean(fromDate || toDate);

  const isMockMode = mockRides !== undefined;
  const resolvedMockRides = mockRides ?? [];

  const filteredMockRides = resolvedMockRides.filter((ride) => {
    if (fromTs && ride.startedAt < fromTs) return false;
    if (toTs && ride.startedAt > toTs) return false;
    return true;
  });

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as ActiveTab);
    setDrillDay(null);
  }, []);

  const handleDayClick = useCallback((dateKey: string, dayRides: Ride[]) => {
    setDrillDay({ date: dateKey, rides: dayRides });
  }, []);

  const sharedContentProps = {
    activeTab,
    hasActiveFilter,
    drillDay,
    onDayClick: handleDayClick,
    onDrillClose: () => setDrillDay(null),
  };

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <PageLayout>
        <div className={styles.pageHeader}>
          <div className={styles.titleBlock}>
            <span className={styles.eyebrow}>MotoTrack</span>
            <Heading level={1} size="2xl">My Rides</Heading>
            <p className={styles.subtitle}>
              Track every kilometre — browse your ride history or explore your monthly activity.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={classNames(styles.filterToggle, { [styles.filterActive]: hasActiveFilter })}
              onClick={() => setFilterOpen((v) => !v)}
            >
              <FilterIcon />
              <span>Filter</span>
              {hasActiveFilter && <span className={styles.filterBadge} />}
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className={styles.filterPanel}>
            <div className={styles.filterRow}>
              <div className={styles.filterField}>
                <label className={styles.filterLabel} htmlFor="from-date">From</label>
                <input
                  id="from-date"
                  type="date"
                  className={styles.dateInput}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className={styles.filterField}>
                <label className={styles.filterLabel} htmlFor="to-date">To</label>
                <input
                  id="to-date"
                  type="date"
                  className={styles.dateInput}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              {hasActiveFilter && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => {
                    setFromDate(``);
                    setToDate(``);
                    setDrillDay(null);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        <div className={styles.tabsRow}>
          <Tabs
            items={TAB_ITEMS}
            activeKey={activeTab}
            onTabChange={(key) => handleTabChange(key)}
          />
          {isMockMode && (
            <span className={styles.rideCount}>
              {filteredMockRides.length} ride{filteredMockRides.length !== 1 ? `s` : ``}
            </span>
          )}
        </div>

        {isMockMode
          ? (
            <RidesContent
              rides={filteredMockRides}
              loading={false}
              error={null}
              {...sharedContentProps}
            />
          )
          : (
            <LiveRides
              fromTs={fromTs}
              toTs={toTs}
              onRender={({ rides, loading, error }) => {
                const filtered = rides.filter((ride) => {
                  if (fromTs && ride.startedAt < fromTs) return false;
                  if (toTs && ride.startedAt > toTs) return false;
                  return true;
                });
                return (
                  <RidesContent
                    rides={filtered}
                    loading={loading}
                    error={error}
                    {...sharedContentProps}
                  />
                );
              }}
            />
          )}
      </PageLayout>
    </div>
  );
}
