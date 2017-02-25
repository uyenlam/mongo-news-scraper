// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Require our savedArticles model
var Example = require("./savedArticles.js");

// Initialize Express
var app = express();

// Make public a static dir
app.use(express.static("public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Database configuration with mongoose
mongoose.connect("mongodb://uyens-macbook.local/newsscraperdb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes==========================================================
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/scrape", function(req, res) {
  // Make a request for the news section of washingtonpost
  request("https://www.washingtonpost.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a data-feature-id attribute of homepage/story
    $("[data-feature-id=homepage/story]").each(function(i, element) {
      // Save the text of each link enclosed in the current element
      var scrapetitle = $(this).children("a").text();
      // Save the href value of each link enclosed in the current element
      var scrapelink = $(this).children("a").attri("href");

      var scrapetext = $(this).children(".blurb").text();

      // If this title element had both a title and a link
      if (title && link) {
        var newscrape = new Example({
          title: scrapetitle,
          link: scrapelink,
          text: scrapetext,
        });
        newscrape.save(function(error1,doc) {
          // send an error to the browser
          if (error1) {
            res.send(error1);
          }
          // or send the doc to our browser
          else {
            res.render("index", {article: doc});
          }
        }) //newscrape.save
      } //if (title && link)
    })// data-feature
    }) //request

  // This will send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

// Route to see all saved articles
app.get("/saved", function(req, res) {
  // Find all notes in the note collection with our Note model
  db.savedArticles.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.render("saved", {savedArticle: doc});
    }
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
