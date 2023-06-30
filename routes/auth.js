const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');

const {
  login,
  createUser
} = require("../controllers/users")


router.post("/signin",  celebrate({
  body: Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
}),
}), login);

router.post("/signup", celebrate({
    body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp('/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/')),
  }),
}), createUser);

module.exports = router;
