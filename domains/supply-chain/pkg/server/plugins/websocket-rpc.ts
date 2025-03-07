import fp from 'fastify-plugin';
import websocket from '@fastify/websocket';

export default fp(async function ws(
  fastify,
  { routes }: { routes: Record<string, any> },
) {
  await fastify.register(websocket);
  await fastify.register(async (server) => {
    server.get('/api', { websocket: true }, (socket, req) => {
      socket.on('message', async (message: string) => {
        try {
          const { name, method, params, id } = JSON.parse(
            message.toString(),
          ) as common.RPCMessage;
          const handler = routes[name][method];

          if (!handler) {
            return socket.send(
              JSON.stringify({ jsonrpc: '2.0', error: 'Method not found', id }),
            );
          }

          const paramsValidation =
            fastify.typeValidators[`api:${name}:${method}:params`];
          if (paramsValidation) {
            if (!paramsValidation.Check(params)) {
              return socket.send(
                JSON.stringify({
                  jsonrpc: '2.0',
                  error: 'Invalid parameters',
                  id,
                  details: [...paramsValidation.Errors(params)].map(
                    (err) => err.message,
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
});
