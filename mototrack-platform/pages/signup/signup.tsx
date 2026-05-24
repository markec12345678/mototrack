import React, { useState } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Card } from '@markec/mototrack-design.content.card';
import { Logo } from '@markec/mototrack-design.content.logo';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Button } from '@markec/mototrack-design.actions.button';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import { SelectList } from '@markec/mototrack-design.inputs.select-list';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import type { SelectOption } from '@markec/mototrack-design.inputs.select-list';
import styles from './signup.module.scss';

const BALKAN_COUNTRIES: SelectOption[] = [
  { value: `SI`, label: `🇸🇮 Slovenija` },
  { value: `HR`, label: `🇭🇷 Hrvaška` },
  { value: `BA`, label: `🇧🇦 Bosna in Hercegovina` },
  { value: `RS`, label: `🇷🇸 Srbija` },
  { value: `ME`, label: `🇲🇪 Črna gora` },
  { value: `MK`, label: `🇲🇰 Severna Makedonija` },
  { value: `AL`, label: `🇦🇱 Albanija` },
  { value: `BG`, label: `🇧🇬 Bolgarija` },
  { value: `RO`, label: `🇷🇴 Romunija` },
  { value: `GR`, label: `🇬🇷 Grčija` },
];

export type SignupProps = {
  /**
   * Path to redirect after successful signup.
   */
  redirectTo?: string;

  /**
   * Path to the login page.
   */
  loginPath?: string;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

export function Signup({
  redirectTo = `/`,
  loginPath = `/login`,
  className,
  style,
}: SignupProps) {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [email, setEmail] = useState(``);
  const [username, setUsername] = useState(``);
  const [displayName, setDisplayName] = useState(``);
  const [password, setPassword] = useState(``);
  const [country, setCountry] = useState(``);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(``);

  const emailError = submitted && !email ? `E-poštni naslov je obvezen.` : submitted && !email.includes(`@`) ? `Vnesite veljaven e-poštni naslov.` : ``;
  const usernameError = submitted && !username ? `Uporabniško ime je obvezno.` : ``;
  const displayNameError = submitted && !displayName ? `Prikazno ime je obvezno.` : ``;
  const passwordError = submitted && !password ? `Geslo je obvezno.` : submitted && password.length < 8 ? `Geslo mora imeti vsaj 8 znakov.` : ``;
  const countryError = submitted && !country ? `Izberite državo.` : ``;

  const hasErrors = Boolean(emailError || usernameError || displayNameError || passwordError || countryError);

  const handleSubmit = async () => {
    setSubmitted(true);
    setServerError(``);

    if (!email || !email.includes(`@`) || !username || !displayName || !password || password.length < 8 || !country) {
      return;
    }

    try {
      await signup({ email, username, displayName, password, country });
      navigate(redirectTo);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Registracija ni uspela. Poskusite znova.`;
      setServerError(message);
    }
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Logo size="md" href="/" />
        </div>

        <Card variant="elevated" padding="xl" className={styles.card}>
          <div className={styles.header}>
            <Heading level={1} size="xl" color="primary">
              Registracija
            </Heading>
            <Paragraph variant="body" color="secondary">
              Ustvari račun in začni slediti svojim motociklističnim pustolovščinam po Balkanu.
            </Paragraph>
          </div>

          <div className={styles.form}>
            <TextInput
              type="email"
              label="E-poštni naslov"
              placeholder="tvoj@email.com"
              value={email}
              onChange={(v) => setEmail(v)}
              errorMessage={emailError || undefined}
              helperText={!emailError ? `Nikoli ga ne bomo delili z drugimi.` : undefined}
              leftIcon={<MailIcon />}
              required
            />

            <TextInput
              type="text"
              label="Uporabniško ime"
              placeholder="npr. motorider46"
              value={username}
              onChange={(v) => setUsername(v)}
              errorMessage={usernameError || undefined}
              helperText={!usernameError ? `Edinstveno ime za tvoj profil.` : undefined}
              leftIcon={<AtIcon />}
              required
            />

            <TextInput
              type="text"
              label="Prikazno ime"
              placeholder="npr. Marko Novak"
              value={displayName}
              onChange={(v) => setDisplayName(v)}
              errorMessage={displayNameError || undefined}
              helperText={!displayNameError ? `Ime, ki ga vidijo drugi kolesarji.` : undefined}
              leftIcon={<UserIcon />}
              required
            />

            <TextInput
              type="password"
              label="Geslo"
              placeholder="••••••••"
              value={password}
              onChange={(v) => setPassword(v)}
              errorMessage={passwordError || undefined}
              helperText={!passwordError ? `Najmanj 8 znakov.` : undefined}
              leftIcon={<LockIcon />}
              required
            />

            <SelectList
              label="Država"
              options={BALKAN_COUNTRIES}
              value={country}
              placeholder="Izberi svojo državo..."
              error={countryError || undefined}
              onChange={(v) => setCountry(v)}
              required
            />

            {serverError && (
              <div className={styles.serverError} role="alert">
                <AlertIcon />
                <span>{serverError}</span>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              onClick={() => { void handleSubmit(); }}
              type="button"
            >
              Registriraj se
            </Button>
          </div>

          <div className={styles.footer}>
            <Paragraph variant="body" color="secondary">
              Že imaš račun?{` `}
              <button
                type="button"
                className={styles.loginLink}
                onClick={() => navigate(loginPath)}
              >
                Prijavi se
              </button>
            </Paragraph>
          </div>
        </Card>

        <div className={styles.terms}>
          <Paragraph variant="caption" color="muted">
            Z registracijo sprejemaš naše{` `}
            <button type="button" className={styles.termsLink}>Pogoje uporabe</button>
            {` `}in{` `}
            <button type="button" className={styles.termsLink}>Politiko zasebnosti</button>.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 8c0 1.657.672 2.5 1.5 2.5s1.5-.843 1.5-2.5a5.5 5.5 0 1 0-2.5 4.677" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}
