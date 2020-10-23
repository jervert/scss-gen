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
  return new Promise(function(resolve) {
    let params = {};
    values.forEach(value => {
      params = Object.assign({}, params, value);
    });
    resolve(params);
  });
}

function writeBase(params) {
  return function(source, target, result) {
    return new Promise(function(resolve, reject) {
      writeFile(target, source, error => {
        if (error) {
          reject(error, params);
        } else {
          log.info(`Generated: ${target}`);
          resolve(result);
        }
      });
    });
  }
}

function writeSass(params) {
  const optimizedCss = new CleanCSS({
    sourceMap: true
  }).minify(params.result.css);
 
  return Promise.all([
    params,
    writeBase(params)(
      params.result.css,
      scss.dest,
      { written: scss.dest }),
    writeBase(params)(
      optimizedCss.styles,
      scss.destMin,
      { writtenMin: scss.destMin }
    ),
    writeBase(params)(
      optimizedCss.styles,
      scss.destMap,
      { writtenMap: scss.destMap }
    )
  ]);
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

function taskSass(params = {}) {
  return function(promiseParams) {
    params = Object.assign({}, promiseParams, params);
    return new Promise(function(resolve, reject) {
      buildCss(params)
        .then(writeSass)
        .then(setResult)
        .then(function(params) {
          writeSassResolve(params);
          resolve();
        })
        .catch(function(error, params) {
          log.error(TITLE_ERROR);
          log.error(error);
          notifier.notify(sassNotifyResult(
            Object.assign({}, params, { isError: true })
          ));
          reject(error);
        });
    });
  }
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
