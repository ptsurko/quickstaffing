var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon');

gulp.task('connect', function() {
  connect.server({
    root: 'public/'
  });
});

gulp.task('scripts', function() {
  gulp.src('./public/js/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/dist/'));

  gulp.src([
      './bower_components/angular/angular.js',
      './bower_components/d3/d3.js',
      './bower_components/sprintf/dist/sprintf.min.js',
      './bower_components/underscore/underscore.js'])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./public/dist/'));
});


gulp.task('styles', function() {
  gulp.src('./public/less/**/*.less')
    .pipe(concat('styles.less'))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(less())
    .pipe(gulp.dest('./public/dist/'));

  gulp.src([
      './bower_components/bootstrap/dist/css/bootstrap-theme.css',
      './bower_components/bootstrap/dist/css/bootstrap.css'])
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('./public/dist/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('public/**', ['build'])
});

gulp.task('deploylocal', function () {
  nodemon({ script: 'server.js'});
});

gulp.task('build', ['scripts', 'styles']);

gulp.task('default', ['build', 'deploylocal', 'watch']);
