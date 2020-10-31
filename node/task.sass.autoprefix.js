const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const log = require('fancy-log');
const notifier = require('node-notifier');
const sassNotifyResult = require('./task.sass.notify-result');
const { scss } = require('../config');

function taskSassAutoprefix(params = {}) {
  return new Promise(function(resolve, reject) {
    postcss([ autoprefixer ]).process(params.basicResult.css, {
      from: scss.dest
    })
      .then(result => {
        result.warnings().forEach(warn => {
          log.info(warn.toString());
        });
        log.info(`Prefixed: ${scss.dest}`);
        resolve(Object.assign({}, params, { prefixedResult: result }));
      })
      .catch(function (error, params) {
        log.error(error);
        notifier.notify(sassNotifyResult(
          Object.assign({}, params, { isError: true })
        ));
        reject(error);
      });
  });
}

module.exports =  {
  taskSassAutoprefix
};
