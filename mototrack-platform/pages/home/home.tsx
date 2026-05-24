import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import { Dashboard } from '@markec/mototrack-platform.pages.dashboard';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import styles from './home.module.scss';

const HERO_IMAGE =
  `https://storage.googleapis.com/bit-generated-images/images/image_dark_cinematic_motorcycle_navi_0_1779618510745.png`;

const FEATURES_IMAGE =
  `https://storage.googleapis.com/bit-generated-images/images/image_dark_minimalist_motorcycle_gps_0_1779618531169.png`;

type FeaturePill = {
  icon: string;
  label: string;
};

const DEFAULT_FEATURE_PILLS: FeaturePill[] = [
  { icon: `📡`, label: `Real GPS` },
  { icon: `🗺️`, label: `OSRM routing` },
  { icon: `🛣️`, label: `63 cest` },
  { icon: `🤖`, label: `MotoChat AI` },
  { icon: `🚨`, label: `Crash detection` },
];

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9h12M11 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export type HomeProps = {
  /**
   * Override signup path for navigation.
   */
  signupPath?: string;

  /**
   * Override login path for navigation.
   */
  loginPath?: string;

  /**
   * Feature pills to display in the landing hero section.
   */
  featurePills?: FeaturePill[];

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

export function Home({
  signupPath = `/signup`,
  loginPath = `/login`,
  featurePills = DEFAULT_FEATURE_PILLS,
  className,
  style,
}: HomeProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className={classNames(styles.loadingScreen, className)} style={style}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={classNames(styles.dashboardWrapper, className)} style={style}>
        <Dashboard />
      </div>
    );
  }

  return (
    <div className={classNames(styles.home, className)} style={style}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <img
          src={HERO_IMAGE}
          alt="MotoTrack — moto navigacija za Balkan"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <PageLayout maxWidth="1100px" padding="0 var(--layout-gutter)" gap="var(--spacing-xl)">
            <div className={styles.heroInner}>
              {/* Badge */}
              <div className={styles.liveBadge}>
                <span className={styles.liveDot} />
                <span className={styles.liveBadgeText}>MotoTrack · Balkan Edition</span>
              </div>

              {/* Headline */}
              <Heading level={1} size="3xl" color="primary" className={styles.heroHeading}>
                MotoTrack — najboljša moto-navigacija za Balkan
              </Heading>

              {/* Subline */}
              <Paragraph variant="body" color="secondary" className={styles.heroSubline}>
                Realno GPS sledenje, OSRM usmerjanje po gorskih cestah, MotoChat AI asistent in zaznavanje nesreč — vse v eni aplikaciji za motoriste.
              </Paragraph>

              {/* Feature pills */}
              <div className={styles.pillsRow}>
                {featurePills.map((pill) => (
                  <div key={pill.label} className={styles.pill}>
                    <span className={styles.pillIcon}>{pill.icon}</span>
                    <span className={styles.pillLabel}>{pill.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className={styles.ctaRow}>
                <CtaButton
                  variant="start-ride"
                  rightIcon={<ArrowRightIcon />}
                  onClick={() => navigate(signupPath)}
                >
                  Začni brezplačno
                </CtaButton>
                <CtaButton
                  variant="default"
                  leftIcon={<UserIcon />}
                  onClick={() => navigate(loginPath)}
                >
                  Prijava
                </CtaButton>
              </div>
            </div>
          </PageLayout>
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────────────── */}
      <section className={styles.featuresSection}>
        <PageLayout maxWidth="1100px" padding="var(--spacing-x3l) var(--layout-gutter)" gap="var(--spacing-x3l)">
          <div className={styles.featuresSplit}>
            {/* Left — text */}
            <div className={styles.featuresText}>
              <Paragraph variant="label" color="muted" className={styles.featuresLabel}>
                Zakaj MotoTrack?
              </Paragraph>
              <Heading level={2} size="2xl" color="primary" className={styles.featuresHeading}>
                Navigacija, ki razume motoriste
              </Heading>
              <Paragraph variant="body" color="secondary" className={styles.featuresDescription}>
                Pozabite na navigacijo za avtomobile. MotoTrack je zasnovan za motoriste — upošteva naklon ceste, kakovost asfalta in tvoje izkušnje.
              </Paragraph>

              <div className={styles.featuresList}>
                {[
                  {
                    icon: `📡`,
                    title: `Real GPS sledenje`,
                    desc: `Natančno sledenje v realnem času z minimalnim odtokom baterije.`,
                  },
                  {
                    icon: `🗺️`,
                    title: `OSRM usmerjanje`,
                    desc: `Odprtokodni usmerjevalnik optimiziran za motoristične ceste Balkana.`,
                  },
                  {
                    icon: `🤖`,
                    title: `MotoChat AI`,
                    desc: `Glasovni AI asistent za navigacijo, vreme in priporočila tras.`,
                  },
                  {
                    icon: `🚨`,
                    title: `Crash detection`,
                    desc: `Samodejno zaznavanje nesreč in takojšnje obveščanje stikov v sili.`,
                  },
                ].map((feature) => (
                  <div key={feature.title} className={styles.featureItem}>
                    <div className={styles.featureItemIcon}>{feature.icon}</div>
                    <div className={styles.featureItemBody}>
                      <Heading level={4} size="md" color="primary">
                        {feature.title}
                      </Heading>
                      <Paragraph variant="body" color="secondary">
                        {feature.desc}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div className={styles.featuresImageWrapper}>
              <img
                src={FEATURES_IMAGE}
                alt="MotoTrack GPS navigacija"
                className={styles.featuresImage}
              />
              <div className={styles.featuresImageGlow} />

              {/* Floating stat cards */}
              <div className={classNames(styles.statCard, styles.statCardTopLeft)}>
                <span className={styles.statCardValue}>63</span>
                <span className={styles.statCardLabel}>Balkan cest</span>
              </div>
              <div className={classNames(styles.statCard, styles.statCardBottomRight)}>
                <span className={styles.statCardValue}>98%</span>
                <span className={styles.statCardLabel}>GPS natančnost</span>
              </div>
            </div>
          </div>

          {/* ── Bottom CTA ──────────────────────────────────────────────── */}
          <div className={styles.bottomCta}>
            <div className={styles.bottomCtaText}>
              <Heading level={3} size="xl" color="primary">
                Pridruži se skupnosti motoristov
              </Heading>
              <Paragraph variant="body" color="secondary">
                Brezplačna registracija. Brez kreditne kartice.
              </Paragraph>
            </div>
            <div className={styles.bottomCtaButtons}>
              <CtaButton
                variant="start-ride"
                rightIcon={<ArrowRightIcon />}
                onClick={() => navigate(signupPath)}
              >
                Registracija
              </CtaButton>
              <CtaButton
                variant="default"
                leftIcon={<UserIcon />}
                onClick={() => navigate(loginPath)}
              >
                Prijava
              </CtaButton>
            </div>
          </div>
        </PageLayout>
      </section>
    </div>
  );
}
