const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const timeLoggerMiddleware = require("./middlewares/timeLogger");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const helmet = require('helmet');
const app = express();
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(helmet());
app.use(limiter);

const { PORT = 3000, DB_URL = 'mongodb://0.0.0.0/mestodb'  } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to bd");
  });


app.use(cookieParser());
app.use(bodyParser.json());
app.use(timeLoggerMiddleware);
app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
