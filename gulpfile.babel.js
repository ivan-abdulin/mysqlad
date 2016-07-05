'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import browserSync from 'browser-sync';

var environment = null;

/**
 * Set environment
 */
gulp.task('setEnvDev',  () => { environment = 'dev'; });
gulp.task('setEnvProd', () => { environment = 'prod'; });

/**
 * Compile and copy styles
 */
gulp.task('styles', () => {
    return gulp.src('app/Resources/sass/app.scss')
        .pipe(gulpif(environment === 'dev', sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpif(environment === 'dev', sourcemaps.write()))
        .pipe(browserSync.stream())
        .pipe(gulp.dest('web/css'));
});


/**
 * Run browsersync
 */
gulp.task('browserSync', () => {
    browserSync.init({
        proxy: 'https://localhost',
        notify: false,
        open: false
    });
});

/**
 * Watch tasks
 *
 * Remember "watch" only spots added/removed files when source paths are relative
 */
gulp.task('watch', () => {
    gulp.watch('app/Resources/sass/**/*.scss', ['styles']);
});

gulp.task('default', [
    'setEnvDev', // synchronous
    'browserSync', // synchronous
    'styles',
    'watch'
]);

gulp.task('deploy', [
    'setEnvProd',
    'styles'
]);
