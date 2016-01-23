var morgan = require('morgan');
var bodyParser = require('body-parser');
// var passport = require('./passport');
var session = require('express-session');
var constants = require('./constants');

module.exports = function (app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
  // app.use(session({
  //   secret: constants.SESSION_KEY,
  //   resave: false,
  //   saveUninitialized: true
  // }));
  // app.use(passport.initialize());
  // app.use(passport.session());
  // app.use(function (err, req, res, next) {
  //   if (err.name === 'UnauthorizedError') {
  //     res.status(401).send('invalid token');
  //   }
  // });
};