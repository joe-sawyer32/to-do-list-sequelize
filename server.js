const express = require("express");
const app = express();
const port = process.env.port || 8080;
const path = require("path");

const models = require("./models");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const logger = require("morgan");

// SET VIEW ENGINE
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "/views"));

// MIDDLEWARE
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

app.get("/", (req, res) => {
  models.todos
    .findAll({ order: [["createdAt", "DESC"]] })
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

app.post("/edit", (req, res) => {
  var rowId = req.body.edit;
  models.todos
    .findAll({ order: [["createdAt", "DESC"]] })
    .then(foundItems => {
      console.log("row id: ", rowId);
      models.todos
        .findById(rowId)
        .then(foundEditItem => {
          console.log("all items: ", foundItems);
          console.log("edit item: ", foundEditItem);
          return res.render("editing", {
            todoList: foundItems,
            editTodo: foundEditItem
          });
        })
        .catch(error => {
          res.status(500).send(error);
        });
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.post("/complete", (req, res) => {
  var rowId = req.body.complete;
  models.todos
    .update(
      {
        completed: "t"
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
});

app.post("/update", (req, res) => {
  var rowId = req.body.update;
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
});

app.post("/remove", (req, res) => {
  var rowId = req.body.remove;
  models.todos
    .destroy({ where: { id: rowId } })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
