import * as React from 'react';
import { useState, useCallback } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { Button } from '@markec/mototrack-design.actions.button';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import { SelectList } from '@markec/mototrack-design.inputs.select-list';
import { useHazards } from '@markec/safety.hooks.use-hazards';
import { useIceContacts } from '@markec/safety.hooks.use-ice-contacts';
import { useCountryFromLocation } from '@markec/safety.hooks.use-country-from-location';
import { SosDialog } from '@markec/safety.ui.sos-dialog';
import type { IceContactData } from './ice-contact-data-type.js';
import type { EmergencyOverride } from './emergency-override-type.js';
import styles from './safety-page.module.scss';

// ── Tab keys ──────────────────────────────────────────────────────────────────

const TAB_ICE = `ice`;
const TAB_NUMBERS = `numbers`;
const TAB_BORDERS = `borders`;
const TAB_REPORTS = `reports`;

// ── Blood type options ────────────────────────────────────────────────────────

const BLOOD_TYPE_OPTIONS = [
  { value: ``, label: `Neznana` },
  { value: `A+`, label: `A+` },
  { value: `A-`, label: `A-` },
  { value: `B+`, label: `B+` },
  { value: `B-`, label: `B-` },
  { value: `AB+`, label: `AB+` },
  { value: `AB-`, label: `AB-` },
  { value: `0+`, label: `0+` },
  { value: `0-`, label: `0-` },
];

// ── Tab items ─────────────────────────────────────────────────────────────────

const TAB_ITEMS = [
  { key: TAB_ICE, label: `ICE`, icon: <HeartIcon /> },
  { key: TAB_NUMBERS, label: `Reševalne številke`, icon: <PhoneIcon /> },
  { key: TAB_BORDERS, label: `Mejni prehodi`, icon: <MapIcon /> },
  { key: TAB_REPORTS, label: `Moja poročila`, icon: <AlertIcon /> },
];

// ── Mock border crossings ─────────────────────────────────────────────────────

