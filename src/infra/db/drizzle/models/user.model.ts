import { pgTable, text, boolean, uuid } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';
import { roleTbl } from './role.model';

export const userTbl = pgTable('users', {
  ...sharedCols,
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  pwHashed: text('pwHashed').notNull(),
  isVerified: boolean('isVerified').default(false).notNull(),
  roleID: uuid('roleID')
    .notNull()
    .references(() => roleTbl.id),
});
