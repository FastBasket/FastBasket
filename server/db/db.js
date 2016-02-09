var pgp = require('pg-promise')({});
var constants = require('../config/constants');

var db = pgp(constants.DATABASE_URL);

module.exports = db;