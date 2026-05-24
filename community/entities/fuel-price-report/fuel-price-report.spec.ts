import { describe, it, expect } from 'vitest';
import { FuelPriceReport } from './fuel-price-report.js';
import { mockFuelPriceReports } from './fuel-price-report.mock.js';

describe('FuelPriceReport', () => {
  it('has a FuelPriceReport.from() static method', () => {
    expect(FuelPriceReport.from).toBeTruthy();
  });

  it('creates a FuelPriceReport instance from a plain object', () => {
    const plain = {
      id: 'report-001',
      country: 'Serbia',
      brand: 'NIS Petrol',
      petrolEur: 1.52,
      dieselEur: 1.48,
      location: 'Novi Sad, Bulevar Oslobođenja',
      reportedAt: 1700000000000,
      confirms: 14,
    };

    const report = FuelPriceReport.from(plain);

    expect(report).toBeInstanceOf(FuelPriceReport);
    expect(report.id).toBe('report-001');
    expect(report.country).toBe('Serbia');
    expect(report.brand).toBe('NIS Petrol');
    expect(report.petrolEur).toBe(1.52);
    expect(report.dieselEur).toBe(1.48);
    expect(report.location).toBe('Novi Sad, Bulevar Oslobođenja');
    expect(report.reportedAt).toBe(1700000000000);
    expect(report.confirms).toBe(14);
  });

  it('serializes to a plain object via toObject()', () => {
    const plain = {
      id: 'report-002',
      country: 'Croatia',
      brand: 'INA',
      petrolEur: 1.61,
      dieselEur: 1.55,
      location: 'Zagreb, Slavonska avenija',
      reportedAt: 1700001000000,
      confirms: 22,
    };

    const report = FuelPriceReport.from(plain);
    const obj = report.toObject();

    expect(obj).toEqual(plain);
  });

  it('toObject() includes the id field', () => {
    const report = FuelPriceReport.from({
      id: 'report-003',
      country: 'Slovenia',
      brand: 'Petrol',
      petrolEur: 1.68,
      dieselEur: 1.62,
      location: 'Ljubljana, Dunajska cesta',
      reportedAt: 1700002000000,
      confirms: 31,
    });

    expect(report.toObject().id).toBe('report-003');
  });

  it('handles missing optional fields with safe defaults', () => {
    const report = FuelPriceReport.from({
      id: '',
      country: '',
      brand: '',
      petrolEur: 0,
      dieselEur: 0,
      location: '',
      reportedAt: 0,
      confirms: 0,
    });

    expect(report.id).toBe('');
    expect(report.country).toBe('');
    expect(report.petrolEur).toBe(0);
    expect(report.confirms).toBe(0);
  });
});

describe('mockFuelPriceReports', () => {
  it('returns 6 seeded reports', () => {
    const reports = mockFuelPriceReports();
    expect(reports).toHaveLength(6);
  });

  it('returns FuelPriceReport instances', () => {
    const reports = mockFuelPriceReports();
    reports.forEach((r) => expect(r).toBeInstanceOf(FuelPriceReport));
  });

  it('covers 6 distinct Balkan countries', () => {
    const reports = mockFuelPriceReports();
    const countries = new Set(reports.map((r) => r.country));
    expect(countries.size).toBe(6);
  });

  it('accepts partial overrides applied to all reports', () => {
    const reports = mockFuelPriceReports({ country: 'Montenegro' });
    reports.forEach((r) => expect(r.country).toBe('Montenegro'));
  });

  it('all reports have positive petrol and diesel prices', () => {
    const reports = mockFuelPriceReports();
    reports.forEach((r) => {
      expect(r.petrolEur).toBeGreaterThan(0);
      expect(r.dieselEur).toBeGreaterThan(0);
    });
  });
});
