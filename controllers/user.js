const User = require("../models/User");

module.exports.renderRegisterForm = async (req, res) => {
    res.render("user/register.ejs")
}

module.exports.registerUser = async (req, res) => {
    try {
        let { user } = req.body;
        user.image = {
            filename: req.file.filename,
            url: req.file.path
        };
        let newUser = new User({ ...user });  // password auto-hashed via pre-save hook
        let savedUser = await newUser.save();

        // Now after user is saved, start session
        req.session.user = savedUser._id;

        console.log(savedUser);
        return res.redirect("/user/register");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error while saving user");
    }
}

module.exports.renderLoginForm = async (req, res) => {
    res.render("user/login.ejs")
}

module.exports.loginUser = async (req, res) => {
    let { password, email } = req.body.user;
    let user = await User.findOne({ email: email });

    let isValid = await user.validatePassword(password);

    if (isValid) {
        req.session.user = user._id;
        res.redirect("/user/register");
    } else {
        res.redirect("/user/login")
    }

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