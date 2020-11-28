const { join } = require('path');
const {
  TITLE_ERROR,
  TITLE_SUCCESS,
  MESSAGE_FIRST_BUILD
} = require('./constants');

module.exports = function (params = {}) {
  return {
    title: params.isError ? TITLE_ERROR : TITLE_SUCCESS,
    message: params.path
      ? `${params.event} ${params.path}`
      : MESSAGE_FIRST_BUILD,
    icon: join(
      __dirname,
      `icons/icons8-${params.isError ? 'cancel': 'checked'}-512.png`
    )
  };
};
