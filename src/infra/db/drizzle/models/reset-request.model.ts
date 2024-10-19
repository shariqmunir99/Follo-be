import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';

import { userTbl } from './user.model';

export const resetReqTbl = pgTable('reset_requests', {
  ...sharedCols,
  userId: uuid('user_id')
    .notNull()
    .references(() => userTbl.id),
  expiryDate: timestamp('expiryDate', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  active: boolean('active').notNull(),
});
