module.exports = function(grunt) {

  grunt.initConfig({
    loopback_sdk_angular: {
      services: {
        options: {
          input: 'server/server.js',
          output: 'client/js/services/lb-services.js'
        }
      }
    },
    docular: {
      groups: [
        {
          groupTitle: 'LoopBack',
          groupId: 'loopback',
          sections: [
            {
              id: 'lbServices',
              title: 'LoopBack Services',
              scripts: [ './client/js/services/lb-services.js' ]
            }
          ]
        }
      ]
    },
    docularserver: {
      targetDir: 'docular_generated'
    },

  });

  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadNpmTasks('grunt-docular');

  grunt.registerTask('default', [
    //'jshint',
    //'loopback_sdk_angular', 'docular'
  ]);
  grunt.registerTask('angular-sdk', ['loopback_sdk_angular', 'docular', 'docularserver']);



  };


