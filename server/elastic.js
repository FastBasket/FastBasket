var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.search({q: "nilk~"})
  .then(function(body){
    console.log(body.hits.hits);
  });