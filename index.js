const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const del = require('del');
const notifier = require('node-notifier');
const { writeFile, mkdir } = require('fs');
const { scss } = require('./config.json');
const sassNotifyResult = require('./node/sass.notify-result');
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

function createDist() {
  mkdir('./dist/css', { recursive: true }, error => {
    if (error) {
      log.error(error);
    } else {
      log.info(MESSAGE_CLEANED_DIST);
      initSass();
    }
  });
}

del('./dist/**/*', {
  force: true
}).then(createDist);
