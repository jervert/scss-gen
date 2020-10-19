const sass = require('node-sass');
const log = require('fancy-log');
const notifier = require('node-notifier');
const { writeFile } = require('fs');
const { scss } = require('../config.json');
const sassNotifyResult = require('./task.sass.notify-result');
const watch = require('./task.watch');
const { TITLE_ERROR } = require('./constants');

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

module.exports = {
  initSass: function() {
    buildCss();
    watch();
  },
  buildCss
};