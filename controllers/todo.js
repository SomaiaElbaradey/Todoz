const { todos, validateTodo } = require('../models/todo')

module.exports.addRouter = async (req, res) => {

    //validation
    const { error } = validateTodo(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //create the todo group
    var new_group = new todos({
        _user: req.body._user,
        groupTitle: req.body.groupTitle
    });

    await new_group.save();
    res.send("success creation.")
}