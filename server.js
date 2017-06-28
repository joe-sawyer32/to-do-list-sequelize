const express = require("express");
const app = express();
const port = process.env.port || 8080;

const bodyParser = require("body-parser");
const logger = require("morgan");

// MIDDLEWARE
app.use("/", express.static("/public"));
app.use(bodyParser.json());
app.use(logger("dev"));

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
