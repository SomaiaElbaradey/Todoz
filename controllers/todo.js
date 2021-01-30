const { todos, validateTodo } = require('../models/todo')
const { posts } = require('../models/post')
const { validateUpdateTodo } = require('../helpers/todoValidator')

module.exports.addTodo = async (req, res) => {
    req.body._user = req.user._id;
    //validation
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //create the todo group
    let new_group = new todos({
        _user: req.user._id,
        groupTitle: req.body.groupTitle
    });

    await new_group.save();
    res.send("success creation.")
}

//delete one's group
module.exports.deleteTodo = async (req, res) => {

    //validate the required group
    const todo = await todos.findById({ _id: req.params.id });
    if (!todo) return res.status(404).send("failed to find the todo group.");
    if (req.user._id != todo._user) return res.status(405).send("not allowed operation.");

    //delete it and the posts attached to 
    await posts.deleteMany({ _todo: { $eq: req.params.id } });
    const deletedTodo = await todos.deleteOne({ _id: req.params.id });
    res.send(deletedTodo);
}

//edit group
module.exports.updateTodo = async (req, res) => {

    //check validation
    const todo = await todos.findById({ _id: req.params.id });
    if (req.user._id != todo._user) return res.status(405).send("not allowed operation.");

    const { error, value } = validateUpdateTodo(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let request = value;
    await todos.findByIdAndUpdate(req.params.id, request);
    res.status(200);
    res.json({ message: "todo group was edited successfully", todo: request });
}