const BORDER_CROSSINGS = [
  {
    id: `bc-1`,
    name: `Šentilj`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇦🇹 Avstrija`,
    documents: [`Osebna izkaznica`, `Potni list`],
    vignetteRequired: true,
    avgWaitMin: 5,
    tips: `Vinjeta obvezna za Avstrijo. Kupite jo pred mejo ali na bencinskih servisih.`,
  },
  {
    id: `bc-2`,
    name: `Gruškovje`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇭🇷 Hrvaška`,
    documents: [`Osebna izkaznica`],
    vignetteRequired: false,
    avgWaitMin: 15,
    tips: `V poletni sezoni daljše čakalne dobe. Priporočamo zgodnji odhod.`,
  },
  {
    id: `bc-3`,
    name: `Obrežje`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇭🇷 Hrvaška`,
    documents: [`Osebna izkaznica`],
    vignetteRequired: false,
    avgWaitMin: 25,
    tips: `Najprometnješi mejni prehod. Izogibajte se petkovim popoldnevom.`,
  },
  {
    id: `bc-4`,
    name: `Fernetiči`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇮🇹 Italija`,
    documents: [`Osebna izkaznica`],
    vignetteRequired: false,
    avgWaitMin: 3,
    tips: `Schengenski prehod. Brez mejne kontrole za EU državljane.`,
  },
  {
    id: `bc-5`,
    name: `Rateče`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇦🇹 Avstrija`,
    documents: [`Osebna izkaznica`, `Potni list`],
    vignetteRequired: true,
    avgWaitMin: 2,
    tips: `Gorski prehod. Pozimi preverite pogoje na cesti.`,
  },
  {
    id: `bc-6`,
    name: `Macelj`,
    countryFrom: `🇭🇷 Hrvaška`,
    countryTo: `🇸🇮 Slovenija`,
    documents: [`Osebna izkaznica`],
    vignetteRequired: true,
    avgWaitMin: 20,
    tips: `Vinjeta za Slovenijo obvezna. Kupite jo na hrvaški strani.`,
  },
  {
    id: `bc-7`,
    name: `Gornja Radgona`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇦🇹 Avstrija`,
    documents: [`Osebna izkaznica`, `Potni list`],
    vignetteRequired: true,
    avgWaitMin: 4,
    tips: `Manjši prehod, pogosto hitrejši od Šentilja.`,
  },
  {
    id: `bc-8`,
    name: `Jelšane`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇭🇷 Hrvaška`,
    documents: [`Osebna izkaznica`],
    vignetteRequired: false,
    avgWaitMin: 10,
    tips: `Priporočen za motocikliste – manj prometa, lepa pot.`,
  },
  {
    id: `bc-9`,
    name: `Dragonja`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇭🇷 Hrvaška`,
    documents: [`Osebna izkaznica`],
    vignetteRequired: false,
    avgWaitMin: 8,
    tips: `Dostop do Istre. Lepa obalna pot za motocikliste.`,
  },
  {
    id: `bc-10`,
    name: `Karavanke`,
    countryFrom: `🇸🇮 Slovenija`,
    countryTo: `🇦🇹 Avstrija`,
    documents: [`Osebna izkaznica`, `Potni list`],
    vignetteRequired: true,
    avgWaitMin: 12,
    tips: `Tunel Karavanke – plačljiv. Vinjeta za Avstrijo obvezna.`,
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

export type SafetyPageProps = {
  /**
   * Initial active tab key.
   */
  initialTab?: string;

  /**
   * Mock ICE contacts for testing.
   */
  mockContacts?: IceContactData[];

  /**
   * Mock emergency number overrides for testing.
   */
  mockEmergencyOverride?: EmergencyOverride;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function SafetyPage({
  initialTab = TAB_ICE,
  mockContacts,
  mockEmergencyOverride,
  className,
  style,
}: SafetyPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sosOpen, setSosOpen] = useState(false);

  return (
    <div className={classNames(styles.page, className)} style={style}>
      {/* SOS floating button */}
      <button
        type="button"
        className={styles.sosFab}
        onClick={() => setSosOpen(true)}
        aria-label="Odpri SOS dialog"
      >
        <span className={styles.sosFabDot} />
        <span className={styles.sosFabLabel}>SOS</span>
      </button>

      <SosDialog open={sosOpen} onClose={() => setSosOpen(false)} />

      <PageLayout maxWidth="900px" padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-lg)">
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderBadge}>
            <span className={styles.pageHeaderBadgeDot} />
            <span className={styles.pageHeaderBadgeLabel}>Varnost</span>
          </div>
          <Heading level={1} size="2xl" color="primary">
            Varnostni center
          </Heading>
          <Paragraph variant="body" color="secondary">
            Upravljaj ICE kontakte, reševalne številke, mejne prehode in svoja poročila o nevarnostih.
          </Paragraph>
        </div>

        {/* Tabs */}
        <Tabs items={TAB_ITEMS} activeKey={activeTab} onTabChange={(key) => setActiveTab(key)} />

        {/* Tab content */}
        <div className={styles.tabContent}>
          {activeTab === TAB_ICE && <IceTab mockContacts={mockContacts} />}
          {activeTab === TAB_NUMBERS && <NumbersTab mockOverride={mockEmergencyOverride} />}
          {activeTab === TAB_BORDERS && <BordersTab />}
          {activeTab === TAB_REPORTS && <ReportsTab />}
        </div>
      </PageLayout>
    </div>
  );
}

// ── ICE Tab ───────────────────────────────────────────────────────────────────

type IceTabProps = {
  mockContacts?: IceContactData[];
};

