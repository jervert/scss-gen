const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const del = require('del');
const notifier = require('node-notifier');
const { writeFile, mkdir } = require('fs');
const { scss } = require('./config.json');
const sassNotifyResult = require('./node/sass.notify-result');


function afterSassRender(result, params) {
  writeFile(scss.dest, result.css, error => {
    if (error) {
      log(error);
      notifier.notify(sassNotifyResult(
        Object.assign({}, params, { isError: true })
      ));
    } else {
      log(`Generated: ${scss.dest}`);
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
      log(error);
      notifier.notify(sassNotifyResult(
        Object.assign({}, params, { isError: true })
      ));
    } else {
      afterSassRender(result, params);
    }
  });
}

function watcher(event, path) {
  log(`${event}: ${path}`);
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
      log(error);
    } else {
      initSass();
    }
  });
}

del('./dist/**/*', {
  force: true
}).then(createDist);
