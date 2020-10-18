const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const del = require('del');
const { writeFileSync, mkdir } = require('fs');
const { join } = require('path');
const notifier = require('node-notifier');
const { scss } = require('./config.json')

function buildCss(params = {}) {
  sass.render({
    file: scss.src,
  }, function(error, result) {
    if (error) {
      log(error);
    } else {
      writeFileSync(scss.dest, result.css);
      log(`Generated: ${scss.dest}`);
    }

    notifier.notify({
      title: `SCSS ${error ? 'Error' : 'Success'}`,
      message: params.path ? `${params.event} ${params.path}` : 'First build',
      icon: join(__dirname, `icons/icons8-${error ? 'cancel': 'checked'}-512.png`)
    });
  });
}

function watcher(event, path) {
  log(`${event}: ${path}`);
  buildCss({
    path,
    event
  });
}

function init() {
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
      init();
    }
  });
}

del('./dist/**/*', {
  force: true
}).then(createDist);