function IceTab({ mockContacts }: IceTabProps) {
  const iceHook = useIceContacts();
  const contacts = mockContacts ?? ((iceHook as Record<string, unknown>).contacts as IceContactData[] | undefined) ?? [];
  const saveContact = (iceHook as Record<string, unknown>).save as ((opts: Record<string, unknown>) => Promise<unknown>) | undefined;
  const deleteContact = (iceHook as Record<string, unknown>).delete as ((id: string) => Promise<unknown>) | undefined;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: ``,
    relation: ``,
    phone: ``,
    bloodType: ``,
    allergies: ``,
    notes: ``,
    primary: false,
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setForm({ name: ``, relation: ``, phone: ``, bloodType: ``, allergies: ``, notes: ``, primary: false });
    setEditingId(null);
    setShowForm(false);
  }, []);

  const handleEdit = useCallback((contact: IceContactData) => {
    setForm({
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
      bloodType: contact.bloodType ?? ``,
      allergies: contact.allergies ?? ``,
      notes: contact.notes ?? ``,
      primary: contact.primary,
    });
    setEditingId(contact.id);
    setShowForm(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name || !form.relation || !form.phone) return;
    setSaving(true);
    try {
      await saveContact?.({
        id: editingId ?? undefined,
        name: form.name,
        relation: form.relation,
        phone: form.phone,
        primary: form.primary,
        bloodType: form.bloodType || undefined,
        allergies: form.allergies || undefined,
        notes: form.notes || undefined,
      });
      resetForm();
    } finally {
      setSaving(false);
    }
  }, [form, editingId, saveContact, resetForm]);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteContact?.(id);
    } finally {
      setDeletingId(null);
    }
  }, [deleteContact]);

  return (
    <div className={styles.tabSection}>
      {/* Blood type & allergies card */}
      <Card variant="default" padding="lg">
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <span className={styles.cardIcon}>🩸</span>
            <Heading level={3} size="md" color="primary">Medicinski podatki</Heading>
          </div>
        </div>
        <div className={styles.medicalGrid}>
          <div className={styles.medicalItem}>
            <Paragraph variant="label" color="muted">Krvna skupina</Paragraph>
            <div className={styles.bloodTypeBadge}>
              {contacts[0]?.bloodType ?? `—`}
            </div>
          </div>
          <div className={styles.medicalItem}>
            <Paragraph variant="label" color="muted">Alergije</Paragraph>
            <Paragraph variant="body" color="primary">
              {contacts[0]?.allergies ?? `Ni vnesenih alergij`}
            </Paragraph>
          </div>
          <div className={styles.medicalItem}>
            <Paragraph variant="label" color="muted">Opombe</Paragraph>
            <Paragraph variant="body" color="secondary">
              {contacts[0]?.notes ?? `—`}
            </Paragraph>
          </div>
        </div>
      </Card>

      {/* Contacts list */}
      <div className={styles.sectionHeader}>
        <Heading level={3} size="md" color="primary">ICE Kontakti</Heading>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusIcon />}
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          Dodaj kontakt
        </Button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <Card variant="elevated" padding="lg">
          <div className={styles.formTitle}>
            <Heading level={4} size="sm" color="accent">
              {editingId ? `Uredi kontakt` : `Nov ICE kontakt`}
            </Heading>
          </div>
          <div className={styles.formGrid}>
            <TextInput
              label="Ime in priimek"
              placeholder="Ana Novak"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <TextInput
              label="Razmerje"
              placeholder="Partner, starš, brat..."
              value={form.relation}
              onChange={(v) => setForm((f) => ({ ...f, relation: v }))}
              required
            />
            <TextInput
              label="Telefonska številka"
              placeholder="+38641123456"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              required
            />
            <SelectList
              label="Krvna skupina"
              options={BLOOD_TYPE_OPTIONS}
              value={form.bloodType}
              placeholder="Izberi krvno skupino..."
              onChange={(v) => setForm((f) => ({ ...f, bloodType: v }))}
            />
            <TextInput
              label="Alergije"
              placeholder="Penicilin, oreški..."
              value={form.allergies}
              onChange={(v) => setForm((f) => ({ ...f, allergies: v }))}
            />
            <TextInput
              label="Opombe"
              placeholder="Diabetes, srčna bolezen..."
              value={form.notes}
              onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
            />
          </div>
          <div className={styles.formCheckbox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.primary}
                onChange={(e) => setForm((f) => ({ ...f, primary: e.target.checked }))}
                className={styles.checkbox}
              />
              <span>Primarni kontakt</span>
            </label>
          </div>
          <div className={styles.formActions}>
            <Button variant="ghost" size="sm" onClick={() => resetForm()}>Prekliči</Button>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={() => { void handleSave(); }}
            >
              {editingId ? `Shrani spremembe` : `Dodaj kontakt`}
            </Button>
          </div>
        </Card>
      )}

      {/* Contacts */}
      {contacts.length === 0 && !showForm && (
        <Card variant="outlined" padding="lg">
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>👤</span>
            <Heading level={4} size="sm" color="secondary">Ni ICE kontaktov</Heading>
            <Paragraph variant="body" color="muted">
              Dodaj kontakte, ki jih bodo reševalci poklicali v sili.
            </Paragraph>
          </div>
        </Card>
      )}

      <div className={styles.contactsList}>
        {contacts.map((contact) => (
          <div key={contact.id}>
            <Card variant="default" padding="md">
              <div className={styles.contactRow}>
                <div className={classNames(styles.contactAvatar, { [styles.contactAvatarPrimary]: contact.primary })}>
                  {getInitials(contact.name)}
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactNameRow}>
                    <span className={styles.contactName}>{contact.name}</span>
                    {contact.primary && <span className={styles.primaryBadge}>Primarni</span>}
                  </div>
                  <span className={styles.contactRelation}>{contact.relation}</span>
                  {contact.bloodType && (
                    <span className={styles.contactBlood}>🩸 {contact.bloodType}</span>
                  )}
                </div>
                <div className={styles.contactActions}>
                  <a
                    href={`tel:${contact.phone}`}
                    className={styles.callBtn}
                    aria-label={`Pokliči ${contact.name}`}
                  >
                    <PhoneIcon />
                  </a>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => handleEdit(contact)}
                    aria-label={`Uredi ${contact.name}`}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => { void handleDelete(contact.id); }}
                    disabled={deletingId === contact.id}
                    aria-label={`Izbriši ${contact.name}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Numbers Tab ───────────────────────────────────────────────────────────────

type NumbersTabProps = {
  mockOverride?: EmergencyOverride;
};

function NumbersTab({ mockOverride }: NumbersTabProps) {
  const locationResult = useCountryFromLocation({ lat: undefined, lng: undefined });
  const autoCountry = (locationResult as Record<string, unknown>)?.country as string | null ?? null;
  const autoFlag = (locationResult as Record<string, unknown>)?.flag as string | null ?? null;
  const autoNumbers = (locationResult as Record<string, unknown>)?.emergencyNumbers as Record<string, string> | null ?? null;

  const [overrideCountry, setOverrideCountry] = useState(mockOverride?.country ?? ``);
  const [overridePolice, setOverridePolice] = useState(mockOverride?.police ?? ``);
  const [overrideAmbulance, setOverrideAmbulance] = useState(mockOverride?.ambulance ?? ``);
  const [overrideFire, setOverrideFire] = useState(mockOverride?.fire ?? ``);
  const [showOverride, setShowOverride] = useState(false);

  const displayCountry = overrideCountry || autoCountry || `Slovenija`;
  const displayFlag = autoFlag || `🇸🇮`;
  const police = overridePolice || autoNumbers?.police || `113`;
  const ambulance = overrideAmbulance || autoNumbers?.ambulance || `112`;
  const fire = overrideFire || autoNumbers?.fire || `112`;
  const general = `112`;

  const emergencyCards = [
    { label: `Policija`, icon: `🚔`, number: police, color: `#3b82f6` },
    { label: `Reševalci`, icon: `🚑`, number: ambulance, color: `#22c55e` },
    { label: `Gasilci`, icon: `🚒`, number: fire, color: `#f97316` },
    { label: `Splošna`, icon: `🆘`, number: general, color: `#ef4444` },
  ];

  return (
    <div className={styles.tabSection}>
      {/* Country badge */}
      <Card variant="elevated" padding="lg">
        <div className={styles.countryHeader}>
          <div className={styles.countryFlag}>{displayFlag}</div>
          <div>
            <Paragraph variant="label" color="muted">Trenutna lokacija</Paragraph>
            <Heading level={3} size="lg" color="primary">{displayCountry}</Heading>
            {autoCountry && (
              <Paragraph variant="caption" color="muted">Samodejno zaznano</Paragraph>
            )}
          </div>
        </div>
      </Card>

      {/* Big 112 call button */}
      <a href={`tel:112`} className={styles.bigCallButton} aria-label="Pokliči 112 - splošna nujna pomoč">
        <span className={styles.bigCallIcon}><PhoneIcon /></span>
        <span className={styles.bigCallText}>Pokliči 112</span>
        <span className={styles.bigCallSub}>Splošna nujna pomoč</span>
      </a>

      {/* Emergency grid */}
      <div className={styles.emergencyGrid}>
        {emergencyCards.map((card) => (
          <a
            key={card.label}
            href={`tel:${card.number}`}
            className={styles.emergencyCard}
            aria-label={`Pokliči ${card.label}: ${card.number}`}
          >
            <span className={styles.emergencyCardIcon}>{card.icon}</span>
            <span className={styles.emergencyCardLabel}>{card.label}</span>
            <span className={styles.emergencyCardNumber} style={{ color: card.color }}>
              {card.number}
            </span>
          </a>
        ))}
      </div>

      {/* Manual override */}
      <div className={styles.overrideToggle}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<EditIcon />}
          onClick={() => setShowOverride((v) => !v)}
        >
          {showOverride ? `Skrij ročni vnos` : `Ročni vnos številk`}
        </Button>
      </div>

      {showOverride && (
        <Card variant="outlined" padding="lg">
          <Heading level={4} size="sm" color="accent">Ročni vnos</Heading>
          <Paragraph variant="caption" color="muted">
            Prepiši samodejno zaznane številke za trenutno državo.
          </Paragraph>
          <div className={styles.overrideGrid}>
            <TextInput
              label="Država"
              placeholder="npr. Hrvaška"
              value={overrideCountry}
              onChange={(v) => setOverrideCountry(v)}
            />
            <TextInput
              label="Policija"
              placeholder="192"
              value={overridePolice}
              onChange={(v) => setOverridePolice(v)}
            />
            <TextInput
              label="Reševalci"
              placeholder="194"
              value={overrideAmbulance}
              onChange={(v) => setOverrideAmbulance(v)}
            />
            <TextInput
              label="Gasilci"
              placeholder="193"
              value={overrideFire}
              onChange={(v) => setOverrideFire(v)}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Borders Tab ───────────────────────────────────────────────────────────────

function BordersTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionIntro}>
        <Heading level={3} size="md" color="primary">Mejni prehodi</Heading>
        <Paragraph variant="body" color="secondary">
          Informacije o dokumentih, vinjetah in nasveti za 10 mejnih prehodov.
        </Paragraph>
      </div>

      <div className={styles.borderList}>
        {BORDER_CROSSINGS.map((crossing) => {
          const isExpanded = expandedId === crossing.id;
          return (
            <div key={crossing.id}>
              <Card variant="default" padding="none">
                <button
                  type="button"
                  className={styles.borderCardHeader}
                  onClick={() => toggleExpand(crossing.id)}
                  aria-expanded={isExpanded}
                >
                  <div className={styles.borderCardLeft}>
                    <div className={styles.borderCardName}>
                      <span className={styles.borderName}>{crossing.name}</span>
                      {crossing.vignetteRequired && (
                        <span className={styles.vignetteBadge}>🏷️ Vinjeta</span>
                      )}
                    </div>
                    <div className={styles.borderRoute}>
                      <span>{crossing.countryFrom}</span>
                      <span className={styles.borderArrow}>→</span>
                      <span>{crossing.countryTo}</span>
                    </div>
                  </div>
                  <div className={styles.borderCardRight}>
                    <div className={styles.waitTime}>
                      <span className={styles.waitTimeValue}>{crossing.avgWaitMin}</span>
                      <span className={styles.waitTimeUnit}>min</span>
                    </div>
                    <span className={classNames(styles.chevron, { [styles.chevronOpen]: isExpanded })}>
                      <ChevronIcon />
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className={styles.borderCardBody}>
                    <div className={styles.borderDetail}>
                      <Paragraph variant="label" color="muted">Dokumenti</Paragraph>
                      <div className={styles.docsList}>
                        {crossing.documents?.map((doc) => (
                          <span key={doc} className={styles.docBadge}>{doc}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.borderDetail}>
                      <Paragraph variant="label" color="muted">Vinjeta</Paragraph>
                      <Paragraph variant="body" color="primary">
                        {crossing.vignetteRequired ? `Obvezna` : `Ni potrebna`}
                      </Paragraph>
                    </div>
                    <div className={styles.borderDetail}>
                      <Paragraph variant="label" color="muted">Nasvet</Paragraph>
                      <Paragraph variant="body" color="secondary">{crossing.tips}</Paragraph>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Reports Tab ───────────────────────────────────────────────────────────────

function ReportsTab() {
  const hazardsHook = useHazards();
  const hazards = ((hazardsHook as Record<string, unknown>).hazards as unknown[] | undefined) ?? [];

  const HAZARD_TYPE_LABELS: Record<string, string> = {
    pothole: `Luknja v cesti`,
    oil: `Olje na cesti`,
    gravel: `Pesek / gramoz`,
    animal: `Žival na cesti`,
    accident: `Nesreča`,
    roadwork: `Dela na cesti`,
    flood: `Poplava`,
    ice: `Led / poledica`,
    other: `Drugo`,
  };

  const HAZARD_ICONS: Record<string, string> = {
    pothole: `🕳️`,
    oil: `🛢️`,
    gravel: `🪨`,
    animal: `🦌`,
    accident: `🚨`,
    roadwork: `🚧`,
    flood: `🌊`,
    ice: `🧊`,
    other: `⚠️`,
  };

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionIntro}>
        <Heading level={3} size="md" color="primary">Moja poročila</Heading>
        <Paragraph variant="body" color="secondary">
          Nevarnosti, ki si jih prijavil skupnosti motociklistov.
        </Paragraph>
      </div>

      {hazards.length === 0 && (
        <Card variant="outlined" padding="lg">
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🛡️</span>
            <Heading level={4} size="sm" color="secondary">Ni poročil</Heading>
            <Paragraph variant="body" color="muted">
              Še nisi prijavil nobene nevarnosti. Pomagaj skupnosti in prijavi nevarnost na karti.
            </Paragraph>
          </div>
        </Card>
      )}

      <div className={styles.reportsList}>
        {hazards.map((hazard) => {
          const h = hazard as Record<string, unknown>;
          const type = h.type as string;
          const reportedAt = h.reportedAt as number;
          const confirmedCount = h.confirmedCount as number;
          const lat = h.lat as number;
          const lng = h.lng as number;

          return (
            <div key={h.id as string}>
              <Card variant="default" padding="md">
                <div className={styles.reportRow}>
                  <div className={styles.reportIcon}>
                    {HAZARD_ICONS[type] ?? `⚠️`}
                  </div>
                  <div className={styles.reportInfo}>
                    <span className={styles.reportType}>
                      {HAZARD_TYPE_LABELS[type] ?? type}
                    </span>
                    <span className={styles.reportMeta}>
                      {formatDate(reportedAt)} · {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
                  </div>
                  <div className={styles.reportConfirmed}>
                    <span className={styles.confirmedCount}>{confirmedCount}</span>
                    <span className={styles.confirmedLabel}>potrjeno</span>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(` `)
    .map((part) => part[0])
    .join(``)
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(`sl-SI`, { day: `2-digit`, month: `2-digit`, year: `numeric` });
}

// ── Inline SVG Icons ──────────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
