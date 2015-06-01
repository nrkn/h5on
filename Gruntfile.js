module.exports = function( grunt ){
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    browserify: {
      '/src/jquery.h5on.js': [ 'jqyery.h5on.js' ]
    }
  });
  grunt.loadNpmTasks( 'grunt-browserify' );
}