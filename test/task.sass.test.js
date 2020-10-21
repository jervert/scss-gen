const { buildCss } = require('../node/task.sass').test;

test('build css, first build', async () => {
  const data = await buildCss({
    isFirst: true
  });
  expect(data).toEqual(expect.objectContaining({
    isFirst: true,
    result: expect.any(Object)
  }));
});

test('build css, not first build', async () => {
  const data = await buildCss({
    isFirst: false
  });
  expect(data).toEqual(expect.objectContaining({
    isFirst: false,
    result: expect.any(Object)
  }));
});
