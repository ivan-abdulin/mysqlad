'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';

/**
 * Compile and copy styles
 */
gulp.task('styles', () => {
    return gulp.src('app/Resources/sass/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('web/css'));
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
    'styles',
    'watch'
]);
