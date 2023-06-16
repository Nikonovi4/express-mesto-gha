const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const timeLoggerMiddleware = require("./middlewares/timeLogger");
const userLoggerMiddleware = require("./middlewares/userLogger");

const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://0.0.0.0/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to bd");
  });

const app = express();

app.use(bodyParser.json());
app.use(timeLoggerMiddleware);
app.use(userLoggerMiddleware);
app.use(routes);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
