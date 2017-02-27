// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Load handlebars and designate main.handlebars as the default file
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//Imports the controller.js file
var routes = require('./controllers/controller.js');
app.use('/', routes);


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
