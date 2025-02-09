import { TypeCompiler } from '@sinclair/typebox/compiler';
import fp from 'fastify-plugin';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default fp(async function schemaLoaderPlugin(fastify, opts: any) {
  console.log('start load');
  const schemas: any = await loadDir(opts.path);
  console.log('schemas ', schemas);

  for (const serviceKey in schemas) {
    const service = schemas[serviceKey];
    for (const [methodName, schema] of Object.entries<{ request; response }>(
      service,
    )) {
      fastify.addSchema({
        $id: `schema:${serviceKey}:${methodName}:request`,
        ...TypeCompiler.Compile(schema.request).Schema,
      });

      fastify.addSchema({
        $id: `schema:${service.id}:${methodName}:response`,
        ...TypeCompiler.Compile(schema.response).Schema,
      });
    }
  }

  // fastify.addSchema(require('./dotenv.json'))
  // fastify.addSchema(require('./limit.json'))
  // fastify.addSchema(require('./skip.json'))

  //   next();
});

const loadDir = async (dir) => {
  const files = await fsp.readdir(dir);
  const container = {};
  for (const fileName of files) {
    if (!fileName.includes('.schema.')) continue;
    const filePath = path.join(dir, fileName);
    const name = path.basename(fileName, '.schema.ts');
    const module = await import(filePath);
    container[name] = module[name];
  }
  return container;
};

//   import { TypeCompiler } from '@sinclair/typebox/compiler';
// import { ProductSchema } from './schemas/product';

// // Compile request and response schemas into JSON Schema
// const compiledRequestSchema = TypeCompiler.Compile(ProductSchema.methods.getProduct.request).Schema;
// const compiledResponseSchema = TypeCompiler.Compile(ProductSchema.methods.getProduct.response).Schema;

// console.log('Compiled Request Schema:', JSON.stringify(compiledRequestSchema, null, 2));
// console.log('Compiled Response Schema:', JSON.stringify(compiledResponseSchema, null, 2));
