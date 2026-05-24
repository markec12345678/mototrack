import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Logo } from '@markec/mototrack-design.content.logo';
import { Card } from '@markec/mototrack-design.content.card';
import { Button } from '@markec/mototrack-design.actions.button';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import styles from './login.module.scss';

export type LoginProps = {
  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;

  /**
   * Path to redirect to on successful login.
   */
  redirectTo?: string;

  /**
   * Path to the signup page.
   */
  signupPath?: string;
};

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13" r="0.75" fill="currentColor" />
    </svg>
  );
}

type ToastType = 'success' | 'error';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

let toastCounter = 0;

/**
 * Login page in Slovenian.
 * Centered card with logo, 'Prijava' heading, email + password inputs,
 * primary 'Prijavi se' button, link to signup.
 * Demo-credentials hint: 'Demo: markec@mototrack.app / motorider2025'.
 * Calls useAuth.login. On success redirects to /. Shows error toast on failure.
 */
export function Login({
  className,
  style,
  redirectTo = `/`,
  signupPath = `/registracija`,
}: LoginProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await login(email, password);
      addToast(`success`, `Prijava uspešna! Dobrodošli nazaj.`);
      setTimeout(() => {
        navigate(redirectTo);
      }, 800);
    } catch {
      addToast(`error`, `Prijava ni uspela. Preverite e-pošto in geslo.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      {/* Toast container */}
      <div className={styles.toastContainer} aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={classNames(styles.toast, {
              [styles.toastSuccess]: toast.type === `success`,
              [styles.toastError]: toast.type === `error`,
            })}
          >
            <span className={styles.toastIcon}>
              {toast.type === `success` ? <CheckCircleIcon /> : <AlertIcon />}
            </span>
            <span className={styles.toastMessage}>{toast.message}</span>
            <button
              type="button"
              className={styles.toastClose}
              onClick={() => removeToast(toast.id)}
              aria-label="Zapri obvestilo"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Background decoration */}
      <div className={styles.bgDecoration} aria-hidden="true">
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
        <div className={styles.bgGrid} />
      </div>

      {/* Centered card */}
      <div className={styles.cardWrapper}>
        <Card variant="elevated" padding="xl" className={styles.card}>
          {/* Logo */}
          <div className={styles.logoRow}>
            <Logo size="md" href="/" />
          </div>

          {/* Heading */}
          <div className={styles.headingRow}>
            <Heading level={1} size="xl" color="primary">
              Prijava
            </Heading>
            <Paragraph variant="body" color="secondary">
              Dobrodošli nazaj v MotoTrack skupnost
            </Paragraph>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={(e) => { void handleSubmit(e); }}>
            <TextInput
              type="email"
              label="E-poštni naslov"
              placeholder="vnesite@email.com"
              value={email}
              onChange={(v) => setEmail(v)}
              leftIcon={<MailIcon />}
              required
              disabled={isLoading}
            />

            <TextInput
              type="password"
              label="Geslo"
              placeholder="••••••••"
              value={password}
              onChange={(v) => setPassword(v)}
              leftIcon={<LockIcon />}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Prijavi se
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className={styles.demoHint}>
            <div className={styles.demoHintInner}>
              <span className={styles.demoLabel}>Demo dostop</span>
              <code className={styles.demoCredentials}>
                markec@mototrack.app / motorider2025
              </code>
            </div>
          </div>

          {/* Signup link */}
          <div className={styles.signupRow}>
            <Paragraph variant="caption" color="muted">
              Še nimate računa?
            </Paragraph>
            <a href={signupPath} className={styles.signupLink}>
              Registracija
            </a>
          </div>
        </Card>

        {/* Bottom tagline */}
        <div className={styles.tagline}>
          <Paragraph variant="caption" color="muted">
            Sledite vsakemu ovinku. Premagajte vsako cesto.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
