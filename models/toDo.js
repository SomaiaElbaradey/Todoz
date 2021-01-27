const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

// Schema
const schema = new mongoose.Schema({
    _user: {
        type: mongoose.objectId,
        required: true,
        ref: "users"
    },
    groupTitle: {
        type: String,
        required: "true",
        minlength: 10,
        maxlength: 20,
    },
});

module.exports.toDo = mongoose.model("toDos", schema);

// Set Validation Schema
const validationSchema = Joi.object().keys({
    userName: Joi.string().required().trim().min(7).max(64),
    age: Joi.number()
        .min(13)
});
module.exports.validateToDo = function (toDo) {
    return validationSchema.validate(toDo);
};
