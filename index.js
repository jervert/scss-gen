const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const notifier = require('node-notifier');
const { join } = require('path');
const { writeFile } = require('fs');
const { scss } = require('./config.json');
const sassNotifyResult = require('./node/sass.notify-result');
const clean = require('./node/task.dist.clean');
const createDist = require('./node/task.dist.create');
const { TITLE_ERROR, MESSAGE_CLEANED_DIST } = require('./node/constants');


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

clean(join(__dirname, 'dist/**/*'), () => {
    log.info(MESSAGE_CLEANED_DIST);
    const distScss = join(__dirname, 'dist/css');
    createDist(distScss, error => {
      if (error) {
        log.error(error);
      } else {
        log.info(`Created dir: ${distScss}`);
        initSass();
      }
    });
})