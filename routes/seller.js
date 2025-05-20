const express = require("express");
const { isLoggedIn, isSeller, isAdmin, isOwner, validateProduct } = require("../middleware/middleware");
const router = express.Router();
const multer = require("multer")
const { storage } = require("../cloudConfig");
const controllers = require("../controllers/seller");
const { User, Seller } = require("../models/User");
const ExpressError = require("../utility/ExpressError");
const upload = multer({ storage });



/* 
POST      /api/seller/products    Add new product
GET         /api/seller/products         Seller’s own products
PUT        /api/seller/products/:id        Edit product
DELETE    /api/seller/products/:id      Remove product
GET  /api/seller/orders      Orders placed on their products
*/

//  Seller’s own products
router.get("/products", isLoggedIn, isSeller, controllers.sellerProducts)

//Show New Product Form
router.get("/products/add", isLoggedIn, isSeller, controllers.renderNewProductForm)

// Add new product
router.post("/products", isLoggedIn, isSeller, upload.array("product[images]", 5), validateProduct, controllers.createNewProduct);

// Render Edit product Form
router.get("/products/:id/edit", isLoggedIn, isSeller, isOwner, controllers.renderEditProductForm);

// Edit Product
router.put("/products/:id", isLoggedIn, isSeller, isOwner, upload.array("product[images]", 5), controllers.updateProduct)



module.exports = router;