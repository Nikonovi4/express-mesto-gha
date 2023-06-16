const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLikePhoto,
  removeLikePhoto,
} = require("../controllers/cards");

router.get("/", getCards);

router.post("/", createCard);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", addLikePhoto);

router.delete("/:cardId/likes", removeLikePhoto);

module.exports = router;
