var elastic = require('../elastic');

elastic.indices.putMapping(
{
  index: 'elastic_products',
  type: "product",
  body: {
    properties: {
      name: { type: "completion", analyzer: "english" },
      description: { type: "completion", analyzer: "english" },
      category: { type: "completion", analyzer: "english" },
      subCategory: { type: "completion", analyzer: "english" },
      price: { type: "string", index: "not_analyzed" },
      dbId: { type: "string", index: "not_analyzed" }
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
