import t from 'tap';
import { build } from './helper';

t.test('the application should start ', async (t) => {
  const app = await build(t);
  await app.ready();
  t.pass('application is ready');
});
t.test('ping route is alive ', async (t) => {
  const app = await build(t);
  await app.ready();
  const res = await app.inject({ method: 'GET', url: '/ping' });
  t.equal(res.payload, 'OK');
});
t.test('the application should not start ', async (t) => {
  try {
    //@ts-ignore
    await build(t, { environment: 'TEST123' });
    t.fail('the server must not start');
  } catch (e) {
    t.ok(e, 'error must be set');
    t.match(e.message, 'Config file schema invalid');
  }
});
