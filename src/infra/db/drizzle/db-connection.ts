import 'dotenv/config';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { Inject, Provider, Scope } from '@nestjs/common';
import dbSchema from './models';

export const DRIZZLE_DB = Symbol.for('DRIZZLE');
export type DrizzleDB = NodePgDatabase<typeof dbSchema>;

export const drizzleConnFactory = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 25,
  });

  const db = drizzle(pool, {
    schema: dbSchema,
  });

  return db;
};

export const drizzleDbProvider: Provider<DrizzleDB> = {
  provide: DRIZZLE_DB,
  scope: Scope.DEFAULT,
  useFactory: drizzleConnFactory,
};

export const InjectDb = () => Inject(DRIZZLE_DB);
