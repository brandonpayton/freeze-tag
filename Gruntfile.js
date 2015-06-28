module.exports = function (grunt) {
  grunt.initConfig({
    'babel': {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'built/server/main.js': 'src/server/main.js'
        }
      }
    },
    browserify: {
      dist: {
        options: {
          transform: [ 'babelify' ]
        },
        files: {
          'built/client/main.js': 'src/client/main.js',
          'built/client/editor.js': 'src/client/editor.js'
        }
      }
    },
    copy: {
      resources: {
        files: [
          { expand: true, cwd: 'src/', src: '**/*.html', dest: 'built/' }
        ]
      }
    },
    watch: {
      options: {
        atBegin: true
      },

      js: {
        files: 'src/**/*.js',
        tasks: 'build-js'
      },
      html: {
        files: 'src/**/*.html',
        tasks: 'copy:resources'
      },
      css: {
        files: 'src/resources/**/*.less',
        tasks: 'less'
      }
    },
    less: {
      main: {
        files: {
          'built/client/resources/main.css': 'src/client/resources/main.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('build-js', [ 'babel', 'browserify' ]);
  grunt.registerTask('build', [ 'build-js', 'less', 'copy:resources' ]);
  grunt.registerTask('default', [ 'build' ]);
};
