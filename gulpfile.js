var gulp = require('gulp');

gulp.task('default', function() {

	gulp.src([
		'bower_components/bootstrap/dist/js/bootstrap.min.js', 
		'bower_components/jquery/dist/jquery.min.js', 
		'bower_components/jquery/dist/jquery.min.map', 
	]).pipe(gulp.dest('public/javascripts/'));

	gulp.src([
		'bower_components/bootstrap/dist/css/*', 
	]).pipe(gulp.dest('public/stylesheets/'));

});