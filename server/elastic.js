var elasticsearch = require('elasticsearch');
var constants = require('./config/constants');

var client = new elasticsearch.Client({
  host: constants.ELASTIC_URL,
  log: 'trace'
});

module.exports = client;