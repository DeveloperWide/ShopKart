const Product = require("../models/Product");

module.exports.isSeller = (req, res, next) => {
    let currUser = req.session.user;
    if(currUser.role !== "seller"){
      req.flash("error" , "You're Not the Seller.");
      return res.redirect("/product")
    }
    return next();
}

module.exports.isLoggedIn = (req, res, next) => {
    let currUser = req.session.user;
    req.session.redirectUrl = req.originalUrl;
    if(!currUser){
        req.flash("error", "You are not logged In");
        return res.redirect("/user/login");
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
        return res.redirect(`/product/${id}`);
    }
    return next();

}