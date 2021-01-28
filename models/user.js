const mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Schema
const schema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        minlength: 6,
        maxlength: 64,
        match: mailRegExp,
    },
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 15
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 7,
        maxlength: 64,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
    age: {
        type: Number,
        trim: true,
        min: 13,
    },
});

module.exports.users = mongoose.model('User', schema);

function validateUser(user) {
    const schema = Joi.object({
        mail: Joi.string().email().required().trim().lowercase().min(6).max(64),
        userName: Joi.string().required().trim().min(7).max(64),
        firstName: Joi.string().min(3).max(15),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z]).{8,}$')),
        age: Joi.number().min(13),
    });
    
    return schema.validate(user);
}

module.exports.validateUser = validateUser;

// Login Validation  
// Set Login Schema
const loginSchema = Joi.object().keys({
    mail: Joi.string().email().required().trim().lowercase().min(6).max(64),
    password: Joi.string().required().min(8).max(30),
});

module.exports.validateUserLogin = function (userRequest) {
    return loginSchema.validate(userRequest);
};