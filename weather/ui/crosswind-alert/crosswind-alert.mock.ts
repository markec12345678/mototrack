import type { CrosswindLevel } from './crosswind-alert-level-type';

export type CrosswindAlertMock = {
  level: CrosswindLevel;
  crossKmh: number;
  headingDeg: number;
  label: string;
};

export const mockNone: CrosswindAlertMock = {
  level: `none`,
  crossKmh: 4,
  headingDeg: 90,
  label: `No crosswind`,
};

export const mockModerate: CrosswindAlertMock = {
  level: `moderate`,
  crossKmh: 22,
  headingDeg: 90,
  label: `Moderate crosswind`,
};

export const mockStrong: CrosswindAlertMock = {
  level: `strong`,
  crossKmh: 41,
  headingDeg: 90,
  label: `Strong crosswind`,
};

export const mockDangerous: CrosswindAlertMock = {
  level: `dangerous`,
  crossKmh: 68,
  headingDeg: 90,
  label: `Dangerous crosswind`,
};

export const allMocks: CrosswindAlertMock[] = [
  mockNone,
  mockModerate,
  mockStrong,
  mockDangerous,
];
