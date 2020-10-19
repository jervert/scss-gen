const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const notifier = require('node-notifier');
const { join } = require('path');
const { writeFile } = require('fs');
const { scss } = require('./config.json');
const sassNotifyResult = require('./node/sass.notify-result');
const clean = require('./node/task.dist.clean');
const cbClean = require('./node/task.dist.clean.cb');
const createDist = require('./node/task.dist.create');
const cbCreateDist = require('./node/task.dist.create.cb');
const { TITLE_ERROR } = require('./node/constants');


function afterSassRender(result, params) {
  writeFile(scss.dest, result.css, error => {
    if (error) {
      log.error(error);
      notifier.notify(sassNotifyResult(
        Object.assign({}, params, { isError: true })
      ));
    } else {
      log.info(`Generated: ${scss.dest}`);
      notifier.notify(sassNotifyResult(
        Object.assign(
          {}, params, { isError: false }
        )
      ));
    }
  }); 
}

function buildCss(params = {}) {
  sass.render({
    file: scss.src,
  }, function(error, result) {
    if (error) {
      log.error(TITLE_ERROR);
      console.log(error.status);
      console.log(error.column);
      console.log(error.message);
      console.log(error.line);
      notifier.notify(sassNotifyResult(
        Object.assign({}, params, { isError: true })
      ));
    } else {
      afterSassRender(result, params);
    }
  });
}

function watcher(event, path) {
  log.info(`${event}: ${path}`);
  buildCss({
    path,
    event
  });
}

function initSass() {
  buildCss();
  chokidar.watch(scss.watch, {
    ignoreInitial: true
  }).on('all', watcher);
}

const distScss = join(__dirname, './dist/css');

clean(join(__dirname, 'dist/**/*'), cbClean({
  nextTask: createDist(distScss, cbCreateDist({
    distScss,
    nextTask: initSass
  }))
}));
