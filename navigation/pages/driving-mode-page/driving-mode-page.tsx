import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { DrivingModeHud } from '@markec/navigation.ui.driving-mode-hud';
import { useRideRecorder } from '@markec/rides.hooks.use-ride-recorder';
import { useTurnByTurn } from '@markec/navigation.hooks.use-turn-by-turn';
import { useSavedRoutes } from '@markec/routes.hooks.use-saved-routes';
import { NavInstruction } from '@markec/navigation.entities.nav-instruction';
import type { DrivingModePageProps, MockRoute } from './driving-mode-page-props-type.js';
import styles from './driving-mode-page.module.scss';

const FUEL_CONSUMPTION_PER_KM = 0.065;

function formatEta(etaSeconds: number): string {
  const now = new Date();
  now.setSeconds(now.getSeconds() + etaSeconds);
  const h = now.getHours().toString().padStart(2, `0`);
  const m = now.getMinutes().toString().padStart(2, `0`);
  return `${h}:${m}`;
}

function AlertTriangleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function LoadingOverlay() {
  return (
    <div data-testid="loading-overlay" className={styles.loadingOverlay}>
      <div className={styles.loadingBadge}>
        <span className={styles.loadingDot} />
        <span className={styles.loadingBadgeLabel}>Drive Mode</span>
      </div>
      <div className={styles.loadingCard}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingTitle}>Loading route&hellip;</p>
        <p className={styles.loadingSubtitle}>
          Fetching navigation data and acquiring GPS signal.
        </p>
      </div>
    </div>
  );
}

type ErrorOverlayProps = {
  routeId: string;
  onBack: () => void;
};

function ErrorOverlay({ routeId, onBack }: ErrorOverlayProps) {
  return (
    <div data-testid="error-overlay" className={styles.errorOverlay}>
      <div data-testid="error-card" className={styles.errorCard}>
        <div className={styles.errorIcon}>
          <AlertTriangleIcon />
        </div>
        <p className={styles.errorTitle}>Route not found</p>
        <p className={styles.errorMessage}>
          The route you&apos;re trying to navigate could not be loaded.
          Please return to the track page and select a valid route.
        </p>
        {routeId && (
          <span className={styles.errorRouteId}>ID: {routeId}</span>
        )}
        <button
          type="button"
          data-testid="back-button"
          className={styles.backButton}
          onClick={() => onBack()}
        >
          <ArrowLeftIcon />
          Back to Track
        </button>
      </div>
    </div>
  );
}

export function DrivingModePage({
  className,
  style,
  mockRoute,
  tankCapacityLiters = 18,
  initialFuelLiters = 14,
  fontScale = `1x`,
  warningThreshold = 120,
  voiceEnabled = true,
}: DrivingModePageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get(`routeId`) ?? ``;

  const containerRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const startedRef = useRef(false);

  // When mockRoute is explicitly provided (even as null), bypass useSavedRoutes loading
  const hasMockRoute = mockRoute !== undefined;
  const { routes, loading: routesLoading } = useSavedRoutes();

  const activeRoute: MockRoute | null = hasMockRoute
    ? mockRoute
    : (routes?.find((r) => r.id === routeId) as MockRoute | undefined) ?? null;

  // Only show loading spinner when we are actually waiting for remote data
  const isLoading = !hasMockRoute && routesLoading;
  const routeNotFound = !isLoading && !activeRoute;

  const recorder = useRideRecorder();
  const nav = useTurnByTurn({ route: activeRoute ?? undefined });

  const acquireWakeLock = useCallback(async () => {
    if (typeof navigator === `undefined`) return;
    if (!(`wakeLock` in navigator)) return;
    try {
      const nav_ = navigator as Navigator & {
        wakeLock: { request: (type: string) => Promise<WakeLockSentinel> };
      };
      wakeLockRef.current = await nav_.wakeLock.request(`screen`);
    } catch {
      // WakeLock denied or unavailable — silently continue
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (!wakeLockRef.current) return;
    try {
      await wakeLockRef.current.release();
    } catch {
      // ignore
    }
    wakeLockRef.current = null;
  }, []);

  const requestFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el || typeof document === `undefined`) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => undefined);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (typeof document === `undefined`) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
  }, []);

  const handleExit = useCallback(() => {
    recorder.stop();
    releaseWakeLock();
    exitFullscreen();
    navigate(`/track`);
  }, [recorder, releaseWakeLock, exitFullscreen, navigate]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    recorder.start();
    acquireWakeLock();
    requestFullscreen();

    return () => {
      recorder.stop();
      releaseWakeLock();
      exitFullscreen();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document === `undefined`) return undefined;

    const handleVisibilityChange = () => {
      if (document.visibilityState === `visible`) {
        acquireWakeLock();
      }
    };

    document.addEventListener(`visibilitychange`, handleVisibilityChange);
    return () => {
      document.removeEventListener(`visibilitychange`, handleVisibilityChange);
    };
  }, [acquireWakeLock]);

  useEffect(() => {
    if (typeof window === `undefined`) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === `Escape`) {
        handleExit();
      }
    };

    window.addEventListener(`keydown`, handleKeyDown);
    return () => {
      window.removeEventListener(`keydown`, handleKeyDown);
    };
  }, [handleExit]);

  const speed = recorder.currentSpeedKmh ?? 0;
  const distanceKm = recorder.distanceKm ?? 0;
  const gpsQuality = recorder.gpsQuality ?? `lost`;

  const gpsAccuracyMeters =
    gpsQuality === `excellent` ? 5
    : gpsQuality === `good` ? 15
    : gpsQuality === `poor` ? 60
    : 999;

  const etaSeconds = nav?.etaSeconds ?? 0;
  const etaString = etaSeconds > 0 ? formatEta(etaSeconds) : `--:--`;

  const distanceToDestinationKm =
    activeRoute?.distanceKm != null
      ? Math.max(0, activeRoute.distanceKm - distanceKm)
      : 0;

  const fuelUsed = distanceKm * FUEL_CONSUMPTION_PER_KM;
  const currentFuelLiters = Math.max(0, initialFuelLiters - fuelUsed);
  const fuelRangeKm = Math.round(currentFuelLiters / FUEL_CONSUMPTION_PER_KM);

  const currentStep = nav?.currentStep;
  const nextInstruction = currentStep
    ? NavInstruction.from({
        id: currentStep.id ?? `step`,
        text: currentStep.instruction,
        distanceM: nav?.distanceToTurn ?? 0,
        modifier: (currentStep.modifier ?? 'continue') as any,
        announceAt: 300,
      })
    : undefined;

  const streetName = activeRoute?.name ?? ``;

  const hudData = {
    speed,
    heading: 0,
    streetName,
    eta: etaString,
    distanceToDestinationKm,
    currentFuelLiters,
    tankCapacityLiters,
    fuelRangeKm,
    gpsAccuracyMeters,
    nextInstruction,
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (routeNotFound) {
    return (
      <ErrorOverlay
        routeId={routeId}
        onBack={() => handleExit()}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      data-testid="driving-mode-page"
      className={classNames(styles.page, className)}
      style={style}
    >
      <DrivingModeHud
        data={hudData}
        fontScale={fontScale}
        warningThreshold={warningThreshold}
        voiceEnabled={voiceEnabled}
        onExit={() => handleExit()}
        className={styles.hud}
      />
    </div>
  );
}
