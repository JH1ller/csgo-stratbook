const Joi = require('@hapi/joi');

// Register validation
const registerValidation = (formData) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(6).max(20).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
      .required(),
  });
  return schema.validate(formData);
};

// Login validation ? remove
const loginValidation = (formData) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
      .required(),
  });
  return schema.validate(formData);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
