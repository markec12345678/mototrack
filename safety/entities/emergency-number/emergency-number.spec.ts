import { describe, it, expect } from 'vitest';
import {
  EmergencyNumber,
  EMERGENCY_NUMBERS,
  getEmergencyNumber,
  listEmergencyNumbers,
} from './emergency-number.js';
import { mockEmergencyNumber, mockEmergencyNumbers } from './emergency-number.mock.js';

const BALKAN_ISOS = ['HR', 'SI', 'RS', 'BA', 'ME', 'MK', 'AL', 'XK', 'BG', 'GR'];

describe('EmergencyNumber entity', () => {
  it('has a static from() method', () => {
    expect(EmergencyNumber.from).toBeTruthy();
  });

  it('creates an instance via from()', () => {
    const entry = EmergencyNumber.from({
      iso: 'HR',
      country: 'Croatia',
      police: '192',
      ambulance: '194',
      fire: '193',
      eu: '112',
      assistance: '1987',
    });

    expect(entry).toBeInstanceOf(EmergencyNumber);
    expect(entry.iso).toBe('HR');
    expect(entry.country).toBe('Croatia');
    expect(entry.police).toBe('192');
    expect(entry.ambulance).toBe('194');
    expect(entry.fire).toBe('193');
    expect(entry.eu).toBe('112');
    expect(entry.assistance).toBe('1987');
  });

  it('exposes id as the ISO code', () => {
    const entry = mockEmergencyNumber({ iso: 'SI' });
    expect(entry.id).toBe('SI');
  });

  it('serializes to a plain object via toObject()', () => {
    const entry = mockEmergencyNumber();
    const plain = entry.toObject();

    expect(plain).toEqual({
      iso: 'HR',
      country: 'Croatia',
      police: '192',
      ambulance: '194',
      fire: '193',
      eu: '112',
      assistance: '1987',
    });
  });

  it('toObject() includes an id field equal to iso', () => {
    const entry = mockEmergencyNumber({ iso: 'GR' });
    expect(entry.toObject().iso).toBe('GR');
    expect(entry.id).toBe('GR');
  });

  it('eu is always 112', () => {
    listEmergencyNumbers().forEach((entry) => {
      expect(entry.eu).toBe('112');
    });
  });
});

describe('EMERGENCY_NUMBERS dataset', () => {
  it('contains all 10 Balkan countries', () => {
    BALKAN_ISOS.forEach((iso) => {
      expect(EMERGENCY_NUMBERS).toHaveProperty(iso);
    });
  });

  it('has exactly 10 entries', () => {
    expect(Object.keys(EMERGENCY_NUMBERS)).toHaveLength(10);
  });

  it('every entry is an EmergencyNumber instance', () => {
    Object.values(EMERGENCY_NUMBERS).forEach((entry) => {
      expect(entry).toBeInstanceOf(EmergencyNumber);
    });
  });

  it('every entry has non-empty required fields', () => {
    Object.values(EMERGENCY_NUMBERS).forEach((entry) => {
      expect(entry.iso).toBeTruthy();
      expect(entry.country).toBeTruthy();
      expect(entry.police).toBeTruthy();
      expect(entry.ambulance).toBeTruthy();
      expect(entry.fire).toBeTruthy();
      expect(entry.assistance).toBeTruthy();
    });
  });
});

describe('getEmergencyNumber()', () => {
  it('returns the correct entry for a known ISO code', () => {
    const entry = getEmergencyNumber('HR');
    expect(entry).toBeDefined();
    expect(entry?.country).toBe('Croatia');
  });

  it('is case-insensitive', () => {
    const lower = getEmergencyNumber('hr');
    const upper = getEmergencyNumber('HR');
    expect(lower?.iso).toBe(upper?.iso);
  });

  it('returns undefined for an unknown ISO code', () => {
    expect(getEmergencyNumber('XX')).toBeUndefined();
  });
});

describe('listEmergencyNumbers()', () => {
  it('returns an array of 10 entries', () => {
    expect(listEmergencyNumbers()).toHaveLength(10);
  });

  it('returns EmergencyNumber instances', () => {
    listEmergencyNumbers().forEach((entry) => {
      expect(entry).toBeInstanceOf(EmergencyNumber);
    });
  });
});

describe('mockEmergencyNumber()', () => {
  it('returns an EmergencyNumber instance', () => {
    expect(mockEmergencyNumber()).toBeInstanceOf(EmergencyNumber);
  });

  it('applies partial overrides', () => {
    const entry = mockEmergencyNumber({ iso: 'BG', country: 'Bulgaria' });
    expect(entry.iso).toBe('BG');
    expect(entry.country).toBe('Bulgaria');
    expect(entry.police).toBe('192'); // default from Croatia mock base
  });
});

describe('mockEmergencyNumbers()', () => {
  it('returns an array of mock entries', () => {
    const list = mockEmergencyNumbers();
    expect(list.length).toBeGreaterThan(0);
    list.forEach((entry) => {
      expect(entry).toBeInstanceOf(EmergencyNumber);
    });
  });
});
