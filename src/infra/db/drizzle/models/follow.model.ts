import { pgTable, uuid, unique } from 'drizzle-orm/pg-core';
import sharedCols from './sharedCols';
import { userTbl } from './user.model';

export const followTbl = pgTable(
  'follow',
  {
    ...sharedCols,
    followerId: uuid('followerId')
      .notNull()
      .references(() => userTbl.id),
    followingId: uuid('followingId')
      .notNull()
      .references(() => userTbl.id),
  },
  (t) => ({
    unq: unique().on(t.followerId, t.followingId),
  }),
);
