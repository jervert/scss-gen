const { target } = require('./config');
const clean = require('./node/task.dist.clean');
const distCreate = require('./node/task.dist.create');
const { taskSass } = require('./node/task.sass');

clean(target.clean)
  .then(distCreate)
  .then(taskSass({
    isFirst: true
  }));
