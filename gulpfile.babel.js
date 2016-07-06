'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import browserSync from 'browser-sync';
import cssnano from 'gulp-cssnano';
import bust from 'gulp-buster';

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

/**
 * Watch tasks
 *
 * Remember "watch" only spots added/removed files when source paths are relative
 */
gulp.task('watch', () => {
    gulp.watch('app/Resources/sass/**/*.scss', ['styles']);
    gulp.watch('app/Resources/views/**/*.twig', ['reloadBrowser']);
});

gulp.task('default', [
    'setEnvDev', // synchronous
    'browserSync', // synchronous
    'fonts',
    'styles',
    'watch'
]);

gulp.task('deploy', [
    'setEnvProd',
    'fonts',
    'styles'
]);


function transformAssetsPaths(rawHashes) {
    let hashes = {};
    for (let path in rawHashes) {
        let newPath = path.replace('web/', '');
        hashes[newPath] = rawHashes[path];
    }

    return hashes;
}
