import fp from 'fastify-plugin';
import { loadDir } from '../src/load';

export default fp(async function loadApi(fastify, opts: { path: string }) {
  const api = await loadDir(opts.path);
  console.log('api ', api);
  for (const serviceKey in api) {
    const service = api[serviceKey];
    console.log('service ', service());
    fastify.decorate(
      `api.${serviceKey}`,
      service({ db: () => 'db connection' }),
    );
  }
});
