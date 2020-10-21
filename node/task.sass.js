const sass = require('node-sass');
const chokidar = require('chokidar');
const log = require('fancy-log');
const notifier = require('node-notifier');
const { writeFile } = require('fs');
const { scss } = require('../config');
const sassNotifyResult = require('./task.sass.notify-result');
const { TITLE_ERROR } = require('./constants');

function writeSassResolve(params) {
  log.info(`Generated: ${scss.dest}`);
  notifier.notify(sassNotifyResult(
    Object.assign(
      {}, params, { isError: false }
    )
  ));
  if (params.isFirst) {
    watch();
  }
}

function writeSass(params) {
  return new Promise(function(resolve, reject) {
    writeFile(scss.dest, params.result.css, error => {
      if (error) {
        reject(error, params);
      } else {
        resolve(params);
      }
    });
  }); 
}

function buildCss(params = {}) {
  return new Promise(function(resolve, reject) {
    sass.render({
      file: scss.src,
    }, function(error, result) {
      if (error) {
        reject(error, params);
      } else {
        resolve(Object.assign({}, params, { result }));
      }
    });
  });
}

function sassRejected(error, params) {
  log.error(TITLE_ERROR);
  log.error(error);
  notifier.notify(sassNotifyResult(
    Object.assign({}, params, { isError: true })
  ));
}

function taskSass(params = {}) {
  buildCss(params)
    .then(writeSass)
    .then(writeSassResolve)
    .catch(sassRejected);
}

function watcher(event, path) {
  log.info(`${event}: ${path}`);
  taskSass({
    isFirst: false,
    event,
    path
  });
}

function watch() {
  chokidar.watch(scss.watch, {
    ignoreInitial: true
  }).on('all', watcher);
}

module.exports = {
  taskSass,
  test: {
    buildCss
  }
};
