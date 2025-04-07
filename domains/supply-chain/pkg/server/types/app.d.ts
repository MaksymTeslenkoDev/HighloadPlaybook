import fastify from 'fastify';
import common from '../lib/common';
import { AppConfig } from '../../server/src/config';
import { Kysely } from 'kysely';
import { DB } from '../../../schemas/db/db';
// / <reference path="../lib/db.d.ts" />

declare global {
  namespace app {
    type Sandbox = {
      api: Record<string, any>;
      common: typeof common;
      db: Kysely<DB>;
      config: AppConfig;
      schemas: {
        api: Record<string, any>;
      };
    };

    type WsRPCMessage = {
      name: string;
      method: string;
      params: any;
    };
  }
}
