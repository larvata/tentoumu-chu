var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

var port = process.env.PORT || 3434;
var reloadPort = process.env.RELOAD_PORT || 35729;

gulp.task('clean', function () {
  del(['build']);
});

gulp.task('build', function () {
  return gulp.src(webpackConfig.entry.demo[0])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/'));
});

gulp.task('serve', function () {
  connect.server({
    port: port,
    livereload: {
      port: reloadPort
    }
  });
});

gulp.task('default', ['clean','serve','build']);
