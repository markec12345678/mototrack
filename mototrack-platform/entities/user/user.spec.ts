import { describe, it, expect } from 'vitest';
import { User, calculateLevel } from './user.js';
import { mockUser, mockUsers } from './user.mock.js';

describe('User entity', () => {
  it('has a User.from() static method', () => {
    expect(User.from).toBeTruthy();
  });

  it('creates a User instance via User.from()', () => {
    const user = mockUser();
    expect(user).toBeInstanceOf(User);
  });

  it('exposes all expected properties', () => {
    const user = mockUser({
      id: 'u-1',
      email: 'test@mototrack.app',
      username: 'tester',
      displayName: 'Tester',
      country: 'SI',
      language: 'sl',
      points: 200,
      role: 'rider',
      primaryBikeId: 'bike-x',
    });

    expect(user.id).toBe('u-1');
    expect(user.email).toBe('test@mototrack.app');
    expect(user.username).toBe('tester');
    expect(user.displayName).toBe('Tester');
    expect(user.country).toBe('SI');
    expect(user.language).toBe('sl');
    expect(user.points).toBe(200);
    expect(user.role).toBe('rider');
    expect(user.primaryBikeId).toBe('bike-x');
  });

  it('calculates level from points via getter', () => {
    const user = mockUser({ points: 350 });
    expect(user.level).toBe(calculateLevel(350));
  });

  it('serializes to a plain object via toObject()', () => {
    const user = mockUser({ id: 'u-2', points: 100 });
    const plain = user.toObject();

    expect(plain.id).toBe('u-2');
    expect(plain.points).toBe(100);
    expect(plain).toHaveProperty('email');
    expect(plain).toHaveProperty('username');
    expect(plain).toHaveProperty('displayName');
    expect(plain).toHaveProperty('country');
    expect(plain).toHaveProperty('language');
    expect(plain).toHaveProperty('role');
    expect(plain).toHaveProperty('createdAt');
  });

  it('round-trips through from() and toObject()', () => {
    const user = mockUser({ id: 'u-3', email: 'roundtrip@mototrack.app' });
    const plain = user.toObject();
    const restored = User.from(plain);

    expect(restored.id).toBe(user.id);
    expect(restored.email).toBe(user.email);
    expect(restored.username).toBe(user.username);
    expect(restored.points).toBe(user.points);
    expect(restored.level).toBe(user.level);
  });

  it('handles missing optional primaryBikeId gracefully', () => {
    const user = mockUser({ primaryBikeId: undefined });
    expect(user.primaryBikeId).toBeUndefined();
    expect(user.toObject().primaryBikeId).toBeUndefined();
  });

  it('defaults to safe values when fields are missing', () => {
    const user = User.from({} as any);
    expect(user.id).toBe('');
    expect(user.email).toBe('');
    expect(user.points).toBe(0);
    expect(user.role).toBe('rider');
    expect(user.language).toBe('en');
  });
});

describe('calculateLevel()', () => {
  it('returns level 1 for 0 points', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('returns level 2 for 100 points', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('returns level 3 for 300 points', () => {
    expect(calculateLevel(300)).toBe(3);
  });

  it('returns level 5 for 1000 points', () => {
    expect(calculateLevel(1000)).toBe(5);
  });

  it('returns level 10 for 5500+ points', () => {
    expect(calculateLevel(5500)).toBe(10);
    expect(calculateLevel(99999)).toBe(10);
  });
});

describe('mockUser()', () => {
  it('returns a User instance', () => {
    expect(mockUser()).toBeInstanceOf(User);
  });

  it('accepts partial overrides', () => {
    const user = mockUser({ username: 'custom_rider', points: 999 });
    expect(user.username).toBe('custom_rider');
    expect(user.points).toBe(999);
  });
});

describe('mockUsers()', () => {
  it('returns an array of User instances', () => {
    const users = mockUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    users.forEach((u) => expect(u).toBeInstanceOf(User));
  });

  it('includes both rider and admin roles', () => {
    const users = mockUsers();
    const roles = users.map((u) => u.role);
    expect(roles).toContain('rider');
    expect(roles).toContain('admin');
  });
});
