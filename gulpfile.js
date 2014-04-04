var express = require('express');
var deploy = require('gulp-gh-pages');
var gconcat = require('gulp-concat');
var guglify = require('gulp-uglify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var streamqueue = require('streamqueue');

var app = express();

gulp.task('html', function () {
    gulp.src('*.html')
        .pipe(gulp.dest('_public'));
});

gulp.task('js', function () {
    var app = gulp.src('js/*.js');
    streamqueue({objectMode: true})
        .done(app)
        .pipe(gconcat('app.min.js'))
        .pipe(guglify())
        .pipe(gulp.dest('_public/js'));
});

gulp.task('css', function () {
    gulp.src('css/*.css')
        .pipe(gulp.dest('_public/css'));
});

gulp.task('assets', function () {
    gulp.src('assets/**/*')
        .pipe(gulp.dest('_public/'));
});

gulp.task('server', function () {
    app.use(express.static(path.resolve('_public')));
    app.listen(3000);
    gutil.log('Listening on port 3000');
});

gulp.task('watch', function () {
    gulp.watch('*.html', ['html']);
    gulp.watch('js/*.js', ['js']);
    gulp.watch('css/*.css', ['css']);
    gulp.watch('assets/**/*', ['assets']);
});

gulp.task('deploy', function () {
    gulp.src('_public/**/*')
        .pipe(deploy('git@github.com:Lance0312/csasa-petition.git', 'origin'));
});

gulp.task('build', ['html', 'js', 'css', 'assets']);
gulp.task('dev', ['build', 'server', 'watch']);
gulp.task('default', ['build']);
