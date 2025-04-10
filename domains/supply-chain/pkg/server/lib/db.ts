import * as mysql from 'mysql2';
import * as path from 'node:path';
import { Kysely, MysqlDialect } from 'kysely';
import { DB } from '../../../schemas/db/db';
import { DbConfig } from '../src/config';
import { migrate } from '../../../utils/migrate';

const crud = (db: Kysely<DB>) => async (sandbox: app.Sandbox) => {
  await migrate({
    db,
    log: sandbox.logger,
    migrationsPath: path.join(sandbox.appPath, '../../db/migrations'),
  });
  return db;
};

export default (options: DbConfig) => {
  const pool = mysql.createPool({
    ...options.connection,
    multipleStatements: true,
  });
  const db = new Kysely<DB>({
    dialect: new MysqlDialect({ pool }),
  });

  return crud(db);
};
