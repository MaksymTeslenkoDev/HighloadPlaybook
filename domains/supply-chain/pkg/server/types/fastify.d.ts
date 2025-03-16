import { FastifyInstance } from 'fastify';
import { Static } from '@sinclair/typebox';
import { TypeCheck } from '@sinclair/typebox/compiler';
import { ConfigType } from '../src/config';

export declare module 'fastify' {
  interface FastifyInstance {
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
