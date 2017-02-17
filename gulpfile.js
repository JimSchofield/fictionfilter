var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');  

gulp.task('sass', function() {
	gulp.src('styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/css/'));
});

gulp.task('watch-sass', function() {
	gulp.watch('./styles/**/*.scss',['sass']);
});

gulp.task('jscripts', function() {
	return gulp.src('js/**/*.js')
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('public/js'))
});

gulp.task('watch-jscripts', function() {
	gulp.watch('./js/**/*.js', ['jscripts']);
})

gulp.task('default',['watch-sass', 'watch-jscripts'], function() {
	return nodemon({
		script: 'app.js',
	});
});