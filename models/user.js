const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
// Includes
const { userJwt } = require("../startup/config.js").jwtKeys();

// Schema
const schema = new mongoose.Schema({
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

// JWT generation method
schema.methods.generateToken = function (expiry) {
    return jwt.sign(
        {
            _id: this._id,
            type: "user"
        }, userJwt, { expiresIn: expiry }
    );
};
module.exports.user = mongoose.model("users", schema);

const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    requirementCount: 2,
};

// Set Validation Schema
const validationSchema = Joi.object().keys({
    userName: Joi.string().required().trim().min(7).max(64),
    password: passwordComplexity(complexityOptions),
    age: Joi.number()
        .min(13)
});
module.exports.validateAdmin = function (admin) {
    return validationSchema.validate(admin);
};

////****************** User Login Validation  ******************
// Set Login Schema
const loginSchema = Joi.object().keys({
    userName: Joi.string().email().required().trim().lowercase().min(6).max(64),
    password: Joi.string().required().min(8).max(30),
});
module.exports.validateUserLogin = function (userRequest) {
    return loginSchema.validate(userRequest);
};
