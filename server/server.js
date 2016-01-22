var express = require('express');
var constants = require('./config/constants');
var app = express();

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

app.listen((process.env.PORT || 8000), function () {
  console.log('App listening on port', (process.env.PORT || 8000), constants.API_URL);
});

module.exports = app;