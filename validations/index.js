const Joi       = require('@hapi/joi');
const validator = require("email-validator");
 
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
}

const isEmail = (email) => { return validator.validate(email) }

module.exports.isEmail = isEmail;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;