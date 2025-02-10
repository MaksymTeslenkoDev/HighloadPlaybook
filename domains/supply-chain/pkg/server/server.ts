import { join, dirname } from 'node:path';
import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';

import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import ws from '@fastify/websocket';
import { fileURLToPath } from 'node:url';
import ApiSchemas from './plugins/api-schemas-loader';
import LoadApi from './plugins/load-api';

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: 'all',
    },
  },
});

fastify.register(ApiSchemas, { path: join(__dirname, 'api/schemas') });

fastify.register(LoadApi, {path: join(__dirname, 'api') })

// const fastify = Fastify({
//   logger: true,
//   ajv: {
//     customOptions: {
//       removeAdditional: 'all',
//     },
//   }
// });

// void fastify.register(ws);
// void fastify.register(Swagger, {
//   swagger: {
//     info: {
//       title: 'Supply Chain Management System',
//       description:
//         'The Supply Chain Management System models a real-world supply chain, tracking suppliers, warehouses, inventory, customer orders, and manufacturing processes.',
//       version: '1.0.0',
//     },
//     consumes: ['application/json'],
//     produces: ['application/json'],
//     tags: [
//       {
//         name: 'Hello World',
//         description: 'You can use these routes to salute whomever you want.',
//       },
//     ],
//   },
// });
// void fastify.register(SwaggerUI, {
//   routePrefix: '/documentation',
// });

// // fastify.register(AutoLoad, {
// //   dir: join(__dirname, 'plugins'),
// //   ignorePattern: /.*.no-load\.js/,
// //   indexPattern: /^no$/i,
// //   options: fastify.config,
// // });
// // fastify.register(AutoLoad, {
// //   dir: join(__dirname, 'routes'),
// //   indexPattern: /.*routes(\.js|\.cjs)$/i,
// //   ignorePattern: /.*\.js/,
// //   autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
// //   autoHooks: true,
// //   cascadeHooks: true,
// //   options: Object.assign({}, opts),
// // });

// // void fastify.register(AutoLoad, {
// //   dir: join(__dirname, 'routes'),
// // });

fastify
  .listen({ host: '0.0.0.0', port: 3000 })
  .then(() => {
    console.log(fastify.getSchemas());
    console.log("api.product ", fastify.hasDecorator('api.product'))
    fastify[`api.product`].get().then(v=>console.log("res ", v))
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
