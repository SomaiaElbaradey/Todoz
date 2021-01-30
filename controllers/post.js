const { posts, validatePost } = require('../models/post')
const { validateUpdatePost } = require('../helpers/postValidator');
const { todos } = require('../models/todo')

//add one todo post
module.exports.addPost = async function (req, res) {
    req.body._user = req.user._id;
    //validation
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //create the todo group
    var new_post = new posts({
        _user: req.user._id,
        _todo: req.body._todo,
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        createdAt: new Date()
    });

    await new_post.save();
    res.send("success creation.")
}

//get all for one user
module.exports.getPosts = async function (req, res) {
    const myPosts = await posts.find({ _user: req.user._id });
    res.send(myPosts);
}

//edit todo
module.exports.updatePost = async function (req, res) {

    //check validation
    const post = await posts.findById({ _id: req.params.id });
    if (req.user._id != post._user) return res.status(405).send("not allowed operation.");

    const { error, value } = validateUpdatePost(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    let request = value;

    //validate todo group
    if (request._todo) {
        const todo = await todos.findOne({ _id: request._todo });
        if (!todo) return res.status(404).send("not existed to-do.");
    }

    request.updatedAt = new Date();

    await posts.findByIdAndUpdate(req.params.id, request);
    res.status(200);
    res.json({ message: "post was edited successfully", post: request });
}

//delete todo
module.exports.deletePost = async function (req, res) {
    //checkin the validation
    const post = await posts.findById({ _id: req.params.id });
    if (!post) return res.status(404).send('failed to find the todo.');
    if (req.user._id != post._user) return res.status(405).send('method not allowed.');
    const deletedPost = await posts.deleteOne({ _id: req.params.id });
    res.send(deletedPost);
}

//Return the todos with specified required filters (defaults are limit 10 skip 0 )
module.exports.todosFilter = async function (req, res) {
    let limit = parseInt(req.query.limit || 10);
    let skip = parseInt(req.query.skip || 0);

    const myPosts = await posts.find({ _user: req.user._id }).limit(limit).skip(skip);
    res.send(myPosts)
}