const chokidar = require('chokidar');
const sass = require('node-sass');
const log = require('fancy-log');
const { writeFileSync } = require('fs');
const { join } = require('path');
const notifier = require('node-notifier');
const { scss } = require('./config.js')
 
function buildCss(params = {}) {
  sass.render({
    file: scss.main,
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

buildCss();

chokidar.watch(scss.watch, {
  ignoreInitial: true
}).on('all', watcher);
