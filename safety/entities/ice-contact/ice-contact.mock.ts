import { IceContact } from './ice-contact.js';
import type { PlainIceContact } from './ice-contact.js';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 11);
}

export function mockIceContact(overrides: Partial<PlainIceContact> = {}): IceContact {
  return IceContact.from({
    id: generateId(),
    userId: 'user-001',
    name: 'Jane Doe',
    relation: 'Spouse',
    phone: '+1-555-010-2020',
    primary: true,
    bloodType: 'O+',
    allergies: 'Penicillin',
    notes: 'Speaks English and Spanish.',
    ...overrides,
  });
}

export function mockIceContacts(userId = 'user-001'): IceContact[] {
  return [
    mockIceContact({
      id: generateId(),
      userId,
      name: 'Jane Doe',
      relation: 'Spouse',
      phone: '+1-555-010-2020',
      primary: true,
      bloodType: 'O+',
      allergies: 'Penicillin',
      notes: 'Speaks English and Spanish.',
    }),
    mockIceContact({
      id: generateId(),
      userId,
      name: 'Robert Doe',
      relation: 'Parent',
      phone: '+1-555-030-4040',
      primary: false,
      bloodType: 'A+',
      allergies: undefined,
      notes: 'Available after 6 PM.',
    }),
    mockIceContact({
      id: generateId(),
      userId,
      name: 'Alice Smith',
      relation: 'Friend',
      phone: '+1-555-050-6060',
      primary: false,
      bloodType: undefined,
      allergies: undefined,
      notes: undefined,
    }),
  ];
}
