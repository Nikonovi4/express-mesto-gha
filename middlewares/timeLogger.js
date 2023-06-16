function timeLoggerMiddleware(req, res, next) {
  req.time = {
    datetime: new Date(Date.now()).toString(),
  };
  next();
}

module.exports = timeLoggerMiddleware;
