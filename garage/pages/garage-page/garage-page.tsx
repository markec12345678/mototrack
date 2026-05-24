import React, { useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Button } from '@markec/mototrack-design.actions.button';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import { SelectList } from '@markec/mototrack-design.inputs.select-list';
import { BikeCard } from '@markec/garage.ui.bike-card';
import { MaintenanceList } from '@markec/garage.ui.maintenance-list';
import { ExpenseSummary } from '@markec/garage.ui.expense-summary';
import { useBikes } from '@markec/garage.hooks.use-bikes';
import type { BikeCardBike } from '@markec/garage.ui.bike-card';
import type { BikeInput } from '@markec/garage.hooks.use-bikes';
import styles from './garage-page.module.scss';

// ─── Icons ────────────────────────────────────────────────────────────────────

function BikeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 0 0-1-1h-1l-3 7h7l-2-6z" />
      <path d="M5.5 17.5L9 10l2 4h5" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function EuroIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M4 14h12" />
      <path d="M19.5 9.5c-1.5-2-3.5-3-6-3a8 8 0 0 0 0 16c2.5 0 4.5-1 6-3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
};

const TABS: TabItem[] = [
  { key: `motorji`, label: `Motorji`, icon: <BikeIcon /> },
  { key: `vzdrzevanje`, label: `Vzdrževanje`, icon: <WrenchIcon /> },
  { key: `stroski`, label: `Stroški`, icon: <EuroIcon /> },
];

const BIKE_COLORS = [
  { value: `#f97316`, label: `Oranžna` },
  { value: `#3b82f6`, label: `Modra` },
  { value: `#22c55e`, label: `Zelena` },
  { value: `#ef4444`, label: `Rdeča` },
  { value: `#a855f7`, label: `Vijolična` },
  { value: `#eab308`, label: `Rumena` },
  { value: `#94a3b8`, label: `Srebrna` },
  { value: `#f1f5f9`, label: `Bela` },
];

// ─── Add Bike Form ────────────────────────────────────────────────────────────

type AddBikeFormProps = {
  onSave: (bike: BikeInput) => void;
  onCancel: () => void;
  saving?: boolean;
};

function AddBikeForm({ onSave, onCancel, saving = false }: AddBikeFormProps) {
  const [name, setName] = useState(``);
  const [model, setModel] = useState(``);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [mileageKm, setMileageKm] = useState(`0`);
  const [tankL, setTankL] = useState(`15`);
  const [consumptionLPer100, setConsumptionLPer100] = useState(`5.0`);
  const [currentFuelL, setCurrentFuelL] = useState(`10`);
  const [color, setColor] = useState(`#f97316`);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = `Ime motorja je obvezno.`;
    if (!model.trim()) next.model = `Model je obvezen.`;
    if (!year || Number.isNaN(Number(year))) next.year = `Leto mora biti veljavno število.`;
    if (!tankL || Number(tankL) <= 0) next.tankL = `Prostornina rezervoarja mora biti večja od 0.`;
    if (!consumptionLPer100 || Number(consumptionLPer100) <= 0) next.consumptionLPer100 = `Poraba mora biti večja od 0.`;
    return next;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSave({
      name: name.trim(),
      model: model.trim(),
      year: Number(year),
      mileageKm: Number(mileageKm) || 0,
      tankL: Number(tankL),
      consumptionLPer100: Number(consumptionLPer100),
      currentFuelL: Number(currentFuelL) || 0,
      color,
      primary: false,
    });
  };

  return (
    <div className={styles.addBikeForm}>
      <div className={styles.formHeader}>
        <Heading level={4} size="md" color="primary">Dodaj motor</Heading>
        <p className={styles.formSubtitle}>Izpolni podatke o svojem motorju</p>
      </div>

      <div className={styles.formGrid}>
        <TextInput
          label="Ime motorja"
          placeholder="npr. KTM 890 Adventure"
          value={name}
          onChange={(v) => setName(v)}
          errorMessage={errors.name}
          required
        />
        <TextInput
          label="Model"
          placeholder="npr. 890 Adventure"
          value={model}
          onChange={(v) => setModel(v)}
          errorMessage={errors.model}
          required
        />
        <div className={styles.formRow}>
          <TextInput
            label="Leto"
            type="number"
            placeholder="2024"
            value={year}
            onChange={(v) => setYear(v)}
            errorMessage={errors.year}
            required
          />
          <TextInput
            label="Kilometrina (km)"
            type="number"
            placeholder="0"
            value={mileageKm}
            onChange={(v) => setMileageKm(v)}
          />
        </div>
        <div className={styles.formRow}>
          <TextInput
            label="Rezervoar (L)"
            type="number"
            placeholder="15"
            value={tankL}
            onChange={(v) => setTankL(v)}
            errorMessage={errors.tankL}
            required
          />
          <TextInput
            label="Poraba (L/100km)"
            type="number"
            placeholder="5.0"
            value={consumptionLPer100}
            onChange={(v) => setConsumptionLPer100(v)}
            errorMessage={errors.consumptionLPer100}
            required
          />
        </div>
        <TextInput
          label="Trenutno gorivo (L)"
          type="number"
          placeholder="10"
          value={currentFuelL}
          onChange={(v) => setCurrentFuelL(v)}
        />
        <div className={styles.colorField}>
          <SelectList
            label="Barva motorja"
            options={BIKE_COLORS}
            value={color}
            onChange={(v) => setColor(v)}
          />
          <div className={styles.colorPreview} style={{ backgroundColor: color }} />
        </div>
      </div>

      <div className={styles.formActions}>
        <Button variant="ghost" size="md" onClick={() => onCancel()} disabled={saving}>
          Prekliči
        </Button>
        <Button variant="primary" size="md" onClick={() => handleSubmit()} loading={saving} leftIcon={<PlusIcon />}>
          Shrani motor
        </Button>
      </div>
    </div>
  );
}

