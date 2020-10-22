const sass = require('node-sass');
const chokidar = require('chokidar');
const CleanCSS = require('clean-css')
const log = require('fancy-log');
const notifier = require('node-notifier');
const { writeFile } = require('fs');
const { scss } = require('../config');
const sassNotifyResult = require('./task.sass.notify-result');
const { TITLE_ERROR } = require('./constants');

function writeSassResolve(params) {
  notifier.notify(sassNotifyResult(
    Object.assign(
      {}, params, { isError: false }
    )
  ));
  if (params.isFirst) {
    watch();
  }
}

function setResult(values) {
  return new Promise(function(resolve, reject) {
    let params = {};
    values.forEach(value => {
      params = Object.assign({}, params, value);
    });
    resolve(params);
  });
}

function writeSass(params) {
  const optimizedCss = new CleanCSS({
    sourceMap: true
  }).minify(params.result.css);
  const writeDefault = new Promise(function(resolve, reject) {
    writeFile(scss.dest, params.result.css, error => {
      if (error) {
        reject(error, params);
      } else {
        log.info(`Generated: ${scss.dest}`);
        resolve({ written: scss.dest });
      }
    });
  });
  const writeMin = new Promise(function(resolve, reject) {
    writeFile(scss.destMin, optimizedCss.styles, error => {
      if (error) {
        reject(error, params);
      } else {
        log.info(`Generated: ${scss.destMin}`);
        resolve({ writtenMin: scss.destMin });
      }
    });
  });
  const writeMap = new Promise(function(resolve, reject) {
    writeFile(scss.destMap, optimizedCss.styles, error => {
      if (error) {
        reject(error, params);
      } else {
        log.info(`Generated: ${scss.destMap}`);
        resolve({ writtenMap: scss.destMap });
      }
    });
  });

  return Promise.all([params, writeDefault, writeMin, writeMap]);
}

function buildCss(params = {}) {
  return new Promise(function(resolve, reject) {
    sass.render({
      file: scss.src
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
    .then(setResult)
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
    buildCss,
    writeSass,
    setResult
  }
};
