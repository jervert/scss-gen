const { scss, target } = require('../config');
const clean = require('../node/task.dist.clean');
const distCreate = require('../node/task.dist.create');
const { buildCss, writeSass, setResult } = require('../node/task.sass').test;

const CONFIG_IS_FIRST = {
  isFirst: true
};
const CONFIG_IS_NOT_FIRST = {
  isFirst: false
};

beforeAll(() => {
  return distCreate();
});

afterAll(() => {
  return clean(target.clean);
});

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
  const data = await buildCss(CONFIG_IS_FIRST)
    .then(writeSass)
    .then(setResult);
  expect(data).toEqual(expect.objectContaining({
    isFirst: true,
    result: expect.any(Object),
    written: scss.dest,
    writtenMin: scss.destMin,
    writtenMap: scss.destMap
  }));
});

test('write css, not first build', async () => {
  const data = await buildCss(CONFIG_IS_NOT_FIRST)
    .then(writeSass)
    .then(setResult);
  expect(data).toEqual(expect.objectContaining({
    isFirst: false,
    result: expect.any(Object),
    written: scss.dest,
    writtenMin: scss.destMin,
    writtenMap: scss.destMap
  }));
});
