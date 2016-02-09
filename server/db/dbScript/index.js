var Promise = require('bluebird');
var fs = require('fs');
var pg = require('pg-then');
var client = pg.Client('postgres://postgres@localhost:5432/fastbasket');
var parse = require('csv-parse');

var rePrice = /\$[0-9]+\.[0-9]+/;
var reRemoveBrand = /\b(?:(?!(DEAN|&|DELUCA))\w).+/; 
var reURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

fs.readFile(__dirname + '/deandeluca.csv', 'utf8', function(err, file) {
  parse(file, function(err, output){
    var lines = output;
    Promise.map(lines, function(line){
      if (line.length>1){ 
	var category = line[2];
	return client.query("INSERT INTO categories (Name, Category) VALUES ($1, null) ON CONFLICT DO NOTHING RETURNING id", [category])
      .then(function(result){
	var categoryId = result.rows[0].id;
	var subcategory = line[3];
	if(subcategory){
	  return client.query("INSERT INTO categories(Name, category) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id, category", [subcategory, categoryId])
	}else{
	  return new Promise.resolve({ rows: [ { category : categoryId , id : null} ] } );
	}
      }) 
    .then(function(result){
      var Name = reRemoveBrand.exec(line[1])[0];
      var Size = line[5];
      var Price = rePrice.exec(line[6])[0].slice(1);
      var Description = line[4];
      var categoryId = result.rows[0].category;
      var subcategoryId = result.rows[0].id;
      var imageURL = reURL.exec(line[9]);
      if(imageURL !== null)
      imageURL = imageURL[0]; 
      else
      imageURL = "http://www.placecage.com/c/500/300";

    var item = [Name, Size, Price, imageURL, Description, categoryId, subcategoryId];

    return client.query("INSERT INTO products(Name, size, Price, ImageUrl, Description, category, subcategory) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING", item)
    }).catch(function(err){
      console.log(err);
    })
      }

    }).then(function(){
      console.log('All categories, subcategories and products have been inserted');
      client.end();
    }).catch(function(err){
      console.log(err)
    });
  })
})
