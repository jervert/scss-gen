const log = require('fancy-log');
const { MESSAGE_CLEANED_DIST } = require('./constants');

module.exports = function(params) {
  return function() {
    log.info(MESSAGE_CLEANED_DIST);
    params.nextTask();
  }
}
