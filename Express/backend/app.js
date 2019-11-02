// Get dependencies
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://mongo:27017/WITventory';

// Connect to mongodb
mongoose.connect(dbHost, { useNewUrlParser: true, useUnifiedTopology: true });

// Get our API routes
const api = require('./api/routes/api');
const items = require('./api/routes/items');
const reservations = require('./api/routes/reservations');
const users = require('./api/routes/users');
//const home = require('/.api/routes/home');

const app = express();

// serve static images
app.use('/images/item_images', express.static('images/item_images'));
app.use(express.static(__dirname + '/public'));



app.get('/home',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

// Parsers for POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 	
// Cross Origin middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  if (req.method === "OPTIONS") {
  	res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  	return res.status(200).json({});
  }
  next();
})

// Set our api routes
app.use('/', api);

app.use('/items', items);

app.use('/reservations', reservations);

app.use('/users', users);

//app.use('/home', home);

module.exports = app;