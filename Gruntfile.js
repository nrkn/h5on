module.exports = function( grunt ){
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    browserify: {
      'h5on.jquery.js': [ 'src/h5on.jquery.js' ]
    },
    uglify: {
      dist: {
        files: {
          'h5on.min.js': [ 'h5on.js' ],
          'h5on.jquery.min.js': [ 'h5on.jquery.js' ]
        }
      }
    },    
  });
  grunt.loadNpmTasks( 'grunt-browserify' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.registerTask( 'default', [ 'browserify', 'uglify' ] );
}