const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  addLikePhoto,
  removeLikePhoto,
} = require("../controllers/cards");

router.get("/", getCards);

router.post("/", celebrate({
  body: Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().min(2).max(30),
}),
}), createCard);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", addLikePhoto);

router.delete("/:cardId/likes", removeLikePhoto);

module.exports = router;
