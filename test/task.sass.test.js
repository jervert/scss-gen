const { scss } = require('../config');
const { buildCss, writeSass } = require('../node/task.sass').test;

const CONFIG_IS_FIRST = {
  isFirst: true
};
const CONFIG_IS_NOT_FIRST = {
  isFirst: false
};

test('build css, first build', async () => {
  const data = await buildCss(CONFIG_IS_FIRST);
  expect(data).toEqual(expect.objectContaining({
    isFirst: true,
    result: expect.any(Object)
  }));
});

test('build css, not first build', async () => {
  const data = await buildCss(CONFIG_IS_NOT_FIRST);
  expect(data).toEqual(expect.objectContaining({
    isFirst: false,
    result: expect.any(Object)
  }));
});

test('write css, first build', async () => {
  const data = await buildCss(CONFIG_IS_FIRST).then(writeSass);
  expect(data).toEqual(expect.objectContaining({
    isFirst: true,
    result: expect.any(Object),
    written: scss.dest
  }));
});

test('write css, not first build', async () => {
  const data = await buildCss(CONFIG_IS_NOT_FIRST).then(writeSass);
  expect(data).toEqual(expect.objectContaining({
    isFirst: false,
    result: expect.any(Object),
    written: scss.dest
  }));
});
