import fp from 'fastify-plugin';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Type, Static } from '@sinclair/typebox';
import { load } from '../src/load';

export default fp(
  async function configLoader(fastify, { path }: { path: string }) {
    const config = (await load(path, {})) as ConfigType;
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
