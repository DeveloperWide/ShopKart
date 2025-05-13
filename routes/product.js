const express = require("express");
const router = express.Router();
const controllers = require("../controllers/product");
const { isSeller, isLoggedIn, isOwner, } = require("../middleware/middleware");

// Show Products
router.get("/", controllers.allProducts);

// Product Show Page
router.get("/:id", controllers.showProduct)

// Delete Product and Cloudinary Images
router.delete("/:id", isLoggedIn, isSeller, isOwner, controllers.destroyProduct)

module.exports = router;