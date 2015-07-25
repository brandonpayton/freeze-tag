var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path');

var runWebpack = function (kwArgs) {
  kwArgs = kwArgs || {};

  webpack({
    context: path.join(__dirname, 'source', 'client'),
    target: 'web',
    module: {
      loaders: [
        { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?experimental&optional=runtime' }
      ]
    },
    entry: {
      // TODO: Is there a way to keep client/main.js and server/main.js here instead of renaming to game.js and server.js?
      'game': './main.jsx',
      'editor': './editor.jsx'
    },
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].js.map'
    },
    devtool: 'source-map',
    watch: !!kwArgs.watchForChanges
  })
  .pipe(gulp.dest('distribution/client'));

  gulp.src('source/server/**/*')
    .pipe(gulp.dest('distribution/server'));
};

gulp.task('build-js', function () {
  runWebpack();
});

gulp.task('copy-resources', function () {
  gulp.src('source/client/*.html')
    .pipe(gulp.dest('distribution/client'));
});

gulp.task('build-less', function () {

});

gulp.task('watch', function () {
  runWebpack({ watchForChanges: true });
});

gulp.task('default', [ 'copy-resources', 'build-js', 'build-less' ]);
