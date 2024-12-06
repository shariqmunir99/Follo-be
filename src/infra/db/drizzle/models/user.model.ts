import { pgTable, text, boolean, uuid } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';
import { roleTbl } from './role.model';

export const userTbl = pgTable('users', {
  ...sharedCols,
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  pwHashed: text('pwHashed').notNull(),
  isVerified: boolean('isVerified').default(false).notNull(),
  location: text('location').default('Lahore,Pakistan').notNull(),
  profilePicUrl: text('profilePicUrl').default(
    'https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg',
  ),
  roleID: uuid('roleID')
    .notNull()
    .references(() => roleTbl.id),
});
