import { useState, type CSSProperties, type ReactNode } from 'react';
import classNames from 'classnames';
import { useRideRecorder } from '@markec/rides.hooks.use-ride-recorder';
import { useRides } from '@markec/rides.hooks.use-rides';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import styles from './start-ride-control.module.scss';

// ── Icons ──────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5l16 9-16 9V5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="5" height="16" rx="1.5" fill="currentColor" />
      <rect x="13" y="3" width="5" height="16" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l13 7-13 7V4z" fill="currentColor" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="16" height="16" rx="2" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l4.5 4.5 7.5-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.66 10a7.66 7.66 0 01-.08 1.06l1.56 1.22a.4.4 0 01.09.5l-1.48 2.56a.4.4 0 01-.48.17l-1.84-.74a7.8 7.8 0 01-1.83 1.06l-.28 1.96a.4.4 0 01-.39.33h-2.96a.4.4 0 01-.39-.33l-.28-1.96a7.8 7.8 0 01-1.83-1.06l-1.84.74a.4.4 0 01-.48-.17L2.83 12.78a.4.4 0 01.09-.5l1.56-1.22A7.66 7.66 0 014.4 10c0-.36.03-.71.08-1.06L2.92 7.72a.4.4 0 01-.09-.5l1.48-2.56a.4.4 0 01.48-.17l1.84.74A7.8 7.8 0 018.46 4.17l.28-1.96A.4.4 0 019.13 1.88h2.96a.4.4 0 01.39.33l.28 1.96a7.8 7.8 0 011.83 1.06l1.84-.74a.4.4 0 01.48.17l1.48 2.56a.4.4 0 01-.09.5l-1.56 1.22c.05.35.08.7.08 1.06z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 13.5a3.5 3.5 0 000-7h-.55A5.5 5.5 0 005 9.5v.5a3 3 0 000 6h11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h9l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 4v5H7V4M7 13v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ── Checklist data ─────────────────────────────────────────────────────────

type ChecklistItem = {
  id: string;
  label: string;
  icon: ReactNode;
  category: `gear` | `weather`;
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: `helmet`, label: `Čelada in zaščitna oprema`, icon: <GearIcon />, category: `gear` },
  { id: `jacket`, label: `Jakna s ščitniki`, icon: <GearIcon />, category: `gear` },
  { id: `gloves`, label: `Rokavice`, icon: <GearIcon />, category: `gear` },
  { id: `boots`, label: `Motoristični škornji`, icon: <GearIcon />, category: `gear` },
  { id: `tyre`, label: `Tlak in stanje pnevmatik`, icon: <GearIcon />, category: `gear` },
  { id: `brakes`, label: `Zavore in tekočina`, icon: <GearIcon />, category: `gear` },
  { id: `weather`, label: `Vremenski pogoji so primerni`, icon: <CloudIcon />, category: `weather` },
  { id: `rain`, label: `Oblečen za dež (po potrebi)`, icon: <CloudIcon />, category: `weather` },
];

// ── GPS quality badge ──────────────────────────────────────────────────────

type GpsQuality = `excellent` | `good` | `poor` | `lost`;

function GpsQualityBadge({ quality }: { quality: GpsQuality }) {
  const colorMap: Record<GpsQuality, string> = {
    excellent: `#22c55e`,
    good: `#f97316`,
    poor: `#eab308`,
    lost: `#ef4444`,
  };
  const labelMap: Record<GpsQuality, string> = {
    excellent: `GPS odličen`,
    good: `GPS dober`,
    poor: `GPS slab`,
    lost: `GPS izgubljen`,
  };
  const color = colorMap[quality];
  return (
    <div className={styles.gpsBadge}>
      <div className={styles.gpsDot} style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
      <span className={styles.gpsLabel} style={{ color }}>
        {labelMap[quality]}
      </span>
    </div>
  );
}

