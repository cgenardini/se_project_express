const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

module.exports.validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'the minimum length of the "name" field is 2',
      "string.max": 'the maxium length of the "name" field is 30',
      "string.empty": 'the "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "the URL image field must be filled in",
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().messages({
      "string.empty": "the weather field must be filled in",
    }),
  }),
});

module.exports.validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'the minimum length of the "name" field is 2',
      "string.max": 'the maxium length of the "name" field is 30',
      "string.empty": 'the "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "the URL image field must be filled in",
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    password: Joi.string().required().min(2).messages({
      "string.min": 'the minimum length of the "password" field is 2',
      "string.empty": 'the "password" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'the "email" field must be filled in',
    }),
  }),
});

module.exports.validateUserLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'the "email" field must be filled in',
    }),
    password: Joi.string().required().min(2).messages({
      "string.min": 'the minimum length of the "password" field is 2',
      "string.empty": 'the "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24),
  }),
});
