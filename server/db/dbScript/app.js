/*
  This script feeds the postgres database with the products and categories from the text file;
  TODO: refactor into promises
*/
var readline = require('readline');
var fs = require('fs');
var pg = require('pg-then');
var client = pg.Client('postgres://postgres@localhost:5432/fastbasket');

//creates stores, categories and products table if needed
client.query('CREATE TABLE IF NOT EXISTS Stores(Id serial PRIMARY KEY, Name varchar(250))').then(function () {
    return client.query('CREATE TABLE IF NOT EXISTS categories(Id serial PRIMARY KEY, Name Varchar(100), Category INTEGER NULL REFERENCES categories(Id))')
}).then(function () {
    return client.query('CREATE TABLE IF NOT EXISTS products (Id bigserial PRIMARY KEY, Name Varchar(100),Size Varchar(20), SizeUnit Varchar(20), Price decimal(6,2), PriceUnit varchar(100), category INTEGER NOT NULL REFERENCES Categories(Id), subcategory INTEGER NULL REFERENCES Categories(Id) )');
}).then(function () {

    var reName = /.+?(?=\$)/;
    var rePrice = /\$[0-9]+\.[0-9]+/;
    var reSize = /[0-9,.]+(\s+)?(oz|lbs|ct)/;
    var rePricePerItem = /\$.?[0-9]+(\.[0-9]+)?\/?(ea|oz|lb|lbs|diaper|pull-up|wipe|qt|.?ea|Gallon|doz|ltr|bag|sq ft|box|roll)/;
    var reFindPrice = /\$\.?[0-9]+(\.[0-9]+)?/;

    fs.readFile(__dirname + '/itemList.txt', 'utf8', function (err, file) {
        var lines = file.split(/\r?\n/);
        var currentCategory;
        var currentSubcategory;
        var tree = {}

        lines.forEach(function (line) {

            //in the text file - Categories end with '::' and subcategories end with ':'
            var isItCategory = line.slice(-1) === ':' ? true : false;

            if (!isItCategory) {
                var itemName = reName.exec(line)[0].trim();
                var itemPrice = rePrice.exec(line);
                if (itemPrice !== null) {
                    itemPrice = itemPrice[0].slice(1);
                }
                var regItemSize = reSize.exec(line.split('$').slice(1).join(' ')); //sometimes the name of the products has size in it
                var itemSize;
                if (regItemSize !== null) { itemSize = regItemSize[0] } else { itemSize = null };
                var perPrice = rePricePerItem.exec(line);
                var regPricePerItem;

                if (perPrice === null) {
                    regPricePerItem = null;
                } else {
                    regPricePerItem = reFindPrice.exec(perPrice[0]);
                }

                var pricePerItem;
                if (regPricePerItem === null) {
                    pricePerItem = null;
                } else {
                    pricePerItem = regPricePerItem[0].toString();
                }

                if (currentSubcategory !== null) {
                    tree[currentCategory].subcategory[currentSubcategory].push([itemName, itemSize, itemSize, itemPrice, pricePerItem])
                } else {
                    tree[currentCategory].items.push([itemName, itemSize, itemSize, itemPrice, pricePerItem]);
                }

            } else {
                if (line.slice(-2)[0] === ':') { // Subcategories
                    var categoryName = line.slice(0, -2);
                    currentCategory = categoryName
                    currentSubcategory = null;

                    tree[categoryName] = { items: [], subcategory: {} };

                } else {  //Categories
                    var subCategoryName = line.slice(0, -1);
                    currentSubcategory = subCategoryName;
                    tree[currentCategory].subcategory[subCategoryName] =
                }

            }
        })
        for (var key in tree) {
            (function (key) {
                client.query("INSERT INTO categories (Name, Category) VALUES ($1, null) ON CONFLICT DO NOTHING", [key])
                    .then(function () {
                        return client.query("SELECT Id FROM categories WHERE name = ($1)", [key])
                    })
                    .then(function (result) {
                        var id = result.rows[0].id;
                        for (var subkey in tree[key].subcategory) {
                            (function (subkey) {
                                client.query("INSERT INTO categories(Name, category) VALUES ($1, $2) ON CONFLICT DO NOTHING", [subkey, id])
                                    .then(function () {
                                        return client.query("SELECT Id FROM categories WHERE name = ($1)", [subkey])
                                    }).then(function(result){
                                        var subid = result.rows[0].id;
                                        tree[key].subcategory[subkey].forEach(function (item) {
                                            item.push(id, subid);
                                            client.query("INSERT INTO products(Name, size, SizeUnit, Price, PriceUnit, category, subcategory ) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING", item)
                                        })
                                    })
                            })(subkey)
                        }
                    })
            })(key);
        }

    })
}).catch(function (err) {
    console.log(err);
})
    .then(function () {
        //TODO: when refactoring use client.end(); here to end
    })
