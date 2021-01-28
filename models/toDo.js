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
    groupTitle: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20,
    },
});

module.exports.todos = mongoose.model('Todo', schema);

// Set Validation Schema
const validationSchema = Joi.object().keys({
    groupTitle: Joi.string().required().min(10).max(20),
    _user: Joi.objectId().required(),
});

module.exports.validateTodo = function (todo) {
    return validationSchema.validate(todo);
};