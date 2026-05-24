import { useState } from 'react';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Button } from '@markec/mototrack-design.actions.button';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import { FuelGauge } from '@markec/mototrack-design.hud.fuel-gauge';
import { Gauge } from '@markec/mototrack-design.hud.gauge';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import { ACHIEVEMENTS } from '../data/achievements.js';
import styles from './profile-tab.module.css';

type Section = 'stats' | 'garage' | 'maintenance' | 'expenses' | 'ice' | 'fuel' | 'achievements';

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: 'stats', label: 'Statistika', icon: '📊' },
  { key: 'garage', label: 'Garaža', icon: '🏍️' },
  { key: 'maintenance', label: 'Vzdrževanje', icon: '🔧' },
  { key: 'expenses', label: 'Stroški', icon: '💰' },
  { key: 'fuel', label: 'Gorivo', icon: '⛽' },
  { key: 'ice', label: 'ICE', icon: '🆘' },
  { key: 'achievements', label: 'Dosežki', icon: '🏆' },
];

const RIDES_WEEKLY = [12, 38, 65, 42, 88, 105, 72];
const DAY_LABELS = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

const GARAGE = [
  { id: 'b1', name: 'KTM 890 Adventure', year: 2023, km: 18420, color: '#f97316', primary: true },
  { id: 'b2', name: 'Yamaha MT-07', year: 2020, km: 32100, color: '#3b82f6' },
];

const MAINTENANCE = [
  { name: 'Olje motorja', interval: '5000 km', remaining: 1240, progress: 75 },
  { name: 'Veriga (mast)', interval: '500 km', remaining: 120, progress: 76 },
  { name: 'Sprednje pnevmatike', interval: '12000 km', remaining: 8400, progress: 30 },
  { name: 'Zadnja pnevmatika', interval: '8000 km', remaining: 450, progress: 94 },
  { name: 'Zavorne ploščice', interval: '15000 km', remaining: 5200, progress: 65 },
  { name: 'Zračni filter', interval: '20000 km', remaining: 12800, progress: 36 },
];

function progressVariant(p: number): 'success' | 'warning' | 'danger' {
  if (p > 80) return 'danger';
  if (p > 50) return 'warning';
  return 'success';
}

const EXPENSES = [
  { cat: 'Gorivo', icon: '⛽', amount: 412, percentage: 38 },
  { cat: 'Servis', icon: '🔧', amount: 285, percentage: 26 },
  { cat: 'Zavarovanje', icon: '🛡️', amount: 180, percentage: 17 },
  { cat: 'Pnevmatike', icon: '🛞', amount: 120, percentage: 11 },
  { cat: 'Cestnina', icon: '🛣️', amount: 65, percentage: 6 },
  { cat: 'Drugo', icon: '📦', amount: 18, percentage: 2 },
];

