const { mkdir } = require('fs');
module.exports = function(dest, cb) {
  return function() {
    mkdir(dest, { recursive: true }, cb);
  }
}
