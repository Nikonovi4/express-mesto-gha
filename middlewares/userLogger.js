function userLoggerMiddleware(req, res, next) {
  req.user = {
    _id: "64894ec507880949708b433b",
  };

  next();
}

module.exports = userLoggerMiddleware;
