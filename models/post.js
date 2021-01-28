const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Schema
const schema = new mongoose.Schema({
    _user: {
        type: mongoose.ObjectId,
        required: true,
        ref: "users"
    },
    _toDo: {
        type: mongoose.ObjectId,
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
        type: [String],
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
    status: {
        type: String,
        enum: ['to-do, in-progress, done'],
        default: 'to-do'
    }
});

module.exports.posts = mongoose.model('Post', schema);

// Set Validation Schema
const validationSchema = Joi.object().keys({
    _user: Joi.objectId().required(),
    _toDo: Joi.objectId(),
    title: Joi.string().required().trim().min(10).max(20),
    body: Joi.string().required().trim().min(10).max(500),
    tags: Joi.array(),
    status: Joi.string().valid("to-do", "in-progress", "done"),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
});

module.exports.validatePost = function (post) {
    return validationSchema.validate(post);
};