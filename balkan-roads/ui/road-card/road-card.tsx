import React from 'react';
import classNames from 'classnames';
import { Card } from '@markec/mototrack-design.content.card';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import styles from './road-card.module.scss';

export type RoadCardProps = {
  /**
   * Unique identifier for the road.
   */
  id?: string;

  /**
   * Name of the road.
   */
  name?: string;

  /**
   * ISO 3166-1 alpha-2 country code.
   */
  country?: string;

  /**
   * Road type (e.g. Serpentine, Coastal, Pass, Forest).
   */
  type?: string;

  /**
   * Length of the road in kilometres.
   */
  lengthKm?: number;

  /**
   * Rating from 0 to 10.
   */
  rating?: number;

  /**
   * Difficulty level (e.g. Easy, Moderate, Hard, Expert).
   */
  difficulty?: string;

  /**
   * Called when the card is clicked.
   */
  onClick?: (id: string) => void;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

const DIFFICULTY_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
  Easy: 'success',
  Moderate: 'info',
  Hard: 'warning',
  Expert: 'danger',
};

function StarRating({ rating }: { rating: number }) {
  const normalized = Math.round((rating / 10) * 5 * 2) / 2;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = normalized >= i + 1;
    const half = !filled && normalized >= i + 0.5;
    return { filled, half };
  });

  return (
    <span className={styles.starRating} aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
      {stars.map((star, i) => (
        <span key={i} className={classNames(styles.star, { [styles.filled]: star.filled, [styles.half]: star.half })}>
          {star.filled ? '★' : star.half ? '⯨' : '☆'}
        </span>
      ))}
      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
    </span>
  );
}

export function RoadCard({
  id = `road-1`,
  name = `Vršič Pass`,
  country = `SI`,
  type = `Pass`,
  lengthKm = 25.4,
  rating = 9.2,
  difficulty = `Hard`,
  onClick,
  className,
  style,
}: RoadCardProps) {
  const difficultyVariant = DIFFICULTY_VARIANT[difficulty] ?? 'neutral';
  const countryCode = country as CountryCode;

  const handleClick = () => {
    if (onClick && id) onClick(id);
  };

  return (
    <Card
      variant="elevated"
      padding="none"
      hoverLift={!!onClick}
      className={classNames(styles.roadCard, { [styles.clickable]: !!onClick }, className)}
      style={style}
      onClick={onClick ? handleClick : undefined}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <CountryFlag code={countryCode} size="sm" showLabel={false} className={styles.flag} />
          <div className={styles.typeAndDifficulty}>
            <Badge label={type} variant="accent" size="sm" />
            <Badge label={difficulty} variant={difficultyVariant} size="sm" />
          </div>
        </div>

        <div className={styles.body}>
          <Paragraph variant="label" color="primary" className={styles.name}>
            {name}
          </Paragraph>
        </div>

        <div className={styles.footer}>
          <div className={styles.length}>
            <span className={styles.lengthIcon}>📍</span>
            <Paragraph variant="caption" color="muted" className={styles.lengthText}>
              {lengthKm.toFixed(1)} km
            </Paragraph>
          </div>
          <StarRating rating={rating} />
        </div>
      </div>
    </Card>
  );
}
