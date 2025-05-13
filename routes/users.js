const express = require("express");
const router = express.Router();
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/user"); 
const { userSchema } = require("../schema");
const { redirectUrl } = require("../middleware/middleware");

let validateUser = (req, res, next) => {
    let {error} = userSchema.validate(req.body)
    if(error){
        req.flash("error" , error.details[0].message);
        return res.redirect("/user/register");
    };
    return next();
}


/* 
/account/profile
/account/orders
/account/wishlist
*/

//Render Register Form
router.get("/register", controllers.renderRegisterForm)

// Create User
router.post("/register", upload.single('user[image]'), validateUser, controllers.registerUser)

// Render Login Form
router.get("/login", controllers.renderLoginForm)

//Login User

router.post("/login" ,redirectUrl, controllers.loginUser)

// Logout User
router.post("/logout" , controllers.logout)


module.exports = router;