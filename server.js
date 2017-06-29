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
    .findAll({ where: { completed: "f" } })
    .then(foundTodos => {
      res.render("index", { todoList: foundTodos });
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

// app.post("/todonelist", (req, res) => {

// });

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
