const del = require('del');
const log = require('fancy-log');
const createDist = require('./task.dist.create');
const { MESSAGE_CLEANED_DIST, MESSAGE_NOT_CLEANED_DIST } = require('./constants');

function cleanResolved(contents) {
  log.info(MESSAGE_CLEANED_DIST, contents);
  createDist();
}

function cleanRejected() {
  log.error(MESSAGE_NOT_CLEANED_DIST);
}

module.exports = function(dest) {
  del(dest, {
    force: true
  })
    .then(cleanResolved)
    .catch(cleanRejected);
}
