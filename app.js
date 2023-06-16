const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const timeLoggerMiddleware = require("./middlewares/timeLogger");

const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://0.0.0.0/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to bd");
  });

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64894ec507880949708b433b'
  };

  next();
});

app.use(bodyParser.json());
app.use(timeLoggerMiddleware);
app.use(routes);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
