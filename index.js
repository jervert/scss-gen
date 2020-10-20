const { join } = require('path');
const clean = require('./node/task.dist.clean');

clean(join(__dirname, 'dist/**/*'));
