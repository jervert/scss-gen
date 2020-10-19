const del = require('del');

module.exports = function(dest, cb) {
  del(dest, {
    force: true
  }).then(cb);
}
