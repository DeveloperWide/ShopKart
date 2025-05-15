const { OTP } = require("../utility/helper.js");
const express = require("express");
const { User } = require("../models/User");
const router = express.Router({});
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shopkartproject@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

// GET     /api/user/profile      Get user profile
router.get("/profile", async (req, res, next) => {
    let currUser = req.session.user;
    let user = await User.findById(currUser._id).populate("products");
    res.render("user/Account/profile.ejs", { user })
});

//User Profile Update Form

router.get("/profile/edit", async (req, res, next) => {
    let currUser = req.session.user;
    let user = await User.findById(currUser._id);
    res.render("user/Account/edit.ejs", { user })
});

// PUT     /api/user/profile      Update profile
router.put("/profile", upload.single('user[image]'), async (req, res, next) => {
    let { user } = req.body;
    let currUser = req.session.user;
    let currUserInDB = await User.findByIdAndUpdate(currUser._id, { ...user }, { new: true });
    if (req.file) {
        await cloudinary.uploader.destroy(currUserInDB.image.filename);
        currUserInDB.image = {
            filename: req.file.filename,
            url: req.file.path
        };
        await currUserInDB.save();
    }
    res.redirect(`/api/user/profile`)
})

// Render Change Password Form
router.get("/profile/change-password", async (req, res, next) => {
    let user = await User.findById(req.session.user._id)
    res.render("user/Account/changePassword.ejs", { user })
})

// Change Password Here...
router.post("/profile", async (req, res, next) => {
    let user = await User.findById(req.session.user._id);
    let { oldPassword, newPassword, newPasswordAgain } = req.body.user;
    let isValid = await user.validatePassword(oldPassword);
    if (isValid) {
        if (newPassword === newPasswordAgain) {
            user.password = newPassword;
            await user.save();
            req.flash("success", "Password Changed Successfully");
            return res.redirect("/api/user/profile")
        } else {
            req.flash("error", "New Password and Password Again doesn't match , Try Again");
            return res.redirect("/api/user/profile/change-password")
        }
    } else {
        req.flash("error", "Password is incorrect");
        return res.redirect("/api/user/profile/change-password")
    };
})

//Render the Form TO Check the OTP 
router.get("/profile/forgot-password", async (req, res) => {
    res.render("user/Account/forgetPassword.ejs")
});

//Send a OTP Email to User To Reset Password
router.post("/profile/forgot-password", async (req, res, next) => {
    let user = await User.findOne({ username: req.session.user.username });
    let generatedOTP = OTP();
    req.session.otp = generatedOTP;
    req.session.otpExpires = Date.now() + 5 * 60 * 1000; // valid for 5 mins
    // 2️⃣  Send a message
    transporter
        .sendMail({
            from: "shopKartProject@gmail.com",
            to: `${user.email}`,
            subject: "Reset Your ShopKart Password",
            html: `This is Your OTP use it to reset Your Password <br /> <b>${generatedOTP}</b>`,
        }).then(() => {
            req.flash(`success`, "OTP Successfully Sent on Your Email");
            return res.redirect("/api/user/profile/forgot-password")
        })
        .catch(console.error);
});

//Get Reset Password Form after OTP Verified
router.get("/profile/reset-password", async (req, res) => {
    res.render("user/Account/resetPassword.ejs");
})

// Verify OTP 
router.post("/profile/reset-password", async (req, res) => {
    let user = await User.findById(req.session.user._id)
   if (parseInt(req.body.user.otp) === req.session.otp && Date.now() < req.session.otpExpires){
        req.flash("success", "OTP Verified")
        return res.redirect("/api/user/profile/reset-password")
    } else {
        req.flash("error", "Failed to verify OTP");
        return res.redirect("/api/user/profile");
    }
});

//Change Password / Reset Password / Update Password
router.put("/profile/reset-password", async (req, res) => {
    let { newPassword, newPasswordAgain } = req.body.user;
    let user = await User.findById(req.session.user._id);
    if (newPassword === newPasswordAgain) {
        user.password = newPassword;
        await user.save();
        req.flash("success", "Password Successfully Updated");
        return res.redirect("/api/user/profile")
    } else {
        req.flash("error", "New Password and Password Again doesn't match");
        return res.redirect("/api/user/profile/reset-password");
    }
});


module.exports = router;