import { describe, it, expect } from 'vitest';
import { ForecastDay } from './forecast-day.js';
import { mockForecastDays } from './forecast-day.mock.js';

describe('ForecastDay', () => {
  it('has a ForecastDay.from() static method', () => {
    expect(ForecastDay.from).toBeTruthy();
  });

  it('creates a ForecastDay from a plain object', () => {
    const day = ForecastDay.from({
      date: '2024-06-01',
      tempMinC: 12.0,
      tempMaxC: 24.0,
      precipMm: 0.0,
      windKmh: 10.0,
      wmoCode: 0,
      label: 'Jasno',
      icon: '☀️',
    });

    expect(day.date).toBe('2024-06-01');
    expect(day.tempMinC).toBe(12.0);
    expect(day.tempMaxC).toBe(24.0);
    expect(day.precipMm).toBe(0.0);
    expect(day.windKmh).toBe(10.0);
    expect(day.wmoCode).toBe(0);
    expect(day.label).toBe('Jasno');
    expect(day.icon).toBe('☀️');
  });

  it('exposes `id` as the date string', () => {
    const day = ForecastDay.from({
      date: '2024-06-01',
      tempMinC: 10,
      tempMaxC: 20,
      precipMm: 0,
      windKmh: 5,
      wmoCode: 1,
      label: 'Delno oblačno',
      icon: '⛅',
    });

    expect(day.id).toBe('2024-06-01');
  });

  it('serializes to a plain object via toObject()', () => {
    const day = ForecastDay.from({
      date: '2024-06-02',
      tempMinC: 14.0,
      tempMaxC: 22.0,
      precipMm: 1.4,
      windKmh: 18.0,
      wmoCode: 61,
      label: 'Dež',
      icon: '🌧️',
    });

    const obj = day.toObject();
    expect(obj.id).toBe('2024-06-02');
    expect(obj.date).toBe('2024-06-02');
    expect(obj.tempMinC).toBe(14.0);
    expect(obj.tempMaxC).toBe(22.0);
    expect(obj.precipMm).toBe(1.4);
    expect(obj.windKmh).toBe(18.0);
    expect(obj.wmoCode).toBe(61);
    expect(obj.label).toBe('Dež');
    expect(obj.icon).toBe('🌧️');
  });

  describe('fromOpenMeteoDaily', () => {
    it('has a ForecastDay.fromOpenMeteoDaily() static method', () => {
      expect(ForecastDay.fromOpenMeteoDaily).toBeTruthy();
    });

    it('parses an Open-Meteo daily response into ForecastDay instances', () => {
      const json = {
        daily: {
          time: ['2024-06-01', '2024-06-02'],
          temperature_2m_min: [12.0, 14.0],
          temperature_2m_max: [24.0, 22.0],
          precipitation_sum: [0.0, 1.4],
          windspeed_10m_max: [10.0, 18.0],
          weathercode: [0, 61],
        },
      };

      const days = ForecastDay.fromOpenMeteoDaily(json);

      expect(days).toHaveLength(2);

      expect(days[0].date).toBe('2024-06-01');
      expect(days[0].tempMinC).toBe(12.0);
      expect(days[0].tempMaxC).toBe(24.0);
      expect(days[0].precipMm).toBe(0.0);
      expect(days[0].windKmh).toBe(10.0);
      expect(days[0].wmoCode).toBe(0);
      expect(days[0].label).toBe('Jasno');
      expect(days[0].icon).toBe('☀️');

      expect(days[1].date).toBe('2024-06-02');
      expect(days[1].wmoCode).toBe(61);
      expect(days[1].label).toBe('Dež');
      expect(days[1].icon).toBe('🌧️');
    });

    it('returns an empty array when daily block is missing', () => {
      const days = ForecastDay.fromOpenMeteoDaily({});
      expect(days).toHaveLength(0);
    });

    it('returns an empty array when time array is empty', () => {
      const days = ForecastDay.fromOpenMeteoDaily({
        daily: {
          time: [],
          temperature_2m_min: [],
          temperature_2m_max: [],
          precipitation_sum: [],
          windspeed_10m_max: [],
          weathercode: [],
        },
      });
      expect(days).toHaveLength(0);
    });

    it('maps WMO code 95 to thunder label and icon', () => {
      const json = {
        daily: {
          time: ['2024-06-03'],
          temperature_2m_min: [10.0],
          temperature_2m_max: [17.0],
          precipitation_sum: [5.2],
          windspeed_10m_max: [25.0],
          weathercode: [95],
        },
      };

      const [day] = ForecastDay.fromOpenMeteoDaily(json);
      expect(day.wmoCode).toBe(95);
      expect(day.label).toBe('Nevihta');
      expect(day.icon).toBe('⛈️');
    });

    it('maps WMO code 71 to snow label and icon', () => {
      const json = {
        daily: {
          time: ['2024-12-15'],
          temperature_2m_min: [-3.0],
          temperature_2m_max: [1.0],
          precipitation_sum: [8.0],
          windspeed_10m_max: [12.0],
          weathercode: [71],
        },
      };

      const [day] = ForecastDay.fromOpenMeteoDaily(json);
      expect(day.label).toBe('Sneg');
      expect(day.icon).toBe('❄️');
    });
  });

  describe('mockForecastDays', () => {
    it('returns 7 mock ForecastDay instances by default', () => {
      const days = mockForecastDays();
      expect(days).toHaveLength(7);
      days.forEach((d) => expect(d).toBeInstanceOf(ForecastDay));
    });

    it('supports partial overrides per day', () => {
      const days = mockForecastDays([{ tempMaxC: 99.9 }]);
      expect(days[0].tempMaxC).toBe(99.9);
      expect(days[1].tempMaxC).not.toBe(99.9);
    });
  });
});
