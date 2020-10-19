const chokidar = require('chokidar');
const { scss } = require('../config.json');
const { buildCss } = require('./task.sass');

function watcher(event, path) {
  log.info(`${event}: ${path}`);
  buildCss({
    path,
    event
  });
}

module.exports = function() {
  chokidar.watch(scss.watch, {
    ignoreInitial: true
  }).on('all', watcher);
}
