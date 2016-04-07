import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import webpack from 'gulp-webpack';
import addSrc from 'gulp-add-src';
import textInject from 'gulp-js-text-inject';
import jsString from 'gulp-js-string';
import replace from 'gulp-replace';

gulp.task('default', [ 'script:worker', 'script:main' ]);

gulp.task('script:main', () => {
    const webpackConfig = {
        entry: './src/api-sync.js',
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['stage-0', 'es2015']
                    }
                }
            ]
        }
    };

    return gulp.src('src/api-sync.js')
        .pipe(webpack(webpackConfig))
        .pipe(concat('dist/script.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('script:worker', () => {
    const webpackConfig = {
        entry: './src/worker.js',
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['stage-0', 'es2015']
                    }
                }
            ]
        }
    };

    return gulp.src('src/worker.js')
        .pipe(webpack(webpackConfig))
        .pipe(concat('dist/worker.js'))
        .pipe(jsString())
        .pipe(replace("module.exports = '", "window.workerScript = '"))
        .pipe(gulp.dest('.'));
});