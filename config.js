const { join } = require('path');

module.exports = {
  scss: {
    src: join (__dirname, './src/scss/main.scss'),
    dest: join (__dirname, './dist/css/main.css'),
    watch: join (__dirname, './src/scss/**/*.scss')
  }
};
