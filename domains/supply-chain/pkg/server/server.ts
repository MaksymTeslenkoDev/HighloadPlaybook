import app from './app';
import fastify from 'fastify';
import serverOptions from './server.config';
import { configLoader } from './src/config';

(async () => {
  const config = configLoader({ appPath: __dirname });
  const application = await fastify(serverOptions(config));

  application.register(app, {
    config,
  });

  application
    .listen({
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 3000,
    })
    .catch((err) => {
      application.log.error('Error during server start ', err);
      process.exit(1);
    });

  process.once('SIGINT', async function closeApplication() {
    const timeout = setTimeout(function forceClose() {
      application.log.error('force closing server');
      process.exit(1);
    }, 2_000);
    timeout.unref();

    try {
      await application.close();
      application.log.info('Server SHOUTDOWN');
    } catch (err) {
      application.log.error(err, 'the app had trouble turning off');
    }
  });
})();
