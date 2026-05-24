import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './gps-quality-indicator.module.scss';

export type GpsQuality = 'excellent' | 'good' | 'poor' | 'lost';

export type GpsQualityIndicatorProps = {
  /**
   * GPS accuracy in meters. When undefined or null, the indicator shows "lost".
   */
  accuracyMeters?: number | null;

  /**
   * Override the automatically derived quality variant.
   */
  quality?: GpsQuality;

  /**
   * Whether the GPS signal just reconnected — triggers the pulse animation.
   */
  reconnecting?: boolean;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Size of the dot in pixels. Defaults to 12.
   */
  size?: number;

  /**
   * Whether to show the tooltip on hover. Defaults to true.
   */
  showTooltip?: boolean;
};

function deriveQuality(accuracyMeters?: number | null): GpsQuality {
  if (accuracyMeters == null || accuracyMeters > 50) return 'lost';
  if (accuracyMeters <= 10) return 'excellent';
  if (accuracyMeters <= 25) return 'good';
  return 'poor';
}

function buildTooltipLabel(quality: GpsQuality, accuracyMeters?: number | null): string {
  const qualityLabels: Record<GpsQuality, string> = {
    excellent: 'Excellent',
    good: 'Good',
    poor: 'Poor',
    lost: 'Signal Lost',
  };
  const label = qualityLabels[quality];
  if (accuracyMeters != null && quality !== 'lost') {
    return `GPS ${label} · ±${Math.round(accuracyMeters)} m`;
  }
  return `GPS ${label}`;
}

export function GpsQualityIndicator({
  accuracyMeters,
  quality: qualityProp,
  reconnecting = false,
  className,
  style,
  size = 12,
  showTooltip = true,
}: GpsQualityIndicatorProps) {
  const quality = qualityProp ?? deriveQuality(accuracyMeters);
  const tooltipLabel = buildTooltipLabel(quality, accuracyMeters);

  const [isPulsing, setIsPulsing] = useState(false);
  const prevQualityRef = useRef<GpsQuality>(quality);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wasLost = prevQualityRef.current === 'lost';
    const isNowConnected = quality !== 'lost';

    if ((wasLost && isNowConnected) || reconnecting) {
      setIsPulsing(true);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = setTimeout(() => setIsPulsing(false), 2000);
    }

    prevQualityRef.current = quality;

    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [quality, reconnecting]);

  const dotStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={style}
      role="status"
      aria-label={tooltipLabel}
    >
      <div
        className={classNames(
          styles.dot,
          styles[quality],
          { [styles.pulsing]: isPulsing }
        )}
        style={dotStyle}
      >
        <div className={styles.ring} style={dotStyle} />
      </div>

      {showTooltip && (
        <div className={styles.tooltip}>
          <div className={classNames(styles.tooltipQuality, styles[`tooltip${quality.charAt(0).toUpperCase()}${quality.slice(1)}`])}>
            {quality === 'excellent' && '🟢'}
            {quality === 'good' && '🟡'}
            {quality === 'poor' && '🟠'}
            {quality === 'lost' && '🔴'}
            <span className={styles.tooltipLabel}>{tooltipLabel}</span>
          </div>
          {accuracyMeters != null && quality !== 'lost' && (
            <div className={styles.tooltipAccuracy}>
              Accuracy: ±{Math.round(accuracyMeters)} m
            </div>
          )}
        </div>
      )}
    </div>
  );
}
