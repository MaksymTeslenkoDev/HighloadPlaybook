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
  return validateConfig(config);
}

export function validateConfig(config: AppConfig) {
  const validator = TypeCompiler.Compile(ConfigSchema);
  if (!validator.Check(config)) {
    throw new Error('Config file schema invalid', {
      cause: [...validator.Errors(config)].map(({ path, message, value }) => ({
        path,
        message,
        value,
      })),
    });
  }

  return config;
}

const dBConfigSchema = Type.Object({
  connection: Type.Object({
    host: Type.String(),
    database: Type.String(),
    user: Type.String(),
    password: Type.String(),
    port: Type.Optional(Type.Number()),
  }),
});

export const ConfigSchema = Type.Object({
  environment: Type.Enum({
    development: 'DEVELOPMENT',
    production: 'PRODUCTION',
    test: 'TEST',
  }),
  logger: Type.Object({
    dir: Type.Optional(Type.String()),
    logLevel: Type.Enum({
      info: 'info',
      debug: 'debug',
      error: 'error',
    }),
    pretty: Type.Optional(Type.Boolean()),
  }),
  db: dBConfigSchema,
});

export type DbConfig = Static<typeof dBConfigSchema>;
export type AppConfig = Static<typeof ConfigSchema>;
