const router = require("express").Router();

const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  getUserInfo,
} = require("../controllers/users");
const { celebrate, Joi } = require('celebrate');

router.get("/", getUsers);

router.get("/me", getUserInfo)

router.get("/:id", celebrate({
  body: Joi.object().keys({
  id: Joi.string().required().min(22).token(),
}),
}), getUserById);

router.patch("/me", celebrate({
  body: Joi.object().keys({
  name: Joi.string().min(3).max(30),
  about: Joi.string().min(3).max(30),
}),
}), updateUserById);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
  avatar: Joi.string().required().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/),
}),
}), updateAvatarById);


module.exports = router;
