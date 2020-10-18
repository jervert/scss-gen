const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const del = require('del');
const { writeFile, mkdir } = require('fs');
const { join } = require('path');
const notifier = require('node-notifier');
const { scss } = require('./config.json');

function sassNotifyResult(params = {}) {
  log(params.message);
  notifier.notify({
    title: `SCSS ${params.isError ? 'Error' : 'Success'}`,
    message: params.path ? `${params.event} ${params.path}` : 'First build',
    icon: join(
      __dirname,
      `icons/icons8-${params.isError ? 'cancel': 'checked'}-512.png`
    )
  });
}

function afterSassRender(result, params) {
  writeFile(scss.dest, result.css, error => {
    if (error) {
      sassNotifyResult(
        Object.assign({}, params, { message: error, isError: true })
      );
    } else {
      sassNotifyResult(
        Object.assign(
          {}, params, { message: `Generated: ${scss.dest}`, isError: false }
        )
      );
    }
  }); 
}

function buildCss(params = {}) {
  sass.render({
    file: scss.src,
  }, function(error, result) {
    if (error) {
      sassNotifyResult(
        Object.assign({}, params, { message: error, isError: true })
      );
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
