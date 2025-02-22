import fp from 'fastify-plugin';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Type, Static } from '@sinclair/typebox';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export default fp(
  async function configLoader(fastify, path: { appPath: string }) {
    const configPath = join(
      path.appPath,
      process.env.CONFIG_PATH || 'server.config.json',
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
    fastify.decorate('config', config);
  },
  {
    name: 'config-loader',
  },
);

export const ConfigSchema = Type.Object({
  environment: Type.Enum({
    development: 'DEVELOPMENT',
    production: 'PRODUCTION',
  }),
});

export type ConfigType = Static<typeof ConfigSchema>;
