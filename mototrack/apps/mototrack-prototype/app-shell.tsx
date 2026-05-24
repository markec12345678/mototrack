import type { ReactNode } from 'react';
import { Logo } from '@markec/mototrack-design.content.logo';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import type { TabKey } from './app-types.js';
import styles from './app-shell.module.css';

const TAB_ITEMS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'map', label: 'Zemljevid', icon: '🗺️' },
  { key: 'plan', label: 'Načrtuj', icon: '🛤️' },
  { key: 'track', label: 'Sledi', icon: '▶️' },
  { key: 'explore', label: 'Raziskuj', icon: '🧭' },
  { key: 'profile', label: 'Profil', icon: '👤' },
];

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpenChat: () => void;
  children: ReactNode;
};

/** Main application shell with header, tab content area, and bottom navigation. */
export function AppShell({ activeTab, onTabChange, onOpenChat, children }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Logo size="md" href="/" tag="Balkan" />
        <div className={styles.headerActions}>
          <IconButton
            icon={<span style={{ fontSize: '1.1rem' }}>💬</span>}
            variant="ghost"
            size="md"
            title="MotoChat AI"
            aria-label="MotoChat AI"
            onClick={onOpenChat}
          />
          <CtaButton variant="sos" aria-label="SOS klic v sili">
            SOS
          </CtaButton>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <nav className={styles.bottomNav} aria-label="Primary navigation">
        <Tabs
          items={TAB_ITEMS.map((t) => ({ key: t.key, label: t.label, icon: t.icon }))}
          activeKey={activeTab}
          onTabChange={(key) => onTabChange(key as TabKey)}
        />
      </nav>
    </div>
  );
}
