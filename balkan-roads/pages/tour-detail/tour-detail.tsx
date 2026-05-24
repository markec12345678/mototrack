import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { useIconicTours } from '@markec/balkan-roads.hooks.use-iconic-tours';
import type { IconicTour } from '@markec/balkan-roads.entities.iconic-tour';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Badge } from '@markec/mototrack-design.content.badge';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { MotoMap } from '@markec/maps.ui.moto-map';
import type { MotoMapProps } from '@markec/maps.ui.moto-map';
import { LatLng } from '@markec/maps.entities.lat-lng';
import styles from './tour-detail.module.scss';

// ── Icons ─────────────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.128L8 10.5l-3.708 2.08L5 8.452 2 5.528l4.146-.772L8 1z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2a4 4 0 014 4c0 3-4 8-4 8S4 9 4 6a4 4 0 014-4z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="3" cy="4" r="1.5" />
      <circle cx="13" cy="12" r="1.5" />
      <path d="M3 5.5V9a2 2 0 002 2h4a2 2 0 012 2v.5" />
    </svg>
  );
}

function SpeedometerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 11a6 6 0 1111 0" />
      <path d="M8 8l-2-2" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 10h6M7 13h4M10 7h3" />
    </svg>
  );
}

// ── Difficulty helpers ────────────────────────────────────────────────────────

type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

function difficultyVariant(difficulty: string): BadgeVariant {
  const d = difficulty.toLowerCase();
  if (d === 'easy') return 'success';
  if (d === 'moderate') return 'warning';
  if (d === 'hard' || d === 'expert') return 'danger';
  return 'neutral';
}

// ── Hero ──────────────────────────────────────────────────────────────────────

type HeroProps = {
  tour: IconicTour;
};

