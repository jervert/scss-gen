const { join } = require('path');
const { TITLE_SUCCESS, TITLE_ERROR, MESSAGE_FIRST_BUILD } = require('../node/constants');
const sassNotifyResult = require('../node/task.sass.notify-result');

const ICON_ERROR = join(
  __dirname,
  '../node/icons/icons8-cancel-512.png'
);
const ICON_SUCCESS = join(
  __dirname,
  '../node/icons/icons8-checked-512.png'
);

test('sass result error, first build', () => {
  const result = sassNotifyResult({
    isError: true
  });

  expect(result.title).toBe(TITLE_ERROR);
  expect(result.message).toBe(MESSAGE_FIRST_BUILD);
  expect(result.icon).toBe(ICON_ERROR);
});

test('sass result success, first build', () => {
  const result = sassNotifyResult({
    isError: false
  });

  expect(result.title).toBe(TITLE_SUCCESS);
  expect(result.message).toBe(MESSAGE_FIRST_BUILD);
  expect(result.icon).toBe(ICON_SUCCESS);
});

test('sass result error, modify event', () => {
  const params = {
    isError: true,
    path: '/main.scss',
    event: 'modify'
  };
  const result = sassNotifyResult(params);

  expect(result.title).toBe(TITLE_ERROR);
  expect(result.message).toBe(`${params.event} ${params.path}`);
  expect(result.icon).toBe(ICON_ERROR);
});

test('sass result error, modify event', () => {
  const params = {
    isError: false,
    path: '/main.scss',
    event: 'modify'
  };
  const result = sassNotifyResult(params);

  expect(result.title).toBe(TITLE_SUCCESS);
  expect(result.message).toBe(`${params.event} ${params.path}`);
  expect(result.icon).toBe(ICON_SUCCESS);
});
