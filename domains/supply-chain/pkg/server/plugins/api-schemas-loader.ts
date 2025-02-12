import { TypeCompiler } from '@sinclair/typebox/compiler';
import fp from 'fastify-plugin';
import { flatObject, loadDir } from '../src/load';

export default fp(async function shemaLoader(
  fastify,
  opts: { apiPath: string },
) {
  const schemas: any = await loadDir(opts.apiPath, {});
  const flattedApiSchemas = flatObject('', schemas, {});

  for (let key in flattedApiSchemas) {
    const schema = TypeCompiler.Compile(flattedApiSchemas[key]).Schema();
    fastify.addSchema({
      $id: key,
      ...schema,
    });
  }
});
