const mongoose = require('mongoose')

module.exports = function (req, res, next) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) next();
    else res.status(404).send({ success: false, message: "not found." });;
}