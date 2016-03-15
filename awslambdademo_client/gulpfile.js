var gulp 				= require('gulp'),
		uglify			= require('gulp-uglify'),
		dust				= require('gulp-dust'),
		bower				= require('gulp-bower'),
		concat			= require('gulp-concat'),
		sourcemaps	= require('gulp-sourcemaps'),
		flatten			= require('gulp-flatten'),
		serve 			= require('gulp-serve'),
		vinylpaths 	= require('vinyl-paths'),
		del 				= require('del');

var p = {
		scripts: ['src/lib/*.js'],
		tpls: ['src/templates/*.dust'],
		html: ['src/*.html'],
		styles: ['src/styles/*.css'],
		images: ['src/images/*.png','src/images/*.jpg'],
		fav: ['src/images/favicon.ico'],
		b: 'build/'
};

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(p.b)
 .pipe(vinylpaths(del));
});

gulp.task('serve', serve('build'));

gulp.task('bower', function() {
	return bower({ cmd: 'update'});
});

gulp.task('copy',function() {
	gulp.src(p.html)
	.pipe(gulp.dest( p.b ));

	gulp.src(p.styles)
	.pipe(gulp.dest( p.b + 'styles' ));

	//js map
	gulp.src(['bower_components/**/*.min.map'])
	.pipe(flatten())
	.pipe(gulp.dest( p.b + 'lib' ));

	//favicon
	gulp.src(['src/images/favicon.ico'])
	.pipe(gulp.dest( p.b ));

	//images
	gulp.src(['src/images/*.png','src/images/*.jpg'])
	.pipe(gulp.dest( p.b + 'images' ));

	//js first
	gulp.src(['bower_components/**/*.js'])
	.pipe(flatten())
	.pipe(gulp.dest( p.b + 'lib' ));

	//css second
	gulp.src('bower_components/**/*.min.css')
	.pipe(flatten())
	.pipe(gulp.dest( p.b + 'styles' ));

	//fonts
	gulp.src('bower_components/**/fonts/*')
	.pipe(flatten())
	.pipe(gulp.dest( p.b + 'fonts' ));
});

gulp.task('templates', function () {
	return gulp.src(p.tpls)
	.pipe(dust())
	.pipe(concat('dustTemplates.js'))
	.pipe(gulp.dest( p.b + 'lib' ));
});

gulp.task('scripts', function() {
	return gulp.src(p.scripts)
	.pipe(uglify())
	.pipe(concat('all.min.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest( p.b + 'lib' ));
});

gulp.task('watch', function() {
	gulp.watch(p.scripts, ['scripts']);
	gulp.watch(p.tpls,['templates']);
	gulp.watch(p.html,['copy']);
	gulp.watch(p.css,['copy']);
	gulp.watch(p.images,['copy']);
	gulp.watch('bower.json',['bower','copy']);
});

gulp.task('default',['serve','watch','templates','scripts','copy','bower']);
