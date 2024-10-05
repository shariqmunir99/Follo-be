import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';

export const userTbl = pgTable('users', {
  ...sharedCols,
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  pwHashed: text('pwHashed').notNull(),
  isVerified: boolean('isVerified').default(false).notNull(),
});
