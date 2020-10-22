const { target } = require('./config');
const clean = require('./node/task.dist.clean');

clean(target.clean);
