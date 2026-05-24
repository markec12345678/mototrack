import { useState } from 'react';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { Button } from '@markec/mototrack-design.actions.button';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import { CountryFlag, type CountryCode } from '@markec/mototrack-design.hud.country-flag';
import { BALKAN_TOURS } from '../data/balkan-tours.js';
import styles from './explore-tab.module.css';

type Section = 'tours' | 'roads' | 'leaderboard' | 'challenges' | 'events' | 'community';

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: 'tours', label: 'Ikonične ture', icon: '🌟' },
  { key: 'roads', label: 'Balkanske ceste', icon: '🛣️' },
  { key: 'leaderboard', label: 'Lestvica', icon: '🏆' },
  { key: 'challenges', label: 'Izzivi', icon: '🎯' },
  { key: 'events', label: 'Dogodki', icon: '📅' },
  { key: 'community', label: 'Skupnostne rute', icon: '👥' },
];

const COUNTRIES: { code: CountryCode; roads: number }[] = [
  { code: 'SI', roads: 6 },
  { code: 'HR', roads: 4 },
  { code: 'BA', roads: 3 },
  { code: 'ME', roads: 4 },
  { code: 'RS', roads: 3 },
  { code: 'MK', roads: 2 },
  { code: 'AL', roads: 3 },
  { code: 'BG', roads: 3 },
  { code: 'RO', roads: 3 },
  { code: 'GR', roads: 2 },
];

const COUNTRY_TO_CODE: Record<string, CountryCode> = {
  Slovenija: 'SI',
  'Črna Gora': 'ME',
  Romunija: 'RO',
  Albanija: 'AL',
  Bolgarija: 'BG',
  Hrvaška: 'HR',
  'Bosna in Hercegovina': 'BA',
  'Severna Makedonija': 'MK',
  Srbija: 'RS',
  Grčija: 'GR',
};

const LEADERBOARD = [
  { rank: 1, name: 'Luka K.', code: 'SI' as CountryCode, km: 12340, rides: 187, points: 8920 },
  { rank: 2, name: 'Marko P.', code: 'HR' as CountryCode, km: 11250, rides: 165, points: 8420 },
  { rank: 3, name: 'Jure N.', code: 'RS' as CountryCode, km: 10180, rides: 142, points: 7650 },
  { rank: 4, name: 'Ana S.', code: 'ME' as CountryCode, km: 9560, rides: 138, points: 7220 },
  { rank: 5, name: 'Tomaž R.', code: 'BA' as CountryCode, km: 8980, rides: 121, points: 6890 },
  { rank: 6, name: 'Markec', code: 'SI' as CountryCode, km: 7420, rides: 98, points: 5430, me: true },
  { rank: 7, name: 'Peter B.', code: 'RO' as CountryCode, km: 6890, rides: 87, points: 4920 },
];

const CHALLENGES = [
  { id: 'c1', name: 'Balkanski tour', desc: 'Prevozi 1000 km na Balkanu', progress: 78, points: 500, days: 12 },
  { id: 'c2', name: 'Vršič 50 serpentin', desc: 'Premagaj vse serpentine', progress: 100, points: 250, days: 0, done: true },
  { id: 'c3', name: 'Marec na motorju', desc: 'Vozi vsaj 20 dni v marcu', progress: 45, points: 300, days: 18 },
  { id: 'c4', name: 'Jutranja serija', desc: '7 zaporednih jutranjih voženj', progress: 57, points: 150, days: 3 },
];

const EVENTS = [
  { id: 'e1', name: 'MotoFest Bovec 2025', date: '15. junij', code: 'SI' as CountryCode, participants: 340 },
  { id: 'e2', name: 'Transfăgărășan Group Ride', date: '22. julij', code: 'RO' as CountryCode, participants: 128 },
  { id: 'e3', name: 'Kotor Serpentine Challenge', date: '10. avgust', code: 'ME' as CountryCode, participants: 87 },
  { id: 'e4', name: 'Albanska riviera tour', date: '5. september', code: 'AL' as CountryCode, participants: 56 },
];

const COMMUNITY_ROUTES = [
  { id: 'cr1', name: 'Skrita Logarska dolina', author: 'Andrej M.', km: 95, likes: 234, rating: 9.4, code: 'SI' as CountryCode },
  { id: 'cr2', name: 'Durmitor zanka', author: 'Filip K.', km: 180, likes: 189, rating: 9.7, code: 'ME' as CountryCode },
  { id: 'cr3', name: 'Plitvička jezera', author: 'Sara D.', km: 140, likes: 156, rating: 8.9, code: 'HR' as CountryCode },
  { id: 'cr4', name: 'Pirin gore enduro', author: 'Stefan V.', km: 95, likes: 98, rating: 9.1, code: 'BG' as CountryCode },
];

const DIFFICULTY_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  easy: 'success',
  medium: 'info',
  hard: 'warning',
  expert: 'danger',
};

