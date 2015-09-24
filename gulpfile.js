'use strict';

var gulp = require('gulp-help')(require('gulp')),
	browserSync = require('browser-sync'),
	argv = require('yargs').argv,
	protractor = require('gulp-protractor'),
	testingServerUrl;
	
var SRC_DIR = 'src',
	DIST_DIR = 'dist',
	ENV = argv.env;
	
gulp.task('webdriver:update', protractor.webdriver_update);

gulp.task('webdriver:standalone', ['webdriver:update'], protractor.webdriver_standalone);
	
var sass = require('gulp-sass');		
	
gulp.task('build:styles', function () {
	
	return gulp.src([
		SRC_DIR + '/**/*.scss',
		'!' + SRC_DIR + '/**/_*.scss'
	])
		.pipe(sass())
		.pipe(gulp.dest(DIST_DIR));
	
});

var ts = require('gulp-typescript');

gulp.task('build:scripts', function () {
	
	return gulp.src([
		SRC_DIR + '/**/*.ts'
	])
		.pipe(ts())
		.pipe(gulp.dest(DIST_DIR));
	
});

gulp.task('build:templates', function () {
	
	return gulp.src([
		SRC_DIR + '/**/*.html',
		SRC_DIR + '/**/_*.html'
	])
		.pipe(gulp.dest(DIST_DIR));
	
});

var wiredep = require('wiredep'),
	concat = require('gulp-concat');

gulp.task('build:bower', function () {
	
	var bowerDeps = wiredep({
        dependencies: true,
        devDependencies: ENV !== 'prod'
    });
	
	return gulp.src(bowerDeps.js)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(DIST_DIR));
	
});

var inject = require('gulp-inject');

gulp.task('build:inject', function () {
	
	var vendors = gulp.src(DIST_DIR + '/vendor.js');
	
	var source = gulp.src([
		DIST_DIR + '/**/*.js',
		DIST_DIR + '/**/*.css',
		'!' + DIST_DIR + '/vendor.js'
	]);
	
	return gulp.src(DIST_DIR + '/index.html')
		.pipe(inject(vendors, {name: 'vendors', relative: true}))
		.pipe(inject(source, {relative: true}))
		.pipe(gulp.dest(DIST_DIR));
	
});	

var runSequence = require('run-sequence');

gulp.task('build', function (callback) {
	
	runSequence(
		[
			'build:styles',
			'build:scripts',
			'build:templates',
			'build:bower'
		],
		'build:inject',
		callback
	);
	
});

gulp.task('tests:e2e:server', function (callback) {
	
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		ui: {
			enabled: false
		},
		notify: false,
		browser: []
	}, function (err, bs) {
		
		testingServerUrl = bs.options.getIn(["urls", "local"]) + "/";

        callback();
		
	});
	
});

gulp.task('tests:e2e', ['tests:e2e:server'], function () {
	
	var args = [];
	
	// if we have open server in current scope we will use it
    if (browserSync.active) {
        args.push(
            '--baseUrl='+ testingServerUrl
        )
    }

    if (argv.specs) {
        args.push(
            '--specs='+ argv.specs
        )
    }
	
	return gulp.src('tests/e2e/**/*.feature')
		.pipe(protractor.protractor({
			configFile: 'e2e.conf.js',
			args: args
		}))
		.on('error', function (e) {
			
			console.log('dupa');
			
			browserSync.exit();
			
			process.exit();
			
		})
		.on('end', function () {
			
			console.log('dupa');
			
			browserSync.exit();
			process.exit();
			
		});
	
});