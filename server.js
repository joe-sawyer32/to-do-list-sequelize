const express = require("express");
const app = express();
const port = process.env.port || 8080;

const models = require("./models");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const logger = require("morgan");

// SET VIEW ENGINE
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "./views");

// MIDDLEWARE
app.use("/", express.static("/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

app.get("/", (req, res) => {
  models.todos
    .findAll()
    .then(foundItems => {
      res.render("index", { todoList: foundItems });
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.post("/todolist", (req, res) => {
  var todoData = req.body;
  var newTodo = models.todos.build(todoData);
  newTodo
    .save()
    .then(addedTodo => {
      res.redirect("/");
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.post("/editlist", (req, res) => {
  var rowId;
  if (req.body.edit) {
    rowId = req.body.edit;
    models.todos
      .findById(rowId)
      .then(foundItem => {
        // res.send(foundItem);
        res.render("editing", { editTodo: foundItem });
      })
      .catch(error => {
        res.status(500).send(error);
      });
    // } else if (req.body.complete) {
    //   } else if (req.body.remove) {
  } else if (req.body.update) {
    rowId = req.body.update;
    models.todos
      .update(
        {
          todoItem: req.body.todoItem
        },
        {
          where: {
            id: rowId
          }
        }
      )
      .then(addedTodo => {
        res.redirect("/");
      })
      .catch(error => {
        res.status(500).send(error);
      });
  }
});

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
