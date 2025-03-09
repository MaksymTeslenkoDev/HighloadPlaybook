import { FastifyInstance } from 'fastify';
import { Static } from '@sinclair/typebox';
import { TypeCheck } from '@sinclair/typebox/compiler';
import { ConfigType } from '../src/config';

declare module 'fastify' {
  interface FastifyInstance {
    config: ConfigType;
    api: Record<string, any>;
    typeValidators: Record<string, TypeCheck<any>>;
  }

  interface FastifyRequest {
    user?: {
      id: string;
    };
  }
  interface FastifyContextConfig {
    logBody?: boolean;
  }
}
