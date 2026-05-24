import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Button } from '@markec/mototrack-design.actions.button';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import styles from './not-found.module.scss';

const HERO_IMAGE_URL =
  `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_404_err_0_1779617920848.png`;

export type NotFoundProps = {
  /**
   * The main heading displayed on the 404 page.
   */
  title?: string;

  /**
   * Friendly subtitle message shown below the heading.
   */
  subtitle?: string;

  /**
   * Label for the return-home button.
   */
  homeLabel?: string;

  /**
   * Path the return-home button navigates to.
   */
  homePath?: string;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

/**
 * 404 Not Found page for the MotoTrack platform.
 * Displays a friendly Slovenian message and a return-home button.
 */
export function NotFound({
  title = `Hopla, stran ni najdena 🏍️💨`,
  subtitle = `Zdi se, da ste zapeljali s poti. Ta stran ne obstaja ali je bila premaknjena.`,
  homeLabel = `Nazaj na domačo stran`,
  homePath = `/`,
  className,
  style,
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* Hero image */}
      <div className={styles.heroWrapper}>
        <img
          src={HERO_IMAGE_URL}
          alt="404 — stran ni najdena"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <span className={styles.errorCode}>404</span>
      </div>

      {/* Content */}
      <PageLayout maxWidth="720px" padding="var(--spacing-x3l) var(--layout-gutter)" gap="var(--spacing-lg)">
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeLabel}>Izgubljena pot</span>
          </div>

          <Heading level={1} size="2xl" color="primary" className={styles.heading}>
            {title}
          </Heading>

          <Paragraph variant="body" color="secondary" className={styles.subtitle}>
            {subtitle}
          </Paragraph>

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<HomeIcon />}
              onClick={() => navigate(homePath)}
            >
              {homeLabel}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Pojdi nazaj
            </Button>
          </div>

          <div className={styles.hints}>
            <Paragraph variant="caption" color="muted">
              Preverite URL ali se vrnite na začetek.
            </Paragraph>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.25 7.5L9 1.5L15.75 7.5V15.75C15.75 16.164 15.414 16.5 15 16.5H11.25C10.836 16.5 10.5 16.164 10.5 15.75V12H7.5V15.75C7.5 16.164 7.164 16.5 6.75 16.5H3C2.586 16.5 2.25 16.164 2.25 15.75V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
