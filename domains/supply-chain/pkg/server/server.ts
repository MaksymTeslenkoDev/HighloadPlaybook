import { join } from 'node:path';
import Fastify from 'fastify';
import ApiSchemas from './plugins/api-schemas-loader';
import WS from './plugins/websocket-rpc';
import { loadDir } from './src/load';
import { configLoader } from './src/config';
import crypto from 'node:crypto';

(async () => {
  const config = configLoader({ appPath: process.cwd() });
  const fastify = Fastify({
    disableRequestLogging: true,
    requestIdLogLabel: 'reqId', // default
    requestIdHeader: 'x-request-id',
    genReqId: function (req) {
      return (
        (req.headers['x-server-request-id'] as string) || crypto.randomUUID()
      );
    },
    logger: {
      level: config.logLevel || 'info',
      timestamp: () => {
        const dateString = new Date(Date.now()).toISOString();
        return `,"@timestamp":"${dateString}"`;
      },
      redact: {
        censor: '***',
        paths: [
          'req.headers.authorization',
          'req.body.password',
          'req.body.email',
        ],
      },
      serializers: {
        //@ts-ignore
        req: function (request) {
          const shouldLogBody = request.routeOptions.config.logBody === true;
          return {
            method: request.method,
            url: request.raw.url,
            routeUrl: request.routeOptions.url,
            version: request.headers?.['accept-version'],
            user: request.user?.id,
            headers: request.headers,
            body: shouldLogBody ? request.body : undefined,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket?.remotePort,
          };
        },
        res: function (reply) {
          return {
            statusCode: reply.statusCode,
            responseTime: reply.elapsedTime,
          };
        },
      },
    },
    ajv: {
      customOptions: {
        removeAdditional: 'all',
      },
    },
  });

  fastify.decorate('config', config);

  const sandbox = {
    db: () => 'db connection',
  };

  const api = await loadDir(join(process.cwd(), 'api'), sandbox);

  Object.assign(sandbox, { api });
  fastify.decorate('api', api);

  fastify.register(ApiSchemas, { apiPath: join(process.cwd(), 'schemas') });
  fastify.register(WS, { routes: api });

  fastify.log.info(`PORT ${process.env.PORT}`);

  fastify.get('/hello', {}, (req) => {
    const name = process.env.POD_NAME;
    const ip = process.env.POD_IP;
    const uid = process.env.POD_UID;
    const namespace = process.env.POD_NAMESPACE;
    const data = { name, ip, uid, namespace, req_ip: req.ip, req_id: req.id };
    fastify.log.info(data);
    return data;
  });

  fastify.addHook('onRequest', async function onRequestLogHook(req) {
    req.log.info({ req }, 'incoming request 🔮');
  });

  fastify.addHook('onSend', async function onSendRequestLogHook(req, res) {
    req.log.info({ req, res }, 'request completed 🎉');
  });

  fastify
    .listen({
      host: '0.0.0.0',
      port: process.env.PORT ? Number(process.env.PORT) : 8081,
    })
    .catch((err) => {
      fastify.log.error(err.message);
      process.exit(1);
    });
})();
