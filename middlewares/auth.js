const jwt = require("jsonwebtoken");
const config = require('config');

module.exports = (req, res, next) => {
    const token = req.header("x-login-token");
    //if token isn't included in the header
    if (!token) return res.status(401).send("Access Denied. No token Provided");
    try {
        req.user = jwt.verify(token, config.get('jwtKey'));
    } catch (error) {
        console.error(err);
        res.sendStatus(400);
        res.json({ success: false, message: "Invalid token." });
    }
    next();
}
