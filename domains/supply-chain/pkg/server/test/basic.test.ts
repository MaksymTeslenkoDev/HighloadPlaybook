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
t.todo('the application should not start ', async (t) => {});
