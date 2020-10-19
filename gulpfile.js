'use strict';

const gulp = require('gulp');
const { series, parallel } = gulp;


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


gulp.task('browser-sync', function(done) {
    browserSync.init({
        server: {
            baseDir: 'dest'
        },
        port: 80,
        https: true
    })

    browserSync.watch('dest/').on('change', browserSync.reload);

    done();
})

gulp.task('scripts', function () {
    return gulp.src('src/scripts/app.js')
    .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('dest/js'))
        .pipe(browserSync.reload({stream: true}))
});

const scripts = async () => {
    return gulp.src('src/scripts/app.js')
        .pipe(await webpackStream({
            watch: true,
            mode: 'production',
            entry: {app: './src/scripts/app.js'},
            output: {
                path: __dirname + './dest/js',
                filename: '[name].js',
                publicPath: "js/"
            }
        }))
        .pipe(gulp.dest('dest/js'))
        .pipe(browserSync.reload({stream: true}))
}

const html = () => {
    return gulp
          .src('src/views/*.pug')
          .pipe(
              pug({
                  pretty: true
              })
          )
           .pipe(gulp.dest('dest'))
           .pipe(browserSync.reload({stream: true}))
}

const styles = () => {
    return gulp.src('src/styles/main.scss')
            .pipe(sass({
                outputStyle: 'compressed'
            }).on('error', sass.logError))
            .pipe(autoprefixer())
            .pipe(gulp.dest('dest/styles'))
            .pipe(browserSync.reload({stream: true}))
}

function server () {
    gulp.src('dest/*.html')
    .pipe(browserSync.reload({stream: true}))
}

// gulp.task('watch', gulp.series('scripts', css, pugjs, 'browser-sync', function(done) {
//     gulp.watch(['src/styles/*.scss', 'src/styles/*/*.scss'], css);
//     gulp.watch('src/views/*.pug', pugjs);
//     gulp.watch('src/scripts/*.js', gulp.series('scripts'))
// }))

exports.dev = series(
    parallel(html, styles, scripts)
);

exports.watch = series(
    parallel(scripts, styles, html, 'browser-sync', server),
    () => {
        gulp.watch(['src/styles/*.scss', 'src/styles/*/*.scss'], styles);
        gulp.watch('src/views/*.pug', html);
        gulp.watch('src/scripts/*.js', scripts)
    }
)