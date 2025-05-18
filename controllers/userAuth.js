const { User, Buyer, Seller } = require("../models/User");
const ExpressError = require("../utility/ExpressError")
const { asyncWrapper } = require("../utility/wrapAsync")

module.exports.renderRegisterForm = async (req, res) => {
    res.render("user/register.ejs")
}

module.exports.registerUser = asyncWrapper(async (req, res, next) => {
    const { username, name, email, password, role } = req.body.user;
    let userData = { username, name, email, password, role };
    // If image is uploaded
    if (req.file) {
        userData.image = {
            filename: req.file.filename,
            url: req.file.path
        };
    }

    let user;

    if (role === "buyer") {
        user = new Buyer(userData);
    } else if (role === "seller") {
        user = new Seller(userData);
    } else {
        user = new User(userData);
    }
    await user.save();
    req.session.user = user;
    req.flash("success", `${name} registered successfully!`);
    return res.redirect("/api/products");
});

module.exports.renderLoginForm = async (req, res) => {
    res.render("user/login.ejs")
}

module.exports.loginUser = async (req, res) => {
    let { password, username } = req.body.user;
    let user = await User.findOne({ username: username });
    let isValid = await user.validatePassword(password);
    if (isValid) {
        req.session.user = user;
        req.flash("success", "User Successfully Saved")
        let redirectUrl = res.locals.redirectUrl || "/api/products";
        return res.redirect(redirectUrl);
    }
    req.flash("error", "Error while Saving User")

    return res.redirect("/user/login");
}

module.exports.logout = (req, res) => {
    if (req.session.user) {
        req.flash("success", "User successfully logged in")
        req.session.user = null;
        res.redirect("/api/products")
    } else {
        req.flash("error", "No user in the Session")
        res.redirect("/user/login"); // Even if user wasn't logged in
    }
}