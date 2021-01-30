if (mongoose.Types.ObjectId.isValid(userId.id)) {
    User.findById(userId.id, function (err, doc) {
        if (err) { reject(err); }
        else if (doc) { resolve({ success: true, data: doc }); }
        else { reject({ success: false, data: "no data exist for this id" }) }
    });
} else {
    reject({ success: "false", data: "Please provide correct id" });
}

var mongoose = require('mongoose');
mongoose.Types.ObjectId.isValid('your id here');