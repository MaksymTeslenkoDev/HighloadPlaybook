import websocket from '@fastify/websocket';
import { FastifyInstance } from 'fastify';

export default async function ws(
  fastify: FastifyInstance,
  { routes }: { routes: Record<string, any> },
) {
  await fastify.register(websocket, {
    errorHandler(error, socket, request, reply) {
      console.log('error ', error);
      reply.status(404).send({ error: error.message });
      socket.terminate();
    },
  });

  await fastify.register(async (server) => {
    server.get('/api', { websocket: true }, (socket, req) => {
      socket.on('message', async (message: string) => {
        try {
          const { name, method, params } = JSON.parse(
            message.toString(),
          ) as app.WsRPCMessage;
          const handler = routes[name][method];

          if (!handler) {
            return socket.send(JSON.stringify({ error: 'Method not found' }));
          }

          const paramsValidation =
            fastify.typeValidators[`api:${name}:${method}:body`];
          if (paramsValidation) {
            if (!paramsValidation.Check(params)) {
              return socket.send(
                JSON.stringify({
                  error: 'Invalid parameters',
                  details: [...paramsValidation.Errors(params)].map(
                    (err) => `${err.message} \n`,
                  ),
                }),
              );
            }
          }

          const result = await handler(params);
          socket.send(JSON.stringify(result), { binary: false });
        } catch (err) {
          if (err instanceof Error) {
            fastify.log.error(err.message);
          }
          socket.send('"Server error"', { binary: false });
        }
      });
    });
  });
}
