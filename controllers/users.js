const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      return res.status(500).send({ message: "ООшибка сервера" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user === null) {
        return res
          .status(404)
          .send({ message: "Пользователь по данному _id не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Пользователь по данному _id не найден",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: name,
      about: about,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Пользователь с указанным _id не найден",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const updateAvatarById = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Пользователь с указанным _id не найден",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const deleteUserById = (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id).then((user) =>
    res.status(200).send({ data: user })
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  updateAvatarById,
};
