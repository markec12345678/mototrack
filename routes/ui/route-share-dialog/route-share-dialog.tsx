import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { Button } from '@markec/mototrack-design.actions.button';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { useRouteShare } from '@markec/routes.hooks.use-route-share';
import type { PlannedRoute } from '@markec/routes.entities.planned-route';
import styles from './route-share-dialog.module.scss';

export type RouteShareDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;

  /**
   * Callback fired when the dialog requests to be closed.
   */
  onClose: () => void;

  /**
   * The planned route to share.
   */
  route: PlannedRoute;

  /**
   * Additional class name applied to the dialog.
   */
  className?: string;

  /**
   * Inline styles for the dialog.
   */
  style?: React.CSSProperties;
};

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 4.5H2.5A1.5 1.5 0 001 6v6.5A1.5 1.5 0 002.5 14h6A1.5 1.5 0 0010 12.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2L8 10M8 2L5 5M8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.5" y="2.5" width="2" height="2" fill="currentColor" />
      <rect x="11.5" y="2.5" width="2" height="2" fill="currentColor" />
      <rect x="2.5" y="11.5" width="2" height="2" fill="currentColor" />
      <path d="M10 10h2M12 10v2M12 12h2M14 12v2M10 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type ShareState = 'idle' | 'loading' | 'ready' | 'error';

export function RouteShareDialog({
  open,
  onClose,
  route,
  className,
  style,
}: RouteShareDialogProps) {
  const { share } = useRouteShare();
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [shareCode, setShareCode] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [nativeShareSupported] = useState(() => typeof navigator !== 'undefined' && Boolean(navigator.share));

  const shareLink = shareCode ? `https://mototrack.app/r/${shareCode}` : '';

  const handleGenerateShare = useCallback(async () => {
    setShareState('loading');
    try {
      const result = await share(route);
      setShareCode(result.code);
      setQrUrl(result.qrUrl);
      setExpiresAt(result.expiresAt);
      setShareState('ready');
    } catch {
      setShareState('error');
    }
  }, [share, route]);

  const handleCopyLink = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select text
    }
  }, [shareLink]);

  const handleNativeShare = useCallback(async () => {
    if (!nativeShareSupported || !shareLink) return;
    try {
      await navigator.share({
        title: `MotoTrack Route: ${route.name}`,
        text: `Check out this motorcycle route on MotoTrack — ${route.name} (${route.distanceKm.toFixed(0)} km)`,
        url: shareLink,
      });
    } catch {
      // user cancelled or share failed
    }
  }, [nativeShareSupported, shareLink, route]);

  const handleClose = useCallback(() => {
    setShareState('idle');
    setShareCode('');
    setQrUrl('');
    setExpiresAt(0);
    setCopied(false);
    onClose();
  }, [onClose]);

  const expiryDate = expiresAt ? new Date(expiresAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Share Route"
      size="sm"
      className={classNames(className)}
      style={style}
      footer={
        shareState === 'ready' ? (
          <div className={styles.footerRow}>
            <Button
              variant="ghost"
              size="md"
              onClick={() => handleClose()}
            >
              Close
            </Button>
            {nativeShareSupported && (
              <Button
                variant="primary"
                size="md"
                leftIcon={<ShareIcon />}
                onClick={() => handleNativeShare()}
              >
                Share
              </Button>
            )}
            {!nativeShareSupported && (
              <Button
                variant="primary"
                size="md"
                leftIcon={copied ? <CheckIcon /> : <ClipboardIcon />}
                onClick={() => handleCopyLink()}
              >
                {copied ? `Copied!` : `Copy Link`}
              </Button>
            )}
          </div>
        ) : undefined
      }
    >
      <div className={styles.body}>
        {/* Route info header */}
        <div className={styles.routeInfo}>
          <div className={styles.routeMeta}>
            <Heading level={5} size="md" color="primary">
              {route.name}
            </Heading>
            <div className={styles.routeStats}>
              <Paragraph variant="caption" color="muted">
                {route.distanceKm.toFixed(0)} km
              </Paragraph>
              <span className={styles.dot} />
              <Paragraph variant="caption" color="muted">
                {Math.round(route.durationSec / 60)} min
              </Paragraph>
              <span className={styles.dot} />
              <Badge variant="neutral" label={route.mode} size="sm" />
            </div>
          </div>
        </div>

        {/* Idle state — generate button */}
        {shareState === 'idle' && (
          <div className={styles.idleState}>
            <div className={styles.idleIllustration}>
              <div className={styles.qrPlaceholder}>
                <QrIcon />
              </div>
            </div>
            <Paragraph variant="body" color="secondary" className={styles.idleDescription}>
              Generate a shareable link and QR code for this route. The link expires after 24 hours.
            </Paragraph>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ShareIcon />}
              onClick={() => handleGenerateShare()}
            >
              Generate Share Link
            </Button>
          </div>
        )}

        {/* Loading state */}
        {shareState === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <Paragraph variant="body" color="secondary">
              Generating your share link…
            </Paragraph>
          </div>
        )}

        {/* Error state */}
        {shareState === 'error' && (
          <div className={styles.errorState}>
            <Paragraph variant="body" color="secondary">
              Failed to generate share link. Please try again.
            </Paragraph>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleGenerateShare()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Ready state */}
        {shareState === 'ready' && (
          <div className={styles.readyState}>
            {/* QR Code */}
            {qrUrl && (
              <div className={styles.qrWrapper}>
                <img
                  src={qrUrl}
                  alt={`QR code for route ${route.name}`}
                  className={styles.qrImage}
                />
              </div>
            )}

            {/* Share code */}
            <div className={styles.codeSection}>
              <Paragraph variant="label" color="muted">
                Share Code
              </Paragraph>
              <div className={styles.codeDisplay}>
                <span className={styles.codeText}>{shareCode}</span>
                <button
                  type="button"
                  className={styles.codeAction}
                  onClick={() => handleCopyLink()}
                  aria-label="Copy share code"
                >
                  {copied ? <CheckIcon /> : <ClipboardIcon />}
                </button>
              </div>
            </div>

            {/* Share link */}
            <div className={styles.linkSection}>
              <Paragraph variant="label" color="muted">
                Share Link
              </Paragraph>
              <div className={styles.linkRow}>
                <span className={styles.linkText}>{shareLink}</span>
                <button
                  type="button"
                  className={classNames(styles.copyButton, { [styles.copyButtonCopied]: copied })}
                  onClick={() => handleCopyLink()}
                  aria-label="Copy link"
                >
                  {copied ? <CheckIcon /> : <ClipboardIcon />}
                  <span>{copied ? `Copied!` : `Copy`}</span>
                </button>
              </div>
            </div>

            {/* Expiry note */}
            <div className={styles.expiryNote}>
              <ClockIcon />
              <Paragraph variant="caption" color="muted">
                {expiryDate
                  ? `Link expires today at ${expiryDate} (24h)`
                  : `Link expires in 24 hours`}
              </Paragraph>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
