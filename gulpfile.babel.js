import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import webpack from 'gulp-webpack';

gulp.task('default', () => {
    gulp.src('src/api-sync.js')
        .pipe(webpack({
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: 'babel', // 'babel-loader' is also a legal name to reference
                        query: {
                            presets: ['stage-0', 'es2015']
                        }
                    }
                ]
            }
        }))
        .pipe(concat('dist/script.js'))
        .pipe(gulp.dest('.'));
});