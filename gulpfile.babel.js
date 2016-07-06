'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import browserSync from 'browser-sync';
import cssnano from 'gulp-cssnano';
import bust from 'gulp-buster';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';

var environment = null;

/**
 * Set environment
 */
gulp.task('setEnvDev',  () => { environment = 'dev'; });
gulp.task('setEnvProd', () => { environment = 'prod'; });

/**
 * Fonts
 */
gulp.task('fonts', () => {
    return gulp.src('app/Resources/mysqlad-icons/fonts/*.{svg,ttf,woff}')
        .pipe(gulp.dest('web/fonts'));
});

/**
 * Compile and copy styles
 */
gulp.task('styles', () => {
    return gulp.src('app/Resources/sass/app.scss')
        .pipe(gulpif(environment === 'dev', sourcemaps.init()))
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulpif(environment === 'dev', sourcemaps.write()))
        .pipe(gulpif(environment === 'dev', browserSync.stream()))
        .pipe(gulp.dest('web/css'))
        .pipe(gulpif(environment === 'prod', bust({transform: transformAssetsPaths})))
        .pipe(gulpif(environment === 'prod', gulp.dest('web')));
});


/**
 * Scripts
 */
gulp.task('scripts', () => {
    return browserify('app/Resources/scripts/main.js')
        .transform('babelify')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpif(environment === 'dev', sourcemaps.init()))
        .pipe(uglify())
        .pipe(gulpif(environment === 'dev', sourcemaps.write()))
        .pipe(gulp.dest('web/js'))
        .pipe(gulpif(environment === 'prod', bust({transform: transformAssetsPaths})))
        .pipe(gulpif(environment === 'prod', gulp.dest('web')))
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

gulp.task('reloadBrowser', browserSync.reload);
gulp.task('browserifyAndReloadBrowser', ['scripts'], browserSync.reload);

/**
 * Watch tasks
 *
 * Remember "watch" only spots added/removed files when source paths are relative
 */
gulp.task('watch', () => {
    gulp.watch('app/Resources/sass/**/*.scss', ['styles']);
    gulp.watch('app/Resources/scripts/**/*.js', ['browserifyAndReloadBrowser']);

    let backendRelated = [
        'src/**/*.php',
        'app/config/**/*.yml',
        'app/Resources/views/**/*.twig',
        'app/*.php',
        'web/**/*.php'
    ];
    gulp.watch(backendRelated, ['reloadBrowser']);
});

gulp.task('default', [
    'setEnvDev', // synchronous
    'browserSync', // synchronous
    'fonts',
    'styles',
    'scripts',
    'watch'
]);

gulp.task('deploy', [
    'setEnvProd',
    'fonts',
    'styles',
    'scripts'
]);


function transformAssetsPaths(rawHashes) {
    let hashes = {};
    for (let path in rawHashes) {
        let newPath = path.replace('web/', '');
        hashes[newPath] = rawHashes[path];
    }

    return hashes;
}
