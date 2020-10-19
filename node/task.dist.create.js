const { mkdir } = require('fs');
const { join } = require('path');
const log = require('fancy-log');
const { initSass } = require('./task.sass');
const { MESSAGE_CREATED_DIR } = require('./constants');

function cbCreateDist(params) {
  return function(error) {
    if (error) {
      log.error(error);
    } else {
      log.info(`${MESSAGE_CREATED_DIR}: ${params.distScss}`);
      params.nextTask();
    }
  }
}

function createDist(dest, cb) {
  mkdir(dest, { recursive: true }, cb);
}

module.exports = function() {
  const distScss = join(__dirname, './dist/css');
  createDist(distScss, cbCreateDist({
    distScss,
    nextTask: initSass
  }))
}
