const log = require('fancy-log');
const { MESSAGE_CREATED_DIR } = require('./constants');

module.exports = function(params) {
  return function(error) {
    if (error) {
      log.error(error);
    } else {
      log.info(`${MESSAGE_CREATED_DIR}: ${params.distScss}`);
      params.nextTask();
    }
  }
}
