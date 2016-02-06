var Promise = require('bluebird');
var neo4j = require('neo4j');
var db = Promise.promisifyAll(new neo4j.GraphDatabase('http://neo4j:fastbasket@127.0.0.1:7474'));
var fs = Promise.promisifyAll(require('fs'));
var recipes = fs.readFileSync(__dirname + '/test.json');
var recipes = JSON.parse(recipes);
var totalRec = recipes.length;

  //Make sure "ulimit -n" returns ~60000 and use flag --max-old-space-size=8192;
Promise.map(recipes, function(recipe){
  recipe.ingredients.forEach(function (ingredient) {
    return db.cypherAsync({
      query: 'MERGE (item:Food {name: {name}}) return item',
           params: {
             name: ingredient,
           }
    }).then(function (results) {
      console.log(results)
    }).catch(function(err){
      if(err){console.log(err)};
    });
  })
}).then(function(){
  console.log('all products have been inserted...');

  return Promise.map(recipes, function(recipe, index){
    return db.cypherAsync({
      query: 'MERGE (item:Order {index: {index}})',
           params: {
             index: index
           }
    })
  })
} , { concurrency: 3 }).then(function(){
  console.log('all Orders have been inserted...');

  recipes.forEach(function(recipe, index){
    (function(index){
      db.cypherAsync({
        query: 'MATCH (a:Order {index: {index}}), (b:Food) WHERE b.name in {ingredients} MERGE (a)-[r:Contains]->(b)',
      params: {
        index: index,
      ingredients: recipes[index].ingredients
      }
      }).catch(function (err) {
        console.log(err);
      })
    })(index);
  }, { concurrency: 3 })
}).catch(function (err) {
  console.log(err);
});

module.exports = db;
