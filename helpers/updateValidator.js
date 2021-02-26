const Joi = require("joi");

// Set Validation Schema for user update
const updateMeSchema = Joi.object().keys({
  firstName: Joi.string().min(3).max(15).trim(),
  mail: Joi.string().email().trim().lowercase().min(6).max(64),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z]).{8,}$'))
    .messages({
      "string.pattern.base": "your password must have at least 1 upper case letter, 1 special character, 1 small case letter"
    }),
  userName: Joi.string().trim().min(7).max(64),
  age: Joi.number().min(13)
});

module.exports.validateUpdateMe = function (updateRequest) {
  return updateMeSchema.validate(updateRequest);
};