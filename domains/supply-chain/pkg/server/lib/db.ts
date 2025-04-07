import * as mysql from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';
import { DB } from '../../../schemas/db/db';
import { DbConfig } from '../src/config';

const crud = (pool: mysql.Pool) => {
  const db = new Kysely<DB>({
    dialect: new MysqlDialect({ pool }),
  });
  return db;
};

export default (options: DbConfig) =>
  crud(mysql.createPool({ ...options.connection }));
