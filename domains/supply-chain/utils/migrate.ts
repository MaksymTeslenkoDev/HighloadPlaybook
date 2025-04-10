import * as fs from 'fs';
import * as path from 'path';
import { sql } from 'kysely';

export async function migrate({ db, log, migrationsPath }) {
  const migrationTable =
    await sql<unknown>`show tables like "migration"`.execute(db);

  if (!migrationTable.rows.length) {
    await createMigrationTable(log, db);
  }

  const migrations = await loadMigrations(migrationsPath);

  const migrationRows = await sql<{
    num: number;
  }>`select num from migration`.execute(db);

  const migrated = migrationRows.rows.reduce((acc, cur) => {
    acc[cur.num] = true;
    return acc;
  }, {});

  for (const item of migrations) {
    if (migrated[item.num]) continue;

    await replay(item, db, log);
  }
}

async function createMigrationTable(log, db) {
  log.info("Migration table doesn't exist, creating");

  await sql`create table migration(num int(6), executedAt datetime)`.execute(
    db,
  );
}

// filename format is <num>.sql
function loadMigrations(migrationsDir): Promise<Migration[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(migrationsDir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const migrations = files.map((file) => {
          let idx = file.indexOf('-');
          if (idx == -1) idx = file.indexOf('.');

          const num = parseInt(file.substring(0, idx));

          return {
            num,
            upFilePath: path.resolve(migrationsDir, file),
          };
        });

        migrations.sort((a, b) => {
          if (a.num == b.num) {
            throw new Error(`Duplicating migration number ${a.num}`);
          }

          return a.num - b.num;
        });

        resolve(migrations);
      } catch (e) {
        reject(e);
      }
    });
  });
}

function replay(m: Migration, db, log) {
  log.info('Executing migration ' + m.num);

  return new Promise((resolve, reject) => {
    fs.readFile(m.upFilePath, 'utf8', (err, migrationSql) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(migrationSql);
    });
  })
    .then((migrationSql) => removeSqlComments(migrationSql))
    .then(async (migrationSql) => {
      await sql(migrationSql).execute(db);
      await sql`insert into migration set ${{ num: m.num, executedAt: new Date() }}`.execute(
        db,
      );
    });
}

async function removeSqlComments(s) {
  //   s = s.replace(/--(.*?)$/gm, '');

  return s;
}

interface Migration {
  num: number;
  upFilePath: string;
}
