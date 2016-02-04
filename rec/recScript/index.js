var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:fastbasket@127.0.0.1:7474');
var fs = require('fs');

var recipes = fs.readFileSync('test.json');
var recipes = JSON.parse(recipes);
var totalRec = recipes.length;

//Make sure "ulimit -n" returns ~40000;
recipes.forEach(function (recipe, index) {
  console.log(index / totalRec)
  recipe.ingredients.forEach(function (ingredient) {
    db.cypher({
        query: 'MERGE (item:Food {name: {name}}) return item',
        params: {
            name: ingredient,
        }
    },function (err, results) {
      if(err){console.log(err)};
      console.log(results)
    });
  })
})

setTimeout(function () {
  recipes.forEach(function (recipe, index) {
    db.cypher({
        query: 'MERGE (item:Order {index: {index}}) RETURN item.index',
        params: {
            index: index
        }
    },function(err, index){
        db.cypher({
            query: 'MATCH (a:Order {index: {index}}), (b:Food) WHERE b.name in {ingredients} MERGE (a)-[r:Contains]->(b)',
            params: {
                index: index[0]['item.index'],
                ingredients: recipes[index[0]['item.index']].ingredients
            }
        }, function (err, result) {

        })
    });
  })
}, 15000);


// match (a)-[r:Contains]->(b) where a.index in [5,11,9,8] and not b.name in [
//       "baking powder",
//       "eggs",
//       "all-purpose flour",
//       "raisins",
//       "milk",
//       "white sugar"
//     ] return b, count(r) as count order by count desc

// match (a)-[r:Contains]->(b) where b.name in [
//       "baking powder",
//       "eggs",
//       "all-purpose flour",
//       "raisins",
//       "milk",
//       "white sugar"
//     ] return a, count(r) as count order by count desc limit 4


module.exports = db;
