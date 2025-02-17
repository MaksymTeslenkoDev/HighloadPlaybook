import { join } from 'node:path';
import Fastify from 'fastify';
import ApiSchemas from './plugins/api-schemas-loader';
import Config from './plugins/config';
import WS from './plugins/websocket-rpc';
import { loadDir } from './src/load.js';

(async () => {
  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
      },
    },
  });

  const sandbox = {
    db: () => 'db connection',
  };

  fastify.register(Config,{path:"./server.config.json"});

  const api = await loadDir(join(__dirname, 'api'), sandbox);
  
  Object.assign(sandbox, { api });
  fastify.decorate('api', api);

  fastify.register(ApiSchemas, { apiPath: join(__dirname, 'schemas') });
  fastify.register(WS, { routes: api });

  fastify.listen({ host: '0.0.0.0', port: 3000 }).catch((err) => {
    fastify.log.error(err.message);
    process.exit(1);
  });
})();
