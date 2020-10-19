const { join } = require('path');

module.exports = function (params = {}) {
  return {
    title: `SCSS ${params.isError ? 'error' : 'success'}`,
    message: params.path ? `${params.event} ${params.path}` : 'First build',
    icon: join(
      __dirname,
      `icons/icons8-${params.isError ? 'cancel': 'checked'}-512.png`
    )
  };
}
