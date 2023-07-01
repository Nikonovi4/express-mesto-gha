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
  link: Joi.string().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/),
}),
}), createCard);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().min(22).token(),
}),
}),addLikePhoto);

router.delete("/:cardId/likes", celebrate({
  body: Joi.object().keys({
  cardId: Joi.string().required().min(22).token(),
}),
}),removeLikePhoto);

module.exports = router;
