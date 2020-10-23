const del = require('del');
const distCreate = require('../node/task.dist.create');
const {
  MESSAGE_CREATED_DIR,
  MESSAGE_DIR_EXISTS
} = require('../node/constants');
const { target } = require('../config');

test('create dist, folder not exist', async () => {
  const data = await del(target.clean, {
    force: true
  })
    .then(distCreate);
  expect(data).toEqual(expect.objectContaining({
    create: `${MESSAGE_CREATED_DIR}: ${target.css}`
  }));
});

test('create dist, folder exist', async () => {
  const data = await distCreate();
  expect(data).toEqual(expect.objectContaining({
    create: `${MESSAGE_DIR_EXISTS}: ${target.css}`
  }));
});
