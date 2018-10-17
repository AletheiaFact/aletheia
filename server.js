'use strict'

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Candidate = require('./api/model/candidateModel'), //created model loading here
  bodyParser = require('body-parser');
const routes = require('./api/router/routes')
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Aletheia'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app); //register the route


app.listen(port);

console.log('Url http://localhost:' + port);