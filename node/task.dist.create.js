const fs = require('fs');
const { join } = require('path');
const log = require('fancy-log');
const { taskSass } = require('./task.sass');
const { MESSAGE_CREATED_DIR } = require('./constants');

const distScss = join(__dirname, '../dist/css');

function createDist() {
  return new Promise(function(resolve, reject) {
    fs.access(distScss, fs.constants.F_OK, error => {
      if (error) {
        log.info(`Folder to be created: ${distScss}`);
        fs.mkdir(distScss, { recursive: true }, error => {
          if (error) {
            reject({
              message: `Folder cannot be created: ${distScss}. ${error}`
            });
          } else {
            resolve({
              message: `${MESSAGE_CREATED_DIR}: ${distScss}`
            });
          }
        });
      } else {
        resolve({
          message: `Dir already exists: ${distScss}`
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
  createDist()
    .then(createResolved)
    .catch(createRejected);
}

module.exports = {
  taskDistCreate,
  test: {}    
};
