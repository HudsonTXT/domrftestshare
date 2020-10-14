'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function browserSyncInit () {
    return browserSync.init({
        server: {
            baseDir: './dest'
        }
    })
}

gulp.task('browser-sync', function(done) {
    browserSync.init({
        server: {
            baseDir: 'dest'
        }
    })

    browserSync.watch('dest/').on('change', browserSync.reload);

    done();
})

gulp.task('scripts', function () {
    return gulp.src('src/scripts/app.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dest/js'))
        .pipe(browserSync.reload({stream: true}))
});

function pugjs (cb) {
    return gulp.src('src/views/*.pug').
    pipe(pug())
    .pipe(gulp.dest('dest'))
    .pipe(browserSync.reload({stream: true}))
}

function css (cb) {
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

gulp.task('watch', gulp.series('scripts', css, pugjs, 'browser-sync', function(done) {
    gulp.watch(['src/styles/*.scss', 'src/styles/*/*.scss'], css);
    gulp.watch('src/views/*.pug', pugjs);
    gulp.watch('src/scripts/*.js', gulp.series('scripts'))
}))