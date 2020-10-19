const { join } = require('path');
const del = require('del');
const log = require('fancy-log');
const createDist = require('./task.dist.create');
const { MESSAGE_CLEANED_DIST } = require('./constants');

function cbClean(params) {
  return function() {
    log.info(MESSAGE_CLEANED_DIST);
    params.nextTask();
  }
}

function makeClean(dest, cb) {
  del(dest, {
    force: true
  }).then(cb);
}

module.exports = function() {
  makeClean(join(__dirname, 'dist/**/*'), cbClean({
    nextTask: createDist
  }));
}
