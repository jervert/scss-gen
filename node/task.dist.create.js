const { mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const log = require('fancy-log');
const { MESSAGE_CREATED_DIR } = require('./constants');

const distScss = join(__dirname, './dist/css');
module.exports = new Promise(function(resolve, reject) {
  if (!existsSync(distScss)) {
    mkdirSync(distScss, { recursive: true });
    if (existsSync(distScss)) {
      resolve({
        message: `${MESSAGE_CREATED_DIR}: ${distScss}`
      });
    } else {
      reject({
        message: `Folder cannot be created: ${distScss}`
      });
    }
  } else {
    resolve({
      message: `Dir already exists: ${distScss}`
    });
  }
});
