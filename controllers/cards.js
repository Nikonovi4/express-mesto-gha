const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      return res.status(500).send({ message: "ООшибка сервера" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  const createAt = req.time.datetime;

  Card.create({ name, link, owner, likes, createAt })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданны некорректныне данные при создании карточки",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Карточка с указанным _id не найдена",
        });
      }
    });
};

const addLikePhoto = (req, res) => {
  const { cardId } = req.params;
  const id = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданны некорректныне данные для постановки лайка",
        });
      }
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const removeLikePhoto = (req, res) => {
  const { cardId } = req.params;
  const id = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: id } }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданны некорректныне данные при снятии лайка",
        });
      }
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikePhoto,
  removeLikePhoto,
};
