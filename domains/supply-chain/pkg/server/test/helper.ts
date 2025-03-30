import * as path from 'node:path';
import * as test from 'node:test';
import { configLoader } from '../src/config';
import serverConfig from '../server.config';
import helper from 'fastify-cli/helper';

export type TestContext = {
  after: typeof test.after;
};

const AppPath = path.join(__dirname, '..', 'app.ts');
function config() {
  const server = serverConfig(configLoader({ appPath: __dirname }));
  return server;
}

async function build(t: TestContext) {
  const argv = [AppPath];
  const app = await helper.build(argv, config());
  t.after(() => void app.close());

  return app;
}

export { config, build };
