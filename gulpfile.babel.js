import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import {
    deleteAsync
} from 'del';
import browsersync from 'browser-sync';

const sass = gulpSass(dartSass);

// Server
export const server = (done) => {
    browsersync.init({
        server: './dist',
        notify: false,
        port: 3000,
    });
}

// Roots
const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

// Build folder cleaner
export async function clean() {
    return await deleteAsync(['dist'])
}

// HTML
export function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())
}

// Styles
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

// Scripts
export function scripts() {
    return gulp.src(paths.scripts.src, {
            sourcemaps: true
        })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browsersync.stream())
}

// Watcher
export function watch() {
    gulp.watch(paths.html.src).on('change', browsersync.reload)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Tasks
export const build = gulp.series(clean, gulp.parallel(html, styles, scripts), gulp.parallel(watch, server));

export default build
