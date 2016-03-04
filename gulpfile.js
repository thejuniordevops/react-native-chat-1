var gulp = require('gulp');
var esformatter = require('gulp-esformatter');

gulp.task('default', function () {
  return gulp.src('index.ios.js', {base: "./"})
    .pipe(esformatter({indent: {value: '  '}}))
    .pipe();
});