var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var mongodb = require('mongodb'),
mongoClient = mongodb.MongoClient,
// used in API endpoints
ObjectID = mongodb.ObjectID,
// initialize connection below
db;

app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
// CORS headers to support cross-site HTTP requests
app.use(cors());
// Ionic app build is in the www folder. use ionic serve.
app.use(express.static("www"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_6wtzn9q7:1dtsdt5toe5of3ruulhv7lt6ki@ds131109.mlab.com:31109/heroku_6wtzn9q7";

// initialize database connection and start the server.
mongoClient.connect(MONGODB_URI, function (err, database) {
if (err) {
process.exit(1);
}

// database object from mLab
db = database;

console.log("Database connection ready");

// Initialize the app.
app.listen(app.get('port'), function () {
console.log("you are on port", app.get('port'));
});
});

// API routes below
// endpoint /api/todos

//GET all todos
app.get("/api/todos", function(req, res) {
  db.collection("todos").find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Somethin' isn't right. Getting todos failed.");
    } else {
      res.status(200).json(docs);
    }
  });
});


// endpoint /api/todos/:id

// GET todo by id. not used on front end.
app.get("/api/todos/:id", function(req, res) {
  db.collection("todos").findOne({ _id: new ObjectID(req.paprams.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Can't get todo by _id");
    } else {
      res.status(200).json(doc);
    }
  });
});
