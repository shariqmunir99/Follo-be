import { pgTable, uuid } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';
import { userTbl } from './user.model';
import { eventTbl } from './event.model';

export const favoritedByTbl = pgTable('favorited-by', {
  ...sharedCols,
  userId: uuid('userId')
    .notNull()
    .references(() => userTbl.id),
  eventId: uuid('eventId')
    .notNull()
    .references(() => eventTbl.id),
});
