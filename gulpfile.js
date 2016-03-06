var gulp = require('gulp');
var esformatter = require('gulp-esformatter');
var exec = require('sync-exec');

/**
 * return any files modified since last push
 */
function modifiedFiles(types) {
  types = types || 'both';
  var modifiedFiles = {};
  var noEmptyStr = function(str) {
    return str.length > 0;
  };
  var uncommitted = exec('git diff --name-only').stdout;
  modifiedFiles.uncommitted = uncommitted.split('\n').filter(noEmptyStr);
  var commited = exec('git diff --name-only --cached').stdout;
  modifiedFiles.commited = commited.split('\n').filter(noEmptyStr);
  modifiedFiles.both = modifiedFiles.uncommitted.concat(modifiedFiles.commited);
  return modifiedFiles;
}

gulp.task('format', function() {
  var filterJSFiles = function(str) {
    return str.match(/\.js$/i);
  };
  return gulp.src(modifiedFiles().both.filter(filterJSFiles))
    .pipe(esformatter({
      indent: {
        value: '  '
      }
    }))
    .pipe(gulp.dest(function(data) {
      console.log('formatting: ' + data.base);
      return data.base;
    }));
});

gulp.task('test', function() {
  console.log(modifiedFiles().both);
});