/** Profile tab: stats dashboard, garage, maintenance reminders, expenses, ICE, achievements. */
export function ProfileTab() {
  const [section, setSection] = useState<Section>('stats');
  const maxDay = Math.max(...RIDES_WEEKLY);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Avatar name="Markec" size="xl" status="online" />
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <Heading level={2} size="xl" color="primary">Markec</Heading>
            <CountryFlag code="SI" size="md" showLabel={false} />
          </div>
          <Paragraph variant="caption" color="secondary">
            Raven 8 · ⭐ 5,430 točk · 🔥 12-dnevna serija
          </Paragraph>
        </div>
        <Badge label="LVL 8" variant="accent" size="md" />
        <IconButton icon={<span>⚙️</span>} variant="ghost" size="md" aria-label="Settings" />
      </header>

      <div className={styles.tabsBar}>
        <Tabs
          items={SECTIONS.map((s) => ({ key: s.key, label: s.label, icon: s.icon }))}
          activeKey={section}
          onTabChange={(key) => setSection(key as Section)}
        />
      </div>

      <div className={styles.content}>
        {section === 'stats' && (
          <>
            <div className={styles.statsGrid}>
              {[
                { icon: '📏', val: '7,420', lbl: 'Skupaj km' },
                { icon: '🏍️', val: '98', lbl: 'Voženj' },
                { icon: '⏱️', val: '142h', lbl: 'Čas' },
                { icon: '⛰️', val: '48,200', lbl: 'Vzpon m' },
                { icon: '⚡', val: '187', lbl: 'Max km/h' },
                { icon: '🌀', val: '8.4', lbl: 'Twisty' },
              ].map((s) => (
                <Card key={s.lbl} variant="default" padding="sm">
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>{s.icon}</span>
                    <Heading level={4} size="lg" color="accent">{s.val}</Heading>
                    <Paragraph variant="caption" color="secondary">{s.lbl}</Paragraph>
                  </div>
                </Card>
              ))}
            </div>

            <Card variant="default" padding="md">
              <Heading level={4} size="md" color="primary">Tedenski pregled (km)</Heading>
              <div className={styles.chart}>
                {RIDES_WEEKLY.map((v, i) => (
                  <div key={i} className={styles.barCol}>
                    <Paragraph variant="caption" color="secondary">{v}</Paragraph>
                    <div className={styles.barWrap}>
                      <div className={styles.bar} style={{ height: `${(v / maxDay) * 100}%` }} />
                    </div>
                    <Paragraph variant="label" color="secondary">{DAY_LABELS[i]}</Paragraph>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="default" padding="md">
              <Heading level={4} size="md" color="primary">🏆 Rekordi</Heading>
              <div className={styles.recordList}>
                <div className={styles.recordRow}>
                  <span>🛣️</span>
                  <div>
                    <Paragraph variant="label" color="secondary">Najdaljša vožnja</Paragraph>
                    <Paragraph variant="body" color="primary">Soška dolina & Vršič · 287 km · 6h 12min</Paragraph>
                  </div>
                </div>
                <div className={styles.recordRow}>
                  <span>🔥</span>
                  <div>
                    <Paragraph variant="label" color="secondary">Najdaljša serija</Paragraph>
                    <Paragraph variant="body" color="primary">23 zaporednih dni vožnje (maj 2024)</Paragraph>
                  </div>
                </div>
                <div className={styles.recordRow}>
                  <span>⛰️</span>
                  <div>
                    <Paragraph variant="label" color="secondary">Najvišja točka</Paragraph>
                    <Paragraph variant="body" color="primary">Bâlea Lake, Romunija · 2,034 m</Paragraph>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {section === 'garage' && (
          <div className={styles.garage}>
            {GARAGE.map((b) => (
              <Card key={b.id} variant={b.primary ? 'elevated' : 'default'} padding="md" hoverLift>
                <div className={styles.bikeHead}>
                  <span style={{ color: b.color, fontSize: '2.6rem' }}>🏍️</span>
                  <div className={styles.bikeInfo}>
                    <Heading level={4} size="md" color="primary">{b.name}</Heading>
                    <Paragraph variant="caption" color="secondary">Letnik {b.year}</Paragraph>
                  </div>
                  {b.primary && <Badge label="PRIMARNI" variant="accent" size="sm" />}
                </div>
                <div className={styles.bikeStats}>
                  <div>
                    <Heading level={4} size="md" color="primary">{b.km.toLocaleString('sl-SI')}</Heading>
                    <Paragraph variant="label" color="secondary">km</Paragraph>
                  </div>
                  <div>
                    <Heading level={4} size="md" color="primary">5.4</Heading>
                    <Paragraph variant="label" color="secondary">L/100km</Paragraph>
                  </div>
                  <div>
                    <Heading level={4} size="md" color="primary">320</Heading>
                    <Paragraph variant="label" color="secondary">doseg km</Paragraph>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="secondary" size="lg" fullWidth leftIcon="+">Dodaj motor</Button>
          </div>
        )}

        {section === 'maintenance' && (
          <div className={styles.maintList}>
            {MAINTENANCE.map((m) => (
              <Card key={m.name} variant="default" padding="md">
                <div className={styles.maintHead}>
                  <div>
                    <Heading level={5} size="sm" color="primary">{m.name}</Heading>
                    <Paragraph variant="label" color="secondary">Interval: {m.interval}</Paragraph>
                  </div>
                  <div className={styles.maintRem}>
                    <Heading level={4} size="md" color="accent">{m.remaining}</Heading>
                    <Paragraph variant="label" color="secondary">km do servisa</Paragraph>
                  </div>
                </div>
                <ProgressBar value={m.progress} variant={progressVariant(m.progress)} height={8} />
              </Card>
            ))}
          </div>
        )}

        {section === 'expenses' && (
          <>
            <Card variant="elevated" padding="lg">
              <div className={styles.expTotal}>
                <Paragraph variant="caption" color="secondary">Skupno (zadnjih 30 dni)</Paragraph>
                <Heading level={1} size="3xl" color="accent">€1,080</Heading>
              </div>
            </Card>
            <div className={styles.expList}>
              {EXPENSES.map((e) => (
                <Card key={e.cat} variant="default" padding="md">
                  <div className={styles.expRow}>
                    <span className={styles.expIcon}>{e.icon}</span>
                    <div className={styles.expBody}>
                      <Heading level={5} size="sm" color="primary">{e.cat}</Heading>
                      <ProgressBar value={e.percentage} variant="accent" height={6} />
                    </div>
                    <Heading level={5} size="md" color="accent">€{e.amount}</Heading>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {section === 'fuel' && (
          <>
            <Card variant="default" padding="md">
              <FuelGauge currentLiters={16.4} tankCapacity={21} consumptionRate={5.4} />
            </Card>
            <Card variant="default" padding="md" className={styles.fuelForm}>
              <Heading level={4} size="md" color="primary">Nastavitve goriva</Heading>
              <div className={styles.fuelInputs}>
                <TextInput label="Kapaciteta rezervoarja (L)" type="number" value="21" />
                <TextInput label="Poraba (L/100km)" type="number" value="5.4" />
                <TextInput label="Trenutno gorivo (L)" type="number" value="16.4" />
                <TextInput label="Opomnik pri (%)" type="number" value="20" />
              </div>
            </Card>
            <div className={styles.gaugeRow}>
              <Gauge value={304} min={0} max={400} label="Doseg" unit="km" size={160} />
              <Gauge value={5.4} min={0} max={10} label="Poraba" unit="L" size={160} />
            </div>
          </>
        )}

        {section === 'ice' && (
          <Card variant="default" padding="md">
            <Heading level={3} size="lg" color="danger">🆘 ICE — Stiki v nuji</Heading>
            <Card variant="danger" padding="sm">
              <Paragraph variant="caption" color="primary">
                Te informacije se delijo ob SOS klicu in zaznavi trčenja
              </Paragraph>
            </Card>
            <div className={styles.iceFields}>
              <TextInput label="Krvna skupina" value="A+" />
              <TextInput label="Alergije / zdravila" value="Penicilin (alergija)" />
              <TextInput label="Glavni kontakt — ime" value="Ana (Žena)" />
              <TextInput label="Glavni kontakt — telefon" value="+386 41 234 567" />
              <TextInput label="Sekundarni kontakt — ime" value="Oče" />
              <TextInput label="Sekundarni kontakt — telefon" value="+386 31 987 654" />
            </div>
            <Card variant="elevated" padding="md" className={styles.emergencyCard}>
              <Heading level={5} size="sm" color="accent">Reševalne številke (Balkan)</Heading>
              <div className={styles.emergencyGrid}>
                {[
                  { code: 'SI' as const, num: '112' },
                  { code: 'HR' as const, num: '192/194' },
                  { code: 'ME' as const, num: '112' },
                  { code: 'RS' as const, num: '192/194' },
                  { code: 'BA' as const, num: '112' },
                  { code: 'AL' as const, num: '129' },
                ].map((e) => (
                  <div key={e.code} className={styles.emergencyRow}>
                    <CountryFlag code={e.code} size="sm" showLabel={false} />
                    <Paragraph variant="mono" color="primary">{e.num}</Paragraph>
                  </div>
                ))}
              </div>
            </Card>
          </Card>
        )}

        {section === 'achievements' && (
          <div className={styles.achGrid}>
            {ACHIEVEMENTS.map((a) => (
              <Card
                key={a.id}
                variant={a.unlocked ? 'elevated' : 'outlined'}
                padding="md"
                className={a.unlocked ? styles.achUnlocked : styles.achLocked}
                hoverLift
              >
                <div className={styles.achInner}>
                  <span className={styles.achIcon}>{a.icon}</span>
                  <Heading level={5} size="sm" color="primary">{a.name}</Heading>
                  <Paragraph variant="caption" color="secondary">{a.description}</Paragraph>
                  {!a.unlocked && a.progress !== undefined && (
                    <ProgressBar value={a.progress} variant="accent" showPercentage height={6} />
                  )}
                  {a.unlocked && <Badge label="✓ DOSEŽEN" variant="success" size="sm" />}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
