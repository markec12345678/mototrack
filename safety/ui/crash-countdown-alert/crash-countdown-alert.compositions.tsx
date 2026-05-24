import * as React from 'react';
import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { Heading } from '@markec/mototrack-design.typography.heading';

// ── Shared icon ────────────────────────────────────────────────────────────

function ShieldAlertIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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

// ── Inline preview of the alert UI (no real hook) ──────────────────────────

type PreviewAlertProps = {
  countdownSeconds?: number;
  open: boolean;
  onCancel: () => void;
};

function PreviewAlert({ countdownSeconds = 15, open, onCancel }: PreviewAlertProps) {
  const [secondsLeft, setSecondsLeft] = React.useState(countdownSeconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (!open) {
      setSecondsLeft(countdownSeconds);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    setSecondsLeft(countdownSeconds);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
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
  }, [open, countdownSeconds]);

  const progress = secondsLeft / countdownSeconds;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - progress);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      closeOnBackdrop={false}
      closeOnEsc={false}
      size="sm"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', padding: '16px 8px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(239,68,68,0.4)', animation: open ? 'pulseRing 2s ease-out infinite' : 'none' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(239,68,68,0.4)', animation: open ? 'pulseRing 2s ease-out 0.8s infinite' : 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(239,68,68,0.3)' }}>
            <ShieldAlertIcon />
          </div>
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)', zIndex: 3, pointerEvents: 'none' } as React.CSSProperties}
            viewBox="0 0 120 120"
          >
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="4" stroke="rgba(239,68,68,0.12)" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="4"
              stroke="#ef4444"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear', filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.6))' } as React.CSSProperties}
            />
          </svg>
        </div>

        <Heading level={2} size="xl" color="danger">
          Zaznan trk!
        </Heading>

        <p style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5 }}>
          SOS bo poslan čez{' '}
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', fontVariantNumeric: 'tabular-nums' as const }}>{secondsLeft}</span>
          {' '}s.
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
          Pritisni &ldquo;Sem v redu&rdquo; za preklic.
        </p>

        <div style={{ width: '100%', marginTop: '8px' }}>
          <CtaButton variant="sos" fullWidth onClick={() => onCancel()}>
            ✓ Sem v redu
          </CtaButton>
        </div>

        <div style={{ width: '100%', height: '4px', borderRadius: '9999px', backgroundColor: 'rgba(239,68,68,0.15)', overflow: 'hidden' }}>
          <div
            style={{ height: '100%', background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: '9999px', transition: 'width 0.9s linear', width: `${progress * 100}%` } as React.CSSProperties}
          />
        </div>
      </div>
    </Modal>
  );
}

// ── Compositions ───────────────────────────────────────────────────────────

/**
 * ActiveCrashAlert — the modal as it appears immediately after a crash is detected.
 * The 15-second countdown ticks live. Press "Sem v redu" to dismiss.
 */
export const ActiveCrashAlert = () => {
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    setDismissed(true);
  };

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '40px',
        }}
      >
        {dismissed ? (
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34,197,94,0.15)',
                border: '2px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 14l7 7 11-11" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
              SOS preklican
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              Veseli nas, da si v redu! Vozi varno.
            </p>
            <button
              type="button"
              onClick={() => { setOpen(true); setDismissed(false); }}
              style={{
                marginTop: '8px',
                padding: '10px 24px',
                backgroundColor: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '8px',
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Simuliraj trk znova
            </button>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            Zaznan trk — modal se prikazuje...
          </p>
        )}

        <PreviewAlert open={open} onCancel={handleCancel} />
      </div>
    </MockProvider>
  );
};

/**
 * ShortCountdown — same alert with a 5-second countdown for quick preview.
 */
export const ShortCountdown = () => {
  const [open, setOpen] = useState(true);
  const [sosSent, setSosSent] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open && !sosSent) return;
    const timer = setTimeout(() => {
      if (open) {
        setOpen(false);
        setSosSent(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [open, sosSent]);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '40px',
        }}
      >
        {sosSent && (
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>
              🚨 SOS poslan!
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Reševalne službe so bile obveščene.
            </p>
          </div>
        )}

        {!open && !sosSent && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#22c55e' }}>
              ✓ SOS preklican — si v redu!
            </p>
            <button
              type="button"
              onClick={() => { setOpen(true); setSosSent(false); }}
              style={{
                padding: '10px 24px',
                backgroundColor: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '8px',
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ponovi simulacijo
            </button>
          </div>
        )}

        <PreviewAlert countdownSeconds={5} open={open} onCancel={handleCancel} />
      </div>
    </MockProvider>
  );
};

/**
 * TriggerSimulation — shows a "Simulate Crash" button to trigger the alert on demand.
 */
export const TriggerSimulation = () => {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const handleTrigger = () => {
    setOpen(true);
    addLog(`Trk zaznan — začetek odštevanja 15s`);
  };

  const handleCancel = () => {
    setOpen(false);
    addLog(`SOS preklican s strani voznika`);
  };

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          padding: '40px',
        }}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '28px 32px',
            border: '1px solid rgba(148,163,184,0.1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              backgroundColor: open ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.1)',
              borderRadius: '9999px',
              border: `1px solid ${open ? 'rgba(239,68,68,0.35)' : 'rgba(34,197,94,0.25)'}`,
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: open ? '#ef4444' : '#22c55e',
                boxShadow: open ? '0 0 6px rgba(239,68,68,0.8)' : '0 0 6px rgba(34,197,94,0.8)',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: open ? '#ef4444' : '#22c55e',
                letterSpacing: '0.08em',
              }}
            >
              {open ? 'TRK ZAZNAN' : 'MONITORING AKTIVEN'}
            </span>
          </div>

          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '20px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            Simulacija trka
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
            Pritisni gumb za simulacijo zaznanega trka in prikaz SOS odštevanja.
          </p>

          <CtaButton
            variant={open ? 'save-route' : 'sos'}
            fullWidth
            disabled={open}
            onClick={() => handleTrigger()}
          >
            {open ? '⏳ Odštevanje teče...' : '💥 Simuliraj trk'}
          </CtaButton>
        </div>

        {log.length > 0 && (
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <p
              style={{
                margin: '0 0 12px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              Dnevnik dogodkov
            </p>
            {log.map((entry, i) => (
              <p
                key={i}
                style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  color: i === 0 ? '#f1f5f9' : '#475569',
                  fontFamily: 'monospace',
                  lineHeight: 1.5,
                }}
              >
                {entry}
              </p>
            ))}
          </div>
        )}

        <PreviewAlert open={open} onCancel={handleCancel} />
      </div>
    </MockProvider>
  );
};
