import * as React from 'react';
import classNames from 'classnames';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { useCrashDetection } from '@markec/safety.hooks.use-crash-detection';
import styles from './crash-countdown-alert.module.scss';

const COUNTDOWN_SECONDS = 15;

export type CrashCountdownAlertProps = {
  /**
   * Override the countdown duration in seconds. Defaults to 15.
   */
  countdownSeconds?: number;

  /**
   * Called when the user cancels the SOS dispatch.
   */
  onCancel?: () => void;

  /**
   * Called when the countdown expires and SOS is dispatched.
   */
  onSosDispatched?: () => void;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

function ShieldAlertIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 4L6 12v12c0 10.5 7.7 20.3 18 22.6C34.3 44.3 42 34.5 42 24V12L24 4z"
        fill="rgba(239,68,68,0.15)"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 18v8M24 30v2"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WaveRing({ active }: { active: boolean }) {
  return (
    <span
      className={classNames(styles.waveRing, { [styles.waveRingActive]: active })}
    />
  );
}

export function CrashCountdownAlert({
  countdownSeconds = COUNTDOWN_SECONDS,
  onCancel,
  onSosDispatched,
  className,
  style,
}: CrashCountdownAlertProps) {
  const { lastEvent, dismiss } = useCrashDetection();

  const isActive = Boolean(lastEvent);
  const eventId = lastEvent?.id ?? null;

  const [secondsLeft, setSecondsLeft] = React.useState(countdownSeconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const dispatchedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isActive) {
      setSecondsLeft(countdownSeconds);
      dispatchedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setSecondsLeft(countdownSeconds);
    dispatchedRef.current = false;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          if (!dispatchedRef.current) {
            dispatchedRef.current = true;
            onSosDispatched?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, eventId, countdownSeconds, onSosDispatched]);

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (eventId) {
      dismiss(eventId);
    }
    onCancel?.();
  };

  const progress = secondsLeft / countdownSeconds;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - progress);

  return (
    <Modal
      open={isActive}
      onClose={handleCancel}
      closeOnBackdrop={false}
      closeOnEsc={false}
      size="sm"
      className={classNames(styles.modal, className)}
      style={style}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <WaveRing active={isActive} />
          <WaveRing active={isActive} />
          <div className={styles.iconCircle}>
            <ShieldAlertIcon />
          </div>
          <svg
            className={styles.countdownRing}
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle
              className={styles.ringTrack}
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="4"
            />
            <circle
              className={styles.ringProgress}
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <Heading level={2} size="xl" color="danger" className={styles.title}>
          Zaznan trk!
        </Heading>

        <p className={styles.message}>
          SOS bo poslan čez{' '}
          <span className={styles.countdown}>{secondsLeft}</span>
          {' '}s.
        </p>
        <p className={styles.subMessage}>
          Pritisni &ldquo;Sem v redu&rdquo; za preklic.
        </p>

        <div className={styles.buttonWrapper}>
          <CtaButton
            variant="sos"
            fullWidth
            onClick={() => handleCancel()}
          >
            ✓ Sem v redu
          </CtaButton>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress * 100}%` } as React.CSSProperties}
          />
        </div>
      </div>
    </Modal>
  );
}
