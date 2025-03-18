import { FastifyInstance } from 'fastify';
import { Static, TObject} from '@sinclair/typebox';
import { TypeCheck } from '@sinclair/typebox/compiler';
import { ConfigType } from '../src/config';

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
