var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var mongo = require("mongodb");
var router = express.Router();

var url = "mongodb+srv://admin:admin@todos.e54ce.mongodb.net/todos?retryWrites=true&w=majority";

router.get("/todos", function (req, res) {
  MongoClient.connect(url, async (err, db) => {
    if (err) throw err;

    var dbo = db.db("todos");
    found = await dbo.collection("todos").find().toArray();

    if (found !== null) {
      res.json(found);
    } else {
      res.status(404).json({ error: "No data" });
    }
  });
});

router.post("/todo/create", function (req, res) {
  const obj = {
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  };

  MongoClient.connect(url, async (err, db) => {
    if (err) throw err;

    var dbo = db.db("todos");
    found = await dbo.collection("todos").findOne({ title: req.body.title });

    if (found === null) {
      dbo.collection("todos").insertOne(obj, function (err, res) {
        if (err) throw err;

        console.log("document created");
        db.close();
      });
      res.status(200).json({ message: "Item saved to your list" });
    } else {
      res.status(409).json({ error: "Item with same title already exists" });
    }
  });
});

router.delete(`/todo/:user_id`, function (req, res) {
  var id = req.params.user_id;

  MongoClient.connect(url, async (err, db) => {
    if (err) throw err;

    var dbo = db.db("todos");
    found = await dbo.collection("todos").findOne({ _id: mongo.ObjectId(id) });

    if (found !== null) {
      dbo
        .collection("todos")
        .deleteOne({ _id: mongo.ObjectId(id) }, function (err, res) {
          if (err) throw err;

          db.close();
        });
      res.status(200).json({ message: "Item deleted successfully" });
    } else {
      res.status(409).json({ error: "Item could not be deleted" });
    }
  });
});

router.put("/todo/:user_id", function (req, res) {
  var id = req.params.user_id;

  MongoClient.connect(url, async (err, db) => {
    if (err) throw err;

    var dbo = db.db("todos");
    found = await dbo.collection("todos").findOne({ _id: mongo.ObjectId(id) });

    console.log(found);
    if (found !== null) {
      dbo.collection("todos").updateOne(
        { _id: mongo.ObjectId(id) },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
          },
        },
        function (err, res) {
          if (err) throw err;

          db.close();
        }
      );
      res.status(200).json({ message: "Item updated successfully" });
    } else {
      res.status(409).json({ error: "Item could not be updated" });
    }
  });
});

module.exports = router;
