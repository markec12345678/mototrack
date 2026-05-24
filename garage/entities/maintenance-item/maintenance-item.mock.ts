import { MaintenanceItem, PlainMaintenanceItem } from './maintenance-item.js';

/**
 * Generates a simple browser-compatible UUID v4.
 */
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const TASK_TEMPLATES: Array<{
  name: string;
  intervalKm: number;
  intervalDays: number;
}> = [
  { name: 'Oil & Filter Change', intervalKm: 5_000, intervalDays: 180 },
  { name: 'Chain Lubrication', intervalKm: 1_000, intervalDays: 30 },
  { name: 'Tyre Pressure Check', intervalKm: 500, intervalDays: 14 },
  { name: 'Brake Fluid Replacement', intervalKm: 20_000, intervalDays: 730 },
  { name: 'Air Filter Inspection', intervalKm: 10_000, intervalDays: 365 },
  { name: 'Spark Plug Replacement', intervalKm: 15_000, intervalDays: 540 },
];

/**
 * Creates a single mock MaintenanceItem with optional property overrides.
 */
export function mockMaintenanceItem(
  bikeId: string,
  taskIndex: number,
  overrides: Partial<PlainMaintenanceItem> = {},
): MaintenanceItem {
  const template = TASK_TEMPLATES[taskIndex % TASK_TEMPLATES.length];
  const now = Date.now();

  // Spread the usage across the 0 → danger range for visual variety
  const ratioSeeds = [0.2, 0.45, 0.65, 0.85, 1.05, 1.3];
  const seed = ratioSeeds[taskIndex % ratioSeeds.length];

  const lastServiceKm = Math.round(12_000 - template.intervalKm * seed);
  const lastServiceAt = now - Math.round(template.intervalDays * seed * 86_400_000);

  const plain: PlainMaintenanceItem = {
    id: uuid(),
    bikeId,
    name: template.name,
    intervalKm: template.intervalKm,
    intervalDays: template.intervalDays,
    lastServiceKm,
    lastServiceAt,
    history: [
      {
        atKm: lastServiceKm,
        atDate: lastServiceAt,
        note: 'Routine service',
      },
    ],
    ...overrides,
  };

  return MaintenanceItem.from(plain);
}

/**
 * Seeds 6 MaintenanceItem mocks for the given primary bike id.
 */
export function mockMaintenanceItems(
  bikeId: string = 'primary-bike-1',
  overrides: Partial<PlainMaintenanceItem> = {},
): MaintenanceItem[] {
  return TASK_TEMPLATES.map((_, index) =>
    mockMaintenanceItem(bikeId, index, overrides),
  );
}
