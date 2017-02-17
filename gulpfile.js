var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');

gulp.task('sass', function() {
	gulp.src('styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/css/'));
});

gulp.task('watch-sass', function() {
	gulp.watch('./styles/**/*.scss',['sass']);
});

gulp.task('default',['watch-sass'], function() {
	return nodemon({
		script: 'app.js',
	});
});