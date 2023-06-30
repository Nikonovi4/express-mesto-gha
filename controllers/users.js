const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotFoundError = require("../errors/not-found-error");
const ValidationError = require("../errors/validation-error");
//const Forbidden = require("../errors/forbidden");
const ConflictError = require("../errors/conflict-error");
const UnauthorizedError = require("../errors/unauthorized-error")

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("Пользователь не найден"));
      } else {
        return bcrypt.compare(
          password,
          user.password,
          function (err, isPasswordMatch) {
            if (!isPasswordMatch) {
              return next(new UnauthorizedError("Неправильные логин или пароль"));
            }
            const token = jwt.sign({ _id: user._id }, "some-secret-key", {
              expiresIn: "7d",
            });
            res.cookie("jwt", token, {
              maxAge: 604800,
              httpOnly: true,
            });
            return res.status(200).send({ user });
          }
        );
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const token = req.cookies.jwt;
  const userCookie = jwt.verify(token, "some-secret-key");

  User.findById(userCookie._id)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError("Пользователь по данному _id не найден"));
      } else {
        return res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Неправельные данные пользователя"));
      } else {
        return next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError("Пользователь по данному _id не найден"));
      } else {
        return res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Неправельные данные пользователя"));
      } else {
        return next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      email: email,
      password: hash,
      avatar: avatar,
      name: name,
      about: about,
    })
      .then((user) => res.status(201).send({ user }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          return next(
            new ValidationError(
              `Возникли ошибки валидации: ${Object.values(err.errors)
                .map((error) => error.message)
                .join(", ")}`
            )
          );
        }
        if (err.code === 11000) {
          next(new ConflictError("Данная почта уже зарегестрирована"));
        } else {
          return next(err);
        }
      })
  );
};

const updateUserById = (req, res, next) => {
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
        return next(
          new ValidationError(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
      }
      if (err.name === "CastError") {
        return next(new NotFoundError("Пользователь по данному _id не найден"));
      } else {
        return next(err);
      }
    });
};

const updateAvatarById = (req, res, next) => {
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
        return next(
          new ValidationError(
            "Переданы некорректные данные при обновлении аватара."
          )
        );
      }
      if (err.name === "CastError") {
        return next(
          new ValidationError("Пользователь с указанным _id не найден")
        );
      } else {
        return next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
  login,
  getUserInfo,
};
