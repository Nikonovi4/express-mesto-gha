const Card = require("../models/card");
const jwt = require("jsonwebtoken");
const NotFoundError = require("../errors/not-found-error");
const ValidationError = require("../errors/validation-error");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next)
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  const createAt = req.time.datetime;

  Card.create({ name, link, owner, likes, createAt })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданны некорректныне данные при создании карточки"
          )
        );
      } else {
        return next(err)
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).then((card) => {
    if (card === null) {
      return next(new NotFoundError("Карта не найдена"));
    } else {
      const token = req.cookies.jwt;
      const userCookie = jwt.verify(token, "some-secret-key");
      if (userCookie._id === card.owner.valueOf()) {
        Card.findByIdAndRemove(card._id).then((card) => {
          res.status(200).send({ card });
        });
      } else {
        return next(
          new ValidationError(
            "Переданны некорректныне данные при удалении карточки"
          )
        );
      }
    }
  })
  .catch((err) => {
    if (err.name === "CastError") {
     return next(new NotFoundError("Карта не найдена"));
    } else {
      return next(err)
  }
  });
};

const addLikePhoto = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, { new: true })
    .then((card) => {
      if (card === null) {
        next(new NotFoundError("Карта не найдена"));
      } else {
        return res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданны некорректные данные карточки"
          )
        );
      }
      if (err.name === "CastError") {
        return next(
          new ValidationError(
            "Передан не существующий _id карточки"
          )
        );
      } else {
        return next(err)
    }
    });
};

const removeLikePhoto = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (card === null) {
        next(new NotFoundError("Карта не найдена"));
      } else {
        return res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданны некорректные данные карточки"
          )
        );
      }
      if (err.name === "CastError") {
        return next(
          new ValidationError(
            "Передан не существующий _id карточки"
          )
        );
      } else {
        return next(err)
    }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikePhoto,
  removeLikePhoto,
};
