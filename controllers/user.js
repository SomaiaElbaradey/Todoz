const { users, validateUser, validateUserLogin, validatePass } = require("../models/user");
const bcrypt = require("bcryptjs");
const { validateUpdateMe } = require('../helpers/updateValidator');
const { sendActivationMail } = require('../helpers/activationMail');
const { sendResetMail } = require('../helpers/resetPassMail');

module.exports.userLogin = async function (req, res) {

    //Checkin if the email exists
    let user = await users.findOne({ mail: req.body.mail });
    if (!user) return res.status(400).send("Invalid mail or password.");

    //Checkin if Password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid mail or password.");

    //check mail verification 
    if (user.isActive != true) res.status(404).send("Please verify your email to login.");

    //Validate the data of user
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const webToken = user.generateToken("96h");
    res.send(webToken);
};

module.exports.userRegister = async function (req, res) {

    //Validate the data of user
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checkin if the email exists
    let user = await users.findOne({ mail: req.body.mail.toLowerCase() });
    if (user) return res.status(409).send("email already exists.");

    //Checkin if the userName exists
    user = await users.findOne({ userName: req.body.userName });
    if (user) return res.status(409).send("username already exists.");

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
    sendActivationMail(new_user.mail, new_user.userName, new_user._id);
    //send the id to the user
    res.header("x-login-token", token).send({ message: "user was registered successfully" });
}

//get users 
module.exports.getAll = async function (req, res) {
    const allUsers = await users.find({}, { _id: 0, firstName: 1 });
    res.send(allUsers);
}

//delete me 
module.exports.deleteMe = async function (req, res) {
    const user = await users.deleteOne({ _id: req.user._id });
    if (!user) return res.status(404).send('the user with given id not existed.');
    res.send(user);
}

//update me 
module.exports.updateMe = async function (req, res) {

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
        if (user) return res.status(409).send("username already exists.");
    }
    if (request.password) {
        const salt = await bcrypt.genSalt(10);
        request.password = await bcrypt.hash(request.password, salt);
    }

    await users.findByIdAndUpdate(req.user._id, request);
    res.status(200);
    res.json({ message: "user was edited successfully", user: request });
}

//verify user via mail
module.exports.verify = async function (req, res) {

    const { id } = req.params;

    //Checkin if the user exists
    let user = await users.findOne({ _id: id });
    if (!user) return res.status(404).send("user doesn't exist.");

    //change state if exist to be active
    const activate = {
        isActive: true
    }
    await users.findByIdAndUpdate(id, activate);

    res.status(200);
    res.sendFile('views/activation.html', { root: __dirname });
}

//reset password
module.exports.resetPassword = async function (req, res) {

    // Validate new password
    const { error, value } = validatePass(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    let newPassword = value.newPassword;

    // update the new password with the reseted password
    const user = await users.findOne({ mail: req.body.mail.toLowerCase() });
    if (!user) return res.status(400).send("Invalid mail.");

    // hash the new passsword
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    await users.findByIdAndUpdate(user._id, { newPassword });

    sendResetMail(user.mail, user._id);
    res.status(200).send("Check your mail to confirm your new password.");
}

//confirm reseted password
module.exports.confirmPassword = async function (req, res) {
    //find the user
    let user = await users.findById(req.params.id);
    if (!user) return res.status(404).send("user doesn't exist.");
    //update the new password to the user
    let value = {
        password: user.newPassword,
    }
    await users.findByIdAndUpdate(user._id, value);

    res.status(200);
    res.sendFile('views/resetedPassword.html', { root: __dirname });
}