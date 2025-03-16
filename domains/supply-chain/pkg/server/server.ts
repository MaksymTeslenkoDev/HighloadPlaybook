import { join } from 'node:path';
import Fastify from 'fastify';
import Schemas from './plugins/api-schemas-loader';
import WS from './plugins/ws';
import { loadApplication } from './src/load';
import crypto from 'node:crypto';

(async () => {
  const app = await loadApplication(process.cwd());

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
      level: app.config.logger.logLevel || 'info',
      transport: {
        targets: [
          {
            target: 'pino/file',
            options: {
              destination: join(
                process.cwd(),
                app.config.logger.dir,
                'app.log',
              ),
            },
          },
          {
            target: 'pino/file',
            options: { destination: 1 },
          },
        ],
      },
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
            headers: {
              host: request.headers['host'],
              connection: request.headers['connection'],
              test: request.headers[':path'],
            },
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

  fastify.register(Schemas, { schemas: app.schemas });
  fastify.register(WS, { routes: app.api });

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

  fastify.post('/error', {}, (req) => {
    throw new Error('test error');
  });

  fastify.post('/body/:param', { config: { logBody: true } }, (req) => {
    return 'success';
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
