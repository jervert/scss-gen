const fs = require('fs');
const log = require('fancy-log');
const { taskSass } = require('./task.sass');
const { MESSAGE_CREATED_DIR, MESSAGE_DIR_EXISTS } = require('./constants');
const { target } = require('../config');

function distCreate() {
  return new Promise(function(resolve, reject) {
    fs.access(target.css, fs.constants.F_OK, error => {
      if (error) {
        log.info(`Folder to be created: ${target.css}`);
        fs.mkdir(target.css, { recursive: true }, error => {
          if (error) {
            reject({
              message: `Folder cannot be created: ${target.css}. ${error}`
            });
          } else {
            resolve({
              message: `${MESSAGE_CREATED_DIR}: ${target.css}`
            });
          }
        });
      } else {
        resolve({
          message: `${MESSAGE_DIR_EXISTS}: ${target.css}`
        });
      }
    });
  });
}

function createResolved({ message }) {
  log.info(message);
  taskSass({
    isFirst: true
  });
}

function createRejected({ message }) {
  log.error(message);
}

function taskDistCreate() {
  distCreate()
    .then(createResolved)
    .catch(createRejected);
}

module.exports = {
  taskDistCreate,
  test: {
    distCreate
  }    
};
