import * as path from 'node:path';
import { configLoader } from '../src/config';
import serverConfig from '../server.config';
import helper from 'fastify-cli/helper';
import t from 'tap';

export type TestContext = {
  after: typeof t.after;
  equal: typeof t.equal;
};

const AppPath = path.join(__dirname, '..', 'app.ts');
const appConfig = configLoader({ appPath: __dirname });

async function build(t: TestContext) {
  const argv = ['-l info', AppPath, '--options'];
  const app = await helper.build(
    argv,
    { testAppConfig: appConfig },
    serverConfig(appConfig),
  );
  t.after(() => void app.close());
  return app;
}

export { appConfig, build };
