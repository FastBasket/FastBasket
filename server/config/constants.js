module.exports = {
  API_URL: process.env.API_URL || "http://127.0.0.1:8000",
  DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres@localhost:5432/fastbasket",
  ELASTIC_URL: process.env.ELASTIC_URL || "127.0.0.1:9200"
};