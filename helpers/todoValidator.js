const Joi = require("joi");

// Set Validation Schema
const updateTodoSchema = Joi.object().keys({
    groupTitle: Joi.string().min(3).max(20),
});

module.exports.validateUpdateTodo = function (updateRequest) {
    return updateTodoSchema.validate(updateRequest);
};