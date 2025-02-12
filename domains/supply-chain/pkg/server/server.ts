import { join, dirname } from 'node:path';
import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';

import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import ws from '@fastify/websocket';
import { fileURLToPath } from 'node:url';
import ApiSchemas from './plugins/api-schemas-loader';
import { flatObject, loadDir } from './src/load.js';

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

  const api = await loadDir(join(__dirname, 'api'), sandbox);
  fastify.register(ApiSchemas, { apiPath: join(__dirname, 'schemas') });
  Object.assign(sandbox, { api });
  fastify.decorate('api', api);

  fastify
    .listen({ host: '0.0.0.0', port: 3000 })
    .then(() => {
      console.log(fastify.getSchemas());
      console.log('api.product ', fastify.hasDecorator('api'));
      console.log(
        fastify[`api`].product.get().then((v) => console.log('res ', v)),
      );
    })
    .catch((err) => {
      fastify.log.error(err);
      process.exit(1);
    });
})();