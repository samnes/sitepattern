var gulp = require('gulp');
var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');


/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']
};

var sassPaths = {
	'src':['./public/styles/**/*.scss']
};


// Sass

gulp.task('sass', function () {
    gulp.src(sassPaths.src)
        .pipe(sass({errLogToConsole: true})) // Keep running gulp even though occurred compile error
        .pipe(pleeease({
            minifier: false,
            autoprefixer: {
                browsers: ['last 2 versions']

            }
        }))
        .pipe(gulp.dest('./public/styles'))
});


// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));

});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

gulp.task('default', function() {
    gulp.watch(sassPaths.src,['sass']);
    gulp.src(paths.src)
  		.pipe(watch())
  		.pipe(jshint())
  		.pipe(jshint.reporter(jshintReporter));
});
