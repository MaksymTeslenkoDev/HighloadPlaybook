import { TypeCheck, TypeCompiler } from '@sinclair/typebox/compiler';
import fp from 'fastify-plugin';
import { flatObject, loadDir } from '../src/load';

export default fp(
  async function shemaLoader(fastify, opts: { apiPath: string }) {
    const schemas: any = await loadDir(opts.apiPath, {
      config: fastify.config,
    });
    const flattedApiSchemas = flatObject('', schemas, {});

    const typeValidators: Record<string, TypeCheck<any>> = {};
    for (let key in flattedApiSchemas) {
      const validator = TypeCompiler.Compile(flattedApiSchemas[key]);
      typeValidators[key] = validator;
      fastify.addSchema({
        $id: key,
        ...validator.Schema(),
      });
    }
    fastify.decorate('typeValidators', typeValidators);
  },
  { name: 'api-schemas'},
);
