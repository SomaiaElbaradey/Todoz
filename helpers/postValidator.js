const Joi = require("joi");

// Set Validation Schema
const updatePostSchema = Joi.object().keys({
    _todo: Joi.objectId(),
    title: Joi.string().trim().min(3).max(20),
    body: Joi.string().trim().min(10).max(500),
    tags: Joi.array(),
    status: Joi.string().valid("to-do", "in-progress", "done")
});

module.exports.validateUpdatePost = function (updateRequest) {
    return updatePostSchema.validate(updateRequest);
};