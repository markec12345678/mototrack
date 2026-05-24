import { User } from './user.js';
import type { PlainUser, UserLanguage, UserRole } from './user.js';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function mockUser(overrides: Partial<PlainUser> = {}): User {
  return User.from({
    id: generateId(),
    email: 'rider@mototrack.app',
    username: 'speedrider',
    displayName: 'Speed Rider',
    country: 'SI',
    language: 'sl' as UserLanguage,
    points: 350,
    role: 'rider' as UserRole,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    primaryBikeId: 'bike-001',
    ...overrides,
  });
}

export function mockUsers(): User[] {
  return [
    mockUser({
      id: 'user-001',
      email: 'luka.novak@mototrack.app',
      username: 'luka_novak',
      displayName: 'Luka Novak',
      country: 'SI',
      language: 'sl',
      points: 1200,
      role: 'rider',
      primaryBikeId: 'bike-101',
    }),
    mockUser({
      id: 'user-002',
      email: 'ivan.horvat@mototrack.app',
      username: 'ivan_h',
      displayName: 'Ivan Horvat',
      country: 'HR',
      language: 'hr',
      points: 580,
      role: 'rider',
      primaryBikeId: 'bike-202',
    }),
    mockUser({
      id: 'user-003',
      email: 'admin@mototrack.app',
      username: 'mototrack_admin',
      displayName: 'MotoTrack Admin',
      country: 'SI',
      language: 'en',
      points: 9999,
      role: 'admin',
    }),
    mockUser({
      id: 'user-004',
      email: 'max.bauer@mototrack.app',
      username: 'max_bauer',
      displayName: 'Max Bauer',
      country: 'DE',
      language: 'en',
      points: 75,
      role: 'rider',
    }),
  ];
}
