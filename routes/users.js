const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserInfo);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().length(24).hex(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(3).max(30),
      about: Joi.string().min(3).max(30),
    }),
  }),
  updateUserById,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/),
    }),
  }),
  updateAvatarById,
);

module.exports = router;
