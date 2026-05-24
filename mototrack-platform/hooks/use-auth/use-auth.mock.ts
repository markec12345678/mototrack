import { User } from '@markec/mototrack-platform.entities.user';
import type { UserLanguage, UserRole } from '@markec/mototrack-platform.entities.user';

/**
 * Seeded demo user for the MotoTrack platform.
 * email: markec@mototrack.app
 * username: markec
 * password: motorider2025
 */
export const demoUser: User = User.from({
  id: 'demo-user-markec-001',
  email: 'markec@mototrack.app',
  username: 'markec',
  displayName: 'Markec',
  country: 'SI',
  language: 'sl' as UserLanguage,
  primaryBikeId: undefined,
  points: 5430,
  role: 'rider' as UserRole,
  createdAt: new Date('2024-01-01T00:00:00Z'),
});

/**
 * A guest (unauthenticated) placeholder — null by design.
 */
export const guestUser = null;

export const userMocks = {
  demo: demoUser,
  guest: guestUser,
};
