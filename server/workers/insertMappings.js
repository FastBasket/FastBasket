var elastic = require('../elastic');

elastic.indices.putMapping(
{
  index: 'elastic_products',
  type: "product",
  body: {
    properties: {
      name: { type: "string", analyzer: "english" },
      description: { type: "string", analyzer: "english" },
      category: { type: "string", analyzer: "english" },
      subCategory: { type: "string", analyzer: "english" },
      price: { type: "string", index: "not_analyzed" },
      dbId: { type: "string", index: "not_analyzed" },
      imageUrl: { type: "string", index: "not_analyzed" },
    }
  }
},
{
  index: 'elastic_products',
  type: "category",
  body: {
    properties: {
      name: { type: "string", analyzer: "english" },
      dbId: { type: "string", index: "not_analyzed" }
    }
  }
});
