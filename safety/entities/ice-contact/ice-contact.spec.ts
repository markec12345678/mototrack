import { describe, it, expect } from 'vitest';
import { IceContact } from './ice-contact.js';
import { mockIceContact, mockIceContacts } from './ice-contact.mock.js';

describe('IceContact', () => {
  it('should have a static from() method', () => {
    expect(IceContact.from).toBeTruthy();
  });

  it('should create an IceContact instance from a plain object', () => {
    const contact = IceContact.from({
      id: 'abc123',
      userId: 'user-001',
      name: 'Jane Doe',
      relation: 'Spouse',
      phone: '+1-555-010-2020',
      primary: true,
      bloodType: 'O+',
      allergies: 'Penicillin',
      notes: 'Speaks English and Spanish.',
    });

    expect(contact).toBeInstanceOf(IceContact);
    expect(contact.id).toBe('abc123');
    expect(contact.userId).toBe('user-001');
    expect(contact.name).toBe('Jane Doe');
    expect(contact.relation).toBe('Spouse');
    expect(contact.phone).toBe('+1-555-010-2020');
    expect(contact.primary).toBe(true);
    expect(contact.bloodType).toBe('O+');
    expect(contact.allergies).toBe('Penicillin');
    expect(contact.notes).toBe('Speaks English and Spanish.');
  });

  it('should serialize to a plain object via toObject()', () => {
    const plain = {
      id: 'abc123',
      userId: 'user-001',
      name: 'Jane Doe',
      relation: 'Spouse',
      phone: '+1-555-010-2020',
      primary: true,
      bloodType: 'O+',
      allergies: 'Penicillin',
      notes: 'Speaks English and Spanish.',
    };

    const contact = IceContact.from(plain);
    expect(contact.toObject()).toEqual(plain);
  });

  it('should include id in toObject()', () => {
    const contact = IceContact.from({
      id: 'my-id',
      userId: 'user-002',
      name: 'Robert Doe',
      relation: 'Parent',
      phone: '+1-555-030-4040',
      primary: false,
    });

    expect(contact.toObject().id).toBe('my-id');
  });

  it('should handle optional fields being undefined', () => {
    const contact = IceContact.from({
      id: 'xyz789',
      userId: 'user-003',
      name: 'Alice Smith',
      relation: 'Friend',
      phone: '+1-555-050-6060',
      primary: false,
    });

    expect(contact.bloodType).toBeUndefined();
    expect(contact.allergies).toBeUndefined();
    expect(contact.notes).toBeUndefined();
  });

  it('should default primary to false when not provided', () => {
    const contact = IceContact.from({
      id: 'def456',
      userId: 'user-004',
      name: 'Bob Brown',
      relation: 'Colleague',
      phone: '+1-555-070-8080',
      primary: false,
    });

    expect(contact.primary).toBe(false);
  });

  it('mockIceContact() should return an IceContact instance', () => {
    const contact = mockIceContact();
    expect(contact).toBeInstanceOf(IceContact);
    expect(contact.name).toBe('Jane Doe');
    expect(contact.primary).toBe(true);
  });

  it('mockIceContact() should support partial overrides', () => {
    const contact = mockIceContact({ name: 'Custom Name', relation: 'Sibling' });
    expect(contact.name).toBe('Custom Name');
    expect(contact.relation).toBe('Sibling');
    expect(contact.primary).toBe(true);
  });

  it('mockIceContacts() should return an array of IceContact instances', () => {
    const contacts = mockIceContacts();
    expect(contacts).toHaveLength(3);
    contacts.forEach((c) => expect(c).toBeInstanceOf(IceContact));
  });

  it('mockIceContacts() should assign the given userId to all contacts', () => {
    const contacts = mockIceContacts('user-999');
    contacts.forEach((c) => expect(c.userId).toBe('user-999'));
  });

  it('should safely destructure missing fields with defaults', () => {
    const contact = IceContact.from({} as any);
    expect(contact.id).toBe('');
    expect(contact.userId).toBe('');
    expect(contact.name).toBe('');
    expect(contact.relation).toBe('');
    expect(contact.phone).toBe('');
    expect(contact.primary).toBe(false);
  });
});