function TourHero({ tour }: HeroProps) {
  return (
    <div className={styles.hero} data-testid="tour-hero">
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <div className={styles.heroBadgeRow}>
          <CountryFlag code={tour.country as CountryCode} size="lg" />
          <Badge
            variant={difficultyVariant(tour.difficulty)}
            label={tour.difficulty}
            size="md"
          />
        </div>
        <Heading level={1} size="3xl" color="primary" className={styles.heroTitle}>
          {tour.name}
        </Heading>
        <div className={styles.heroMeta}>
          <div className={styles.ratingRow}>
            <span className={styles.starIcon}>
              <StarIcon />
            </span>
            <span className={styles.ratingValue} data-testid="rating-value">
              {tour.rating.toFixed(1)}
            </span>
            <span className={styles.ratingLabel}>/ 10</span>
          </div>
          <span className={styles.metaDivider} />
          <div className={styles.distanceRow}>
            <RouteIcon />
            <span className={styles.metaValue} data-testid="hero-distance">
              {tour.distanceKm} km
            </span>
          </div>
          <span className={styles.metaDivider} />
          <div className={styles.waypointsRow}>
            <MapPinIcon />
            <span className={styles.metaValue}>{tour.waypoints.length} točk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Grid ────────────────────────────────────────────────────────────────

type StatsGridProps = {
  tour: IconicTour;
};

function StatsGrid({ tour }: StatsGridProps) {
  const stats = [
    { label: `Razdalja`, value: `${tour.distanceKm} km`, icon: <RouteIcon /> },
    { label: `Ocena`, value: `${tour.rating.toFixed(1)} / 10`, icon: <StarIcon /> },
    { label: `Zahtevnost`, value: tour.difficulty, icon: <SpeedometerIcon /> },
    { label: `Točke poti`, value: `${tour.waypoints.length}`, icon: <MapPinIcon /> },
  ];

  return (
    <div className={styles.statsGrid} data-testid="stats-grid">
      {stats.map(({ label, value, icon }) => (
        <div key={label} className={styles.statCard} data-testid="stat-card">
          <div className={styles.statIcon}>{icon}</div>
          <div className={styles.statValue}>{value}</div>
          <div className={styles.statLabel}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Map ───────────────────────────────────────────────────────────────────────

type TourMapProps = {
  tour: IconicTour;
};

function TourMap({ tour }: TourMapProps) {
  const points = tour.waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng }));

  const center =
    points.length > 0
      ? points[Math.floor(points.length / 2)]
      : LatLng.from({ lat: 43.8563, lng: 18.4131 });

  type MapPolyline = NonNullable<MotoMapProps['polylines']>[number];
  type MapMarker = NonNullable<MotoMapProps['markers']>[number];

  const polylines: MapPolyline[] = points.length > 1
    ? [{ points, color: `#f97316`, weight: 4 }]
    : [];

  const markers: MapMarker[] = tour.waypoints.map((wp, idx) => ({
    latlng: LatLng.from({ lat: wp.lat, lng: wp.lng }),
    popup: wp.name ?? `Točka ${idx + 1}`,
  }));

  return (
    <div className={styles.mapSection} data-testid="map-section">
      <div className={styles.sectionHeader}>
        <Paragraph variant="label" color="muted">
          Trasa ture
        </Paragraph>
        <Heading level={2} size="xl" color="primary">
          Karta poti
        </Heading>
      </div>
      <div className={styles.mapWrapper}>
        <MotoMap
          center={center}
          zoom={9}
          polylines={polylines}
          markers={markers}
          className={styles.map}
        />
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TourDetailSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHero} />
      <PageLayout>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
        <div className={styles.skeletonMap} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} style={{ width: `70%` }} />
        <div className={styles.skeletonCta} />
      </PageLayout>
    </div>
  );
}

// ── Not Found ─────────────────────────────────────────────────────────────────

function TourNotFound() {
  return (
    <div className={styles.errorState} data-testid="tour-not-found">
      <div className={styles.errorIcon}>🏍️</div>
      <Heading level={2} size="xl" color="primary">
        Tura ni bila najdena
      </Heading>
      <Paragraph variant="body" color="secondary">
        Iskana tura ne obstaja ali je bila odstranjena.
      </Paragraph>
    </div>
  );
}

// ── Pure content renderer (no hook — no Apollo needed) ────────────────────────

type TourDetailContentProps = {
  tour: IconicTour;
  className?: string;
  style?: React.CSSProperties;
};

function TourDetailContent({ tour, className, style }: TourDetailContentProps) {
  return (
    <div className={classNames(styles.root, className)} style={style}>
      <TourHero tour={tour} />

      <PageLayout maxWidth="1200px" padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-xl)">
        <StatsGrid tour={tour} />

        <TourMap tour={tour} />

        <div className={styles.descriptionSection} data-testid="description-section">
          <Paragraph variant="label" color="muted">
            O turi
          </Paragraph>
          <Heading level={2} size="xl" color="primary" className={styles.descriptionTitle}>
            Opis
          </Heading>
          <Paragraph variant="body" color="secondary" className={styles.descriptionText} data-testid="description-text">
            {tour.description}
          </Paragraph>
        </div>

        <div className={styles.ctaSection} data-testid="cta-section">
          <div className={styles.ctaContent}>
            <Heading level={3} size="lg" color="primary">
              Pripravljeni na avanturo?
            </Heading>
            <Paragraph variant="body" color="secondary">
              Naloži turo v načrtovalnik in začni svojo balkanska pustolovščino.
            </Paragraph>
          </div>
          <CtaButton
            variant="start-ride"
            leftIcon={<PlanIcon />}
            className={styles.ctaButton}
          >
            Naloži v Načrtuj
          </CtaButton>
        </div>
      </PageLayout>
    </div>
  );
}

// ── Connected component (uses hook — requires Apollo context) ─────────────────

type ConnectedTourDetailProps = {
  tourId: string;
  className?: string;
  style?: React.CSSProperties;
};

function ConnectedTourDetail({ tourId, className, style }: ConnectedTourDetailProps) {
  const { getTour, loading, error } = useIconicTours();
  const tour: IconicTour | undefined = getTour(tourId);

  if (loading) return <TourDetailSkeleton />;
  if (error || !tour) return <TourNotFound />;

  return <TourDetailContent tour={tour} className={className} style={style} />;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export type TourDetailProps = {
  /**
   * Optional tour ID override — if omitted, reads from :id route param.
   */
  tourId?: string;

  /**
   * Mock tour data for testing and compositions. When provided, bypasses
   * the GraphQL hook entirely — no Apollo context required.
   */
  mockTour?: IconicTour;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function TourDetail({ tourId, mockTour, className, style }: TourDetailProps) {
  const params = useParams<{ id: string }>();
  const resolvedId = tourId ?? params.id ?? ``;

  if (mockTour) {
    return <TourDetailContent tour={mockTour} className={className} style={style} />;
  }

  return <ConnectedTourDetail tourId={resolvedId} className={className} style={style} />;
}
