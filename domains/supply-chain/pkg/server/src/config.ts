import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Type, Static } from '@sinclair/typebox';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function configLoader(path: { appPath: string }): AppConfig {
  const configPath = join(
    path.appPath,
    process.env.CONFIG_PATH || 'app.config.json',
  );
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found at: ${configPath}`);
  }
  const config = JSON.parse(readFileSync(configPath).toString());
  const validator = TypeCompiler.Compile(ConfigSchema);
  if (!validator.Check(config))
    throw new Error(
      `Config file schema invalid, ${[...validator.Errors(validator)].map(
        (err) => err.message,
      )}`,
    );

  return config;
}

export const ConfigSchema = Type.Object({
  environment: Type.Enum({
    development: 'DEVELOPMENT',
    production: 'PRODUCTION',
    test: 'TEST',
  }),
  logger: Type.Object({
    dir: Type.String(),
    logLevel: Type.Enum({
      info: 'info',
      debug: 'debug',
      error: 'error',
    }),
    pretty: Type.Optional(Type.Boolean()),
  }),
  db: Type.Object({}),
});

export type AppConfig = Static<typeof ConfigSchema>;
