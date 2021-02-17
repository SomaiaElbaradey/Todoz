const { todos, validateTodo } = require('./app/models/todo')
const { posts } = require('../models/post')
const { validateUpdateTodo } = require('../helpers/todoValidator')

//add group
module.exports.addTodo = async function (req, res) {
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
module.exports.deleteTodo = async function (req, res) {

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
module.exports.updateTodo = async function (req, res) {
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

//get all todos in one group
module.exports.getPosts = async function (req, res) {
    const myPosts = await posts.find({ _todo: req.params.id, "_user": req.user._id });
    res.send(myPosts);
}

//get all groups for user
module.exports.getGroups = async function (req, res) {
    const allTodos = await todos.find({ "_user": req.user._id });
    res.send(allTodos);
}

//get last month todos
module.exports.lastMonthTodos = async function (req, res) {
    const Today = new Date();
    const year = Today.getFullYear();
    const day = Today.getDate();
    const month = Today.getMonth();
    const lastMonthTodos = await posts.find({
        $and: [
            {
                "createdAt": {
                    "$gte": new Date(year, month - 1, day, 0, 0, 0).toISOString(),
                    "$lte": new Date(year, month, day, 23, 59, 59).toISOString()
                }
            }, {
                "_user": req.user._id
            }
        ]
    }, function (err) {
        if (err)
            console.log(err);
    });
    res.send(lastMonthTodos);
}

//get specific month todos
module.exports.todosAtMonth = async function (req, res) {
    const Today = new Date();
    const year = Today.getFullYear();
    const month = req.params.month - 1;
    const lastMonthTodos = await posts.find({
        $and: [
            {
                "createdAt": {
                    "$gte": new Date(year, month, 0, 0, 0, 0).toISOString(),
                    "$lte": new Date(year, month, 31, 23, 59, 59).toISOString()
                }
            }, {
                "_user": req.user._id
            }
        ]
    }, function (err) {
        if (err)
            console.log(err);
    });
    res.send(lastMonthTodos);
}