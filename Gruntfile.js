module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      deploy: {
        options: { stdout: true },
        command: [
          //'nodemon aggregator/agg.js',
          'npm install',
          'bower install',
          'sudo service neo4j-service start',
          'sudo service elasticsearch start',
          //'sudo service redis-server start',
          'sudo service postgresql start',
          'sudo service rabbitmq-server start',
          '(node batch-server/batch.js &)',
          '(node server/server.js &)',
          '(node driver-server/driver.js &)'
        ].join(' && ')
      }
    }
  });


  grunt.loadNpmTasks('grunt-env');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('start', ['env:prod', 'shell']);
}
