import fp from 'fastify-plugin';
import { Type } from '@sinclair/typebox';

enum APP_ERROR_CODES {
  SystemError = '000',
  ClientError = '001',
  ValidationError = '002',
  NotFound = '003',
}

class ServerError extends Error {
  constructor(
    public message: string,
    public code: APP_ERROR_CODES = APP_ERROR_CODES.ClientError,
    public systemCode: number = 400,
  ) {
    super();
    this.code;
  }
}

type ApiResponse = {
  success: boolean;
  req_id: string;
  message?: string;
  code?: APP_ERROR_CODES;
  reason?: string[];
};

export const ApiResponse = Type.Object({
  success: Type.Boolean(),
  req_id: Type.String(),
  message: Type.Optional(Type.String()),
  code: Type.Optional(Type.Enum(APP_ERROR_CODES)),
  reason: Type.Optional(Type.Array(Type.String())),
});

export default fp(
  async function http(fastify, { routes }: { routes: Record<string, any> }) {
    fastify.setErrorHandler((err, req, reply) => {
      if (reply.statusCode >= 500) {
        req.log.error({ req, res: reply, err }, err?.message);
        const error = new Error(
          `Fatal error. Contact the support team with the id ${req.id}`,
        );
        reply.send(error);
        return;
      }
      const { code, message, statusCode, validation } = err;

      let errorPayload: ApiResponse = {
        message: message,
        code: code as APP_ERROR_CODES,
        success: false,
        req_id: req.id,
      };
      if (validation) {
        errorPayload.reason =
          validation.map((err) => `${err.keyword}: ${err.message}`) || [];
        errorPayload.code = APP_ERROR_CODES.ValidationError;
      }

      req.log.info({ err }, err?.message);
      reply.status(statusCode || 500).send(errorPayload);
    });

    for (const [iface, methods] of Object.entries(routes)) {
      for (const [method, handler] of Object.entries(methods)) {
        if (typeof handler !== 'function') {
          continue;
        }

        fastify.route({
          method: 'POST',
          url: `/api/${iface}/${method}`,
          schema: {
            body: fastify.types[`api:${iface}:${method}:params`] || false,
            response: {
              200: Type.Object({
                ...ApiResponse.properties,
                data: fastify.types[`api:${iface}:${method}:returns`] || false,
              }),
            },
          },
          handler: async function (request) {
            const { body } = request;
            const handler = routes[iface][method];
            if (!handler) {
              throw new ServerError(
                'Method not found',
                APP_ERROR_CODES.NotFound,
                404,
              );
            }
            return await handler(body);
          },
        });
      }
    }
  },
  {
    name: 'http',
    dependencies: ['api-schemas'],
  },
);
