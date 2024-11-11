import { pgTable, text } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';

export const roleTbl = pgTable('roles', {
  ...sharedCols,
  roleName: text('roleName').notNull().unique(),
});
