const express = require("express");
const router = express.Router();
const controllers = require("../controllers/product");
const { isSeller, isLoggedIn, isOwner, } = require("../middleware/middleware");
const Product = require("../models/Product");

// Show Products
router.get("/", controllers.allProducts);

// Category Show Page
router.get("/categories", async (req, res) => {
    let products = await Product.find({});

    // Extract unique categories
    let categoriesSet = new Set();
    let uniqueCategories = [];

    for (let product of products) {
        if (!categoriesSet.has(product.category)) {
            categoriesSet.add(product.category);
            uniqueCategories.push(product);
        }
    }

    res.render("products/categories.ejs", { products: uniqueCategories })
})

router.get("/categories/:category", async (req, res) => {
    let { category } = req.params;
    let products = await Product.find({ category });
    res.render("products/categoryProducts.ejs" , {products})
})

// Product Show Page
router.get("/:id", controllers.showProduct);



// Delete Product and Cloudinary Images
router.delete("/:id", isLoggedIn, isSeller, isOwner, controllers.destroyProduct)

module.exports = router;