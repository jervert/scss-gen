const { join } = require('path');
const del = require('del');
const log = require('fancy-log');
const createDist = require('./task.dist.create');
const { MESSAGE_CLEANED_DIST } = require('./constants');

const { initSass } = require('./task.sass');

function cbClean() {
  log.info(MESSAGE_CLEANED_DIST);
  createDist.then(({ message }) => {
    log.info(message);
    initSass();
  }).catch(({ message }) => {
    log.error(message);
  });
}

module.exports = function(nextTask = createDist) {
  const dest = join(__dirname, 'dist/**/*');
  del(dest, {
    force: true
  }).then(function(contents) {
    log.info('Deleted dist contents', contents);
    cbClean();
  }).catch(function() {
    log.error('Cannot delete dist contents');
  });
}
