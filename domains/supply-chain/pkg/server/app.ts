import { FastifyPluginAsync } from 'fastify';
import { loadApplication } from './src/load';
import { AppConfig} from './src/config';
import Schemas from './plugins/api-schemas-loader';
import WS from './plugins/ws';
import http from './plugins/http';
import { AppOptions } from './server.config';

const app: FastifyPluginAsync<AppOptions & { config: AppConfig }> = async (
  fastify,
  opts,
): Promise<void> => {
  const app = await loadApplication(__dirname, opts.config);

  fastify.register(Schemas, { schemas: app.schemas });
  fastify.register(http, { routes: app.api });
  fastify.register(WS, { routes: app.api });

  fastify.addHook('onRequest', async function onRequestLogHook(req) {
    req.log.info({ req }, 'incoming request 🔮');
  });

  fastify.addHook('onSend', async function onSendRequestLogHook(req, res) {
    req.log.info({ req, res }, 'request completed 🎉');
  });

  fastify.get('/ping', {}, async () => {
    return 'OK';
  });

  console.log(fastify.printRoutes({ commonPrefix: false, includeHooks: true }));
};

export default app;
