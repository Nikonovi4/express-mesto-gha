const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');

const {
  login,
  createUser
} = require("../controllers/users")


router.post("/singin",  celebrate({
  body: Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
}),
}), login);

router.post("/singup", celebrate({
    body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30),
  }),
}), createUser);

module.exports = router;
