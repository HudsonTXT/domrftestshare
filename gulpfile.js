'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
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

function pugjs (cb) {
    return gulp.src('src/views/*.pug').
    pipe(pug())
    .pipe(gulp.dest('dest'))
    .pipe(browserSync.reload({stream: true}))
}

function css (cb) {
    return gulp.src('src/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dest/styles'))
    .pipe(browserSync.reload({stream: true}))
}

function server () {
    gulp.src('dest/*.html')
    .pipe(browserSync.reload({stream: true}))
}

// exports.default = () => {
//     gulp.series('browser', pugjs, css, server);
//     gulp.watch('src/styles/*.scss', css);
//     gulp.watch('src/views/*.pug', pugjs);
// }

gulp.task('watch', gulp.series(css, pugjs, 'browser-sync', function(done) {
    gulp.watch('src/styles/*.scss', css);
    gulp.watch('src/views/*.pug', pugjs);
}))