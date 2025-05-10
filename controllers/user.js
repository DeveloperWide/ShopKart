const User = require("../models/User");

module.exports.renderRegisterForm = async (req, res) => {
    res.render("user/register.ejs")
}

module.exports.registerUser = async (req, res) => {
    let {user} = req.body;
    user.image = {
        filename: req.file.filename,
        url: req.file.path
    }
    let newUser = new User({ ...user });  // password will be auto-hashed
    let savedUser = await newUser.save();
    console.log(savedUser)
    res.redirect("/user/register");
}

module.exports.renderLoginForm = async (req, res) => {
    res.render("user/login.ejs")
}

module.exports.loginUser = async (req, res) => {
    let {password , email} = req.body.user;
    let user = await User.findOne({email: email});
    
    let isValid = await user.validatePassword(password);

    if(isValid){
        res.redirect("/user/register");
    }else{
        res.redirect("/user/login")
    }
    
}