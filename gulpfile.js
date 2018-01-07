'use strict';

const gulp = require('gulp');
const runsequence = require('run-sequence');
const gRename = require('gulp-rename');

/******************** main tasks ********************/
// production build
gulp.task('build-pro', function(done) {
    process.env.NODE_ENV = 'production';
    runsequence('build-start', 'build-after', function() {
        done();
    });
});
// development build
gulp.task('build-dev', function(done) {
    process.env.NODE_ENV = 'devlopment';
    runsequence('build-start', 'build-after', function() {
        done();
    });
});

// default build
gulp.task('build', ['build-dev']);

// default
gulp.task('default', ['build-pro']);

/******************** sub tasks ********************/
// before hook
gulp.task('build-start', function(done) {
    // check whether config.json exists, if not, use default values
    try{
        fs.readFileSync('./config.json');
        done();
        return;
    } catch(e) {
        // create config.json
        return gulp
            .src('./config-default.json')
            .pipe(gRename(function(fpath) {
                fpath.basename = 'config';
                fpath.extname = '.json';
            }))
            .pipe(gulp.dest('./'));
    }
});

// after hook
gulp.task('build-after', function() {});

// unit test
gulp.task('unit-test', function() {});

