//===============================================================
// Dependencies
//===============================================================
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

//===============================================================
// Require our savedArticles model
//===============================================================
var Articles = require("../models/savedArticles.js");
var Notes = require("../models/notes.js");

//===============================================================
// Initialize Express
//===============================================================
var app = express();

// Make public a static dir
app.use(express.static("public"));

//===============================================================
// Mongoose configurations
//===============================================================

// Database configuration with mongoose
mongoose.connect("mongodb://uyens-macbook.local/newsscraperdb");
var db = mongoose.connection;

// Native promises
mongoose.Promise = global.Promise;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//===============================================================
// Routes
//===============================================================
// Route to access the home page
app.get("/", function(req, res) {
  res.render("index");
});

// Route to begin scraping the web
app.get("/scrape", function(req, res) {
  // Make a request for the news section of washingtonpost
  request("https://www.washingtonpost.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    var result = [];
    // For each element with a data-feature-id attribute of homepage/story
    $("[data-feature-id=homepage/story]").each(function(i, element) {
      // Save the text of each link enclosed in the current element
      var scrapetitle = $(this).find(".headline").children("a").text();
      // Save the href value of each link enclosed in the current element
      var scrapelink = $(this).find(".headline").children("a").attr("href").replace(/^http:\/\//i, 'https://');

      var scrapeimage = $(this).find("img").attr("src").replace(/^http:\/\//i, 'https://');;

      var scrapetext = $(this).find(".blurb").text();

      // If this title element had both a title and a link
      if (title && link) {
        // push to the empty result variable
        result.push({
          title: scrapetitle,
          link: scrapelink,
          image: scrapeimage,
          text: scrapetext,
        })
      } //if (title && link)
    })// data-feature
    }) //request

  // Render the index file with the new result variable
  res.json(result);
  res.render("index",{article: result})
});

// Route to save an article to our database
app.post("/post", function(req, res){
  var newscrape = new Articles({
    title: req.body.title,
    link: req.body.link,
    image: req.body.image,
    text: req.body.text,
  });
  newscrape.save(function(error,doc) {
    // send an error to the browser
    if (error) {
      res.send(error);
    }
  }) //newscrape.save

  res.redirect('/scrape');
});

// Route to see all saved articles
app.get("/saved", function(req, res) {
  // Find all articles in the Saved collection which was required on line 12
  Articles.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.render("saved", {savedA: doc});
    }
  });
});

// Route to delete a saved article
app.post('/article/del/:articleId', function(req, res){
  var articleId = req.params.articleId;

  Articles.findByIdAndRemove(articleId, function(err, doc){
    // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.redirect("/saved");
      }
  })
})


// Route to post a new note
app.post("/note/new", function(req, res){
  var articleId = req.body.articleId;
  var note = new Notes(req.body.noteContent);

  note.save(function(error, doc){
    if (error){
      console.log(error);
    }
    else {
      Article.findByIdAndUpdate(articleId,{$push: {"notes": doc._id}},{new: true}, function(err, newdoc){
        if (err){
          res.send(err);
        }
        else {
          res.redirect('/saved');

        }
      })
    }
  });

})

// Route to see all notes for an article using populate 
app.get("/note/all/:articleId", function(req, res){
  var articleId = req.params.articleId;

  Articles.findOne({_id: articleId}).populate("notes").exec(function(error, doc){
    // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.send(doc);
      }
  })
})

// Route to delete a note
app.post('/note/del/:noteId', function(req, res){
  var noteId = req.params.noteId;

  Notes.findOneAndRemove({_id: noteId},function(err, doc){
    // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.redirect('/saved');
      }
  })
})

