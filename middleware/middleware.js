const Product = require("../models/Product");
const { User } = require("../models/User");
const { productSchema, userSchema } = require("../schema");

module.exports.validateProduct = (req, res, next) => {
    let { error } = productSchema.validate(req.body)
    if (error) {
        req.flash("error", error.details[0].message);
        return;
    }
    return next();
}

module.exports.validateUser = (req, res, next) => {
    let {error} = userSchema.validate(req.body)
    if(error){
        req.flash("error" , error.details[0].message);
        return res.redirect("/user/register");
    };
    return next();
}


module.exports.isSeller = (req, res, next) => {
    let currUser = req.session.user;
    if(currUser.role !== "seller"){
      req.flash("error" , "You're Not the Seller.");
      return res.redirect("/api/products")
    }
    return next();
}

module.exports.isBuyer = (req, res, next) => {
    let currUser = req.session.user;
    if(currUser.role !== "buyer"){
      req.flash("error" , "You're Not the Buyer.");
      return res.redirect("/api/products")
    }
    return next()
}

module.exports.isLoggedIn = (req, res, next) => {
    let currUser = req.session.user;
    req.session.redirectUrl = req.originalUrl;
    if(!currUser){
        req.flash("error", "You are not logged In");
        return res.redirect("/api/auth/login");
    };
    return next();
}

module.exports.redirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        return next();
    }
    return next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let currUser = req.session.user;
    if(String(product.owner._id) !== String(currUser._id)){
        req.flash("error", "You are not the Owner of the Product");
        let redirect = `/product/${id}`;
        return res.redirect(redirect);
    }
    return next();
}

module.exports.isAdmin = async (req, res, next) => {
    let {username} = req.params;
    let user = await User.findOne({username: username});
    let currUser = req.session.user;
    if(String(currUser._id) !== String(user._id)){
        req.flash("error", "You're Not Admin of that Profile");
        return res.redirect(`/admin/${currUser.username}`);
    };
    return next();
}