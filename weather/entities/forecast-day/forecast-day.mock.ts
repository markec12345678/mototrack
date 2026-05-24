import { ForecastDay } from './forecast-day.js';
import type { PlainForecastDay } from './forecast-day.js';

const defaultDays: PlainForecastDay[] = [
  {
    date: '2024-06-01',
    tempMinC: 12.4,
    tempMaxC: 24.8,
    precipMm: 0.0,
    windKmh: 10.2,
    wmoCode: 0,
    label: 'Jasno',
    icon: '☀️',
  },
  {
    date: '2024-06-02',
    tempMinC: 14.1,
    tempMaxC: 22.3,
    precipMm: 1.4,
    windKmh: 18.5,
    wmoCode: 61,
    label: 'Dež',
    icon: '🌧️',
  },
  {
    date: '2024-06-03',
    tempMinC: 10.0,
    tempMaxC: 17.6,
    precipMm: 5.2,
    windKmh: 25.0,
    wmoCode: 95,
    label: 'Nevihta',
    icon: '⛈️',
  },
  {
    date: '2024-06-04',
    tempMinC: 8.5,
    tempMaxC: 15.2,
    precipMm: 0.8,
    windKmh: 12.0,
    wmoCode: 2,
    label: 'Delno oblačno',
    icon: '⛅',
  },
  {
    date: '2024-06-05',
    tempMinC: 11.3,
    tempMaxC: 20.7,
    precipMm: 0.0,
    windKmh: 8.4,
    wmoCode: 3,
    label: 'Oblačno',
    icon: '☁️',
  },
  {
    date: '2024-06-06',
    tempMinC: 13.0,
    tempMaxC: 26.1,
    precipMm: 0.0,
    windKmh: 6.0,
    wmoCode: 0,
    label: 'Jasno',
    icon: '☀️',
  },
  {
    date: '2024-06-07',
    tempMinC: 9.2,
    tempMaxC: 18.4,
    precipMm: 3.6,
    windKmh: 20.3,
    wmoCode: 80,
    label: 'Plohe',
    icon: '🌧️',
  },
];

export function mockForecastDays(overrides: Partial<PlainForecastDay>[] = []): ForecastDay[] {
  return defaultDays.map((day, i) =>
    ForecastDay.from({ ...day, ...(overrides[i] ?? {}) }),
  );
}
