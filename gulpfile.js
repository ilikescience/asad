var gulp = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    prefix = require('gulp-autoprefixer'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var destPath = "dist/";
var srcPath = "src/";

//this will handle errors for us
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

//concat, minify js
gulp.task('scripts', function() {
    gulp.src([srcPath + 'js/**/*.js', '!' + srcPath + 'js/lib/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .on('error', handleError)
    .pipe(gulp.dest(destPath + 'js'));
    //move vendor js without minifying
    gulp.src([srcPath + 'js/lib/**.*'], {base: srcPath + 'js'})
    .pipe(gulp.dest(destPath + 'js'));
});

//concat, minify css
gulp.task('styles', function() {
    gulp.src([srcPath + '/sass/**/*.scss'])
    .pipe(sass())
    .on('error', handleError)
    .pipe(csso())
    .pipe(prefix())
    .pipe(gulp.dest(destPath + 'css'));
});

//compile jade files
gulp.task('templates', function() {
    gulp.src(srcPath + 'jade/**/*.jade')
    .pipe(jade({
        'basedir': srcPath + 'jade'
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('watch', function() {
    gulp.watch(srcPath + 'js/**', ['scripts']);
    gulp.watch(srcPath + 'sass/**', ['styles']);
    gulp.watch(srcPath + '**/*.jade', ['templates']);
});

gulp.task('default', ['scripts', 'styles', 'templates']);