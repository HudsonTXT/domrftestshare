'use strict';

const gulp = require('gulp');
const { series, parallel, watch } = gulp;

const sass = require('gulp-sass');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

gulp.task('browser-sync', function (done) {
  browserSync.init({
    server: {
      baseDir: 'dest'
    },
    port: 80,
    https: false
  });

  browserSync.watch('dest/').on('change', browserSync.reload);

  done();
});

gulp.task('scripts', function () {
  return gulp.src('src/scripts/app.js').
      pipe(webpackStream(webpackConfig), webpack).
      pipe(gulp.dest('dest/js')).
      pipe(browserSync.reload({ stream: true }));
});

const scripts = async () => {
  return gulp.src('src/scripts/app.js').pipe(await webpackStream({
    watch: false,
    mode: 'production',
    entry: { app: './src/scripts/app.js' },
    output: {
      path: __dirname + './dest/js',
      filename: '[name].js',
      publicPath: 'js/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      ],
    },
  })).pipe(gulp.dest('dest/js')).pipe(browserSync.reload({ stream: true }));
};

const html = () => {
  return gulp.src('src/views/*.pug').pipe(
      pug({
        pretty: true
      })
  ).pipe(gulp.dest('dest')).pipe(browserSync.reload({ stream: true }));
};

const styles = () => {
  return gulp.src('src/styles/main.scss').
      pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)).
      pipe(autoprefixer()).
      pipe(gulp.dest('dest/styles')).
      pipe(browserSync.reload({ stream: true }));
};

function server () {
  gulp.src('dest/*.html').pipe(browserSync.reload({ stream: true }));
}

gulp.task('watch',
    gulp.series(scripts, styles, html, 'browser-sync', function (done) {
      gulp.watch(['src/styles/*.scss', 'src/styles/*/*.scss'], styles);
      gulp.watch('src/views/*.pug', html);
      gulp.watch('src/scripts/*.js', scripts);
    }));

exports.dev = series(
    parallel(html, styles, scripts)
);

// exports.watch = series(
//     gulp.series(scripts, styles, html, 'browser-sync', server,
//     (done) => {
//         watch(['src/styles/*.scss', 'src/styles/*/*.scss'], styles);
//         watch('src/views/*.pug', html);
//         watch('src/scripts/*.js', scripts)
//     }
// )
// );