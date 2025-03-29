import { FastifyInstance } from 'fastify';
import { TObject } from '@sinclair/typebox';
import { TypeCheck } from '@sinclair/typebox/compiler';

export declare module 'fastify' {
  interface FastifyInstance {
    types: Record<string, TObject>;
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