/** Explore tab: discover tours, roads, events, challenges, leaderboard, community routes. */
export function ExploreTab() {
  const [section, setSection] = useState<Section>('tours');

  return (
    <div className={styles.wrap}>
      <div className={styles.tabsBar}>
        <Tabs
          items={SECTIONS.map((s) => ({ key: s.key, label: s.label, icon: s.icon }))}
          activeKey={section}
          onTabChange={(key) => setSection(key as Section)}
        />
      </div>

      <div className={styles.content}>
        {section === 'tours' && (
          <div className={styles.grid}>
            {BALKAN_TOURS.map((t) => {
              const code = COUNTRY_TO_CODE[t.country];
              return (
                <Card key={t.id} variant="default" padding="md" hoverLift>
                  <div className={styles.tourTop}>
                    {code && <CountryFlag code={code} size="lg" />}
                    <Badge label={`⭐ ${t.rating}`} variant="accent" size="md" />
                  </div>
                  <Heading level={4} size="md" color="primary">{t.name}</Heading>
                  <Paragraph variant="caption" color="secondary">{t.description}</Paragraph>
                  <div className={styles.tourMeta}>
                    <Badge label={`📏 ${t.distanceKm} km`} variant="neutral" size="sm" />
                    <Badge label={t.difficulty} variant={DIFFICULTY_VARIANT[t.difficulty]} size="sm" />
                    <Badge label={`📍 ${t.waypoints.length}`} variant="neutral" size="sm" />
                  </div>
                  <Button variant="primary" size="md" fullWidth leftIcon="📥">
                    Naloži v Načrtuj
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {section === 'roads' && (
          <div className={styles.countries}>
            {COUNTRIES.map((c) => (
              <Card key={c.code} variant="default" padding="md" hoverLift className={styles.countryCard}>
                <CountryFlag code={c.code} size="lg" showLabel={false} />
                <div className={styles.countryBody}>
                  <CountryFlag code={c.code} size="md" showLabel className={styles.countryName} />
                  <Paragraph variant="caption" color="secondary">{c.roads} kuriranih cest</Paragraph>
                </div>
                <Button variant="secondary" size="sm">Poglej →</Button>
              </Card>
            ))}
            <Card variant="elevated" padding="lg" className={styles.totalCard}>
              <Heading level={1} size="3xl" color="accent">63</Heading>
              <Paragraph variant="body" color="primary">kuriranih motociklističnih cest po 10 državah</Paragraph>
            </Card>
          </div>
        )}

        {section === 'leaderboard' && (
          <Card variant="default" padding="none">
            <div className={styles.lbHeader}>
              <span>#</span>
              <span>Motorist</span>
              <span>Km</span>
              <span>Vožnje</span>
              <span>Točke</span>
            </div>
            {LEADERBOARD.map((u) => (
              <div key={u.rank} className={`${styles.lbRow} ${u.me ? styles.lbMe : ''}`}>
                <span className={styles.lbRank}>
                  {u.rank <= 3 ? ['🥇', '🥈', '🥉'][u.rank - 1] : `#${u.rank}`}
                </span>
                <span className={styles.lbName}>
                  <Avatar name={u.name} size="sm" />
                  <span className={styles.lbNameText}>
                    <CountryFlag code={u.code} size="sm" showLabel={false} />
                    <Paragraph variant="body" color="primary">{u.name}</Paragraph>
                  </span>
                  {u.me && <Badge label="TI" variant="accent" size="sm" />}
                </span>
                <Paragraph variant="body" color="primary">{u.km.toLocaleString('sl-SI')}</Paragraph>
                <Paragraph variant="body" color="secondary">{u.rides}</Paragraph>
                <Paragraph variant="body" color="primary" className={styles.lbPoints}>
                  {u.points.toLocaleString('sl-SI')}
                </Paragraph>
              </div>
            ))}
          </Card>
        )}

        {section === 'challenges' && (
          <div className={styles.list}>
            {CHALLENGES.map((c) => (
              <Card key={c.id} variant="default" padding="md">
                <div className={styles.chHead}>
                  <div>
                    <Heading level={4} size="md" color="primary">{c.name}</Heading>
                    <Paragraph variant="caption" color="secondary">{c.desc}</Paragraph>
                  </div>
                  <Badge label={`+${c.points} pt`} variant="accent" size="md" />
                </div>
                <ProgressBar
                  value={c.progress}
                  variant={c.done ? 'success' : 'accent'}
                  showPercentage
                  height={8}
                />
                <div className={styles.chFoot}>
                  {c.done ? (
                    <Badge label="✓ DOSEŽEN" variant="success" size="md" />
                  ) : (
                    <Paragraph variant="caption" color="muted">⏰ {c.days} dni</Paragraph>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {section === 'events' && (
          <div className={styles.list}>
            {EVENTS.map((e) => (
              <Card key={e.id} variant="default" padding="md" hoverLift>
                <div className={styles.eventRow}>
                  <Card variant="elevated" padding="sm" className={styles.evDateCard}>
                    <Heading level={3} size="xl" color="accent">{e.date.split('.')[0]}</Heading>
                    <Paragraph variant="label" color="secondary">{e.date.split('.')[1]?.trim()}</Paragraph>
                  </Card>
                  <div className={styles.evBody}>
                    <Heading level={4} size="md" color="primary">{e.name}</Heading>
                    <div className={styles.evMetaRow}>
                      <CountryFlag code={e.code} size="sm" />
                      <Badge label={`👥 ${e.participants}`} variant="neutral" size="sm" />
                    </div>
                  </div>
                  <Button variant="primary" size="sm">Pridruži se</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {section === 'community' && (
          <div className={styles.grid}>
            {COMMUNITY_ROUTES.map((r) => (
              <Card key={r.id} variant="default" padding="md" hoverLift>
                <div className={styles.tourTop}>
                  <CountryFlag code={r.code} size="lg" />
                  <Badge label={`⭐ ${r.rating}`} variant="accent" size="md" />
                </div>
                <Heading level={4} size="md" color="primary">{r.name}</Heading>
                <Paragraph variant="caption" color="secondary">od {r.author}</Paragraph>
                <div className={styles.tourMeta}>
                  <Badge label={`📏 ${r.km} km`} variant="neutral" size="sm" />
                  <Badge label={`❤️ ${r.likes}`} variant="danger" size="sm" />
                </div>
                <Button variant="primary" size="md" fullWidth leftIcon="📥">Naloži v Načrtuj</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
