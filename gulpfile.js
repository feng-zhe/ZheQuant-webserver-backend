'use strict';

const gulp = require('gulp');
const gUtil = require('gulp-util');
const gTap = require('gulp-tap');
const gUglify = require('gulp-uglify');
const gRename = require('gulp-rename');
const gLess = require('gulp-less');

const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const runsequence = require('run-sequence');
const path = require('path');
const fs = require('fs');
const del = require('del');
const lessclean = require('less-plugin-clean-css');

/******************** main tasks ********************/
// production build
gulp.task('build-pro', function(done) {
    process.env.NODE_ENV = 'production';
    runsequence('build-start', 'less', 'react', 'copy', 'build-after', function() {
        done();
    });
});
// development build
gulp.task('build-dev', function(done) {
    process.env.NODE_ENV = 'devlopment';
    runsequence('build-start', 'less', 'react', 'copy', 'build-after', function() {
        done();
    });
});

// default build
gulp.task('build', ['build-dev']);

// default
gulp.task('default', ['build-pro']);

// clean the generated and temp files
gulp.task('clean', function() {
    return del(['public/build/*']);
});

/******************** sub tasks ********************/
// compile less
gulp.task('less', function(done) {
    const cleancss = new lessclean();
    return gulp.src('./src/less/*.less')
        .pipe(gLess({
            plugins: [cleancss]
        }))
        .pipe(gRename(function(fpath) {
            fpath.basename += '_min';
            fpath.extname = '.css';
        }))
        .pipe(gulp.dest('./public/build/css/'));
});

// compile react 
gulp.task('react', function(done) {
    return gulp.src('./src/javascripts/react/index.js', {
            read: false
        })
        .pipe(gTap(function(file) {
            file.contents = browserify(file.path)
                .transform('babelify', {
                    presets: ['react', 'es2015']
                })
                .bundle();
        }))
        .pipe(gRename(function(fpath) {
            fpath.basename += '_min';
            fpath.extname = '.js';
        }))
        .pipe(buffer())
        .pipe(gUglify())
        .pipe(gulp.dest('./public/build/javascripts/'));
});

// copy files
gulp.task('copy',function(done){
    return gulp
        .src(['./src/css/**/*'])
        .pipe(gulp.dest('./public/build/css/'));
});

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

