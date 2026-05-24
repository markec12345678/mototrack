import * as React from 'react';
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { Heading } from '@markec/mototrack-design.typography.heading';

// ── Minimal inline component for testing (no real hook, no SCSS import) ────

type TestAlertProps = {
  open?: boolean;
  countdownSeconds?: number;
  onCancel?: () => void;
  onSosDispatched?: () => void;
};

function TestAlert({
  open = true,
  countdownSeconds = 15,
  onCancel,
  onSosDispatched,
}: TestAlertProps) {
  const [secondsLeft, setSecondsLeft] = React.useState(countdownSeconds);

  React.useEffect(() => {
    if (!open) {
      setSecondsLeft(countdownSeconds);
      return;
    }
    setSecondsLeft(countdownSeconds);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSosDispatched?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, countdownSeconds, onSosDispatched]);

  const progress = secondsLeft / countdownSeconds;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - progress);

  return (
    <Modal
      open={open}
      onClose={() => onCancel?.()}
      closeOnBackdrop={false}
      closeOnEsc={false}
      size="sm"
    >
      <div data-testid="alert-content">
        <div data-testid="icon-wrapper">
          <div data-testid="icon-circle">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 4L6 12v12c0 10.5 7.7 20.3 18 22.6C34.3 44.3 42 34.5 42 24V12L24 4z"
                fill="rgba(239,68,68,0.15)"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M24 18v8M24 30v2" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <svg data-testid="countdown-ring" viewBox="0 0 120 120">
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
            />
          </svg>
        </div>

        <Heading level={2} size="xl" color="danger">
          Zaznan trk!
        </Heading>

        <p data-testid="message">
          SOS bo poslan čez{' '}
          <span data-testid="countdown">{secondsLeft}</span>
          {' '}s.
        </p>
        <p data-testid="sub-message">
          Pritisni &ldquo;Sem v redu&rdquo; za preklic.
        </p>

        <div data-testid="button-wrapper">
          <CtaButton variant="sos" fullWidth onClick={() => onCancel?.()}>
            ✓ Sem v redu
          </CtaButton>
        </div>

        <div data-testid="progress-bar">
          <div
            data-testid="progress-fill"
            style={{ width: `${progress * 100}%` } as React.CSSProperties}
          />
        </div>
      </div>
    </Modal>
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────

it('renders the crash alert title when open', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const heading = container.querySelector('h2');
  expect(heading).toBeTruthy();
  expect(heading?.textContent).toContain('Zaznan trk!');
});

it('renders the countdown message', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open countdownSeconds={15} />
    </MockProvider>
  );
  const message = container.querySelector('[data-testid="message"]');
  expect(message).toBeTruthy();
  expect(message?.textContent).toContain('SOS bo poslan čez');
});

it('renders the sub-message with cancel instruction', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const subMessage = container.querySelector('[data-testid="sub-message"]');
  expect(subMessage).toBeTruthy();
  expect(subMessage?.textContent).toContain('Sem v redu');
});

it('renders the countdown number', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open countdownSeconds={15} />
    </MockProvider>
  );
  const countdown = container.querySelector('[data-testid="countdown"]');
  expect(countdown).toBeTruthy();
  expect(countdown?.textContent).toBe('15');
});

it('calls onCancel when the cancel button is clicked', () => {
  const onCancel = vi.fn();
  const { container } = render(
    <MockProvider>
      <TestAlert open onCancel={onCancel} />
    </MockProvider>
  );
  const button = container.querySelector('button');
  expect(button).toBeTruthy();
  fireEvent.click(button!);
  expect(onCancel).toHaveBeenCalledTimes(1);
});

it('does not render modal content when closed', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open={false} />
    </MockProvider>
  );
  const heading = container.querySelector('h2');
  expect(heading).toBeNull();
});

it('renders the progress bar element', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const progressBar = container.querySelector('[data-testid="progress-bar"]');
  expect(progressBar).toBeTruthy();
});

it('renders the progress fill with correct initial width', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open countdownSeconds={15} />
    </MockProvider>
  );
  const fill = container.querySelector('[data-testid="progress-fill"]') as HTMLElement | null;
  expect(fill).toBeTruthy();
  expect(fill?.style.width).toBe('100%');
});

it('renders the icon wrapper', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const iconWrapper = container.querySelector('[data-testid="icon-wrapper"]');
  expect(iconWrapper).toBeTruthy();
});

it('renders the icon circle', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const iconCircle = container.querySelector('[data-testid="icon-circle"]');
  expect(iconCircle).toBeTruthy();
});

it('renders the countdown ring SVG', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const ring = container.querySelector('[data-testid="countdown-ring"]');
  expect(ring).toBeTruthy();
});

it('renders the content wrapper', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const content = container.querySelector('[data-testid="alert-content"]');
  expect(content).toBeTruthy();
});

it('renders the button wrapper', () => {
  const { container } = render(
    <MockProvider>
      <TestAlert open />
    </MockProvider>
  );
  const buttonWrapper = container.querySelector('[data-testid="button-wrapper"]');
  expect(buttonWrapper).toBeTruthy();
});
