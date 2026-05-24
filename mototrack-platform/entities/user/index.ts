export { User, calculateLevel } from './user.js';
export type { PlainUser, UserRole, UserLanguage } from './user.js';

// UserModel and UserMongooseModel are server-only (typegoose / mongoose).
// They are deliberately NOT re-exported from the entity barrel so that browser
// bundles consuming this package never pull in the mongoose runtime.
// Server code that needs them should import directly from the source:
//   import { UserModel, UserMongooseModel } from '@markec/mototrack-platform.entities.user/user.model';

export { mockUser, mockUsers } from './user.mock.js';
