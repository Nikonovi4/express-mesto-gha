const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (url) => /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/.test(url),
      message: "Не корректная ссылка"
   }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле "email" должно быть валидным email-адресом',
}
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  }
});

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

module.exports = mongoose.model("user", userSchema);
