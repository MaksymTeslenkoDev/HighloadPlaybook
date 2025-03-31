import t from 'tap';
t.test('a test description ', (t) => {
  t.plan(3);
  const myVar = 42;
  const sameStruct = { hello: 'world' };
  t.strictSame(sameStruct, { hello: 'world' }, 'the object is correct');
  t.match({ ...sameStruct, foo: 'bar' }, { hello: 'world' }, 'almost the same');
  t.equal(myVar, 42, 'number 42');
});
