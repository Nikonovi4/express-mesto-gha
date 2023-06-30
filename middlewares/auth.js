const jwt = require('jsonwebtoken')
const UnauthorizedError = require("../errors/unauthorized-error")

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('ошибка') )
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('ошибка') )
  }
  req.user = payload;
  next();
}

module.exports = auth