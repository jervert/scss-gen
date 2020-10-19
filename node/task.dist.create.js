const { mkdir } = require('fs');

module.exports = function(dest, cb) {
  mkdir(dest, { recursive: true }, cb);
}
