import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from '@markec/mototrack-design.actions.button';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { useFuelPrices } from '@markec/community.hooks.use-fuel-prices';
import styles from './fuel-prices-board.module.scss';

type CountryCode = `SI` | `HR` | `BA` | `ME` | `RS` | `MK` | `AL` | `BG` | `RO` | `GR`;

type FuelPriceReport = {
  id: string;
  country: string;
  brand: string;
  petrolEur: number;
  dieselEur: number;
  location: string;
  reportedAt: number;
  confirms: number;
};

type CountryAverage = {
  country: string;
  avgPetrolEur: number;
  avgDieselEur: number;
  reportCount: number;
  lastReportedAt: number;
};

type ReportFormData = {
  country: string;
  brand: string;
  petrolEur: string;
  dieselEur: string;
  location: string;
};

const COUNTRY_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: `SI`, label: `Slovenia` },
  { code: `HR`, label: `Croatia` },
  { code: `BA`, label: `Bosnia & Herzegovina` },
  { code: `ME`, label: `Montenegro` },
  { code: `RS`, label: `Serbia` },
  { code: `MK`, label: `North Macedonia` },
  { code: `AL`, label: `Albania` },
  { code: `BG`, label: `Bulgaria` },
  { code: `RO`, label: `Romania` },
  { code: `GR`, label: `Greece` },
];

const DEFAULT_FORM: ReportFormData = {
  country: `SI`,
  brand: ``,
  petrolEur: ``,
  dieselEur: ``,
  location: ``,
};

