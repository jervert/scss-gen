const clean = require('../node/task.dist.clean');
const { target } = require('../config');

test('clean dist', async () => {
  const data = await clean(target.clean);
  expect(data).toEqual(expect.objectContaining({
    clean: expect.any(Array)
  }));
});
