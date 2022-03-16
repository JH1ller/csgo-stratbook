import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().required().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
    .required(),
});

export const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
  completedTutorial: Joi.boolean(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
    .required(),
});

export const teamSchema = Joi.object({
  name: Joi.string().min(3).max(24).required(),
  website: Joi.string().min(6).uri().optional().allow(''),
  serverIp: Joi.string().min(6).max(200).optional().allow(''),
  serverPw: Joi.string().min(1).max(30).optional().allow(''),
});
