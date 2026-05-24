import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MotoChatPanel } from './moto-chat-panel.js';
import type { QuickPrompt } from '@markec/ai-assistant.ui.quick-prompts';

/* ── Trigger button helper ─────────────────────────────────────────────────── */

function TriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      style={{
        display: `inline-flex`,
        alignItems: `center`,
        gap: `10px`,
        padding: `12px 24px`,
        backgroundColor: `#f97316`,
        color: `#020617`,
        border: `none`,
        borderRadius: `12px`,
        fontWeight: `800`,
        fontSize: `15px`,
        cursor: `pointer`,
        letterSpacing: `-0.01em`,
        boxShadow: `0 4px 16px rgba(249,115,22,0.4)`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
      </svg>
      Odpri MotoChat
    </button>
  );
}

/* ── Page shell ────────────────────────────────────────────────────────────── */

function PageShell({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: `100vh`,
        backgroundColor: `#020617`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        padding: `40px`,
        position: `relative`,
        overflow: `hidden`,
      }}
    >
      <div
        style={{
          position: `absolute`,
          inset: 0,
          background: `radial-gradient(ellipse at 70% 50%, rgba(249,115,22,0.06) 0%, transparent 60%)`,
          pointerEvents: `none`,
        }}
      />
      <div style={{ position: `relative`, zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Default — panel with default Slovenian quick prompts, opens/closes via button.
 */
export const Default = () => {
  const [open, setOpen] = useState(false);

  return (
    <MockProvider>
      <PageShell>
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            AI Asistent
          </p>
          <h2
            style={{
              margin: `0 0 24px`,
              fontSize: `28px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            MotoChat Panel
          </h2>
          <TriggerButton onClick={() => setOpen(true)} />
          <p style={{ margin: `16px 0 0`, fontSize: `13px`, color: `#64748b` }}>
            Pritisnite Esc ali kliknite ozadje za zaprtje
          </p>
        </div>
        <MotoChatPanel
          open={open}
          onClose={() => setOpen(false)}
        />
      </PageShell>
    </MockProvider>
  );
};

/**
 * OpenByDefault — panel pre-opened to showcase the empty state and quick prompts.
 */
export const OpenByDefault = () => {
  const [open, setOpen] = useState(true);

  return (
    <MockProvider>
      <PageShell>
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Prazno stanje
          </p>
          <h2
            style={{
              margin: `0 0 24px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Začetni zaslon
          </h2>
          {!open && <TriggerButton onClick={() => setOpen(true)} />}
        </div>
        <MotoChatPanel
          open={open}
          onClose={() => setOpen(false)}
          subtitle="Vaš AI sopotnik na vsakem izletu"
        />
      </PageShell>
    </MockProvider>
  );
};

/**
 * CustomPrompts — panel with custom Alpine route quick prompts.
 */
export const CustomPrompts = () => {
  const [open, setOpen] = useState(true);

  const alpinePrompts: QuickPrompt[] = [
    { id: `1`, label: `Najboljša pot čez Stelvio Pass` },
    { id: `2`, label: `Vreme na Col du Galibier danes` },
    { id: `3`, label: `Parkirišča pri Grossglockner` },
    { id: `4`, label: `Restavracije na Furkapass` },
    { id: `5`, label: `Alternativna pot mimo Brennerja` },
  ];

  return (
    <MockProvider>
      <PageShell>
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Alpske poti
          </p>
          <h2
            style={{
              margin: `0 0 24px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Prilagojeni predlogi
          </h2>
          {!open && <TriggerButton onClick={() => setOpen(true)} />}
        </div>
        <MotoChatPanel
          open={open}
          onClose={() => setOpen(false)}
          subtitle="Alpski AI vodnik za motocikliste"
          quickPrompts={alpinePrompts}
        />
      </PageShell>
    </MockProvider>
  );
};
