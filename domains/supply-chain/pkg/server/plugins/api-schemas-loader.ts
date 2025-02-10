import { TypeCompiler } from '@sinclair/typebox/compiler';
import fp from 'fastify-plugin';
import { loadDir } from '../src/load';

export default fp(async function apiSchemaLoader(
  fastify,
  opts: { path: string },
) {
  const schemas = await loadDir(opts.path);
  for (const serviceKey in schemas) {
    const service = schemas[serviceKey];
    for (const [methodName, schema] of Object.entries<{ params; returns }>(
      service,
    )) {
      fastify.addSchema({
        $id: `schema:${serviceKey}:${methodName}:request`,
        ...TypeCompiler.Compile(schema.params).Schema,
      });

      fastify.addSchema({
        $id: `schema:${serviceKey}:${methodName}:response`,
        ...TypeCompiler.Compile(schema.returns).Schema,
      });
    }
  }
});
