const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const timeLoggerMiddleware = require("./middlewares/timeLogger");
//const userLoggerMiddleware = require("./middlewares/userLogger");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");


const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://0.0.0.0/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to bd");
  });

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(timeLoggerMiddleware);
app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
