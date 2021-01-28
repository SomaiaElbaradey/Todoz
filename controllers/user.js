const { users, validateUser, validateUserLogin } = require("../models/user");
const bcrypt = require("bcryptjs");


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
    let user = await users.findOne({ mail: req.body.mail });
    if (user) return res.status(409).send("email already exists.")

    //Checkin if the userName exists
    user = await users.findOne({ userName: req.body.userName });
    if (user) return res.status(409).send("userName already exists.")

    //save the user in Database
    var new_user = new users({
        firstName: req.body.firstName,
        mail: req.body.mail,
        password: req.body.password,
        userName: req.body.userName,
        age: req.body.age
    });

    //add salt before the hashed password, then hash it.
    const salt = await bcrypt.genSalt(10);
    new_user.password = await bcrypt.hash(new_user.password, salt);

    await new_user.save()

    const token = new_user.generateToken("96h");
    //send the id to the user
    res.header("x-login-token", token).send({ _id: new_user._id });
}
