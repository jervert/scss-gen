const { target } = require('./config');
const clean = require('./node/task.dist.clean');
const { taskDistCreate } = require('./node/task.dist.create');

clean(target.clean).then(taskDistCreate);
