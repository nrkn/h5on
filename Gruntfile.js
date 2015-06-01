module.exports = function( grunt ){
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    browserify: {
      '/src/jquery.h5on.js': [ './jqyery.h5on.js' ]
    },
    uglify: {
      dist: {
        files: {
          'h5on.min.js': [ 'h5on.js' ],
          'jquery.h5on.min.js': [ 'jquery.h5on.js' ]
        }
      }
    },    
  });
  grunt.loadNpmTasks( 'grunt-browserify' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.registerTask( 'default', [ 'browserify', 'uglify' ] );
}