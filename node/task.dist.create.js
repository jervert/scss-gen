const fs = require('fs');
const log = require('fancy-log');
const { MESSAGE_CREATED_DIR, MESSAGE_DIR_EXISTS } = require('./constants');
const { target } = require('../config');

module.exports = function(params) {
  return new Promise(function(resolve, reject) {
    fs.access(target.css, fs.constants.F_OK, error => {
      if (error) {
        log.info(`Folder to be created: ${target.css}`);
        fs.mkdir(target.css, { recursive: true }, error => {
          if (error) {
            log.error(`Folder cannot be created: ${target.css}. ${error}`);
            reject(error);
          } else {
            const message = `${MESSAGE_CREATED_DIR}: ${target.css}`;
            log.info(message);
            resolve(Object.assign({}, params, {
              create: message
            }));
          }
        });
      } else {
        const message = `${MESSAGE_DIR_EXISTS}: ${target.css}`;
        log.info(message);
        resolve(Object.assign({}, params, {
          create: message
        }));
      }
    });
  });
};
