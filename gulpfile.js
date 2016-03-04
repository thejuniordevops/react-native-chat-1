var gulp = require('gulp');
var esformatter = require('gulp-esformatter');

gulp.task('format', function() {
  return gulp.src('js/*')
    .pipe(esformatter({indent: {value: '  '}}))
    .pipe(gulp.dest(function(data) {
      console.log("Writing to directory: " + data.base);
      return data.base;
    }));
});