export type FuelPricesBoardProps = {
  /**
   * Optional mock reports for testing/compositions.
   */
  mockReports?: FuelPriceReport[];

  /**
   * Optional mock country averages for testing/compositions.
   */
  mockAverages?: CountryAverage[];

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

function formatPrice(value: number): string {
  return `€${value.toFixed(3)}`;
}

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return `just now`;
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function computeAverages(reports: FuelPriceReport[]): CountryAverage[] {
  const map: Record<string, { petrolSum: number; dieselSum: number; count: number; lastAt: number }> = {};
  for (const r of reports) {
    if (!map[r.country]) {
      map[r.country] = { petrolSum: 0, dieselSum: 0, count: 0, lastAt: 0 };
    }
    const entry = map[r.country];
    entry.petrolSum += r.petrolEur;
    entry.dieselSum += r.dieselEur;
    entry.count += 1;
    if (r.reportedAt > entry.lastAt) entry.lastAt = r.reportedAt;
  }
  return Object.keys(map).map((country) => {
    const entry = map[country];
    return {
      country,
      avgPetrolEur: entry.petrolSum / entry.count,
      avgDieselEur: entry.dieselSum / entry.count,
      reportCount: entry.count,
      lastReportedAt: entry.lastAt,
    };
  }).sort((a, b) => a.avgPetrolEur - b.avgPetrolEur);
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1a3.5 3.5 0 013.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 016 1z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FuelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7h2a1 1 0 011 1v5a1 1 0 01-1 1h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 8h3M6 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 11V6L6.5 1.5a1 1 0 011.8.6V5h2.2a1 1 0 01.98 1.2l-.8 4A1 1 0 019.7 11H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 11H2V6h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GasStationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 8h3a1 1 0 011 1v7a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 9h4M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type ReportFormProps = {
  onSubmit: (data: ReportFormData) => Promise<void>;
};

function ReportForm({ onSubmit }: ReportFormProps) {
  const [form, setForm] = useState<ReportFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<ReportFormData>>({});

  const validate = (): boolean => {
    const next: Partial<ReportFormData> = {};
    if (!form.brand.trim()) next.brand = `Brand is required`;
    if (!form.petrolEur || Number.isNaN(Number(form.petrolEur)) || Number(form.petrolEur) <= 0) {
      next.petrolEur = `Enter a valid petrol price`;
    }
    if (!form.dieselEur || Number.isNaN(Number(form.dieselEur)) || Number(form.dieselEur) <= 0) {
      next.dieselEur = `Enter a valid diesel price`;
    }
    if (!form.location.trim()) next.location = `Location is required`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      setSuccess(true);
      setForm(DEFAULT_FORM);
      setErrors({});
      setTimeout(() => setSuccess(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (field: keyof ReportFormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formIconWrapper}>
          <FuelIcon />
        </div>
        <div className={styles.formHeaderText}>
          <h3 className={styles.formTitle}>Report a Fuel Price</h3>
          <p className={styles.formDescription}>Help fellow riders with accurate, real-time fuel prices across the Balkans.</p>
        </div>
      </div>

      <div className={styles.formBody}>
        {success && (
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>
              <CheckIcon />
            </div>
            <div className={styles.successText}>
              <p className={styles.successTitle}>Price reported successfully!</p>
              <p className={styles.successSub}>Your report is now visible to other riders. Thank you!</p>
            </div>
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.selectWrapper}>
            <span className={styles.selectLabel}>Country</span>
            <select
              className={styles.select}
              value={form.country}
              onChange={(e) => setField(`country`)(e.target.value)}
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label="Station Brand"
            placeholder="e.g. OMV, Shell, Petrol"
            value={form.brand}
            onChange={setField(`brand`)}
            errorMessage={errors.brand}
          />
        </div>

        <div className={styles.formRow}>
          <TextInput
            type="number"
            label="Petrol (€/L)"
            placeholder="e.g. 1.52"
            value={form.petrolEur}
            onChange={setField(`petrolEur`)}
            errorMessage={errors.petrolEur}
          />

          <TextInput
            type="number"
            label="Diesel (€/L)"
            placeholder="e.g. 1.44"
            value={form.dieselEur}
            onChange={setField(`dieselEur`)}
            errorMessage={errors.dieselEur}
          />
        </div>

        <TextInput
          label="Location"
          placeholder="e.g. Ljubljana, Šmartinska cesta"
          value={form.location}
          onChange={setField(`location`)}
          errorMessage={errors.location}
        />

        <div className={styles.formActions}>
          <Button
            variant="ghost"
            onClick={() => {
              setForm(DEFAULT_FORM);
              setErrors({});
            }}
            disabled={submitting}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            loading={submitting}
            onClick={() => { void handleSubmit(); }}
          >
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  );
}

type RecentReportsProps = {
  reports: FuelPriceReport[];
};

function RecentReports({ reports }: RecentReportsProps) {
  if (reports.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <GasStationIcon />
        </div>
        <p className={styles.emptyTitle}>No reports yet</p>
        <p className={styles.emptySubtitle}>Be the first to report a fuel price for this country.</p>
      </div>
    );
  }

  return (
    <div className={styles.reportsGrid}>
      {reports.map((report) => (
        <div key={report.id} className={styles.reportCard}>
          <div className={styles.reportCardHeader}>
            <span className={styles.reportBrand}>{report.brand}</span>
            <span className={styles.reportTime}>{formatTimeAgo(report.reportedAt)}</span>
          </div>
          <span className={styles.reportLocation}>
            <LocationIcon />
            {report.location}
          </span>
          <div className={styles.reportPrices}>
            <div className={styles.reportPriceItem}>
              <span className={styles.reportPriceLabel}>Petrol</span>
              <span className={classNames(styles.reportPriceValue, styles.petrolPrice)}>
                {formatPrice(report.petrolEur)}
              </span>
            </div>
            <div className={styles.reportPriceItem}>
              <span className={styles.reportPriceLabel}>Diesel</span>
              <span className={classNames(styles.reportPriceValue, styles.dieselPrice)}>
                {formatPrice(report.dieselEur)}
              </span>
            </div>
          </div>
          <span className={styles.reportConfirms}>
            <ThumbUpIcon />
            <span className={styles.confirmCount}>{report.confirms}</span>
            {` `}confirms
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * FuelPricesBoard — Country average table, report price form, and per-country recent reports.
 * Uses the useFuelPrices hook for live GraphQL data with optional mock fallback.
 */
export function FuelPricesBoard({ mockReports, mockAverages, className, style }: FuelPricesBoardProps) {
  const { reports = [], loading: hookLoading = false } = useFuelPrices();
  const report = undefined;
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  // When mock data is provided, bypass the hook loading state entirely
  const isMocked = mockReports !== undefined || mockAverages !== undefined;
  const loading = isMocked ? false : hookLoading;

  const activeReports: FuelPriceReport[] = mockReports ?? (reports as FuelPriceReport[]);
  const averages: CountryAverage[] = mockAverages ?? computeAverages(activeReports);

  const handleReport = async (data: ReportFormData) => {
    await report({
      country: data.country,
      brand: data.brand,
      petrolEur: Number(data.petrolEur),
      dieselEur: Number(data.dieselEur),
      location: data.location,
    });
  };

  const toggleCountry = (country: string) => {
    setExpandedCountry((prev) => (prev === country ? null : country));
  };

  const getCountryReports = (country: string): FuelPriceReport[] =>
    activeReports.filter((r) => r.country === country).slice(0, 6);

  return (
    <div className={classNames(styles.board, className)} style={style}>
      {/* ── Country Average Table ─────────────────────────────────────────── */}
      <section>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Live Data</p>
            <h2 className={styles.sectionTitle}>Country Fuel Averages</h2>
            <p className={styles.sectionSubtitle}>Crowd-sourced averages across 10 Balkan countries</p>
          </div>
          <div className={styles.updateBadge}>
            <span className={styles.liveDot} />
            Community Updated
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={styles.tableHeadRow}>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Country</th>
                <th className={classNames(styles.th, styles.thRight)}>Avg Petrol</th>
                <th className={classNames(styles.th, styles.thRight)}>Avg Diesel</th>
                <th className={classNames(styles.th, styles.thRight)}>Reports</th>
                <th className={classNames(styles.th, styles.thRight)}>Last Update</th>
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {loading && (
                <tr className={styles.loadingRow}>
                  <td colSpan={7}>
                    <Paragraph variant="caption" color="muted">Loading fuel prices…</Paragraph>
                  </td>
                </tr>
              )}
              {averages.map((avg, index) => {
                const isExpanded = expandedCountry === avg.country;
                const rankClass =
                  index === 0 ? styles.rankBadgeFirst :
                  index === 1 ? styles.rankBadgeSecond :
                  index === 2 ? styles.rankBadgeThird : ``;
                const countryReports = getCountryReports(avg.country);

                return (
                  <React.Fragment key={avg.country}>
                    <tr
                      className={classNames(styles.tableRow, { [styles.tableRowActive]: isExpanded })}
                      onClick={() => toggleCountry(avg.country)}
                    >
                      <td className={styles.td}>
                        <span className={classNames(styles.rankBadge, rankClass)}>
                          {index + 1}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.countryCell}>
                          <CountryFlag
                            code={avg.country as CountryCode}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className={classNames(styles.td, styles.tdRight, styles.priceCell, styles.petrolPrice)}>
                        {formatPrice(avg.avgPetrolEur)}
                      </td>
                      <td className={classNames(styles.td, styles.tdRight, styles.priceCell, styles.dieselPrice)}>
                        {formatPrice(avg.avgDieselEur)}
                      </td>
                      <td className={classNames(styles.td, styles.tdRight)}>
                        <span className={styles.reportCount}>{avg.reportCount}</span>
                      </td>
                      <td className={classNames(styles.td, styles.tdRight)}>
                        <Paragraph variant="caption" color="muted">
                          {formatTimeAgo(avg.lastReportedAt)}
                        </Paragraph>
                      </td>
                      <td className={styles.td}>
                        <span className={classNames(styles.chevronIcon, { [styles.chevronIconActive]: isExpanded })}>
                          <ChevronRightIcon />
                        </span>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className={styles.reportsPanelRow}>
                        <td colSpan={7}>
                          <div className={styles.reportsPanelInner}>
                            <RecentReports reports={countryReports} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {!loading && averages.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <GasStationIcon />
                      </div>
                      <p className={styles.emptyTitle}>No fuel prices reported yet</p>
                      <p className={styles.emptySubtitle}>Be the first to report a price below.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Report Form ───────────────────────────────────────────────────── */}
      <section>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Contribute</p>
            <h2 className={styles.sectionTitle}>Report a Price</h2>
            <p className={styles.sectionSubtitle}>Spotted a good deal? Share it with the community.</p>
          </div>
        </div>
        <ReportForm onSubmit={handleReport} />
      </section>
    </div>
  );
}