// ── Duration formatter ─────────────────────────────────────────────────────

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, `0`)}:${String(s).padStart(2, `0`)}`;
  return `${String(m).padStart(2, `0`)}:${String(s).padStart(2, `0`)}`;
}

// ── GPS point type ─────────────────────────────────────────────────────────

type GpsTrackPoint = {
  lat: number;
  lng: number;
  ts: number;
  speed?: number;
  elevation?: number;
  accuracy?: number;
  heading?: number;
};

// ── Props ──────────────────────────────────────────────────────────────────

export type StartRideControlProps = {
  /**
   * Called after a ride is successfully saved.
   */
  onRideSaved?: (rideId: string) => void;

  /**
   * Called when the user discards a stopped ride without saving.
   */
  onRideDiscarded?: () => void;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: CSSProperties;
};

// ── Component ──────────────────────────────────────────────────────────────

export function StartRideControl({
  onRideSaved,
  onRideDiscarded,
  className,
  style,
}: StartRideControlProps) {
  const recorder = useRideRecorder();
  const { createRide } = useRides();

  // Pre-ride checklist modal
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // Save flow modal
  const [saveOpen, setSaveOpen] = useState(false);
  const [rideName, setRideName] = useState(``);
  const [rideNotes, setRideNotes] = useState(``);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const status = recorder.status as `idle` | `recording` | `paused` | `stopped`;
  const allChecked = checkedIds.size === DEFAULT_CHECKLIST.length;

  // ── Checklist handlers ───────────────────────────────────────────────────

  const handleToggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCheckAll = () => {
    if (allChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(DEFAULT_CHECKLIST.map((i) => i.id)));
    }
  };

  const handleStartAfterChecklist = () => {
    setChecklistOpen(false);
    setCheckedIds(new Set());
    recorder.start();
  };

  // ── Ride controls ────────────────────────────────────────────────────────

  const handlePlayClick = () => {
    setChecklistOpen(true);
  };

  const handlePause = () => {
    recorder.pause();
  };

  const handleResume = () => {
    recorder.resume();
  };

  const handleStop = () => {
    recorder.stop();
    setRideName(``);
    setRideNotes(``);
    setSaveError(null);
    setSaveOpen(true);
  };

  // ── Save handlers ────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const rawPoints = recorder.points as unknown[];
      const gpsPoints = rawPoints.filter(
        (p): p is GpsTrackPoint =>
          typeof p === `object` && p !== null && `lat` in p && `lng` in p
      );
      const result = await createRide({
        name: rideName.trim() || undefined,
        notes: rideNotes.trim() || undefined,
        startedAt: gpsPoints[0]?.ts ?? Date.now(),
        endedAt: gpsPoints[gpsPoints.length - 1]?.ts ?? Date.now(),
        track: gpsPoints,
      });
      setSaveOpen(false);
      setSaving(false);
      onRideSaved?.(result?.id ?? ``);
    } catch {
      setSaveError(`Shranjevanje ni uspelo. Poskusi znova.`);
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSaveOpen(false);
    onRideDiscarded?.();
  };

  // ── Derived ──────────────────────────────────────────────────────────────

  const gearItems = DEFAULT_CHECKLIST.filter((i) => i.category === `gear`);
  const weatherItems = DEFAULT_CHECKLIST.filter((i) => i.category === `weather`);

  const isIdle = status === `idle`;
  const isRecording = status === `recording`;
  const isPaused = status === `paused`;
  const isActive = isRecording || isPaused;

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* ── Live stats strip (visible while recording/paused) ── */}
      {isActive && (
        <div className={styles.statsStrip}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{recorder.distanceKm.toFixed(2)}</span>
            <span className={styles.statUnit}>km</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatDuration(recorder.durationSec)}</span>
            <span className={styles.statUnit}>čas</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>{Math.round(recorder.currentSpeedKmh ?? 0)}</span>
            <span className={styles.statUnit}>km/h</span>
          </div>
          <div className={styles.statDivider} />
          <GpsQualityBadge quality={(recorder.gpsQuality as GpsQuality) ?? `lost`} />
        </div>
      )}

      {/* ── Main controls ── */}
      <div className={classNames(styles.controls, { [styles.activeControls]: isActive })}>
        {isIdle && (
          <div className={styles.startWrapper}>
            <div className={styles.pulseRing} />
            <div className={styles.pulseRing2} />
            <CtaButton
              variant="start-ride"
              leftIcon={<PlayIcon />}
              onClick={() => handlePlayClick()}
              className={styles.startButton}
            >
              Začni vožnjo
            </CtaButton>
          </div>
        )}

        {isActive && (
          <div className={styles.activeRow}>
            {isRecording && (
              <button
                type="button"
                className={classNames(styles.controlBtn, styles.pauseBtn)}
                onClick={() => handlePause()}
                aria-label="Pavza"
              >
                <PauseIcon />
                <span className={styles.controlBtnLabel}>Pavza</span>
              </button>
            )}

            {isPaused && (
              <button
                type="button"
                className={classNames(styles.controlBtn, styles.resumeBtn)}
                onClick={() => handleResume()}
                aria-label="Nadaljuj"
              >
                <ResumeIcon />
                <span className={styles.controlBtnLabel}>Nadaljuj</span>
              </button>
            )}

            <div className={styles.recordingIndicator}>
              <div className={classNames(styles.recDot, { [styles.recDotPaused]: isPaused })} />
              <span className={styles.recLabel}>{isPaused ? `Pavza` : `Snemanje`}</span>
            </div>

            <button
              type="button"
              className={classNames(styles.controlBtn, styles.stopBtn)}
              onClick={() => handleStop()}
              aria-label="Ustavi"
            >
              <StopIcon />
              <span className={styles.controlBtnLabel}>Ustavi</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Pre-ride checklist modal ── */}
      <Modal
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        title="Pred-vožnja preveritev"
        size="md"
        footer={
          <>
            <button
              type="button"
              className={styles.modalSecondaryBtn}
              onClick={() => setChecklistOpen(false)}
            >
              Prekliči
            </button>
            <button
              type="button"
              className={classNames(styles.modalPrimaryBtn, { [styles.modalPrimaryBtnDisabled]: !allChecked })}
              onClick={() => handleStartAfterChecklist()}
              disabled={!allChecked}
            >
              <PlayIcon />
              Začni vožnjo
            </button>
          </>
        }
      >
        <div className={styles.checklistBody}>
          <Paragraph variant="body" color="secondary">
            Preveri vso opremo in vremenske razmere preden začneš vožnjo. Tvoja varnost je na prvem mestu.
          </Paragraph>

          <button
            type="button"
            className={styles.checkAllBtn}
            onClick={() => handleCheckAll()}
          >
            <div className={classNames(styles.checkAllBox, { [styles.checkAllBoxChecked]: allChecked })}>
              {allChecked && <CheckIcon />}
            </div>
            <span>{allChecked ? `Počisti vse` : `Označi vse`}</span>
          </button>

          <div className={styles.checklistSection}>
            <Heading level={6} size="xs" color="secondary">
              🏍️ Oprema
            </Heading>
            <div className={styles.checklistItems}>
              {gearItems.map((item) => {
                const checked = checkedIds.has(item.id);
                return (
                  <label
                    key={item.id}
                    className={classNames(styles.checkItem, { [styles.checkItemChecked]: checked })}
                  >
                    <input
                      type="checkbox"
                      className={styles.checkInput}
                      checked={checked}
                      onChange={() => handleToggleCheck(item.id)}
                    />
                    <div className={classNames(styles.checkBox, { [styles.checkBoxChecked]: checked })}>
                      {checked && <CheckIcon />}
                    </div>
                    <span className={styles.checkLabel}>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.checklistSection}>
            <Heading level={6} size="xs" color="secondary">
              🌤️ Vreme
            </Heading>
            <div className={styles.checklistItems}>
              {weatherItems.map((item) => {
                const checked = checkedIds.has(item.id);
                return (
                  <label
                    key={item.id}
                    className={classNames(styles.checkItem, { [styles.checkItemChecked]: checked })}
                  >
                    <input
                      type="checkbox"
                      className={styles.checkInput}
                      checked={checked}
                      onChange={() => handleToggleCheck(item.id)}
                    />
                    <div className={classNames(styles.checkBox, { [styles.checkBoxChecked]: checked })}>
                      {checked && <CheckIcon />}
                    </div>
                    <span className={styles.checkLabel}>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.checklistProgress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(checkedIds.size / DEFAULT_CHECKLIST.length) * 100}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {checkedIds.size} / {DEFAULT_CHECKLIST.length} preverjeno
            </span>
          </div>
        </div>
      </Modal>

      {/* ── Save ride modal ── */}
      <Modal
        open={saveOpen}
        onClose={() => handleDiscard()}
        title="Shrani vožnjo"
        size="sm"
        closeOnBackdrop={false}
        footer={
          <>
            <button
              type="button"
              className={styles.modalDangerBtn}
              onClick={() => handleDiscard()}
              disabled={saving}
            >
              Zavrzi
            </button>
            <button
              type="button"
              className={classNames(styles.modalPrimaryBtn, { [styles.modalPrimaryBtnLoading]: saving })}
              onClick={() => { void handleSave(); }}
              disabled={saving}
            >
              <SaveIcon />
              {saving ? `Shranjujem...` : `Shrani vožnjo`}
            </button>
          </>
        }
      >
        <div className={styles.saveBody}>
          <div className={styles.rideSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{recorder.distanceKm.toFixed(2)}</span>
              <span className={styles.summaryUnit}>km</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{formatDuration(recorder.durationSec)}</span>
              <span className={styles.summaryUnit}>čas</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{Math.round(recorder.maxSpeedKmh ?? 0)}</span>
              <span className={styles.summaryUnit}>km/h max</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="ride-name">
              Ime vožnje
            </label>
            <input
              id="ride-name"
              type="text"
              className={styles.fieldInput}
              placeholder="npr. Jutrannja vožnja po Krasu"
              value={rideName}
              onChange={(e) => setRideName(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="ride-notes">
              Opombe
            </label>
            <textarea
              id="ride-notes"
              className={classNames(styles.fieldInput, styles.fieldTextarea)}
              placeholder="Kako je bila vožnja? Posebnosti, pogoji..."
              value={rideNotes}
              onChange={(e) => setRideNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {saveError && (
            <div className={styles.saveError}>
              {saveError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
