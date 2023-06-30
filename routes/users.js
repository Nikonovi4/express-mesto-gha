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

router.get("/:id", getUserById);

router.patch("/me", celebrate({
  body: Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
}),
}), updateUserById);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
  avatar: Joi.string().min(2).max(30),
}),
}), updateAvatarById);


module.exports = router;
