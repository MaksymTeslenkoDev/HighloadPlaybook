import * as path from 'node:path';
import { AppConfig, configLoader } from '../src/config';
import serverConfig from '../server.config';
import helper from 'fastify-cli/helper';
import t from 'tap';

export type TestContext = {
  after: typeof t.after;
  equal: typeof t.equal;
};

const AppPath = path.join(__dirname, '..', 'app.ts');

async function build(t: TestContext, configApp?: Partial<AppConfig>) {
  const rootTestConfig = configLoader({ appPath: __dirname });
  const appConfig = configApp
    ? { ...rootTestConfig, ...configApp }
    : rootTestConfig;
  const argv = ['-l info', AppPath, '--options'];

  const app = await helper.build(
    argv,
    { config: appConfig },
    serverConfig(appConfig),
  );
  t.after(() => void app.close());
  return app;
}

export { build };
