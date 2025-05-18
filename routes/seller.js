const express = require("express");
const { isLoggedIn, isSeller, isAdmin, isOwner, validateProduct } = require("../middleware/middleware");
const router = express.Router();
const multer = require("multer")
const { storage } = require("../cloudConfig");
const controllers = require("../controllers/seller");
const { User, Seller } = require("../models/User");
const ExpressError = require("../utility/ExpressError");
const upload = multer({ storage });


// Admin dashboard
router.get("/:username", isLoggedIn, isSeller, isAdmin, controllers.adminDashboard)

// Manage products
router.get("/:username/products", isLoggedIn, isSeller, controllers.manageProducts)

//Show New Product Form
router.get("/:username/products/add", isLoggedIn, isSeller, controllers.renderNewProductForm)

// Add new product
router.post("/:username/products", isLoggedIn, isSeller, upload.array("product[images]", 5), validateProduct, controllers.createNewProduct);

// Render Edit product Form
router.get("/:username/products/:id/edit", isLoggedIn, isSeller, isOwner, controllers.renderEditProductForm);

// Edit Product
router.put("/:username/products/:id", isLoggedIn, isSeller, isOwner, upload.array("product[images]", 5), controllers.updateProduct)

//Show categories

/* 
TASKS: 

1.) Add layer of middleware here 
2.) Change user with currUser in these ejs files 

*/


router.get("/:username/categories",  async(req, res) => {
    let {username} = req.params;
    let user = await User.findOne({username: username}).populate("products");
    res.render("seller/categories/categories.ejs", {user});
})

router.get("/:username/categories/:category/products", async (req, res, next) => {
        const { username, category } = req.params;

        const user = await Seller.findOne({ username }).populate("products");

        if (!user) {
            next(new ExpressError("Seller Not Found!", 404))
        }

        const filteredProducts = user.products.filter((product) => {
            return product.category && product.category.toLowerCase() === category.toLowerCase();
        });

        res.render("seller/categories/products" , {products: filteredProducts , user , category})
});



module.exports = router;