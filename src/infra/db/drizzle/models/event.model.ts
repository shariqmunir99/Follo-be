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
  imageUrl: text('imageUrl').default(
    'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
  ),
  userId: uuid('userId')
    .notNull()
    .references(() => userTbl.id),
});