// ─── Motorji Tab ──────────────────────────────────────────────────────────────

type MotorjiTabProps = {
  bikes?: BikeCardBike[];
};

function MotorjiTab({ bikes: bikesProp }: MotorjiTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { bikes: hookBikes, save } = useBikes();

  const bikes: BikeCardBike[] = bikesProp !== undefined
    ? bikesProp
    : hookBikes.map((b) => ({
        id: b.id,
        name: b.name,
        model: b.model,
        year: b.year,
        mileageKm: b.mileageKm,
        tankL: b.tankL,
        consumptionLPer100: b.consumptionLPer100,
        currentFuelL: b.currentFuelL,
        color: b.color,
        primary: b.primary,
      }));

  const handleSave = async (bikeData: BikeInput) => {
    setSaving(true);
    try {
      await save(bikeData);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    const target = bikes.find((b) => b.id === id);
    if (!target) return;
    await save({
      id: target.id,
      name: target.name,
      model: target.model,
      year: target.year,
      mileageKm: target.mileageKm,
      tankL: target.tankL,
      consumptionLPer100: target.consumptionLPer100,
      currentFuelL: target.currentFuelL,
      color: target.color,
      primary: true,
    });
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <Heading level={2} size="xl" color="primary">Moji motorji</Heading>
          <p className={styles.tabSubtitle}>
            {bikes.length === 0
              ? `Še nimaš dodanega motorja.`
              : `${bikes.length} ${bikes.length === 1 ? `motor` : bikes.length < 5 ? `motorji` : `motorjev`} v garaži`}
          </p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusIcon />}
            onClick={() => setShowForm(true)}
          >
            Dodaj motor
          </Button>
        )}
      </div>

      {showForm && (
        <AddBikeForm
          onSave={(data) => { void handleSave(data); }}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}

      {bikes.length === 0 && !showForm && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏍️</div>
          <p className={styles.emptyTitle}>Garaža je prazna</p>
          <p className={styles.emptyText}>Dodaj svoj prvi motor in začni slediti vzdrževanju in stroškom.</p>
          <Button variant="primary" size="lg" leftIcon={<PlusIcon />} onClick={() => setShowForm(true)}>
            Dodaj prvi motor
          </Button>
        </div>
      )}

      {bikes.length > 0 && (
        <div className={styles.bikeGrid}>
          {bikes.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              onEdit={(id) => console.log(`Edit bike: ${id}`)}
              onSetPrimary={(id) => { void handleSetPrimary(id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vzdrževanje Tab ──────────────────────────────────────────────────────────

type VzdrzevanjeBikeSection = {
  id: string;
  name: string;
  mileageKm: number;
};

type VzdrzevanjeTabProps = {
  bikes?: VzdrzevanjeBikeSection[];
};

function VzdrzevanjeTab({ bikes: bikesProp }: VzdrzevanjeTabProps) {
  const { bikes: hookBikes } = useBikes();

  const bikes: VzdrzevanjeBikeSection[] = bikesProp !== undefined
    ? bikesProp
    : hookBikes.map((b) => ({ id: b.id, name: b.name, mileageKm: b.mileageKm }));

  const [expandedBikeId, setExpandedBikeId] = useState<string | null>(
    bikes.length > 0 ? bikes[0].id : null
  );

  if (bikes.length === 0) {
    return (
      <div className={styles.tabContent}>
        <div className={styles.tabHeader}>
          <Heading level={2} size="xl" color="primary">Vzdrževanje</Heading>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔧</div>
          <p className={styles.emptyTitle}>Ni motorjev</p>
          <p className={styles.emptyText}>Najprej dodaj motor v zavihku Motorji.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <Heading level={2} size="xl" color="primary">Vzdrževanje</Heading>
          <p className={styles.tabSubtitle}>Pregled vzdrževalnih nalog za vse motorje</p>
        </div>
      </div>

      <div className={styles.maintenanceSections}>
        {bikes.map((bike) => {
          const isExpanded = expandedBikeId === bike.id;
          return (
            <div key={bike.id} className={styles.maintenanceSection}>
              <button
                type="button"
                className={classNames(styles.maintenanceSectionHeader, { [styles.maintenanceSectionHeaderExpanded]: isExpanded })}
                onClick={() => setExpandedBikeId(isExpanded ? null : bike.id)}
              >
                <div className={styles.maintenanceSectionTitle}>
                  <span className={styles.maintenanceBikeName}>{bike.name}</span>
                  <span className={styles.maintenanceBikeMileage}>{bike.mileageKm.toLocaleString()} km</span>
                </div>
                <span className={classNames(styles.maintenanceChevron, { [styles.maintenanceChevronOpen]: isExpanded })}>
                  <ChevronDownIcon />
                </span>
              </button>
              {isExpanded && (
                <div className={styles.maintenanceSectionBody}>
                  <MaintenanceList
                    bikeId={bike.id}
                    currentMileageKm={bike.mileageKm}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stroški Tab ──────────────────────────────────────────────────────────────

type StroskiTabProps = {
  selectedBikeId?: string;
  bikes?: BikeCardBike[];
};

function StroskiTab({ selectedBikeId, bikes: bikesProp }: StroskiTabProps) {
  const { bikes: hookBikes } = useBikes();
  const bikes: BikeCardBike[] = bikesProp !== undefined
    ? bikesProp
    : hookBikes.map((b) => ({
        id: b.id,
        name: b.name,
        model: b.model,
        year: b.year,
        mileageKm: b.mileageKm,
        tankL: b.tankL,
        consumptionLPer100: b.consumptionLPer100,
        currentFuelL: b.currentFuelL,
        color: b.color,
        primary: b.primary,
      }));

  const [activeBikeId, setActiveBikeId] = useState<string | undefined>(
    selectedBikeId ?? (bikes.length > 0 ? bikes[0].id : undefined)
  );

  const bikeOptions = [
    { value: ``, label: `Vsi motorji` },
    ...bikes.map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <Heading level={2} size="xl" color="primary">Stroški</Heading>
          <p className={styles.tabSubtitle}>Pregled in dodajanje stroškov garaže</p>
        </div>
      </div>

      {bikes.length > 1 && (
        <div className={styles.bikeFilter}>
          <SelectList
            label="Filtriraj po motorju"
            options={bikeOptions}
            value={activeBikeId ?? ``}
            onChange={(v) => setActiveBikeId(v || undefined)}
          />
        </div>
      )}

      <ExpenseSummary />
    </div>
  );
}

// ─── Main GaragePage ──────────────────────────────────────────────────────────

export type GaragePageProps = {
  /**
   * Initial active tab key. Defaults to 'motorji'.
   */
  initialTab?: `motorji` | `vzdrzevanje` | `stroski`;

  /**
   * Optional pre-loaded bikes for testing / SSR.
   */
  bikes?: BikeCardBike[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * GaragePage — the main /garage page.
 * Three tabs: Motorji (bike list + add form), Vzdrževanje (per-bike maintenance),
 * Stroški (expense summary).
 */
export function GaragePage({
  initialTab = `motorji`,
  bikes,
  className,
  style,
}: GaragePageProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const vzdrzevanjeBikes = bikes?.map((b) => ({
    id: b.id,
    name: b.name,
    mileageKm: b.mileageKm,
  }));

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <div className={styles.heroBar}>
        <PageLayout maxWidth="1280px" padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-md)">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              <span className={styles.heroBadgeLabel}>Garaža</span>
            </div>
            <Heading level={1} size="2xl" color="primary">Moja garaža</Heading>
            <p className={styles.heroSubtitle}>
              Upravljaj motorje, sledi vzdrževanju in nadzorujem stroške na enem mestu.
            </p>
          </div>
          <Tabs
            items={TABS}
            activeKey={activeTab}
            onTabChange={(key) => setActiveTab(key)}
          />
        </PageLayout>
      </div>

      <PageLayout maxWidth="1280px" padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-xl)">
        {activeTab === `motorji` && <MotorjiTab bikes={bikes} />}
        {activeTab === `vzdrzevanje` && <VzdrzevanjeTab bikes={vzdrzevanjeBikes} />}
        {activeTab === `stroski` && <StroskiTab bikes={bikes} />}
      </PageLayout>
    </div>
  );
}
