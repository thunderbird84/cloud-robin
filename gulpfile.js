var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");

gulp.task('default', function() {
  return gulp.src(['./lib/*.{js,json}', './scripts/*.{js,json}'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});