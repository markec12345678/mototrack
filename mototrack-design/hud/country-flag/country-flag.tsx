import React from 'react';
import classNames from 'classnames';
import styles from './country-flag.module.scss';

export type CountryCode = 'SI' | 'HR' | 'BA' | 'ME' | 'RS' | 'MK' | 'AL' | 'BG' | 'RO' | 'GR';

export type FlagSize = 'sm' | 'md' | 'lg';

export type CountryFlagProps = {
  /**
   * ISO 3166-1 alpha-2 country code for one of the 10 supported Balkan countries.
   */
  code: CountryCode;

  /**
   * Display size of the flag + label.
   * @default 'md'
   */
  size?: FlagSize;

  /**
   * Whether to show the country name label next to the flag emoji.
   * @default true
   */
  showLabel?: boolean;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

export type CountryInfo = {
  flag: string;
  name: string;
};

export const COUNTRY_MAP: Record<CountryCode, CountryInfo> = {
  SI: { flag: '🇸🇮', name: 'Slovenia' },
  HR: { flag: '🇭🇷', name: 'Croatia' },
  BA: { flag: '🇧🇦', name: 'Bosnia & Herzegovina' },
  ME: { flag: '🇲🇪', name: 'Montenegro' },
  RS: { flag: '🇷🇸', name: 'Serbia' },
  MK: { flag: '🇲🇰', name: 'North Macedonia' },
  AL: { flag: '🇦🇱', name: 'Albania' },
  BG: { flag: '🇧🇬', name: 'Bulgaria' },
  RO: { flag: '🇷🇴', name: 'Romania' },
  GR: { flag: '🇬🇷', name: 'Greece' },
};

export function CountryFlag({
  code,
  size = `md`,
  showLabel = true,
  className,
  style,
}: CountryFlagProps) {
  const country = COUNTRY_MAP[code];

  if (!country) return null;

  return (
    <span
      className={classNames(styles.countryFlag, styles[size], className)}
      style={style}
      title={country.name}
    >
      <span className={styles.emoji} role="img" aria-label={country.name}>
        {country.flag}
      </span>
      {showLabel && (
        <span className={styles.label}>{country.name}</span>
      )}
    </span>
  );
}
