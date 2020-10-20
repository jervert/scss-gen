const { buildCss } = require('../node/task.sass').test;

test('build css, first build', () => {
  return buildCss({
    isFirst: true
  }).then(data => {
    expect(data).toEqual(expect.objectContaining({
      isFirst: true,
      result: expect.any(Object)
    }));
  });
});

test('build css, not first build', () => {
  return buildCss({
    isFirst: false
  }).then(data => {
    expect(data).toEqual(expect.objectContaining({
      isFirst: false,
      result: expect.any(Object)
    }));
  });
});
