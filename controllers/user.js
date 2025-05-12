const User = require("../models/User");
const { userSchema } = require("../schema");
const ExpressError = require("../utility/ExpressError")
const asyncWrap = require("../utility/wrapAsync")

module.exports.renderRegisterForm = async (req, res) => {
    res.render("user/register.ejs")
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, name, email, password, role } = req.body.user;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.redirect('/user/register');
        }

        // Prepare new user object
        const newUser = new User({ username, name, email, password, role });

        // If image is uploaded
        if (req.file) {
            newUser.image = {
                filename: req.file.filename,
                url: req.file.path
            };
        }

        let svdUser = await newUser.save();
        req.session.user = svdUser;
        return res.redirect('/user/login');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error while saving user');
    }
};

module.exports.renderLoginForm = async (req, res) => {
    res.render("user/login.ejs")
}

module.exports.loginUser = async (req, res) => {
    let { password, username} = req.body.user;
    let user = await User.findOne({ username: username });
    let isValid = await user.validatePassword(password);
    if (isValid) {
        req.session.user = user;
        req.flash("success" , "User Successfully Saved")
        return res.redirect("/user/register");
    } 
    req.flash("error" , "Error while Saving User")
    console.log(req.session.user)
    return res.redirect("/user/login");
}

module.exports.logout = (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                return res.status(500).send("Logout failed");
            }
            // Redirect to login page or home after logout
            res.redirect("/product");
        });
    } else {
        res.redirect("/user/register"); // Even if user wasn't logged in
    }
}