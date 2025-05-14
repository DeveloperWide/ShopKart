const express = require("express");
const { User } = require("../models/User");
const router = express.Router({});
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const { storage } = require("../cloudConfig");
const { validateUser } = require("../middleware/middleware");
const upload = multer({ storage });

// Get User Profile
router.get("/profile", async (req, res, next) => {
    let currUser = req.session.user;
    let user = await User.findById(currUser._id).populate("products");
    res.render("user/Account/profile.ejs" , {user})
});

//User Profile Update Form

router.get("/profile/edit", async (req, res, next) => {
    let currUser = req.session.user;
    let user = await User.findById(currUser._id);
    res.render("user/Account/edit.ejs" , {user})
}); 

router.post("/profile", upload.single('user[image]'), async (req, res, next) => {
    let {user} = req.body;
    let currUser = req.session.user;
    let currUserInDB = await User.findByIdAndUpdate(currUser._id, {...user}, {new: true});
    if(req.file){
        await cloudinary.uploader.destroy(currUserInDB.image.filename);
        currUserInDB.image = {
            filename: req.file.filename,
            url: req.file.path
        };
        await currUserInDB.save();
    }
    res.redirect(`/api/user/profile`)
})
 
/* 
GET     /api/user/profile      Get user profile
PUT     /api/user/profile      Update profile
POST   /api/user/change-password    Change password
POST /api/user/forgot-password     Request password reset
POST /api/user/reset-password/:token   Reset password using token
*/

router.get("/profile/edit", (req, res, next) => {
    res.send("Profile here")
})


router.get("/profile", (req, res, next) => {
    res.send("Profile here")
})

module.exports = router;