import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { mockMaintenanceItems } from './use-maintenance.mock.js';
import { useMaintenance } from './use-maintenance.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

describe('useMaintenance', () => {
  it('returns mock items when mockData is provided', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    expect(result.current.items).toHaveLength(mockMaintenanceItems.length);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('returns items with correct shape', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    const first = result.current.items[0];
    expect(first.id).toBe('maint-001');
    expect(first.name).toBe('Engine Oil & Filter');
    expect(first.intervalKm).toBe(7500);
    expect(first.intervalDays).toBe(365);
  });

  it('returns empty items when mockData is an empty array', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: [] }),
      { wrapper }
    );

    expect(result.current.items).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });

  it('exposes save and markServiced as functions', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    expect(typeof result.current.save).toBe('function');
    expect(typeof result.current.markServiced).toBe('function');
  });

  it('exposes refetch as a function', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    expect(typeof result.current.refetch).toBe('function');
  });

  it('saving is false initially', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    expect(result.current.saving).toBe(false);
  });

  it('items have history arrays', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    const itemWithHistory = result.current.items.find((i) => i.id === 'maint-001');
    expect(itemWithHistory?.history).toBeDefined();
    expect(Array.isArray(itemWithHistory?.history)).toBe(true);
    expect(itemWithHistory?.history?.length).toBeGreaterThan(0);
  });

  it('items expose lastServiceKm and lastServiceAt', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    const item = result.current.items[0];
    expect(typeof item.lastServiceKm).toBe('number');
    expect(typeof item.lastServiceAt).toBe('number');
  });

  it('does not enter loading state when mockData is provided', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    expect(result.current.loading).toBe(false);
  });

  it('items bikeId matches the provided bikeId', () => {
    const { result } = renderHook(
      () => useMaintenance('bike-ktm-890', { mockData: mockMaintenanceItems }),
      { wrapper }
    );

    result.current.items.forEach((item) => {
      expect(item.bikeId).toBe('bike-ktm-890');
    });
  });
});
