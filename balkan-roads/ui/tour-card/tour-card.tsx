import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Card } from '@markec/mototrack-design.content.card';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import { Button } from '@markec/mototrack-design.actions.button';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import styles from './tour-card.module.scss';

export type TourWaypoint = {
  lat: number;
  lng: number;
  name?: string;
};

export type TourCardTour = {
  id: string;
  name: string;
  country: string;
  flag: string;
  distanceKm: number;
  rating: number;
  difficulty: string;
  description: string;
  waypoints: TourWaypoint[];
};

export type TourCardProps = {
  tour: TourCardTour;
  className?: string;
  style?: React.CSSProperties;
};

const DIFFICULTY_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'> = {
  Easy: 'success',
  Moderate: 'warning',
  Hard: 'danger',
  Expert: 'danger',
};

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02 3.22 9.56l.53-3.1L1.5 4.27l3.11-.45L6 1z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="11" cy="11" r="1.5" />
      <path d="M3 4.5v2a2 2 0 002 2h2a2 2 0 012 2v.5" />
    </svg>
  );
}

function WaypointIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" />
      <circle cx="7" cy="5" r="1.5" />
    </svg>
  );
}

function NavigateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8l12-6-6 12-1.5-5.5L2 8z" />
    </svg>
  );
}

const SUPPORTED_CODES: CountryCode[] = ['SI', 'HR', 'BA', 'ME', 'RS', 'MK', 'AL', 'BG', 'RO', 'GR'];

function resolveCountryCode(country: string, flag: string): CountryCode | null {
  const upper = country.toUpperCase() as CountryCode;
  if (SUPPORTED_CODES.includes(upper)) return upper;

  const byFlag: Record<string, CountryCode> = {
    '🇸🇮': 'SI', '🇭🇷': 'HR', '🇧🇦': 'BA', '🇲🇪': 'ME',
    '🇷🇸': 'RS', '🇲🇰': 'MK', '🇦🇱': 'AL', '🇧🇬': 'BG',
    '🇷🇴': 'RO', '🇬🇷': 'GR',
  };
  return byFlag[flag] ?? null;
}

export function TourCard({ tour, className, style }: TourCardProps) {
  const navigate = useNavigate();
  const difficultyVariant = DIFFICULTY_VARIANT[tour.difficulty] ?? 'neutral';
  const countryCode = resolveCountryCode(tour.country, tour.flag);
  const ratingDisplay = tour.rating.toFixed(1);

  const handlePlan = () => {
    navigate('/plan', { state: { tour } });
  };

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      <Card variant="elevated" padding="none" hoverLift className={styles.card}>
        {/* Header strip */}
        <div className={styles.header}>
          <div className={styles.flagRow}>
            {countryCode ? (
              <CountryFlag code={countryCode} size="sm" showLabel={false} />
            ) : (
              <span className={styles.flagEmoji} role="img" aria-label={tour.country}>
                {tour.flag}
              </span>
            )}
            <span className={styles.countryName}>{tour.country}</span>
          </div>

          <div className={styles.ratingPill}>
            <span className={styles.ratingIcon}>
              <StarIcon />
            </span>
            <span className={styles.ratingValue}>{ratingDisplay}</span>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <Heading level={3} size="md" color="primary" className={styles.name}>
            {tour.name}
          </Heading>

          <Paragraph variant="body" color="secondary" className={styles.description}>
            {tour.description}
          </Paragraph>

          {/* Stats row */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <RouteIcon />
              </span>
              <span className={styles.statValue}>{tour.distanceKm} km</span>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <WaypointIcon />
              </span>
              <span className={styles.statValue}>
                {tour.waypoints.length} {tour.waypoints.length === 1 ? `točka` : `točk`}
              </span>
            </div>

            <div className={styles.statDivider} />

            <Badge
              variant={difficultyVariant}
              label={tour.difficulty}
              size="sm"
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className={styles.footer}>
          <Button
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<NavigateIcon />}
            onClick={() => handlePlan()}
          >
            Naloži v Načrtuj
          </Button>
        </div>
      </Card>
    </div>
  );
}
