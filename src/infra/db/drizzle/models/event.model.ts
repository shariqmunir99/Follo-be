import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';
import { userTbl } from './user.model';

export const eventTbl = pgTable('events', {
  ...sharedCols,
  name: text('name').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  date: timestamp('date', { mode: 'date' }),
  city: text('city').notNull(),
  country: text('country').notNull(),
  venue: text('venue').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => userTbl.id),
});
