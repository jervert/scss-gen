const { target } = require('./config');
const { text } = require('figlet');
const chalk = require('chalk');
const clean = require('./node/task.dist.clean');
const distCreate = require('./node/task.dist.create');
const { taskSass } = require('./node/task.sass');
const log = require('fancy-log');

function watching() {
  log.info('Watching changes');
  text('SCSS-Gen', function(error, data) {
    if (error) {
      console.log('Something went wrong...');
      console.dir(error);
      return;
    }
    console.log(chalk.cyan(data));
  });
}

Promise.resolve()
  .then(clean(target.clean))
  .then(distCreate)
  .then(taskSass({
    isFirst: true
  }))
  .then(watching);
