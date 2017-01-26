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

//POST new/create todo
app.post("/api/todos", function(req, res) {
  var =newTodo = {
    description: req.body.description,
    isComplete: false
  }
  db.collection("todos").insertOne(newTodo, function(err, doc) {
    if (err) {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// endpoint /api/todos/:id

// GET todo by id. not used on front end.
app.get("/api/todos/:id", function(req, res) {
  db.collection("todos").findOne({ _id: new ObjectID(req.paprams.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Sheyat! Can't get todo by _id");
    } else {
      res.status(200).json(doc);
    }
  });
});

//PUT update todo by id
app.put("/api/todos/:id", function(req, res) {
  var updateTodo = req.body;
  delete updateTodo._id;

  db.collection("todos").updateOne({_id: new ObjectID(req.paprams.id)}, updateTodo, function(err, doc) {
    if (err) {
      handleErrors(res, err.message, "The -ish didn't update todo");
    } else {
      res.status(204).end();
    }
  });
});

//DELETE todo by id
app.delete("/api/todos/:id", function(req, res) {
  db.collection('todos').deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Couldn't delete the todo");
    } else {
      res.status(204).end();
    }
  });
});

//API error handler
function handleError(res, reason, message, code) {
  console.log("Gotta API error: " + reason);
  res.status(code || 500).json({"Oops": message});
}
