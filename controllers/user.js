const { users, validateUser, validateUserLogin } = require("../models/user");
const bcrypt = require("bcryptjs");
const { validateUpdateMe } = require('../helpers/updateValidator')

module.exports.userLogin = async (req, res) => {

    //Checkin if the email exists
    let user = await users.findOne({ mail: req.body.mail });
    if (!user) return res.status(400).send("Invalid mail or password.");

    //Checkin if Password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid mail or password.");

    //Validate the data of user
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const webToken = user.generateToken("96h");
    res.send(webToken);
};

module.exports.userRegister = async (req, res) => {

    //Validate the data of user
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checkin if the email exists
    let user = await users.findOne({ mail: req.body.mail.toLowerCase() });
    if (user) return res.status(409).send("email already exists.");

    //Checkin if the userName exists
    user = await users.findOne({ userName: req.body.userName });
    if (user) return res.status(409).send("userName already exists.");

    //save the user in Database
    let new_user = new users({
        firstName: req.body.firstName,
        mail: req.body.mail,
        password: req.body.password,
        userName: req.body.userName,
        age: req.body.age,
    });

    //add salt before the hashed password, then hash it.
    const salt = await bcrypt.genSalt(10);
    new_user.password = await bcrypt.hash(new_user.password, salt);

    await new_user.save();

    const token = new_user.generateToken("96h");
    //send the id to the user
    res.header("x-login-token", token).send({ _id: new_user._id });
}

//get users 
module.exports.getAll = async (req, res) => {
    const allUsers = await users.find({}, { _id: 0, firstName: 1 });
    res.send(allUsers);
}

//delete me 
module.exports.deleteMe = async (req, res) => {
    const user = await users.deleteOne({ _id: req.user._id });
    if (!user) return res.status(404).send('the user with given id not existed.');
    res.send(user);
}

//update me 
module.exports.updateMe = async (req, res) => {

    // Validate update reuest
    const { error, value } = validateUpdateMe(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    let request = value;

    // Format update request
    if (request.mail) {
        const user = await users.findOne({ mail: req.body.mail.toLowerCase() });
        if (user) return res.status(409).send("email already exists.");
    }
    if (request.userName) {
        const user = await users.findOne({ userName: req.body.userName });
        if (user) return res.status(409).send("userName already exists.");
    }
    if (request.password) {
        const salt = await bcrypt.genSalt(10);
        request.password = await bcrypt.hash(request.password, salt);
    }

    await users.findByIdAndUpdate(req.user._id, request);
    res.status(200);
    res.json({ message: "user was edited successfully", user: request });
}