const express = require("express");
const router = express.Router();
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/user") 

//Render Register Form
router.get("/register", controllers.renderRegisterForm)

// Create User
router.post("/register", upload.single('user[image]'), controllers.registerUser)

// Render Login Form
router.get("/login", controllers.renderLoginForm)

//Login User

router.post("/login" , controllers.loginUser)

// Logout User
router.post("/logout" , controllers.logout)


module.exports = router;