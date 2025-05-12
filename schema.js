const Joi = require("joi");

module.exports.productSchema = Joi.object({
    product : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(1).required(),
        stock: Joi.number().min(1).required(),
        category: Joi.string().required(),
    }).required()
})

module.exports.userSchema = Joi.object({
    user : Joi.object({
        username: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("admin" , "seller" , "buyer").required(),
    }).required()
})