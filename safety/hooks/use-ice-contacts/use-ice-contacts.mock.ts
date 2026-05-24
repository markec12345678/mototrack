import { IceContact } from '@markec/safety.entities.ice-contact';

const mockPlain = [
  {
    id: 'ice-001',
    userId: 'user-001',
    name: 'Ana Kovač',
    relation: 'Spouse',
    phone: '+386 41 123 456',
    primary: true,
    bloodType: 'A+',
    allergies: 'Penicillin',
    notes: 'Speaks Slovenian and English.',
  },
  {
    id: 'ice-002',
    userId: 'user-001',
    name: 'Marko Novak',
    relation: 'Brother',
    phone: '+386 31 987 654',
    primary: false,
    bloodType: 'O+',
    allergies: undefined,
    notes: 'Available 24/7.',
  },
  {
    id: 'ice-003',
    userId: 'user-001',
    name: 'Dr. Petra Horvat',
    relation: 'Family Doctor',
    phone: '+386 1 234 5678',
    primary: false,
    bloodType: undefined,
    allergies: undefined,
    notes: 'ZD Ljubljana Šiška. Mon–Fri 8–16.',
  },
];

/**
 * A set of mock IceContact entities for use in tests and compositions.
 */
export const iceContactMocks: IceContact[] = mockPlain.map((plain) =>
  IceContact.from(plain)
);

/**
 * A single primary ICE contact mock.
 */
export const primaryContactMock: IceContact = iceContactMocks[0];
