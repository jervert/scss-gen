const del = require('del');
const log = require('fancy-log');
const {
  MESSAGE_CLEANED_DIST,
  MESSAGE_NOT_CLEANED_DIST
} = require('./constants');

module.exports = function(dest) {
  return function() {
    return new Promise(function (resolve, reject) {
      del(dest, {
        force: true
      })
        .then(function(contents) {
          log.info(MESSAGE_CLEANED_DIST, contents);
          resolve({
            clean: contents
          });
        })
        .catch(function(error) {
          log.error(MESSAGE_NOT_CLEANED_DIST);
          reject(error);
        });
    });
  };
};
