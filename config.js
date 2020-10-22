const { join } = require('path');

module.exports = {
  scss: {
    src: join (__dirname, './src/scss/main.scss'),
    dest: join (__dirname, './dist/css/main.css'),
    destMin: join (__dirname, './dist/css/main.min.css'),
    destMap: join (__dirname, './dist/css/main.min.css.map'),
    watch: join (__dirname, './src/scss/**/*.scss')
  },
  target: {
    clean: join (__dirname, './dist/**/*'),
    css: join (__dirname, './dist/css')
  }
};
