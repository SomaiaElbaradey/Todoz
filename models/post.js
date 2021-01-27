const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Schema
const schema = new mongoose.Schema({
    _user: {
        type: mongoose.objectId,
        required: true,
        ref: "users"
    },
    _toDo: {
        type: mongoose.objectId,
        ref: "toDos"
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 20,
    },
    body: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
        trim: true,
    },
    tags: {
        type: String,
        maxlength: 10,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

module.exports.post = mongoose.model("posts", schema);

// Set Validation Schema
const validationSchema = Joi.object().keys({
    title: Joi.string().required().trim().min(7).max(64),
    age: Joi.number()
        .min(13)
});
module.exports.validatePost = function (post) {
    return validationSchema.validate(post);
};