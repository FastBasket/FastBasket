module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env :{

      options : {},
      prod: {
      API_URL:'http://ec2-54-200-18-159.us-west-2.compute.amazonaws.com:8000/',
      TWILIO_SID: 'ACab8ee132a8df548fb3ee7b9ea995cd84',
      TWILIO_TOKEN: '81f262193c0549076527228e57a1fad6',
      STRIPE_PUBLIC_KEY:'pk_test_QuMujd8pj8I5GBZLxpUu5t7v',
      STRIPE_SECRET_KEY:'sk_test_diIA4gyirrsgzpEfEVAgsNLB',
      FACEBOOK_APP_ID:'775002172628893',
      FACEBOOK_APP_SECRET:'8f1b4435bd6ec495bad61fc90b5ae7ec'
    }
  },
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
